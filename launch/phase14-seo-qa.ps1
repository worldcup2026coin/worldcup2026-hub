param(
  [Parameter(Mandatory=$true)]
  [string]$BaseUrl
)

$ErrorActionPreference = "Stop"
$BaseUrl = $BaseUrl.TrimEnd("/")

$results = @()

function Add-Result {
  param($Check, $Pass, $Detail)
  [pscustomobject]@{
    Check = $Check
    Pass = $Pass
    Detail = $Detail
  }
}

$sitemapUrl = "$BaseUrl/sitemap.xml"
$robotsUrl = "$BaseUrl/robots.txt"

$sitemap = Invoke-WebRequest -Uri $sitemapUrl -UseBasicParsing -TimeoutSec 30
$robots = Invoke-WebRequest -Uri $robotsUrl -UseBasicParsing -TimeoutSec 30

$sitemapContent = [string]$sitemap.Content
$robotsContent = [string]$robots.Content

$urls = [regex]::Matches($sitemapContent, "<loc>(.*?)</loc>") | ForEach-Object { $_.Groups[1].Value }

$requiredIncludes = @(
  "/",
  "/fixtures",
  "/live",
  "/groups",
  "/best-third-placed-teams",
  "/teams",
  "/predictions",
  "/news",
  "/top-scorers",
  "/top-assists",
  "/top-cards",
  "/privacy"
)

foreach ($path in $requiredIncludes) {
  $expected = "$BaseUrl$path"
  $found = $urls -contains $expected
  $results += Add-Result "Sitemap includes $path" $found $expected
}

$badPatterns = @(
  "/api/",
  "/admin",
  "/test",
  "/draft",
  "/debug",
  "/internal"
)

foreach ($pattern in $badPatterns) {
  $badUrls = $urls | Where-Object { $_ -match [regex]::Escape($pattern) }
  $results += Add-Result "Sitemap excludes $pattern" ($badUrls.Count -eq 0) (($badUrls -join ", "))
}

$robotsHasSitemap = $robotsContent -match [regex]::Escape("Sitemap: $sitemapUrl")
$results += Add-Result "Robots references sitemap" $robotsHasSitemap "Expected: Sitemap: $sitemapUrl"

$robotsDoesNotBlockAll = $robotsContent -notmatch "Disallow:\s*/\s*$"
$results += Add-Result "Robots does not block whole site" $robotsDoesNotBlockAll "No blanket Disallow: /"

$sampleUrls = @()
$sampleUrls += "$BaseUrl/"
$sampleUrls += ($urls | Where-Object { $_ -match "/teams/[^/]+$" } | Select-Object -First 1)
$sampleUrls += ($urls | Where-Object { $_ -match "/matches/[^/]+$" } | Select-Object -First 1)
$sampleUrls += ($urls | Where-Object { $_ -match "/players/[^/]+$" } | Select-Object -First 1)
$sampleUrls += "$BaseUrl/top-scorers"
$sampleUrls = $sampleUrls | Where-Object { $_ } | Select-Object -Unique

foreach ($url in $sampleUrls) {
  $page = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
  $html = [string]$page.Content

  $results += Add-Result "Canonical present: $url" ($html -match 'rel=["'']canonical["'']') $url
  $results += Add-Result "Open Graph present: $url" ($html -match 'property=["'']og:title["'']') $url
  $results += Add-Result "Twitter card present: $url" ($html -match 'name=["'']twitter:card["'']') $url
  $results += Add-Result "No noindex: $url" ($html -notmatch 'noindex') $url
}

$results | Format-Table -AutoSize

$csvPath = ".\launch\phase14-seo-qa-results.csv"
$results | Export-Csv -NoTypeInformation -Path $csvPath

$fails = $results | Where-Object { -not $_.Pass }

Write-Host ""
Write-Host "Saved SEO QA results to $csvPath"

if ($fails.Count -gt 0) {
  Write-Host ""
  Write-Host "SEO QA FAILED:" -ForegroundColor Red
  $fails | Format-Table -AutoSize
  exit 1
}

Write-Host ""
Write-Host "SEO QA PASSED" -ForegroundColor Green
