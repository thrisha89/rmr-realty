<#
  start-dev.ps1
  Starts BOTH the RMR Realty backend (port 4000) and frontend (port 5173)
  in separate PowerShell windows, so you never accidentally run only one
  of them again.

  Usage:
    1. Save this file in your project root, next to /backend and /frontend
       (the same folder as README.md).
    2. Right-click -> "Run with PowerShell", OR open a terminal in that
       folder and run:  .\start-dev.ps1
    3. If Windows blocks the script the first time, run this once in an
       elevated PowerShell:  Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
#>

$root = if ($PSScriptRoot) { $PSScriptRoot } else { Get-Location }
$backend  = Join-Path $root "backend"
$frontend = Join-Path $root "frontend"

if (-not (Test-Path $backend))  { Write-Host "Can't find '$backend'. Run this script from your project root." -ForegroundColor Red; exit 1 }
if (-not (Test-Path $frontend)) { Write-Host "Can't find '$frontend'. Run this script from your project root." -ForegroundColor Red; exit 1 }

# --- Backend: install deps / .env / db if this is the first run ---
if (-not (Test-Path (Join-Path $backend "node_modules"))) {
    Write-Host "Installing backend dependencies (first run only)..." -ForegroundColor Yellow
    Push-Location $backend
    npm install
    Pop-Location
}
if (-not (Test-Path (Join-Path $backend ".env"))) {
    Write-Host "No backend/.env found — copying from .env.example. Edit it to set a real ADMIN_PASSWORD." -ForegroundColor Yellow
    Copy-Item (Join-Path $backend ".env.example") (Join-Path $backend ".env")
}
if (-not (Test-Path (Join-Path $backend "data\dev.db"))) {
    Write-Host "No database found — running migrations + seed (first run only)..." -ForegroundColor Yellow
    Push-Location $backend
    npm run db:migrate
    npm run db:seed
    Pop-Location
}

# --- Frontend: install deps if missing ---
if (-not (Test-Path (Join-Path $frontend "node_modules"))) {
    Write-Host "Installing frontend dependencies (first run only)..." -ForegroundColor Yellow
    Push-Location $frontend
    npm install
    Pop-Location
}

Write-Host "Starting backend (http://localhost:4000) ..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$backend`"; npm run dev"

Start-Sleep -Seconds 2

Write-Host "Starting frontend (http://localhost:5173) ..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$frontend`"; npm run dev"

Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "Both servers are starting in their own windows. Keep BOTH windows open while you work." -ForegroundColor Green
Write-Host "Backend window must stay open too -- closing it is what causes the blank-page issue." -ForegroundColor Green
