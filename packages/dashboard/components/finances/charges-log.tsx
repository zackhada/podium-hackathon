import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { extraCharges } from "@/lib/mock-data";
import { getPropertyById } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Bot } from "lucide-react";

export function ChargesLog() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Charges & Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left font-medium text-muted">Date</th>
                <th className="pb-3 text-left font-medium text-muted">Property</th>
                <th className="pb-3 text-left font-medium text-muted">Category</th>
                <th className="pb-3 text-left font-medium text-muted">Description</th>
                <th className="pb-3 text-right font-medium text-muted">Amount</th>
              </tr>
            </thead>
            <tbody>
              {extraCharges.map((charge) => {
                const property = getPropertyById(charge.propertyId);
                return (
                  <tr key={charge.id} className="border-b border-border last:border-b-0">
                    <td className="py-3 text-gray-700">{formatDate(charge.date)}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2 text-gray-700">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: property?.color }} />
                        {property?.name}
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge variant="default">{charge.category}</Badge>
                    </td>
                    <td className="py-3 text-gray-700">
                      <div className="flex items-center gap-1.5">
                        {charge.description}
                        {charge.aiInitiated && (
                          <span className="inline-flex items-center gap-0.5 text-xs text-accent">
                            <Bot className="h-3 w-3" />
                            AI
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 text-right font-medium text-danger">-{formatCurrency(charge.amount)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
