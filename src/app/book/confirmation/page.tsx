"use client";
import { AppShell, PageHeader, StatCard } from "@/components/layout/AppShell";

import Link from "next/link";
import { CheckCircle2, Calendar, RefreshCw, ArrowRight } from "lucide-react";

export default function BookingConfirmationPage() {
  return (
    <AppShell role="customer" userName="Client" orgName="My Portal">
<main className="flex-1 flex items-center justify-center py-16 px-4">
        <div
          className="w-full max-w-lg bg-white rounded-xl p-8 md:p-10 text-center"
          style={{
            boxShadow:
              "0 4px 24px rgba(15,14,13,0.08), 0 1px 4px rgba(15,14,13,0.04)",
            borderRadius: "12px",
          }}
        >
          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-emerald-muted flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald" />
          </div>

          <h1
            className="text-2xl md:text-3xl text-onyx mb-3"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            Your Consultation is Booked!
          </h1>

          <p className="text-pewter mb-8 leading-relaxed">
            Thank you for reaching out. A member of our team will contact you
            within 24 hours to schedule your free walkthrough and provide a
            detailed recovery estimate.
          </p>

          {/* Summary */}
          <div className="bg-ivory rounded-xl p-5 mb-8 text-left">
            <h3 className="text-xs font-semibold text-pewter uppercase tracking-wide mb-3">
              What Happens Next
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-charcoal">
                <CheckCircle2 className="h-4 w-4 text-emerald shrink-0 mt-0.5" />
                <span>
                  You will receive a confirmation email with your booking details
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm text-charcoal">
                <CheckCircle2 className="h-4 w-4 text-emerald shrink-0 mt-0.5" />
                <span>
                  Our team will call to confirm a walkthrough date and time
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm text-charcoal">
                <CheckCircle2 className="h-4 w-4 text-emerald shrink-0 mt-0.5" />
                <span>
                  After the walkthrough, you will receive a recovery estimate
                  within 48 hours
                </span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                // Simple calendar link generation
                const title = encodeURIComponent(
                  "Estate Liquidity — Consultation"
                );
                const details = encodeURIComponent(
                  "Free estate liquidation consultation with Estate Liquidity"
                );
                const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;
                window.open(url, "_blank");
              }}
              className="inline-flex items-center gap-2 bg-gold-tone text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gold-tone-light transition-colors"
            >
              <Calendar className="h-4 w-4" />
              Add to Calendar
            </button>
            <Link href="/book">
              <button className="inline-flex items-center gap-2 border border-border text-pewter px-6 py-2.5 rounded-lg text-sm font-medium hover:text-charcoal hover:bg-ivory transition-colors">
                <RefreshCw className="h-4 w-4" />
                Reschedule
              </button>
            </Link>
          </div>

          {/* Back to Home */}
          <div className="mt-8 pt-6 border-t border-border/60">
            <Link href="/">
              <span className="inline-flex items-center gap-1 text-sm text-sapphire font-medium hover:text-sapphire-light transition-colors">
                Return to Home
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
