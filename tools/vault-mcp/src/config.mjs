export function loadConfig(env = process.env) {
  const searchVaultUrl = normalizeRequiredEnv(env.SEARCH_VAULT_URL);
  const searchVaultToken = normalizeRequiredEnv(env.SEARCH_VAULT_TOKEN);
  const searchVaultTimeoutMs = normalizeOptionalTimeout(env.SEARCH_VAULT_TIMEOUT_MS);

  const missingVars = [];

  if (!searchVaultUrl) {
    missingVars.push("SEARCH_VAULT_URL");
  }

  if (!searchVaultToken) {
    missingVars.push("SEARCH_VAULT_TOKEN");
  }

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}.`);
  }

  try {
    new URL(searchVaultUrl);
  } catch {
    throw new Error("SEARCH_VAULT_URL must be a valid absolute URL.");
  }

  return {
    searchVaultUrl,
    searchVaultToken,
    searchVaultTimeoutMs
  };
}

function normalizeRequiredEnv(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeOptionalTimeout(value) {
  if (value === undefined || value === null || value === "") {
    return 10000;
  }

  const normalized = typeof value === "string" ? value.trim() : value;
  const timeoutMs = Number(normalized);

  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) {
    throw new Error("SEARCH_VAULT_TIMEOUT_MS must be a positive integer when provided.");
  }

  return timeoutMs;
}
