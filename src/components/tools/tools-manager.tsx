"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Pencil, Plus, Trash2, Wrench } from "lucide-react";
import { toast } from "sonner";

import { deleteTool } from "@/actions/tools";
import { ToolStatusBadge } from "@/components/shared/badges";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState } from "@/components/shared/empty-state";
import { ToolForm } from "@/components/tools/tool-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { labelFor, TOOL_CATEGORIES } from "@/lib/constants";
import type { Tool } from "@/types";

function ToolRowActions({ tool }: { tool: Tool }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  async function handleDelete() {
    const res = await deleteTool(tool.id);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Ferramenta removida.");
    router.refresh();
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Editar ferramenta</DialogTitle>
          </DialogHeader>
          <ToolForm initial={tool} fixedOsId={tool.os_id} onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        trigger={
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        }
        title="Remover ferramenta?"
        confirmLabel="Remover"
        danger
        onConfirm={handleDelete}
      />
    </div>
  );
}

export function ToolsManager({ osId, tools }: { osId: string; tools: Tool[] }) {
  const [addOpen, setAddOpen] = React.useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-medium">
          <Wrench className="h-4 w-4 text-muted-foreground" />
          Ferramentas
          <span className="text-sm font-normal text-muted-foreground">({tools.length})</span>
        </h2>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Adicionar ferramenta</DialogTitle>
            </DialogHeader>
            <ToolForm fixedOsId={osId} onDone={() => setAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {tools.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="Sem ferramentas neste ambiente"
          description="Adicione runtimes, CLIs e editores para acompanhar versoes e status."
          action={
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" />
              Adicionar ferramenta
            </Button>
          }
        />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ferramenta</TableHead>
                <TableHead className="hidden sm:table-cell">Categoria</TableHead>
                <TableHead className="hidden md:table-cell">Versao</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tools.map((tool) => (
                <TableRow key={tool.id}>
                  <TableCell>
                    <div className="flex items-center gap-2 font-medium">
                      {tool.name}
                      {tool.documentation_url ? (
                        <a
                          href={tool.documentation_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : null}
                    </div>
                    {tool.version_check_command ? (
                      <div className="mt-1 flex items-center gap-1">
                        <code className="font-mono text-[11px] text-muted-foreground">
                          {tool.version_check_command}
                        </code>
                        <CopyButton text={tool.version_check_command} className="h-6 w-6" />
                      </div>
                    ) : null}
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                    {labelFor(TOOL_CATEGORIES, tool.category)}
                  </TableCell>
                  <TableCell className="hidden font-mono text-xs md:table-cell">
                    {tool.installed_version ?? "-"}
                  </TableCell>
                  <TableCell>
                    <ToolStatusBadge status={tool.status} />
                  </TableCell>
                  <TableCell>
                    <ToolRowActions tool={tool} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
