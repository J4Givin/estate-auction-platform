import { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

// ── GET /api/jobs/[jobId]/ledger — Ledger entries (US-007) ───
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);
    }

    const { jobId } = await params;
    const supabase = createServiceClient();

    // Verify job exists
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("id")
      .eq("id", jobId)
      .single();

    if (jobError || !job) {
      return apiError("NOT_FOUND", "Job not found", 404);
    }

    const entryType = request.nextUrl.searchParams.get("entry_type");
    const limit = Math.min(
      parseInt(request.nextUrl.searchParams.get("limit") || "100", 10),
      500
    );
    const offset = parseInt(
      request.nextUrl.searchParams.get("offset") || "0",
      10
    );

    let query = supabase
      .from("ledger_entries")
      .select("*", { count: "exact" })
      .eq("job_id", jobId);

    if (entryType) query = query.eq("entry_type", entryType);

    const { data: entries, error, count } = await query
      .order("created_at", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to fetch ledger entries", 500);
    }

    // Calculate running totals
    let totalDebitCents = 0;
    let totalCreditCents = 0;
    if (entries) {
      for (const entry of entries) {
        if (entry.debit_cents) totalDebitCents += entry.debit_cents;
        if (entry.credit_cents) totalCreditCents += entry.credit_cents;
      }
    }

    return apiSuccess({
      entries,
      total: count,
      limit,
      offset,
      summary: {
        total_debit_cents: totalDebitCents,
        total_credit_cents: totalCreditCents,
        net_balance_cents: totalCreditCents - totalDebitCents,
      },
    });
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
