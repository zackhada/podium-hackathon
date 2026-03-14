"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Payment {
  id: string;
  amount: number;
  status: string;
  dueDate: string;
  paidAt: string | null;
  tenant: {
    name: string;
    unit?: {
      number: string;
      property?: { address: string };
    };
  };
}

const statusVariant: Record<string, "success" | "warning" | "destructive"> = {
  paid: "success",
  pending: "warning",
  overdue: "destructive",
};

export function DepositsTable() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

    async function load() {
      try {
        const res = await fetch(`${apiUrl}/payments`);
        const data: Payment[] = await res.json();
        setPayments(data);
      } catch { /* keep existing */ }
    }

    load();
    const interval = setInterval(load, 15_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Rent Payments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left font-medium text-muted">Due Date</th>
                <th className="pb-3 text-left font-medium text-muted">Tenant</th>
                <th className="pb-3 text-left font-medium text-muted">Unit</th>
                <th className="pb-3 text-left font-medium text-muted">Status</th>
                <th className="pb-3 text-right font-medium text-muted">Amount</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-b-0">
                  <td className="py-3 text-gray-700">{formatDate(p.dueDate)}</td>
                  <td className="py-3 font-medium text-gray-900">{p.tenant.name}</td>
                  <td className="py-3 text-gray-700">
                    {p.tenant.unit
                      ? `${p.tenant.unit.property?.address} · Unit ${p.tenant.unit.number}`
                      : "—"}
                  </td>
                  <td className="py-3">
                    <Badge variant={statusVariant[p.status] ?? "default"}>{p.status}</Badge>
                  </td>
                  <td className="py-3 text-right font-medium text-success">
                    {formatCurrency(p.amount)}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted">No payments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
