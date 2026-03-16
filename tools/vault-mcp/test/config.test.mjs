import test from "node:test";
import assert from "node:assert/strict";

import { loadConfig } from "../src/config.mjs";

test("loadConfig rejects missing environment variables", () => {
  assert.throws(
    () => loadConfig({}),
    /SEARCH_VAULT_URL, SEARCH_VAULT_TOKEN/i
  );
});

test("loadConfig rejects invalid URLs", () => {
  assert.throws(
    () => loadConfig({
      SEARCH_VAULT_URL: "not-a-url",
      SEARCH_VAULT_TOKEN: "token"
    }),
    /valid absolute url/i
  );
});

test("loadConfig returns normalized configuration", () => {
  assert.deepEqual(
    loadConfig({
      SEARCH_VAULT_URL: " https://example.com/functions/v1/search-vault ",
      SEARCH_VAULT_TOKEN: " secret-token "
    }),
    {
      searchVaultUrl: "https://example.com/functions/v1/search-vault",
      searchVaultToken: "secret-token"
    }
  );
});
