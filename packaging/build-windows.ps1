# packaging\build-windows.ps1
param([switch]$Msix)
$ErrorActionPreference = "Stop"
if (!(Get-Command python -ErrorAction SilentlyContinue)) { throw "Python not found" }
python -m pip install --upgrade pip
pip install pyinstaller

# Build standalone EXE
pyinstaller --noconfirm --onefile --name KydrasEcho `
  --add-data "legacy/kydrasecho/gui/static;gui/static" `
  legacy/kydrasecho/gui/app.py

Write-Host "EXE at: dist\KydrasEcho.exe"

if ($Msix) {
  $manifest = @"
<?xml version="1.0" encoding="utf-8"?>
<Package xmlns="http://schemas.microsoft.com/appx/manifest/foundation/windows10" xmlns:uap="http://schemas.microsoft.com/appx/manifest/uap/windows10" IgnorableNamespaces="uap">
  <Identity Name="com.kydras.echo" Publisher="CN=KyleRasmussen" Version="1.0.0.0" />
  <Properties>
    <DisplayName>Kydras Echo</DisplayName>
    <PublisherDisplayName>Kydras Systems Inc.</PublisherDisplayName>
    <Logo>Assets\Square44x44Logo.png</Logo>
  </Properties>
  <Dependencies>
    <TargetDeviceFamily Name="Windows.Desktop" MinVersion="10.0.17763.0" MaxVersionTested="10.0.22621.0"/>
  </Dependencies>
  <Resources><Resource Language="en-us"/></Resources>
  <Applications>
    <Application Id="App" Executable="KydrasEcho.exe" EntryPoint="Windows.FullTrustApplication">
      <uap:VisualElements DisplayName="Kydras Echo" Square150x150Logo="Assets\Square150x150Logo.png" Description="AI Voice → Command Console" BackgroundColor="black"/>
    </Application>
  </Applications>
</Package>
"@
  New-Item -ItemType Directory -Force -Path "msix\Assets" | Out-Null
  Set-Content msix\AppxManifest.xml $manifest -Encoding UTF8
  Copy-Item dist\KydrasEcho.exe msix\KydrasEcho.exe -Force
  if (Get-Command makeappx.exe -ErrorAction SilentlyContinue) {
    & makeappx.exe pack /d msix /p KydrasEcho.msix /o
    Write-Host "MSIX at: KydrasEcho.msix"
  } else {
    Write-Warning "makeappx.exe not found (Windows SDK). EXE ready; MSIX skipped."
  }
}
