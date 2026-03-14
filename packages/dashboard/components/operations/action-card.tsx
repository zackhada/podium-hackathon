"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AIAction, AIActionCategory, AIActionStatus } from "@/lib/types";
import { getPropertyById } from "@/lib/mock-data";
import { formatCurrency, timeAgo } from "@/lib/utils";
import {
  Sparkles,
  ShoppingCart,
  Wrench,
  TrendingUp,
  MessageCircle,
  RefreshCw,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

const statusVariant: Record<
  AIActionStatus,
  "default" | "success" | "warning" | "destructive" | "info" | "purple"
> = {
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
  isLive?: boolean;
}

export function ActionCard({ action, onOverride, isLive }: ActionCardProps) {
  const [showReasoning, setShowReasoning] = useState(false);
  const Icon = categoryIcons[action.category];
  const property = getPropertyById(action.propertyId);

  return (
    <Card className="animate-fade-in">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${categoryColors[action.category]}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {action.title}
                  </h3>
                  <Badge variant={statusVariant[action.status]}>
                    {action.status}
                  </Badge>
                  {isLive && (
                    <span className="text-[10px] font-bold text-white bg-accent px-2 py-0.5 rounded-full animate-pulse">
                      LIVE
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  {action.description}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-light">
                  <span className="flex items-center gap-1">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: property?.color }}
                    />
                    {property?.name}
                  </span>
                  <span>{timeAgo(action.timestamp)}</span>
                  {action.cost && <span>{formatCurrency(action.cost)}</span>}
                  {action.reasoning && (
                    <button
                      onClick={() => setShowReasoning((v) => !v)}
                      className="flex items-center gap-1 text-accent hover:text-accent/80 transition-colors font-medium"
                    >
                      <BrainCircuit className="h-3 w-3" />
                      Why?
                      {showReasoning ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </button>
                  )}
                </div>

                {/* Reasoning panel */}
                {showReasoning && action.reasoning && (
                  <div className="mt-3 animate-fade-in">
                    <div className="rounded-lg bg-gray-950 px-4 py-3 font-mono text-xs leading-relaxed">
                      <div className="flex items-center gap-2 mb-2 text-emerald-400">
                        <BrainCircuit className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-semibold tracking-widest uppercase">
                          Agent reasoning
                        </span>
                      </div>
                      <p className="text-gray-300 whitespace-pre-wrap">
                        {action.reasoning
                          .split(" → ")
                          .map((step, i, arr) => (
                            <span key={i}>
                              <span className="text-gray-500">{"›"} </span>
                              <span>{step}</span>
                              {i < arr.length - 1 && (
                                <>
                                  <span className="text-emerald-600">
                                    {" "}
                                    →{" "}
                                  </span>
                                </>
                              )}
                            </span>
                          ))}
                      </p>
                    </div>
                  </div>
                )}
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
