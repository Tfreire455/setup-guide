import Link from "next/link";
import { MonitorSmartphone, Plus } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { OsCard } from "@/components/os/os-card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import type { OperatingSystem, Tool } from "@/types";

export default async function OsListPage() {
  const supabase = await createClient();

  const [{ data: osList }, { data: tools }] = await Promise.all([
    supabase.from("operating_systems").select("*").order("updated_at", { ascending: false }),
    supabase.from("tools").select("os_id, status"),
  ]);

  const systems = (osList ?? []) as OperatingSystem[];
  const allTools = (tools ?? []) as Pick<Tool, "os_id" | "status">[];

  const toolsByOs = new Map<string, Pick<Tool, "status">[]>();
  for (const t of allTools) {
    const arr = toolsByOs.get(t.os_id) ?? [];
    arr.push({ status: t.status });
    toolsByOs.set(t.os_id, arr);
  }

  return (
    <div>
      <PageHeader
        title="Sistemas"
        description="Seus ambientes de desenvolvimento registrados."
      >
        <Button asChild>
          <Link href="/os/new">
            <Plus className="h-4 w-4" />
            Novo ambiente
          </Link>
        </Button>
      </PageHeader>

      {systems.length === 0 ? (
        <EmptyState
          icon={MonitorSmartphone}
          title="Nenhum ambiente ainda"
          description="Cadastre seu primeiro sistema operacional para comecar a organizar ferramentas, pacotes e comandos."
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {systems.map((os) => (
            <OsCard key={os.id} os={os} tools={toolsByOs.get(os.id) ?? []} />
          ))}
        </div>
      )}
    </div>
  );
}
