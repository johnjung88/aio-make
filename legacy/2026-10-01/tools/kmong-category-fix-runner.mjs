import fs from 'node:fs/promises';
import path from 'node:path';

function packageDays(pkg) {
  const text = String(pkg[4] || '');
  const match = text.match(/(\d+)/);
  return match ? `${match[1]}일` : '1일';
}

function packageRevisions(pkg) {
  const text = String(pkg[5] || '');
  const match = text.match(/(\d+)/);
  return match ? `${match[1]}회` : '1회';
}

function addonRows(service) {
  const rows = service.addons
    .filter((item) => item[0] !== '상업적 이용 가능')
    .slice(0, 4)
    .map((item) => {
      let price = String(item[1] || '')
        .replace('기본가의 30%~', '30000')
        .replace('범위 협의', '100000')
        .replace(/[^0-9]/g, '');
      if (!price) price = '30000';
      return [String(item[0]), String(item[2]), price];
    });
  while (rows.length < 4) rows.push(['맞춤 옵션', '작업 범위 확인 후 협의', '30000']);
  return rows;
}

async function pause(page, ms) {
  await page.waitForTimeout(ms);
}

async function comboOptions(page, combo) {
  const handle = await combo.elementHandle();
  if (!handle) return [];
  const box = await handle.evaluate((el) => {
    const parent = el.closest('.css-b62m3t-container') || el.parentElement;
    parent.scrollIntoView({ block: 'center', inline: 'center' });
    const rect = parent.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  });
  await page.mouse.click(box.x, box.y);
  await pause(page, 220);
  const options = await page
    .getByRole('option')
    .evaluateAll((els) => els.map((el) => el.textContent.trim()).filter(Boolean));
  await page.keyboard.press('Escape');
  await pause(page, 80);
  return options;
}

async function chooseCombo(page, combo, candidates) {
  const handle = await combo.elementHandle();
  if (!handle) return null;
  const options = await comboOptions(page, combo);
  const pick = candidates.find((value) => options.includes(value)) || options[0];
  if (!pick) return null;
  const box = await handle.evaluate((el) => {
    const parent = el.closest('.css-b62m3t-container') || el.parentElement;
    parent.scrollIntoView({ block: 'center', inline: 'center' });
    const rect = parent.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  });
  await page.mouse.click(box.x, box.y);
  await pause(page, 220);
  const option = page.getByRole('option', { name: pick, exact: true });
  if (await option.count()) {
    await option.click();
    await pause(page, 160);
    return pick;
  }
  await page.keyboard.press('Escape');
  return null;
}

async function openService(page, serviceTitle) {
  await page.goto('https://kmong.com/my-gigs');
  await page.waitForLoadState('domcontentloaded');
  const title = page.getByRole('heading', { name: serviceTitle });
  await title.waitFor({ state: 'visible', timeout: 30000 });
  const card = title.locator('xpath=ancestor::div[3]');
  await card.getByRole('button', { name: '편집하기' }).click();
  await page.waitForLoadState('domcontentloaded');
  await pause(page, 1800);
  const loadDraft = page.getByRole('button', { name: '불러오기' });
  if (await loadDraft.count()) {
    await loadDraft.click();
    await page.waitForLoadState('domcontentloaded');
    await pause(page, 1800);
  }
}

export async function fix(page, root, serviceId) {
  const dataPath = path.join(root, 'docs', 'marketplace', 'kmong-premium-data.json');
  const services = JSON.parse(await fs.readFile(dataPath, 'utf8'));
  const service = services.find((item) => item.id === serviceId);
  if (!service) throw new Error(`Unknown service: ${serviceId}`);

  const days = service.packages.map(packageDays);
  const revisions = service.packages.map(packageRevisions);
  const rows = addonRows(service);

  await openService(page, service.title);

  const price = page.locator('section#price');
  const boxes = price.getByRole('textbox');
  const boxCount = await boxes.count();
  if (service.title.includes('영상')) {
    const extra = ['30', '60', '90'];
    for (let i = 9; i < Math.min(boxCount, 12); i += 1) {
      const value = await boxes.nth(i).inputValue().catch(() => '');
      if (!value) await boxes.nth(i).fill(extra[i - 9]);
    }
  }

  let dayIndex = 0;
  let revisionIndex = 0;
  let countIndex = 0;
  const combos = price.getByRole('combobox');
  const comboCount = await combos.count();
  for (let i = 0; i < comboCount; i += 1) {
    const combo = combos.nth(i);
    const options = await comboOptions(page, combo);
    if (!options.length) continue;
    if (options.some((option) => /^\d+일$/.test(option))) {
      await chooseCombo(page, combo, [days[Math.min(dayIndex, days.length - 1)] || '1일', '1일']);
      dayIndex += 1;
    } else if (options.some((option) => /^\d+회$/.test(option)) || options.includes('제한없음')) {
      await chooseCombo(page, combo, [
        revisions[Math.min(revisionIndex, revisions.length - 1)] || '1회',
        '1회',
        '0회',
      ]);
      revisionIndex += 1;
    } else if (options.some((option) => /^\d+개$/.test(option))) {
      const counts = ['1개', '2개', '3개'];
      await chooseCombo(page, combo, [counts[Math.min(countIndex, counts.length - 1)], '1개']);
      countIndex += 1;
    } else if (options.includes('예')) {
      await chooseCombo(page, combo, ['예']);
    } else if (options.includes('제공')) {
      await chooseCombo(page, combo, ['제공']);
    } else if (options.some((option) => /^\d+$/.test(option))) {
      await chooseCombo(page, combo, ['1', '0']);
    }
  }

  const instruction = page.locator('#GIG_INSTRUCTION');
  const requestCombos = instruction.getByRole('combobox');
  const requestCount = await requestCombos.count();
  for (let i = 0; i < requestCount; i += 1) {
    await chooseCombo(page, requestCombos.nth(i), ['서술형']);
  }

  const add = page
    .getByRole('heading', { name: '추가 가격' })
    .locator('xpath=ancestor::div[contains(@class, "min-h")][1]');
  for (let i = 0; i < 20; i += 1) {
    const deleteButtons = add.getByRole('button', { name: '삭제', exact: true });
    const deleteCount = await deleteButtons.count();
    if (!deleteCount) break;
    await deleteButtons.nth(deleteCount - 1).click();
    await pause(page, 250);
  }

  for (let i = 0; i < rows.length; i += 1) {
    await add.getByRole('button', { name: '맞춤 옵션 추가', exact: true }).click();
    await pause(page, 250);
  }
  const addBoxes = add.getByRole('textbox');
  for (let i = 0; i < rows.length * 3; i += 1) {
    const row = rows[Math.floor(i / 3)];
    await addBoxes.nth(i).fill(String(row[i % 3]));
    await pause(page, 60);
  }
  const addCombos = add.getByRole('combobox');
  const addComboCount = await addCombos.count();
  for (let i = 0; i < addComboCount; i += 1) {
    await chooseCombo(page, addCombos.nth(i), ['1', '0', '1일']);
  }

  await page.getByRole('button', { name: '임시 저장하기' }).click();
  await pause(page, 3500);
  const body = await page.locator('body').innerText();
  return {
    id: serviceId,
    title: service.title,
    priceCombos: comboCount,
    requestCombos: requestCount,
    addonRows: rows.length,
    saved: body.includes('저장'),
  };
}
