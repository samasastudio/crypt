import { createClient } from "@supabase/supabase-js";

import { toIsoNow } from "./utils.mjs";

export function createSupabase() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export async function replaceDocumentChunks(supabase, document, chunks, embeddings, gitCommitSha) {
  const now = toIsoNow();
  const repoPath = document.repoPath;

  const { error: deleteError } = await supabase.from("vault_chunks").delete().eq("repo_path", repoPath);
  if (deleteError) {
    throw deleteError;
  }

  const rows = chunks.map((chunk, index) => ({
    id: chunk.id,
    repo_path: chunk.repoPath,
    source_type: chunk.sourceType,
    title: chunk.title,
    heading_path: chunk.headingPath,
    chunk_index: chunk.chunkIndex,
    content: chunk.content,
    content_hash: chunk.contentHash,
    embedding: embeddings[index],
    metadata: chunk.metadata,
    git_commit_sha: gitCommitSha,
    last_indexed_at: now
  }));

  if (rows.length > 0) {
    const { error: insertError } = await supabase.from("vault_chunks").insert(rows);
    if (insertError) {
      throw insertError;
    }
  }

  const { error: sourceError } = await supabase.from("vault_sources").upsert(
    {
      repo_path: repoPath,
      source_hash: document.sourceHash,
      last_seen_commit: gitCommitSha,
      last_indexed_at: now,
      status: "active"
    },
    { onConflict: "repo_path" }
  );

  if (sourceError) {
    throw sourceError;
  }

  return {
    repoPath,
    chunkCount: rows.length
  };
}

export async function deleteDocuments(supabase, repoPaths, gitCommitSha) {
  if (repoPaths.length === 0) {
    return 0;
  }

  const now = toIsoNow();
  const { error: chunkError } = await supabase.from("vault_chunks").delete().in("repo_path", repoPaths);
  if (chunkError) {
    throw chunkError;
  }

  const updates = repoPaths.map((repoPath) => ({
    repo_path: repoPath,
    source_hash: null,
    last_seen_commit: gitCommitSha,
    last_indexed_at: now,
    status: "deleted"
  }));

  const { error: sourceError } = await supabase.from("vault_sources").upsert(updates, {
    onConflict: "repo_path"
  });

  if (sourceError) {
    throw sourceError;
  }

  return repoPaths.length;
}

export async function pruneMissingDocuments(supabase, activeRepoPaths, gitCommitSha) {
  const { data, error } = await supabase.from("vault_sources").select("repo_path,status");
  if (error) {
    throw error;
  }

  const expected = new Set(activeRepoPaths);
  const staleRepoPaths = (data ?? [])
    .map((row) => row.repo_path)
    .filter((repoPath) => repoPath && !expected.has(repoPath));

  return deleteDocuments(supabase, staleRepoPaths, gitCommitSha);
}
