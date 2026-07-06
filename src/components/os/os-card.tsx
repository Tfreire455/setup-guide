import Link from "next/link";
import { Wrench } from "lucide-react";

import { HealthBadge } from "@/components/shared/badges";
import { Badge } from "@/components/ui/badge";
import { labelFor, OS_ICON, OS_TYPES } from "@/lib/constants";
import { computeHealth } from "@/lib/health";
import type { OperatingSystem, OsType, Tool } from "@/types";

interface OsCardProps {
  os: OperatingSystem;
  tools?: Pick<Tool, "status">[];
}

export function OsCard({ os, tools = [] }: OsCardProps) {
  const total = tools.length;
  const needsUpdate = tools.filter((t) => t.status === "needs_update").length;
  const pending = tools.filter((t) => t.status === "pending").length;
  const removed = tools.filter((t) => t.status === "removed").length;
  const health = computeHealth({ total, needsUpdate, pending, removed });

  const Icon = OS_ICON[os.os_type as OsType] ?? OS_ICON.outro;

  return (
    <Link href={`/os/${os.id}`} className="group block h-full">
      <article className="relative flex h-full flex-col gap-4 border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:glow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-border bg-secondary/50 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-[15px] font-semibold uppercase tracking-wide">
                {os.name}
              </p>
              <p className="truncate font-mono text-[11px] text-muted-foreground">
                {labelFor(OS_TYPES, os.os_type)}
                {os.distribution ? ` · ${os.distribution}` : ""}
                {os.version ? ` ${os.version}` : ""}
              </p>
            </div>
          </div>
          <HealthBadge health={health} />
        </div>

        {os.tags?.length ? (
          <div className="flex flex-wrap gap-1">
            {os.tags.slice(0, 4).map((t) => (
              <Badge key={t} variant="outline">
                {t}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3 font-mono text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Wrench className="h-3.5 w-3.5 text-primary/70" />
            {total} {total === 1 ? "ferramenta" : "ferramentas"}
            {needsUpdate > 0 ? (
              <span className="text-warning">· {needsUpdate} p/ atualizar</span>
            ) : null}
          </span>
          <span
            aria-hidden
            className="text-primary transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </div>
      </article>
    </Link>
  );
}
