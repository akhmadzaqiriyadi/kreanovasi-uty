"use client";

import { Search, UserCheck, Users, UserX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MockUser } from "../types";

interface AdminUsersTableProps {
  filteredUsers: MockUser[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onStatusToggle: (userId: string, currentStatus: MockUser["status"]) => void;
}

export function AdminUsersTable({
  filteredUsers,
  searchQuery,
  onSearchChange,
  onStatusToggle,
}: AdminUsersTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <span>Manajemen User</span>
        </h2>

        <div className="relative w-full sm:w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari user..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 text-xs rounded-xl"
          />
        </div>
      </div>

      <div className="border border-border/30 rounded-xl overflow-hidden bg-zinc-50/10 dark:bg-zinc-950/10">
        <Table>
          <TableHeader className="bg-zinc-100/50 dark:bg-zinc-900/30">
            <TableRow>
              <TableHead className="font-bold">Nama</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold">Role</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold pr-4">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-semibold text-foreground">
                    {u.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        u.role === "admin"
                          ? "destructive"
                          : u.role === "editor"
                            ? "default"
                            : "secondary"
                      }
                      className="capitalize text-[10px]"
                    >
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 capitalize text-muted-foreground text-xs">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          u.status === "active"
                            ? "bg-emerald-500"
                            : u.status === "suspended"
                              ? "bg-red-500"
                              : "bg-orange-500"
                        }`}
                      />
                      <span>{u.status}</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => onStatusToggle(u.id, u.status)}
                      className={
                        u.status === "active"
                          ? "border-red-500/20 hover:bg-red-500/10 text-red-500"
                          : "border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-500"
                      }
                      title={
                        u.status === "active" ? "Suspend User" : "Activate User"
                      }
                    >
                      {u.status === "active" ? (
                        <UserX className="h-3.5 w-3.5" />
                      ) : (
                        <UserCheck className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="p-8 text-center text-muted-foreground"
                >
                  User tidak ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
