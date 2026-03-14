import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { properties, bookings } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export function PropertyBreakdown() {
  const breakdown = properties.map((property) => {
    const propertyBookings = bookings.filter((b) => b.propertyId === property.id);
    const totalRevenue = propertyBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const avgRate = propertyBookings.length > 0
      ? Math.round(propertyBookings.reduce((sum, b) => sum + b.nightlyRate, 0) / propertyBookings.length)
      : property.rate;

    return {
      ...property,
      bookingCount: propertyBookings.length,
      totalRevenue,
      avgRate,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Property Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left font-medium text-muted">Property</th>
                <th className="pb-3 text-right font-medium text-muted">Bookings</th>
                <th className="pb-3 text-right font-medium text-muted">Revenue</th>
                <th className="pb-3 text-right font-medium text-muted">Occupancy</th>
                <th className="pb-3 text-right font-medium text-muted">Avg Rate</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-b-0">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.color }} />
                      <span className="font-medium text-gray-900">{row.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right text-gray-700">{row.bookingCount}</td>
                  <td className="py-3 text-right font-medium text-gray-900">{formatCurrency(row.totalRevenue)}</td>
                  <td className="py-3 text-right text-gray-700">{row.occupancy}%</td>
                  <td className="py-3 text-right text-gray-700">{formatCurrency(row.avgRate)}/nt</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
