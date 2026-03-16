import test from "node:test";
import assert from "node:assert/strict";

import {
  authenticateBearer,
  getAuthErrorMessage
} from "../lib/auth.mjs";

test("authenticateBearer accepts matching bearer token", () => {
  assert.equal(authenticateBearer("Bearer secret-token", "secret-token"), true);
});

test("authenticateBearer rejects missing or invalid tokens", () => {
  assert.equal(authenticateBearer(null, "secret-token"), false);
  assert.equal(authenticateBearer("Bearer wrong-token", "secret-token"), false);
  assert.equal(authenticateBearer("Basic secret-token", "secret-token"), false);
});

test("getAuthErrorMessage is stable", () => {
  assert.match(getAuthErrorMessage(), /invalid bearer token/i);
});
