import test from "node:test";
import assert from "node:assert/strict";

import { parseSearchRequest } from "../lib/request.mjs";

test("parseSearchRequest applies defaults", () => {
  const parsed = parseSearchRequest({
    query: "  Basilisk orchestration  "
  });

  assert.deepEqual(parsed, {
    query: "Basilisk orchestration",
    repo_path_prefix: null,
    source_type: null,
    match_count: 8,
    min_similarity: 0.65,
    max_per_source: 2,
    include_content: true
  });
});

test("parseSearchRequest clamps numeric values", () => {
  const parsed = parseSearchRequest({
    query: "Cooking",
    match_count: 99,
    min_similarity: -5,
    max_per_source: 999,
    include_content: false
  });

  assert.equal(parsed.match_count, 20);
  assert.equal(parsed.min_similarity, 0);
  assert.equal(parsed.max_per_source, 5);
  assert.equal(parsed.include_content, false);
});

test("parseSearchRequest rejects invalid input", () => {
  assert.throws(() => parseSearchRequest([]), /json object/i);
  assert.throws(() => parseSearchRequest({ query: "" }), /non-empty string/i);
  assert.throws(() => parseSearchRequest({ query: "x", match_count: 1.5 }), /integer/i);
});
