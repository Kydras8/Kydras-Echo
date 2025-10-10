Set-StrictMode -Version Latest
$ErrorActionPreference = "SilentlyContinue"
Get-Process "Docker Desktop","com.docker.backend","com.docker.proxy" | Stop-Process -Force
Stop-Service com.docker.service -Force
wsl --shutdown
wsl --unregister docker-desktop 2>$null
wsl --unregister docker-desktop-data 2>$null
$cfg = "$env:APPDATA\Docker\settings.json"
Remove-Item $cfg -Force 2>$null
Start-Process "$Env:ProgramFiles\Docker\Docker\Docker Desktop.exe"
Start-Sleep 5
& "$Env:ProgramFiles\Docker\Docker\DockerCli.exe" -SwitchLinuxEngine
