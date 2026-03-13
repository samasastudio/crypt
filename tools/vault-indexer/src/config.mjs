import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const TOOL_ROOT = path.resolve(__dirname, "..");
export const REPO_ROOT = path.resolve(TOOL_ROOT, "..", "..");
export const DEFAULT_EMBED_MODEL = "text-embedding-3-small";
export const DEFAULT_EMBED_DIMENSIONS = 1536;
export const DEFAULT_TARGET_TOKENS = 1000;
export const DEFAULT_OVERLAP_TOKENS = 150;
export const INCLUDE_EXTENSIONS = new Set([".md", ".json", ".canvas"]);
export const EXCLUDED_DIRS = new Set([
  ".git",
  ".github",
  ".obsidian",
  "node_modules",
  "supabase",
  "tools"
]);
export const APPROVED_JSON_PATTERNS = [
  /(^|\/)cookbook_recipes\.json$/i,
  /(^|\/)GROCERY_DATA_2026_UPDATED\.json$/i
];

export function normalizeRepoPath(relativePath) {
  return relativePath.split(path.sep).join("/");
}

export function getIncludeGlobs() {
  return parseCommaList(process.env.INDEX_INCLUDE_GLOBS);
}

export function getExcludeGlobs() {
  return parseCommaList(process.env.INDEX_EXCLUDE_GLOBS);
}

function parseCommaList(value) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}
