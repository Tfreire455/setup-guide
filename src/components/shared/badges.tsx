import { AlertTriangle, Lock, ShieldAlert, ShieldCheck } from "lucide-react";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  OsHealth,
  PackageStatus,
  RecommendationPriority,
  RecommendationStatus,
  RiskLevel,
  ToolStatus,
} from "@/types";

// --- Risco -------------------------------------------------------------------
const RISK_MAP: Record<RiskLevel, { label: string; variant: BadgeProps["variant"] }> = {
  low: { label: "Risco baixo", variant: "success" },
  medium: { label: "Risco médio", variant: "warning" },
  high: { label: "Risco alto", variant: "destructive" },
};

export function RiskBadge({ level, short }: { level: RiskLevel; short?: boolean }) {
  const cfg = RISK_MAP[level] ?? RISK_MAP.low;
  return (
    <Badge variant={cfg.variant}>
      {level === "high" ? (
        <ShieldAlert className="h-3 w-3" />
      ) : level === "medium" ? (
        <AlertTriangle className="h-3 w-3" />
      ) : (
        <ShieldCheck className="h-3 w-3" />
      )}
      {short ? cfg.label.replace("Risco ", "") : cfg.label}
    </Badge>
  );
}

// --- Saúde do ambiente ---------------------------------------------------------
const HEALTH_MAP: Record<
  OsHealth,
  { label: string; variant: BadgeProps["variant"]; dot: string }
> = {
  updated: { label: "Atualizado", variant: "success", dot: "bg-success" },
  attention: { label: "Atenção", variant: "warning", dot: "bg-warning" },
  outdated: { label: "Desatualizado", variant: "destructive", dot: "bg-destructive" },
  incomplete: { label: "Incompleto", variant: "secondary", dot: "bg-muted-foreground" },
};

export function HealthBadge({ health }: { health: OsHealth }) {
  const cfg = HEALTH_MAP[health] ?? HEALTH_MAP.incomplete;
  return (
    <Badge variant={cfg.variant}>
      <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse-dot", cfg.dot)} />
      {cfg.label}
    </Badge>
  );
}

// --- Status de ferramenta --------------------------------------------------------
const TOOL_STATUS_MAP: Record<ToolStatus, { label: string; variant: BadgeProps["variant"] }> = {
  installed: { label: "Instalado", variant: "success" },
  pending: { label: "Pendente", variant: "secondary" },
  needs_update: { label: "Atualizar", variant: "warning" },
  removed: { label: "Removido", variant: "destructive" },
};

export function ToolStatusBadge({ status }: { status: string }) {
  const cfg = TOOL_STATUS_MAP[status as ToolStatus] ?? TOOL_STATUS_MAP.pending;
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

// --- Status de pacote npm --------------------------------------------------------
const PKG_STATUS_MAP: Record<PackageStatus, { label: string; variant: BadgeProps["variant"] }> = {
  active: { label: "Ativo", variant: "success" },
  legacy: { label: "Legado", variant: "warning" },
  replaced: { label: "Substituído", variant: "destructive" },
  test_update: { label: "Testar update", variant: "secondary" },
};

export function PackageStatusBadge({ status }: { status: string }) {
  const cfg = PKG_STATUS_MAP[status as PackageStatus] ?? PKG_STATUS_MAP.active;
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

// --- Prioridade de recomendação ----------------------------------------------------
const PRIORITY_MAP: Record<
  RecommendationPriority,
  { label: string; sym: string; variant: BadgeProps["variant"] }
> = {
  high: { label: "Alta", sym: "▲", variant: "destructive" },
  medium: { label: "Média", sym: "■", variant: "warning" },
  low: { label: "Baixa", sym: "▽", variant: "secondary" },
};

export function PriorityBadge({ priority }: { priority: string }) {
  const cfg = PRIORITY_MAP[priority as RecommendationPriority] ?? PRIORITY_MAP.medium;
  return (
    <Badge variant={cfg.variant}>
      <span aria-hidden>{cfg.sym}</span>
      {cfg.label}
    </Badge>
  );
}

// --- Status de recomendação --------------------------------------------------------
const REC_STATUS_MAP: Record<
  RecommendationStatus,
  { label: string; variant: BadgeProps["variant"] }
> = {
  new: { label: "Nova", variant: "default" },
  want_to_test: { label: "Quero testar", variant: "warning" },
  adopted: { label: "Adotada", variant: "success" },
  ignored: { label: "Ignorada", variant: "secondary" },
};

export function RecStatusBadge({ status }: { status: string }) {
  const cfg = REC_STATUS_MAP[status as RecommendationStatus] ?? REC_STATUS_MAP.new;
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

export function AdminBadge() {
  return (
    <Badge variant="destructive">
      <Lock className="h-3 w-3" />
      sudo
    </Badge>
  );
}
