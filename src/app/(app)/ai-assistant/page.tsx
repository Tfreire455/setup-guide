import Link from "next/link";
import { Plus } from "lucide-react";

import { AiChatPanel } from "@/components/ai/ai-chat-panel";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { MonitorSmartphone } from "lucide-react";
import type { OperatingSystem } from "@/types";

export default async function AiAssistantPage({
  searchParams,
}: {
  searchParams: Promise<{ os?: string }>;
}) {
  const { os } = await searchParams;
  const supabase = await createClient();

  const { data: osList } = await supabase
    .from("operating_systems")
    .select("id, name")
    .order("name");

  const osOptions = (osList ?? []) as Pick<OperatingSystem, "id" | "name">[];

  return (
    <div>
      <PageHeader
        title="Assistente IA"
        description="Recomendacoes de atualizacao e modernizacao do seu setup, com fontes da web."
      />

      {osOptions.length === 0 ? (
        <EmptyState
          icon={MonitorSmartphone}
          title="Cadastre um ambiente para analisar"
          description="A IA precisa conhecer seu setup (ferramentas e pacotes) para sugerir atualizacoes."
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
        <AiChatPanel osOptions={osOptions} defaultOsId={os} />
      )}
    </div>
  );
}
