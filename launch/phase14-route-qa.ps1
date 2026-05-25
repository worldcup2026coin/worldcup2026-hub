param(
  [Parameter(Mandatory=$true)]
  [string]$BaseUrl
)

$ErrorActionPreference = "Stop"

$BaseUrl = $BaseUrl.TrimEnd("/")
$results = @()

function Test-Url {
  param(
    [string]$Path,
    [bool]$Optional = $false
  )

  $url = if ($Path.StartsWith("http")) { $Path } else { "$BaseUrl$Path" }

  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -MaximumRedirection 5 -TimeoutSec 30
    $status = [int]$response.StatusCode
    $content = [string]$response.Content
    $length = $content.Length

    $badMarkers = @(
      "Application error",
      "Internal Server Error",
      "This page could not be found",
      "NEXT_NOT_FOUND",
      "<title>404",
      "<title>500",
      "Unhandled Runtime Error"
    )

    $hasBadMarker = $false
    foreach ($marker in $badMarkers) {
      if ($content -match [regex]::Escape($marker)) {
        $hasBadMarker = $true
      }
    }

    $isXmlOrTxt = $Path -match "sitemap\.xml|robots\.txt"
    $hasUsefulContent = if ($isXmlOrTxt) { $length -gt 20 } else { $length -gt 500 }
    $hasCanonical = if ($isXmlOrTxt) { $true } else { $content -match 'rel=["'']canonical["'']' }
    $hasOg = if ($isXmlOrTxt) { $true } else { $content -match 'property=["'']og:' }

    $pass = ($status -eq 200) -and $hasUsefulContent -and (-not $hasBadMarker)

    [pscustomobject]@{
      Path = $Path
      Url = $url
      Status = $status
      Length = $length
      UsefulContent = $hasUsefulContent
      Canonical = $hasCanonical
      OpenGraph = $hasOg
      BadMarker = $hasBadMarker
      Optional = $Optional
      Result = if ($pass) { "PASS" } elseif ($Optional -and $status -eq 404) { "SKIP_OPTIONAL" } else { "FAIL" }
    }
  }
  catch {
    $status = $null
    if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
      $status = [int]$_.Exception.Response.StatusCode
    }

    [pscustomobject]@{
      Path = $Path
      Url = $url
      Status = $status
      Length = 0
      UsefulContent = $false
      Canonical = $false
      OpenGraph = $false
      BadMarker = $true
      Optional = $Optional
      Result = if ($Optional -and $status -eq 404) { "SKIP_OPTIONAL" } else { "FAIL" }
    }
  }
}

$staticRoutes = @(
  "/",
  "/fixtures",
  "/live",
  "/groups",
  "/teams",
  "/predictions",
  "/news",
  "/community",
  "/top-scorers",
  "/top-assists",
  "/top-cards",
  "/privacy",
  "/sitemap.xml",
  "/robots.txt"
)

foreach ($route in $staticRoutes) {
  $results += Test-Url -Path $route
}

$results += Test-Url -Path "/stadiums" -Optional $true

# Terms or disclaimer: at least one must exist.
$termsResult = Test-Url -Path "/terms" -Optional $true
$disclaimerResult = Test-Url -Path "/disclaimer" -Optional $true

if ($termsResult.Result -eq "PASS") {
  $results += $termsResult
} elseif ($disclaimerResult.Result -eq "PASS") {
  $results += $disclaimerResult
} else {
  $results += $termsResult
  $results += $disclaimerResult
}

# Discover dynamic public URLs from sitemap.
try {
  $sitemap = Invoke-WebRequest -Uri "$BaseUrl/sitemap.xml" -UseBasicParsing -TimeoutSec 30
  $urls = [regex]::Matches($sitemap.Content, "<loc>(.*?)</loc>") | ForEach-Object { $_.Groups[1].Value }

  $teamUrl = $urls | Where-Object { $_ -match "/teams/[^/]+$" } | Select-Object -First 1
  $matchUrl = $urls | Where-Object { $_ -match "/matches/[^/]+$" } | Select-Object -First 1
  $playerUrl = $urls | Where-Object { $_ -match "/players/[^/]+$" } | Select-Object -First 1

  if ($teamUrl) { $results += Test-Url -Path $teamUrl } else { $results += [pscustomobject]@{ Path="/teams/[slug]"; Url="DISCOVERY_FAILED"; Status=$null; Length=0; UsefulContent=$false; Canonical=$false; OpenGraph=$false; BadMarker=$true; Optional=$false; Result="FAIL" } }
  if ($matchUrl) { $results += Test-Url -Path $matchUrl } else { $results += [pscustomobject]@{ Path="/matches/[slug]"; Url="DISCOVERY_FAILED"; Status=$null; Length=0; UsefulContent=$false; Canonical=$false; OpenGraph=$false; BadMarker=$true; Optional=$false; Result="FAIL" } }
  if ($playerUrl) { $results += Test-Url -Path $playerUrl } else { $results += [pscustomobject]@{ Path="/players/[slug]"; Url="DISCOVERY_FAILED"; Status=$null; Length=0; UsefulContent=$false; Canonical=$false; OpenGraph=$false; BadMarker=$true; Optional=$false; Result="FAIL" } }
}
catch {
  $results += [pscustomobject]@{ Path="dynamic sitemap discovery"; Url="$BaseUrl/sitemap.xml"; Status=$null; Length=0; UsefulContent=$false; Canonical=$false; OpenGraph=$false; BadMarker=$true; Optional=$false; Result="FAIL" }
}

$results | Format-Table -AutoSize

$csvPath = ".\launch\phase14-route-qa-results.csv"
$results | Export-Csv -NoTypeInformation -Path $csvPath

$failures = $results | Where-Object { $_.Result -eq "FAIL" }

Write-Host ""
Write-Host "Saved route QA results to $csvPath"

if ($failures.Count -gt 0) {
  Write-Host ""
  Write-Host "PHASE 14 ROUTE QA FAILED:" -ForegroundColor Red
  $failures | Format-Table -AutoSize
  exit 1
}

Write-Host ""
Write-Host "PHASE 14 ROUTE QA PASSED" -ForegroundColor Green
