"use client";

import { useState } from "react";
import { toast } from "sonner";

import type { MockUser, TabType } from "../types";

export function useAdminDashboardLogic() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [rateLimiting, setRateLimiting] = useState(true);

  // Simulated users database
  const [mockUsers, setMockUsers] = useState<MockUser[]>([
    {
      id: "1",
      name: "Jekz Dev",
      email: "user@example.com",
      role: "admin",
      status: "active",
    },
    {
      id: "2",
      name: "Guest User",
      email: "guest@example.com",
      role: "user",
      status: "active",
    },
    {
      id: "3",
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "editor",
      status: "active",
    },
    {
      id: "4",
      name: "Bob Smith",
      email: "bob@example.com",
      role: "user",
      status: "suspended",
    },
    {
      id: "5",
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "user",
      status: "pending",
    },
  ]);

  const handleStatusToggle = (
    userId: string,
    currentStatus: MockUser["status"],
  ) => {
    const newStatus: MockUser["status"] =
      currentStatus === "active" ? "suspended" : "active";
    setMockUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)),
    );
    toast.success(`Status user berhasil diubah menjadi ${newStatus}`);
  };

  const handleSimulateSync = () => {
    toast.info("Sinkronisasi database...", {
      description: "Menghubungkan ke mock database server.",
    });
    setTimeout(() => {
      toast.success("Sinkronisasi selesai!", {
        description: "Data database berhasil diperbarui.",
      });
    }, 1200);
  };

  const handleSaveSettings = () => {
    toast.success("Setelan sistem berhasil disimpan!");
  };

  // Filtered users for User Management Tab
  const filteredUsers = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    maintenanceMode,
    setMaintenanceMode,
    rateLimiting,
    setRateLimiting,
    mockUsers,
    filteredUsers,
    handleStatusToggle,
    handleSimulateSync,
    handleSaveSettings,
  };
}
