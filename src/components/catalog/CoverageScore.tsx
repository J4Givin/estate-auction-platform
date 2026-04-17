"use client";

import { cn } from "@/lib/utils";

export interface CoverageScoreProps {
  score: number;
  className?: string;
}

export function CoverageScore({ score, className }: CoverageScoreProps) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative h-32 w-32">
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full -rotate-90"
          aria-label={`Coverage score: ${clampedScore}%`}
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="var(--color-platinum)"
            strokeWidth="8"
            opacity="0.3"
          />
          {/* Foreground arc */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="var(--color-sapphire)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-semibold tabular-nums text-sapphire font-[family-name:var(--font-display)]">
            {clampedScore}%
          </span>
        </div>
      </div>
      <span className="text-sm font-medium text-pewter">Coverage Score</span>
    </div>
  );
}
