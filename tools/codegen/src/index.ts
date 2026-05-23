#!/usr/bin/env node
// ============================================================================
// @dashcraft/mcp-codegen — MCP server entry point
// Convert dashboard images to @dashcraft/core React code
// ============================================================================

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { handleAnalyzeDashboard } from './tools/analyze.js';
import { handleGenerateCode } from './tools/generate-code.js';
import { handleGenerateProject } from './tools/generate-project.js';

// Re-export core functions for Next.js API route usage
export { analyzeWithVision } from './lib/vision.js';
export { generateTsx } from './lib/codegen.js';
export { generateProjectZip } from './lib/zipgen.js';
export type { WidgetAnalysis, DashboardAnalysis, ToolResult } from './lib/types.js';

// ============================================================================
// TOOL DEFINITIONS
// ============================================================================

const TOOLS = [
  {
    name: 'analyze_dashboard',
    description:
      'Analyze a dashboard image using Claude Vision and return widget layout analysis as JSON. ' +
      'Accepts a file path or a base64 data URL.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        image: {
          type: 'string',
          description: 'File path to the dashboard image OR a base64 data URL (data:<mediaType>;base64,...)',
        },
        format: {
          type: 'string',
          enum: ['jpeg', 'png', 'pdf'],
          description: 'Image format hint (default: jpeg). Used when providing a raw file path.',
          default: 'jpeg',
        },
      },
      required: ['image'],
    },
  },
  {
    name: 'generate_code',
    description:
      'Generate a complete TSX component from widget analysis data. ' +
      'Returns a ready-to-use @dashcraft/core React component as a string.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        widgets: {
          type: 'array',
          description: 'Array of WidgetAnalysis objects (from analyze_dashboard output)',
          items: { type: 'object' },
        },
        componentName: {
          type: 'string',
          description: 'Name for the exported React component (default: GeneratedDashboard)',
          default: 'GeneratedDashboard',
        },
      },
      required: ['widgets'],
    },
  },
  {
    name: 'generate_project',
    description:
      'Generate a complete Vite + React project as a base64-encoded zip. ' +
      'The zip contains all boilerplate plus the generated @dashcraft/core dashboard component.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        widgets: {
          type: 'array',
          description: 'Array of WidgetAnalysis objects (from analyze_dashboard output)',
          items: { type: 'object' },
        },
        projectName: {
          type: 'string',
          description: 'Name for the generated project folder and package.json (default: my-dashboard)',
          default: 'my-dashboard',
        },
      },
      required: ['widgets'],
    },
  },
] as const;

// ============================================================================
// HANDLER MAP
// ============================================================================

type ToolName = 'analyze_dashboard' | 'generate_code' | 'generate_project';

const handlers: Record<ToolName, (args: unknown) => Promise<{ content: Array<{ type: 'text'; text: string }>; isError?: boolean }>> = {
  analyze_dashboard: handleAnalyzeDashboard,
  generate_code: handleGenerateCode,
  generate_project: handleGenerateProject,
};

// ============================================================================
// MCP SERVER
// ============================================================================

class DashcraftCodegenServer {
  private readonly server: Server;

  constructor() {
    this.server = new Server(
      { name: 'dashcraft-codegen', version: '0.1.0' },
      { capabilities: { tools: {} } }
    );

    this.setupHandlers();

    this.server.onerror = (error) => {
      console.error('[dashcraft-codegen] MCP error:', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: TOOLS,
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      const handler = handlers[name as ToolName];

      if (!handler) {
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
      }

      try {
        return await handler(args);
      } catch (error) {
        if (error instanceof McpError) throw error;
        const message = error instanceof Error ? error.message : String(error);
        throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${message}`);
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('dashcraft-codegen MCP server v0.1.0 running on stdio');
  }
}

// ============================================================================
// ENTRY POINT
// ============================================================================

new DashcraftCodegenServer().run().catch(console.error);
