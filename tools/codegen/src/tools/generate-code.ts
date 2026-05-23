// ============================================================================
// TOOL: generate_code
// ============================================================================

import { generateTsx } from '../lib/codegen.js';
import type { WidgetAnalysis, ToolResult } from '../lib/types.js';

interface GenerateCodeArgs {
  widgets: WidgetAnalysis[];
  componentName?: string;
}

export async function handleGenerateCode(args: unknown): Promise<ToolResult> {
  const { widgets, componentName } = args as GenerateCodeArgs;

  if (!Array.isArray(widgets) || widgets.length === 0) {
    return errorResult('`widgets` must be a non-empty array of WidgetAnalysis objects.');
  }

  try {
    const code = generateTsx(widgets, componentName);
    return successResult({ code });
  } catch (err) {
    return errorResult(err instanceof Error ? err.message : String(err));
  }
}

function successResult(data: Record<string, unknown>): ToolResult {
  return {
    content: [{ type: 'text', text: JSON.stringify({ success: true, ...data }, null, 2) }],
  };
}

function errorResult(message: string): ToolResult {
  return {
    content: [{ type: 'text', text: JSON.stringify({ success: false, error: message }, null, 2) }],
    isError: true,
  };
}
