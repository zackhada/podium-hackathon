"use client";

import { Booking, Property } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BookingBarProps {
  booking: Booking;
  property: Property;
  startDay: number;
  endDay: number;
  daysInView: number;
  onClick: () => void;
}

export function BookingBar({ booking, property, startDay, endDay, daysInView, onClick }: BookingBarProps) {
  const clampedStart = Math.max(0, startDay);
  const clampedEnd = Math.min(daysInView, endDay);
  const widthPercent = ((clampedEnd - clampedStart) / daysInView) * 100;
  const leftPercent = (clampedStart / daysInView) * 100;

  if (widthPercent <= 0) return null;

  return (
    <button
      onClick={onClick}
      className="absolute h-5 rounded-full text-[10px] font-medium text-white truncate px-2 leading-5 hover:opacity-90 transition-opacity cursor-pointer z-10"
      style={{
        backgroundColor: property.color,
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        minWidth: "20px",
      }}
      title={`${booking.guestName}: ${booking.checkIn} - ${booking.checkOut}`}
    >
      {booking.guestName}
    </button>
  );
}
