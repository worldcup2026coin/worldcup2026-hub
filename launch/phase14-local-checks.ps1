$ErrorActionPreference = "Stop"

Write-Host "Checking package scripts..." -ForegroundColor Cyan

$pkg = Get-Content ".\package.json" -Raw | ConvertFrom-Json
$scripts = $pkg.scripts.PSObject.Properties.Name

Write-Host "Available scripts:"
$scripts | ForEach-Object { Write-Host "- $_" }

Write-Host ""
Write-Host "Running npm install check..." -ForegroundColor Cyan
npm install

Write-Host ""
Write-Host "Running build..." -ForegroundColor Cyan
npm run build

if ($scripts -contains "lint") {
  Write-Host ""
  Write-Host "Running lint..." -ForegroundColor Cyan
  npm run lint
} else {
  Write-Host "No lint script found. SKIP." -ForegroundColor Yellow
}

if ($scripts -contains "typecheck") {
  Write-Host ""
  Write-Host "Running typecheck..." -ForegroundColor Cyan
  npm run typecheck
} elseif ($scripts -contains "type-check") {
  Write-Host ""
  Write-Host "Running type-check..." -ForegroundColor Cyan
  npm run type-check
} else {
  Write-Host "No typecheck script found. SKIP." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "LOCAL BUILD QA PASSED" -ForegroundColor Green
