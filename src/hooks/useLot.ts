"use client";

import { useState, useEffect, useCallback } from "react";
import type { Lot } from "@/types";

interface UseLotOptions {
  lotId: string;
  userId?: string;
}

export function useLot({ lotId, userId }: UseLotOptions) {
  const [lot, setLot] = useState<Lot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLot = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/lots/${lotId}`, {
        headers: userId ? { "x-user-id": userId } : {},
      });
      if (res.ok) {
        const json = await res.json();
        setLot(json.data);
        setError(null);
      } else {
        const json = await res.json();
        setError(json.message || "Failed to fetch lot");
      }
    } catch {
      setError("Failed to fetch lot");
    } finally {
      setLoading(false);
    }
  }, [lotId, userId]);

  useEffect(() => {
    fetchLot();
  }, [fetchLot]);

  return { lot, loading, error, refresh: fetchLot };
}
