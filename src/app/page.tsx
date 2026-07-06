import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

// Rota raiz: manda para o dashboard se logado, senao para o login.
export default async function RootPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  redirect(user ? "/dashboard" : "/login");
}
