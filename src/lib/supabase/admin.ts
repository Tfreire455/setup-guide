import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

/**
 * Cliente com service_role. Ignora RLS. NUNCA importe isto em Client Components
 * nem exponha a service role key no frontend. Uso restrito a rotas/servicos
 * server-side confiaveis. No app, prefira sempre o cliente de server.ts (RLS).
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
