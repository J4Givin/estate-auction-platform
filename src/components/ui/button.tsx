import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-medium transition-all duration-150 select-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-40",
    "active:scale-[0.98]",
  ].join(" "),
  {
    variants: {
      variant: {
        // Solid sapphire — primary action
        primary:
          "bg-sapphire text-white shadow-sm hover:bg-sapphire-light rounded-lg text-sm",
        // Solid gold — premium CTA
        gold:
          "bg-gold-j-light text-white shadow-sm hover:bg-gold-j rounded-lg text-sm",
        // Solid amethyst — luxury / high-value
        amethyst:
          "bg-amethyst text-white shadow-sm hover:bg-amethyst-light rounded-lg text-sm",
        // Solid emerald — success / verify
        emerald:
          "bg-emerald-j text-white shadow-sm hover:bg-emerald-j-light rounded-lg text-sm",
        // Solid ruby — destructive
        destructive:
          "bg-ruby text-white shadow-sm hover:bg-ruby-light rounded-lg text-sm",
        // Outlined sapphire
        outline:
          "border border-sapphire/30 bg-transparent text-sapphire hover:bg-sapphire-muted rounded-lg text-sm",
        // Subtle ghost
        ghost:
          "bg-transparent text-pewter hover:bg-ivory hover:text-charcoal rounded-lg text-sm",
        // Plain link
        link: "text-sapphire underline-offset-4 hover:underline rounded-none text-sm p-0 h-auto",
        // Default (maps to primary)
        default:
          "bg-sapphire text-white shadow-sm hover:bg-sapphire-light rounded-lg text-sm",
        secondary:
          "bg-sapphire-muted text-sapphire hover:bg-sapphire/20 rounded-lg text-sm",
      },
      size: {
        sm:      "h-8 px-3 text-xs rounded-md",
        default: "h-9 px-4",
        lg:      "h-11 px-6 text-base",
        xl:      "h-12 px-8 text-base",
        icon:    "h-9 w-9 p-0",
        "icon-sm": "h-7 w-7 p-0 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
