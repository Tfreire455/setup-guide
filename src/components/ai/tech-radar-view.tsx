"use client";

import * as React from "react";
import { Radar } from "lucide-react";

import { RecommendationCard } from "@/components/ai/recommendation-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AiRecommendation } from "@/types";

const TABS = [
  { value: "all", label: "Todas" },
  { value: "new", label: "Novas" },
  { value: "want_to_test", label: "Testar" },
  { value: "adopted", label: "Adotadas" },
  { value: "ignored", label: "Ignoradas" },
] as const;

export function TechRadarView({ recommendations }: { recommendations: AiRecommendation[] }) {
  const [tab, setTab] = React.useState<string>("all");

  const filtered =
    tab === "all" ? recommendations : recommendations.filter((r) => r.status === tab);

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="flex-wrap">
        {TABS.map((t) => {
          const count =
            t.value === "all"
              ? recommendations.length
              : recommendations.filter((r) => r.status === t.value).length;
          return (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
              <span className="ml-1.5 text-xs text-muted-foreground">{count}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value={tab}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={Radar}
            title="Nada por aqui ainda"
            description="Rode uma analise no Assistente IA para popular seu radar de tecnologias."
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {filtered.map((rec) => (
              <RecommendationCard key={rec.id} rec={rec} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
