export function loadConfig(env = process.env) {
  const searchVaultUrl = normalizeRequiredEnv(env.SEARCH_VAULT_URL);
  const searchVaultToken = normalizeRequiredEnv(env.SEARCH_VAULT_TOKEN);

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
    searchVaultToken
  };
}

function normalizeRequiredEnv(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}
