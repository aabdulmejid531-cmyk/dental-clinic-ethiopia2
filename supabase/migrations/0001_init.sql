-- Dama Dental — initial schema
-- Run this in Supabase: Dashboard → SQL Editor → New query → paste → Run
-- (or via the Supabase CLI: supabase db push)

create extension if not exists "uuid-ossp";

-- ── Enums ────────────────────────────────────────────────────────────────
create type user_role as enum ('patient', 'doctor', 'admin');
create type appointment_status as enum ('pending', 'confirmed', 'completed', 'cancelled');
create type chat_language as enum ('am', 'en');
create type chat_sender as enum ('patient', 'ai');

-- ── Tables ───────────────────────────────────────────────────────────────

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  phone text,
  date_of_birth date,
  address text,
  emergency_contact text,
  role user_role not null default 'patient',
  created_at timestamptz not null default now()
);

create table appointments (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references profiles (id) on delete cascade,
  doctor_id uuid references profiles (id) on delete set null,
  datetime timestamptz not null,
  status appointment_status not null default 'pending',
  reason text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table medical_records (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references profiles (id) on delete cascade,
  doctor_id uuid not null references profiles (id) on delete set null,
  diagnosis text not null,
  treatment_plan text,
  prescription jsonb,
  ai_suggestions text,
  attachments text[],
  visit_date date not null default current_date,
  created_at timestamptz not null default now()
);

create table ai_chat_sessions (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references profiles (id) on delete cascade,
  started_at timestamptz not null default now(),
  language chat_language not null default 'en'
);

create table ai_chat_messages (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references ai_chat_sessions (id) on delete cascade,
  sender chat_sender not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles (id) on delete cascade,
  title text not null,
  body text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── Indexes ──────────────────────────────────────────────────────────────
create index appointments_patient_idx on appointments (patient_id);
create index appointments_doctor_idx on appointments (doctor_id);
create index medical_records_patient_idx on medical_records (patient_id);
create index notifications_user_idx on notifications (user_id, is_read);

-- ── Helper: current user's role (avoids recursive RLS lookups) ─────────────
create or replace function current_role_is(target_role user_role)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = target_role
  );
$$;

-- ── Row Level Security ───────────────────────────────────────────────────
alter table profiles enable row level security;
alter table appointments enable row level security;
alter table medical_records enable row level security;
alter table ai_chat_sessions enable row level security;
alter table ai_chat_messages enable row level security;
alter table notifications enable row level security;

-- profiles: everyone can read their own row; doctors/admins can read all;
-- admins can update any row (e.g. to change roles); users can update their own.
create policy "profiles_select_own_or_staff" on profiles
  for select using (
    auth.uid() = id or current_role_is('doctor') or current_role_is('admin')
  );

create policy "profiles_insert_own" on profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id or current_role_is('admin'));

-- appointments: patients see their own; doctors see ones assigned to them;
-- admins see everything. Patients can create their own requests.
create policy "appointments_select" on appointments
  for select using (
    auth.uid() = patient_id or auth.uid() = doctor_id or current_role_is('admin')
  );

create policy "appointments_insert_patient" on appointments
  for insert with check (auth.uid() = patient_id);

create policy "appointments_update_staff_or_owner" on appointments
  for update using (
    auth.uid() = patient_id or auth.uid() = doctor_id or current_role_is('admin')
  );

-- medical_records: patients read their own (read-only); doctors/admins read & write.
create policy "medical_records_select" on medical_records
  for select using (
    auth.uid() = patient_id or current_role_is('doctor') or current_role_is('admin')
  );

create policy "medical_records_insert_staff" on medical_records
  for insert with check (current_role_is('doctor') or current_role_is('admin'));

create policy "medical_records_update_staff" on medical_records
  for update using (current_role_is('doctor') or current_role_is('admin'));

-- ai_chat_sessions / messages: a patient only sees their own conversations.
create policy "chat_sessions_owner" on ai_chat_sessions
  for all using (auth.uid() = patient_id) with check (auth.uid() = patient_id);

create policy "chat_messages_owner" on ai_chat_messages
  for all using (
    exists (
      select 1 from ai_chat_sessions s
      where s.id = session_id and s.patient_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from ai_chat_sessions s
      where s.id = session_id and s.patient_id = auth.uid()
    )
  );

-- notifications: a user only sees their own.
create policy "notifications_owner" on notifications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Auto-create a profile row whenever a new auth user signs up ────────────
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'New patient'),
    'patient'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
