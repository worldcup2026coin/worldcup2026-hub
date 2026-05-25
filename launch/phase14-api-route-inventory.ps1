$ErrorActionPreference = "Stop"

$possibleRoots = @(
  ".\src\app\api",
  ".\app\api"
)

$apiRoot = $possibleRoots | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $apiRoot) {
  Write-Host "No app/api route folder found." -ForegroundColor Red
  exit 1
}

Write-Host "Scanning API routes under $apiRoot" -ForegroundColor Cyan

$apiRoutes = Get-ChildItem $apiRoot -Recurse -File -Filter "route.*" -ErrorAction SilentlyContinue

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
Write-Host "Saved API route inventory to $csvPath" -ForegroundColor Green
