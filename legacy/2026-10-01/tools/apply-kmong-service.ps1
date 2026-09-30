param(
  [Parameter(Mandatory = $true)]
  [string]$ServiceId,

  [string]$DataPathOverride,

  [switch]$SkipImages,

  [switch]$Save
)

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$DataPath = if ($DataPathOverride) { Join-Path $Root $DataPathOverride } else { Join-Path $Root "docs\marketplace\kmong-upgrade-data.json" }
$Service = (Get-Content $DataPath -Raw -Encoding UTF8 | ConvertFrom-Json) | Where-Object { $_.id -eq $ServiceId } | Select-Object -First 1
if (-not $Service) {
  throw "Service '$ServiceId' not found."
}

function Invoke-Pw {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Code,
    [int]$TimeoutSeconds = 60
  )
  & npx --yes --package '@playwright/cli' playwright-cli run-code $Code
  if ($LASTEXITCODE -ne 0) {
    throw "playwright-cli failed"
  }
}

function Set-ClipboardText {
  param([string]$Text)
  Set-Clipboard -Value $Text
  Start-Sleep -Milliseconds 150
}

function Paste-IntoEditor {
  param([int]$Index, [string]$Text)
  Set-ClipboardText $Text
  Invoke-Pw "async (page)=>{const els=page.locator('[contenteditable=true]'); if((await els.count()) <= $Index) return null; const el=els.nth($Index); await el.scrollIntoViewIfNeeded(); await el.click(); await page.keyboard.press('Control+A'); await page.keyboard.press('Control+V'); return await el.innerText();}"
}

function Paste-IntoTextbox {
  param([string]$LocatorCode, [string]$Text)
  Set-ClipboardText $Text
  Invoke-Pw "async (page)=>{const el=$LocatorCode; await el.scrollIntoViewIfNeeded(); await el.click(); await page.keyboard.press('Control+A'); await page.keyboard.press('Control+V'); return await el.inputValue();}"
}

Paste-IntoEditor 0 $Service.description
Paste-IntoEditor 1 $Service.processText
Paste-IntoEditor 2 $Service.requestText

$RevisionText = $Service.revision + "`n`n수정은 합의된 작업 범위 안에서 진행합니다. 신규 페이지 추가, 전체 방향 변경, 신규 기능 개발, 촬영·대량 자료 정리, 외부 솔루션 고도화는 별도 견적으로 안내드립니다."
Invoke-Pw "async (page)=>{const ph=page.getByPlaceholder('수정 및 재진행 안내에 대해 입력해 주세요'); return await ph.count();}"
Paste-IntoTextbox "page.getByPlaceholder('수정 및 재진행 안내에 대해 입력해 주세요')" $RevisionText

$PackagesJson = $Service.packages | ConvertTo-Json -Depth 10 -Compress
Invoke-Pw "async (page)=>{const pkgs=$PackagesJson; const boxes=page.locator('section#price').getByRole('textbox'); for(let i=0;i<3;i++) await boxes.nth(i).fill(pkgs[i][1]); for(let i=0;i<3;i++) await boxes.nth(3+i).fill(pkgs[i][6]); for(let i=0;i<3;i++) await boxes.nth(6+i).fill(pkgs[i][2].replace('원','')); return await boxes.evaluateAll((els)=>els.slice(0,9).map(e=>e.value));}"

Invoke-Pw "async (page)=>{if(!(await page.getByPlaceholder('키워드를 입력해 주세요').count())) await page.getByRole('button',{name:/작성하면 수익을 높일 수 있어요/}).click(); return true;}"
$KeywordsJson = $Service.keywords | ConvertTo-Json -Compress
Invoke-Pw "async (page)=>{const kws=$KeywordsJson; const input=page.getByPlaceholder('키워드를 입력해 주세요'); for(const kw of kws.slice(0,5)){ if(await page.getByText(kw,{exact:true}).count()) continue; await input.fill(kw); await input.press('Enter'); await page.waitForTimeout(150);} return await page.getByRole('heading',{name:/검색 키워드/}).innerText();}"

$FaqsJson = $Service.faqs | Select-Object -First 4 | ConvertTo-Json -Depth 10 -Compress
Invoke-Pw "async (page)=>{const faqs=$FaqsJson; const sec=page.locator('#FAQ'); while((await sec.getByRole('textbox').count())<faqs.length*2){await sec.getByRole('button',{name:'추가',exact:true}).click(); await page.waitForTimeout(200);} const boxes=sec.getByRole('textbox'); for(let i=0;i<faqs.length;i++){await boxes.nth(i*2).fill(faqs[i][0]); await boxes.nth(i*2+1).fill(faqs[i][1]);} return await boxes.count();}"

$ItemsJson = $Service.requestItems | ConvertTo-Json -Depth 10 -Compress
Invoke-Pw "async (page)=>{const items=$ItemsJson; const sec=page.locator('#GIG_INSTRUCTION'); while((await sec.getByRole('textbox').count())<items.length){await sec.getByRole('button',{name:'추가',exact:true}).click(); await page.waitForTimeout(200);} const boxes=sec.getByRole('textbox'); for(let i=0;i<items.length;i++) await boxes.nth(i).fill(items[i]); return await boxes.count();}"

$MainImage = if ($Service.mainImages -and $Service.mainImages.Count -gt 0) { [string]$Service.mainImages[0] } else { Join-Path $Root "public\marketplace\$ServiceId-kmong-cover.png" }
if ((-not $SkipImages) -and (Test-Path $MainImage)) {
  $MainHeading = & npx --yes --package '@playwright/cli' playwright-cli run-code "async (page)=> await page.getByRole('heading',{name:/메인 이미지/}).innerText().catch(e=>'')"
  if ($MainHeading -match "\(0/") {
    & npx --yes --package '@playwright/cli' playwright-cli run-code "async (page)=>{const h=page.getByRole('heading',{name:/메인 이미지/}); const sec=h.locator('xpath=ancestor::div[contains(@class, `"min-h`")][1]'); const [fc]=await Promise.all([page.waitForEvent('filechooser'),sec.getByRole('button',{name:'추가',exact:true}).click()]); return 'chooser';}"
    & npx --yes --package '@playwright/cli' playwright-cli upload $MainImage
    Start-Sleep -Seconds 2
    & npx --yes --package '@playwright/cli' playwright-cli run-code "async (page)=>{const btn=page.getByRole('button',{name:'추가하기'}); if(await btn.count()){await btn.click(); await page.waitForTimeout(1500); return 'cropped';} return 'no-crop';}"
  }
}

$Custom = @($Service.addons | Where-Object { $_[0] -ne "빠른 작업" -and $_[1] -ne "기본 포함" } | Select-Object -First 3)
$AdditionalValues = New-Object System.Collections.Generic.List[string]
$Service.packages | ForEach-Object {
  $Amount = [int](($_[2] -replace '[^0-9]', ''))
  $Fast = [Math]::Max(10000, [Math]::Round(($Amount * 0.3) / 1000) * 1000)
  $AdditionalValues.Add($Fast.ToString("N0", [Globalization.CultureInfo]::GetCultureInfo("ko-KR")))
}
foreach ($Option in $Custom) {
  $AdditionalValues.Add([string]$Option[0])
  $AdditionalValues.Add([string]$Option[2])
  $AdditionalValues.Add(([string]$Option[1] -replace '원~','' -replace '원','' -replace '기본가의 30%~','30,000'))
}
$AdditionalJson = $AdditionalValues | ConvertTo-Json -Compress
$CustomCount = $Custom.Count
Invoke-Pw "async (page)=>{async function d(ms){await page.waitForTimeout(ms)} async function s(c,v){const h=await c.elementHandle(); if(!h)return; const b=await h.evaluate(el=>{const c=el.closest('.css-b62m3t-container')||el.parentElement; c.scrollIntoView({block:'center',inline:'center'}); const r=c.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};}); await page.mouse.click(b.x,b.y); await d(150); await page.getByRole('option',{name:String(v),exact:true}).click(); await d(150);} const add=page.getByRole('heading',{name:'추가 가격'}).locator('xpath=ancestor::div[contains(@class, `"min-h`")][1]'); if(!(await add.getByText('빠른 작업',{exact:true}).count())){await page.getByRole('button',{name:'빠른 작업'}).click(); await d(400);} while(Math.max(0,Math.floor(((await add.getByRole('textbox').count())-3)/3))<$CustomCount){await page.getByRole('button',{name:'맞춤 옵션 추가'}).click(); await d(300);} const vals=$AdditionalJson; const boxes=add.getByRole('textbox'); for(let i=0;i<vals.length;i++){await boxes.nth(i).fill(vals[i]); await d(50);} const combos=add.getByRole('combobox'); const days=[1,1,2,1,1,1]; const n=await combos.count(); for(let i=0;i<Math.min(days.length,n);i++) await s(combos.nth(i),days[i]); return await boxes.evaluateAll(els=>els.map(e=>e.value));}" 120

if (-not $SkipImages) {
  $ImagesJson = $Service.images | ConvertTo-Json -Compress
  Invoke-Pw "async (page)=>{const images=$ImagesJson; const inputs=page.locator('input[type=file]'); if(await inputs.count()>1){await inputs.nth(1).setInputFiles(images); await page.waitForTimeout(5000);} return await page.getByRole('heading',{name:/상세 이미지/}).innerText();}"
}

if ($Save) {
  & npx --yes --package '@playwright/cli' playwright-cli click "text=임시 저장하기"
}

Invoke-Pw "async (page)=>({service:'$ServiceId', editors:await page.locator('[contenteditable=true]').evaluateAll(els=>els.map(e=>e.innerText.length)), detail:await page.getByRole('heading',{name:/상세 이미지/}).innerText(), keywords:await page.getByRole('heading',{name:/검색 키워드/}).innerText().catch(e=>'none'), faq:await page.getByRole('heading',{name:/자주 묻는 질문/}).innerText().catch(e=>'none'), requestCount:await page.locator('#GIG_INSTRUCTION').getByRole('textbox').count(), revisionLen:await page.getByPlaceholder('수정 및 재진행 안내에 대해 입력해 주세요').inputValue().then(v=>v.length)})"
