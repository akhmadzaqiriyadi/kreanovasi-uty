"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StatCardData } from "../types";

interface AdminStatsCardProps {
  data: StatCardData;
}

export function AdminStatsCard({ data }: AdminStatsCardProps) {
  const {
    title,
    value,
    change,
    changePositive,
    chartData,
    chartType,
    chartColor,
  } = data;

  const chartId = `gradient-${title.replace(/\s+/g, "").toLowerCase()}`;

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={`flex items-center gap-0.5 text-xs font-bold ${
            changePositive ? "text-emerald-500" : "text-destructive"
          }`}
        >
          {changePositive ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          <span>{change}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-2xl font-black text-foreground">{value}</div>
        <div className="h-[60px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart
                data={chartData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id={chartId} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={chartColor}
                      stopOpacity={0.3}
                    />
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={chartColor}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#${chartId})`}
                />
              </AreaChart>
            ) : (
              <BarChart
                data={chartData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <Bar dataKey="value" fill={chartColor} radius={[2, 2, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
