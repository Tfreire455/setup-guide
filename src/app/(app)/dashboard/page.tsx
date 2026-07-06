import Link from "next/link";
import {
  ArrowRight,
  MonitorSmartphone,
  Package,
  Plus,
  Sparkles,
  Terminal,
  TriangleAlert,
  Wrench,
} from "lucide-react";

import { PriorityBadge, RecStatusBadge } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { OsCard } from "@/components/os/os-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { timeAgo } from "@/lib/utils";
import type {
  AiRecommendation,
  ChangeLog,
  NpmPackage,
  OperatingSystem,
  Tool,
} from "@/types";

const ENTITY_LABEL: Record<string, string> = {
  operating_systems: "ambiente",
  tools: "ferramenta",
  npm_packages: "pacote",
  commands: "comando",
  ai_recommendations: "recomendacao",
  setup_templates: "setup",
};

const ACTION_LABEL: Record<string, string> = {
  INSERT: "criou",
  UPDATE: "editou",
  DELETE: "removeu",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    { data: profile },
    { data: osList },
    { data: tools },
    { data: packages },
    { count: cmdCount },
    { data: recs },
    { data: logs },
  ] = await Promise.all([
    supabase.from("profiles").select("name").eq("id", user?.id ?? "").single(),
    supabase.from("operating_systems").select("*").order("updated_at", { ascending: false }),
    supabase.from("tools").select("os_id, status"),
    supabase.from("npm_packages").select("id, status"),
    supabase.from("commands").select("id", { count: "exact", head: true }),
    supabase
      .from("ai_recommendations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("change_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const systems = (osList ?? []) as OperatingSystem[];
  const allTools = (tools ?? []) as Pick<Tool, "os_id" | "status">[];
  const allPackages = (packages ?? []) as Pick<NpmPackage, "id" | "status">[];
  const recentRecs = (recs ?? []) as unknown as AiRecommendation[];
  const recentLogs = (logs ?? []) as ChangeLog[];

  const needsUpdate = allTools.filter((t) => t.status === "needs_update").length;
  const legacyPkgs = allPackages.filter(
    (p) => p.status === "legacy" || p.status === "replaced",
  ).length;

  const toolsByOs = new Map<string, Pick<Tool, "status">[]>();
  for (const t of allTools) {
    const arr = toolsByOs.get(t.os_id) ?? [];
    arr.push({ status: t.status });
    toolsByOs.set(t.os_id, arr);
  }

  const firstName = (profile?.name ?? "").split(/\s+/)[0];

  return (
    <div>
      <PageHeader
        title={firstName ? `Ola, ${firstName}` : "Dashboard"}
        description="Visao geral dos seus ambientes de desenvolvimento."
      >
        <Button asChild variant="secondary">
          <Link href="/ai-assistant">
            <Sparkles className="h-4 w-4" />
            Analisar com IA
          </Link>
        </Button>
        <Button asChild>
          <Link href="/os/new">
            <Plus className="h-4 w-4" />
            Novo ambiente
          </Link>
        </Button>
      </PageHeader>

      {/* Metricas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Ambientes" value={systems.length} icon={MonitorSmartphone} />
        <StatCard
          label="Ferramentas"
          value={allTools.length}
          icon={Wrench}
          hint={needsUpdate > 0 ? `${needsUpdate} para atualizar` : "todas em dia"}
          accent={needsUpdate > 0 ? "warning" : "success"}
        />
        <StatCard label="Pacotes npm" value={allPackages.length} icon={Package} />
        <StatCard label="Comandos" value={cmdCount ?? 0} icon={Terminal} />
      </div>

      {/* Alertas */}
      {needsUpdate > 0 || legacyPkgs > 0 ? (
        <Card className="mt-6 border-warning/40 bg-warning/5">
          <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/15 text-warning">
                <TriangleAlert className="h-5 w-5" />
              </div>
              <p className="text-sm">
                {needsUpdate > 0 ? (
                  <>
                    <strong>{needsUpdate}</strong> ferramenta(s) precisam de atualizacao.{" "}
                  </>
                ) : null}
                {legacyPkgs > 0 ? (
                  <>
                    <strong>{legacyPkgs}</strong> pacote(s) marcados como legado/substituido.
                  </>
                ) : null}
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/ai-assistant">Ver recomendacoes</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Ambientes */}
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-medium">Seus ambientes</h2>
            {systems.length > 0 ? (
              <Link
                href="/os"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                Ver todos <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : null}
          </div>

          {systems.length === 0 ? (
            <EmptyState
              icon={MonitorSmartphone}
              title="Comece cadastrando um ambiente"
              description="Registre seu sistema operacional e as ferramentas que voce usa."
              action={
                <Button asChild>
                  <Link href="/os/new">
                    <Plus className="h-4 w-4" />
                    Criar ambiente
                  </Link>
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {systems.slice(0, 4).map((os) => (
                <OsCard key={os.id} os={os} tools={toolsByOs.get(os.id) ?? []} />
              ))}
            </div>
          )}
        </div>

        {/* Coluna lateral */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-primary" />
                Recomendacoes recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentRecs.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Sem recomendacoes ainda.{" "}
                  <Link href="/ai-assistant" className="text-primary hover:underline">
                    Rode uma analise
                  </Link>
                  .
                </p>
              ) : (
                <ul className="space-y-3">
                  {recentRecs.map((r) => (
                    <li key={r.id} className="border-b pb-3 last:border-0 last:pb-0">
                      <p className="line-clamp-2 text-sm font-medium">{r.title}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <PriorityBadge priority={r.priority} />
                        <RecStatusBadge status={r.status} />
                        <span className="text-xs text-muted-foreground">
                          {timeAgo(r.created_at)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Ultimas edicoes</CardTitle>
            </CardHeader>
            <CardContent>
              {recentLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma alteracao registrada.</p>
              ) : (
                <ul className="space-y-2.5 text-sm">
                  {recentLogs.map((log) => (
                    <li key={log.id} className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground">
                        <span className="text-foreground">
                          {ACTION_LABEL[log.action] ?? log.action}
                        </span>{" "}
                        {ENTITY_LABEL[log.entity_type] ?? log.entity_type}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {timeAgo(log.created_at)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
