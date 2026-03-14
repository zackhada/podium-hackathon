"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface OverrideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionTitle: string;
  onConfirm: (reason: string) => void;
}

export function OverrideDialog({ open, onOpenChange, actionTitle, onConfirm }: OverrideDialogProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(reason);
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Override AI Action</DialogTitle>
          <DialogDescription>
            You are overriding: <strong>{actionTitle}</strong>
          </DialogDescription>
        </DialogHeader>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Reason for override
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why you're overriding this action..."
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 min-h-[100px] resize-none"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {/* ============================================================
              OPENCLAW_HOOK: Override AI action
              Integration: POST ${NEXT_PUBLIC_OPENCLAW_URL}/actions/{id}/override
              Current behavior: Updates local state to "overridden"
              ============================================================ */}
          <Button variant="destructive" onClick={handleConfirm} disabled={!reason.trim()}>
            Confirm Override
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
