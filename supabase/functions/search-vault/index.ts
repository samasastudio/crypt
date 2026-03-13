import { createClient } from "npm:@supabase/supabase-js@2";

import {
  authenticateBearer,
  getAuthErrorMessage
} from "./lib/auth.mjs";
import {
  jsonResponse,
  textResponse
} from "./lib/http.mjs";
import {
  createQueryEmbedding
} from "./lib/openai.mjs";
import {
  postProcessResults
} from "./lib/results.mjs";
import {
  parseSearchRequest
} from "./lib/request.mjs";

type MatchVaultChunkRow = {
  id: string;
  repo_path: string;
  source_type: string;
  title: string | null;
  heading_path: string[] | null;
  content: string;
  metadata: Record<string, unknown> | null;
  similarity: number;
};

const OPENAI_EMBED_MODEL = Deno.env.get("OPENAI_EMBED_MODEL") || "text-embedding-3-small";
const OPENAI_EMBED_DIMENSIONS = Number(Deno.env.get("OPENAI_EMBED_DIMENSIONS") || "1536");
const INTERNAL_SEARCH_TOKEN = Deno.env.get("INTERNAL_SEARCH_TOKEN") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "";

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return textResponse("Method Not Allowed", 405);
  }

  if (!INTERNAL_SEARCH_TOKEN) {
    return jsonResponse(
      {
        error: "Server misconfiguration: INTERNAL_SEARCH_TOKEN is missing."
      },
      502
    );
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OPENAI_API_KEY) {
    return jsonResponse(
      {
        error: "Server misconfiguration: required upstream credentials are missing."
      },
      502
    );
  }

  const isAuthenticated = authenticateBearer(
    request.headers.get("authorization"),
    INTERNAL_SEARCH_TOKEN
  );
  if (!isAuthenticated) {
    return jsonResponse(
      {
        error: getAuthErrorMessage()
      },
      401
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(
      {
        error: "Malformed JSON request body."
      },
      400
    );
  }

  let searchRequest;
  try {
    searchRequest = parseSearchRequest(body);
  } catch (error) {
    return jsonResponse(
      {
        error: error instanceof Error ? error.message : "Invalid search request."
      },
      400
    );
  }

  try {
    const embedding = await createQueryEmbedding({
      apiKey: OPENAI_API_KEY,
      model: OPENAI_EMBED_MODEL,
      dimensions: OPENAI_EMBED_DIMENSIONS,
      query: searchRequest.query
    });

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });

    const { data, error } = await supabase.rpc("match_vault_chunks", {
      query_embedding: embedding,
      match_count: searchRequest.match_count,
      filter: buildMatchFilter(searchRequest)
    });

    if (error) {
      throw new Error(`Supabase RPC failed: ${error.message}`);
    }

    const results = postProcessResults((data ?? []) as MatchVaultChunkRow[], searchRequest);

    return jsonResponse(
      {
        query: searchRequest.query,
        results,
        meta: {
          returned: results.length,
          match_count: searchRequest.match_count,
          repo_path_prefix: searchRequest.repo_path_prefix ?? null,
          source_type: searchRequest.source_type ?? null,
          min_similarity: searchRequest.min_similarity,
          max_per_source: searchRequest.max_per_source,
          model: OPENAI_EMBED_MODEL
        }
      },
      200
    );
  } catch (error) {
    return jsonResponse(
      {
        error: error instanceof Error ? error.message : "Upstream retrieval failure."
      },
      502
    );
  }
});

function buildMatchFilter(searchRequest: {
  repo_path_prefix: string | null;
  source_type: string | null;
}) {
  const filter: Record<string, string> = {};

  if (searchRequest.repo_path_prefix) {
    filter.repo_path_prefix = searchRequest.repo_path_prefix;
  }

  if (searchRequest.source_type) {
    filter.source_type = searchRequest.source_type;
  }

  return filter;
}
