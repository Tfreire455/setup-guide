import { PageHeader } from "@/components/shared/page-header";
import { CommandsView } from "@/components/commands/commands-view";
import { createClient } from "@/lib/supabase/server";
import type { Command, OperatingSystem } from "@/types";

export default async function CommandsPage() {
  const supabase = await createClient();

  const [{ data: osList }, { data: commands }] = await Promise.all([
    supabase.from("operating_systems").select("id, name").order("name"),
    supabase
      .from("commands")
      .select("*")
      .order("is_favorite", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  const osOptions = (osList ?? []) as Pick<OperatingSystem, "id" | "name">[];
  const rows = (commands ?? []) as Command[];

  return (
    <div>
      <PageHeader
        title="Comandos"
        description="Sua biblioteca pessoal de comandos uteis, com nivel de risco e favoritos."
      />
      <CommandsView commands={rows} osOptions={osOptions} />
    </div>
  );
}
