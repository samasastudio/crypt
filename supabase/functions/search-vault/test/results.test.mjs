import test from "node:test";
import assert from "node:assert/strict";

import {
  getCandidateMatchCount,
  postProcessResults
} from "../lib/results.mjs";

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
    match_count: 8,
    min_similarity: 0.65,
    max_per_source: 2,
    include_content: false
  });

  assert.equal("content" in processed[0], false);
  assert.deepEqual(processed[0].heading_path, ["One"]);
});

test("postProcessResults fills requested count from later sources when earlier rows are capped", () => {
  const processed = postProcessResults(
    [
      ...rows,
      {
        repo_path: "Projects/Basilisk SH/docs/b.md",
        title: "B",
        heading_path: ["Overview"],
        content: "chunk-b1",
        similarity: 0.87,
        source_type: "markdown",
        metadata: { kind: "doc" }
      },
      {
        repo_path: "Projects/Basilisk SH/docs/c.md",
        title: "C",
        heading_path: ["Overview"],
        content: "chunk-c2",
        similarity: 0.86,
        source_type: "markdown",
        metadata: { kind: "doc" }
      }
    ],
    {
      match_count: 3,
      min_similarity: 0.65,
      max_per_source: 2,
      include_content: true
    }
  );

  assert.equal(processed.length, 3);
  assert.deepEqual(
    processed.map((row) => row.repo_path),
    [
      "Projects/Basilisk SH/docs/a.md",
      "Projects/Basilisk SH/docs/a.md",
      "Projects/Basilisk SH/docs/b.md"
    ]
  );
});

test("getCandidateMatchCount over-fetches while preserving an upper bound", () => {
  assert.equal(getCandidateMatchCount({ match_count: 8 }), 24);
  assert.equal(getCandidateMatchCount({ match_count: 20 }), 50);
});
