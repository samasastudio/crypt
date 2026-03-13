create extension if not exists vector;

create table if not exists public.vault_chunks (
  id text primary key,
  repo_path text not null,
  source_type text not null,
  title text,
  heading_path text[] default '{}'::text[] not null,
  chunk_index integer not null,
  content text not null,
  content_hash text not null,
  embedding vector(1536) not null,
  metadata jsonb default '{}'::jsonb not null,
  git_commit_sha text,
  last_indexed_at timestamptz default now() not null
);

create unique index if not exists vault_chunks_repo_path_chunk_index_idx
  on public.vault_chunks (repo_path, chunk_index);

create index if not exists vault_chunks_repo_path_idx
  on public.vault_chunks (repo_path);

create index if not exists vault_chunks_embedding_idx
  on public.vault_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create table if not exists public.vault_sources (
  repo_path text primary key,
  source_hash text,
  last_seen_commit text,
  last_indexed_at timestamptz default now() not null,
  status text not null check (status in ('active', 'deleted'))
);

create or replace function public.match_vault_chunks(
  query_embedding vector(1536),
  match_count integer default 10,
  filter jsonb default '{}'::jsonb
)
returns table (
  id text,
  repo_path text,
  source_type text,
  title text,
  heading_path text[],
  content text,
  metadata jsonb,
  similarity double precision
)
language sql
stable
as $$
  select
    vc.id,
    vc.repo_path,
    vc.source_type,
    vc.title,
    vc.heading_path,
    vc.content,
    vc.metadata,
    1 - (vc.embedding <=> query_embedding) as similarity
  from public.vault_chunks vc
  where
    (
      coalesce(filter->>'repo_path_prefix', '') = ''
      or vc.repo_path like (filter->>'repo_path_prefix') || '%'
    )
    and (
      coalesce(filter->>'source_type', '') = ''
      or vc.source_type = filter->>'source_type'
    )
    and (
      filter = '{}'::jsonb
      or vc.metadata @> (filter - 'repo_path_prefix' - 'source_type')
    )
  order by vc.embedding <=> query_embedding
  limit greatest(match_count, 1);
$$;
