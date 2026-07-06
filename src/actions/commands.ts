"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { commandSchema, nullifyEmpty, type CommandInput } from "@/lib/validations";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function createCommand(input: CommandInput) {
  const parsed = commandSchema.safeParse(input);
  if (!parsed.success) return { error: "Dados invalidos." };

  const { supabase, user } = await requireUser();
  if (!user) return { error: "Nao autenticado." };

  const { error } = await supabase
    .from("commands")
    .insert(nullifyEmpty({ ...parsed.data, user_id: user.id }));

  if (error) return { error: "Nao foi possivel salvar o comando." };

  revalidatePath("/commands");
  return { success: true };
}

export async function updateCommand(id: string, input: CommandInput) {
  const parsed = commandSchema.safeParse(input);
  if (!parsed.success) return { error: "Dados invalidos." };

  const { supabase, user } = await requireUser();
  if (!user) return { error: "Nao autenticado." };

  const { error } = await supabase
    .from("commands")
    .update(nullifyEmpty(parsed.data))
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: "Nao foi possivel atualizar o comando." };

  revalidatePath("/commands");
  return { success: true };
}

export async function toggleCommandFavorite(id: string, value: boolean) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Nao autenticado." };

  const { error } = await supabase
    .from("commands")
    .update({ is_favorite: value })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: "Nao foi possivel atualizar o favorito." };

  revalidatePath("/commands");
  return { success: true };
}

export async function deleteCommand(id: string) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Nao autenticado." };

  const { error } = await supabase.from("commands").delete().eq("id", id).eq("user_id", user.id);
  if (error) return { error: "Nao foi possivel remover o comando." };

  revalidatePath("/commands");
  return { success: true };
}
