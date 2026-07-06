import { Logo } from "@/components/layout/logo";

const STACK = [
  "next.js",
  "supabase",
  "node.js",
  "docker",
  "tailwind",
  "openai",
  "postgres",
  "vercel",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Painel de marca (desktop) */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-card/30 p-10 lg:flex">
        <div className="bg-grid absolute inset-0 opacity-50" />

        <div className="relative">
          <Logo href="/" />
        </div>

        <div className="relative space-y-8">
          {/* Janela de terminal */}
          <div className="tech-corners glow-sm border border-border bg-background/90 font-mono text-sm backdrop-blur">
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
              <span className="ml-2 text-[11px] text-muted-foreground">~/setupguide</span>
            </div>
            <div className="stagger space-y-2 p-5">
              <p>
                <span className="text-primary">$</span> setupguide scan --all
              </p>
              <p className="text-muted-foreground">&gt; 3 ambientes · 16 ferramentas · 12 pacotes</p>
              <p>
                <span className="text-success">✓</span> node 20.11 · docker 25.0 · git 2.44
              </p>
              <p>
                <span className="text-warning">▲</span> 4 atualizações encontradas
              </p>
              <p>
                <span className="text-primary">$</span>
                <span className="caret-blink" />
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="max-w-md font-display text-3xl font-semibold uppercase leading-tight tracking-wide text-balance">
              Seu setup, versionado e sempre em dia.
            </h2>
            <p className="max-w-md font-mono text-sm leading-relaxed text-muted-foreground">
              Registre ambientes, ferramentas, pacotes e comandos. A IA varre a web,
              aponta o que está desatualizado e sugere as versões mais recentes — com fontes.
            </p>
          </div>
        </div>

        {/* Faixa de stack em marquee */}
        <div className="relative overflow-hidden border-t border-border pt-4">
          <div className="marquee-track flex w-max gap-8">
            {STACK.concat(STACK).map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground/60"
              >
                {item}
                <span aria-hidden className="text-primary/40">
                  ▪
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo href="/" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
