"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { nullifyEmpty, osSchema, type OsInput } from "@/lib/validations";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function createOs(input: OsInput) {
  const parsed = osSchema.safeParse(input);
  if (!parsed.success) return { error: "Dados invalidos." };

  const { supabase, user } = await requireUser();
  if (!user) return { error: "Nao autenticado." };

  const payload = nullifyEmpty({ ...parsed.data, user_id: user.id });
  const { data, error } = await supabase
    .from("operating_systems")
    .insert(payload)
    .select("id")
    .single();

  if (error) return { error: "Nao foi possivel salvar o ambiente." };

  revalidatePath("/os");
  revalidatePath("/dashboard");
  return { data };
}

export async function updateOs(id: string, input: OsInput) {
  const parsed = osSchema.safeParse(input);
  if (!parsed.success) return { error: "Dados invalidos." };

  const { supabase, user } = await requireUser();
  if (!user) return { error: "Nao autenticado." };

  const { error } = await supabase
    .from("operating_systems")
    .update(nullifyEmpty(parsed.data))
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: "Nao foi possivel atualizar o ambiente." };

  revalidatePath("/os");
  revalidatePath(`/os/${id}`);
  return { success: true };
}

export async function deleteOs(id: string) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Nao autenticado." };

  const { error } = await supabase
    .from("operating_systems")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: "Nao foi possivel remover o ambiente." };

  revalidatePath("/os");
  revalidatePath("/dashboard");
  return { success: true };
}
