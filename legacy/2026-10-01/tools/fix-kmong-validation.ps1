param(
  [string[]]$ServiceIds = @()
)

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Services = Get-Content (Join-Path $Root "docs\marketplace\kmong-premium-data.json") -Raw -Encoding UTF8 | ConvertFrom-Json
if ($ServiceIds.Count -gt 0) {
  $Services = @($Services | Where-Object { $ServiceIds -contains $_.id })
}

function Json($Value) {
  return ($Value | ConvertTo-Json -Depth 20 -Compress)
}

foreach ($Service in $Services) {
  $TitleJson = Json $Service.title
  $Custom = @($Service.addons | Where-Object { $_[0] -ne "빠른 작업" -and $_[1] -ne "기본 포함" } | Select-Object -First 4)
  $Rows = @()
  foreach ($Option in $Custom) {
    $Rows += ,@([string]$Option[0], [string]$Option[2], (([string]$Option[1]) -replace '원~','' -replace '원','' -replace '기본가의 30%~','30000' -replace '범위 협의','100000'))
  }
  while ($Rows.Count -lt 4) {
    $Rows += ,@("추가 옵션", "작업 범위 확인 후 협의", "30000")
  }
  $RowsJson = Json $Rows

  Write-Host "Fixing validation: $($Service.id) / $($Service.title)"

  $Code = @"
async (page) => {
  const serviceTitle = $TitleJson;
  const rows = $RowsJson;
  async function pause(ms) { await page.waitForTimeout(ms); }
  async function openService() {
    await page.goto('https://kmong.com/my-gigs');
    await page.waitForLoadState('domcontentloaded');
    const title = page.getByRole('heading', { name: serviceTitle });
    await title.waitFor({ state: 'visible', timeout: 30000 });
    const card = title.locator('xpath=ancestor::div[3]');
    await card.getByRole('button', { name: '편집하기' }).click();
    await page.waitForLoadState('domcontentloaded');
    await pause(2500);
    const loadDraft = page.getByRole('button', { name: '불러오기' });
    if (await loadDraft.count()) {
      await loadDraft.click();
      await page.waitForLoadState('domcontentloaded');
      await pause(2500);
    }
  }
  async function choose(combo, optionName) {
    const h = await combo.elementHandle();
    if (!h) return false;
    const box = await h.evaluate(el => {
      const parent = el.closest('.css-b62m3t-container') || el.parentElement;
      parent.scrollIntoView({ block: 'center', inline: 'center' });
      const r = parent.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    await page.mouse.click(box.x, box.y);
    await pause(250);
    const option = page.getByRole('option', { name: optionName, exact: true });
    if (await option.count()) {
      await option.click();
      await pause(250);
      return true;
    }
    await page.keyboard.press('Escape');
    return false;
  }

  await openService();

  const instruction = page.locator('#GIG_INSTRUCTION');
  const requestCombos = instruction.getByRole('combobox');
  const requestCount = await requestCombos.count();
  for (let i = 0; i < requestCount; i++) {
    await choose(requestCombos.nth(i), '서술형');
  }

  const add = page.getByRole('heading', { name: '추가 가격' }).locator('xpath=ancestor::div[contains(@class, "min-h")][1]');
  const boxes = add.getByRole('textbox');
  const boxCount = await boxes.count();
  for (let i = 0; i < Math.min(boxCount, rows.length * 3); i++) {
    const row = rows[Math.floor(i / 3)];
    await boxes.nth(i).fill(String(row[i % 3]));
    await pause(80);
  }
  const addCombos = add.getByRole('combobox');
  const comboCount = await addCombos.count();
  for (let i = 0; i < comboCount; i++) {
    await choose(addCombos.nth(i), '1');
  }

  await page.getByRole('button', { name: '임시 저장하기' }).click();
  await pause(3500);
  const body = await page.locator('body').innerText();
  return {
    title: serviceTitle,
    requestTypes: await instruction.getByRole('combobox').count(),
    addBoxes: boxCount,
    addCombos: comboCount,
    saved: body.includes('저장')
  };
}
"@
  $Code = [Regex]::Replace($Code, "\r?\n", " ")
  & npx --yes --package '@playwright/cli' playwright-cli run-code $Code
  if ($LASTEXITCODE -ne 0) {
    throw "Failed validation fix for $($Service.id)"
  }
}
