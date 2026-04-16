"use client";

import { useState, useEffect, useCallback } from "react";
import type { Org } from "@/types";

interface UseOrgOptions {
  userId?: string;
}

export function useOrg({ userId }: UseOrgOptions) {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [currentOrg, setCurrentOrg] = useState<Org | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrgs = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await fetch("/api/orgs", {
        headers: { "x-user-id": userId },
      });
      if (res.ok) {
        const json = await res.json();
        const fetchedOrgs = json.data as Org[];
        setOrgs(fetchedOrgs);
        if (fetchedOrgs.length > 0 && !currentOrg) {
          setCurrentOrg(fetchedOrgs[0]);
        }
        setError(null);
      } else {
        setError("Failed to fetch orgs");
      }
    } catch {
      setError("Failed to fetch orgs");
    } finally {
      setLoading(false);
    }
  }, [userId, currentOrg]);

  useEffect(() => {
    fetchOrgs();
  }, [fetchOrgs]);

  const switchOrg = useCallback(
    (orgId: string) => {
      const org = orgs.find((o) => o.id === orgId);
      if (org) setCurrentOrg(org);
    },
    [orgs]
  );

  return { orgs, currentOrg, switchOrg, loading, error, refresh: fetchOrgs };
}
