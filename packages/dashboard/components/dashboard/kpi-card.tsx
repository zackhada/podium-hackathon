import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  iconColor?: string;
  iconBg?: string;
}

export function KPICard({ title, value, icon: Icon, trend, iconColor = "text-accent", iconBg = "bg-accent/10" }: KPICardProps) {
  return (
    <Card className="animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted">{title}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            {trend && (
              <div className={cn("mt-1 flex items-center gap-1 text-xs font-medium", trend.positive ? "text-success" : "text-danger")}>
                {trend.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {trend.value}
              </div>
            )}
          </div>
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", iconBg)}>
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
