import type { LucideIcon } from "lucide-react";

import { CountUp } from "@/components/shared/count-up";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  accent?: "primary" | "success" | "warning" | "destructive";
}

const ACCENT: Record<NonNullable<StatCardProps["accent"]>, { text: string; dot: string }> = {
  primary: { text: "text-primary", dot: "bg-primary" },
  success: { text: "text-success", dot: "bg-success" },
  warning: { text: "text-warning", dot: "bg-warning" },
  destructive: { text: "text-destructive", dot: "bg-destructive" },
};

/** Metrica do painel: moldura com cantoneiras, numero mono com count-up. */
export function StatCard({ label, value, icon: Icon, hint, accent = "primary" }: StatCardProps) {
  const a = ACCENT[accent];

  return (
    <div className="tech-corners relative border border-border bg-card p-5 transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {label}
        </p>
        <span className="flex h-8 w-8 items-center justify-center border border-border bg-secondary/50 text-primary">
          <Icon className="h-4 w-4" />
        </span>
      </div>

      <p className="mt-3 font-mono text-3xl font-semibold tabular-nums leading-none">
        {typeof value === "number" ? <CountUp value={value} /> : value}
      </p>

      {hint ? (
        <p className={cn("mt-2.5 flex items-center gap-1.5 font-mono text-[11px]", a.text)}>
          <span className={cn("h-1.5 w-1.5 rounded-full", a.dot)} />
          {hint}
        </p>
      ) : null}
    </div>
  );
}
