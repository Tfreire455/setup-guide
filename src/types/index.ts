import type { Database } from "@/types/database";

// Atalhos para as Rows do banco
type Tables = Database["public"]["Tables"];
export type Profile = Tables["profiles"]["Row"];
export type OperatingSystem = Tables["operating_systems"]["Row"];
export type Tool = Tables["tools"]["Row"];
export type Project = Tables["projects"]["Row"];
export type NpmPackage = Tables["npm_packages"]["Row"];
export type Command = Tables["commands"]["Row"];
export type SetupTemplate = Tables["setup_templates"]["Row"];
export type SetupStep = Tables["setup_steps"]["Row"];
export type ChangeLog = Tables["change_logs"]["Row"];

// Enums do dominio
export type OsType = "windows" | "linux" | "macos" | "wsl" | "vm" | "docker" | "outro";
export type ToolStatus = "installed" | "pending" | "needs_update" | "removed";
export type PackageScope = "global" | "project";
export type PackageStatus = "active" | "legacy" | "replaced" | "test_update";
export type RiskLevel = "low" | "medium" | "high";
export type RecommendationPriority = "high" | "medium" | "low";
export type RecommendationStatus = "new" | "want_to_test" | "adopted" | "ignored";

// Estruturas retornadas pela IA (jsonb no banco)
export interface SuggestedCommand {
  os: string;
  command: string;
  risk: RiskLevel;
  requiresConfirmation: boolean;
}

export interface RecommendationSource {
  title: string;
  url: string;
  usedFor?: string;
}

export interface AiRecommendation
  extends Omit<Tables["ai_recommendations"]["Row"], "sources" | "suggested_commands"> {
  sources: RecommendationSource[];
  suggested_commands: SuggestedCommand[];
}

// Resposta completa da Edge Function ai-recommendations
export interface AiResponse {
  summary: string;
  recommendations: Array<{
    title: string;
    description: string;
    priority: RecommendationPriority;
    category: string;
    suggestedCommands: SuggestedCommand[];
    sources: RecommendationSource[];
  }>;
  warnings: string[];
  nextSteps: string[];
  sources: RecommendationSource[];
  model?: string;
  error?: string;
}

// Saude calculada de um ambiente
export type OsHealth = "updated" | "attention" | "outdated" | "incomplete";
