"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { properties, getBookingsForProperty } from "@/lib/mock-data";
import { Property } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { X, MapPin } from "lucide-react";

function createDotIcon(color: string, selected: boolean) {
  const size = 20;
  const shadow = selected
    ? `0 0 0 4px ${color}40, 0 4px 14px rgba(0,0,0,0.25)`
    : "0 2px 6px rgba(0,0,0,0.22)";
  return L.divIcon({
    className: "",
    html: `<div style="
      background-color: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: ${shadow};
      cursor: pointer;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function MapPageInner() {
  const [selected, setSelected] = useState<Property | null>(null);

  const bookings = selected
    ? getBookingsForProperty(selected.id).filter((b) => b.status !== "completed")
    : [];

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <MapContainer
        center={[21.3069, -157.8583]}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {properties.map((property) => (
          <Marker
            key={`${property.id}-${selected?.id === property.id}`}
            position={[property.location.lat, property.location.lng]}
            icon={createDotIcon(property.color, selected?.id === property.id)}
            eventHandlers={{
              click: () =>
                setSelected((prev) => (prev?.id === property.id ? null : property)),
            }}
          />
        ))}
      </MapContainer>

      {/* Property detail panel */}
      {selected && (
        <div
          className="absolute top-4 right-4 w-80 bg-white rounded-2xl z-[1000] overflow-hidden"
          style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.16)" }}
        >
          {/* Property photo */}
          <div className="relative h-36 bg-gray-100 overflow-hidden">
            {selected.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selected.image}
                alt={selected.name}
                className="w-full h-full object-cover"
              />
            )}
            {/* Gradient overlay at bottom for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            {/* Type badge overlaid on image */}
            <span
              className="absolute bottom-2.5 left-3 text-xs px-2 py-0.5 rounded-full font-medium capitalize text-white"
              style={{ backgroundColor: `${selected.color}cc` }}
            >
              {selected.type.replace(/-/g, " ")}
            </span>
            {/* Close button overlaid on image */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
            >
              <X className="h-3.5 w-3.5 text-white" />
            </button>
          </div>

          {/* Header */}
          <div className="px-4 pt-3 pb-2">
            <h2 className="font-semibold text-gray-900 text-base leading-tight">
              {selected.name}
            </h2>
            <div className="flex items-start gap-1.5 mt-1.5">
              <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
              <span className="text-xs text-gray-500 leading-snug">{selected.address}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-4 mb-3 grid grid-cols-2 gap-2">
            <div
              className="rounded-xl p-3 text-center"
              style={{ backgroundColor: `${selected.color}12` }}
            >
              <p className="text-xl font-bold text-gray-900">{formatCurrency(selected.rate)}</p>
              <p className="text-xs text-gray-500 mt-0.5">per night</p>
            </div>
            <div
              className="rounded-xl p-3 text-center"
              style={{ backgroundColor: `${selected.color}12` }}
            >
              <p className="text-xl font-bold text-gray-900">{selected.occupancy}%</p>
              <p className="text-xs text-gray-500 mt-0.5">occupancy</p>
            </div>
          </div>

          {/* Bookings */}
          <div className="px-4 pb-4">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Active & Upcoming
            </p>
            {bookings.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No upcoming bookings</p>
            ) : (
              <div className="space-y-0">
                {bookings.slice(0, 3).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0"
                  >
                    {/* Guest avatar */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://i.pravatar.cc/40?u=${booking.guestEmail}`}
                      alt={booking.guestName}
                      className="h-8 w-8 rounded-full object-cover shrink-0 ring-2 ring-white"
                      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.12)" }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {booking.guestName}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(booking.checkIn).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        →{" "}
                        {new Date(booking.checkOut).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                        {" · "}
                        {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-1 rounded-full capitalize shrink-0 ${
                        booking.status === "checked-in"
                          ? "bg-green-100 text-green-700"
                          : "bg-sky-100 text-sky-700"
                      }`}
                    >
                      {booking.status.replace("-", " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Property legend */}
      <div
        className="absolute bottom-8 left-4 bg-white rounded-xl z-[1000] overflow-hidden"
        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}
      >
        <div className="px-3 pt-2.5 pb-0.5">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            Properties
          </p>
        </div>
        <div className="p-2 space-y-0.5">
          {properties.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected((prev) => (prev?.id === p.id ? null : p))}
              className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-left transition-colors ${
                selected?.id === p.id ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
            >
              <div
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: p.color }}
              />
              <span className="text-xs text-gray-700 font-medium truncate max-w-[160px]">
                {p.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
