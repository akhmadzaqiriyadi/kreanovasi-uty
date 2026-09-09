"use client";

import { Activity, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MockUser, StatCardData } from "../types";
import { AdminStatsCard } from "./admin-stats-card";

interface AdminStatsOverviewProps {
  mockUsers: MockUser[];
  onSimulateSync: () => void;
}

export function AdminStatsOverview({
  mockUsers,
  onSimulateSync,
}: AdminStatsOverviewProps) {
  const stats: StatCardData[] = [
    {
      title: "Total User",
      value: mockUsers.length,
      change: "+12%",
      changePositive: true,
      chartType: "area",
      chartColor: "oklch(0.627 0.265 303.9)", // Primary brand tone
      chartData: [
        { value: 10 },
        { value: 12 },
        { value: 15 },
        { value: 18 },
        { value: 16 },
        { value: 20 },
        { value: mockUsers.length },
      ],
    },
    {
      title: "Beban CPU",
      value: "1.8%",
      change: "-4%",
      changePositive: true,
      chartType: "area",
      chartColor: "oklch(0.7 0.15 145)", // Emerald green indicator
      chartData: [
        { value: 4.5 },
        { value: 3.2 },
        { value: 2.8 },
        { value: 3.9 },
        { value: 2.1 },
        { value: 1.5 },
        { value: 1.8 },
      ],
    },
    {
      title: "Total Request",
      value: "1,248",
      change: "+28%",
      changePositive: true,
      chartType: "bar",
      chartColor: "oklch(0.7 0.15 50)", // Orange-yellow warning tint
      chartData: [
        { value: 80 },
        { value: 120 },
        { value: 95 },
        { value: 150 },
        { value: 200 },
        { value: 180 },
        { value: 248 },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        <span>Statistik &amp; Layanan</span>
      </h2>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <AdminStatsCard key={stat.title} data={stat} />
        ))}
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-bold text-sm text-foreground flex items-center gap-2">
            <Shield className="h-4 w-4 text-purple-500" />
            <span>Keamanan Admin Terproteksi</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-3">
          <p>
            Semua data administratif pada dashboard dilindungi oleh proxy di
            level middleware Next.js. Ketika Anda mengintegrasikan backend
            native seperti Hono, Elysia, atau Fastify, Anda dapat menyertakan
            bearer token JWT admin langsung pada header otorisasi API Client.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onSimulateSync}
            className="gap-1.5"
          >
            Simulasi DB Sync
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
