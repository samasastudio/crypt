import crypto from "node:crypto";

export function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function toIsoNow() {
  return new Date().toISOString();
}

export function estimateTokens(text) {
  return Math.max(1, Math.ceil(text.length / 4));
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function unique(values) {
  return [...new Set(values)];
}
