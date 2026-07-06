import {
  Boxes,
  Cpu,
  Download,
  LayoutDashboard,
  MonitorSmartphone,
  Package,
  Radar,
  Settings,
  Sparkles,
  Terminal,
  Wrench,
} from "lucide-react";

// -----------------------------------------------------------------------------
// Navegacao lateral
// -----------------------------------------------------------------------------
export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/os", label: "Sistemas", icon: MonitorSmartphone },
  { href: "/tools", label: "Ferramentas", icon: Wrench },
  { href: "/npm-packages", label: "Pacotes npm", icon: Package },
  { href: "/commands", label: "Comandos", icon: Terminal },
  { href: "/setups", label: "Setups", icon: Boxes },
  { href: "/ai-assistant", label: "Assistente IA", icon: Sparkles },
  { href: "/tech-radar", label: "Radar de Techs", icon: Radar },
  { href: "/exports", label: "Exportar", icon: Download },
  { href: "/settings", label: "Configuracoes", icon: Settings },
] as const;

// -----------------------------------------------------------------------------
// Opcoes de selects (value = identificador SEM acento; label = PT-BR)
// -----------------------------------------------------------------------------
export const OS_TYPES = [
  { value: "windows", label: "Windows" },
  { value: "linux", label: "Linux" },
  { value: "macos", label: "macOS" },
  { value: "wsl", label: "WSL" },
  { value: "vm", label: "Maquina virtual" },
  { value: "docker", label: "Container Docker" },
  { value: "outro", label: "Outro" },
] as const;

export const ARCHITECTURES = [
  { value: "x64", label: "x64" },
  { value: "arm64", label: "ARM64" },
  { value: "x86", label: "x86" },
] as const;

export const PACKAGE_MANAGERS = [
  { value: "apt", label: "apt" },
  { value: "dnf", label: "dnf" },
  { value: "pacman", label: "pacman" },
  { value: "brew", label: "Homebrew" },
  { value: "winget", label: "winget" },
  { value: "choco", label: "Chocolatey" },
  { value: "scoop", label: "Scoop" },
  { value: "nix", label: "Nix" },
  { value: "outro", label: "Outro" },
] as const;

export const TERMINALS = [
  { value: "bash", label: "Bash" },
  { value: "zsh", label: "Zsh" },
  { value: "powershell", label: "PowerShell" },
  { value: "fish", label: "Fish" },
  { value: "warp", label: "Warp" },
  { value: "windows-terminal", label: "Windows Terminal" },
  { value: "outro", label: "Outro" },
] as const;

export const TOOL_CATEGORIES = [
  { value: "runtime", label: "Runtime" },
  { value: "package-manager", label: "Gerenciador de pacotes" },
  { value: "vcs", label: "Controle de versao" },
  { value: "container", label: "Container" },
  { value: "language", label: "Linguagem" },
  { value: "build", label: "Build" },
  { value: "editor", label: "Editor / IDE" },
  { value: "database", label: "Banco de dados" },
  { value: "api", label: "API / HTTP" },
  { value: "cloud", label: "Cloud / CLI" },
  { value: "server", label: "Servidor" },
  { value: "outro", label: "Outro" },
] as const;

export const TOOL_STATUS = [
  { value: "installed", label: "Instalado" },
  { value: "pending", label: "Pendente" },
  { value: "needs_update", label: "Precisa atualizar" },
  { value: "removed", label: "Removido" },
] as const;

export const PACKAGE_SCOPES = [
  { value: "global", label: "Global" },
  { value: "project", label: "Projeto" },
] as const;

export const PACKAGE_STATUS = [
  { value: "active", label: "Ativo" },
  { value: "legacy", label: "Legado" },
  { value: "replaced", label: "Substituido" },
  { value: "test_update", label: "Testar atualizacao" },
] as const;

export const PACKAGE_TAGS = [
  "frontend",
  "backend",
  "cli",
  "build",
  "testing",
  "ui",
  "database",
  "auth",
  "ai",
  "automation",
] as const;

export const COMMAND_CATEGORIES = [
  { value: "install", label: "Instalacao" },
  { value: "update", label: "Atualizacao" },
  { value: "cleanup", label: "Limpeza" },
  { value: "diagnostic", label: "Diagnostico" },
  { value: "config", label: "Configuracao" },
  { value: "terminal", label: "Terminal" },
  { value: "git", label: "Git" },
  { value: "docker", label: "Docker" },
  { value: "node", label: "Node" },
  { value: "python", label: "Python" },
  { value: "database", label: "Banco de dados" },
] as const;

export const RISK_LEVELS = [
  { value: "low", label: "Baixo" },
  { value: "medium", label: "Medio" },
  { value: "high", label: "Alto" },
] as const;

export const RECOMMENDATION_PRIORITY = [
  { value: "high", label: "Alta" },
  { value: "medium", label: "Media" },
  { value: "low", label: "Baixa" },
] as const;

export const RECOMMENDATION_STATUS = [
  { value: "new", label: "Nova" },
  { value: "want_to_test", label: "Quero testar" },
  { value: "adopted", label: "Adotada" },
  { value: "ignored", label: "Ignorada" },
] as const;

// -----------------------------------------------------------------------------
// Catalogo de ferramentas comuns (usado no quick-add e onboarding)
// -----------------------------------------------------------------------------
export const TOOL_CATALOG = [
  { name: "Node.js", category: "runtime", check: "node -v", docs: "https://nodejs.org" },
  { name: "npm", category: "package-manager", check: "npm -v", docs: "https://docs.npmjs.com" },
  { name: "pnpm", category: "package-manager", check: "pnpm -v", docs: "https://pnpm.io" },
  { name: "yarn", category: "package-manager", check: "yarn -v", docs: "https://yarnpkg.com" },
  { name: "bun", category: "runtime", check: "bun -v", docs: "https://bun.sh" },
  { name: "Git", category: "vcs", check: "git --version", docs: "https://git-scm.com" },
  { name: "Docker", category: "container", check: "docker -v", docs: "https://docs.docker.com" },
  { name: "Docker Compose", category: "container", check: "docker compose version", docs: "https://docs.docker.com/compose" },
  { name: "Python", category: "language", check: "python --version", docs: "https://python.org" },
  { name: "pip", category: "package-manager", check: "pip --version", docs: "https://pip.pypa.io" },
  { name: "uv", category: "package-manager", check: "uv --version", docs: "https://docs.astral.sh/uv" },
  { name: "Go", category: "language", check: "go version", docs: "https://go.dev" },
  { name: "Rust", category: "language", check: "rustc --version", docs: "https://www.rust-lang.org" },
  { name: "VS Code", category: "editor", check: "code -v", docs: "https://code.visualstudio.com" },
  { name: "Cursor", category: "editor", check: "cursor -v", docs: "https://cursor.com" },
  { name: "PostgreSQL", category: "database", check: "psql --version", docs: "https://www.postgresql.org" },
  { name: "Redis", category: "database", check: "redis-server --version", docs: "https://redis.io" },
  { name: "Supabase CLI", category: "cloud", check: "supabase --version", docs: "https://supabase.com/docs/guides/cli" },
  { name: "Vercel CLI", category: "cloud", check: "vercel --version", docs: "https://vercel.com/docs/cli" },
  { name: "GitHub CLI", category: "cloud", check: "gh --version", docs: "https://cli.github.com" },
] as const;

// Helper para pegar label a partir de um value
export function labelFor(
  options: ReadonlyArray<{ value: string; label: string }>,
  value: string | null | undefined,
): string {
  if (!value) return "-";
  return options.find((o) => o.value === value)?.label ?? value;
}

// Icones por tipo de OS (nome do componente lucide)
export const OS_ICON = {
  windows: Cpu,
  linux: Terminal,
  macos: Cpu,
  wsl: Terminal,
  vm: MonitorSmartphone,
  docker: Boxes,
  outro: Cpu,
} as const;
