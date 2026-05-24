param(
  [string]$BaseUrl = "https://worldcup2026-hub.vercel.app"
)

$ErrorActionPreference = "Continue"

$routes = @(
  "/",
  "/fixtures",
  "/live",
  "/groups",
  "/teams",
  "/teams/mexico-16",
  "/matches/2026-06-11-mexico-vs-south-africa-1489369",
  "/predictions",
  "/predictions/2026-06-11-mexico-vs-south-africa-1489369",
  "/news",
  "/news/mexico-world-cup-2026-team-guide",
  "/news/category/team-guides",
  "/stadiums",
  "/community",
  "/privacy",
  "/terms",
  "/sitemap.xml",
  "/robots.txt"
)

Write-Host ""
Write-Host "Phase 9B live QA for $BaseUrl" -ForegroundColor Cyan
Write-Host "----------------------------------------"

$failures = @()

foreach ($route in $routes) {
  $url = "$BaseUrl$route"

  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -MaximumRedirection 5
    $status = [int]$response.StatusCode

    if ($status -ge 200 -and $status -lt 400) {
      Write-Host "OK   $status $route" -ForegroundColor Green
    } else {
      Write-Host "WARN $status $route" -ForegroundColor Yellow
      $failures += "$status $route"
    }
  } catch {
    Write-Host "FAIL      $route - $($_.Exception.Message)" -ForegroundColor Red
    $failures += "FAIL $route"
  }
}

Write-Host ""
Write-Host "SEO checks" -ForegroundColor Cyan
Write-Host "----------------------------------------"

try {
  $robots = Invoke-WebRequest -Uri "$BaseUrl/robots.txt" -UseBasicParsing
  if ($robots.Content -match "Sitemap: $BaseUrl/sitemap.xml") {
    Write-Host "OK   robots sitemap uses base URL" -ForegroundColor Green
  } else {
    Write-Host "FAIL robots sitemap does not use base URL" -ForegroundColor Red
    $failures += "robots sitemap mismatch"
  }

  if ($robots.Content -match "Disallow: /api/admin/") {
    Write-Host "OK   robots blocks admin routes" -ForegroundColor Green
  } else {
    Write-Host "FAIL robots missing admin disallow" -ForegroundColor Red
    $failures += "robots admin disallow missing"
  }
} catch {
  Write-Host "FAIL robots check failed" -ForegroundColor Red
  $failures += "robots failed"
}

try {
  $sitemap = Invoke-WebRequest -Uri "$BaseUrl/sitemap.xml" -UseBasicParsing
  foreach ($needle in @("/matches/", "/teams/", "/news/", "/predictions")) {
    if ($sitemap.Content -match [regex]::Escape($needle)) {
      Write-Host "OK   sitemap contains $needle" -ForegroundColor Green
    } else {
      Write-Host "WARN sitemap missing $needle" -ForegroundColor Yellow
      $failures += "sitemap missing $needle"
    }
  }
} catch {
  Write-Host "FAIL sitemap check failed" -ForegroundColor Red
  $failures += "sitemap failed"
}

Write-Host ""
Write-Host "Result" -ForegroundColor Cyan
Write-Host "----------------------------------------"

if ($failures.Count -eq 0) {
  Write-Host "PASS: No launch QA failures found." -ForegroundColor Green
  exit 0
}

Write-Host "CHECK: $($failures.Count) issue(s) found:" -ForegroundColor Yellow
$failures | ForEach-Object { Write-Host "- $_" -ForegroundColor Yellow }
exit 1
