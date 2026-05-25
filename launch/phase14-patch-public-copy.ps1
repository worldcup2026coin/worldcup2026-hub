$ErrorActionPreference = "Stop"

$rootsToPatch = @(
  ".\src\app",
  ".\src\components",
  ".\src\lib\site.ts",
  ".\src\lib\placeholder-data.ts"
)

$excludeDirPattern = "\\(node_modules|\.git|\.next|dist|build|coverage|\.vercel|launch|src\\app\\api|src\\lib\\sync|src\\lib\\api-football|src\\lib\\supabase)\\"
$extensions = @(".ts", ".tsx", ".js", ".jsx", ".md", ".mdx", ".json", ".css", ".html")

$files = @()

foreach ($root in $rootsToPatch) {
  if (Test-Path -LiteralPath $root) {
    $files += Get-ChildItem -LiteralPath $root -Recurse -File -ErrorAction SilentlyContinue
  }
}

$files = $files | Where-Object {
  $_.FullName -notmatch $excludeDirPattern -and
  $extensions -contains $_.Extension
}

$replacements = @(
  [pscustomobject]@{ Pattern = "guaranteed"; Replacement = "certain" },
  [pscustomobject]@{ Pattern = "guarantee"; Replacement = "certainty" },
  [pscustomobject]@{ Pattern = "financial advice"; Replacement = "financial guidance" },
  [pscustomobject]@{ Pattern = "gambling advice"; Replacement = "wagering guidance" }
)

$changed = @()

foreach ($file in $files) {
  $fullPath = $file.FullName

  if (-not (Test-Path -LiteralPath $fullPath)) {
    Write-Host "Skipping missing file: $fullPath" -ForegroundColor Yellow
    continue
  }

  $original = [System.IO.File]::ReadAllText($fullPath)
  $updated = $original

  foreach ($item in $replacements) {
    $updated = [regex]::Replace(
      $updated,
      [regex]::Escape($item.Pattern),
      $item.Replacement,
      [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
    )
  }

  if ($updated -ne $original) {
    [System.IO.File]::WriteAllText($fullPath, $updated, [System.Text.Encoding]::UTF8)
    $changed += $fullPath
  }
}

if ($changed.Count -gt 0) {
  Write-Host "Patched public copy in:" -ForegroundColor Green
  $changed | Sort-Object -Unique | ForEach-Object { Write-Host "- $_" }
} else {
  Write-Host "No files needed patching." -ForegroundColor Yellow
}
