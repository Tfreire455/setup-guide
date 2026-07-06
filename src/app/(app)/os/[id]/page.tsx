import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";

import { OsActions } from "@/components/os/os-actions";
import { ToolsManager } from "@/components/tools/tools-manager";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  labelFor,
  OS_ICON,
  OS_TYPES,
  PACKAGE_MANAGERS,
  TERMINALS,
} from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import type { OperatingSystem, OsType, Tool } from "@/types";

function InfoItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm">{value || "-"}</dd>
    </div>
  );
}

export default async function OsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: os } = await supabase
    .from("operating_systems")
    .select("*")
    .eq("id", id)
    .single();

  if (!os) notFound();

  const typedOs = os as OperatingSystem;

  const { data: tools } = await supabase
    .from("tools")
    .select("*")
    .eq("os_id", id)
    .order("name", { ascending: true });

  const Icon = OS_ICON[(typedOs.os_type as OsType)] ?? OS_ICON.outro;

  return (
    <div className="space-y-6">
      <Link
        href="/os"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Sistemas
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-foreground">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{typedOs.name}</h1>
            <p className="text-sm text-muted-foreground">
              {labelFor(OS_TYPES, typedOs.os_type)}
              {typedOs.distribution ? ` · ${typedOs.distribution}` : ""}
              {typedOs.version ? ` ${typedOs.version}` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="secondary" size="sm">
            <Link href={`/ai-assistant?os=${typedOs.id}`}>
              <Sparkles className="h-4 w-4" />
              Analisar com IA
            </Link>
          </Button>
          <OsActions os={typedOs} />
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
            <InfoItem label="Arquitetura" value={typedOs.architecture} />
            <InfoItem
              label="Gerenciador"
              value={labelFor(PACKAGE_MANAGERS, typedOs.package_manager)}
            />
            <InfoItem label="Terminal" value={labelFor(TERMINALS, typedOs.terminal)} />
            <InfoItem label="Shell" value={typedOs.shell} />
          </dl>

          {typedOs.tags?.length ? (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {typedOs.tags.map((t) => (
                <Badge key={t} variant="outline">
                  {t}
                </Badge>
              ))}
            </div>
          ) : null}

          {typedOs.notes ? (
            <div className="mt-5 rounded-md bg-secondary/40 p-4 text-sm text-muted-foreground">
              {typedOs.notes}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <ToolsManager osId={typedOs.id} tools={(tools ?? []) as Tool[]} />
    </div>
  );
}
