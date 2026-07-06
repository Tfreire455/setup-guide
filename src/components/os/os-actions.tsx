"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteOs } from "@/actions/os";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { OsForm } from "@/components/os/os-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { OperatingSystem } from "@/types";

export function OsActions({ os }: { os: OperatingSystem }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = React.useState(false);

  async function handleDelete() {
    const res = await deleteOs(os.id);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Ambiente removido.");
    router.push("/os");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4" />
            Editar
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar ambiente</DialogTitle>
          </DialogHeader>
          <OsForm initial={os} onDone={() => setEditOpen(false)} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        trigger={
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
            Excluir
          </Button>
        }
        title="Excluir ambiente?"
        description="Isso remove o ambiente e todas as ferramentas vinculadas. Nao da para desfazer."
        confirmLabel="Excluir"
        danger
        onConfirm={handleDelete}
      />
    </div>
  );
}
