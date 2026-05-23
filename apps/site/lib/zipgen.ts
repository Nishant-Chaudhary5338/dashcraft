"use client";

import { generateProjectFiles, type WidgetConfig } from "./codegen";

export async function downloadProjectZip(
  widgets: WidgetConfig[],
  projectName = "my-dashboard"
): Promise<void> {
  const JSZip = (await import("jszip")).default;
  const { saveAs } = await import("file-saver");

  const zip = new JSZip();
  const files = generateProjectFiles(widgets, projectName);

  for (const [path, content] of Object.entries(files)) {
    zip.file(path, content);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${projectName}.zip`);
}
