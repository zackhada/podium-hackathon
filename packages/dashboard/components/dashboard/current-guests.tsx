import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bookings, getPropertyById } from "@/lib/mock-data";
import { Phone, Users } from "lucide-react";
import Image from "next/image";

export function CurrentGuests() {
  const currentGuests = bookings.filter((b) => b.status === "checked-in");

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="h-4 w-4 text-muted" />
          Currently Staying
          <span className="ml-auto text-xs font-normal text-muted bg-gray-100 px-2 py-0.5 rounded-full">
            {currentGuests.length} guests
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentGuests.map((booking) => {
            const property = getPropertyById(booking.propertyId);
            const checkOut = new Date(booking.checkOut);
            const today = new Date("2026-03-14");
            const daysLeft = Math.ceil(
              (checkOut.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <div key={booking.id} className="flex items-center gap-3">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-sm">
                  {booking.guestAvatar ? (
                    <Image
                      src={booking.guestAvatar}
                      alt={booking.guestName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-accent/10 text-accent text-sm font-semibold">
                      {booking.guestName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {booking.guestName}
                  </p>
                  <p className="text-xs text-muted truncate">{property?.name}</p>
                </div>

                <div className="text-right shrink-0">
                  {booking.guestPhone && (
                    <a
                      href={`tel:${booking.guestPhone}`}
                      className="flex items-center gap-1 text-xs text-accent hover:underline"
                    >
                      <Phone className="h-3 w-3" />
                      {booking.guestPhone}
                    </a>
                  )}
                  <p className="text-xs text-muted mt-0.5">
                    {daysLeft === 0
                      ? "Checks out today"
                      : daysLeft === 1
                      ? "1 day left"
                      : `${daysLeft} days left`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
