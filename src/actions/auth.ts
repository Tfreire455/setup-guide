"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
} from "@/lib/validations";

type ActionResult = { error?: string; success?: boolean; message?: string };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function signIn(input: LoginInput): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) {
    return { error: "E-mail ou senha invalidos." };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signUp(input: RegisterInput): Promise<ActionResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: { name: input.name },
      emailRedirectTo: `${SITE_URL}/auth/confirm`,
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already")) {
      return { error: "Este e-mail ja esta cadastrado." };
    }
    return { error: "Nao foi possivel criar a conta. Tente novamente." };
  }

  // Se a confirmacao por e-mail estiver ativa, nao ha sessao ainda.
  if (data.user && !data.session) {
    return {
      success: true,
      message: "Conta criada. Confira seu e-mail para confirmar o cadastro.",
    };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}

export async function requestPasswordReset(
  input: ForgotPasswordInput,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
    redirectTo: `${SITE_URL}/auth/confirm?next=/settings`,
  });

  if (error) {
    return { error: "Nao foi possivel enviar o e-mail de recuperacao." };
  }

  return {
    success: true,
    message: "Se o e-mail existir, enviamos um link para redefinir a senha.",
  };
}
