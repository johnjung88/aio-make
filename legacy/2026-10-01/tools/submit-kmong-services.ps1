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
  Write-Host "Submitting: $($Service.id) / $($Service.title)"

  $Code = @"
async (page) => {
  const serviceTitle = $TitleJson;
  await page.goto('https://kmong.com/my-gigs');
  await page.waitForLoadState('domcontentloaded');
  const title = page.getByRole('heading', { name: serviceTitle });
  await title.waitFor({ state: 'visible', timeout: 30000 });
  const card = title.locator('xpath=ancestor::div[3]');
  await card.getByRole('button', { name: '편집하기' }).click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2500);
  const loadDraft = page.getByRole('button', { name: '불러오기' });
  if (await loadDraft.count()) {
    await loadDraft.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2500);
  }
  const submit = page.getByRole('button', { name: '제출하기' });
  await submit.waitFor({ state: 'visible', timeout: 30000 });
  await submit.click();
  await page.waitForTimeout(5000);
  const body = await page.locator('body').innerText();
  return {
    title: serviceTitle,
    url: page.url(),
    submittedSignal: body.includes('제출') || body.includes('승인') || body.includes('심사'),
    tail: body.slice(-1200)
  };
}
"@
  $Code = [Regex]::Replace($Code, "\r?\n", " ")
  & npx --yes --package '@playwright/cli' playwright-cli run-code $Code
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to submit $($Service.id)"
  }
}
