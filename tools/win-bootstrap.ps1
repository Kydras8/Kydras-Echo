param([string]$ProjectRoot = "$PSScriptRoot\..")
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
try { node -v | Out-Null } catch { winget install --id OpenJS.NodeJS.LTS -e --source winget }
corepack enable | Out-Null
corepack prepare pnpm@9.10.0 --activate | Out-Null
Push-Location (Resolve-Path "$ProjectRoot")
pnpm install
if (-not (Test-Path "apps/web/.env")) { Copy-Item "apps/web/.env.example" "apps/web/.env" }
pnpm prisma:generate
pnpm prisma:migrate
pnpm dev
Pop-Location
