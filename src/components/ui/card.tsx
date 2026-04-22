import * as React from "react";
import { cn } from "@/lib/utils";

/* Base Card — editorial: no shadows, no rounded corners, top border accent */
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-white border-t-2 border-t-[#0A0A0A] border-b border-b-[#E0E0E0] border-l-0 border-r-0 rounded-none",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

/* Premium Card — violet top accent */
const CardPremium = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <Card
      ref={ref}
      className={cn("border-t-[#826DEE]", className)}
      {...props}
    />
  )
);
CardPremium.displayName = "CardPremium";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1.5 pt-6 pb-2", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-display font-black uppercase tracking-tight text-[#0A0A0A] text-lg leading-tight", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-[#6B6B6B] font-light", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-0 pt-4", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center gap-3 pt-4", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardPremium, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
