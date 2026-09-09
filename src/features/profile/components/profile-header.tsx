"use client";

import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth";

export function ProfileHeader() {
  const { user } = useAuth();
  return (
    <div className="text-center space-y-2 pb-6 border-b border-border/30">
      <h2 className="text-2xl font-black text-foreground">{user?.name}</h2>
      <p className="text-muted-foreground text-sm">{user?.email}</p>
      <Badge
        variant="outline"
        className="capitalize px-3 py-0.5 text-[11px] font-semibold tracking-wider mt-1"
      >
        Role: {user?.role}
      </Badge>
    </div>
  );
}
