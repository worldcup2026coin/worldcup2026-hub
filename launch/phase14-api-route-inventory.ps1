$ErrorActionPreference = "Stop"

$apiRoutes = Get-ChildItem ".\app\api" -Recurse -File -Filter "route.*" -ErrorAction SilentlyContinue

if (-not $apiRoutes) {
  Write-Host "No app/api route files found." -ForegroundColor Yellow
  exit 0
}

$patterns = @(
  "CRON_SECRET",
  "SYNC_SECRET",
  "Authorization",
  "Bearer",
  "x-cron-secret",
  "x-sync-secret",
  "API_FOOTBALL",
  "api-football",
  "fixture",
  "sync",
  "log"
)

$hits = foreach ($pattern in $patterns) {
  $apiRoutes | Select-String -Pattern $pattern -CaseSensitive:$false | ForEach-Object {
    [pscustomobject]@{
      Pattern = $pattern
      Path = $_.Path
      Line = $_.LineNumber
      Text = $_.Line.Trim()
    }
  }
}

$csvPath = ".\launch\phase14-api-route-inventory.csv"
$hits | Export-Csv -NoTypeInformation -Path $csvPath

$hits | Format-Table -AutoSize

Write-Host ""
Write-Host "Saved API route inventory to $csvPath"
Write-Host "Use this to identify which routes must reject invalid secrets and which routes should not be hit repeatedly." -ForegroundColor Yellow
