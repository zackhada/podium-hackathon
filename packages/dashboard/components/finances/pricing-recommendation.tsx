"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pricingRecommendations as initialRecs } from "@/lib/mock-data";
import { getPropertyById } from "@/lib/mock-data";
import { PricingRecommendation } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TrendingUp, TrendingDown, Check, X } from "lucide-react";

export function PricingRecommendations() {
  const [recommendations, setRecommendations] = useState<PricingRecommendation[]>(initialRecs);

  const handleAction = (id: string, status: "approved" | "rejected") => {
    // ============================================================
    // OPENCLAW_HOOK: Approve/reject pricing recommendation
    // Integration: POST ${NEXT_PUBLIC_OPENCLAW_URL}/pricing/{id}/approve or /reject
    // Current behavior: Updates local state only
    // ============================================================
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">AI Pricing Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => {
            const property = getPropertyById(rec.propertyId);
            const isIncrease = rec.suggestedRate > rec.currentRate;
            const diff = Math.abs(rec.suggestedRate - rec.currentRate);
            const pctChange = Math.round((diff / rec.currentRate) * 100);

            return (
              <div
                key={rec.id}
                className="rounded-lg border border-border p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: property?.color }} />
                      <span className="text-sm font-semibold text-gray-900">{property?.name}</span>
                      {rec.status !== "pending" && (
                        <Badge variant={rec.status === "approved" ? "success" : "destructive"}>
                          {rec.status}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-sm">
                      <span className="text-muted">{formatCurrency(rec.currentRate)}/nt</span>
                      <span className="text-muted">&rarr;</span>
                      <span className={`font-semibold ${isIncrease ? "text-success" : "text-danger"}`}>
                        {formatCurrency(rec.suggestedRate)}/nt
                      </span>
                      <span className={`flex items-center gap-0.5 text-xs ${isIncrease ? "text-success" : "text-danger"}`}>
                        {isIncrease ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {isIncrease ? "+" : "-"}{pctChange}%
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-1.5">{rec.reason}</p>
                    <p className="text-xs text-muted-light mt-1">
                      {formatDate(rec.dateRange.start)} - {formatDate(rec.dateRange.end)}
                    </p>
                  </div>
                  {rec.status === "pending" && (
                    <div className="flex items-center gap-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => handleAction(rec.id, "approved")}>
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleAction(rec.id, "rejected")}>
                        <X className="h-3.5 w-3.5 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
