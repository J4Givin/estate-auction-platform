import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

/**
 * Stripe Webhook Handler (idempotent)
 *
 * Handles:
 * - payment_intent.succeeded — mark order paid, transition lot to paid
 * - payment_intent.payment_failed — mark order canceled
 * - charge.dispute.created — flag order for review
 *
 * Uses raw body for signature verification.
 * All handlers are idempotent: check order status before updating.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    let event: Stripe.Event;
    try {
      event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
    } catch {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const supabase = createServiceClient();

    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const orderId = pi.metadata?.order_id;
        const lotId = pi.metadata?.lot_id;

        if (!orderId) break;

        // Idempotency: only update if order is still pending_payment
        const { data: order } = await supabase
          .from("orders")
          .select()
          .eq("id", orderId)
          .single();

        if (!order || order.status !== "pending_payment") break;

        await supabase
          .from("orders")
          .update({
            status: "paid",
            stripe_charge_id: pi.latest_charge as string,
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId);

        // Transition lot to paid
        if (lotId) {
          await supabase
            .from("lots")
            .update({ status: "paid", updated_at: new Date().toISOString() })
            .eq("id", lotId)
            .eq("status", "sold_pending_payment");

          // Outbox event for payment confirmation
          await supabase.from("outbox_events").insert({
            lot_id: lotId,
            channel: `lot:${lotId}:events`,
            event_type: "payment_confirmed",
            payload: {
              lotId,
              orderId,
              paymentIntentId: pi.id,
              amountCents: pi.amount,
            },
          });
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const orderId = pi.metadata?.order_id;
        const lotId = pi.metadata?.lot_id;

        if (!orderId) break;

        const { data: order } = await supabase
          .from("orders")
          .select()
          .eq("id", orderId)
          .single();

        if (!order || order.status !== "pending_payment") break;

        await supabase
          .from("orders")
          .update({ status: "canceled", updated_at: new Date().toISOString() })
          .eq("id", orderId);

        if (lotId) {
          await supabase.from("outbox_events").insert({
            lot_id: lotId,
            channel: `lot:${lotId}:events`,
            event_type: "payment_failed",
            payload: {
              lotId,
              orderId,
              paymentIntentId: pi.id,
              failureMessage: pi.last_payment_error?.message || "Payment failed",
            },
          });
        }
        break;
      }

      case "charge.dispute.created": {
        const dispute = event.data.object as Stripe.Dispute;
        const charge = dispute.charge as string;

        // Find order by stripe_charge_id
        const { data: order } = await supabase
          .from("orders")
          .select()
          .eq("stripe_charge_id", charge)
          .single();

        if (!order) break;

        // Log dispute event
        await supabase.from("outbox_events").insert({
          lot_id: order.lot_id,
          channel: `lot:${order.lot_id}:events`,
          event_type: "dispute_created",
          payload: {
            lotId: order.lot_id,
            orderId: order.id,
            disputeId: dispute.id,
            reason: dispute.reason,
            amountCents: dispute.amount,
          },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }
}
