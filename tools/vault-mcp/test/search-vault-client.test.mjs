import test from "node:test";
import assert from "node:assert/strict";

import {
  createSearchVaultClient,
  SearchVaultClientError
} from "../src/search-vault-client.mjs";

test("createSearchVaultClient sends POST requests with auth and JSON body", async () => {
  let seenUrl;
  let seenOptions;

  const client = createSearchVaultClient({
    searchVaultUrl: "https://example.com/functions/v1/search-vault",
    searchVaultToken: "secret-token",
    fetchImpl: async (url, options) => {
      seenUrl = url;
      seenOptions = options;

      return new Response(
        JSON.stringify({
          query: "ritual state",
          results: [],
          meta: {
            returned: 0
          }
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json"
          }
        }
      );
    }
  });

  const response = await client.search({
    query: "ritual state",
    repo_path_prefix: "Projects/Basilisk SH",
    match_count: 8,
    include_content: true
  });

  assert.equal(seenUrl, "https://example.com/functions/v1/search-vault");
  assert.equal(seenOptions.method, "POST");
  assert.equal(seenOptions.headers.authorization, "Bearer secret-token");
  assert.equal(seenOptions.headers["content-type"], "application/json");
  assert.ok(seenOptions.signal instanceof AbortSignal);
  assert.deepEqual(JSON.parse(seenOptions.body), {
    query: "ritual state",
    repo_path_prefix: "Projects/Basilisk SH",
    match_count: 8,
    include_content: true
  });
  assert.deepEqual(response.meta, {
    returned: 0
  });
});

test("createSearchVaultClient maps 401 responses to auth errors", async () => {
  const client = createSearchVaultClient({
    searchVaultUrl: "https://example.com/functions/v1/search-vault",
    searchVaultToken: "secret-token",
    fetchImpl: async () => new Response(
      JSON.stringify({
        error: "Unauthorized"
      }),
      {
        status: 401
      }
    )
  });

  await assert.rejects(
    () => client.search({
      query: "ritual state"
    }),
    (error) => {
      assert.ok(error instanceof SearchVaultClientError);
      assert.equal(error.kind, "auth");
      assert.equal(error.status, 401);
      return true;
    }
  );
});

test("createSearchVaultClient maps 400 responses to caller errors", async () => {
  const client = createSearchVaultClient({
    searchVaultUrl: "https://example.com/functions/v1/search-vault",
    searchVaultToken: "secret-token",
    fetchImpl: async () => new Response(
      JSON.stringify({
        error: "Invalid request"
      }),
      {
        status: 400
      }
    )
  });

  await assert.rejects(
    () => client.search({
      query: ""
    }),
    (error) => {
      assert.ok(error instanceof SearchVaultClientError);
      assert.equal(error.kind, "caller");
      assert.equal(error.status, 400);
      return true;
    }
  );
});

test("createSearchVaultClient maps upstream and network failures to service errors", async () => {
  const upstreamClient = createSearchVaultClient({
    searchVaultUrl: "https://example.com/functions/v1/search-vault",
    searchVaultToken: "secret-token",
    fetchImpl: async () => new Response(
      JSON.stringify({
        error: "Upstream retrieval failure."
      }),
      {
        status: 502
      }
    )
  });

  await assert.rejects(
    () => upstreamClient.search({
      query: "ritual state"
    }),
    (error) => {
      assert.ok(error instanceof SearchVaultClientError);
      assert.equal(error.kind, "service");
      assert.equal(error.status, 502);
      return true;
    }
  );

  const networkClient = createSearchVaultClient({
    searchVaultUrl: "https://example.com/functions/v1/search-vault",
    searchVaultToken: "secret-token",
    fetchImpl: async () => {
      throw new Error("network down");
    }
  });

  await assert.rejects(
    () => networkClient.search({
      query: "ritual state"
    }),
    (error) => {
      assert.ok(error instanceof SearchVaultClientError);
      assert.equal(error.kind, "service");
      assert.equal(error.status, null);
      return true;
    }
  );
});

test("createSearchVaultClient aborts requests that exceed the timeout", async () => {
  const client = createSearchVaultClient({
    searchVaultUrl: "https://example.com/functions/v1/search-vault",
    searchVaultToken: "secret-token",
    searchVaultTimeoutMs: 10,
    fetchImpl: async (url, options) => new Promise((resolve, reject) => {
      options.signal.addEventListener("abort", () => {
        reject(new Error("aborted"));
      });
    })
  });

  await assert.rejects(
    () => client.search({
      query: "ritual state"
    }),
    (error) => {
      assert.ok(error instanceof SearchVaultClientError);
      assert.equal(error.kind, "service");
      assert.equal(error.message, "Vault retrieval service timed out after 10ms.");
      return true;
    }
  );
});
