"use client";

import { useState, useMemo } from "react";
import { Booking, Property } from "@/lib/types";
import { BookingBar } from "./booking-bar";
import { BookingDetail } from "./booking-detail";
import { cn } from "@/lib/utils";

interface MonthGridProps {
  year: number;
  month: number; // 0-indexed
  bookings: Booking[];
  properties: Property[];
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MonthGrid({ year, month, bookings, properties }: MonthGridProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { days, startOffset } = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startOffset = firstDay.getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return { days, startOffset, daysInMonth };
  }, [year, month]);

  const totalCells = Math.ceil((days.length + startOffset) / 7) * 7;
  const today = new Date();

  const getBookingsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return bookings.filter((b) => {
      return dateStr >= b.checkIn && dateStr < b.checkOut;
    });
  };

  const getPropertyForBooking = (booking: Booking): Property | undefined => {
    return properties.find((p) => p.id === booking.propertyId);
  };

  // Calculate booking bars for the month view
  const bookingBars = useMemo(() => {
    const bars: Array<{ booking: Booking; property: Property; row: number; startCol: number; endCol: number; startWeek: number }> = [];

    bookings.forEach((booking) => {
      const property = getPropertyForBooking(booking);
      if (!property) return;

      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);

      if (checkOut < monthStart || checkIn > monthEnd) return;

      const effectiveStart = checkIn < monthStart ? monthStart : checkIn;
      const effectiveEnd = checkOut > monthEnd ? new Date(year, month + 1, 0) : new Date(checkOut.getTime() - 86400000);

      const startDayNum = effectiveStart.getDate();
      const endDayNum = effectiveEnd.getDate();

      // Calculate grid positions
      const startCell = startOffset + startDayNum - 1;
      const endCell = startOffset + endDayNum;
      const startWeek = Math.floor(startCell / 7);
      const endWeek = Math.floor((endCell - 1) / 7);

      // Split across weeks
      for (let week = startWeek; week <= endWeek; week++) {
        const weekStartCell = week * 7;
        const weekEndCell = weekStartCell + 7;
        const barStart = Math.max(startCell, weekStartCell);
        const barEnd = Math.min(endCell, weekEndCell);

        bars.push({
          booking,
          property,
          row: week,
          startCol: barStart - weekStartCell,
          endCol: barEnd - weekStartCell,
          startWeek: week,
        });
      }
    });

    return bars;
  }, [bookings, properties, year, month, startOffset]);

  const weeks = Math.ceil(totalCells / 7);

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const selectedProperty = selectedBooking
    ? properties.find((p) => p.id === selectedBooking.propertyId) ?? null
    : null;

  return (
    <>
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-7 border-b border-border">
          {DAY_NAMES.map((day) => (
            <div key={day} className="px-2 py-2 text-center text-xs font-medium text-muted">
              {day}
            </div>
          ))}
        </div>

        {/* Weeks */}
        {Array.from({ length: weeks }, (_, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 border-b border-border last:border-b-0 relative">
            {Array.from({ length: 7 }, (_, dayIdx) => {
              const cellIndex = weekIdx * 7 + dayIdx;
              const dayNum = cellIndex - startOffset + 1;
              const isCurrentMonth = dayNum >= 1 && dayNum <= days.length;
              const isToday =
                isCurrentMonth &&
                today.getFullYear() === year &&
                today.getMonth() === month &&
                today.getDate() === dayNum;

              const dayBookings = isCurrentMonth ? getBookingsForDay(dayNum) : [];

              return (
                <div
                  key={dayIdx}
                  className={cn(
                    "min-h-[100px] p-1.5 border-r border-border last:border-r-0",
                    !isCurrentMonth && "bg-gray-50"
                  )}
                >
                  {isCurrentMonth && (
                    <span
                      className={cn(
                        "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                        isToday
                          ? "bg-accent text-white font-semibold"
                          : "text-gray-700"
                      )}
                    >
                      {dayNum}
                    </span>
                  )}
                  {/* Booking dots for mobile-ish indicator */}
                  <div className="mt-1 space-y-0.5">
                    {dayBookings.slice(0, 3).map((b) => {
                      const prop = getPropertyForBooking(b);
                      // Only show a dot on the check-in day
                      if (b.checkIn === `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`) {
                        return (
                          <button
                            key={b.id}
                            onClick={() => handleBookingClick(b)}
                            className="flex items-center gap-1 w-full rounded px-1 py-0.5 text-[10px] truncate hover:bg-gray-100 transition-colors"
                          >
                            <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: prop?.color }} />
                            <span className="truncate">{b.guestName}</span>
                          </button>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <BookingDetail
        booking={selectedBooking}
        property={selectedProperty}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
