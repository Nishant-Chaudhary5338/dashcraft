// ============================================================================
// TOOL: analyze_dashboard
// ============================================================================

import { analyzeWithVision } from '../lib/vision.js';
import type { ToolResult } from '../lib/types.js';

interface AnalyzeArgs {
  image: string;
  format?: 'jpeg' | 'png' | 'pdf';
}

export async function handleAnalyzeDashboard(args: unknown): Promise<ToolResult> {
  const { image, format = 'jpeg' } = args as AnalyzeArgs;

  if (!image || typeof image !== 'string') {
    return errorResult('`image` is required and must be a string (file path or base64 data URL).');
  }

  try {
    const analysis = await analyzeWithVision(image, format);
    return successResult({ analysis });
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
