import { app, desktopCapturer } from "electron";
import fs from "node:fs";
import path from "node:path";

export async function captureScreenshot() {
  const sources = await desktopCapturer.getSources({
    types: ["screen"],
    thumbnailSize: {
      width: 1920,
      height: 1080,
    },
  });

  if (sources.length === 0) {
    throw new Error("No screen found");
  }

  const source = sources[0];
  const image = source.thumbnail;
  const screenshotsDir = path.join(app.getPath("userData"), "screenshots");

  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, {
      recursive: true,
    });
  }

  const capturedAt = new Date();
  const filename = `screenshot-${Date.now()}.png`;
  const filePath = path.join(screenshotsDir, filename);

  fs.writeFileSync(filePath, image.toPNG());

  console.log("Screenshot saved:", filePath);

  return {
    filename,
    filePath,
    capturedAt: capturedAt.toISOString(),
  };
}
