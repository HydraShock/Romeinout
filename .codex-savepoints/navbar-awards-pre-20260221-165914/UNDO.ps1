param()
$ErrorActionPreference = 'Stop'
Copy-Item -Path "$PSScriptRoot\src\components\NavbarMarbleLuxury.tsx" -Destination "src\components\NavbarMarbleLuxury.tsx" -Force
Copy-Item -Path "$PSScriptRoot\src\styles\globals.css" -Destination "src\styles\globals.css" -Force
Write-Host "Undo complete: restored NavbarMarbleLuxury.tsx and globals.css"
