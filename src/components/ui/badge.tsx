import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium leading-none transition-colors",
  {
    variants: {
      variant: {
        default:    "bg-sapphire/10 text-sapphire border border-sapphire/20",
        sapphire:   "bg-sapphire/10 text-sapphire border border-sapphire/20",
        emerald:    "bg-emerald-j-muted text-emerald-j border border-emerald-j/20",
        amethyst:   "bg-amethyst-muted text-amethyst border border-amethyst/20",
        ruby:       "bg-ruby-muted text-ruby border border-ruby/20",
        gold:       "bg-gold-j-muted text-gold-j border border-gold-j/20",
        platinum:   "bg-platinum/30 text-pewter border border-platinum/50",
        outline:    "border border-border text-muted-foreground bg-transparent",
        // Status-specific
        success:    "bg-emerald-j-muted text-emerald-j border border-emerald-j/20",
        warning:    "bg-gold-j-muted text-gold-j border border-gold-j/20",
        destructive:"bg-ruby-muted text-ruby border border-ruby/20",
        info:       "bg-sapphire-muted text-sapphire border border-sapphire/20",
        draft:      "bg-platinum/30 text-pewter border border-platinum/50",
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
