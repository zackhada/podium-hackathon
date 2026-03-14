"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, Clock, TrendingUp } from "lucide-react";

interface Payment {
  id: string;
  amount: number;
  status: string;
}

interface Summary {
  collected: number;
  outstanding: number;
  collectionRate: number;
}

function compute(payments: Payment[]): Summary {
  const collected = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const outstanding = payments.filter((p) => p.status !== "paid").reduce((s, p) => s + p.amount, 0);
  const collectionRate = payments.length > 0
    ? Math.round((payments.filter((p) => p.status === "paid").length / payments.length) * 100)
    : 0;
  return { collected, outstanding, collectionRate };
}

export function PayoutSummary() {
  const [summary, setSummary] = useState<Summary>({ collected: 0, outstanding: 0, collectionRate: 0 });

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

    async function load() {
      try {
        const res = await fetch(`${apiUrl}/payments`);
        const data: Payment[] = await res.json();
        setSummary(compute(data));
      } catch { /* keep zeros */ }
    }

    load();
    const interval = setInterval(load, 15_000);
    return () => clearInterval(interval);
  }, []);

  const items = [
    {
      label: "Rent Collected",
      value: formatCurrency(summary.collected),
      icon: DollarSign,
      iconColor: "text-success",
      iconBg: "bg-success/10",
    },
    {
      label: "Outstanding",
      value: formatCurrency(summary.outstanding),
      icon: Clock,
      iconColor: "text-danger",
      iconBg: "bg-danger/10",
    },
    {
      label: "Collection Rate",
      value: `${summary.collectionRate}%`,
      icon: TrendingUp,
      iconColor: "text-accent",
      iconBg: "bg-accent/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label} className="animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted">{item.label}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{item.value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBg}`}>
                <item.icon className={`h-6 w-6 ${item.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
