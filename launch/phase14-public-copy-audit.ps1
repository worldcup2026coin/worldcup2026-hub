$ErrorActionPreference = "Stop"

$rootsToScan = @(
  ".\src\app",
  ".\src\components",
  ".\src\lib\site.ts",
  ".\src\lib\placeholder-data.ts"
)

$excludeDirPattern = "\\(node_modules|\.git|\.next|dist|build|coverage|\.vercel|launch|src\\app\\api|src\\lib\\sync|src\\lib\\api-football|src\\lib\\supabase)\\"
$extensions = @(".ts", ".tsx", ".js", ".jsx", ".md", ".mdx", ".json", ".css", ".html")

$collectedFiles = @()

foreach ($root in $rootsToScan) {
  if (Test-Path $root) {
    $collectedFiles += Get-ChildItem $root -Recurse -File -ErrorAction SilentlyContinue
  }
}

$files = $collectedFiles | Where-Object {
  $_.FullName -notmatch $excludeDirPattern -and
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

$hits = @()

foreach ($term in $unsafeCopyTerms) {
  $hits += $files | Select-String -Pattern $term -CaseSensitive:$false | ForEach-Object {
    [pscustomobject]@{
      Term = $term
      Path = $_.Path
      Line = $_.LineNumber
      Text = $_.Line.Trim()
    }
  }
}

$csvPath = ".\launch\phase14-public-copy-audit-results.csv"
$hits = $hits | Where-Object {
  -not (
    $_.Term -eq "guarantee" -and
    $_.Text -match "does not guarantee any outcome"
  )
}

$hits | Export-Csv -NoTypeInformation -Path $csvPath

if ($hits.Count -gt 0) {
  $hits | Format-Table -AutoSize
  Write-Host ""
  Write-Host "PUBLIC COPY AUDIT FAILED. Fix these before final launch pass." -ForegroundColor Red
  Write-Host "Saved to $csvPath" -ForegroundColor Yellow
  exit 1
}

Write-Host "PUBLIC COPY AUDIT PASSED" -ForegroundColor Green
