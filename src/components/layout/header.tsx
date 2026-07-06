"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { NavContent } from "@/components/layout/nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function Header({ name, email }: { name: string | null; email: string }) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        {/* Menu mobile */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu">
              <Menu className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="left-0 top-0 h-full max-h-full max-w-[16rem] translate-x-0 translate-y-0 rounded-none border-r border-border p-0 before:hidden sm:rounded-none">
            <DialogTitle className="sr-only">Navegação</DialogTitle>
            <div className="flex h-16 items-center border-b border-border px-5">
              <Logo />
            </div>
            <div className="p-3">
              <NavContent onNavigate={() => setOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>

        <div className="lg:hidden">
          <Logo showText={false} />
        </div>

        {/* Caminho atual, no vocabulario do terminal */}
        <p className="hidden min-w-0 truncate font-mono text-xs text-muted-foreground sm:block">
          <span className="text-primary">~</span>
          {pathname}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <UserMenu name={name} email={email} />
      </div>
    </header>
  );
}
