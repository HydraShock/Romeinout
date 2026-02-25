param()
$ErrorActionPreference = 'Stop'
Copy-Item -Path "$PSScriptRoot\src\App.js" -Destination "src\App.js" -Force
Copy-Item -Path "$PSScriptRoot\src\App.css" -Destination "src\App.css" -Force
$newAsset = "public\assets\cta-pronto-vivere-roma-bg.png"
if (Test-Path $newAsset) {
  Remove-Item -Path $newAsset -Force
}
Write-Host "Undo complete: restored App.js/App.css and removed CTA background asset"
