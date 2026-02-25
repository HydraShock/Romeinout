$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
Copy-Item -Path (Join-Path $PSScriptRoot 'src\App.js') -Destination (Join-Path $repoRoot 'src\App.js') -Force
Copy-Item -Path (Join-Path $PSScriptRoot 'src\styles\globals.css') -Destination (Join-Path $repoRoot 'src\styles\globals.css') -Force
$navFile = Join-Path $repoRoot 'src\components\NavbarMarbleLuxury.tsx'
if (Test-Path $navFile) { Remove-Item -Path $navFile -Force }
