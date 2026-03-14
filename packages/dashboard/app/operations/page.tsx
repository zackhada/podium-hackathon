"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ActionCard } from "@/components/operations/action-card";
import { CategoryFilter } from "@/components/operations/category-filter";
import { OverrideDialog } from "@/components/operations/override-dialog";
import { aiActions as initialActions } from "@/lib/mock-data";
import { AIAction } from "@/lib/types";

export default function OperationsPage() {
  const [actions, setActions] = useState<AIAction[]>(initialActions);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [overrideTarget, setOverrideTarget] = useState<AIAction | null>(null);

  const filteredActions =
    categoryFilter === "all"
      ? actions
      : actions.filter((a) => a.category === categoryFilter);

  const handleOverride = (action: AIAction) => {
    setOverrideTarget(action);
  };

  const confirmOverride = (reason: string) => {
    if (!overrideTarget) return;
    setActions((prev) =>
      prev.map((a) =>
        a.id === overrideTarget.id ? { ...a, status: "overridden" as const } : a
      )
    );
    setOverrideTarget(null);
  };

  return (
    <div>
      <PageHeader
        title="Operations"
        subtitle="AI-managed actions across your properties"
      />

      <div className="mb-6">
        <CategoryFilter value={categoryFilter} onChange={setCategoryFilter} />
      </div>

      <div className="space-y-3">
        {filteredActions.map((action) => (
          <ActionCard key={action.id} action={action} onOverride={handleOverride} />
        ))}
      </div>

      {filteredActions.length === 0 && (
        <div className="text-center py-12 text-muted">
          No actions found for this category.
        </div>
      )}

      <OverrideDialog
        open={!!overrideTarget}
        onOpenChange={(open) => !open && setOverrideTarget(null)}
        actionTitle={overrideTarget?.title ?? ""}
        onConfirm={confirmOverride}
      />
    </div>
  );
}
