import Link from "next/link";
import { Sparkles } from "lucide-react";

import { TechRadarView } from "@/components/ai/tech-radar-view";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import type { AiRecommendation } from "@/types";

export default async function TechRadarPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("ai_recommendations")
    .select("*")
    .order("created_at", { ascending: false });

  const recommendations = (data ?? []).map((r) => ({
    ...r,
    sources: Array.isArray(r.sources) ? r.sources : [],
    suggested_commands: Array.isArray(r.suggested_commands) ? r.suggested_commands : [],
  })) as unknown as AiRecommendation[];

  return (
    <div>
      <PageHeader
        title="Radar de Techs"
        description="Recomendacoes da IA salvas. Marque o que quer testar ou ja adotou."
      >
        <Button asChild variant="secondary">
          <Link href="/ai-assistant">
            <Sparkles className="h-4 w-4" />
            Nova analise
          </Link>
        </Button>
      </PageHeader>

      <TechRadarView recommendations={recommendations} />
    </div>
  );
}
