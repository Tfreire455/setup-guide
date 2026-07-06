import type { OsHealth } from "@/types";

/**
 * Calcula a saude de um ambiente a partir do estado das ferramentas.
 * - incomplete: nenhuma ferramenta registrada
 * - outdated:   ha ferramentas marcadas como "precisa atualizar" ou "removida"
 * - attention:  ha ferramentas pendentes
 * - updated:    tudo instalado e em dia
 */
export function computeHealth(counts: {
  total: number;
  needsUpdate: number;
  pending: number;
  removed: number;
}): OsHealth {
  if (counts.total === 0) return "incomplete";
  if (counts.needsUpdate > 0 || counts.removed > 0) return "outdated";
  if (counts.pending > 0) return "attention";
  return "updated";
}

export function healthScore(counts: {
  total: number;
  installed: number;
  needsUpdate: number;
  pending: number;
}): number {
  if (counts.total === 0) return 0;
  const good = counts.installed;
  const penalty = counts.needsUpdate * 1 + counts.pending * 0.5;
  const raw = ((good - penalty) / counts.total) * 100;
  return Math.max(0, Math.min(100, Math.round(raw)));
}
