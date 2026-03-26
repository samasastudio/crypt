---
title: "Crypt Optimization Roadmap"
type: roadmap
tags:
  - infra/search
  - infra/rag
  - vault/roadmap
---

# Optimization Roadmap

This roadmap tracks the prioritized work to move the Crypt vault's semantic search and RAG pipeline from its current functional baseline to production-grade agent readiness.

Current baseline (as of March 2026):

- 265 sources, 1,354 chunks indexed
- `search-vault` Edge Function deployed and live
- `vault-mcp` local stdio server with `search_basilisk`
- `vault-mcp` remote Edge Function with `search_basilisk`, `search_vault`, `search_cooking` (ready to deploy)
- GitHub Actions pipeline running on push to `main`
- Retrieval match scores for useful Basilisk hits: 0.48–0.60

See [README.md Deployment Checklist](README.md#deployment-checklist) for step-by-step deployment instructions.

## Priority 1 — Retrieval Quality (Critical Path)

These items directly unblock production usefulness. This is the highest-value work.

### 1a. Prepend heading context to chunk content

Modify `chunking.mjs` to inject the full heading hierarchy (e.g., `"# Title > Heading > Subheading\n\n"`) at the start of each chunk's content before embedding. Currently the heading path is stored as metadata but the chunk text itself lacks structural context, reducing the embedding model's ability to distinguish similar content across sections.

- Requires a code change in `tools/vault-indexer/src/chunking.mjs`
- Requires a full reindex after deployment
- Impact: Medium-High
- Cost: Low code change, moderate reindex cost

### 1b. Build a retrieval evaluation harness

Create a script that runs 10–20 representative queries and reports similarity scores, matched paths, and relevance judgments. Without this, every other quality improvement is flying blind.

Example queries to include:

- "How does Basilisk map ritual state to AV output?"
- "What are the seven hidden ritual stats?"
- "How does the Strudel export pipeline work?"
- "What is the audio family mapping system?"
- Cooking-domain queries once `search_cooking` is added

Deliverable: a CLI script (or test suite) that produces a scored evaluation report.

- Impact: High (enables data-driven tuning)
- Cost: Low

### 1c. Verify deployed similarity threshold

The repo code defaults `min_similarity` to `0.3` in `request.mjs`, but the Edge Function README references `0.65` as too strict from earlier evaluation. Verify the live deployed function matches the repo and redeploy if needed.

- Impact: High
- Cost: Near-zero

### 1d. Add content-hash skip to the indexer

Before calling OpenAI to generate embeddings, compare the chunk's `content_hash` against what's already stored in Supabase. Skip embedding and writing for unchanged chunks. The `content_hash` and `source_hash` fields already exist in the schema but are never checked.

This is the single largest cost-saving opportunity — embedding calls are the dominant expense, and most full reindexes touch very few changed documents.

- Estimated savings: 80–95% of embedding costs on typical runs
- Impact: High (cost reduction)
- Cost: Medium

## Priority 2 — Reliability and Correctness

### 2a. Make `replaceDocumentChunks` atomic

In `tools/vault-indexer/src/supabase.mjs`, the function first DELETEs all chunks for a `repo_path`, then INSERTs new ones. If the insert fails mid-way, the document has zero chunks until the next successful run. Wrap in a transaction or use an upsert strategy.

### 2b. Switch from IVFFlat to HNSW index

The current `vault_chunks_embedding_idx` uses IVFFlat with 100 lists. HNSW doesn't require periodic rebuilds and performs better at this scale (~1,300 chunks). Migration:

```sql
DROP INDEX vault_chunks_embedding_idx;
CREATE INDEX vault_chunks_embedding_idx
  ON vault_chunks
  USING hnsw (embedding vector_cosine_ops);
```

### 2c. Enable Row Level Security

Neither table has RLS policies. All access currently goes through the service role key, but enabling RLS with a deny-all policy for non-service-role access provides defense-in-depth against accidental exposure via the anon key.

### 2d. Use timing-safe token comparison

Replace the `===` comparison in `supabase/functions/search-vault/lib/auth.mjs` with a constant-time comparison to prevent timing attacks on the bearer token.

## Priority 3 — Test Coverage

### 3a. `content.mjs` tests

The indexer's content parsing module handles Markdown heading extraction, JSON flattening, and canvas node parsing — all untested. These are the most complex untested code paths.

### 3b. `discovery.mjs` tests

File walking, glob matching, excluded directory filtering, and JSON allowlist enforcement.

### 3c. `index.ts` integration test

Mock OpenAI and Supabase, verify the full Edge Function request→response flow including auth, validation, embedding, RPC, and post-processing.

### 3d. `supabase.mjs` tests

Mock the Supabase client and verify replace/delete/prune behavior, especially the non-atomic delete+insert sequence.

## Priority 4 — Expand MCP Tools

### 4a. Add `search_vault` (general-purpose tool) — DONE

Deployed in the `vault-mcp` Edge Function. Exposes `repo_path_prefix` and `source_type` as optional parameters.

### 4b. Add `search_cooking` tool — DONE

Deployed in the `vault-mcp` Edge Function, hard-scoped to `Cooking/`.

### 4c. Expose tuning parameters

Surface `max_per_source` and `min_similarity` as optional MCP tool parameters so agents can tune retrieval behavior per-query.

## Priority 5 — MCP Deployment — DONE

The MCP server is now deployed as both a local stdio process and a remote Streamable HTTP service on Supabase Edge Functions.

### Current state

- Local transport: `StdioServerTransport` — `tools/vault-mcp/src/index.mjs`
- Remote transport: `WebStandardStreamableHTTPServerTransport` — `supabase/functions/vault-mcp/index.ts`
- Remote endpoint: `https://zjghdtmnhjgzhgnwnjre.supabase.co/functions/v1/vault-mcp`
- Tools (remote): `search_basilisk`, `search_vault`, `search_cooking`
- Dependency: `@modelcontextprotocol/sdk ^1.25.3` (Edge Function), `^1.27.1` (local)
- Auth: inherits from the `search-vault` Edge Function bearer token

### 5a. Add Streamable HTTP transport — DONE

Implemented in `supabase/functions/vault-mcp/index.ts` using `WebStandardStreamableHTTPServerTransport` with Hono routing. The local stdio server at `tools/vault-mcp/` remains intact for local use.

### 5b. Hosting platform — DONE

Deployed to Supabase Edge Functions alongside `search-vault`. Shares secrets (`SEARCH_VAULT_URL`, `INTERNAL_SEARCH_TOKEN`) across both functions.

### 5c. Supabase Edge Function implementation — DONE

The `vault-mcp` Edge Function lives at `supabase/functions/vault-mcp/index.ts` and is configured in `supabase/config.toml` with `verify_jwt = false`.

Deploy with:
```bash
supabase functions deploy --no-verify-jwt vault-mcp
```

The MCP server is live at:
```
https://zjghdtmnhjgzhgnwnjre.supabase.co/functions/v1/vault-mcp
```

### 5d. Vercel alternative

Not pursued — Supabase Edge Functions met all requirements. Vercel remains a viable option if OAuth or longer execution times are needed later.

### 5e. Authentication for remote access

For v1 (personal use), the `SEARCH_VAULT_TOKEN` bearer check inherited from the Edge Function is sufficient. For multi-user or public access:

- On Vercel: use `mcp-handler`'s built-in `withMcpAuth` wrapper for OAuth 2.1
- On Supabase: auth support for MCP on Edge Functions is coming soon; in the meantime, bearer token auth works
- On Cloudflare: use `workers-oauth-provider`
- The MCP spec supports standard HTTP authentication mechanisms on the Streamable HTTP transport

### 5f. Client configuration for remote MCP

Once deployed, agents connect with just the URL:

```json
{
  "mcpServers": {
    "vault-mcp": {
      "url": "https://zjghdtmnhjgzhgnwnjre.supabase.co/functions/v1/vault-mcp"
    }
  }
}
```

Or if deployed to Vercel:

```json
{
  "mcpServers": {
    "vault-mcp": {
      "url": "https://your-app.vercel.app/api/mcp"
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

## Priority 6 — RAG Answer Layer

Not recommended until Priorities 1–4 are addressed.

### 6a. Context pack builder

Assemble retrieved chunks into a citation-preserving prompt context suitable for LLM consumption.

### 6b. Citation-first answer tool

An MCP tool that retrieves, assembles context, and produces an answer with mandatory source citations (repo paths and heading paths).

### 6c. Answer quality guardrails

Require evidence for all claims, flag low-confidence answers, and refuse to answer when retrieval returns insufficient evidence.

## Priority 7 — Infrastructure Improvements

### 7a. Consolidate retry layers

The indexer has both OpenAI SDK retries (`maxRetries: 2`) and manual `withRetry` (4 attempts) in `embeddings.mjs`. This means a single failed batch could attempt up to 12 API calls. Pick one retry strategy.

### 7b. Align OpenAI timeout in Edge Function

The 120-second timeout in `openai.mjs` may exceed the Edge Function's execution ceiling (60s free tier, 150s Pro). Reduce to fit within platform limits.

### 7c. Consider `text-embedding-3-large`

If retrieval quality remains too low after heading context injection, upgrading to `text-embedding-3-large` (3072 dimensions) would improve semantic discrimination at ~6x the embedding cost. Requires a schema migration and full reindex.

### 7d. Per-record JSON sectioning

Modify `content.mjs` to produce one section per top-level JSON object/array entry instead of one flat section for the whole file. This would improve retrieval precision for large files like `GROCERY_DATA_2026_UPDATED.json`.

### 7e. Move MCP server to separate repo

The Stack Spec recommends this for cleaner deployment and versioning. Only do this if deployment or versioning complexity justifies it — the current in-repo placement is fine for iteration.

## Deployed vs. Not Deployed

| Component | Status |
|---|---|
| Supabase schema + `match_vault_chunks` RPC | Deployed |
| GitHub Actions indexer workflow | Deployed |
| `search-vault` Edge Function | Deployed |
| `vault-mcp` MCP server (local stdio) | Deployed |
| `vault-mcp` Edge Function (remote Streamable HTTP) | Deployed |
| `search_vault` (general) MCP tool | Deployed (remote) |
| `search_cooking` MCP tool | Deployed (remote) |
| Retrieval evaluation harness | Not built |
| RAG answer assembly layer | Not implemented |
| Citation-first answer tool | Not implemented |
