"use client";

import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { BackendEvent } from "@/hooks/use-event-queries";

interface EventDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: BackendEvent | null;
  onConfirm: () => Promise<void>;
  isPending: boolean;
}

export function EventDeleteDialog({
  open,
  onOpenChange,
  event,
  onConfirm,
  isPending,
}: EventDeleteDialogProps) {
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full sm:max-w-md p-5 sm:p-6 rounded-2xl sm:rounded-3xl">
        <DialogHeader className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
            <Trash2 className="w-5 h-5" />
          </div>
          <DialogTitle className="text-base font-bold text-foreground">
            Hapus Agenda
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Apakah Anda yakin ingin menghapus agenda{" "}
            <span className="font-bold text-foreground">"{event.title}"</span>?
            Semua data pendaftaran peserta terkait juga akan terhapus dan
            tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0 pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="rounded-xl text-xs cursor-pointer"
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={isPending}
            className="rounded-xl text-xs font-semibold gap-1.5 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              <span>Ya, Hapus Agenda</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
