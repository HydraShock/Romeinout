param(
  [string]4ProjectRoot = (Resolve-Path (Join-Path 4PSScriptRoot '..\..')).Path
)

4files = @(
  'server/index.js',
  '.env.example',
  'package.json',
  'package-lock.json',
  'src/App.js'
)

foreach (4rel in 4files) {
  4src = Join-Path 4PSScriptRoot 4rel
  4dst = Join-Path 4ProjectRoot 4rel
  4dstDir = Split-Path -Path 4dst -Parent
  if (-not (Test-Path 4src)) {
    Write-Host "Skip missing backup: 4rel" -ForegroundColor Yellow
    continue
  }
  if (-not (Test-Path 4dstDir)) {
    New-Item -ItemType Directory -Path 4dstDir -Force | Out-Null
  }
  Copy-Item -Path 4src -Destination 4dst -Force
  Write-Host "Restored: 4rel" -ForegroundColor Green
}
