"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import * as Ably from "ably";
import type { AuctionEvent, Bid, Lot } from "@/types";

interface UseAuctionOptions {
  lotId: string;
  userId?: string;
  pollIntervalMs?: number;
}

interface UseAuctionReturn {
  lot: Lot | null;
  bids: Bid[];
  events: AuctionEvent[];
  lastEventNo: number;
  connectionState: "connected" | "polling" | "disconnected";
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Client reducer for auction realtime events.
 *
 * Implements the TRD spec's client reducer rules:
 * - Keep lastEventNo per lot
 * - On realtime event:
 *   - if msg.eventNo <= lastEventNo: ignore (duplicate/out-of-order)
 *   - if msg.eventNo == lastEventNo + 1: apply and increment
 *   - if msg.eventNo > lastEventNo + 1: GAP → call resync endpoint
 * - Falls back to polling if Ably unavailable
 */
export function useAuction({
  lotId,
  userId,
  pollIntervalMs = 3000,
}: UseAuctionOptions): UseAuctionReturn {
  const [lot, setLot] = useState<Lot | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [events, setEvents] = useState<AuctionEvent[]>([]);
  const [lastEventNo, setLastEventNo] = useState(0);
  const [connectionState, setConnectionState] = useState<
    "connected" | "polling" | "disconnected"
  >("disconnected");
  const [error, setError] = useState<string | null>(null);

  const ablyClientRef = useRef<Ably.Realtime | null>(null);
  const channelRef = useRef<Ably.RealtimeChannel | null>(null);
  const lastEventNoRef = useRef(0);
  const isResyncingRef = useRef(false);

  // Fetch lot data
  const fetchLot = useCallback(async () => {
    try {
      const res = await fetch(`/api/lots/${lotId}`, {
        headers: userId ? { "x-user-id": userId } : {},
      });
      if (res.ok) {
        const json = await res.json();
        setLot(json.data);
        return json.data as Lot;
      }
    } catch (err) {
      console.error("Failed to fetch lot:", err);
    }
    return null;
  }, [lotId, userId]);

  // Fetch bids
  const fetchBids = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/lots/${lotId}/events?afterEventNo=0`,
        { headers: userId ? { "x-user-id": userId } : {} }
      );
      if (res.ok) {
        const json = await res.json();
        const allEvents = json.data as AuctionEvent[];
        setEvents(allEvents);

        if (allEvents.length > 0) {
          const maxNo = Math.max(...allEvents.map((e) => e.event_no));
          lastEventNoRef.current = maxNo;
          setLastEventNo(maxNo);
        }
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  }, [lotId, userId]);

  // Gap resync
  const resync = useCallback(async () => {
    if (isResyncingRef.current) return;
    isResyncingRef.current = true;

    try {
      const res = await fetch(
        `/api/lots/${lotId}/events?afterEventNo=${lastEventNoRef.current}`,
        { headers: userId ? { "x-user-id": userId } : {} }
      );
      if (res.ok) {
        const json = await res.json();
        const newEvents = json.data as AuctionEvent[];

        if (newEvents.length > 0) {
          setEvents((prev) => {
            const existing = new Set(prev.map((e) => e.id));
            const deduped = newEvents.filter((e) => !existing.has(e.id));
            return [...prev, ...deduped].sort(
              (a, b) => a.event_no - b.event_no
            );
          });

          const maxNo = Math.max(...newEvents.map((e) => e.event_no));
          lastEventNoRef.current = maxNo;
          setLastEventNo(maxNo);
        }
      }

      // Refresh lot state after resync
      await fetchLot();
    } catch (err) {
      console.error("Resync failed:", err);
    } finally {
      isResyncingRef.current = false;
    }
  }, [lotId, userId, fetchLot]);

  // Handle incoming realtime event
  const handleRealtimeEvent = useCallback(
    (message: Ably.Message) => {
      const payload = message.data;
      const eventNo = payload?.eventNo as number | undefined;

      if (eventNo === undefined) return;

      const currentNo = lastEventNoRef.current;

      if (eventNo <= currentNo) {
        // Duplicate or out-of-order — ignore
        return;
      }

      if (eventNo === currentNo + 1) {
        // Sequential — apply
        lastEventNoRef.current = eventNo;
        setLastEventNo(eventNo);

        setEvents((prev) => [
          ...prev,
          {
            id: payload.id || crypto.randomUUID(),
            lot_id: lotId,
            org_id: payload.orgId || null,
            event_no: eventNo,
            event_type: message.name || payload.eventType || "",
            actor_user_id: payload.actorUserId || null,
            payload,
            created_at: new Date().toISOString(),
          },
        ]);

        // Update lot state based on event type
        if (
          message.name === "bid_placed" ||
          message.name === "soft_close_extended"
        ) {
          fetchLot();
        }
      } else {
        // Gap detected — resync
        resync();
      }
    },
    [lotId, fetchLot, resync]
  );

  // Refresh all data
  const refresh = useCallback(async () => {
    await Promise.all([fetchLot(), fetchBids()]);
  }, [fetchLot, fetchBids]);

  // Initialize Ably connection
  useEffect(() => {
    let pollInterval: ReturnType<typeof setInterval> | null = null;

    const initAbly = async () => {
      try {
        // Get token from API
        const tokenRes = await fetch("/api/ably/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(userId ? { "x-user-id": userId } : {}),
          },
          body: JSON.stringify({ lotId }),
        });

        if (!tokenRes.ok) throw new Error("Failed to get Ably token");

        const { data: tokenRequest } = await tokenRes.json();

        const client = new Ably.Realtime({
          authCallback: (_, callback) => {
            callback(null, tokenRequest);
          },
        });

        ablyClientRef.current = client;

        client.connection.on("connected", () => {
          setConnectionState("connected");
          if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
          }
        });

        client.connection.on("disconnected", () => {
          setConnectionState("polling");
          startPolling();
        });

        client.connection.on("failed", () => {
          setConnectionState("polling");
          startPolling();
        });

        const channel = client.channels.get(`lot:${lotId}:events`);
        channelRef.current = channel;
        channel.subscribe(handleRealtimeEvent);
      } catch {
        // Ably unavailable — fall back to polling
        setConnectionState("polling");
        startPolling();
      }
    };

    const startPolling = () => {
      if (pollInterval) return;
      pollInterval = setInterval(async () => {
        await resync();
        await fetchLot();
      }, pollIntervalMs);
    };

    // Initial data fetch
    refresh();

    // Try to connect to Ably
    initAbly();

    return () => {
      if (pollInterval) clearInterval(pollInterval);
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
      if (ablyClientRef.current) {
        ablyClientRef.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lotId, userId]);

  return {
    lot,
    bids,
    events,
    lastEventNo,
    connectionState,
    error,
    refresh,
  };
}
