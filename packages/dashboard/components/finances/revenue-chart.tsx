"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { monthlyRevenue } from "@/lib/mock-data";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export function RevenueChart() {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-base">Revenue vs Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyRevenue} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#635BFF" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#635BFF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="month"
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
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#635BFF"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke="#EF4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorExpenses)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
