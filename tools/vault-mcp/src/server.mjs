import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod/v4";

import {
  createSearchBasiliskHandler,
  formatSearchBasiliskText
} from "./search-basilisk.mjs";

export function createVaultMcpServer(searchVaultClient) {
  const server = new McpServer({
    name: "vault-mcp",
    version: "1.0.0"
  });

  const searchBasilisk = createSearchBasiliskHandler(searchVaultClient);

  server.registerTool(
    "search_basilisk",
    {
      title: "Search Basilisk",
      description: "Semantic search scoped to the Basilisk SH notes in the crypt vault.",
      inputSchema: {
        query: z.string().describe("Plain-language query for Basilisk documentation."),
        match_count: z.number().int().optional().describe("Maximum number of matches to return, clamped to 1-8."),
        include_content: z.boolean().optional().describe("Whether to include chunk content in the returned results.")
      },
      outputSchema: {
        query: z.string(),
        scope: z.string(),
        results: z.array(
          z.object({
            repo_path: z.string(),
            title: z.string().nullable().optional(),
            heading_path: z.array(z.string()),
            similarity: z.number(),
            source_type: z.string(),
            metadata: z.record(z.string(), z.unknown()),
            content: z.string().optional()
          })
        ),
        meta: z.record(z.string(), z.unknown())
      },
      annotations: {
        readOnlyHint: true
      }
    },
    async (input) => {
      try {
        const result = await searchBasilisk(input);

        return {
          content: [
            {
              type: "text",
              text: formatSearchBasiliskText(result)
            }
          ],
          structuredContent: result
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unexpected vault retrieval error.";

        return {
          isError: true,
          content: [
            {
              type: "text",
              text: message
            }
          ]
        };
      }
    }
  );

  return server;
}
