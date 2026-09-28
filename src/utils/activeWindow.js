import { activeWindow } from "get-windows";
import { getBrowserUrl } from "./browserUrl";
import { extractWebsiteFromTitle } from "./linuxUrl";

export function getDomain(url) {
  try {
    return new URL(
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`
    ).hostname;
  } catch {
    return null;
  }
}

export function isBrowser(window) {
  const name = window?.owner?.name?.toLowerCase() || "";

  return BROWSERS.some((browser) =>
    name.includes(browser)
  );
}

export async function getCurrentActiveWindow() {
  const window = await activeWindow();
  if (!window) {
    return null;
  }
  const browser = isBrowser(window);

  if (!browser) {
    return window;
  }

  let url = null;

  // if (window) {
  //   const browserUrl = await getBrowserUrl(window.id);
  //   window.url = browserUrl;
  //   // console.log("BROWSER URL:", browserUrl);
  // }
  
  // Windows → UI Automation
  if (process.platform === "win32") {
    url = await getBrowserUrl(window.id);
  }

  // macOS → active-win/get-windows URL
  if (process.platform === "darwin") {
    url = window.url ?? null;
  }

    // Linux
  if (process.platform === "linux") {
    url = extractWebsiteFromTitle(window.title);
  }

  if (url) {
    window.url = getDomain(url);
  } else {
    window.url = null;
  }
  return window;
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

// export function extractWebsiteFromTitle(title) {

//   if (!title) {
//     return null;
//   }
//   const match = title.match(
//     /(?:[-|]\s*)([a-zA-Z0-9-]+\.(?:com|net|org|io|dev|ai|co|me|tv))/
//   );

//   return match ? match[1].toLowerCase() : null;
// }


