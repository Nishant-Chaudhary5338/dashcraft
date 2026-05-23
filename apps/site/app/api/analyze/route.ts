import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a UI analysis expert specializing in dashboard components.
Analyze dashboard images and map widgets to @dashcraft/core React components.`;

const USER_PROMPT = `Analyze this dashboard image. Identify every distinct widget or panel.

For each widget, determine:
1. Type: kpi, bar_chart, line_chart, area_chart, pie_chart, scatter_chart, radar_chart, heatmap, treemap, sunburst
2. Title (from visible text, or infer from content)
3. Grid position (12-column grid): colStart (1-12), colSpan (1-12), rowStart, rowSpan
4. Component: KPIWidget for metrics/KPIs, RechartsWidget for most charts, NivoWidget for heatmap/treemap/sunburst
5. Config: format (currency/percent/number for KPI), colorScheme (for nivo)

Return ONLY valid JSON with no markdown fences:
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
  "totalRows": 4
}`;

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType = "image/jpeg" } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "imageBase64 required" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured on server" },
        { status: 503 }
      );
    }

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
                data: imageBase64,
              },
            },
            { type: "text", text: USER_PROMPT },
          ],
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Could not parse analysis result" }, { status: 422 });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
