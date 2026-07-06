"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { AiResponse, RecommendationStatus } from "@/types";

interface RunInput {
  osId?: string | null;
  question?: string;
}

/**
 * Invoca a Edge Function ai-recommendations. A chave da OpenAI vive apenas no
 * servidor da funcao; aqui so passamos o contexto e recebemos o JSON.
 */
export async function runRecommendation(
  input: RunInput,
): Promise<{ data?: AiResponse; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Nao autenticado." };

  const { data, error } = await supabase.functions.invoke<AiResponse>("ai-recommendations", {
    body: { osId: input.osId ?? null, question: input.question ?? "" },
  });

  if (error) {
    return { error: "A IA nao respondeu. Verifique a configuracao da Edge Function." };
  }
  if (data?.error) {
    return { error: data.error };
  }

  revalidatePath("/tech-radar");
  revalidatePath("/dashboard");
  return { data: data ?? undefined };
}

export async function updateRecommendationStatus(id: string, status: RecommendationStatus) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Nao autenticado." };

  const { error } = await supabase
    .from("ai_recommendations")
    .update({ status })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: "Nao foi possivel atualizar a recomendacao." };

  revalidatePath("/tech-radar");
  revalidatePath("/dashboard");
  return { success: true };
}
