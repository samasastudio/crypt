import fs from "node:fs/promises";
import path from "node:path";

import {
  APPROVED_JSON_PATTERNS,
  EXCLUDED_DIRS,
  INCLUDE_EXTENSIONS,
  REPO_ROOT,
  getExcludeGlobs,
  getIncludeGlobs,
  normalizeRepoPath
} from "./config.mjs";

export async function discoverIndexableFiles() {
  const files = [];
  await walk(REPO_ROOT, files);
  return files.sort();
}

export function filterExplicitPaths(inputPaths) {
  return inputPaths
    .map((value) => value.trim())
    .filter(Boolean)
    .map(normalizeRepoPath)
    .filter((repoPath) => isIndexableRepoPath(repoPath));
}

async function walk(currentDir, files) {
  const entries = await fs.readdir(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = path.join(currentDir, entry.name);
    const relativePath = normalizeRepoPath(path.relative(REPO_ROOT, absolutePath));

    if (entry.isDirectory()) {
      if (shouldSkipDirectory(entry.name, relativePath)) {
        continue;
      }

      await walk(absolutePath, files);
      continue;
    }

    if (isIndexableRepoPath(relativePath)) {
      files.push(relativePath);
    }
  }
}

function shouldSkipDirectory(entryName, relativePath) {
  if (EXCLUDED_DIRS.has(entryName)) {
    return true;
  }

  return matchesAnyGlob(relativePath, getExcludeGlobs());
}

export function isIndexableRepoPath(repoPath) {
  const normalizedPath = normalizeRepoPath(repoPath);
  const extension = path.extname(normalizedPath).toLowerCase();

  if (!INCLUDE_EXTENSIONS.has(extension)) {
    return false;
  }

  const parts = normalizedPath.split("/");
  if (parts.some((part) => EXCLUDED_DIRS.has(part))) {
    return false;
  }

  const includeGlobs = getIncludeGlobs();
  if (includeGlobs.length > 0 && !matchesAnyGlob(normalizedPath, includeGlobs)) {
    return false;
  }

  const excludeGlobs = getExcludeGlobs();
  if (matchesAnyGlob(normalizedPath, excludeGlobs)) {
    return false;
  }

  if (extension === ".json") {
    return APPROVED_JSON_PATTERNS.some((pattern) => pattern.test(normalizedPath));
  }

  return true;
}

function matchesAnyGlob(repoPath, patterns) {
  return patterns.some((pattern) => globToRegExp(pattern).test(repoPath));
}

function globToRegExp(glob) {
  const escaped = glob
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, "::DOUBLE_STAR::")
    .replace(/\*/g, "[^/]*")
    .replace(/::DOUBLE_STAR::/g, ".*");

  return new RegExp(`^${escaped}$`, "i");
}
