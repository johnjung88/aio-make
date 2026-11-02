param(
  [string[]]$ServiceIds = @("logo-business-card", "detail-page", "automation-app", "video-content")
)

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Services = Get-Content (Join-Path $Root "docs\marketplace\kmong-premium-data.json") -Raw -Encoding UTF8 | ConvertFrom-Json
$Services = @($Services | Where-Object { $ServiceIds -contains $_.id })

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

function Set-ClipboardText($Text) {
  Set-Clipboard -Value $Text
  Start-Sleep -Milliseconds 150
}

foreach ($Service in $Services) {
  Write-Host "Submitting remaining service: $($Service.id) / $($Service.title)"

  $TitleJson = Json $Service.title
  $ProcessText = ($Service.processText + "`n6. 작업 범위, 수정 기준, 납품 형태를 마지막으로 확인한 뒤 크몽 메시지 안에서 결과물을 전달합니다.")
  $RevisionText = ($Service.revision + "`n`n수정 가능 범위는 처음 합의한 작업 내용 안에서 진행합니다. 오탈자 수정, 문구 변경, 이미지 교체, 단순 배치 조정은 패키지별 수정 횟수 안에서 반영합니다. 새로운 화면 구성, 기능 추가, 전체 방향 변경, 자료 추가 정리, 외부 서비스 연동은 기존 범위를 넘어서는 작업으로 별도 협의가 필요합니다.")
  $RevisionJson = Json $RevisionText

  Invoke-Code @"
async(p)=>{const t=$TitleJson;await p.goto('https://kmong.com/my-gigs');await p.waitForLoadState('domcontentloaded');const h=p.getByRole('heading',{name:t});await h.waitFor({state:'visible',timeout:30000});await h.locator('xpath=ancestor::div[3]').getByRole('button',{name:'편집하기'}).click();await p.waitForLoadState('domcontentloaded');await p.waitForTimeout(1800);const b=p.getByRole('button',{name:'불러오기'});if(await b.count()){await b.click();await p.waitForLoadState('domcontentloaded');await p.waitForTimeout(1800)}return{opened:t,url:p.url()}}
"@

  Set-ClipboardText $ProcessText
  Invoke-Code @"
async(p)=>{const eds=p.locator('[contenteditable=true]');const count=await eds.count();if(count>1){const ed=eds.nth(1);await ed.click();await p.keyboard.press('Control+A');await p.keyboard.press('Control+V');await p.waitForTimeout(500);return{editorCount:count,processLen:(await ed.innerText()).length,process:(await ed.innerText()).slice(0,100)}}return{editorCount:count,processLen:0,process:'not-applicable'}}
"@

  Invoke-Code @"
async(p)=>{const rev=$RevisionJson;const ta=p.locator('textarea[name="REVISION.valueData.revision"]');if(await ta.count()){await ta.click();await p.keyboard.press('Control+A');await ta.fill(rev)}const tas=p.locator('textarea');const vals=await tas.evaluateAll((els)=>els.map((e,i)=>({i,name:e.name,val:e.value,len:e.value.length})));for(const item of vals){if(item.name===''&&item.len>0&&item.len<20){await tas.nth(item.i).fill(item.val+' 세부 범위 상담 후 확정')}}return{revisionLen:await ta.inputValue().then(v=>v.length).catch(e=>0),shorts:(await tas.evaluateAll((els)=>els.map((e,i)=>({i,name:e.name,len:e.value.length})).filter(x=>x.name===''&&x.len>0&&x.len<20))).length}}
"@

  Invoke-Code @"
async(p)=>{async function z(ms){await p.waitForTimeout(ms)}async function xy(c){const h=await c.elementHandle();if(!h)return null;return await h.evaluate(e=>{const q=e.closest('.css-b62m3t-container')||e.parentElement;q.scrollIntoView({block:'center',inline:'center'});const r=q.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}})}const sec=p.locator('#GIG_INSTRUCTION'),cs=sec.getByRole('combobox'),n=await cs.count();for(let i=0;i<n;i++){const b=await xy(cs.nth(i));if(!b)continue;await p.mouse.click(b.x,b.y);await z(180);const o=p.getByRole('option',{name:'서술형',exact:true});if(await o.count())await o.click();else await p.keyboard.press('Escape');await z(120)}return{requestSelected:(await sec.innerText()).split('서술형').length-1,requestCombos:n}}
"@

  Invoke-Code @"
async(p)=>{await p.getByRole('button',{name:'제출하기'}).click();await p.waitForTimeout(3500);let body=await p.locator('body').innerText();let buttons=p.getByRole('button',{name:'제출하기'});if(body.includes('마지막으로 한 번만 더 점검')&&(await buttons.count())>1){await buttons.nth(1).click();await p.waitForTimeout(7000);body=await p.locator('body').innerText()}return{url:p.url(),complete:body.includes('제출이 완료되었어요'),errors:['최소 50자','선택해주세요','입력해주세요','답변유형을 선택해 주세요','최소 20자 이상 입력해 주세요'].filter(x=>body.includes(x)),tail:body.slice(-500)}}
"@
}
