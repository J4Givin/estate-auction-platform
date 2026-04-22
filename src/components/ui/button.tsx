import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-mono text-[11px] font-bold tracking-[0.14em] uppercase",
    "min-h-[44px] transition-all duration-150 select-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#826DEE] focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-40",
    "active:scale-[0.97] rounded-none border-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-[#0A0A0A] text-white hover:bg-[#2a2a2a]",
        primary:
          "bg-[#0A0A0A] text-white hover:bg-[#2a2a2a]",
        secondary:
          "border-[1.5px] border-[#0A0A0A] bg-transparent text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white",
        destructive:
          "bg-[#F94500] text-white hover:bg-[#d93b00]",
        ghost:
          "bg-transparent text-[#0A0A0A] hover:bg-[#F5F5F5]",
        link:
          "text-[#826DEE] underline-offset-4 hover:underline p-0 h-auto min-h-0",
        outline:
          "border-[1.5px] border-[#0A0A0A] bg-transparent text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white",
        violet:
          "bg-[#826DEE] text-white hover:bg-[#6a59d4]",
        yellow:
          "bg-[#FFDB15] text-[#0A0A0A] hover:bg-[#e8c800]",
        pink:
          "bg-[#FF99DC] text-[#0A0A0A] hover:bg-[#e880c4]",
        platinum:
          "border-[1.5px] border-[#E0E0E0] text-[#6B6B6B] bg-transparent hover:bg-[#F5F5F5]",
        ruby:
          "bg-[#F94500] text-white hover:bg-[#d93b00]",
        sapphire:
          "bg-[#826DEE] text-white hover:bg-[#6a59d4]",
        emerald:
          "border-[1.5px] border-[#826DEE] text-[#826DEE] bg-transparent hover:bg-[#826DEE] hover:text-white",
        gold:
          "bg-[#FFDB15] text-[#0A0A0A] hover:bg-[#e8c800]",
        amethyst:
          "bg-[#826DEE] text-white hover:bg-[#6a59d4]",
      },
      size: {
        sm:        "h-8 px-3 text-[10px]",
        default:   "h-10 px-5",
        lg:        "h-12 px-7",
        xl:        "h-14 px-9",
        icon:      "h-10 w-10 p-0",
        "icon-sm": "h-8 w-8 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
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
