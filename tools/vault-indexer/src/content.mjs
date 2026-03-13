import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

import { REPO_ROOT } from "./config.mjs";
import { sha256 } from "./utils.mjs";

export async function loadSourceDocument(repoPath) {
  const absolutePath = path.join(REPO_ROOT, repoPath);
  const extension = path.extname(repoPath).toLowerCase();
  const raw = await fs.readFile(absolutePath, "utf8");

  if (extension === ".md") {
    return parseMarkdown(repoPath, raw);
  }

  if (extension === ".json") {
    return parseJson(repoPath, raw);
  }

  if (extension === ".canvas") {
    return parseCanvas(repoPath, raw);
  }

  throw new Error(`Unsupported source type: ${repoPath}`);
}

function parseMarkdown(repoPath, raw) {
  const parsed = matter(raw);
  const body = parsed.content.replace(/\r\n/g, "\n").trim();
  const lines = body.split("\n");
  const sections = [];
  const headingStack = [];
  let current = createSection([], []);
  let firstHeading = null;

  for (const line of lines) {
    const match = /^(#{1,6})\s+(.*\S)\s*$/.exec(line);
    if (match) {
      if (current.lines.length > 0 || current.headingPath.length > 0) {
        sections.push(finalizeSection(current));
      }

      const level = match[1].length;
      const heading = cleanText(match[2]);
      headingStack.length = level - 1;
      headingStack[level - 1] = heading;
      if (!firstHeading && level === 1) {
        firstHeading = heading;
      }

      current = createSection(headingStack, [`${"#".repeat(level)} ${heading}`]);
      continue;
    }

    current.lines.push(line);
  }

  if (current.lines.length > 0 || current.headingPath.length > 0) {
    sections.push(finalizeSection(current));
  }

  const title = parsed.data.title || firstHeading || path.basename(repoPath, ".md");
  return {
    repoPath,
    sourceType: "markdown",
    title,
    metadata: sanitizeMetadata(parsed.data),
    sourceHash: sha256(raw),
    sections: sections.filter((section) => section.text.trim().length > 0)
  };
}

function parseJson(repoPath, raw) {
  const parsed = JSON.parse(raw);
  const lines = [];
  flattenJson(parsed, [], lines);

  return {
    repoPath,
    sourceType: "json",
    title: path.basename(repoPath),
    metadata: {},
    sourceHash: sha256(raw),
    sections: [
      {
        headingPath: [],
        text: lines.join("\n"),
        metadata: {
          format: "json"
        }
      }
    ]
  };
}

function parseCanvas(repoPath, raw) {
  const parsed = JSON.parse(raw);
  const nodes = Array.isArray(parsed.nodes) ? parsed.nodes : [];
  const edges = Array.isArray(parsed.edges) ? parsed.edges : [];

  const textNodes = nodes
    .filter((node) => node.type === "text" && typeof node.text === "string")
    .sort((left, right) => {
      if ((left.y ?? 0) !== (right.y ?? 0)) {
        return (left.y ?? 0) - (right.y ?? 0);
      }

      return (left.x ?? 0) - (right.x ?? 0);
    })
    .map((node) => cleanText(node.text))
    .filter(Boolean);

  const edgeLines = edges.map((edge) => `${edge.fromNode ?? "unknown"} -> ${edge.toNode ?? "unknown"}`);
  const text = [
    `Canvas: ${path.basename(repoPath)}`,
    "",
    "Text nodes:",
    ...textNodes.map((line) => `- ${line}`),
    "",
    "Edges:",
    ...edgeLines.map((line) => `- ${line}`)
  ]
    .join("\n")
    .trim();

  return {
    repoPath,
    sourceType: "canvas",
    title: path.basename(repoPath, ".canvas"),
    metadata: {
      nodeCount: nodes.length,
      edgeCount: edges.length
    },
    sourceHash: sha256(raw),
    sections: [
      {
        headingPath: [],
        text,
        metadata: {
          format: "canvas"
        }
      }
    ]
  };
}

function flattenJson(value, pathParts, lines) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => flattenJson(entry, [...pathParts, `[${index}]`], lines));
    return;
  }

  if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      flattenJson(entry, [...pathParts, key], lines);
    }
    return;
  }

  const joinedPath = formatJsonPath(pathParts);
  const printable = typeof value === "string" ? cleanText(value) : JSON.stringify(value);
  lines.push(`${joinedPath}: ${printable}`);
}

function formatJsonPath(pathParts) {
  return pathParts.reduce((accumulator, part) => {
    if (part.startsWith("[")) {
      return `${accumulator}${part}`;
    }

    return accumulator ? `${accumulator}.${part}` : part;
  }, "root");
}

function sanitizeMetadata(metadata) {
  try {
    return JSON.parse(JSON.stringify(metadata ?? {}));
  } catch {
    return {};
  }
}

function cleanText(value) {
  return String(value)
    .replace(/\s+/g, " ")
    .trim();
}

function createSection(headingPath, lines) {
  return {
    headingPath: [...headingPath],
    lines: [...lines]
  };
}

function finalizeSection(section) {
  return {
    headingPath: [...section.headingPath],
    text: section.lines.join("\n").trim(),
    metadata: {}
  };
}
