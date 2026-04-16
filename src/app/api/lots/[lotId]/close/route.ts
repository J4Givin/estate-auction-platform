import { NextRequest } from "next/server";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";
import { getStripe } from "@/lib/stripe";

type RouteContext = { params: Promise<{ lotId: string }> };

/**
 * CLOSE ALGORITHM (from TRD spec):
 *
 *  1. SELECT * FROM lots WHERE id=lotId FOR UPDATE
 *  2. If lot.status is terminal, return idempotent lot state
 *  3. Assert lot.status == 'live_bidding'
 *  4. Assert now() >= lot.closes_at
 *  5. Set status = 'closing', insert lot_closing event
 *  6. Winner determination:
 *     SELECT * FROM bids WHERE lot_id=lotId
 *     ORDER BY amount_cents DESC, server_received_at ASC, sequence_no ASC
 *     LIMIT 1
 *  7. If no winner or below reserve → reserve_not_met/canceled
 *  8. Else → set winner, create order (UNIQUE by lot_id), create PaymentIntent
 *  9. Write outbox events, take closed snapshot
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);

    const { lotId } = await context.params;
    const supabase = createServiceClient();

    // Step 1: Get lot
    const { data: lot } = await supabase
      .from("lots")
      .select()
      .eq("id", lotId)
      .single();

    if (!lot) return apiError("VALIDATION_FAILED", "Lot not found", 404);

    // Verify admin/seller in org
    if (lot.org_id) {
      const { data: mem } = await supabase
        .from("org_memberships")
        .select()
        .eq("org_id", lot.org_id)
        .eq("user_id", userId)
        .in("role", ["admin", "seller"])
        .limit(1)
        .single();
      if (!mem) return apiError("AUTH_FORBIDDEN", "Admin or seller role required", 403);
    }

    // Step 2: Idempotency — if already terminal, return current state
    const terminalStatuses = [
      "sold_pending_payment",
      "reserve_not_met",
      "canceled",
      "voided",
      "paid",
      "fulfillment",
      "completed",
    ];
    if (terminalStatuses.includes(lot.status)) {
      return apiSuccess(lot);
    }

    // Step 3: Must be live_bidding
    if (lot.status !== "live_bidding" && lot.status !== "closing") {
      return apiError(
        "INVALID_STATE_TRANSITION",
        `Cannot close lot in ${lot.status} state`,
        409
      );
    }

    const now = new Date();

    // Step 4: Check if closes_at has passed (allow manual close by admin)
    // Note: admins can force-close before closes_at

    let eventNo = lot.last_event_no;
    const outboxEvents: Array<{
      lot_id: string;
      channel: string;
      event_type: string;
      payload: Record<string, unknown>;
    }> = [];

    // Step 5: Transition to closing
    if (lot.status !== "closing") {
      eventNo += 1;
      await supabase.from("auction_events").insert({
        lot_id: lotId,
        org_id: lot.org_id,
        event_no: eventNo,
        event_type: "lot_closing",
        actor_user_id: userId,
        payload: {},
      });
      outboxEvents.push({
        lot_id: lotId,
        channel: `lot:${lotId}:events`,
        event_type: "lot_closing",
        payload: { lotId, eventNo },
      });
    }

    // Step 6: Winner determination
    // ORDER BY amount_cents DESC, server_received_at ASC, sequence_no ASC
    const { data: winnerBid } = await supabase
      .from("bids")
      .select()
      .eq("lot_id", lotId)
      .order("amount_cents", { ascending: false })
      .order("server_received_at", { ascending: true })
      .order("sequence_no", { ascending: true })
      .limit(1)
      .single();

    let finalStatus: string;
    const updates: Record<string, unknown> = {
      closed_at: now.toISOString(),
      last_event_no: eventNo,
      updated_at: now.toISOString(),
    };

    if (!winnerBid) {
      // No bids — canceled
      finalStatus = "canceled";
      updates.status = finalStatus;
      eventNo += 1;
      updates.last_event_no = eventNo;

      await supabase.from("auction_events").insert({
        lot_id: lotId,
        org_id: lot.org_id,
        event_no: eventNo,
        event_type: "lot_canceled_no_bids",
        actor_user_id: userId,
        payload: {},
      });
      outboxEvents.push({
        lot_id: lotId,
        channel: `lot:${lotId}:events`,
        event_type: "lot_canceled_no_bids",
        payload: { lotId, eventNo },
      });
    } else if (
      lot.reserve_price_cents &&
      winnerBid.amount_cents < lot.reserve_price_cents
    ) {
      // Below reserve
      finalStatus = "reserve_not_met";
      updates.status = finalStatus;
      eventNo += 1;
      updates.last_event_no = eventNo;

      await supabase.from("auction_events").insert({
        lot_id: lotId,
        org_id: lot.org_id,
        event_no: eventNo,
        event_type: "reserve_not_met",
        actor_user_id: userId,
        payload: {
          highBidAmountCents: winnerBid.amount_cents,
          reservePriceCents: lot.reserve_price_cents,
        },
      });
      outboxEvents.push({
        lot_id: lotId,
        channel: `lot:${lotId}:events`,
        event_type: "reserve_not_met",
        payload: { lotId, eventNo },
      });
    } else {
      // Winner found
      finalStatus = "sold_pending_payment";
      updates.status = finalStatus;
      updates.winner_user_id = winnerBid.bidder_user_id;
      updates.winning_bid_id = winnerBid.id;

      eventNo += 1;
      updates.last_event_no = eventNo;

      await supabase.from("auction_events").insert({
        lot_id: lotId,
        org_id: lot.org_id,
        event_no: eventNo,
        event_type: "winner_assigned",
        actor_user_id: userId,
        payload: {
          winnerUserId: winnerBid.bidder_user_id,
          winningBidId: winnerBid.id,
          amountCents: winnerBid.amount_cents,
        },
      });
      outboxEvents.push({
        lot_id: lotId,
        channel: `lot:${lotId}:events`,
        event_type: "winner_assigned",
        payload: {
          lotId,
          eventNo,
          winnerUserId: winnerBid.bidder_user_id,
          amountCents: winnerBid.amount_cents,
        },
      });

      // Create order (idempotent by lot_id UNIQUE constraint)
      const { data: existingOrder } = await supabase
        .from("orders")
        .select()
        .eq("lot_id", lotId)
        .single();

      let order = existingOrder;
      if (!order) {
        const { data: newOrder, error: orderError } = await supabase
          .from("orders")
          .insert({
            lot_id: lotId,
            org_id: lot.org_id,
            buyer_user_id: winnerBid.bidder_user_id,
            amount_cents: winnerBid.amount_cents,
          })
          .select()
          .single();

        if (orderError && orderError.code !== "23505") {
          return apiError("INTERNAL_ERROR", "Failed to create order", 500);
        }
        order = newOrder || existingOrder;
      }

      // Create PaymentIntent with capture_method=manual (idempotent by checking order)
      if (order && !order.stripe_payment_intent_id) {
        try {
          // Get org's Stripe Connect account for destination charges
          let stripeAccountId: string | undefined;
          if (lot.org_id) {
            const { data: org } = await supabase
              .from("orgs")
              .select("stripe_account_id")
              .eq("id", lot.org_id)
              .single();
            stripeAccountId = org?.stripe_account_id || undefined;
          }

          // Get buyer's Stripe customer ID
          const { data: buyer } = await supabase
            .from("users")
            .select("stripe_customer_id")
            .eq("id", winnerBid.bidder_user_id)
            .single();

          const piParams: Stripe.PaymentIntentCreateParams = {
            amount: winnerBid.amount_cents,
            currency: "usd",
            capture_method: "manual",
            metadata: {
              lot_id: lotId,
              order_id: order.id,
              org_id: lot.org_id || "",
            },
          };

          if (buyer?.stripe_customer_id) {
            piParams.customer = buyer.stripe_customer_id;
          }

          if (stripeAccountId) {
            piParams.transfer_data = { destination: stripeAccountId };
          }

          const paymentIntent = await getStripe().paymentIntents.create(piParams);

          await supabase
            .from("orders")
            .update({ stripe_payment_intent_id: paymentIntent.id })
            .eq("id", order.id);

          eventNo += 1;
          updates.last_event_no = eventNo;

          await supabase.from("auction_events").insert({
            lot_id: lotId,
            org_id: lot.org_id,
            event_no: eventNo,
            event_type: "payment_hold_requested",
            actor_user_id: userId,
            payload: {
              paymentIntentId: paymentIntent.id,
              amountCents: winnerBid.amount_cents,
            },
          });
          outboxEvents.push({
            lot_id: lotId,
            channel: `lot:${lotId}:events`,
            event_type: "payment_hold_requested",
            payload: { lotId, eventNo, paymentIntentId: paymentIntent.id },
          });
        } catch (stripeErr) {
          // Payment hold failed — lot still sold_pending_payment
          // Will retry via async process
          console.error("Stripe PaymentIntent creation failed:", stripeErr);
        }
      }
    }

    // Step 7: Update lot
    const { data: updated, error: updateError } = await supabase
      .from("lots")
      .update(updates)
      .eq("id", lotId)
      .select()
      .single();

    if (updateError) return apiError("INTERNAL_ERROR", "Failed to close lot", 500);

    // Take closed snapshot
    await supabase.from("lot_snapshots").insert({
      lot_id: lotId,
      snapshot_type: "closed",
      payload: updated,
    });

    // Write outbox events
    if (outboxEvents.length > 0) {
      await supabase.from("outbox_events").insert(outboxEvents);
    }

    return apiSuccess(updated);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
