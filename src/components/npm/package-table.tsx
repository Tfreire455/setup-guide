"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deletePackage } from "@/actions/packages";
import { PackageStatusBadge } from "@/components/shared/badges";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CopyButton } from "@/components/shared/copy-button";
import { PackageForm } from "@/components/npm/package-form";
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
import { labelFor, PACKAGE_SCOPES } from "@/lib/constants";
import type { NpmPackage } from "@/types";

interface OsOption {
  id: string;
  name: string;
}

function RowActions({ pkg, osOptions }: { pkg: NpmPackage; osOptions: OsOption[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  async function handleDelete() {
    const res = await deletePackage(pkg.id);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Pacote removido.");
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
            <DialogTitle>Editar pacote</DialogTitle>
          </DialogHeader>
          <PackageForm initial={pkg} osOptions={osOptions} onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        trigger={
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        }
        title="Remover pacote?"
        confirmLabel="Remover"
        danger
        onConfirm={handleDelete}
      />
    </div>
  );
}

export function PackageTable({
  packages,
  osOptions,
}: {
  packages: NpmPackage[];
  osOptions: OsOption[];
}) {
  const [addOpen, setAddOpen] = React.useState(false);
  const [scope, setScope] = React.useState<string>("all");

  const filtered = scope === "all" ? packages : packages.filter((p) => p.scope === scope);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:w-48">
          <Select value={scope} onValueChange={setScope}>
            <SelectTrigger>
              <SelectValue placeholder="Escopo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os escopos</SelectItem>
              {PACKAGE_SCOPES.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Novo pacote
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Novo pacote npm</DialogTitle>
            </DialogHeader>
            <PackageForm osOptions={osOptions} onDone={() => setAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pacote</TableHead>
              <TableHead className="hidden md:table-cell">Escopo</TableHead>
              <TableHead className="hidden lg:table-cell">Tags</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell>
                  <div className="flex items-center gap-2 font-medium">
                    <span className="font-mono text-sm">{pkg.name}</span>
                    {pkg.version ? (
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {pkg.version}
                      </Badge>
                    ) : null}
                    {pkg.npm_url ? (
                      <a
                        href={pkg.npm_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : null}
                  </div>
                  {pkg.install_command ? (
                    <div className="mt-1 flex items-center gap-1">
                      <code className="font-mono text-[11px] text-muted-foreground">
                        {pkg.install_command}
                      </code>
                      <CopyButton text={pkg.install_command} className="h-6 w-6" />
                    </div>
                  ) : null}
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                  {labelFor(PACKAGE_SCOPES, pkg.scope)}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {(pkg.tags ?? []).slice(0, 3).map((t) => (
                      <Badge key={t} variant="secondary" className="text-[10px]">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <PackageStatusBadge status={pkg.status} />
                </TableCell>
                <TableCell>
                  <RowActions pkg={pkg} osOptions={osOptions} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
