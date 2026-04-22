import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-none px-2.5 py-1 text-[9px] font-mono font-bold tracking-[0.12em] uppercase leading-none transition-colors",
  {
    variants: {
      variant: {
        default:     "bg-[#826DEE]/10 text-[#826DEE] border border-[#826DEE]/20",
        sapphire:    "bg-[#826DEE]/10 text-[#826DEE] border border-[#826DEE]/20",
        emerald:     "bg-[#826DEE]/10 text-[#826DEE] border border-[#826DEE]/20",
        amethyst:    "bg-[#826DEE] text-white border border-[#826DEE]",
        ruby:        "bg-[#F94500]/10 text-[#F94500] border border-[#F94500]/20",
        gold:        "bg-[#FFDB15]/50 text-[#0A0A0A] border border-[#FFDB15]/30",
        platinum:    "bg-[#F5F5F5] text-[#6B6B6B] border border-[#E0E0E0]",
        pink:        "bg-[#FF99DC]/30 text-[#0A0A0A] border border-[#FF99DC]/20",
        vermillion:  "bg-[#F94500]/10 text-[#F94500] border border-[#F94500]/20",
        outline:     "border border-[#E0E0E0] text-[#6B6B6B] bg-transparent",
        // Status aliases
        success:     "bg-[#826DEE]/10 text-[#826DEE] border border-[#826DEE]/20",
        warning:     "bg-[#FFDB15]/50 text-[#0A0A0A] border border-[#FFDB15]/30",
        destructive: "bg-[#F94500]/10 text-[#F94500] border border-[#F94500]/20",
        info:        "bg-[#826DEE]/10 text-[#826DEE] border border-[#826DEE]/20",
        draft:       "bg-[#F5F5F5] text-[#6B6B6B] border border-[#E0E0E0]",
        secondary:   "bg-[#F5F5F5] text-[#6B6B6B] border border-[#E0E0E0]",
        violet:      "bg-[#826DEE]/10 text-[#826DEE] border border-[#826DEE]/20",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
