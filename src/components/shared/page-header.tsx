import { DecryptedText } from "@/components/shared/decrypted-text";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Cabecalho padrao: titulo com efeito decrypt e prefixo de comentario,
 * descricao em estilo de prompt, acoes a direita.
 */
export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 pb-7 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-1.5">
        <h1 className="font-display text-2xl font-semibold uppercase tracking-wide sm:text-3xl">
          <span className="mr-2 select-none text-primary">//</span>
          <DecryptedText text={title} />
        </h1>
        {description ? (
          <p className="font-mono text-[13px] leading-relaxed text-muted-foreground">
            <span className="mr-1.5 select-none text-primary/70">$</span>
            {description}
          </p>
        ) : null}
      </div>
      {children ? <div className="flex shrink-0 items-center gap-2">{children}</div> : null}
    </div>
  );
}
