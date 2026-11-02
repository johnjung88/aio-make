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

function Invoke-Code($Code) {
  $Flat = [Regex]::Replace($Code, "\r?\n", " ")
  $Output = & npx --yes --package '@playwright/cli' playwright-cli run-code $Flat 2>&1
  $Output | ForEach-Object { Write-Host $_ }
  if (($Output -join "`n") -match "### Error") {
    throw "playwright-cli returned an error"
  }
}

function Get-Days($Package) {
  $Text = [string]$Package[4]
  if ($Text -match '(\d+)') { return "$($Matches[1])일" }
  return "1일"
}

function Get-Revisions($Package) {
  $Text = [string]$Package[5]
  if ($Text -match '(\d+)') { return "$($Matches[1])회" }
  return "1회"
}

foreach ($Service in $Services) {
  Write-Host "Fixing category fields: $($Service.id) / $($Service.title)"

  $TitleJson = Json $Service.title
  $DaysJson = Json @($Service.packages | ForEach-Object { Get-Days $_ })
  $RevisionsJson = Json @($Service.packages | ForEach-Object { Get-Revisions $_ })

  $Custom = @($Service.addons | Where-Object { $_[0] -ne "상업적 이용 가능" } | Select-Object -First 4)
  $Rows = @()
  foreach ($Option in $Custom) {
    $Price = ([string]$Option[1]) -replace '기본가의 30%~','30000' -replace '범위 협의','100000' -replace '[^0-9]',''
    if ([string]::IsNullOrWhiteSpace($Price)) { $Price = "30000" }
    $Rows += ,@([string]$Option[0], [string]$Option[2], $Price)
  }
  while ($Rows.Count -lt 4) {
    $Rows += ,@("맞춤 옵션", "작업 범위 확인 후 협의", "30000")
  }
  $RowsJson = Json $Rows

  Invoke-Code @"
async(p)=>{const t=$TitleJson;await p.goto('https://kmong.com/my-gigs');await p.waitForLoadState('domcontentloaded');const h=p.getByRole('heading',{name:t});await h.waitFor({state:'visible',timeout:30000});await h.locator('xpath=ancestor::div[3]').getByRole('button',{name:'편집하기'}).click();await p.waitForLoadState('domcontentloaded');await p.waitForTimeout(1800);const b=p.getByRole('button',{name:'불러오기'});if(await b.count()){await b.click();await p.waitForLoadState('domcontentloaded');await p.waitForTimeout(1800)}return {opened:t,url:p.url()}}
"@

  Invoke-Code @"
async(p)=>{const ds=$DaysJson,rs=$RevisionsJson,isVideo=($TitleJson).includes('영상');async function z(ms){await p.waitForTimeout(ms)}async function xy(c){const h=await c.elementHandle();if(!h)return null;return await h.evaluate(e=>{const q=e.closest('.css-b62m3t-container')||e.parentElement;q.scrollIntoView({block:'center',inline:'center'});const r=q.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}})}async function opts(c){const b=await xy(c);if(!b)return[];await p.mouse.click(b.x,b.y);await z(200);const a=await p.getByRole('option').evaluateAll(es=>es.map(e=>e.textContent.trim()).filter(Boolean));await p.keyboard.press('Escape');await z(60);return a}async function pick(c,arr){const o=await opts(c),v=arr.find(x=>o.includes(x))||o[0];if(!v)return null;const b=await xy(c);await p.mouse.click(b.x,b.y);await z(200);const op=p.getByRole('option',{name:v,exact:true});if(await op.count()){await op.click();await z(130);return v}await p.keyboard.press('Escape');return null}const pr=p.locator('section#price'),bs=pr.getByRole('textbox');if(isVideo){const ex=['30','60','90'];for(let i=9;i<Math.min(await bs.count(),12);i++){if(!await bs.nth(i).inputValue().catch(e=>''))await bs.nth(i).fill(ex[i-9])}}let di=0,ri=0,ci=0;const cs=pr.getByRole('combobox'),n=await cs.count();for(let i=0;i<n;i++){const c=cs.nth(i),o=await opts(c);if(!o.length)continue;if(o.some(x=>/^\\d+일$/.test(x)))await pick(c,[ds[Math.min(di++,ds.length-1)]||'1일','1일']);else if(o.some(x=>/^\\d+회$/.test(x))||o.includes('제한없음'))await pick(c,[rs[Math.min(ri++,rs.length-1)]||'1회','1회','0회']);else if(o.some(x=>/^\\d+개$/.test(x))){const a=['1개','2개','3개'];await pick(c,[a[Math.min(ci++,2)],'1개'])}else if(o.includes('예'))await pick(c,['예']);else if(o.includes('제공'))await pick(c,['제공']);else if(o.some(x=>/^\\d+$/.test(x)))await pick(c,['1','0'])}const ins=p.locator('#GIG_INSTRUCTION'),rc=ins.getByRole('combobox'),rn=await rc.count();for(let i=0;i<rn;i++)await pick(rc.nth(i),['서술형']);return{priceCombos:n,requestCombos:rn}}
"@

  Invoke-Code @"
async(p)=>{const rows=$RowsJson;async function z(ms){await p.waitForTimeout(ms)}async function xy(c){const h=await c.elementHandle();if(!h)return null;return await h.evaluate(e=>{const q=e.closest('.css-b62m3t-container')||e.parentElement;q.scrollIntoView({block:'center',inline:'center'});const r=q.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}})}async function ch(c){const b=await xy(c);if(!b)return;await p.mouse.click(b.x,b.y);await z(180);const op=p.getByRole('option',{name:'1',exact:true});if(await op.count())await op.click();else await p.keyboard.press('Escape');await z(100)}const add=p.getByRole('heading',{name:'추가 가격'}).locator('xpath=ancestor::div[contains(@class, "min-h")][1]');for(let i=0;i<20;i++){const d=add.getByRole('button',{name:'삭제',exact:true}),n=await d.count();if(!n)break;await d.nth(n-1).click();await z(220)}for(let i=0;i<rows.length;i++){await add.getByRole('button',{name:'맞춤 옵션 추가',exact:true}).click();await z(220)}const bs=add.getByRole('textbox');for(let i=0;i<rows.length*3;i++){const r=rows[Math.floor(i/3)];await bs.nth(i).fill(String(r[i%3]));await z(50)}const cs=add.getByRole('combobox'),cn=await cs.count();for(let i=0;i<cn;i++)await ch(cs.nth(i));return{addonRows:rows.length,boxes:await bs.count(),combos:cn}}
"@

  Invoke-Code @"
async(p)=>{await p.getByRole('button',{name:'임시 저장하기'}).click();await p.waitForTimeout(3500);const body=await p.locator('body').innerText();return{saved:body.includes('저장'),url:p.url()}}
"@
}
