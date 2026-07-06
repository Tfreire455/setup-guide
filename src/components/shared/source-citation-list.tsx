import { ExternalLink } from "lucide-react";

import type { RecommendationSource } from "@/types";

/** Lista de fontes/citacoes retornadas pela IA quando usa busca web. */
export function SourceCitationList({ sources }: { sources: RecommendationSource[] }) {
  if (!sources?.length) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Fontes ({sources.length})
      </p>
      <ul className="space-y-1.5">
        {sources.map((s, i) => (
          <li key={`${s.url}-${i}`}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-2 text-sm text-primary hover:underline"
            >
              <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-70" />
              <span className="min-w-0">
                <span className="line-clamp-1">{s.title || s.url}</span>
                {s.usedFor ? (
                  <span className="block text-xs text-muted-foreground">{s.usedFor}</span>
                ) : null}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
