"use client";

import * as React from "react";
import {
  AlertTriangle,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { runRecommendation } from "@/actions/ai";
import { PriorityBadge, RiskBadge } from "@/components/shared/badges";
import { CopyButton } from "@/components/shared/copy-button";
import { SourceCitationList } from "@/components/shared/source-citation-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { AiResponse, RiskLevel } from "@/types";

interface OsOption {
  id: string;
  name: string;
}

const ALL = "all";

export function AiChatPanel({
  osOptions,
  defaultOsId,
}: {
  osOptions: OsOption[];
  defaultOsId?: string;
}) {
  const [osId, setOsId] = React.useState<string>(defaultOsId || ALL);
  const [question, setQuestion] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<AiResponse | null>(null);

  async function analyze() {
    setLoading(true);
    setResult(null);
    const res = await runRecommendation({
      osId: osId === ALL ? null : osId,
      question: question.trim(),
    });
    setLoading(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    if (res.data) {
      setResult(res.data);
      toast.success("Analise concluida.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr]">
      {/* Controles */}
      <Card className="h-fit lg:sticky lg:top-24">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" />
            Analisar setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Ambiente</Label>
            <Select value={osId} onValueChange={setOsId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todos os ambientes</SelectItem>
                {osOptions.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Pergunta (opcional)</Label>
            <Textarea
              rows={4}
              placeholder="Ex.: Meu Node esta desatualizado? Ha alternativas mais modernas ao meu setup?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              A IA usa busca na web para checar versoes e novidades, e cita as fontes.
            </p>
          </div>

          <Button onClick={analyze} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Analisar com IA
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Resultado */}
      <div className="min-w-0 space-y-4">
        {!result && !loading ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <p className="max-w-sm text-sm text-muted-foreground">
                Escolha um ambiente e clique em <strong>Analisar com IA</strong> para
                receber recomendacoes de atualizacao com fontes.
              </p>
            </CardContent>
          </Card>
        ) : null}

        {loading ? (
          <Card>
            <CardContent className="flex items-center gap-3 py-10 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              Consultando versoes e boas praticas na web...
            </CardContent>
          </Card>
        ) : null}

        {result ? (
          <>
            {result.summary ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm leading-relaxed">{result.summary}</p>
                </CardContent>
              </Card>
            ) : null}

            {result.recommendations?.map((rec, i) => (
              <Card key={i}>
                <CardHeader className="gap-3">
                  <div className="flex items-start gap-2">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <CardTitle className="text-base leading-snug">{rec.title}</CardTitle>
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

                  {rec.suggestedCommands?.map((c, j) => (
                    <div key={j} className="rounded-md border bg-secondary/40 p-3">
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
                      <code className="block overflow-x-auto whitespace-pre-wrap break-all font-mono text-xs">
                        {c.command}
                      </code>
                    </div>
                  ))}

                  <SourceCitationList sources={rec.sources ?? []} />
                </CardContent>
              </Card>
            ))}

            {result.warnings?.length ? (
              <Card className="border-warning/40 bg-warning/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm text-warning">
                    <AlertTriangle className="h-4 w-4" />
                    Avisos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {result.warnings.map((w, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-warning">•</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : null}

            {result.nextSteps?.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Proximos passos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {result.nextSteps.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : null}

            {result.sources?.length ? (
              <Card>
                <CardContent className="pt-6">
                  <SourceCitationList sources={result.sources} />
                </CardContent>
              </Card>
            ) : null}

            <p className="text-center text-xs text-muted-foreground">
              As recomendacoes ficam salvas no{" "}
              <span className="font-medium">Radar de Techs</span>, onde voce marca o
              que quer testar ou ja adotou.
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}
