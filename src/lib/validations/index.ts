import { z } from "zod";

// Regra: identificadores tecnicos podem ter acento na UI, mas os enums abaixo
// sao valores SEM acento (batem com o banco). Campos de texto livre (notes,
// name visivel) aceitam acentos normalmente.

const osTypeEnum = z.enum(["windows", "linux", "macos", "wsl", "vm", "docker", "outro"]);
const toolStatusEnum = z.enum(["installed", "pending", "needs_update", "removed"]);
const scopeEnum = z.enum(["global", "project"]);
const packageStatusEnum = z.enum(["active", "legacy", "replaced", "test_update"]);
const riskEnum = z.enum(["low", "medium", "high"]);

// ----------------------------------------------------------------------------
// Operating System
// ----------------------------------------------------------------------------
export const osSchema = z.object({
  name: z.string().min(1, "Informe um nome para o ambiente").max(120),
  os_type: osTypeEnum,
  distribution: z.string().max(80).optional().or(z.literal("")),
  version: z.string().max(60).optional().or(z.literal("")),
  architecture: z.string().max(20).optional().or(z.literal("")),
  package_manager: z.string().max(40).optional().or(z.literal("")),
  terminal: z.string().max(60).optional().or(z.literal("")),
  shell: z.string().max(60).optional().or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
  tags: z.array(z.string()).default([]),
});
export type OsInput = z.infer<typeof osSchema>;

// ----------------------------------------------------------------------------
// Tool
// ----------------------------------------------------------------------------
export const toolSchema = z.object({
  os_id: z.string().uuid("Selecione um ambiente"),
  name: z.string().min(1, "Informe o nome da ferramenta").max(120),
  category: z.string().max(60).optional().or(z.literal("")),
  installed_version: z.string().max(60).optional().or(z.literal("")),
  version_check_command: z.string().max(200).optional().or(z.literal("")),
  install_command: z.string().max(500).optional().or(z.literal("")),
  update_command: z.string().max(500).optional().or(z.literal("")),
  documentation_url: z
    .string()
    .url("URL invalida")
    .max(300)
    .optional()
    .or(z.literal("")),
  status: toolStatusEnum.default("installed"),
  notes: z.string().max(2000).optional().or(z.literal("")),
});
export type ToolInput = z.infer<typeof toolSchema>;

// ----------------------------------------------------------------------------
// npm Package
// ----------------------------------------------------------------------------
export const packageSchema = z.object({
  os_id: z.string().uuid().optional().or(z.literal("")),
  name: z.string().min(1, "Informe o nome do pacote").max(160),
  version: z.string().max(60).optional().or(z.literal("")),
  scope: scopeEnum.default("global"),
  reason: z.string().max(500).optional().or(z.literal("")),
  install_command: z.string().max(400).optional().or(z.literal("")),
  update_command: z.string().max(400).optional().or(z.literal("")),
  npm_url: z.string().url("URL invalida").max(300).optional().or(z.literal("")),
  tags: z.array(z.string()).default([]),
  status: packageStatusEnum.default("active"),
});
export type PackageInput = z.infer<typeof packageSchema>;

// ----------------------------------------------------------------------------
// Command
// ----------------------------------------------------------------------------
export const commandSchema = z.object({
  os_id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().min(1, "Informe um titulo").max(160),
  command: z.string().min(1, "Informe o comando").max(1000),
  category: z.string().max(60).optional().or(z.literal("")),
  explanation: z.string().max(2000).optional().or(z.literal("")),
  risk_level: riskEnum.default("low"),
  requires_admin: z.boolean().default(false),
  is_favorite: z.boolean().default(false),
  notes: z.string().max(1000).optional().or(z.literal("")),
});
export type CommandInput = z.infer<typeof commandSchema>;

// ----------------------------------------------------------------------------
// Auth
// ----------------------------------------------------------------------------
export const loginSchema = z.object({
  email: z.string().email("E-mail invalido"),
  password: z.string().min(6, "A senha precisa de ao menos 6 caracteres"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(1, "Informe seu nome").max(120),
    email: z.string().email("E-mail invalido"),
    password: z.string().min(6, "A senha precisa de ao menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "As senhas nao coincidem",
    path: ["confirmPassword"],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail invalido"),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// Normaliza strings vazias para null antes de salvar
export function nullifyEmpty<T extends Record<string, unknown>>(obj: T): T {
  const out = { ...obj } as Record<string, unknown>;
  for (const k of Object.keys(out)) {
    if (out[k] === "") out[k] = null;
  }
  return out as T;
}
