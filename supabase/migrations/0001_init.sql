-- ============================================================
-- Campi — esquema inicial de base de datos (Supabase / Postgres)
-- Ejecutar una sola vez en: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Extensiones
create extension if not exists "pgcrypto";

-- Roles de usuario
do $$ begin
  create type public.user_role as enum ('viajero', 'dueño');
exception when duplicate_object then null; end $$;

-- ------------------------------------------------------------
-- Perfiles (1:1 con auth.users)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null default '',
  rol public.user_role not null default 'viajero',
  creado_en timestamptz not null default now()
);

-- Crea el perfil automáticamente al registrarse un usuario
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nombre, rol)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nombre', ''),
    coalesce((new.raw_user_meta_data ->> 'rol')::public.user_role, 'viajero')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- Campings
-- ------------------------------------------------------------
create table if not exists public.campings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  nombre text not null,
  zona text not null,
  region text not null,
  descripcion text not null default '',
  capacidad int not null default 4 check (capacidad between 1 and 50),
  servicios text[] not null default '{}',
  reglas text[] not null default '{}',
  precio int not null default 0 check (precio >= 0),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

-- Fotos (rutas dentro del bucket storage)
create table if not exists public.camping_fotos (
  id uuid primary key default gen_random_uuid(),
  camping_id uuid not null references public.campings(id) on delete cascade,
  url text not null,
  orden int not null default 0,
  creado_en timestamptz not null default now()
);

-- Disponibilidad por fecha
create table if not exists public.disponibilidad (
  id uuid primary key default gen_random_uuid(),
  camping_id uuid not null references public.campings(id) on delete cascade,
  fecha date not null,
  disponible boolean not null default true,
  unique (camping_id, fecha)
);

-- Reseñas (estrellas + comentario)
create table if not exists public.resenas (
  id uuid primary key default gen_random_uuid(),
  camping_id uuid not null references public.campings(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  nota int not null check (nota between 1 and 5),
  comentario text not null default '',
  creado_en timestamptz not null default now(),
  unique (camping_id, user_id)
);

-- ------------------------------------------------------------
-- Índices
-- ------------------------------------------------------------
create index if not exists idx_campings_owner on public.campings(owner_id);
create index if not exists idx_resenas_camping on public.resenas(camping_id);
create index if not exists idx_disponibilidad_camping on public.disponibilidad(camping_id, fecha);
create index if not exists idx_fotos_camping on public.camping_fotos(camping_id, orden);

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.campings enable row level security;
alter table public.camping_fotos enable row level security;
alter table public.disponibilidad enable row level security;
alter table public.resenas enable row level security;

-- profiles: cualquiera puede ver; cada uno edita el suyo
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select using (true);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);

-- campings: cualquiera puede ver; el dueño crea/edita/borra lo suyo
drop policy if exists "campings_select" on public.campings;
create policy "campings_select" on public.campings for select using (true);
drop policy if exists "campings_insert_owner" on public.campings;
create policy "campings_insert_owner" on public.campings for insert
  with check (
    auth.uid() = owner_id
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.rol = 'dueño')
  );
drop policy if exists "campings_update_owner" on public.campings;
create policy "campings_update_owner" on public.campings for update
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
drop policy if exists "campings_delete_owner" on public.campings;
create policy "campings_delete_owner" on public.campings for delete
  using (auth.uid() = owner_id);

-- fotos: cualquiera puede ver; el dueño gestiona
drop policy if exists "fotos_select" on public.camping_fotos;
create policy "fotos_select" on public.camping_fotos for select using (true);
drop policy if exists "fotos_manage_owner" on public.camping_fotos;
create policy "fotos_manage_owner" on public.camping_fotos for all
  using (
    exists (select 1 from public.campings c where c.id = camping_id and c.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from public.campings c where c.id = camping_id and c.owner_id = auth.uid())
  );

-- disponibilidad: cualquiera puede ver; el dueño gestiona
drop policy if exists "disponibilidad_select" on public.disponibilidad;
create policy "disponibilidad_select" on public.disponibilidad for select using (true);
drop policy if exists "disponibilidad_manage_owner" on public.disponibilidad;
create policy "disponibilidad_manage_owner" on public.disponibilidad for all
  using (
    exists (select 1 from public.campings c where c.id = camping_id and c.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from public.campings c where c.id = camping_id and c.owner_id = auth.uid())
  );

-- reseñas: cualquiera puede ver; el usuario gestiona las suyas
drop policy if exists "resenas_select" on public.resenas;
create policy "resenas_select" on public.resenas for select using (true);
drop policy if exists "resenas_insert_own" on public.resenas;
create policy "resenas_insert_own" on public.resenas for insert
  with check (auth.uid() = user_id);
drop policy if exists "resenas_update_own" on public.resenas;
create policy "resenas_update_own" on public.resenas for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "resenas_delete_own" on public.resenas;
create policy "resenas_delete_own" on public.resenas for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Vista pública con nota promedio, cantidad y fotos
-- ------------------------------------------------------------
create or replace view public.campings_detalle
with (security_invoker = on) as
select
  c.id,
  c.owner_id,
  c.nombre,
  c.zona,
  c.region,
  c.descripcion,
  c.capacidad,
  c.servicios,
  c.reglas,
  c.precio,
  c.creado_en,
  round(coalesce(r.nota_promedio, 0), 1)::float as nota,
  coalesce(r.cantidad, 0)::int as resenas,
  coalesce(
    (
      select json_agg(json_build_object('url', f.url, 'orden', f.orden) order by f.orden)
      from public.camping_fotos f
      where f.camping_id = c.id
    ),
    '[]'::json
  ) as fotos
from public.campings c
left join (
  select camping_id, avg(nota) as nota_promedio, count(*)::int as cantidad
  from public.resenas
  group by camping_id
) r on r.camping_id = c.id;

-- ------------------------------------------------------------
-- Storage: bucket público para fotos de campings
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('camping-fotos', 'camping-fotos', true)
on conflict (id) do nothing;

drop policy if exists "fotos_public_read" on storage.objects;
create policy "fotos_public_read" on storage.objects
  for select using (bucket_id = 'camping-fotos');

drop policy if exists "fotos_owner_insert" on storage.objects;
create policy "fotos_owner_insert" on storage.objects
  for insert with check (
    bucket_id = 'camping-fotos'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "fotos_owner_delete" on storage.objects;
create policy "fotos_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'camping-fotos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
