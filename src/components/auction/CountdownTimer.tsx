"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  closesAt: string | null;
  softCloseExtended?: boolean;
  className?: string;
}

export function CountdownTimer({ closesAt, softCloseExtended, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    if (!closesAt) {
      setTimeLeft("--:--");
      return;
    }

    const update = () => {
      const now = Date.now();
      const end = new Date(closesAt).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("00:00");
        setIsUrgent(true);
        return;
      }

      setIsUrgent(diff <= 30000); // Last 30 seconds

      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      if (hours > 0) {
        setTimeLeft(`${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
      } else {
        setTimeLeft(`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [closesAt]);

  return (
    <div
      className={cn(
        "font-mono text-2xl font-bold tabular-nums",
        isUrgent && "text-red-500 animate-pulse",
        softCloseExtended && "text-orange-500",
        className
      )}
    >
      {timeLeft}
      {softCloseExtended && (
        <span className="ml-2 text-xs font-normal text-orange-400">Extended</span>
      )}
    </div>
  );
}
