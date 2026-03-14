"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AIAction, AIActionCategory, AIActionStatus } from "@/lib/types";
import { getPropertyById } from "@/lib/mock-data";
import { formatCurrency, timeAgo } from "@/lib/utils";
import { Sparkles, ShoppingCart, Wrench, TrendingUp, MessageCircle, RefreshCw, RotateCcw } from "lucide-react";

const categoryIcons: Record<AIActionCategory, React.ElementType> = {
  cleaning: Sparkles,
  amazon: ShoppingCart,
  repair: Wrench,
  pricing: TrendingUp,
  messaging: MessageCircle,
  calendar: RefreshCw,
};

const categoryColors: Record<AIActionCategory, string> = {
  cleaning: "bg-emerald-100 text-emerald-700",
  amazon: "bg-amber-100 text-amber-700",
  repair: "bg-red-100 text-red-700",
  pricing: "bg-blue-100 text-blue-700",
  messaging: "bg-purple-100 text-purple-700",
  calendar: "bg-gray-100 text-gray-700",
};

const statusVariant: Record<AIActionStatus, "default" | "success" | "warning" | "destructive" | "info" | "purple"> = {
  completed: "success",
  pending: "warning",
  "in-progress": "info",
  overridden: "purple",
  failed: "destructive",
};

interface ActionCardProps {
  action: AIAction;
  propertyName?: string;
  onOverride: (action: AIAction) => void;
}

export function ActionCard({ action, propertyName, onOverride }: ActionCardProps) {
  const Icon = categoryIcons[action.category];
  const property = getPropertyById(action.propertyId);
  const displayName = propertyName ?? property?.name ?? action.propertyId;

  return (
    <Card className="animate-fade-in">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${categoryColors[action.category]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-gray-900">{action.title}</h3>
                  <Badge variant={statusVariant[action.status]}>{action.status}</Badge>
                </div>
                <p className="text-sm text-muted leading-relaxed">{action.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-light">
                  <span className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: property?.color ?? "#6b7280" }} />
                    {displayName}
                  </span>
                  <span>{timeAgo(action.timestamp)}</span>
                  {action.cost && <span>{formatCurrency(action.cost)}</span>}
                </div>
              </div>
              {action.status !== "overridden" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-muted hover:text-danger"
                  onClick={() => onOverride(action)}
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1" />
                  Override
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
