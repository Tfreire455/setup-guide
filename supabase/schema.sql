-- =============================================================================
-- SetupGuide AI - Schema Supabase (Postgres)
-- Execute no SQL Editor do Supabase (ou via `supabase db push`).
-- Ordem: extensoes -> tabelas -> indices -> funcoes -> triggers -> RLS.
-- =============================================================================

create extension if not exists pgcrypto;

-- =============================================================================
-- TABELAS
-- =============================================================================

-- Perfil do usuario (1:1 com auth.users)
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Sistemas operacionais / ambientes cadastrados
create table if not exists public.operating_systems (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles (id) on delete cascade,
  name            text not null,
  os_type         text not null,            -- windows | linux | macos | wsl | vm | docker | outro
  distribution    text,                     -- ubuntu | debian | fedora | arch | mint ...
  version         text,
  architecture    text,                     -- x64 | arm64
  package_manager text,                     -- apt | dnf | pacman | brew | winget | choco | scoop | nix | outro
  terminal        text,
  shell           text,
  notes           text,
  tags            text[] not null default '{}',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Ferramentas instaladas por ambiente
create table if not exists public.tools (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references public.profiles (id) on delete cascade,
  os_id                 uuid not null references public.operating_systems (id) on delete cascade,
  name                  text not null,
  category              text,
  installed_version     text,
  version_check_command text,
  install_command       text,
  update_command        text,
  documentation_url     text,
  status                text not null default 'installed', -- installed | pending | needs_update | removed
  notes                 text,
  last_checked_at       timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Projetos do usuario (referenciado por npm_packages)
create table if not exists public.projects (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles (id) on delete cascade,
  name           text not null,
  description    text,
  stack          text[] not null default '{}',
  repository_url text,
  os_id          uuid references public.operating_systems (id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Pacotes npm (globais ou por projeto)
create table if not exists public.npm_packages (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles (id) on delete cascade,
  os_id           uuid references public.operating_systems (id) on delete cascade,
  project_id      uuid references public.projects (id) on delete set null,
  name            text not null,
  version         text,
  scope           text not null default 'global', -- global | project
  reason          text,
  install_command text,
  update_command  text,
  npm_url         text,
  tags            text[] not null default '{}',
  status          text not null default 'active', -- active | legacy | replaced | test_update
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Biblioteca de comandos
create table if not exists public.commands (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles (id) on delete cascade,
  os_id          uuid references public.operating_systems (id) on delete set null,
  title          text not null,
  command        text not null,
  category       text,
  explanation    text,
  risk_level     text not null default 'low', -- low | medium | high
  requires_admin boolean not null default false,
  is_favorite    boolean not null default false,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Setups completos (templates / receitas)
create table if not exists public.setup_templates (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  name          text not null,
  description   text,
  compatible_os text[] not null default '{}',
  version       text not null default '1.0.0',
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Passos de um setup
create table if not exists public.setup_steps (
  id                    uuid primary key default gen_random_uuid(),
  setup_id              uuid not null references public.setup_templates (id) on delete cascade,
  order_index           int not null default 0,
  title                 text not null,
  description           text,
  command               text,
  os_target             text,
  risk_level            text not null default 'low',
  requires_confirmation boolean not null default false,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Recomendacoes geradas pela IA
create table if not exists public.ai_recommendations (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.profiles (id) on delete cascade,
  os_id              uuid references public.operating_systems (id) on delete set null,
  setup_id           uuid references public.setup_templates (id) on delete set null,
  title              text not null,
  description        text,
  priority           text not null default 'medium', -- high | medium | low
  category           text,
  status             text not null default 'new',     -- new | want_to_test | adopted | ignored
  sources            jsonb not null default '[]',
  suggested_commands jsonb not null default '[]',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- Historico de alteracoes (preenchido automaticamente por trigger)
create table if not exists public.change_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid,
  entity_type text not null,
  entity_id   uuid,
  action      text not null, -- INSERT | UPDATE | DELETE
  old_value   jsonb,
  new_value   jsonb,
  created_at  timestamptz not null default now()
);

-- Log de uso de IA (auditoria + rate limit)
create table if not exists public.ai_usage_logs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  action        text not null default 'recommendation',
  model         text,
  os_id         uuid references public.operating_systems (id) on delete set null,
  tokens_input  int,
  tokens_output int,
  created_at    timestamptz not null default now()
);

-- =============================================================================
-- INDICES
-- =============================================================================
create index if not exists idx_os_user            on public.operating_systems (user_id);
create index if not exists idx_tools_user          on public.tools (user_id);
create index if not exists idx_tools_os            on public.tools (os_id);
create index if not exists idx_projects_user       on public.projects (user_id);
create index if not exists idx_npm_user            on public.npm_packages (user_id);
create index if not exists idx_npm_os              on public.npm_packages (os_id);
create index if not exists idx_commands_user       on public.commands (user_id);
create index if not exists idx_setups_user         on public.setup_templates (user_id);
create index if not exists idx_setup_steps_setup   on public.setup_steps (setup_id);
create index if not exists idx_ai_rec_user         on public.ai_recommendations (user_id);
create index if not exists idx_ai_rec_status       on public.ai_recommendations (status);
create index if not exists idx_change_logs_user    on public.change_logs (user_id);
create index if not exists idx_change_logs_entity  on public.change_logs (entity_type, entity_id);
create index if not exists idx_ai_usage_user_time  on public.ai_usage_logs (user_id, created_at desc);

-- =============================================================================
-- FUNCOES
-- =============================================================================

-- Mantem updated_at sempre atualizado
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Cria profile automaticamente quando um usuario se registra
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Auditoria generica -> change_logs
create or replace function public.log_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id   uuid;
  v_entity_id uuid;
  v_old       jsonb;
  v_new       jsonb;
begin
  if (tg_op = 'DELETE') then
    v_old := to_jsonb(old);
    v_entity_id := (v_old ->> 'id')::uuid;
    v_user_id := (v_old ->> 'user_id')::uuid;
  elsif (tg_op = 'UPDATE') then
    v_old := to_jsonb(old);
    v_new := to_jsonb(new);
    v_entity_id := (v_new ->> 'id')::uuid;
    v_user_id := (v_new ->> 'user_id')::uuid;
  else
    v_new := to_jsonb(new);
    v_entity_id := (v_new ->> 'id')::uuid;
    v_user_id := (v_new ->> 'user_id')::uuid;
  end if;

  insert into public.change_logs (user_id, entity_type, entity_id, action, old_value, new_value)
  values (v_user_id, tg_table_name, v_entity_id, tg_op, v_old, v_new);

  if (tg_op = 'DELETE') then
    return old;
  end if;
  return new;
end;
$$;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Profile no signup (na tabela auth.users)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at
do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles','operating_systems','tools','projects','npm_packages',
    'commands','setup_templates','setup_steps','ai_recommendations'
  ]
  loop
    execute format('drop trigger if exists set_updated_at on public.%I;', t);
    execute format(
      'create trigger set_updated_at before update on public.%I
       for each row execute function public.set_updated_at();', t);
  end loop;
end $$;

-- Auditoria (apenas tabelas com coluna user_id)
do $$
declare
  t text;
begin
  foreach t in array array[
    'operating_systems','tools','projects','npm_packages',
    'commands','setup_templates','ai_recommendations'
  ]
  loop
    execute format('drop trigger if exists audit_changes on public.%I;', t);
    execute format(
      'create trigger audit_changes after insert or update or delete on public.%I
       for each row execute function public.log_changes();', t);
  end loop;
end $$;

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

alter table public.profiles           enable row level security;
alter table public.operating_systems   enable row level security;
alter table public.tools               enable row level security;
alter table public.projects            enable row level security;
alter table public.npm_packages        enable row level security;
alter table public.commands            enable row level security;
alter table public.setup_templates     enable row level security;
alter table public.setup_steps         enable row level security;
alter table public.ai_recommendations  enable row level security;
alter table public.change_logs         enable row level security;
alter table public.ai_usage_logs       enable row level security;

-- profiles (chave e id)
drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_insert_own on public.profiles;
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_select_own on public.profiles for select using (auth.uid() = id);
create policy profiles_insert_own on public.profiles for insert with check (auth.uid() = id);
create policy profiles_update_own on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- Politicas padrao (auth.uid() = user_id) para as tabelas owned
do $$
declare
  t text;
begin
  foreach t in array array[
    'operating_systems','tools','projects','npm_packages',
    'commands','setup_templates','ai_recommendations'
  ]
  loop
    execute format('drop policy if exists %I on public.%I;', t || '_select_own', t);
    execute format('drop policy if exists %I on public.%I;', t || '_insert_own', t);
    execute format('drop policy if exists %I on public.%I;', t || '_update_own', t);
    execute format('drop policy if exists %I on public.%I;', t || '_delete_own', t);

    execute format(
      'create policy %I on public.%I for select using (auth.uid() = user_id);',
      t || '_select_own', t);
    execute format(
      'create policy %I on public.%I for insert with check (auth.uid() = user_id);',
      t || '_insert_own', t);
    execute format(
      'create policy %I on public.%I for update using (auth.uid() = user_id) with check (auth.uid() = user_id);',
      t || '_update_own', t);
    execute format(
      'create policy %I on public.%I for delete using (auth.uid() = user_id);',
      t || '_delete_own', t);
  end loop;
end $$;

-- setup_steps: dono verificado via setup_templates pai
drop policy if exists setup_steps_select_own on public.setup_steps;
drop policy if exists setup_steps_insert_own on public.setup_steps;
drop policy if exists setup_steps_update_own on public.setup_steps;
drop policy if exists setup_steps_delete_own on public.setup_steps;
create policy setup_steps_select_own on public.setup_steps for select
  using (exists (select 1 from public.setup_templates s where s.id = setup_id and s.user_id = auth.uid()));
create policy setup_steps_insert_own on public.setup_steps for insert
  with check (exists (select 1 from public.setup_templates s where s.id = setup_id and s.user_id = auth.uid()));
create policy setup_steps_update_own on public.setup_steps for update
  using (exists (select 1 from public.setup_templates s where s.id = setup_id and s.user_id = auth.uid()));
create policy setup_steps_delete_own on public.setup_steps for delete
  using (exists (select 1 from public.setup_templates s where s.id = setup_id and s.user_id = auth.uid()));

-- change_logs / ai_usage_logs: usuario so LE os proprios registros.
-- (inserts sao feitos por triggers/edge function com service_role, que ignora RLS)
drop policy if exists change_logs_select_own on public.change_logs;
create policy change_logs_select_own on public.change_logs for select using (auth.uid() = user_id);

drop policy if exists ai_usage_select_own on public.ai_usage_logs;
create policy ai_usage_select_own on public.ai_usage_logs for select using (auth.uid() = user_id);

-- =============================================================================
-- FIM
-- =============================================================================
