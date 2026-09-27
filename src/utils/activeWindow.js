import { activeWindow } from "get-windows";

export async function getCurrentActiveWindow() {
  return await activeWindow();
}

export function getPlatform() {
  return process.platform;
}

const BROWSERS = [
  "chrome",
  "chromium",
  "edge",
  "firefox",
  "brave",
  "opera",
  "safari",
];

export function isBrowser(window) {
  const name = window?.owner?.name?.toLowerCase() || "";

  return BROWSERS.some((browser) =>
    name.includes(browser)
  );
}

export function extractWebsiteFromTitle(title) {

  if (!title) {
    return null;
  }
  const match = title.match(
    /(?:[-|]\s*)([a-zA-Z0-9-]+\.(?:com|net|org|io|dev|ai|co|me|tv))/
  );

  return match ? match[1].toLowerCase() : null;
}