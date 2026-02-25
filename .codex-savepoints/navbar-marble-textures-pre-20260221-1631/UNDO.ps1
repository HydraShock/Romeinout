$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
Copy-Item -Path (Join-Path $PSScriptRoot 'src\styles\globals.css') -Destination (Join-Path $repoRoot 'src\styles\globals.css') -Force
