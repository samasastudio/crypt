# Vault MCP

`vault-mcp` is a thin local MCP server for semantic retrieval from the `crypt` vault. In v1 it exposes one tool, `search_basilisk`, which is hard-scoped to `Projects/Basilisk SH` and forwards retrieval requests to the existing `search-vault` Supabase Edge Function.

## What It Does

- runs as a local stdio MCP server
- calls `search-vault` over HTTP
- keeps retrieval logic centralized in the Edge Function
- returns structured Basilisk search results with paths, headings, similarity scores, metadata, and optional chunk content

## Required Environment Variables

Set these before starting the server:

```bash
SEARCH_VAULT_URL=...
SEARCH_VAULT_TOKEN=...
```

- `SEARCH_VAULT_URL`: full `search-vault` function URL
- `SEARCH_VAULT_TOKEN`: bearer token expected by `search-vault`

See [search-vault README](/C:/Users/Owner/projects/crypt/supabase/functions/search-vault/README.md) for the retrieval API setup and local serving instructions.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the MCP server:

```bash
npm start
```

Run tests:

```bash
npm test
```

## Example Client Configuration

Example local MCP client entry:

```json
{
  "mcpServers": {
    "vault-mcp": {
      "command": "node",
      "args": [
        "C:/Users/Owner/projects/crypt/tools/vault-mcp/src/index.mjs"
      ],
      "env": {
        "SEARCH_VAULT_URL": "https://<project-ref>.supabase.co/functions/v1/search-vault",
        "SEARCH_VAULT_TOKEN": "<internal-search-token>"
      }
    }
  }
}
```

## V1 Scope

Current tool:

- `search_basilisk`: semantic retrieval limited to `Projects/Basilisk SH`

Deferred until retrieval quality is validated:

- whole-vault search
- `search_cooking`
- answer synthesis or full RAG response generation
