export const BASILISK_SCOPE = "Projects/Basilisk SH";
const BASILISK_MIN_SIMILARITY = 0.3;
const DEFAULT_MATCH_COUNT = 8;
const MIN_MATCH_COUNT = 1;
const MAX_MATCH_COUNT = 8;

export function normalizeSearchBasiliskInput(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("search_basilisk input must be a JSON object.");
  }

  const query = normalizeQuery(input.query);
  const matchCount = clampMatchCount(input.match_count);
  const includeContent =
    typeof input.include_content === "boolean" ? input.include_content : true;

  return {
    query,
    repo_path_prefix: BASILISK_SCOPE,
    match_count: matchCount,
    min_similarity: BASILISK_MIN_SIMILARITY,
    include_content: includeContent
  };
}

export function createSearchBasiliskHandler(searchVaultClient) {
  return async function handleSearchBasilisk(input) {
    const requestBody = normalizeSearchBasiliskInput(input);
    const response = await searchVaultClient.search(requestBody);

    return {
      query: typeof response.query === "string" ? response.query : requestBody.query,
      scope: BASILISK_SCOPE,
      results: Array.isArray(response.results) ? response.results : [],
      meta: isPlainObject(response.meta) ? response.meta : {}
    };
  };
}

export function formatSearchBasiliskText(result) {
  const results = Array.isArray(result.results) ? result.results : [];

  if (results.length === 0) {
    return `No Basilisk matches found for "${result.query}" within ${result.scope}.`;
  }

  const lines = [
    `Found ${results.length} Basilisk match${results.length === 1 ? "" : "es"} for "${result.query}" within ${result.scope}.`
  ];

  for (const [index, row] of results.entries()) {
    const heading = Array.isArray(row.heading_path) && row.heading_path.length > 0
      ? ` > ${row.heading_path.join(" > ")}`
      : "";
    const title = typeof row.title === "string" && row.title.length > 0
      ? ` (${row.title})`
      : "";
    const similarity = typeof row.similarity === "number"
      ? row.similarity.toFixed(2)
      : "n/a";

    lines.push(`${index + 1}. [${similarity}] ${row.repo_path}${title}${heading}`);
  }

  return lines.join("\n");
}

function normalizeQuery(value) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error('"query" must be a non-empty string.');
  }

  return value.trim();
}

function clampMatchCount(value) {
  if (value === undefined || value === null) {
    return DEFAULT_MATCH_COUNT;
  }

  if (!Number.isInteger(value)) {
    throw new Error('"match_count" must be an integer when provided.');
  }

  return Math.max(MIN_MATCH_COUNT, Math.min(MAX_MATCH_COUNT, value));
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
