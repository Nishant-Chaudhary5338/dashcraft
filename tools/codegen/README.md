# dashcraft-mcp-codegen

[![npm version](https://img.shields.io/npm/v/dashcraft-mcp-codegen)](https://www.npmjs.com/package/dashcraft-mcp-codegen)

MCP server that turns a **dashboard screenshot into working [`dashcraft-core`](https://www.npmjs.com/package/dashcraft-core) React code** — for Claude Desktop, Cursor, and any MCP client.

## Install

```bash
npm install -g dashcraft-mcp-codegen
```

## Configure (Claude Desktop / Cursor)

```json
{
  "mcpServers": {
    "dashcraft": {
      "command": "dashcraft-codegen"
    }
  }
}
```

Set `ANTHROPIC_API_KEY` in the server environment for the vision step.

## Tools

| Tool | What it does |
|---|---|
| `analyze_dashboard` | Reads a dashboard image and returns its widgets + grid layout as JSON |
| `generate_code` | Emits a ready-to-use `dashcraft-core` TSX component from that analysis |
| `generate_project` | Returns a complete, runnable Vite + React + TS project (as a zip) |

Generated code targets the current `dashcraft-core` API: widgets render their own card and are positioned with `defaultPosition` / `defaultSize` under a `<Dashboard persistenceKey ... defaultEditMode>`.

## License

MIT © Nishant Chaudhary
