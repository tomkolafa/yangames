-- YanGames leaderboard schema.
-- Run once in the Supabase dashboard → SQL Editor → New query → Run.
-- Safe to re-run (idempotent).

create table if not exists public.scores (
  id          bigint generated always as identity primary key,
  game        text        not null check (game in ('yandl','rundl','snakl','packl','pourl','memorl','brewl','trainl','spacl','slicl','routl')),
  name        text        not null check (char_length(name) between 1 and 24),
  emoji       text        check (char_length(emoji) <= 8),
  score       integer     not null default 0 check (score >= 0 and score <= 1000000),
  guesses     smallint    check (guesses between 1 and 6),
  time_ms     integer     check (time_ms >= 0 and time_ms <= 86400000),
  puzzle      integer     check (puzzle >= 0),
  char_id     text        check (char_length(char_id) <= 2),
  created_at  timestamptz not null default now()
);

-- Fast top-N lookups
create index if not exists scores_rundl_idx on public.scores (score desc)        where game = 'rundl';
create index if not exists scores_snakl_idx on public.scores (score desc)        where game = 'snakl';
create index if not exists scores_packl_idx on public.scores (score desc)        where game = 'packl';
create index if not exists scores_pourl_idx on public.scores (score desc)        where game = 'pourl';
create index if not exists scores_memorl_idx on public.scores (score desc)       where game = 'memorl';
create index if not exists scores_brewl_idx on public.scores (score desc)        where game = 'brewl';
create index if not exists scores_trainl_idx on public.scores (score desc)       where game = 'trainl';
create index if not exists scores_spacl_idx on public.scores (score desc)        where game = 'spacl';
create index if not exists scores_slicl_idx on public.scores (score desc)        where game = 'slicl';
create index if not exists scores_routl_idx on public.scores (score desc)        where game = 'routl';
create index if not exists scores_yandl_idx on public.scores (puzzle, guesses, time_ms) where game = 'yandl';

-- Row level security: public read, bounded public insert, no update/delete.
alter table public.scores enable row level security;

drop policy if exists scores_select_public on public.scores;
create policy scores_select_public on public.scores
  for select using (true);

drop policy if exists scores_insert_public on public.scores;
create policy scores_insert_public on public.scores
  for insert with check (
    game in ('yandl','rundl','snakl','packl','pourl','memorl','brewl','trainl','spacl','slicl','routl')
    and char_length(name) between 1 and 24
    and score between 0 and 1000000
  );
