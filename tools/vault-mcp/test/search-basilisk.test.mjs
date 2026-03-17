import test from "node:test";
import assert from "node:assert/strict";

import {
  BASILISK_SCOPE,
  createSearchBasiliskHandler,
  formatSearchBasiliskText,
  normalizeSearchBasiliskInput
} from "../src/search-basilisk.mjs";

test("normalizeSearchBasiliskInput rejects empty queries", () => {
  assert.throws(
    () => normalizeSearchBasiliskInput({
      query: "   "
    }),
    /non-empty string/i
  );
});

test("normalizeSearchBasiliskInput clamps match_count and defaults include_content", () => {
  assert.deepEqual(
    normalizeSearchBasiliskInput({
      query: " ritual state ",
      match_count: 99
    }),
    {
      query: "ritual state",
      repo_path_prefix: BASILISK_SCOPE,
      match_count: 8,
      min_similarity: 0.3,
      include_content: true
    }
  );

  assert.deepEqual(
    normalizeSearchBasiliskInput({
      query: "ritual state",
      match_count: 0,
      include_content: false
    }),
    {
      query: "ritual state",
      repo_path_prefix: BASILISK_SCOPE,
      match_count: 1,
      min_similarity: 0.3,
      include_content: false
    }
  );
});

test("createSearchBasiliskHandler always scopes requests to Basilisk and preserves results", async () => {
  let seenRequest;

  const handler = createSearchBasiliskHandler({
    async search(request) {
      seenRequest = request;

      return {
        query: request.query,
        results: [
          {
            repo_path: "Projects/Basilisk SH/docs/systems/ritual-state-and-score.md",
            title: "Ritual state and score",
            heading_path: ["State mapping"],
            similarity: 0.91,
            source_type: "markdown",
            metadata: {
              kind: "doc"
            },
            content: "Mapped ritual state details"
          }
        ],
        meta: {
          returned: 1,
          match_count: 8
        }
      };
    }
  });

  const result = await handler({
    query: "How does Basilisk map ritual state to AV output?",
    match_count: 12,
    include_content: true
  });

  assert.deepEqual(seenRequest, {
    query: "How does Basilisk map ritual state to AV output?",
    repo_path_prefix: BASILISK_SCOPE,
    match_count: 8,
    min_similarity: 0.3,
    include_content: true
  });
  assert.equal(result.scope, BASILISK_SCOPE);
  assert.equal(result.meta.returned, 1);
  assert.equal(result.results[0].repo_path, "Projects/Basilisk SH/docs/systems/ritual-state-and-score.md");
});

test("createSearchBasiliskHandler preserves empty results without error", async () => {
  const handler = createSearchBasiliskHandler({
    async search(request) {
      return {
        query: request.query,
        results: [],
        meta: {
          returned: 0
        }
      };
    }
  });

  const result = await handler({
    query: "missing concept"
  });

  assert.deepEqual(result.results, []);
  assert.equal(result.meta.returned, 0);
});

test("formatSearchBasiliskText renders human-readable summaries", () => {
  assert.match(
    formatSearchBasiliskText({
      query: "ritual state",
      scope: BASILISK_SCOPE,
      results: []
    }),
    /No Basilisk matches found/i
  );

  assert.match(
    formatSearchBasiliskText({
      query: "ritual state",
      scope: BASILISK_SCOPE,
      results: [
        {
          repo_path: "Projects/Basilisk SH/docs/systems/ritual-state-and-score.md",
          title: "Ritual state and score",
          heading_path: ["State mapping"],
          similarity: 0.91
        }
      ]
    }),
    /\[0.91\].*ritual-state-and-score\.md/i
  );
});
