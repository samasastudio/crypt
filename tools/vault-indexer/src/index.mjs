import fs from "node:fs/promises";
import path from "node:path";

import dotenv from "dotenv";

import { chunkDocument } from "./chunking.mjs";
import { loadSourceDocument } from "./content.mjs";
import { discoverIndexableFiles, filterExplicitPaths } from "./discovery.mjs";
import { createEmbeddingClient, embedChunks } from "./embeddings.mjs";
import { TOOL_ROOT } from "./config.mjs";
import {
  createSupabase,
  deleteDocuments,
  pruneMissingDocuments,
  replaceDocumentChunks
} from "./supabase.mjs";
import { unique } from "./utils.mjs";

dotenv.config({ path: path.join(TOOL_ROOT, ".env") });
dotenv.config({ path: path.join(TOOL_ROOT, ".env.local") });

const args = parseArgs(process.argv.slice(2));

async function main() {
  const gitCommitSha = process.env.GITHUB_SHA || process.env.GIT_COMMIT_SHA || "local";
  log(`Starting ${args.full ? "full" : "incremental"} vault index run for commit ${gitCommitSha}`);
  const changedPaths = args.full
    ? await discoverIndexableFiles()
    : await resolveChangedPaths(args.changed, args.changedFileList);
  const deletedPaths = await resolveChangedPaths(args.deleted, args.deletedFileList);
  const summary = {
    mode: args.full ? "full" : "incremental",
    scanned: 0,
    indexed: 0,
    chunked: 0,
    deleted: deletedPaths.length,
    failures: []
  };

  if (changedPaths.length === 0 && deletedPaths.length === 0 && !args.full) {
    console.log(JSON.stringify({ message: "No indexable file changes detected.", ...summary }, null, 2));
    return;
  }

  log(`Resolved ${changedPaths.length} changed/indexable paths and ${deletedPaths.length} deleted paths`);

  const prepared = [];
  for (const [index, repoPath] of changedPaths.entries()) {
    try {
      const document = await loadSourceDocument(repoPath);
      const chunks = chunkDocument(document);
      prepared.push({
        document,
        chunks
      });
      summary.scanned += 1;
      summary.indexed += 1;
      summary.chunked += chunks.length;

      if ((index + 1) % 25 === 0 || index === changedPaths.length - 1) {
        log(`Prepared ${index + 1}/${changedPaths.length} files (${summary.chunked} chunks so far)`);
      }
    } catch (error) {
      summary.failures.push({
        repoPath,
        error: error.message
      });
      log(`Failed to prepare ${repoPath}: ${error.message}`);
    }
  }

  if (args.dryRun) {
    console.log(JSON.stringify({ dryRun: true, changedPaths, deletedPaths, ...summary }, null, 2));
    return;
  }

  const supabase = createSupabase();
  const embeddingClient = createEmbeddingClient();
  log(`Beginning remote indexing for ${prepared.length} documents`);

  for (const [index, entry] of prepared.entries()) {
    try {
      log(`Indexing ${index + 1}/${prepared.length}: ${entry.document.repoPath} (${entry.chunks.length} chunks)`);
      const embeddings = await embedChunks(embeddingClient, entry.chunks, {
        logger: (message) => log(`${entry.document.repoPath}: ${message}`)
      });
      log(`Writing ${entry.chunks.length} chunks to Supabase for ${entry.document.repoPath}`);
      await replaceDocumentChunks(supabase, entry.document, entry.chunks, embeddings, gitCommitSha);
      log(`Finished ${entry.document.repoPath}`);
    } catch (error) {
      summary.failures.push({
        repoPath: entry.document.repoPath,
        error: error.message
      });
      log(`Failed to index ${entry.document.repoPath}: ${error.message}`);
    }
  }

  if (deletedPaths.length > 0) {
    log(`Deleting ${deletedPaths.length} removed documents from Supabase`);
    await deleteDocuments(supabase, deletedPaths, gitCommitSha);
  }

  if (args.full) {
    log("Pruning stale documents missing from the current vault snapshot");
    summary.deleted += await pruneMissingDocuments(supabase, changedPaths, gitCommitSha);
  }

  console.log(JSON.stringify(summary, null, 2));

  if (summary.failures.length > 0) {
    process.exitCode = 1;
  }
}

function parseArgs(values) {
  const parsed = {
    full: false,
    dryRun: false,
    changed: [],
    deleted: [],
    changedFileList: null,
    deletedFileList: null
  };

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];

    if (value === "--full") {
      parsed.full = true;
      continue;
    }

    if (value === "--dry-run") {
      parsed.dryRun = true;
      continue;
    }

    if (value === "--changed-file-list") {
      parsed.changedFileList = values[index + 1];
      index += 1;
      continue;
    }

    if (value === "--deleted-file-list") {
      parsed.deletedFileList = values[index + 1];
      index += 1;
      continue;
    }

    if (value === "--changed" || value === "--deleted") {
      const target = value === "--changed" ? parsed.changed : parsed.deleted;
      for (let cursor = index + 1; cursor < values.length; cursor += 1) {
        const candidate = values[cursor];
        if (candidate.startsWith("--")) {
          break;
        }

        target.push(candidate);
        index = cursor;
      }
    }
  }

  return parsed;
}

async function resolveChangedPaths(directPaths, fileListPath) {
  const explicitPaths = [...directPaths];
  if (fileListPath) {
    const fileListContents = await fs.readFile(fileListPath, "utf8");
    explicitPaths.push(...fileListContents.split(/\r?\n/));
  }

  return unique(filterExplicitPaths(explicitPaths));
}

function log(message) {
  console.log(`[vault-indexer] ${message}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
