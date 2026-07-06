"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { nullifyEmpty, toolSchema, type ToolInput } from "@/lib/validations";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function createTool(input: ToolInput) {
  const parsed = toolSchema.safeParse(input);
  if (!parsed.success) return { error: "Dados invalidos." };

  const { supabase, user } = await requireUser();
  if (!user) return { error: "Nao autenticado." };

  const payload = nullifyEmpty({
    ...parsed.data,
    user_id: user.id,
    last_checked_at: new Date().toISOString(),
  });

  const { error } = await supabase.from("tools").insert(payload);
  if (error) return { error: "Nao foi possivel salvar a ferramenta." };

  revalidatePath("/tools");
  revalidatePath(`/os/${input.os_id}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateTool(id: string, input: ToolInput) {
  const parsed = toolSchema.safeParse(input);
  if (!parsed.success) return { error: "Dados invalidos." };

  const { supabase, user } = await requireUser();
  if (!user) return { error: "Nao autenticado." };

  const { error } = await supabase
    .from("tools")
    .update(nullifyEmpty(parsed.data))
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: "Nao foi possivel atualizar a ferramenta." };

  revalidatePath("/tools");
  return { success: true };
}

export async function deleteTool(id: string) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Nao autenticado." };

  const { error } = await supabase.from("tools").delete().eq("id", id).eq("user_id", user.id);
  if (error) return { error: "Nao foi possivel remover a ferramenta." };

  revalidatePath("/tools");
  revalidatePath("/dashboard");
  return { success: true };
}
