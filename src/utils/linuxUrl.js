export function extractWebsiteFromTitle(title) {
  if (!title) {
    return null;
  }

  const normalized = title
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/^\(\d+\)\s*/, "")
    .trim();

  // Remove common browser names from the end.
  const withoutBrowser = normalized
    .replace(
      /\s*-\s*(Google Chrome|Chromium|Mozilla Firefox|Firefox|Microsoft Edge|Brave|Opera|Vivaldi|Safari)\s*$/i,
      ""
    )
    .trim();

  if (!withoutBrowser) {
    return null;
  }

  /*
    Example:

    "GitHub - Microsoft Edge"
          ↓
    "GitHub"

    "YouTube - Google Chrome"
          ↓
    "YouTube"

    "Stack Overflow - Firefox"
          ↓
    "Stack Overflow"
  */

  const parts = withoutBrowser
    .split(/\s[-|]\s/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return null;
  }

  return parts[0];
}