# `search-vault` Edge Function

`search-vault` is the first production retrieval API for the vault. It is retrieval-only: it embeds a query, calls `public.match_vault_chunks(...)`, filters and dedupes the results, and returns ranked chunks with citations and metadata.

Current status:

- deployed to the production Supabase project
- manually validated end-to-end against the indexed vault
- current live evaluation suggests the default similarity threshold should be lowered from `0.65`

## Required Secrets

Set these in Supabase Edge Functions secrets before deploying:

```bash
supabase secrets set OPENAI_API_KEY=...
supabase secrets set OPENAI_EMBED_MODEL=text-embedding-3-small
supabase secrets set OPENAI_EMBED_DIMENSIONS=1536
supabase secrets set INTERNAL_SEARCH_TOKEN=...
supabase secrets set SUPABASE_URL=...
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...
```

## Local Serve

Serve the function locally with the Supabase CLI:

```bash
supabase functions serve search-vault --env-file supabase/functions/search-vault/.env.local
```

Example local env file:

```bash
OPENAI_API_KEY=...
OPENAI_EMBED_MODEL=text-embedding-3-small
OPENAI_EMBED_DIMENSIONS=1536
INTERNAL_SEARCH_TOKEN=replace-me
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Deploy

```bash
supabase functions deploy search-vault
```

## Example Request

```bash
curl -i \
  -X POST "https://<project-ref>.supabase.co/functions/v1/search-vault" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <internal-search-token>" \
  -d '{
    "query": "How does Basilisk map ritual state to AV output?",
    "repo_path_prefix": "Projects/Basilisk SH",
    "source_type": "markdown",
    "match_count": 8,
    "min_similarity": 0.3,
    "max_per_source": 2,
    "include_content": true
  }'
```

## Response Shape

```json
{
  "query": "How does Basilisk map ritual state to AV output?",
  "results": [
    {
      "repo_path": "Projects/Basilisk SH/docs/systems/ritual-state-and-score.md",
      "title": "Ritual state and score",
      "heading_path": ["State mapping"],
      "content": "...",
      "similarity": 0.89,
      "source_type": "markdown",
      "metadata": {}
    }
  ],
  "meta": {
    "returned": 1,
    "match_count": 8,
    "repo_path_prefix": "Projects/Basilisk SH",
    "source_type": "markdown",
    "min_similarity": 0.3,
    "max_per_source": 2,
    "model": "text-embedding-3-small"
  }
}
```

## Status Rules

- `405` for non-`POST`
- `401` for missing/invalid bearer token
- `400` for malformed JSON or invalid request input
- `502` for upstream OpenAI or Supabase failures
- `200` with empty `results` when no rows survive filtering

## Evaluation Notes

- if you are seeing empty `results` with a healthy index, inspect the returned `meta.min_similarity`
- current Basilisk validation returned useful matches below `0.65`, so a lower threshold is recommended for production retrieval quality
