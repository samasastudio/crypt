// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { McpServer } from "npm:@modelcontextprotocol/sdk@^1.25.3/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "npm:@modelcontextprotocol/sdk@^1.25.3/server/webStandardStreamableHttp.js";
import { Hono } from "npm:hono@^4.9.7";
import { z } from "npm:zod@^4.1.13";

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------

const SEARCH_VAULT_URL = Deno.env.get("SEARCH_VAULT_URL") || "";
const SEARCH_VAULT_TOKEN = Deno.env.get("INTERNAL_SEARCH_TOKEN") || "";

// ---------------------------------------------------------------------------
// search-vault HTTP client
// ---------------------------------------------------------------------------

const SEARCH_VAULT_TIMEOUT_MS = 10_000;

interface SearchVaultRequest {
  query: string;
  repo_path_prefix?: string;
  source_type?: string;
  match_count: number;
  min_similarity: number;
  max_per_source: number;
  include_content: boolean;
}

interface SearchResult {
  repo_path: string;
  title: string | null;
  heading_path: string[];
  similarity: number;
  source_type: string;
  metadata: Record<string, unknown>;
  content?: string;
}

interface SearchVaultResponse {
  query: string;
  results: SearchResult[];
  meta: Record<string, unknown>;
}

async function callSearchVault(
  body: SearchVaultRequest
): Promise<SearchVaultResponse> {
  if (!SEARCH_VAULT_URL) {
    throw new Error("Server misconfiguration: SEARCH_VAULT_URL is missing.");
  }

  if (!SEARCH_VAULT_TOKEN) {
    throw new Error(
      "Server misconfiguration: INTERNAL_SEARCH_TOKEN is missing."
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    SEARCH_VAULT_TIMEOUT_MS
  );

  let response: Response;

  try {
    response = await fetch(SEARCH_VAULT_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${SEARCH_VAULT_TOKEN}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(
        `Vault retrieval service timed out after ${SEARCH_VAULT_TIMEOUT_MS}ms.`
      );
    }

    throw new Error("Vault retrieval service is unreachable.");
  } finally {
    clearTimeout(timeoutId);
  }

  const text = await response.text();

  if (text.trim().length === 0) {
    throw new Error("Vault retrieval service returned an empty response.");
  }

  let payload: unknown;

  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error("Vault retrieval service returned malformed JSON.");
  }

  if (!response.ok) {
    const errorMessage =
      payload &&
      typeof payload === "object" &&
      !Array.isArray(payload) &&
      typeof (payload as Record<string, unknown>).error === "string"
        ? (payload as Record<string, string>).error
        : `Vault retrieval service returned HTTP ${response.status}.`;

    throw new Error(errorMessage);
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error(
      "Vault retrieval service returned an invalid JSON payload."
    );
  }

  const p = payload as Record<string, unknown>;

  return {
    query: typeof p.query === "string" ? p.query : body.query,
    results: Array.isArray(p.results) ? (p.results as SearchResult[]) : [],
    meta:
      p.meta && typeof p.meta === "object" && !Array.isArray(p.meta)
        ? (p.meta as Record<string, unknown>)
        : {},
  };
}

// ---------------------------------------------------------------------------
// Formatting helpers (ported from tools/vault-mcp/src/search-basilisk.mjs)
// ---------------------------------------------------------------------------

function formatResultsText(
  result: SearchVaultResponse,
  scope: string | null
): string {
  const results = result.results;

  if (results.length === 0) {
    const scopeLabel = scope ? ` within ${scope}` : "";
    return `No matches found for "${result.query}"${scopeLabel}.`;
  }

  const scopeLabel = scope ? ` within ${scope}` : "";
  const lines: string[] = [
    `Found ${results.length} match${results.length === 1 ? "" : "es"} for "${result.query}"${scopeLabel}.`,
  ];

  for (const [index, row] of results.entries()) {
    const heading =
      Array.isArray(row.heading_path) && row.heading_path.length > 0
        ? ` > ${row.heading_path.join(" > ")}`
        : "";
    const title =
      typeof row.title === "string" && row.title.length > 0
        ? ` (${row.title})`
        : "";
    const similarity =
      typeof row.similarity === "number" ? row.similarity.toFixed(2) : "n/a";

    lines.push(
      `${index + 1}. [${similarity}] ${row.repo_path}${title}${heading}`
    );
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Input helpers
// ---------------------------------------------------------------------------

function clampInt(
  value: unknown,
  min: number,
  max: number,
  fallback: number
): number {
  if (value === undefined || value === null) {
    return fallback;
  }

  const n = typeof value === "number" ? value : Number(value);

  if (!Number.isInteger(n)) {
    return fallback;
  }

  return Math.max(min, Math.min(max, n));
}

function toBool(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  return fallback;
}

// ---------------------------------------------------------------------------
// Scoped search handler factory
// ---------------------------------------------------------------------------

function buildScopedSearchRequest(
  input: {
    query: string;
    match_count?: number;
    include_content?: boolean;
  },
  scope: string,
  maxMatchCount: number
): SearchVaultRequest {
  return {
    query: input.query.trim(),
    repo_path_prefix: scope,
    match_count: clampInt(input.match_count, 1, maxMatchCount, maxMatchCount),
    min_similarity: 0.3,
    max_per_source: 2,
    include_content: toBool(input.include_content, true),
  };
}

// ---------------------------------------------------------------------------
// MCP server
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: "vault-mcp",
  version: "1.0.0",
});

// -- search_basilisk --------------------------------------------------------

const BASILISK_SCOPE = "Projects/Basilisk SH";

server.registerTool(
  "search_basilisk",
  {
    title: "Search Basilisk",
    description:
      "Semantic search scoped to the Basilisk SH notes in the crypt vault.",
    inputSchema: {
      query: z
        .string()
        .describe("Plain-language query for Basilisk documentation."),
      match_count: z
        .number()
        .int()
        .optional()
        .describe("Maximum number of matches to return, clamped to 1-8."),
      include_content: z
        .boolean()
        .optional()
        .describe(
          "Whether to include chunk content in the returned results."
        ),
    },
    annotations: {
      readOnlyHint: true,
    },
  },
  async (input) => {
    try {
      const body = buildScopedSearchRequest(input, BASILISK_SCOPE, 8);
      const result = await callSearchVault(body);

      return {
        content: [
          {
            type: "text" as const,
            text: formatResultsText(result, BASILISK_SCOPE),
          },
        ],
        structuredContent: {
          query: result.query,
          scope: BASILISK_SCOPE,
          results: result.results,
          meta: result.meta,
        },
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unexpected vault retrieval error.";

      return {
        isError: true,
        content: [{ type: "text" as const, text: message }],
      };
    }
  }
);

// -- search_vault -----------------------------------------------------------

server.registerTool(
  "search_vault",
  {
    title: "Search Vault",
    description:
      "General-purpose semantic search across the entire crypt vault. Optionally filter by path prefix or source type.",
    inputSchema: {
      query: z.string().describe("Plain-language search query."),
      repo_path_prefix: z
        .string()
        .optional()
        .describe(
          "Limit results to paths starting with this prefix (e.g. 'Projects/Basilisk SH')."
        ),
      source_type: z
        .string()
        .optional()
        .describe(
          "Limit results to a specific source type (e.g. 'markdown', 'json', 'canvas')."
        ),
      match_count: z
        .number()
        .int()
        .optional()
        .describe("Maximum number of matches to return, clamped to 1-20."),
      include_content: z
        .boolean()
        .optional()
        .describe(
          "Whether to include chunk content in the returned results."
        ),
    },
    annotations: {
      readOnlyHint: true,
    },
  },
  async (input) => {
    try {
      const body: SearchVaultRequest = {
        query: input.query.trim(),
        ...(input.repo_path_prefix
          ? { repo_path_prefix: input.repo_path_prefix.trim() }
          : {}),
        ...(input.source_type
          ? { source_type: input.source_type.trim() }
          : {}),
        match_count: clampInt(input.match_count, 1, 20, 20),
        min_similarity: 0.3,
        max_per_source: 2,
        include_content: toBool(input.include_content, true),
      };

      const result = await callSearchVault(body);

      return {
        content: [
          {
            type: "text" as const,
            text: formatResultsText(result, input.repo_path_prefix ?? null),
          },
        ],
        structuredContent: {
          query: result.query,
          scope: input.repo_path_prefix ?? null,
          results: result.results,
          meta: result.meta,
        },
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unexpected vault retrieval error.";

      return {
        isError: true,
        content: [{ type: "text" as const, text: message }],
      };
    }
  }
);

// -- search_cooking ---------------------------------------------------------

const COOKING_SCOPE = "Cooking";

server.registerTool(
  "search_cooking",
  {
    title: "Search Cooking",
    description:
      "Semantic search scoped to the Cooking section of the crypt vault — recipes, grocery data, meal plans, and more.",
    inputSchema: {
      query: z
        .string()
        .describe("Plain-language query for cooking and grocery content."),
      match_count: z
        .number()
        .int()
        .optional()
        .describe("Maximum number of matches to return, clamped to 1-8."),
      include_content: z
        .boolean()
        .optional()
        .describe(
          "Whether to include chunk content in the returned results."
        ),
    },
    annotations: {
      readOnlyHint: true,
    },
  },
  async (input) => {
    try {
      const body = buildScopedSearchRequest(input, COOKING_SCOPE, 8);
      const result = await callSearchVault(body);

      return {
        content: [
          {
            type: "text" as const,
            text: formatResultsText(result, COOKING_SCOPE),
          },
        ],
        structuredContent: {
          query: result.query,
          scope: COOKING_SCOPE,
          results: result.results,
          meta: result.meta,
        },
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unexpected vault retrieval error.";

      return {
        isError: true,
        content: [{ type: "text" as const, text: message }],
      };
    }
  }
);

// ---------------------------------------------------------------------------
// Hono app — routes all requests to the MCP transport
// ---------------------------------------------------------------------------

const app = new Hono().basePath("/vault-mcp");

app.all("*", async (c) => {
  const transport = new WebStandardStreamableHTTPServerTransport();
  await server.connect(transport);
  return transport.handleRequest(c.req.raw);
});

Deno.serve(app.fetch);
