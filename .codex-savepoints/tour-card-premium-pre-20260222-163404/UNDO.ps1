param()
$ErrorActionPreference = 'Stop'
Copy-Item -Path "$PSScriptRoot\src\App.js" -Destination "src\App.js" -Force
$newComponent = "src\components\PremiumTourCard.jsx"
if (Test-Path $newComponent) {
  Remove-Item -Path $newComponent -Force
}
Write-Host "Undo complete: restored App.js and removed PremiumTourCard.jsx"
