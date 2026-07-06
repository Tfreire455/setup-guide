// =============================================================================
// Edge Function: ai-recommendations
// Deno runtime (Supabase Edge Functions).
//
// Fluxo:
//   1. Valida o JWT do usuario (Authorization: Bearer <token>).
//   2. Rate limit basico (N chamadas/minuto por usuario).
//   3. Monta o contexto (OS + ferramentas + pacotes npm + projetos).
//   4. Chama a OpenAI Responses API com a ferramenta web_search.
//   5. Faz parse do JSON estruturado e coleta as citacoes/fontes.
//   6. Persiste as recomendacoes em ai_recommendations e loga o uso.
//
// A OPENAI_API_KEY NUNCA e exposta ao cliente. Ela vive apenas aqui, como
// secret da Edge Function:  supabase secrets set OPENAI_API_KEY=sk-...
// =============================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
const OPENAI_MODEL = Deno.env.get("OPENAI_MODEL") ?? "gpt-5.5";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Rate limit: chamadas de IA permitidas por usuario a cada 60s.
const RATE_LIMIT_PER_MINUTE = 8;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// -----------------------------------------------------------------------------
// Prompt do sistema: define o comportamento da IA dentro do app.
// -----------------------------------------------------------------------------
const SYSTEM_PROMPT = `Voce e o assistente do SetupGuide AI, um especialista em ambientes de desenvolvimento (Windows, Linux, macOS, WSL, VMs, Docker).

Regras obrigatorias:
- Responda de forma tecnica, objetiva e pratica, em portugues do Brasil.
- Separe comandos por sistema operacional e gerenciador de pacotes.
- Informe o nivel de risco de cada comando (low, medium, high).
- Marque requiresConfirmation=true para qualquer comando de risco medio/alto ou que use sudo/admin.
- NUNCA sugira comandos destrutivos sem aviso explicito. Nunca instrua a executar nada automaticamente.
- NAO invente versoes. Se depender de dado atualizado (versao mais recente, depreciacao, comparacao de ferramentas), use a ferramenta web_search e priorize documentacao oficial.
- Sempre que usar a web, inclua as fontes reais consultadas (title + url).
- Avise quando uma informacao pode mudar com o tempo.
- Se nao tiver certeza, diga explicitamente no campo "warnings".

Responda EXCLUSIVAMENTE com um objeto JSON valido (sem markdown, sem crases, sem texto antes ou depois) neste formato exato:
{
  "summary": "string - resumo/resposta principal",
  "recommendations": [
    {
      "title": "string",
      "description": "string - motivo da recomendacao",
      "priority": "high | medium | low",
      "category": "runtime | package-manager | database | editor | security | productivity | ai | devops",
      "suggestedCommands": [
        { "os": "string", "command": "string", "risk": "low | medium | high", "requiresConfirmation": true }
      ],
      "sources": [
        { "title": "string", "url": "string", "usedFor": "string" }
      ]
    }
  ],
  "warnings": ["string"],
  "nextSteps": ["string"]
}`;

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/** Extrai um objeto JSON de um texto que pode vir com crases ou texto extra. */
function extractJson(raw: string): Record<string, unknown> {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : raw;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Resposta da IA sem JSON valido");
  return JSON.parse(candidate.slice(start, end + 1));
}

interface OpenAIParsed {
  text: string;
  citations: Array<{ title: string; url: string }>;
  usage: { input?: number; output?: number };
}

/** Percorre o array `output` da Responses API extraindo texto + citacoes. */
function parseResponsesOutput(data: any): OpenAIParsed {
  let text = "";
  const citations: Array<{ title: string; url: string }> = [];
  const seen = new Set<string>();

  for (const item of data.output ?? []) {
    if (item.type === "message" && Array.isArray(item.content)) {
      for (const part of item.content) {
        if (part.type === "output_text" && typeof part.text === "string") {
          text += part.text;
          for (const ann of part.annotations ?? []) {
            if (ann.type === "url_citation" && ann.url && !seen.has(ann.url)) {
              seen.add(ann.url);
              citations.push({ title: ann.title ?? ann.url, url: ann.url });
            }
          }
        }
      }
    }
  }

  if (!text && typeof data.output_text === "string") text = data.output_text;

  return {
    text,
    citations,
    usage: {
      input: data.usage?.input_tokens,
      output: data.usage?.output_tokens,
    },
  };
}

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Metodo nao permitido" }, 405);
  }

  try {
    // --- 1. Autenticacao ---------------------------------------------------
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) return json({ error: "Nao autenticado" }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData.user) {
      return json({ error: "Token invalido" }, 401);
    }
    const userId = userData.user.id;

    // --- 2. Rate limit -----------------------------------------------------
    const since = new Date(Date.now() - 60_000).toISOString();
    const { count } = await admin
      .from("ai_usage_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", since);

    if ((count ?? 0) >= RATE_LIMIT_PER_MINUTE) {
      return json(
        { error: "Limite de chamadas de IA atingido. Aguarde um minuto." },
        429,
      );
    }

    // --- 3. Entrada + contexto --------------------------------------------
    const body = await req.json().catch(() => ({}));
    const osId: string | null = body.osId ?? null;
    const question: string =
      typeof body.question === "string" && body.question.trim()
        ? body.question.trim()
        : "Analise meu setup e diga o que esta faltando ou desatualizado para desenvolvimento.";

    // OS (um especifico ou todos do usuario)
    let osQuery = admin.from("operating_systems").select("*").eq("user_id", userId);
    if (osId) osQuery = osQuery.eq("id", osId);
    const { data: systems } = await osQuery;

    const osIds = (systems ?? []).map((s: any) => s.id);

    const [{ data: tools }, { data: pkgs }, { data: projects }] = await Promise.all([
      osIds.length
        ? admin.from("tools").select("*").eq("user_id", userId).in("os_id", osIds)
        : Promise.resolve({ data: [] as any[] }),
      admin.from("npm_packages").select("*").eq("user_id", userId),
      admin.from("projects").select("*").eq("user_id", userId),
    ]);

    const context = {
      operating_systems: (systems ?? []).map((s: any) => ({
        id: s.id,
        name: s.name,
        os_type: s.os_type,
        distribution: s.distribution,
        version: s.version,
        architecture: s.architecture,
        package_manager: s.package_manager,
        terminal: s.terminal,
        shell: s.shell,
        tags: s.tags,
      })),
      tools: (tools ?? []).map((t: any) => ({
        name: t.name,
        category: t.category,
        installed_version: t.installed_version,
        status: t.status,
      })),
      npm_packages: (pkgs ?? []).map((p: any) => ({
        name: p.name,
        version: p.version,
        scope: p.scope,
        status: p.status,
        tags: p.tags,
      })),
      projects: (projects ?? []).map((p: any) => ({
        name: p.name,
        stack: p.stack,
      })),
    };

    const userPrompt = [
      `Pergunta do usuario: ${question}`,
      ``,
      `Contexto salvo do usuario (JSON):`,
      JSON.stringify(context, null, 2),
      ``,
      `Se o contexto for suficiente, responda sem pesquisar. Use web_search apenas quando precisar de dado atualizado (versoes mais recentes, depreciacoes, comparacoes). Lembre de retornar SOMENTE o JSON no formato especificado.`,
    ].join("\n");

    // --- 4. Chamada a OpenAI Responses API ---------------------------------
    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        instructions: SYSTEM_PROMPT,
        input: userPrompt,
        tools: [{ type: "web_search" }],
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI error:", errText);
      return json({ error: "Falha ao chamar a IA", detail: errText }, 502);
    }

    const openaiData = await openaiRes.json();
    const parsed = parseResponsesOutput(openaiData);

    let result: any;
    try {
      result = extractJson(parsed.text);
    } catch (e) {
      console.error("Parse error:", e, parsed.text);
      return json(
        { error: "A IA retornou um formato inesperado", raw: parsed.text },
        502,
      );
    }

    // Junta as citacoes coletadas das anotacoes com as fontes do modelo.
    const webSources = parsed.citations.map((c) => ({
      title: c.title,
      url: c.url,
      usedFor: "Pesquisa web",
    }));

    // --- 5. Persistencia ---------------------------------------------------
    const recs = Array.isArray(result.recommendations) ? result.recommendations : [];
    if (recs.length) {
      const rows = recs.map((r: any) => ({
        user_id: userId,
        os_id: osId,
        title: String(r.title ?? "Recomendacao"),
        description: r.description ?? null,
        priority: ["high", "medium", "low"].includes(r.priority) ? r.priority : "medium",
        category: r.category ?? null,
        status: "new",
        sources: [...(Array.isArray(r.sources) ? r.sources : []), ...webSources],
        suggested_commands: Array.isArray(r.suggestedCommands) ? r.suggestedCommands : [],
      }));
      await admin.from("ai_recommendations").insert(rows);
    }

    // --- 6. Log de uso -----------------------------------------------------
    await admin.from("ai_usage_logs").insert({
      user_id: userId,
      action: "recommendation",
      model: OPENAI_MODEL,
      os_id: osId,
      tokens_input: parsed.usage.input ?? null,
      tokens_output: parsed.usage.output ?? null,
    });

    return json({
      ...result,
      sources: webSources,
      model: OPENAI_MODEL,
    });
  } catch (err) {
    console.error("Unhandled error:", err);
    return json({ error: "Erro interno", detail: String(err) }, 500);
  }
});
