import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { aiActions } from "@/lib/mock-data";
import { getPropertyById } from "@/lib/mock-data";
import { timeAgo } from "@/lib/utils";
import { Sparkles, ShoppingCart, Wrench, TrendingUp, MessageCircle, RefreshCw } from "lucide-react";
import { AIActionCategory, AIActionStatus } from "@/lib/types";

const categoryIcons: Record<AIActionCategory, React.ElementType> = {
  cleaning: Sparkles,
  amazon: ShoppingCart,
  repair: Wrench,
  pricing: TrendingUp,
  messaging: MessageCircle,
  calendar: RefreshCw,
};

const statusVariant: Record<AIActionStatus, "default" | "success" | "warning" | "destructive" | "info" | "purple"> = {
  completed: "success",
  pending: "warning",
  "in-progress": "info",
  overridden: "purple",
  failed: "destructive",
};

export function RecentActivity() {
  return (
    <Card className="animate-fade-in h-full">
      <CardHeader>
        <CardTitle className="text-base">Recent AI Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* ============================================================
            OPENCLAW_HOOK: Real-time activity feed
            Integration: WebSocket ${NEXT_PUBLIC_OPENCLAW_URL}/ws/actions
            Current behavior: Displays hard-coded actions
            ============================================================ */}
        <div className="h-[340px] overflow-y-auto px-6 pb-6">
        <div className="space-y-4">
          {aiActions.map((action) => {
            const Icon = categoryIcons[action.category];
            const property = getPropertyById(action.propertyId);
            return (
              <div key={action.id} className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                  <Icon className="h-4 w-4 text-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{action.title}</p>
                    <Badge variant={statusVariant[action.status]} className="shrink-0">
                      {action.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    {property?.name} &middot; {timeAgo(action.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </CardContent>
    </Card>
  );
}
