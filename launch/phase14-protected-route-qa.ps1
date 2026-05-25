param(
  [Parameter(Mandatory=$true)]
  [string]$BaseUrl
)

$ErrorActionPreference = "Stop"
$BaseUrl = $BaseUrl.TrimEnd("/")

$tests = @(
  "/api/cron/bootstrap-sync",
  "/api/cron/top-stats-sync",
  "/api/cron/live-sync"
)

$results = foreach ($route in $tests) {
  $url = "$BaseUrl$route"

  try {
    $response = Invoke-WebRequest `
      -Uri $url `
      -Method GET `
      -Headers @{ Authorization = "Bearer definitely-wrong-secret" } `
      -UseBasicParsing `
      -TimeoutSec 30

    [pscustomobject]@{
      Route = $route
      Status = [int]$response.StatusCode
      Expected = "401"
      Result = "FAIL"
    }
  }
  catch {
    $status = $null
    if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
      $status = [int]$_.Exception.Response.StatusCode
    }

    [pscustomobject]@{
      Route = $route
      Status = $status
      Expected = "401"
      Result = if ($status -eq 401) { "PASS" } else { "FAIL" }
    }
  }
}

$results | Format-Table -AutoSize

$csvPath = ".\launch\phase14-protected-route-results.csv"
$results | Export-Csv -NoTypeInformation -Path $csvPath

$fails = $results | Where-Object { $_.Result -eq "FAIL" }

if ($fails.Count -gt 0) {
  Write-Host ""
  Write-Host "PROTECTED ROUTE QA FAILED" -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "PROTECTED ROUTE QA PASSED" -ForegroundColor Green
