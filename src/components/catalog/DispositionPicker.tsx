"use client";

import { cn } from "@/lib/utils";
import { Package, ShoppingCart, Heart, Trash2 } from "lucide-react";

type Disposition = "KEEP" | "SELL" | "DONATE" | "TRASH";

export interface DispositionPickerProps {
  value: Disposition | null;
  onChange: (value: Disposition) => void;
  disabled?: boolean;
}

const dispositions: {
  key: Disposition;
  label: string;
  color: string;
  bgActive: string;
  borderColor: string;
  textColor: string;
  icon: React.ElementType;
}[] = [
  {
    key: "KEEP",
    label: "Keep",
    color: "#4A1B6D",
    bgActive: "bg-amethyst",
    borderColor: "border-amethyst",
    textColor: "text-amethyst",
    icon: Package,
  },
  {
    key: "SELL",
    label: "Sell",
    color: "#1B3A6B",
    bgActive: "bg-sapphire",
    borderColor: "border-sapphire",
    textColor: "text-sapphire",
    icon: ShoppingCart,
  },
  {
    key: "DONATE",
    label: "Donate",
    color: "#0D5740",
    bgActive: "bg-emerald",
    borderColor: "border-emerald",
    textColor: "text-emerald",
    icon: Heart,
  },
  {
    key: "TRASH",
    label: "Trash",
    color: "#8B1A2F",
    bgActive: "bg-ruby",
    borderColor: "border-ruby",
    textColor: "text-ruby",
    icon: Trash2,
  },
];

export function DispositionPicker({ value, onChange, disabled = false }: DispositionPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {dispositions.map((d) => {
        const isSelected = value === d.key;
        const Icon = d.icon;

        return (
          <button
            key={d.key}
            type="button"
            disabled={disabled}
            onClick={() => onChange(d.key)}
            className={cn(
              "flex flex-col items-center justify-center gap-2 rounded-lg border-2 px-3 py-4 text-sm font-medium transition-all",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sapphire",
              isSelected
                ? cn(d.bgActive, "border-transparent text-white shadow-md")
                : cn("bg-white", d.borderColor, d.textColor, "hover:shadow-sm"),
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{d.label}</span>
          </button>
        );
      })}
    </div>
  );
}
