-- Create CMS schema
create schema if not exists cms;

-- Grant usage on schema to public
grant usage on schema cms to postgres, anon, authenticated, service_role;

-- CMS Menus Table
create table if not exists cms.menus (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    structure jsonb not null default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    updated_by uuid references auth.users(id)
);

-- CMS Pages Table
create table if not exists cms.pages (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    sections jsonb not null default '{}'::jsonb,
    seo jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    updated_by uuid references auth.users(id)
);

-- Enable RLS
alter table cms.menus enable row level security;
alter table cms.pages enable row level security;

-- Policies for Menus
create policy "Public can view menus"
    on cms.menus for select
    to public
    using (true);

create policy "Admins can manage menus"
    on cms.menus for all
    to authenticated
    using (
        exists (
            select 1 from identity.user_roles ur
            join identity.roles r on ur.role_id = r.id
            where ur.user_id = auth.uid()
            and r.name in ('admin', 'super_admin', 'content_manager')
        )
    );

-- Policies for Pages
create policy "Public can view pages"
    on cms.pages for select
    to public
    using (true);

create policy "Admins can manage pages"
    on cms.pages for all
    to authenticated
    using (
        exists (
            select 1 from identity.user_roles ur
            join identity.roles r on ur.role_id = r.id
            where ur.user_id = auth.uid()
            and r.name in ('admin', 'super_admin', 'content_manager')
        )
    );

-- Grant access to tables
grant select on all tables in schema cms to anon, authenticated;
grant all on all tables in schema cms to service_role;
