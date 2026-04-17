import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-input bg-white px-3 py-2",
        "text-sm placeholder:text-muted-foreground",
        "shadow-xs transition-colors resize-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire/40 focus-visible:border-sapphire",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
export { Textarea };
