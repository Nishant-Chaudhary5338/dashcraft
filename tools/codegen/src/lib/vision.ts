// ============================================================================
// VISION - Claude Vision API calls for dashboard analysis
// ============================================================================

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import type { DashboardAnalysis } from './types.js';

const ANALYSIS_PROMPT = `Analyze this dashboard image and identify all UI widgets/panels.

For each widget, determine:
1. Type: kpi, bar_chart, line_chart, area_chart, pie_chart, scatter_chart, radar_chart, heatmap, treemap, sunburst, table, text
2. Title (visible text)
3. Grid position (assume 12-column grid): colStart (1-12), colSpan (1-12), rowStart, rowSpan
4. Component mapping:
   - kpi → KPIWidget with format: "currency"|"percent"|"number"
   - bar_chart/line_chart/area_chart/pie_chart/scatter_chart/radar_chart → RechartsWidget with chartType
   - heatmap/treemap/sunburst → NivoWidget with chartType

Return ONLY valid JSON in this exact format:
{
  "widgets": [
    {
      "id": "widget-1",
      "type": "kpi",
      "dashcraftComponent": "KPIWidget",
      "title": "Revenue",
      "colStart": 1,
      "colSpan": 3,
      "rowStart": 1,
      "rowSpan": 2,
      "config": { "format": "currency" }
    }
  ],
  "totalColumns": 12,
  "totalRows": 4,
  "suggestedLayout": "grid"
}`;

type ImageMediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

function resolveMediaType(format: string): ImageMediaType {
  switch (format.toLowerCase()) {
    case 'png': return 'image/png';
    case 'gif': return 'image/gif';
    case 'webp': return 'image/webp';
    default: return 'image/jpeg';
  }
}

function isBase64DataUrl(input: string): boolean {
  return input.startsWith('data:');
}

function parseDataUrl(dataUrl: string): { mediaType: ImageMediaType; data: string } {
  // data:<mediaType>;base64,<data>
  const commaIdx = dataUrl.indexOf(',');
  const header = dataUrl.slice(5, commaIdx); // strip "data:"
  const [rawMediaType] = header.split(';');
  const data = dataUrl.slice(commaIdx + 1);
  return { mediaType: rawMediaType as ImageMediaType, data };
}

function loadImageAsBase64(
  filePath: string,
  format: string
): { mediaType: ImageMediaType; data: string } {
  const resolved = path.resolve(filePath);
  const buffer = fs.readFileSync(resolved);
  const data = buffer.toString('base64');
  const mediaType = resolveMediaType(format || path.extname(filePath).slice(1));
  return { mediaType, data };
}

export async function analyzeWithVision(
  image: string,
  format: string = 'jpeg'
): Promise<DashboardAnalysis> {
  const client = new Anthropic();

  let mediaType: ImageMediaType;
  let imageData: string;

  if (isBase64DataUrl(image)) {
    const parsed = parseDataUrl(image);
    mediaType = parsed.mediaType;
    imageData = parsed.data;
  } else {
    const loaded = loadImageAsBase64(image, format);
    mediaType = loaded.mediaType;
    imageData = loaded.data;
  }

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: imageData },
          },
          { type: 'text', text: ANALYSIS_PROMPT },
        ],
      },
    ],
  });

  const rawText = response.content
    .filter((block) => block.type === 'text')
    .map((block) => (block as { type: 'text'; text: string }).text)
    .join('');

  // Extract JSON from the response — strip any markdown fences
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`Claude did not return valid JSON. Raw response:\n${rawText}`);
  }

  return JSON.parse(jsonMatch[0]) as DashboardAnalysis;
}
