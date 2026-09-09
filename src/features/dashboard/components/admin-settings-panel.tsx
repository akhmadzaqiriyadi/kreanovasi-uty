"use client";

import { Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface AdminSettingsPanelProps {
  maintenanceMode: boolean;
  rateLimiting: boolean;
  onMaintenanceModeChange: (checked: boolean) => void;
  onRateLimitingChange: (checked: boolean) => void;
  onSave: () => void;
}

export function AdminSettingsPanel({
  maintenanceMode,
  rateLimiting,
  onMaintenanceModeChange,
  onRateLimitingChange,
  onSave,
}: AdminSettingsPanelProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
        <Sliders className="h-5 w-5 text-primary" />
        <span>Pengaturan Sistem</span>
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-border/30 rounded-xl bg-zinc-50/20 dark:bg-zinc-950/10">
          <div>
            <h4 className="font-semibold text-xs text-foreground">
              Mode Pemeliharaan (Maintenance)
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Batasi akses hanya untuk administrator.
            </p>
          </div>
          <Switch
            checked={maintenanceMode}
            onCheckedChange={onMaintenanceModeChange}
          />
        </div>

        <div className="flex items-center justify-between p-4 border border-border/30 rounded-xl bg-zinc-50/20 dark:bg-zinc-950/10">
          <div>
            <h4 className="font-semibold text-xs text-foreground">
              Simulasi Rate Limiting
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Simulasikan pembatasan beban API request di sisi client.
            </p>
          </div>
          <Switch
            checked={rateLimiting}
            onCheckedChange={onRateLimitingChange}
          />
        </div>
      </div>

      <Button
        onClick={onSave}
        className="w-full bg-gradient-to-r from-primary to-purple-600 hover:shadow-primary/30"
      >
        Simpan Perubahan
      </Button>
    </div>
  );
}
