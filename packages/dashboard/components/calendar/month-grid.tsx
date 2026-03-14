"use client";

import { useState, useMemo } from "react";
import { Booking, Property } from "@/lib/types";
import { BookingDetail } from "./booking-detail";
import { cn } from "@/lib/utils";

interface MonthGridProps {
  year: number;
  month: number; // 0-indexed
  bookings: Booking[];
  properties: Property[];
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const BAR_HEIGHT = 20;
const BAR_TOP_OFFSET = 30; // px from top of row to first bar
const BAR_SLOT_HEIGHT = 24; // px per vertical slot (bar + gap)
const MIN_ROW_HEIGHT = 88;

type BarData = {
  booking: Booking;
  property: Property;
  row: number;
  startCol: number;
  endCol: number;
  isStart: boolean;
  isEnd: boolean;
};

function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

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

  const { bars, slotMap } = useMemo(() => {
    const result: BarData[] = [];
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);

    bookings.forEach((booking) => {
      const property = properties.find((p) => p.id === booking.propertyId);
      if (!property) return;

      const checkIn = parseLocalDate(booking.checkIn);
      const checkOut = parseLocalDate(booking.checkOut);

      if (checkOut <= monthStart || checkIn > monthEnd) return;

      // Last night of stay = checkOut - 1 day
      const lastNight = new Date(checkOut.getTime() - 86400000);

      const effectiveStart = checkIn < monthStart ? monthStart : checkIn;
      const effectiveEnd = lastNight > monthEnd ? monthEnd : lastNight;

      const startDayNum = effectiveStart.getDate();
      const endDayNum = effectiveEnd.getDate();

      // startCell: 0-indexed cell of first visible day; endCell: exclusive end cell
      const startCell = startOffset + startDayNum - 1;
      const endCell = startOffset + endDayNum; // exclusive (one past last day)

      const startWeek = Math.floor(startCell / 7);
      const endWeek = Math.floor((endCell - 1) / 7);

      for (let week = startWeek; week <= endWeek; week++) {
        const wStart = week * 7;
        const wEnd = wStart + 7;

        const barStart = Math.max(startCell, wStart);
        const barEnd = Math.min(endCell, wEnd);

        if (barEnd <= barStart) continue;

        // isStart: the actual check-in day falls within this week
        const checkInCell =
          checkIn.getFullYear() === year && checkIn.getMonth() === month
            ? startOffset + checkIn.getDate() - 1
            : -999;
        const isStart = checkInCell >= wStart && checkInCell < wEnd;

        // isEnd: the last night falls within this week
        const lastNightCell =
          lastNight.getFullYear() === year && lastNight.getMonth() === month
            ? startOffset + lastNight.getDate() - 1
            : 999;
        const isEnd = lastNightCell >= wStart && lastNightCell < wEnd;

        result.push({
          booking,
          property,
          row: week,
          startCol: barStart - wStart,
          endCol: barEnd - wStart,
          isStart,
          isEnd,
        });
      }
    });

    // Assign vertical slots per week to avoid overlap
    const slotMap = new Map<string, number>();
    const byWeek = new Map<number, BarData[]>();
    result.forEach((b) => {
      if (!byWeek.has(b.row)) byWeek.set(b.row, []);
      byWeek.get(b.row)!.push(b);
    });

    byWeek.forEach((weekBars) => {
      const sorted = [...weekBars].sort(
        (a, b) => a.startCol - b.startCol || a.booking.id.localeCompare(b.booking.id)
      );
      const slotEnds: number[] = [];
      sorted.forEach((bar) => {
        let slot = 0;
        while (slot < slotEnds.length && slotEnds[slot] > bar.startCol) slot++;
        slotEnds[slot] = bar.endCol;
        slotMap.set(`${bar.booking.id}-${bar.row}`, slot);
      });
    });

    return { bars: result, slotMap };
  }, [bookings, properties, year, month, startOffset]);

  // Max slots per week row for height calculation
  const rowMaxSlots = useMemo(() => {
    const m = new Map<number, number>();
    bars.forEach((bar) => {
      const slot = slotMap.get(`${bar.booking.id}-${bar.row}`) ?? 0;
      m.set(bar.row, Math.max(m.get(bar.row) ?? 0, slot + 1));
    });
    return m;
  }, [bars, slotMap]);

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
        {/* Day name header */}
        <div className="grid grid-cols-7 border-b border-border">
          {DAY_NAMES.map((day) => (
            <div key={day} className="px-2 py-2 text-center text-xs font-medium text-muted">
              {day}
            </div>
          ))}
        </div>

        {/* Week rows */}
        {Array.from({ length: weeks }, (_, weekIdx) => {
          const maxSlots = rowMaxSlots.get(weekIdx) ?? 0;
          const rowHeight = Math.max(MIN_ROW_HEIGHT, BAR_TOP_OFFSET + maxSlots * BAR_SLOT_HEIGHT + 10);
          const weekBars = bars.filter((b) => b.row === weekIdx);

          return (
            <div
              key={weekIdx}
              className="grid grid-cols-7 border-b border-border last:border-b-0 relative"
              style={{ minHeight: `${rowHeight}px` }}
            >
              {/* Day cells — background, borders, day numbers */}
              {Array.from({ length: 7 }, (_, dayIdx) => {
                const cellIndex = weekIdx * 7 + dayIdx;
                const dayNum = cellIndex - startOffset + 1;
                const isCurrentMonth = dayNum >= 1 && dayNum <= days.length;
                const isToday =
                  isCurrentMonth &&
                  today.getFullYear() === year &&
                  today.getMonth() === month &&
                  today.getDate() === dayNum;

                return (
                  <div
                    key={dayIdx}
                    className={cn(
                      "p-1.5 border-r border-border last:border-r-0",
                      !isCurrentMonth && "bg-gray-50/70"
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
                  </div>
                );
              })}

              {/* Booking bars — absolutely positioned over the grid */}
              {weekBars.map((bar) => {
                const slot = slotMap.get(`${bar.booking.id}-${bar.row}`) ?? 0;
                const topPx = BAR_TOP_OFFSET + slot * BAR_SLOT_HEIGHT;
                const leftPct = (bar.startCol / 7) * 100;
                const widthPct = ((bar.endCol - bar.startCol) / 7) * 100;

                // Horizontal margin so bars don't butt right against cell edges
                const marginLeft = bar.isStart ? 3 : 0;
                const marginRight = bar.isEnd ? 3 : 0;

                const borderRadius = `${bar.isStart ? 999 : 2}px ${bar.isEnd ? 999 : 2}px ${bar.isEnd ? 999 : 2}px ${bar.isStart ? 999 : 2}px`;

                // Slightly darker color for the left cap
                const bgColor = bar.property.color;

                return (
                  <button
                    key={`${bar.booking.id}-${bar.row}`}
                    onClick={() => handleBookingClick(bar.booking)}
                    className="absolute flex items-center gap-1 text-white text-[10px] font-semibold truncate hover:brightness-110 active:brightness-95 transition-all cursor-pointer z-10 shadow-sm"
                    style={{
                      top: `${topPx}px`,
                      left: `calc(${leftPct}% + ${marginLeft}px)`,
                      width: `calc(${widthPct}% - ${marginLeft + marginRight}px)`,
                      height: `${BAR_HEIGHT}px`,
                      backgroundColor: bgColor,
                      borderRadius,
                      paddingLeft: bar.isStart ? 6 : 4,
                      paddingRight: bar.isEnd ? 6 : 4,
                    }}
                    title={`${bar.booking.guestName} · ${bar.booking.checkIn} → ${bar.booking.checkOut}`}
                  >
                    {bar.isStart && bar.booking.guestAvatar && (
                      <img
                        src={bar.booking.guestAvatar}
                        alt=""
                        className="h-3.5 w-3.5 rounded-full shrink-0 ring-1 ring-white/60 object-cover"
                      />
                    )}
                    {bar.isStart && (
                      <span className="truncate leading-none">
                        {bar.booking.guestName.split(" ")[0]}
                      </span>
                    )}
                    {!bar.isStart && !bar.isEnd && (
                      <span className="w-full" />
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
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
