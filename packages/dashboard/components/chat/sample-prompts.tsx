"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, CalendarDays, Wrench, TrendingUp } from "lucide-react";

const prompts = [
  {
    icon: DollarSign,
    title: "Revenue Report",
    description: "How did my properties perform this month?",
    prompt: "Give me a revenue summary for March 2026 across all properties.",
  },
  {
    icon: CalendarDays,
    title: "Booking Gaps",
    description: "Find unbooked dates to fill",
    prompt: "Which properties have gaps in bookings for the next 2 weeks?",
  },
  {
    icon: Wrench,
    title: "Maintenance Status",
    description: "Check on open repair tickets",
    prompt: "What maintenance issues are currently open?",
  },
  {
    icon: TrendingUp,
    title: "Pricing Strategy",
    description: "Optimize nightly rates",
    prompt: "Should I adjust pricing for any properties this week?",
  },
];

interface SamplePromptsProps {
  onSelect: (prompt: string) => void;
}

export function SamplePrompts({ onSelect }: SamplePromptsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {prompts.map((item) => (
        <Card
          key={item.title}
          className="cursor-pointer hover:shadow-card-hover transition-shadow"
          onClick={() => onSelect(item.prompt)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <item.icon className="h-4 w-4 text-accent" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                <p className="text-xs text-muted mt-0.5">{item.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
