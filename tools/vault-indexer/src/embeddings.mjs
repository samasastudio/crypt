import OpenAI from "openai";

import {
  DEFAULT_EMBED_DIMENSIONS,
  DEFAULT_EMBED_MODEL
} from "./config.mjs";
import { sleep } from "./utils.mjs";

export function createEmbeddingClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  return new OpenAI({ apiKey });
}

export async function embedChunks(client, chunks) {
  if (chunks.length === 0) {
    return [];
  }

  const model = process.env.OPENAI_EMBED_MODEL || DEFAULT_EMBED_MODEL;
  const dimensions = Number(process.env.OPENAI_EMBED_DIMENSIONS || DEFAULT_EMBED_DIMENSIONS);
  const batchSize = Number(process.env.OPENAI_EMBED_BATCH_SIZE || 32);
  const vectors = [];

  for (let start = 0; start < chunks.length; start += batchSize) {
    const batch = chunks.slice(start, start + batchSize);
    const response = await withRetry(() =>
      client.embeddings.create({
        model,
        dimensions,
        input: batch.map((chunk) => chunk.content)
      })
    );

    response.data.forEach((item) => {
      vectors.push(item.embedding);
    });
  }

  return vectors;
}

async function withRetry(fn, attempts = 4) {
  let error;

  for (let index = 0; index < attempts; index += 1) {
    try {
      return await fn();
    } catch (caughtError) {
      error = caughtError;
      if (index === attempts - 1) {
        break;
      }

      await sleep(500 * 2 ** index);
    }
  }

  throw error;
}
