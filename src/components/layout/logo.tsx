import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({
  href = "/dashboard",
  className,
  showText = true,
}: {
  href?: string;
  className?: string;
  showText?: boolean;
}) {
  return (
    <Link href={href} className={cn("group flex items-center gap-2.5", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-sm border border-primary/50 bg-primary/10 font-mono text-sm font-bold text-primary transition-shadow group-hover:glow-sm">
        &gt;_
      </span>
      {showText ? (
        <span className="flex items-baseline gap-1.5 leading-none">
          <span className="shine font-display text-sm font-bold uppercase tracking-[0.18em]">
            SetupGuide
          </span>
          <span className="caret-blink font-mono text-[11px] font-semibold text-primary">
            AI
          </span>
        </span>
      ) : null}
    </Link>
  );
}
