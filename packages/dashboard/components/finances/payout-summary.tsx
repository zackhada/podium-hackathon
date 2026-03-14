import { Card, CardContent } from "@/components/ui/card";
import { payoutSummary } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, TrendingDown, Wallet } from "lucide-react";

const items = [
  {
    label: "Total Revenue",
    value: payoutSummary.totalRevenue,
    icon: DollarSign,
    iconColor: "text-success",
    iconBg: "bg-success/10",
  },
  {
    label: "Total Expenses",
    value: payoutSummary.totalExpenses,
    icon: TrendingDown,
    iconColor: "text-danger",
    iconBg: "bg-danger/10",
  },
  {
    label: "Net Income",
    value: payoutSummary.netIncome,
    icon: Wallet,
    iconColor: "text-accent",
    iconBg: "bg-accent/10",
  },
];

export function PayoutSummary() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label} className="animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted">{item.label}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {formatCurrency(item.value)}
                </p>
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
