"use client";

import * as React from "react";
import { Check, Loader2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

import { updateRecommendationStatus } from "@/actions/ai";
import { PriorityBadge, RecStatusBadge, RiskBadge } from "@/components/shared/badges";
import { CopyButton } from "@/components/shared/copy-button";
import { SourceCitationList } from "@/components/shared/source-citation-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type {
  AiRecommendation,
  RecommendationSource,
  RecommendationStatus,
  RiskLevel,
  SuggestedCommand,
} from "@/types";

export function RecommendationCard({ rec }: { rec: AiRecommendation }) {
  const [status, setStatus] = React.useState<string>(rec.status);
  const [pending, setPending] = React.useState<RecommendationStatus | null>(null);

  const commands = (rec.suggested_commands ?? []) as SuggestedCommand[];
  const sources = (rec.sources ?? []) as RecommendationSource[];

  async function setRecStatus(next: RecommendationStatus) {
    setPending(next);
    const res = await updateRecommendationStatus(rec.id, next);
    setPending(null);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    setStatus(next);
    toast.success("Recomendacao atualizada.");
  }

  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <h3 className="font-medium leading-snug">{rec.title}</h3>
          </div>
          <RecStatusBadge status={status} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PriorityBadge priority={rec.priority} />
          {rec.category ? <Badge variant="outline">{rec.category}</Badge> : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {rec.description ? (
          <p className="text-sm text-muted-foreground">{rec.description}</p>
        ) : null}

        {commands.length ? (
          <div className="space-y-2">
            {commands.map((c, i) => (
              <div key={i} className="rounded-md border bg-secondary/40 p-3">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono text-[10px]">
                      {c.os}
                    </Badge>
                    <RiskBadge level={(c.risk ?? "low") as RiskLevel} short />
                    {c.requiresConfirmation ? (
                      <Badge variant="warning" className="text-[10px]">
                        requer confirmacao
                      </Badge>
                    ) : null}
                  </div>
                  <CopyButton text={c.command} />
                </div>
                <code className="block overflow-x-auto whitespace-pre-wrap break-all font-mono text-xs text-foreground">
                  {c.command}
                </code>
              </div>
            ))}
          </div>
        ) : null}

        <SourceCitationList sources={sources} />

        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            size="sm"
            variant={status === "want_to_test" ? "default" : "outline"}
            disabled={pending !== null}
            onClick={() => setRecStatus("want_to_test")}
          >
            {pending === "want_to_test" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            Quero testar
          </Button>
          <Button
            size="sm"
            variant={status === "adopted" ? "default" : "outline"}
            disabled={pending !== null}
            onClick={() => setRecStatus("adopted")}
          >
            {pending === "adopted" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Adotada
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={pending !== null}
            onClick={() => setRecStatus("ignored")}
          >
            {pending === "ignored" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
            Ignorar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}