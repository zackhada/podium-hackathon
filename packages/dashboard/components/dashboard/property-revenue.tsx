"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { properties, bookings, extraCharges } from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const SHORT_NAMES: Record<string, string> = {
  "prop-1": "Waikiki Beach",
  "prop-2": "Diamond Head",
  "prop-3": "Kailua Beach",
  "prop-4": "Waikiki Studio",
  "prop-5": "Manoa Valley",
};

// Slider range: Feb 1 – Mar 31, 2026
const RANGE_START = new Date("2026-02-01");
const RANGE_END = new Date("2026-03-31");
const TOTAL_DAYS = Math.round(
  (RANGE_END.getTime() - RANGE_START.getTime()) / 86400000
);

function addDays(base: Date, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function PropertyRevenue() {
  const [startDay, setStartDay] = useState(0);
  const [endDay, setEndDay] = useState(TOTAL_DAYS);

  const startDate = addDays(RANGE_START, startDay);
  const endDate = addDays(RANGE_START, endDay);

  const data = properties.map((property) => {
    const revenue = bookings
      .filter((b) => {
        if (b.propertyId !== property.id) return false;
        if (b.status !== "completed" && b.status !== "checked-in") return false;
        const checkIn = new Date(b.checkIn);
        return checkIn >= startDate && checkIn <= endDate;
      })
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const expenses = extraCharges
      .filter((c) => {
        if (c.propertyId !== property.id) return false;
        const d = new Date(c.date);
        return d >= startDate && d <= endDate;
      })
      .reduce((sum, c) => sum + c.amount, 0);

    return {
      name: SHORT_NAMES[property.id] ?? property.name,
      Revenue: revenue,
      Expenses: expenses,
    };
  });

  const leftPercent = (startDay / TOTAL_DAYS) * 100;
  const rightPercent = (endDay / TOTAL_DAYS) * 100;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-base">Revenue &amp; Expenses by Property</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Chart */}
        <div className="h-[260px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "#6B7280" }}
                tickLine={false}
                axisLine={{ stroke: "#E5E7EB" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#6B7280" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                iconSize={8}
                formatter={(value: string) => (
                  <span style={{ color: "#6B7280", fontSize: "12px" }}>{value}</span>
                )}
              />
              <Bar dataKey="Revenue" fill="#635BFF" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Date range slider */}
        <div className="px-2 pt-2 pb-1 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex justify-between mb-3">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wide text-muted font-medium">From</p>
              <p className="text-sm font-semibold text-gray-900">{formatDate(startDate)}</p>
            </div>
            <span className="text-xs text-muted self-center">—</span>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wide text-muted font-medium">To</p>
              <p className="text-sm font-semibold text-gray-900">{formatDate(endDate)}</p>
            </div>
          </div>

          {/* Dual range track */}
          <div className="relative h-8 flex items-center px-2">
            {/* Base track */}
            <div className="absolute inset-x-2 h-2 rounded-full bg-gray-200" />
            {/* Inactive left section */}
            <div
              className="absolute h-2 rounded-full bg-gray-200"
              style={{ left: "8px", width: `calc(${leftPercent}% - 4px)` }}
            />
            {/* Active fill */}
            <div
              className="absolute h-2 rounded-full bg-accent shadow-sm"
              style={{ left: `calc(${leftPercent}% + 8px)`, width: `calc(${rightPercent - leftPercent}% - 8px)` }}
            />
            {/* Min thumb */}
            <input
              type="range"
              min={0}
              max={TOTAL_DAYS}
              value={startDay}
              onChange={(e) => {
                const val = Math.min(Number(e.target.value), endDay - 1);
                setStartDay(val);
              }}
              className="absolute inset-x-2 w-[calc(100%-16px)] appearance-none bg-transparent cursor-grab active:cursor-grabbing
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:w-5
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:border-[3px]
                [&::-webkit-slider-thumb]:border-accent
                [&::-webkit-slider-thumb]:shadow-md
                [&::-webkit-slider-runnable-track]:bg-transparent
                [&::-moz-range-thumb]:h-5
                [&::-moz-range-thumb]:w-5
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-white
                [&::-moz-range-thumb]:border-[3px]
                [&::-moz-range-thumb]:border-accent
                [&::-moz-range-thumb]:shadow-md"
              style={{ zIndex: startDay > TOTAL_DAYS - 10 ? 5 : 3 }}
            />
            {/* Max thumb */}
            <input
              type="range"
              min={0}
              max={TOTAL_DAYS}
              value={endDay}
              onChange={(e) => {
                const val = Math.max(Number(e.target.value), startDay + 1);
                setEndDay(val);
              }}
              className="absolute inset-x-2 w-[calc(100%-16px)] appearance-none bg-transparent cursor-grab active:cursor-grabbing
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:w-5
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:border-[3px]
                [&::-webkit-slider-thumb]:border-accent
                [&::-webkit-slider-thumb]:shadow-md
                [&::-webkit-slider-runnable-track]:bg-transparent
                [&::-moz-range-thumb]:h-5
                [&::-moz-range-thumb]:w-5
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-white
                [&::-moz-range-thumb]:border-[3px]
                [&::-moz-range-thumb]:border-accent
                [&::-moz-range-thumb]:shadow-md"
              style={{ zIndex: 4 }}
            />
          </div>

          {/* Tick labels */}
          <div className="flex justify-between mt-1 px-1">
            <span className="text-[10px] text-muted">Feb 1</span>
            <span className="text-[10px] text-muted">Feb 15</span>
            <span className="text-[10px] text-muted">Mar 1</span>
            <span className="text-[10px] text-muted">Mar 15</span>
            <span className="text-[10px] text-muted">Mar 31</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
