import Link from "next/link";
import { Plus, Wrench } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { ToolsTable, type ToolWithOs } from "@/components/tools/tools-table";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import type { OperatingSystem } from "@/types";

export default async function ToolsPage() {
  const supabase = await createClient();

  const [{ data: osList }, { data: tools }] = await Promise.all([
    supabase.from("operating_systems").select("id, name").order("name"),
    supabase
      .from("tools")
      .select("*, operating_systems(name)")
      .order("name", { ascending: true }),
  ]);

  const osOptions = (osList ?? []) as Pick<OperatingSystem, "id" | "name">[];

  const rows: ToolWithOs[] = (tools ?? []).map((t) => {
    const { operating_systems, ...rest } = t as Record<string, unknown> & {
      operating_systems?: { name?: string } | null;
    };
    return {
      ...(rest as unknown as ToolWithOs),
      os_name: operating_systems?.name ?? "-",
    };
  });

  return (
    <div>
      <PageHeader
        title="Ferramentas"
        description="Runtimes, CLIs, editores e tudo que voce instala nos seus ambientes."
      />

      {osOptions.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="Cadastre um ambiente primeiro"
          description="As ferramentas pertencem a um sistema operacional. Crie um ambiente para comecar."
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
        <ToolsTable tools={rows} osOptions={osOptions} />
      )}
    </div>
  );
}
