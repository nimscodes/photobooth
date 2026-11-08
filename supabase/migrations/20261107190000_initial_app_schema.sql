begin;

create table if not exists public.bookings (
  id uuid primary key,
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'deposit', 'paid')),
  full_name text not null,
  email text not null,
  phone text not null,
  event_date date not null,
  intent_type text not null check (intent_type in ('book', 'questions', 'checking')),
  question text,
  event_start_time text,
  event_end_time text,
  event_type text,
  event_type_other text,
  guest_count integer,
  venue_name text,
  venue_street text,
  venue_city text,
  venue_state text,
  venue_zip text,
  package_id text,
  add_ons text[] not null default '{}',
  backdrop_choice text,
  notes text,
  admin_notes text,
  calendar_event_id text
);

create index if not exists bookings_event_date_idx on public.bookings (event_date);

create table if not exists public.blocked_dates (
  date date primary key
);

create table if not exists public.gallery_photos (
  id uuid primary key,
  url text not null,
  category text not null default 'General',
  caption text not null default '',
  created_at timestamptz not null default now(),
  filename text not null
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('gallery', 'gallery', true, 4194304, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

commit;
