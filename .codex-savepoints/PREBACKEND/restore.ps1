param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
)

$items = @(
  'server',
  'src',
  'public',
  'components',
  'lib',
  '.env',
  '.env.example',
  '.gitignore',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'components.json',
  'README.md'
)

foreach ($rel in $items) {
  $src = Join-Path $PSScriptRoot $rel
  $dst = Join-Path $ProjectRoot $rel
  if (-not (Test-Path $src)) {
    Write-Host "Skip missing backup: $rel" -ForegroundColor Yellow
    continue
  }

  $dstParent = Split-Path -Path $dst -Parent
  if ($dstParent -and -not (Test-Path $dstParent)) {
    New-Item -ItemType Directory -Path $dstParent -Force | Out-Null
  }

  if (Test-Path $src -PathType Container) {
    if (Test-Path $dst) {
      Remove-Item -Path $dst -Recurse -Force
    }
    Copy-Item -Path $src -Destination $dst -Recurse -Force
  } else {
    Copy-Item -Path $src -Destination $dst -Force
  }

  Write-Host "Restored: $rel" -ForegroundColor Green
}
