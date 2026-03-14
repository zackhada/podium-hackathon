import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { deposits } from "@/lib/mock-data";
import { getPropertyById } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

const sourceVariant: Record<string, "info" | "purple" | "success"> = {
  airbnb: "info",
  vrbo: "purple",
  direct: "success",
};

export function DepositsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Deposits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left font-medium text-muted">Date</th>
                <th className="pb-3 text-left font-medium text-muted">Guest</th>
                <th className="pb-3 text-left font-medium text-muted">Property</th>
                <th className="pb-3 text-left font-medium text-muted">Source</th>
                <th className="pb-3 text-right font-medium text-muted">Amount</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((deposit) => {
                const property = getPropertyById(deposit.propertyId);
                return (
                  <tr key={deposit.id} className="border-b border-border last:border-b-0">
                    <td className="py-3 text-gray-700">{formatDate(deposit.date)}</td>
                    <td className="py-3 font-medium text-gray-900">{deposit.guestName}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2 text-gray-700">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: property?.color }} />
                        {property?.name}
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge variant={sourceVariant[deposit.source]}>{deposit.source.toUpperCase()}</Badge>
                    </td>
                    <td className="py-3 text-right font-medium text-success">+{formatCurrency(deposit.amount)}</td>
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
