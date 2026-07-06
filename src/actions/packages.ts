"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { nullifyEmpty, packageSchema, type PackageInput } from "@/lib/validations";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function createPackage(input: PackageInput) {
  const parsed = packageSchema.safeParse(input);
  if (!parsed.success) return { error: "Dados invalidos." };

  const { supabase, user } = await requireUser();
  if (!user) return { error: "Nao autenticado." };

  // install_command padrao quando nao informado
  const install =
    parsed.data.install_command ||
    (parsed.data.scope === "global"
      ? `npm i -g ${parsed.data.name}`
      : `npm i ${parsed.data.name}`);
  const npmUrl = parsed.data.npm_url || `https://www.npmjs.com/package/${parsed.data.name}`;

  const payload = nullifyEmpty({
    ...parsed.data,
    install_command: install,
    npm_url: npmUrl,
    user_id: user.id,
  });

  const { error } = await supabase.from("npm_packages").insert(payload);
  if (error) return { error: "Nao foi possivel salvar o pacote." };

  revalidatePath("/npm-packages");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updatePackage(id: string, input: PackageInput) {
  const parsed = packageSchema.safeParse(input);
  if (!parsed.success) return { error: "Dados invalidos." };

  const { supabase, user } = await requireUser();
  if (!user) return { error: "Nao autenticado." };

  const { error } = await supabase
    .from("npm_packages")
    .update(nullifyEmpty(parsed.data))
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: "Nao foi possivel atualizar o pacote." };

  revalidatePath("/npm-packages");
  return { success: true };
}

export async function deletePackage(id: string) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Nao autenticado." };

  const { error } = await supabase
    .from("npm_packages")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: "Nao foi possivel remover o pacote." };

  revalidatePath("/npm-packages");
  return { success: true };
}
