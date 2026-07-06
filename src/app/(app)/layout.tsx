import { redirect } from "next/navigation";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-screen">
      {/* Brilho ambiente no topo (decorativo) */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-0 h-56 bg-[radial-gradient(60%_100%_at_50%_0%,hsl(var(--primary)/0.07),transparent)]"
      />
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header name={profile?.name ?? null} email={user.email ?? ""} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="stagger mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
