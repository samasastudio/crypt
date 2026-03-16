const CANDIDATE_FETCH_MULTIPLIER = 3;
const MAX_CANDIDATE_MATCH_COUNT = 50;

export function getCandidateMatchCount(request) {
  const requestedMatchCount = Number.isInteger(request.match_count) ? request.match_count : 0;
  if (requestedMatchCount <= 0) {
    return 0;
  }

  // Over-fetch candidates so post-processing can still fill the requested count
  // after similarity filtering and per-source caps are applied.
  return Math.min(
    MAX_CANDIDATE_MATCH_COUNT,
    Math.max(requestedMatchCount, requestedMatchCount * CANDIDATE_FETCH_MULTIPLIER)
  );
}

export function postProcessResults(rows, request) {
  const countsBySource = new Map();
  const results = [];
  const requestedMatchCount = Number.isInteger(request.match_count) ? request.match_count : Number.POSITIVE_INFINITY;

  for (const row of rows) {
    if (typeof row.similarity !== "number" || row.similarity < request.min_similarity) {
      continue;
    }

    const currentCount = countsBySource.get(row.repo_path) ?? 0;
    if (currentCount >= request.max_per_source) {
      continue;
    }

    countsBySource.set(row.repo_path, currentCount + 1);

    results.push({
      repo_path: row.repo_path,
      title: row.title,
      heading_path: Array.isArray(row.heading_path) ? row.heading_path : [],
      similarity: row.similarity,
      source_type: row.source_type,
      metadata: row.metadata ?? {},
      ...(request.include_content ? { content: row.content } : {})
    });

    if (results.length >= requestedMatchCount) {
      break;
    }
  }

  return results;
}
