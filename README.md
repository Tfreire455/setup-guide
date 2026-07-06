<div align="center">

# SetupGuide AI

### Guia inteligente de setup para desenvolvedores

Organize seus ambientes de desenvolvimento, salve comandos, registre ferramentas, acompanhe pacotes npm e receba recomendações com IA para manter seus setups sempre atualizados.

<br />

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%7C%20Postgres%20%7C%20Edge%20Functions-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-Responses_API-412991?style=for-the-badge&logo=openai&logoColor=white)

<br />

**SetupGuide AI** é uma plataforma para desenvolvedores salvarem, documentarem e reutilizarem seus ambientes de desenvolvimento com mais organização, menos retrabalho e apoio de IA.

</div>

---

## Visão geral

Configurar um ambiente do zero pode ser cansativo: instalar ferramentas, lembrar comandos, procurar documentação, configurar dependências, ajustar versões e repetir os mesmos passos em máquinas diferentes.

O **SetupGuide AI** foi criado para resolver essa dor.

Com ele, o desenvolvedor consegue registrar seus sistemas operacionais, ferramentas, pacotes npm, comandos úteis e configurações importantes em um só lugar. Além disso, o assistente de IA consulta a web, analisa o setup salvo e sugere atualizações, versões mais recentes, alternativas modernas e comandos recomendados, sempre com fontes.

---

## Status do projeto

Este repositório representa a **Fase 1 — MVP Web**.

A versão atual já inclui:

| Área                          | Status                |
| ----------------------------- | --------------------- |
| Autenticação                  | Concluída             |
| Dashboard                     | Concluído             |
| CRUD de sistemas operacionais | Concluído             |
| CRUD de ferramentas           | Concluído             |
| CRUD de pacotes npm           | Concluído             |
| Biblioteca de comandos        | Concluída             |
| Assistente com IA             | Concluído             |
| Radar de tecnologias          | Concluído             |
| Configurações de perfil       | Concluído             |
| Templates de setup            | Stub preparado        |
| Exportação de setups          | Stub preparado        |
| App desktop                   | Planejado para Fase 2 |

---

## Principais recursos

### Autenticação completa

- Login
- Cadastro
- Confirmação por e-mail
- Recuperação de senha
- Proteção de rotas
- Sessão integrada ao Supabase Auth

### Dashboard inteligente

- Métricas gerais do ambiente
- Saúde dos setups
- Alertas relevantes
- Feed de alterações recentes
- Visão rápida dos itens cadastrados

### Sistemas operacionais

Cadastre e organize seus ambientes por sistema operacional:

- Windows
- Linux
- macOS
- WSL
- Ambientes customizados

Cada sistema pode ter suas próprias ferramentas, pacotes, comandos e observações.

### Ferramentas

Gerencie ferramentas instaladas ou recomendadas:

- Nome
- Categoria
- Versão
- Site oficial
- Comando de instalação
- Sistema operacional relacionado
- Observações

Também há suporte para catálogo de autopreenchimento, facilitando o cadastro rápido.

### Pacotes npm

Organize pacotes globais e de projeto:

- Nome do pacote
- Versão
- Tipo: global ou projeto
- Ambiente relacionado
- Comando automático de instalação
- Observações

O sistema gera comandos de instalação automaticamente para facilitar a reutilização.

### Biblioteca de comandos

Salve comandos importantes com contexto e segurança:

- Comando
- Descrição
- Categoria
- Nível de risco
- Flag de administrador/sudo
- Favoritos
- Sistema operacional relacionado

Ideal para guardar comandos recorrentes sem depender do histórico do terminal.

### Assistente IA

A IA analisa o setup do usuário e retorna recomendações práticas.

Ela pode ajudar com:

- Sugestões de atualização
- Alternativas mais modernas
- Explicação de comandos
- Recomendações de ferramentas
- Melhorias no ambiente
- Fontes consultadas na web
- Comandos sugeridos para instalação ou atualização

A chave da OpenAI nunca chega ao frontend. Toda comunicação com a IA acontece por meio de uma Supabase Edge Function.

### Radar de Techs

Salve tecnologias recomendadas e acompanhe o status:

- Quero testar
- Adotada
- Ignorada

Esse recurso ajuda a transformar recomendações em uma lista organizada de estudo, teste e adoção.

### Configurações

Área para gerenciamento de:

- Dados do perfil
- Troca de senha
- Preferências da conta

---

## Stack utilizada

| Tecnologia              | Uso                                     |
| ----------------------- | --------------------------------------- |
| Next.js 15              | Framework principal com App Router      |
| TypeScript              | Tipagem estática                        |
| Tailwind CSS 3.4        | Estilização                             |
| Supabase Auth           | Autenticação                            |
| Supabase Postgres       | Banco de dados                          |
| Supabase RLS            | Segurança por usuário                   |
| Supabase Edge Functions | Backend seguro para IA                  |
| OpenAI Responses API    | Assistente com web search               |
| TanStack Query          | Controle de cache e estados assíncronos |
| React Hook Form         | Formulários                             |
| Zod                     | Validação                               |
| next-themes             | Tema claro/escuro                       |
| sonner                  | Toasts e notificações                   |

---

## Arquitetura

```txt
Frontend Next.js
   |
   |-- Supabase Auth
   |-- Server Actions
   |-- TanStack Query
   |
   v
Supabase
   |
   |-- Postgres
   |-- Row Level Security
   |-- Auth
   |-- Edge Function: ai-recommendations
              |
              v
          OpenAI Responses API
          com web_search
```

---

## Segurança

A segurança foi pensada desde a primeira fase do projeto.

- O frontend usa apenas a `anon key` do Supabase.
- A autenticação é feita com Supabase Auth.
- As tabelas usam RLS para garantir que cada usuário acesse apenas os próprios dados.
- A `service_role key` é usada somente no lado servidor.
- A chave da OpenAI fica exclusivamente nos secrets da Edge Function.
- O frontend nunca acessa diretamente a OpenAI.
- A Edge Function valida o JWT do usuário antes de processar recomendações.

---

## Estrutura do projeto

```txt
src/
  actions/
    Server Actions de autenticação, perfil, sistemas, ferramentas,
    pacotes, comandos e IA

  app/
    (auth)/
      login, cadastro e recuperação de senha

    (app)/
      dashboard, sistemas, ferramentas, npm, comandos,
      assistente IA, radar e configurações

    auth/confirm/
      handler de confirmação de e-mail

  components/
    ui/
      componentes base no estilo shadcn/ui

    shared/
      componentes reutilizáveis como badges, headers,
      empty states e botões de cópia

    layout/
      sidebar, header, navegação, logo e alternador de tema

    os/
      componentes de domínio para sistemas operacionais

    tools/
      componentes de domínio para ferramentas

    npm/
      componentes de domínio para pacotes npm

    commands/
      componentes de domínio para comandos

    ai/
      componentes do assistente IA

    settings/
      componentes de configurações

  lib/
    supabase/
      clients browser, server, middleware e admin

    validations/
      schemas Zod

    constants.ts
      labels, catálogos e navegação

    health.ts
      cálculo de saúde dos ambientes

  types/
    tipos do banco e tipos de domínio

supabase/
  schema.sql
    schema completo, RLS, triggers e políticas

  functions/
    ai-recommendations/
      Edge Function responsável pela comunicação com a OpenAI
```

---

## Pré-requisitos

Antes de rodar o projeto, você precisa ter:

- Node.js 18.18 ou superior
- npm, pnpm ou yarn
- Conta no Supabase
- Projeto criado no Supabase
- API key da OpenAI
- Supabase CLI, caso queira fazer deploy da Edge Function via terminal

---

## Instalação

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/setupguide-ai.git
```

Acesse a pasta:

```bash
cd setupguide-ai
```

Instale as dependências:

```bash
npm install
```

---

## Configuração do Supabase

Crie um projeto no Supabase.

Depois, acesse:

```txt
Supabase Dashboard > SQL Editor
```

Cole e execute o conteúdo do arquivo:

```txt
supabase/schema.sql
```

Esse script cria:

- Tabelas
- Relacionamentos
- Políticas de RLS
- Triggers de `updated_at`
- Trigger de criação automática de perfil
- Log de alterações
- Estrutura inicial para templates de setup

---

## Configuração da Edge Function de IA

A função `ai-recommendations` é responsável por se comunicar com a OpenAI.

A chave da OpenAI deve ficar apenas nos secrets da função.

Faça login no Supabase CLI:

```bash
supabase login
```

Vincule o projeto:

```bash
supabase link --project-ref SEU_PROJECT_REF
```

Adicione a chave da OpenAI:

```bash
supabase secrets set OPENAI_API_KEY=sk-...
```

Opcionalmente, defina o modelo:

```bash
supabase secrets set OPENAI_MODEL=gpt-5.5
```

Faça o deploy da função:

```bash
supabase functions deploy ai-recommendations
```

---

## Variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env.local
```

Configure as variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000

SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

### Observação sobre URLs

A variável `NEXT_PUBLIC_SITE_URL` é usada nos links de confirmação de e-mail e recuperação de senha.

Em produção, configure o domínio real também no Supabase:

```txt
Authentication > URL Configuration
```

Adicione:

```txt
https://seudominio.com
```

E, em desenvolvimento:

```txt
http://localhost:3000
```

---

## Rodando em desenvolvimento

Inicie o servidor local:

```bash
npm run dev
```

Acesse:

```txt
http://localhost:3000
```

Crie uma conta, confirme o e-mail, cadastre um ambiente e teste o assistente IA.

---

## Scripts disponíveis

| Comando             | Descrição                            |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Inicia o ambiente de desenvolvimento |
| `npm run build`     | Gera a build de produção             |
| `npm run start`     | Roda a aplicação em produção         |
| `npm run lint`      | Executa verificação de lint          |
| `npm run typecheck` | Executa verificação de tipos         |
| `npm run format`    | Formata o código                     |

---

## Fluxo de uso

```txt
1. Criar conta
2. Confirmar e-mail
3. Cadastrar um sistema operacional
4. Adicionar ferramentas
5. Registrar pacotes npm
6. Salvar comandos importantes
7. Rodar análise com IA
8. Revisar recomendações
9. Salvar tecnologias no Radar de Techs
```

---

## Fase 2

A próxima fase do projeto deve expandir o MVP para recursos mais avançados.

### Templates de setup

Criação de setups reproduzíveis, com etapas organizadas passo a passo.

Exemplo:

```txt
Setup Frontend React
  1. Instalar Node.js
  2. Instalar pnpm
  3. Criar projeto com Vite
  4. Instalar Tailwind CSS
  5. Configurar ESLint e Prettier
```

### Exportação

Exportação dos setups em formatos como:

- JSON
- Markdown
- `.sh`
- `.ps1`

### App desktop

Planejado com Tauri para funcionar em:

- Windows
- Linux
- macOS

### Monorepo

Organização futura em monorepo para separar:

- App web
- App desktop
- Pacotes compartilhados
- Tipagens
- Utilitários

---

## Convenções do projeto

- Interface em português.
- Identificadores de código em inglês.
- Rotas sem acentos.
- Valores de enum sem acentos.
- Componentes organizados por domínio.
- Validações centralizadas com Zod.
- Regras sensíveis protegidas no servidor.
- Acesso aos dados protegido por RLS.
- Estética escura, moderna e profissional.

---

## Possíveis melhorias futuras

- Sistema de planos e limites de uso da IA
- Painel administrativo
- Controle de créditos por usuário
- Histórico detalhado de análises da IA
- Comparação entre setups
- Compartilhamento público de guias
- Marketplace de templates
- Integração com GitHub
- Exportação automática para scripts instaláveis
- Suporte a LLM local ou gateway de múltiplos providers

---

## Autor

Desenvolvido por **TM Dev**.

Projeto criado para resolver uma dor real de desenvolvedores: reduzir retrabalho, organizar conhecimento técnico e transformar setups repetitivos em guias reutilizáveis.

---

<div align="center">

**SetupGuide AI**
Menos tempo configurando. Mais tempo desenvolvendo.

</div>
