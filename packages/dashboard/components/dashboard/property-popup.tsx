import { Property } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface PropertyPopupProps {
  property: Property;
}

export function PropertyPopup({ property }: PropertyPopupProps) {
  return (
    <div className="min-w-[200px] p-1">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: property.color }} />
        <h3 className="font-semibold text-sm text-gray-900">{property.name}</h3>
      </div>
      <div className="space-y-1 text-xs text-gray-600">
        <p className="capitalize">{property.type.replace("-", " ")}</p>
        <p>Rate: {formatCurrency(property.rate)}/night</p>
        <p>Occupancy: {property.occupancy}%</p>
        {property.nextBooking && (
          <p>Next booking: {new Date(property.nextBooking).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
        )}
      </div>
    </div>
  );
}
