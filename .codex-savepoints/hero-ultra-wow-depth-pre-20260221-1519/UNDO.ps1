$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')

Copy-Item -Path (Join-Path $PSScriptRoot 'src\App.js') -Destination (Join-Path $repoRoot 'src\App.js') -Force
Copy-Item -Path (Join-Path $PSScriptRoot 'src\App.css') -Destination (Join-Path $repoRoot 'src\App.css') -Force

$legacyAtmosphere = Join-Path $PSScriptRoot 'src\components\HeroAtmosphere.jsx'
if (Test-Path $legacyAtmosphere) {
  Copy-Item -Path $legacyAtmosphere -Destination (Join-Path $repoRoot 'src\components\HeroAtmosphere.jsx') -Force
}

$heroUltraWow = Join-Path $repoRoot 'src\components\HeroUltraWow.tsx'
if (Test-Path $heroUltraWow) {
  Remove-Item -Path $heroUltraWow -Force
}
