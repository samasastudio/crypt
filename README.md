---
title: "Crypt Vault"
type: moc
tags:
  - vault/moc
  - infra/search
---

# Crypt Vault

This vault combines project documentation, product specs, and a structured cooking and grocery knowledge base inside Obsidian. It now has both a working semantic indexing pipeline and a retrieval API on top of Supabase so agents and retrieval workflows can query the vault by meaning instead of only by filename or keyword.

## Start Here

- [Optimization Roadmap](ROADMAP.md)
- [Deployment Checklist](#deployment-checklist)
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
- Retrieval API: `supabase/functions/search-vault/`
- MCP server (local): `tools/vault-mcp/` with `search_basilisk` (stdio transport)
- MCP server (remote): `supabase/functions/vault-mcp/` with `search_basilisk`, `search_vault`, `search_cooking` (Streamable HTTP transport)
- Remote MCP endpoint: `https://zjghdtmnhjgzhgnwnjre.supabase.co/functions/v1/vault-mcp`
- Retrieval API deployment: live in Supabase and validated against the indexed vault
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

The first shared retrieval API now also exists as `search-vault` in `supabase/functions/search-vault/`. Use that function when you want server-side embedding, filtering, deduping, and a response format ready for agent consumers.

Deployment note:

- the hosted `search-vault` function is now live
- manual validation confirmed end-to-end retrieval against the production Supabase project
- current observed Basilisk match scores are commonly below `0.65`, so retrieval tuning is now the main quality task

## Remote MCP Client Configuration

Any MCP client that supports Streamable HTTP transport can connect directly:

```json
{
  "mcpServers": {
    "vault-mcp": {
      "url": "https://zjghdtmnhjgzhgnwnjre.supabase.co/functions/v1/vault-mcp"
    }
  }
}
```

For clients that only support stdio (e.g., older Claude Desktop versions), use the `mcp-remote` adapter:

```json
{
  "mcpServers": {
    "vault-mcp": {
      "command": "npx",
      "args": ["mcp-remote", "https://zjghdtmnhjgzhgnwnjre.supabase.co/functions/v1/vault-mcp"]
    }
  }
}
```

The remote server exposes three tools:

- `search_basilisk` — scoped to `Projects/Basilisk SH`
- `search_cooking` — scoped to `Cooking`
- `search_vault` — general-purpose, full-vault search

## Known Issues And Fixes We Already Hit

- Initial GitHub push: the workflow needed a first-push-safe diff strategy
- Manual reruns: the workflow now treats manual runs as full reindexes automatically
- OpenAI quota errors: fixed by enabling API billing on the correct project
- Oversized JSON chunks: the chunker now splits large flat blobs into embedding-safe slices

## Agent And RAG Direction

The retrieval stack is deployed end-to-end. The next priorities are retrieval quality tuning and building toward a citation-first answer layer.

Current status:

- `search_basilisk`, `search_vault`, and `search_cooking` are all live on the remote MCP endpoint
- Any MCP-compatible agent (Claude, Cursor, Windsurf, ChatGPT, custom clients) can connect via Streamable HTTP
- The local stdio MCP server at `tools/vault-mcp/` is also available for local development

Recommended near-term path:

1. Deploy the `vault-mcp` Edge Function (see [Deployment Checklist](#deployment-checklist) below).
2. Build a retrieval evaluation harness for 10–20 representative queries.
3. Improve retrieval quality by prepending heading context to chunk content.
4. Add content-hash skip to the indexer to reduce embedding costs.
5. Build a citation-first answer layer once retrieval quality is proven.

See [Optimization Roadmap](ROADMAP.md) for the full prioritized plan, [Semantic search and agent RAG plan](Projects/Semantic%20Search%20and%20Agent%20RAG.md) for the retrieval/RAG strategy, and [Semantic search stack spec](Projects/Semantic%20Search%20Stack%20Spec.md) for the architecture.

## Deployment Checklist

The `vault-mcp` Edge Function is ready to deploy. Run these commands from your local checkout with the Supabase CLI:

### 1. Link your Supabase project (if not already linked)

```bash
supabase link --project-ref zjghdtmnhjgzhgnwnjre
```

### 2. Set the required secrets

The `vault-mcp` function needs two environment variables. If `search-vault` is already deployed, `INTERNAL_SEARCH_TOKEN` is already set — you only need to add `SEARCH_VAULT_URL`:

```bash
supabase secrets set SEARCH_VAULT_URL=https://zjghdtmnhjgzhgnwnjre.supabase.co/functions/v1/search-vault
```

If `INTERNAL_SEARCH_TOKEN` is not yet set:

```bash
supabase secrets set INTERNAL_SEARCH_TOKEN=<your-token>
```

### 3. Deploy the function

```bash
supabase functions deploy --no-verify-jwt vault-mcp
```

### 4. Verify the deployment

Test with curl:

```bash
curl -X POST 'https://zjghdtmnhjgzhgnwnjre.supabase.co/functions/v1/vault-mcp' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list",
    "params": {}
  }'
```

You should see the three tools listed: `search_basilisk`, `search_vault`, and `search_cooking`.

### 5. Connect an MCP client

Add this to your MCP client configuration (Claude Desktop, Cursor, etc.):

```json
{
  "mcpServers": {
    "vault-mcp": {
      "url": "https://zjghdtmnhjgzhgnwnjre.supabase.co/functions/v1/vault-mcp"
    }
  }
}
```
