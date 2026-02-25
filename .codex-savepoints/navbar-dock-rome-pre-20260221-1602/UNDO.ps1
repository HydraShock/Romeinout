$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')

Copy-Item -Path (Join-Path $PSScriptRoot 'src\App.js') -Destination (Join-Path $repoRoot 'src\App.js') -Force

$dockTsx = Join-Path $repoRoot 'src\components\NavbarDockRome.tsx'
if (Test-Path $dockTsx) {
  Remove-Item -Path $dockTsx -Force
}

$dockCss = Join-Path $repoRoot 'src\components\NavbarDockRome.css'
if (Test-Path $dockCss) {
  Remove-Item -Path $dockCss -Force
}
