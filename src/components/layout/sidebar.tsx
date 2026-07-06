import { Logo } from "@/components/layout/logo";
import { NavContent } from "@/components/layout/nav";

/** Sidebar fixa (desktop). */
export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card/40 lg:flex">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Logo />
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <NavContent />
      </div>
      <div className="flex items-center justify-between border-t border-border p-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-success" />
          online
        </span>
        <span>v2.0</span>
      </div>
    </aside>
  );
}
