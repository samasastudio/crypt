import test from "node:test";
import assert from "node:assert/strict";

import { postProcessResults } from "../lib/results.mjs";

const rows = [
  {
    repo_path: "Projects/Basilisk SH/docs/a.md",
    title: "A",
    heading_path: ["One"],
    content: "chunk-a1",
    similarity: 0.91,
    source_type: "markdown",
    metadata: { kind: "doc" }
  },
  {
    repo_path: "Projects/Basilisk SH/docs/a.md",
    title: "A",
    heading_path: ["Two"],
    content: "chunk-a2",
    similarity: 0.89,
    source_type: "markdown",
    metadata: { kind: "doc" }
  },
  {
    repo_path: "Projects/Basilisk SH/docs/a.md",
    title: "A",
    heading_path: ["Three"],
    content: "chunk-a3",
    similarity: 0.88,
    source_type: "markdown",
    metadata: { kind: "doc" }
  },
  {
    repo_path: "Cooking/README.md",
    title: "Cooking",
    heading_path: [],
    content: "chunk-c1",
    similarity: 0.5,
    source_type: "markdown",
    metadata: {}
  }
];

test("postProcessResults filters weak matches and caps repeated sources", () => {
  const processed = postProcessResults(rows, {
    min_similarity: 0.65,
    max_per_source: 2,
    include_content: true
  });

  assert.equal(processed.length, 2);
  assert.deepEqual(
    processed.map((row) => row.repo_path),
    [
      "Projects/Basilisk SH/docs/a.md",
      "Projects/Basilisk SH/docs/a.md"
    ]
  );
});

test("postProcessResults can omit content", () => {
  const processed = postProcessResults(rows, {
    min_similarity: 0.65,
    max_per_source: 2,
    include_content: false
  });

  assert.equal("content" in processed[0], false);
  assert.deepEqual(processed[0].heading_path, ["One"]);
});
