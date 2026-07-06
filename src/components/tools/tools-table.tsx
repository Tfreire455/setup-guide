"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteTool } from "@/actions/tools";
import { ToolStatusBadge } from "@/components/shared/badges";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CopyButton } from "@/components/shared/copy-button";
import { ToolForm } from "@/components/tools/tool-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export interface ToolWithOs extends Tool {
  os_name: string;
}

interface OsOption {
  id: string;
  name: string;
}

function RowActions({ tool, osOptions }: { tool: Tool; osOptions: OsOption[] }) {
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
          <ToolForm initial={tool} osOptions={osOptions} onDone={() => setOpen(false)} />
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

export function ToolsTable({
  tools,
  osOptions,
}: {
  tools: ToolWithOs[];
  osOptions: OsOption[];
}) {
  const [addOpen, setAddOpen] = React.useState(false);
  const [filter, setFilter] = React.useState<string>("all");

  const filtered = filter === "all" ? tools : tools.filter((t) => t.os_id === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:w-56">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por ambiente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os ambientes</SelectItem>
              {osOptions.map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button disabled={osOptions.length === 0}>
              <Plus className="h-4 w-4" />
              Nova ferramenta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Nova ferramenta</DialogTitle>
            </DialogHeader>
            <ToolForm osOptions={osOptions} onDone={() => setAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ferramenta</TableHead>
              <TableHead className="hidden md:table-cell">Ambiente</TableHead>
              <TableHead className="hidden sm:table-cell">Categoria</TableHead>
              <TableHead className="hidden lg:table-cell">Versao</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((tool) => (
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
                <TableCell className="hidden md:table-cell">
                  <Link
                    href={`/os/${tool.os_id}`}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Badge variant="secondary">{tool.os_name}</Badge>
                  </Link>
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                  {labelFor(TOOL_CATEGORIES, tool.category)}
                </TableCell>
                <TableCell className="hidden font-mono text-xs lg:table-cell">
                  {tool.installed_version ?? "-"}
                </TableCell>
                <TableCell>
                  <ToolStatusBadge status={tool.status} />
                </TableCell>
                <TableCell>
                  <RowActions tool={tool} osOptions={osOptions} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
