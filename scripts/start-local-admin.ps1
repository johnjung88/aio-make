$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath (Split-Path -Parent $PSScriptRoot)
$env:LOCAL_ADMIN_ENABLED = 'true'
$env:LOCAL_DATA_DIR = 'I:\AIO_OS\01_WORK\00_공통운영\00_AIO 웹사이트\00_운영관리\문의관리'
$env:NEXT_PUBLIC_SITE_URL = 'http://127.0.0.1:3111'
$env:NEXT_PUBLIC_GA_ID = ''
Write-Host '로컬 관리자: http://127.0.0.1:3111/admin'
node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3111
