import test from "node:test";
import assert from "node:assert/strict";

import { chunkDocument, chunkSection } from "../src/chunking.mjs";

test("chunkSection keeps small text intact", () => {
  const chunks = chunkSection("# Title\n\nShort body", 1000, 150);
  assert.equal(chunks.length, 1);
  assert.match(chunks[0], /Short body/);
});

test("chunkSection splits large paragraphs deterministically", () => {
  const text = new Array(1600).fill("ritual").join(" ");
  const firstRun = chunkSection(text, 100, 20);
  const secondRun = chunkSection(text, 100, 20);

  assert.deepEqual(firstRun, secondRun);
  assert.ok(firstRun.length > 1);
});

test("chunkSection keeps oversized flat blobs under the token budget", () => {
  const line = "root.items[0].description: " + "x".repeat(50000);
  const chunks = chunkSection(line, 1000, 150);

  assert.ok(chunks.length > 1);
  chunks.forEach((chunk) => {
    assert.ok(chunk.length <= 4000);
  });
});

test("chunkDocument preserves heading path metadata", () => {
  const chunks = chunkDocument({
    repoPath: "Projects/Basilisk SH/docs/README.md",
    sourceType: "markdown",
    title: "Spec Hub",
    metadata: { type: "doc" },
    sections: [
      {
        headingPath: ["Overview"],
        text: "# Overview\n\nA".repeat(300),
        metadata: {}
      }
    ]
  });

  assert.ok(chunks.length > 0);
  assert.deepEqual(chunks[0].headingPath, ["Overview"]);
  assert.equal(chunks[0].metadata.type, "doc");
});
