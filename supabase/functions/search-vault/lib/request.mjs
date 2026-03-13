const DEFAULT_MATCH_COUNT = 8;
const DEFAULT_MIN_SIMILARITY = 0.65;
const DEFAULT_MAX_PER_SOURCE = 2;

export function parseSearchRequest(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Request body must be a JSON object.");
  }

  const query = normalizeRequiredString(input.query, "query");
  const repoPathPrefix = normalizeOptionalString(input.repo_path_prefix);
  const sourceType = normalizeOptionalString(input.source_type);
  const matchCount = clampInteger(input.match_count, DEFAULT_MATCH_COUNT, 1, 20, "match_count");
  const minSimilarity = clampNumber(input.min_similarity, DEFAULT_MIN_SIMILARITY, 0, 1, "min_similarity");
  const maxPerSource = clampInteger(input.max_per_source, DEFAULT_MAX_PER_SOURCE, 1, 5, "max_per_source");
  const includeContent = typeof input.include_content === "boolean" ? input.include_content : true;

  return {
    query,
    repo_path_prefix: repoPathPrefix,
    source_type: sourceType,
    match_count: matchCount,
    min_similarity: minSimilarity,
    max_per_source: maxPerSource,
    include_content: includeContent
  };
}

function normalizeRequiredString(value, fieldName) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`"${fieldName}" must be a non-empty string.`);
  }

  return value.trim();
}

function normalizeOptionalString(value) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error("Optional string fields must be strings when provided.");
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function clampInteger(value, defaultValue, min, max, fieldName) {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  if (!Number.isInteger(value)) {
    throw new Error(`"${fieldName}" must be an integer.`);
  }

  return Math.max(min, Math.min(max, value));
}

function clampNumber(value, defaultValue, min, max, fieldName) {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`"${fieldName}" must be a number.`);
  }

  return Math.max(min, Math.min(max, value));
}
