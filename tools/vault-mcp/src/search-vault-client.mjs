export class SearchVaultClientError extends Error {
  constructor(message, { kind = "service", status = null, cause = undefined } = {}) {
    super(message, cause ? { cause } : undefined);
    this.name = "SearchVaultClientError";
    this.kind = kind;
    this.status = status;
  }
}

export function createSearchVaultClient({
  searchVaultUrl,
  searchVaultToken,
  searchVaultTimeoutMs = 10000,
  fetchImpl = fetch
}) {
  return {
    async search(requestBody) {
      let response;
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), searchVaultTimeoutMs);

      try {
        response = await fetchImpl(searchVaultUrl, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${searchVaultToken}`
          },
          body: JSON.stringify(requestBody),
          signal: abortController.signal
        });
      } catch (error) {
        if (abortController.signal.aborted) {
          throw new SearchVaultClientError(
            `Vault retrieval service timed out after ${searchVaultTimeoutMs}ms.`,
            {
              kind: "service"
            }
          );
        }

        throw new SearchVaultClientError(
          "Vault retrieval service is unreachable.",
          {
            kind: "service",
            cause: error
          }
        );
      } finally {
        clearTimeout(timeoutId);
      }

      const payload = await parseJsonResponse(response);

      if (!response.ok) {
        throw createResponseError(response.status, payload);
      }

      if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        throw new SearchVaultClientError(
          "Vault retrieval service returned an invalid JSON payload.",
          {
            kind: "service",
            status: response.status
          }
        );
      }

      return payload;
    }
  };
}

async function parseJsonResponse(response) {
  const text = await response.text();

  if (text.trim().length === 0) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new SearchVaultClientError(
      "Vault retrieval service returned malformed JSON.",
      {
        kind: "service",
        status: response.status
      }
    );
  }
}

function createResponseError(status, payload) {
  const fallbackMessage = getFallbackMessage(status);
  const payloadMessage = getPayloadErrorMessage(payload);
  const message = payloadMessage || fallbackMessage;

  if (status === 400) {
    return new SearchVaultClientError(message, {
      kind: "caller",
      status
    });
  }

  if (status === 401) {
    return new SearchVaultClientError(message, {
      kind: "auth",
      status
    });
  }

  return new SearchVaultClientError(message, {
    kind: "service",
    status
  });
}

function getPayloadErrorMessage(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return "";
  }

  if (typeof payload.error === "string" && payload.error.trim().length > 0) {
    return payload.error.trim();
  }

  return "";
}

function getFallbackMessage(status) {
  if (status === 400) {
    return "Vault retrieval request was rejected as invalid.";
  }

  if (status === 401) {
    return "Vault retrieval authentication failed. Check SEARCH_VAULT_TOKEN.";
  }

  return "Vault retrieval service failed to complete the request.";
}
