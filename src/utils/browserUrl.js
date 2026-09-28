import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export async function getBrowserUrl(windowId) {
  if (process.platform !== "win32") {
    return null;
  }

  const script = `
$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName UIAutomationClient, UIAutomationTypes

$AE = [System.Windows.Automation.AutomationElement]
$descendants = [System.Windows.Automation.TreeScope]::Descendants
$valuePattern = [System.Windows.Automation.ValuePattern]::Pattern
$editType = [System.Windows.Automation.ControlType]::Edit

$win = $AE::FromHandle(
  [System.IntPtr]([int64]${windowId})
)

if ($null -eq $win) {
  exit 2
}

$byEdit = New-Object System.Windows.Automation.PropertyCondition(
  $AE::ControlTypeProperty,
  $editType
)

$edits = $win.FindAll($descendants, $byEdit)

for ($i = 0; $i -lt $edits.Count; $i++) {

  $element = $edits.Item($i)

  $pattern = $null

  if ($element.TryGetCurrentPattern(
    $valuePattern,
    [ref]$pattern
  )) {

    $value = $pattern.Current.Value

    if ($value) {
      [Console]::Out.WriteLine($value)
    }
  }
}
`;

  try {
    const { stdout } = await execFileAsync(
      "powershell.exe",
      ["-NoLogo", "-NoProfile", "-NonInteractive", "-Command", script],
      {
        windowsHide: true,
        timeout: 3000,
        maxBuffer: 256 * 1024,
        encoding: "utf8",
      },
    );

    return stdout;
  } catch (error) {
    console.error("Browser URL error:", error);
    return null;
  }
}
