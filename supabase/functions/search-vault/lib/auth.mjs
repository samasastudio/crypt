export function authenticateBearer(authorizationHeader, expectedToken) {
  if (!authorizationHeader || !expectedToken) {
    return false;
  }

  const [scheme, token] = authorizationHeader.split(" ");
  if (!scheme || !token) {
    return false;
  }

  return scheme.toLowerCase() === "bearer" && token === expectedToken;
}

export function getAuthErrorMessage() {
  return "Unauthorized: missing or invalid bearer token.";
}
