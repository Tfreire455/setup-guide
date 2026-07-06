import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/** Tela vazia como convite a agir, no vocabulario do console. */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "bg-grid flex flex-col items-center justify-center border border-dashed border-border px-6 py-16 text-center",
        className,
      )}
    >
      <div className="mb-5 flex items-center gap-2 font-mono text-lg text-primary/70">
        <span aria-hidden>[</span>
        <Icon className="h-6 w-6 text-primary" />
        <span aria-hidden>]</span>
      </div>
      <h3 className="font-display text-base font-semibold uppercase tracking-wide">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-sm font-mono text-[13px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-7">{action}</div> : null}
    </div>
  );
}
