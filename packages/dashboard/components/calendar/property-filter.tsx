"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { properties } from "@/lib/mock-data";

interface PropertyFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function PropertyFilter({ value, onChange }: PropertyFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="All Properties" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Properties</SelectItem>
        {properties.map((property) => (
          <SelectItem key={property.id} value={property.id}>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: property.color }} />
              {property.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
