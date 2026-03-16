---
title: "Semantic Search and Agent RAG"
type: plan
tags:
  - infra/search
  - infra/agents
  - project/plan
---

# Semantic Search and Agent RAG

This note describes how to move from "the vault is embedded in Supabase" to "agents can reliably retrieve and use vault knowledge in answers, planning loops, and workflows."

For the full architecture split across the `crypt` repo, a Supabase Edge Function, and a future MCP server, see [Semantic Search Stack Spec](Semantic%20Search%20Stack%20Spec.md).

## Current State

The current stack already gives us the retrieval substrate:

- Vault content is chunked and embedded through `tools/vault-indexer/`
- Embeddings are stored in Supabase in `public.vault_chunks`
- File-level state is tracked in `public.vault_sources`
- Similarity search is available through `public.match_vault_chunks(...)`
- A shared retrieval API now exists at `supabase/functions/search-vault/`
- An initial MCP wrapper now exists at `tools/vault-mcp/` with `search_basilisk`
- GitHub Actions keeps the index fresh on pushes to `main`
- Request parsing and retrieval post-processing already have unit test coverage

This means the next work is not "build vector storage" or "build the first retrieval API." It is "connect consumers to the shared retrieval layer, evaluate search quality, and then add citation-first answer assembly."

## Recommended Architecture

```mermaid
flowchart LR
    A["Agent or app"] --> B["Retrieval service"]
    B --> C["Embed user query"]
    C --> D["Supabase match_vault_chunks"]
    D --> E["Top-k chunks with paths and metadata"]
    E --> F["Context pack builder"]
    F --> G["Answer model or agent planner"]
    G --> H["Response with citations"]
```

### Core idea

Do not let each agent invent its own retrieval flow. Put one shared retrieval service in front of Supabase so all agents use the same:

- embedding model
- query filters
- chunk limits
- deduping
- citation formatting
- failure handling

## Phase 1: Shared Retrieval Runtime

Status: baseline complete in `supabase/functions/search-vault/`

The current retrieval layer already:

- accepts `query` plus optional path, source, and ranking controls
- generates an embedding for the query
- calls `match_vault_chunks(...)`
- filters weak matches and caps repeated chunks from the same source
- returns paths, headings, metadata, and optional content

This phase is now about operationalizing that runtime:

- deploy or locally serve the Edge Function consistently
- verify auth, secrets, and caller expectations
- validate response quality on real vault questions

Recommended first interface:

```json
{
  "query": "How does Basilisk map ritual state to AV output?",
  "repo_path_prefix": "Projects/Basilisk SH",
  "match_count": 8
}
```

Recommended first response shape:

```json
{
  "query": "How does Basilisk map ritual state to AV output?",
  "results": [
    {
      "repo_path": "Projects/Basilisk SH/docs/systems/ritual-state-and-score.md",
      "title": "Ritual state and score",
      "heading_path": ["State mapping"],
      "content": "...",
      "similarity": 0.89
    }
  ]
}
```

## Phase 2: Agent Integration

Expose retrieval as a tool that agents can call intentionally rather than stuffing the whole vault into every prompt.

Recommended agent patterns:

### 1. Search-first answer agent

Use for Q&A against the vault.

Flow:

1. user asks a question
2. agent calls retrieval tool
3. agent answers only from retrieved chunks
4. agent cites source paths

### 2. Scoped project agent

Use for a domain-specific assistant such as:

- `Basilisk agent`
- `Cooking agent`
- `Operations/documentation agent`

Each one uses a default path filter:

- `Projects/Basilisk SH/`
- `Cooking/`
- whole vault

### 3. Planning agent with retrieval

Use when an agent needs to synthesize across multiple notes before proposing implementation steps or design decisions.

Flow:

1. retrieve top results
2. group by source
3. summarize tensions or overlaps
4. produce plan with citations

## Phase 3: Full RAG

Once retrieval is stable, add a proper answer assembly layer.

Recommended steps:

1. Retrieve top-k chunks
2. Deduplicate by source and heading
3. Trim to a context budget
4. Build a citation-preserving context pack
5. Ask the answer model to answer only from supplied context
6. Return answer plus source list

Minimum answer policy:

- no uncited claims when using retrieved context
- mention uncertainty when retrieved evidence is weak
- prefer short quoted snippets plus paraphrase

## Retrieval Rules That Matter

These details make the difference between a toy search and a useful agent primitive.

### Path scoping

Always allow a repo path prefix filter.

Examples:

- `Projects/Basilisk SH`
- `Cooking`

This prevents cooking notes from polluting design answers and vice versa.

### Top-k control

Start with `5-8` chunks per query. More than that often adds noise faster than value.

### Deduping

Prefer:

- one or two chunks per heading
- multiple documents over many adjacent chunks from the same source

### Metadata filtering

Keep supporting:

- `source_type`
- path prefix
- future note tags if needed

### Citation formatting

Return human-readable source references every time:

- repo path
- title
- heading when available

## Practical Build Sequence From Here

### Build 1: Retrieval validation harness

Create a local script or repeatable curl flow that:

- accepts a plain-language question
- calls `search-vault`
- prints the top matches with paths and scores

This is the fastest way to validate retrieval quality against real questions from Basilisk and Cooking.

### Build 2: Thin consumer or wrapper

Expose the shared retrieval API to one real consumer:

- a local query script
- an app-side server helper
- or an MCP tool such as `search_basilisk`

The goal here is not a second retrieval backend. It is a small, opinionated wrapper around `search-vault`.

### Build 3: Retrieval evaluation set

Run `10-20` representative questions and inspect:

- whether the top results are from the right domain
- whether path scoping improves precision
- whether `min_similarity` and `max_per_source` need tuning
- which questions need better chunking or metadata

### Build 4: RAG response layer

Add:

- context pack construction
- citation formatting
- answer prompts that require evidence-backed output

## Recommended Near-Term Order

1. Add a local semantic query script for manual testing
2. Evaluate `search_basilisk` on `10-20` representative questions
3. Tune retrieval policy only after seeing real misses
4. Add either `search_vault` or `search_cooking` only after Basilisk retrieval is solid
5. Add a RAG answer layer after retrieval quality is acceptable

## Example Questions To Evaluate

- What does Basilisk mean by orchestration intelligence?
- Which docs define ritual state and score?
- How are grocery product notes related to order history?
- Which files describe Basilisk export and integration behavior?
- What are the core workflows in the cooking system?

## Decision Guidelines

Use semantic search alone when:

- the user mainly needs source discovery
- the UI can show ranked notes directly

Use RAG when:

- the user wants a synthesized answer
- the agent must combine multiple notes
- citations and evidence matter

Use scoped agents when:

- one domain has very different vocabulary and expectations than another
- you want more reliable retrieval and lower token usage

## Next Move

The best next implementation step is to evaluate `tools/vault-mcp/` on a representative Basilisk question set and tune retrieval quality before adding broader MCP tools or a citation-first answer layer.
