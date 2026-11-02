# Claude 사용량 한도 도달 시 Codex Astra로 인계하는 실행 스크립트.
# 사용: pwsh -NoProfile -File start-codex-astra.ps1 [-DryRun]
# 1순위: Orca 워커(사용자가 Orca에서 진행을 볼 수 있음). 실패하면 2순위: 새 창에서 codex 대화형 실행.
param([switch]$DryRun)

$wt = "I:/AIO_OS/06_GITHUB/worktrees/aio-make/codex/WRK-20261013-AIO-CONTENT-RENEWAL"
$worktreeSelector = "id:a4d9cd9a-f0d5-4acc-8324-a1ca4717901a::$wt"
$model = "gpt-6-astra"
$effort = "high"
$prompt = "docs/renewal-2026-10-13/CODEX_ASTRA_HANDOFF.md 를 먼저 끝까지 읽고 그 지침대로 이어서 진행하라. Claude 사용량 한도로 Codex Astra가 인수했다. push와 배포는 하지 마라."

if ($DryRun) {
  "[DryRun] orca orchestration worker-start --spec <prompt> --worktree $worktreeSelector --agent codex --model $model --effort $effort --json"
  "[DryRun] fallback: codex -m $model -c model_reasoning_effort=$effort -C $wt <prompt>"
  exit 0
}

$started = $false
if (Get-Command orca -ErrorAction SilentlyContinue) {
  $r = orca orchestration worker-start --spec $prompt --task-title "Codex Astra 인계 (Claude 한도)" --worktree $worktreeSelector --agent codex --model $model --effort $effort --json 2>$null | ConvertFrom-Json
  if ($r.ok) {
    $started = $true
    "Orca worker started: dispatch=$($r.result.dispatchId) state=$($r.result.state)"
    Start-Sleep 6
    # 붙여넣기만 되고 Enter가 안 눌리는 경우가 있어 한 번 제출한다.
    $rr = orca orchestration worker-read --dispatch $r.result.dispatchId --limit 8 --json 2>$null | ConvertFrom-Json
    if (($rr.result.terminal.tail -join "`n") -match "Pasted Content") {
      orca terminal send --terminal $rr.result.terminal.handle --enter --json 2>$null | Out-Null
      "submitted pending prompt"
    }
  }
}

if (-not $started) {
  "Orca unavailable or failed; opening Codex in a new window"
  $promptFile = Join-Path $env:TEMP "codex_astra_prompt.txt"
  [IO.File]::WriteAllText($promptFile, $prompt, (New-Object Text.UTF8Encoding $false))
  Start-Process pwsh -WorkingDirectory $wt -ArgumentList @("-NoExit", "-Command", "codex -m $model -c model_reasoning_effort=$effort -C '$wt' (Get-Content -Raw -Encoding utf8 '$promptFile')")
}
