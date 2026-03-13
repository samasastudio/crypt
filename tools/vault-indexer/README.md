# Vault Indexer

This tool scans the Obsidian-style vault in this repo, chunks indexable content, generates embeddings with OpenAI, and persists the results into Supabase.

## What it indexes

- Markdown notes: `*.md`
- Approved JSON knowledge sources:
  - `cookbook_recipes.json`
  - `GROCERY_DATA_2026_UPDATED.json`
- Obsidian canvas files: `*.canvas`

Excluded by default:

- `.git/`
- `.github/`
- `.obsidian/`
- `supabase/`
- `tools/`
- `node_modules/`

## Environment

Create `tools/vault-indexer/.env` with:

```bash
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENAI_API_KEY=...
OPENAI_EMBED_MODEL=text-embedding-3-small
OPENAI_EMBED_DIMENSIONS=1536
```

Optional:

```bash
INDEX_INCLUDE_GLOBS=Projects/**,Cooking/**
INDEX_EXCLUDE_GLOBS=Cooking/Tools/**
OPENAI_EMBED_BATCH_SIZE=32
```

## Commands

Install dependencies:

```bash
npm install
```

Dry-run a full vault scan:

```bash
npm run index:vault -- --full --dry-run
```

Re-index the entire vault:

```bash
npm run index:vault -- --full
```

Re-index only changed files:

```bash
npm run index:vault -- --changed "Projects/Basilisk SH/docs/README.md"
```

Delete removed files from the Supabase index:

```bash
npm run index:vault -- --deleted "Projects/Basilisk SH/docs/old.md"
```

## Supabase setup

1. Create a Supabase project.
2. Run the SQL migration in [supabase/migrations/20260311110000_create_vault_index.sql](/C:/Users/Owner/projects/crypt/supabase/migrations/20260311110000_create_vault_index.sql).
3. Store `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as GitHub Actions secrets.
4. Store `OPENAI_API_KEY` as a GitHub Actions secret.

## GitHub Actions

The workflow at [.github/workflows/index-vault.yml](/C:/Users/Owner/projects/crypt/.github/workflows/index-vault.yml) runs on pushes to `main` and can also be launched manually for a full rebuild.
