"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Star, Terminal, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteCommand, toggleCommandFavorite } from "@/actions/commands";
import { AdminBadge, RiskBadge } from "@/components/shared/badges";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState } from "@/components/shared/empty-state";
import { CommandForm } from "@/components/commands/command-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { labelFor, COMMAND_CATEGORIES } from "@/lib/constants";
import type { Command, RiskLevel } from "@/types";

interface OsOption {
  id: string;
  name: string;
}

function CommandCard({ cmd, osOptions }: { cmd: Command; osOptions: OsOption[] }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = React.useState(false);
  const [fav, setFav] = React.useState(cmd.is_favorite);

  async function toggleFav() {
    const next = !fav;
    setFav(next);
    const res = await toggleCommandFavorite(cmd.id, next);
    if (res.error) {
      setFav(!next);
      toast.error(res.error);
    }
  }

  async function handleDelete() {
    const res = await deleteCommand(cmd.id);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Comando removido.");
    router.refresh();
  }

  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium leading-snug">{cmd.title}</h3>
          <button
            type="button"
            onClick={toggleFav}
            className={cn(
              "shrink-0 transition-colors",
              fav ? "text-warning" : "text-muted-foreground hover:text-foreground",
            )}
            aria-label="Favoritar"
          >
            <Star className={cn("h-4 w-4", fav && "fill-current")} />
          </button>
        </div>

        <div className="group relative rounded-md border bg-secondary/40 p-2.5 pr-9">
          <code className="block overflow-x-auto whitespace-pre-wrap break-all font-mono text-xs">
            {cmd.command}
          </code>
          <CopyButton text={cmd.command} className="absolute right-1 top-1" />
        </div>

        {cmd.explanation ? (
          <p className="text-xs text-muted-foreground">{cmd.explanation}</p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
          <RiskBadge level={(cmd.risk_level as RiskLevel) ?? "low"} short />
          {cmd.requires_admin ? <AdminBadge /> : null}
          {cmd.category ? (
            <Badge variant="outline" className="text-[10px]">
              {labelFor(COMMAND_CATEGORIES, cmd.category)}
            </Badge>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-1 border-t pt-2">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Editar comando</DialogTitle>
              </DialogHeader>
              <CommandForm initial={cmd} osOptions={osOptions} onDone={() => setEditOpen(false)} />
            </DialogContent>
          </Dialog>
          <ConfirmDialog
            trigger={
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            }
            title="Remover comando?"
            confirmLabel="Remover"
            danger
            onConfirm={handleDelete}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function CommandsView({
  commands,
  osOptions,
}: {
  commands: Command[];
  osOptions: OsOption[];
}) {
  const [addOpen, setAddOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [onlyFav, setOnlyFav] = React.useState(false);

  const filtered = commands.filter((c) => {
    if (onlyFav && !c.is_favorite) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.command.toLowerCase().includes(q) ||
      (c.explanation ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Input
            placeholder="Buscar comando..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-xs"
          />
          <Button
            variant={onlyFav ? "default" : "outline"}
            size="sm"
            onClick={() => setOnlyFav((v) => !v)}
          >
            <Star className={cn("h-4 w-4", onlyFav && "fill-current")} />
            Favoritos
          </Button>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Novo comando
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Novo comando</DialogTitle>
            </DialogHeader>
            <CommandForm osOptions={osOptions} onDone={() => setAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Terminal}
          title={commands.length === 0 ? "Nenhum comando salvo" : "Nada encontrado"}
          description={
            commands.length === 0
              ? "Guarde aqueles comandos que voce sempre esquece: limpeza de cache, reset de ambiente, diagnosticos."
              : "Ajuste a busca ou o filtro de favoritos."
          }
          action={
            commands.length === 0 ? (
              <Button onClick={() => setAddOpen(true)}>
                <Plus className="h-4 w-4" />
                Novo comando
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((cmd) => (
            <CommandCard key={cmd.id} cmd={cmd} osOptions={osOptions} />
          ))}
        </div>
      )}
    </div>
  );
}
