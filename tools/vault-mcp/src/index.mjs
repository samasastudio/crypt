import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { loadConfig } from "./config.mjs";
import { createSearchVaultClient } from "./search-vault-client.mjs";
import { createVaultMcpServer } from "./server.mjs";

async function main() {
  const config = loadConfig();
  const searchVaultClient = createSearchVaultClient(config);
  const server = createVaultMcpServer(searchVaultClient);
  const transport = new StdioServerTransport();

  await server.connect(transport);
  console.error("vault-mcp is running on stdio.");
}

main().catch((error) => {
  console.error("vault-mcp failed to start:", error);
  process.exit(1);
});
