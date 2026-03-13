---
title: "Crypt Vault"
type: moc
tags:
  - vault/moc
  - infra/search
---

# Crypt Vault

This vault combines project documentation, product specs, and a structured cooking and grocery knowledge base inside Obsidian. It now also has a working semantic indexing pipeline that persists embeddings into Supabase so agents and retrieval workflows can query the vault by meaning instead of only by filename or keyword.

## Start Here

- [Cooking system](Cooking/README.md)
- [Basilisk SH](Projects/Basilisk%20SH/README.md)
- [Spec hub](Projects/Basilisk%20SH/docs/README.md)
- [Vault indexer implementation](tools/vault-indexer/README.md)
- [Semantic search and agent RAG plan](Projects/Semantic%20Search%20and%20Agent%20RAG.md)
- [Semantic search stack spec](Projects/Semantic%20Search%20Stack%20Spec.md)

## Semantic Search Status

The vault is now connected to a GitHub Actions workflow, OpenAI embeddings, and Supabase with `pgvector`.

Current baseline:

- Repository: [github.com/samasastudio/crypt](https://github.com/samasastudio/crypt)
- Workflow: `.github/workflows/index-vault.yml`
- Indexer code: `tools/vault-indexer/`
- Supabase migration: `supabase/migrations/20260311110000_create_vault_index.sql`
- Retrieval function: `public.match_vault_chunks(...)`
- Last successful full-index baseline: `262` sources and `1267` chunks

Indexed source types:

- Markdown notes
- Approved JSON knowledge files
- Obsidian canvas files

Excluded from indexing by default:

- `.obsidian/`
- `.git/`
- `tools/`
- `supabase/`
- `node_modules/`

## How The Pipeline Works

1. A push to `main` triggers incremental indexing for changed files.
2. A manual run of `Index Vault` in GitHub Actions performs a full reindex.
3. The indexer walks the vault, normalizes Markdown, flattens approved JSON, and extracts canvas text nodes.
4. Content is chunked into embedding-safe slices with overlap.
5. OpenAI generates embeddings for each chunk.
6. Supabase stores the chunks and embeddings in `public.vault_chunks`.
7. `pgvector` powers similarity search through `public.match_vault_chunks(...)`.

## Operating Checklist

### Re-run the full index

Use this when you want to rebuild the semantic index from scratch.

1. Open GitHub Actions for `Index Vault`
2. Run the workflow on `main`
3. Wait for the `Full reindex` step to complete

### Verify the index in Supabase

Run these in the Supabase SQL editor:

```sql
select count(*) from public.vault_sources;
select count(*) from public.vault_chunks;
```

Useful spot checks:

```sql
select repo_path, chunk_index, title
from public.vault_chunks
order by last_indexed_at desc
limit 20;
```

```sql
select source_type, count(*)
from public.vault_chunks
group by source_type
order by count(*) desc;
```

### Query the semantic index directly

The retrieval primitive already exists in Supabase:

```sql
select *
from public.match_vault_chunks(
  query_embedding => '[...]',
  match_count => 8,
  filter => '{"repo_path_prefix":"Projects/Basilisk SH"}'::jsonb
);
```

That function is the main bridge point for future agent tools and RAG services.

## Known Issues And Fixes We Already Hit

- Initial GitHub push: the workflow needed a first-push-safe diff strategy
- Manual reruns: the workflow now treats manual runs as full reindexes automatically
- OpenAI quota errors: fixed by enabling API billing on the correct project
- Oversized JSON chunks: the chunker now splits large flat blobs into embedding-safe slices

## Agent And RAG Direction

The vault is ready for the next layer: agents and retrieval-augmented generation.

Recommended near-term path:

1. Start with a small retrieval tool that embeds a query, calls `match_vault_chunks(...)`, and returns top chunks with citations.
2. Put that tool behind a simple API or server-side function so multiple agents can use the same retrieval logic.
3. Add scope filters so agents can search only `Cooking/` or only `Projects/Basilisk SH/` when appropriate.
4. Build a citation-first answer layer that always returns source paths and chunk excerpts.
5. Add evaluation queries and known-good prompts before expanding to more autonomous multi-step agents.

See [Semantic search and agent RAG plan](Projects/Semantic%20Search%20and%20Agent%20RAG.md) for the retrieval/RAG roadmap and [Semantic search stack spec](Projects/Semantic%20Search%20Stack%20Spec.md) for the full repo-plus-Edge-Function-plus-MCP architecture.
