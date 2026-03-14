"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { MonthGrid } from "@/components/calendar/month-grid";
import { PropertyFilter } from "@/components/calendar/property-filter";
import { GuestChats } from "@/components/calendar/guest-chats";
import { Button } from "@/components/ui/button";
import { bookings, properties, guestConversations } from "@/lib/mock-data";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

export default function CalendarPage() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(2); // March (0-indexed)
  const [propertyFilter, setPropertyFilter] = useState("all");

  const monthLabel = new Date(year, month).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const filteredBookings =
    propertyFilter === "all"
      ? bookings
      : bookings.filter((b) => b.propertyId === propertyFilter);

  return (
    <div>
      <PageHeader
        title="Bookings"
        subtitle="Calendar view of all reservations"
        actions={
          // ============================================================
          // OPENCLAW_HOOK: Airbnb/VRBO calendar sync
          // Integration: POST ${NEXT_PUBLIC_OPENCLAW_URL}/calendar/sync
          // Current behavior: Button is disabled (placeholder)
          // ============================================================
          <Button variant="outline" disabled>
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync with Airbnb
          </Button>
        }
      />

      <div className="flex gap-5 items-start">
        {/* Calendar column */}
        <div className="flex-1 min-w-0">
          {/* Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-semibold text-gray-900 w-40 text-center">
                {monthLabel}
              </span>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <PropertyFilter value={propertyFilter} onChange={setPropertyFilter} />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-4">
            {properties.map((p) => (
              <div key={p.id} className="flex items-center gap-1.5 text-xs text-muted">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                {p.name}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <MonthGrid
            year={year}
            month={month}
            bookings={filteredBookings}
            properties={properties}
          />
        </div>

        {/* Guest chats panel */}
        <div className="w-[340px] shrink-0 sticky top-6">
          <GuestChats conversations={guestConversations} properties={properties} />
        </div>
      </div>
    </div>
  );
}
