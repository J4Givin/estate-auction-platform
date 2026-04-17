"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/partners", label: "Partners" },
  { href: "/auth/login", label: "Sign In" },
  { href: "/auth/register", label: "Create Account" },
];

export function MobileNavToggle() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden tap-target rounded-lg hover:bg-black/5 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-sapphire" />
      </button>

      {/* Full-screen mobile menu panel */}
      {open && (
        <div className="fixed inset-0 bg-[#111827] z-[60] flex flex-col p-8 md:hidden animate-fade-in">
          <div className="flex items-center justify-between mb-12">
            <span
              className="text-xl font-semibold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Estate Liquidity
            </span>
            <button
              onClick={() => setOpen(false)}
              className="tap-target rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-white/60" />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-lg font-medium text-white/80 hover:text-white py-3 px-4 rounded-lg hover:bg-white/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-8">
            <Link href="/book" onClick={() => setOpen(false)}>
              <Button size="xl" className="w-full bg-gold-j-light text-white hover:bg-gold-j font-semibold">
                Book Free Walkthrough
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
