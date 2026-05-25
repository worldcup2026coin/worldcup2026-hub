$ErrorActionPreference = "Stop"

$excludeDirPattern = "\\(node_modules|\.git|\.next|dist|build|coverage|\.vercel)\\"
$excludeFiles = @("package-lock.json", "pnpm-lock.yaml", "yarn.lock")
$extensions = @(".ts", ".tsx", ".js", ".jsx", ".md", ".mdx", ".json", ".css", ".html")

$files = Get-ChildItem -Recurse -File |
  Where-Object {
    $_.FullName -notmatch $excludeDirPattern -and
    $excludeFiles -notcontains $_.Name -and
    $extensions -contains $_.Extension
  }

$unsafeCopyTerms = @(
  "guarantee",
  "guaranteed",
  "banker",
  "sure thing",
  "free money",
  "financial advice",
  "gambling advice",
  "presale",
  "token",
  "pump\.fun",
  "fundraising",
  "premium",
  "holder-gated",
  "wallet",
  "contract",
  "buy now"
)

# Keep "lock" separate because code often legitimately uses lock/locked.
$reviewTerms = @(
  "\block\b",
  "\blocked\b"
)

$keyLeakTerms = @(
  "API_FOOTBALL_KEY",
  "X-RapidAPI-Key",
  "x-rapidapi-key",
  "SUPABASE_SERVICE_ROLE_KEY",
  "service_role",
  "NEXT_PUBLIC_SUPABASE_SERVICE_ROLE",
  "NEXT_PUBLIC_API_FOOTBALL",
  "api-football"
)

Write-Host "Scanning unsafe public copy terms..." -ForegroundColor Cyan
$copyHits = foreach ($term in $unsafeCopyTerms) {
  $files | Select-String -Pattern $term -CaseSensitive:$false | ForEach-Object {
    [pscustomobject]@{
      Type = "UnsafeCopy"
      Term = $term
      Path = $_.Path
      Line = $_.LineNumber
      Text = $_.Line.Trim()
    }
  }
}

Write-Host "Scanning review terms..." -ForegroundColor Cyan
$reviewHits = foreach ($term in $reviewTerms) {
  $files | Select-String -Pattern $term -CaseSensitive:$false | ForEach-Object {
    [pscustomobject]@{
      Type = "NeedsReview"
      Term = $term
      Path = $_.Path
      Line = $_.LineNumber
      Text = $_.Line.Trim()
    }
  }
}

Write-Host "Scanning key/API exposure patterns in source..." -ForegroundColor Cyan
$keyHits = foreach ($term in $keyLeakTerms) {
  $files | Select-String -Pattern $term -CaseSensitive:$false | ForEach-Object {
    [pscustomobject]@{
      Type = "KeyOrApiReference"
      Term = $term
      Path = $_.Path
      Line = $_.LineNumber
      Text = $_.Line.Trim()
    }
  }
}

$allHits = @($copyHits) + @($reviewHits) + @($keyHits)

$csvPath = ".\launch\phase14-code-audit-results.csv"
$allHits | Export-Csv -NoTypeInformation -Path $csvPath

if ($allHits.Count -gt 0) {
  $allHits | Format-Table -AutoSize
  Write-Host ""
  Write-Host "Saved code audit results to $csvPath" -ForegroundColor Yellow
  Write-Host "Review every hit. Not every hit is automatically fatal, but public copy and client-side secrets are blockers." -ForegroundColor Yellow
} else {
  Write-Host "No risky terms found." -ForegroundColor Green
}

Write-Host ""
Write-Host "Scanning built client bundle for exposed secrets/API-Football references..." -ForegroundColor Cyan

if (-not (Test-Path ".\.next\static")) {
  Write-Host ".next/static not found. Run npm run build first." -ForegroundColor Red
  exit 1
}

$bundleFiles = Get-ChildItem ".\.next\static" -Recurse -File
$bundleHits = foreach ($term in $keyLeakTerms) {
  $bundleFiles | Select-String -Pattern $term -CaseSensitive:$false | ForEach-Object {
    [pscustomobject]@{
      Type = "ClientBundleRisk"
      Term = $term
      Path = $_.Path
      Line = $_.LineNumber
      Text = $_.Line.Trim()
    }
  }
}

$bundleCsvPath = ".\launch\phase14-client-bundle-audit-results.csv"
$bundleHits | Export-Csv -NoTypeInformation -Path $bundleCsvPath

if ($bundleHits.Count -gt 0) {
  $bundleHits | Format-Table -AutoSize
  Write-Host ""
  Write-Host "CLIENT BUNDLE AUDIT FAILED. API/secrets appear in browser-delivered files." -ForegroundColor Red
  exit 1
}

Write-Host "CLIENT BUNDLE AUDIT PASSED" -ForegroundColor Green
