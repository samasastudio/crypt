export function postProcessResults(rows, request) {
  const countsBySource = new Map();
  const results = [];

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
  }

  return results;
}
