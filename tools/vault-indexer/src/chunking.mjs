import {
  DEFAULT_OVERLAP_TOKENS,
  DEFAULT_TARGET_TOKENS
} from "./config.mjs";
import { estimateTokens, sha256 } from "./utils.mjs";

export function chunkDocument(document, options = {}) {
  const targetTokens = options.targetTokens ?? DEFAULT_TARGET_TOKENS;
  const overlapTokens = options.overlapTokens ?? DEFAULT_OVERLAP_TOKENS;
  const chunks = [];

  document.sections.forEach((section, sectionIndex) => {
    const sectionChunks = chunkSection(section.text, targetTokens, overlapTokens);
    sectionChunks.forEach((content, chunkIndex) => {
      const normalizedContent = content.trim();
      if (!normalizedContent) {
        return;
      }

      const contentHash = sha256(normalizedContent);
      const stableIndex = `${sectionIndex}-${chunkIndex}`;
      chunks.push({
        id: sha256(`${document.repoPath}:${stableIndex}:${contentHash}`),
        repoPath: document.repoPath,
        sourceType: document.sourceType,
        title: document.title,
        headingPath: section.headingPath,
        chunkIndex: chunks.length,
        content: normalizedContent,
        contentHash,
        metadata: {
          ...document.metadata,
          ...section.metadata
        }
      });
    });
  });

  return chunks;
}

export function chunkSection(text, targetTokens = DEFAULT_TARGET_TOKENS, overlapTokens = DEFAULT_OVERLAP_TOKENS) {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) {
    return [];
  }

  if (estimateTokens(normalized) <= targetTokens) {
    return [normalized];
  }

  const paragraphs = normalized
    .split(/\n{2,}/)
    .map((entry) => entry.trim())
    .filter(Boolean);

  const chunks = [];
  let currentChunk = [];
  let currentTokens = 0;

  for (const paragraph of paragraphs) {
    const paragraphTokens = estimateTokens(paragraph);

    if (paragraphTokens > targetTokens) {
      const splitParagraphChunks = chunkLargeParagraph(paragraph, targetTokens, overlapTokens);
      for (const splitChunk of splitParagraphChunks) {
        if (currentChunk.length > 0) {
          chunks.push(currentChunk.join("\n\n"));
          currentChunk = [];
          currentTokens = 0;
        }

        chunks.push(splitChunk);
      }

      continue;
    }

    if (currentTokens + paragraphTokens > targetTokens && currentChunk.length > 0) {
      chunks.push(currentChunk.join("\n\n"));
      currentChunk = buildOverlapChunk(currentChunk.join("\n\n"), overlapTokens);
      currentTokens = estimateTokens(currentChunk.join("\n\n"));
    }

    currentChunk.push(paragraph);
    currentTokens += paragraphTokens;
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join("\n\n"));
  }

  return chunks;
}

function chunkLargeParagraph(paragraph, targetTokens, overlapTokens) {
  const normalized = paragraph.trim();
  const maxChars = Math.max(400, targetTokens * 4);
  const overlapChars = Math.max(80, overlapTokens * 4);
  const chunks = [];

  if (normalized.length <= maxChars) {
    return [normalized];
  }

  let start = 0;
  while (start < normalized.length) {
    const remaining = normalized.length - start;
    if (remaining <= maxChars) {
      chunks.push(normalized.slice(start).trim());
      break;
    }

    let end = start + maxChars;
    const boundary = normalized.lastIndexOf(" ", end);
    if (boundary > start + Math.floor(maxChars / 2)) {
      end = boundary;
    }

    const chunk = normalized.slice(start, end).trim();
    if (!chunk) {
      end = Math.min(normalized.length, start + maxChars);
    }

    chunks.push(normalized.slice(start, end).trim());
    start = Math.max(end - overlapChars, start + 1);
  }

  return chunks;
}

function buildOverlapChunk(existingChunk, overlapTokens) {
  const overlapWords = Math.max(30, overlapTokens * 3);
  const words = existingChunk.split(/\s+/).filter(Boolean);
  return [words.slice(-overlapWords).join(" ")].filter(Boolean);
}
