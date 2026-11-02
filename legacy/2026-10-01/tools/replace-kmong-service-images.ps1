param(
  [string[]]$ServiceIds = @(),
  [switch]$IncludeWebsite,
  [switch]$UsePublishedVersion
)

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$DataPath = Join-Path $Root "docs\marketplace\kmong-premium-data.json"
$Services = Get-Content $DataPath -Raw -Encoding UTF8 | ConvertFrom-Json

if ($ServiceIds.Count -gt 0) {
  $Services = @($Services | Where-Object { $ServiceIds -contains $_.id })
} elseif (-not $IncludeWebsite) {
  $Services = @($Services | Where-Object { $_.id -ne "website" })
}

function ConvertTo-JsJson {
  param($Value)
  return ($Value | ConvertTo-Json -Depth 20 -Compress)
}

foreach ($Service in $Services) {
  $TitleJson = ConvertTo-JsJson $Service.title
  $Cover = ([string]$Service.mainImages[0]).Replace("\", "/")
  $CoverJson = ConvertTo-JsJson $Cover
  $Images = @($Service.images | ForEach-Object { ([string]$_).Replace("\", "/") })
  $ImagesJson = ConvertTo-JsJson $Images

  Write-Host "Replacing images: $($Service.id) / $($Service.title)"

  $Code = @"
async (page) => {
  const serviceTitle = $TitleJson;
  const cover = $CoverJson;
  const images = $ImagesJson;
  async function pause(ms) { await page.waitForTimeout(ms); }
  async function getSection(title) {
    const heading = page.getByRole('heading', { name: new RegExp(title) });
    await heading.waitFor({ state: 'visible', timeout: 30000 });
    return heading.locator('xpath=ancestor::div[contains(@class,"min-h")][1]');
  }
  async function removeImages(section) {
    for (let guard = 0; guard < 12; guard++) {
      const del = section.getByRole('button', { name: '삭제' });
      const count = await del.count();
      if (!count) break;
      await del.nth(0).click();
      await pause(450);
    }
  }

  await page.goto('https://kmong.com/my-gigs');
  await page.waitForLoadState('domcontentloaded');
  const title = page.getByRole('heading', { name: serviceTitle });
  await title.waitFor({ state: 'visible', timeout: 30000 });
  const card = title.locator('xpath=ancestor::div[3]');
  await card.getByRole('button', { name: '편집하기' }).click();
  await page.waitForLoadState('domcontentloaded');
  await pause(2500);

  const loadDraft = page.getByRole('button', { name: '불러오기' });
  const cancelDraft = page.getByRole('dialog').getByRole('button', { name: '취소' });
  if (await loadDraft.count()) {
    if ($($UsePublishedVersion.IsPresent.ToString().ToLowerInvariant())) {
      await cancelDraft.click();
    } else {
      await loadDraft.click();
    }
    await page.waitForLoadState('domcontentloaded');
    await pause(2500);
  }

  const mainSection = await getSection('메인 이미지');
  await removeImages(mainSection);
  await page.locator('input[type=file]').nth(0).setInputFiles(cover);
  await pause(2200);
  const cropButton = page.getByRole('button', { name: '추가하기' });
  if (await cropButton.count()) {
    await cropButton.click();
    await pause(2200);
  }

  const detailSection = await getSection('상세 이미지');
  await removeImages(detailSection);
  await page.locator('input[type=file]').nth(1).setInputFiles(images);
  await pause(6500);

  await page.getByRole('button', { name: '임시 저장하기' }).click();
  await pause(4500);

  return {
    title: serviceTitle,
    url: page.url(),
    main: await page.getByRole('heading', { name: /메인 이미지/ }).innerText(),
    detail: await page.getByRole('heading', { name: /상세 이미지/ }).innerText(),
    saved: (await page.locator('body').innerText()).includes('저장')
  };
}
"@

  $Code = [Regex]::Replace($Code, "\r?\n", " ")

  if ($env:KMONG_DEBUG_CODE -eq "1") {
    $DebugPath = Join-Path $Root ".tmp-kmong-replace-code.js"
    Set-Content -Path $DebugPath -Value $Code -Encoding UTF8
    Write-Host "Wrote debug code to $DebugPath"
  }

  & npx --yes --package '@playwright/cli' playwright-cli run-code $Code
  if ($LASTEXITCODE -ne 0) {
    throw "Failed replacing images for $($Service.id)"
  }
}
