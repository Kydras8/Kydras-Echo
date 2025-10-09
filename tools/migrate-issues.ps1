# tools\migrate-issues.ps1
param(
  [string]$SourceRepo = "Kydras8/KydrasEcho",
  [string]$TargetRepo = "Kydras8/Kydras-Echo",
  [switch]$CloseSource = $true
)
$ErrorActionPreference = "Stop"
$issues = gh issue list -R $SourceRepo --state open --json number,title,body,labels,isPullRequest | ConvertFrom-Json | Where-Object { -not $_.isPullRequest }
foreach ($i in $issues) {
  $labels = @($i.labels | ForEach-Object { $_.name })
  $args = @("--title", $i.title, "--body", "(Migrated from $SourceRepo#$($i.number))`n`n$($i.body)")
  foreach ($l in $labels) { $args += @("--label", $l) }
  $newUrl = gh issue create -R $TargetRepo @args
  gh issue comment -R $SourceRepo $i.number --body "Moved to $newUrl"
  if ($CloseSource) { gh issue close -R $SourceRepo $i.number }
}
Write-Host "Done."
