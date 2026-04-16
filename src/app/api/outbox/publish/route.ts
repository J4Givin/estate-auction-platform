import { NextRequest } from "next/server";
import Ably from "ably";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError } from "@/lib/api-utils";

const MAX_RETRY_COUNT = 5;
const BATCH_SIZE = 50;

/**
 * Outbox Worker — Publishes unpublished outbox_events to Ably.
 *
 * Called by cron or edge function. Idempotent: re-publishing the same
 * event to Ably is safe because clients use event_no deduplication.
 *
 * Events with retry_count > MAX_RETRY_COUNT are treated as DLQ (dead letter)
 * and skipped.
 */
export async function POST(request: NextRequest) {
  try {
    // Simple auth: check for internal API key or service role
    const authHeader = request.headers.get("authorization");
    const expectedKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (authHeader !== `Bearer ${expectedKey}`) {
      return apiError("AUTH_FORBIDDEN", "Unauthorized", 403);
    }

    const apiKey = process.env.ABLY_API_KEY;
    if (!apiKey) {
      return apiError("DEPENDENCY_UNAVAILABLE", "Ably not configured", 503);
    }

    const ably = new Ably.Rest({ key: apiKey });
    const supabase = createServiceClient();

    // Fetch unpublished events that haven't exceeded retry limit
    const { data: events, error } = await supabase
      .from("outbox_events")
      .select()
      .eq("published", false)
      .lte("retry_count", MAX_RETRY_COUNT)
      .order("created_at", { ascending: true })
      .limit(BATCH_SIZE);

    if (error) return apiError("INTERNAL_ERROR", "Failed to fetch outbox events", 500);
    if (!events || events.length === 0) {
      return apiSuccess({ published: 0, failed: 0, dlq: 0 });
    }

    let published = 0;
    let failed = 0;
    let dlq = 0;

    for (const event of events) {
      try {
        const channel = ably.channels.get(event.channel);
        await channel.publish(event.event_type, event.payload);

        // Mark as published
        await supabase
          .from("outbox_events")
          .update({
            published: true,
            published_at: new Date().toISOString(),
          })
          .eq("id", event.id);

        published++;
      } catch (pubError) {
        console.error(`Failed to publish outbox event ${event.id}:`, pubError);

        const newRetryCount = event.retry_count + 1;
        if (newRetryCount > MAX_RETRY_COUNT) {
          // DLQ: mark as published to stop retrying (with a flag in metadata)
          await supabase
            .from("outbox_events")
            .update({
              retry_count: newRetryCount,
              // Leave published=false but stop processing via retry_count > MAX
            })
            .eq("id", event.id);
          dlq++;
        } else {
          await supabase
            .from("outbox_events")
            .update({ retry_count: newRetryCount })
            .eq("id", event.id);
          failed++;
        }
      }
    }

    return apiSuccess({ published, failed, dlq, total: events.length });
  } catch {
    return apiError("INTERNAL_ERROR", "Outbox publish error", 500);
  }
}
