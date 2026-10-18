-- Suggested schema for a real ROYAL backend (not used by the demo, which stores data in localStorage).
-- See docs/backend-integration.md.

create type dining_area as enum ('main', 'window', 'chefs-counter', 'salon-noir', 'cellar-room');
create type reservation_status as enum ('requested', 'confirmed', 'modified', 'cancelled', 'completed', 'no_show');

create table restaurant_tables (
  id          text primary key,              -- 'M1', 'W3', 'CC' …
  label       text not null,
  area        dining_area not null,
  min_seats   smallint not null check (min_seats > 0),
  max_seats   smallint not null check (max_seats >= min_seats),
  x           real not null,                 -- floor-plan coordinates in metres
  z           real not null,
  active      boolean not null default true
);

create table reservations (
  reference    text primary key,             -- 'RYL-7F3K'
  status       reservation_status not null default 'requested',
  date         date not null,
  time         time not null,
  party_size   smallint not null check (party_size between 1 and 12),
  table_id     text not null references restaurant_tables (id),
  guest_name   text not null,
  guest_email  text not null,
  guest_phone  text not null,
  occasion     text,
  dietary      text,
  requests     text,
  wishlist     text[],
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- One active reservation per table and time slot.
create unique index reservations_table_slot_active
  on reservations (table_id, date, time)
  where status not in ('cancelled', 'no_show');

create index reservations_by_date on reservations (date, time);

-- Occupied slots, for availability queries.
create view reservation_slots as
  select table_id, date, time
  from reservations
  where status not in ('cancelled', 'no_show');

alter table reservations enable row level security;
-- Policies intentionally omitted: guest access should go through a signed link or OTP,
-- and staff access through an authenticated role.
