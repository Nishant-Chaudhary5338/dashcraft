// ============================================================================
// TOOL: generate_project
// ============================================================================

import { generateProjectZip } from '../lib/zipgen.js';
import type { WidgetAnalysis, ToolResult } from '../lib/types.js';

interface GenerateProjectArgs {
  widgets: WidgetAnalysis[];
  projectName?: string;
}

export async function handleGenerateProject(args: unknown): Promise<ToolResult> {
  const { widgets, projectName = 'my-dashboard' } = args as GenerateProjectArgs;

  if (!Array.isArray(widgets) || widgets.length === 0) {
    return errorResult('`widgets` must be a non-empty array of WidgetAnalysis objects.');
  }

  try {
    const zipBase64 = await generateProjectZip(widgets, projectName);
    return successResult({ zipBase64, projectName });
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
