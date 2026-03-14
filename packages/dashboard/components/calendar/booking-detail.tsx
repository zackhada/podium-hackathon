"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Booking, Property } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

interface BookingDetailProps {
  booking: Booking | null;
  property: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const sourceVariant: Record<string, "info" | "purple" | "success"> = {
  airbnb: "info",
  vrbo: "purple",
  direct: "success",
};

const statusVariant: Record<string, "default" | "success" | "warning" | "info" | "destructive"> = {
  confirmed: "info",
  "checked-in": "success",
  completed: "default",
  cancelled: "destructive",
};

export function BookingDetail({ booking, property, open, onOpenChange }: BookingDetailProps) {
  if (!booking || !property) return null;

  const nights = Math.ceil(
    (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{booking.guestName}</DialogTitle>
          <DialogDescription>{property.name}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant={sourceVariant[booking.source]}>{booking.source.toUpperCase()}</Badge>
            <Badge variant={statusVariant[booking.status]}>{booking.status}</Badge>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted">Check-in</p>
              <p className="font-medium">{formatDate(booking.checkIn)}</p>
            </div>
            <div>
              <p className="text-muted">Check-out</p>
              <p className="font-medium">{formatDate(booking.checkOut)}</p>
            </div>
            <div>
              <p className="text-muted">Nightly Rate</p>
              <p className="font-medium">{formatCurrency(booking.nightlyRate)}</p>
            </div>
            <div>
              <p className="text-muted">Nights</p>
              <p className="font-medium">{nights}</p>
            </div>
            <div>
              <p className="text-muted">Guests</p>
              <p className="font-medium">{booking.guests}</p>
            </div>
            <div>
              <p className="text-muted">Total</p>
              <p className="font-semibold text-gray-900">{formatCurrency(booking.totalAmount)}</p>
            </div>
          </div>
          <Separator />
          <div className="text-sm">
            <p className="text-muted">Contact</p>
            <p className="font-medium">{booking.guestEmail}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
