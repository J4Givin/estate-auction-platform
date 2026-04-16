"use client";

import Link from "next/link";
import { Gavel, LayoutDashboard, ShoppingBag, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  userName?: string;
  orgName?: string;
}

export function Navbar({ userName, orgName }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Gavel className="h-5 w-5" />
          <span className="font-bold text-lg hidden sm:inline-block">
            Estate Auctions
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>
          <Link href="/shows">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Shows</span>
            </Button>
          </Link>
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          {orgName && (
            <span className="text-sm text-muted-foreground hidden md:inline">
              {orgName}
            </span>
          )}
          {userName ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{userName}</span>
              <Link href="/api/auth/login">
                <Button variant="ghost" size="icon">
                  <LogOut className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Get started</Button>
              </Link>
            </div>
          )}
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
