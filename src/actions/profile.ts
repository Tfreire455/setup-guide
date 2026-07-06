"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function updateProfile(name: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Nao autenticado." };

  const { error } = await supabase.from("profiles").update({ name }).eq("id", user.id);
  if (error) return { error: "Nao foi possivel salvar o perfil." };

  // Mantem o metadata em sincronia
  await supabase.auth.updateUser({ data: { name } });

  revalidatePath("/settings");
  return { success: true };
}

export async function updatePassword(password: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: "Nao foi possivel alterar a senha." };
  return { success: true };
}
