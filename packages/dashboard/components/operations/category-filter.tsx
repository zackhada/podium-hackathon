"use client";

import { cn } from "@/lib/utils";
import { AIActionCategory } from "@/lib/types";

const categories: Array<{ value: string; label: string }> = [
  { value: "all", label: "All" },
  { value: "cleaning", label: "Cleaning" },
  { value: "amazon", label: "Orders" },
  { value: "repair", label: "Repairs" },
  { value: "pricing", label: "Pricing" },
  { value: "messaging", label: "Messaging" },
  { value: "calendar", label: "Calendar" },
];

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            value === cat.value
              ? "bg-accent text-white"
              : "bg-gray-100 text-muted hover:bg-gray-200"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
