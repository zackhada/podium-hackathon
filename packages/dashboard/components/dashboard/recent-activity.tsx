"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { aiActions, getPropertyById } from "@/lib/mock-data";
import { timeAgo } from "@/lib/utils";
import { Sparkles, ShoppingCart, Wrench, TrendingUp, MessageCircle, RefreshCw } from "lucide-react";
import { AIAction, AIActionCategory, AIActionStatus } from "@/lib/types";

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
  const [actions, setActions] = useState<AIAction[]>(aiActions.slice(0, 5));
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
    const wsUrl = apiUrl.replace(/^http/, "ws") + "/ws";

    function connect() {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "action") {
            const incoming: AIAction = {
              id: data.id,
              propertyId: data.propertyId,
              category: data.category as AIActionCategory,
              title: data.title,
              description: data.description,
              timestamp: data.timestamp,
              status: data.status as AIActionStatus,
              cost: data.cost,
            };
            setActions((prev) => [incoming, ...prev].slice(0, 5));
          }
        } catch {
          // ignore malformed messages
        }
      };

      ws.onclose = () => {
        reconnectTimer.current = setTimeout(connect, 3000);
      };
    }

    connect();

    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, []);

  return (
    <Card className="animate-fade-in h-full">
      <CardHeader>
        <CardTitle className="text-base">Recent AI Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {actions.map((action) => {
            const Icon = categoryIcons[action.category] ?? Wrench;
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
                    {property?.name ?? "Property"} &middot; {timeAgo(action.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
