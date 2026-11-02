/**
 * 포트폴리오 데이터 코드 → Supabase DB 마이그레이션
 *
 * 실행:
 *   node tools/migrate-portfolio-to-db.mjs --dry-run   (매핑 결과만 출력)
 *   node tools/migrate-portfolio-to-db.mjs             (실제 적용)
 *
 * 필요 환경변수: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * (프로젝트 루트의 .env.local 자동 로드)
 */

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

// ─── .env.local 로드 ───────────────────────────────────────────
function loadEnv() {
  try {
    const lines = readFileSync(".env.local", "utf8").split(/\r?\n/);
    for (const line of lines) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq === -1) continue;
      const key = t.slice(0, eq).trim();
      let val = t.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // no .env.local — rely on process.env
  }
}
loadEnv();

const DRY_RUN = process.argv.includes("--dry-run");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

// ─── 실제 필드 기준 매핑 헬퍼 ──────────────────────────────────

/** "3일" → 3, "진행 중" → null, "12종 완료" → null */
function parseDurationDays(duration) {
  if (!duration) return null;
  const m = duration.match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

/**
 * getPortfolioGroup 로직을 JS로 재현
 * (lib/portfolio-data.ts:2759 의 진실 소스와 동일)
 */
function getPortfolioGroup(project) {
  const { type, subtype } = project;
  if (subtype === "shopping-mall") return "shopping-mall";
  if (subtype === "ppt") return "ppt-design";
  if (subtype === "detail-page") return "detail-page";
  if (["logo", "business-card", "card-news", "infographic"].includes(subtype ?? "")) return "logo-business-card";
  if (type === "video") return "video-content";
  if (type === "app" || type === "automation") return "automation-app";
  return "website";
}

// ─── 포트폴리오 데이터 동적 import ─────────────────────────────
// portfolio-data.ts를 직접 import할 수 없으므로 빌드된 .next 번들 대신
// tsx / ts-node 없이 실행할 수 있도록 JSON 캐시 파일을 사용합니다.
// 없으면 안내 메시지를 출력합니다.
async function loadPortfolioData() {
  // 방법 A: 사전에 생성한 JSON 캐시
  try {
    const raw = readFileSync("tools/portfolio-data-cache.json", "utf8");
    return JSON.parse(raw);
  } catch {
    // 캐시 없음 → 방법 B 시도
  }

  // 방법 B: tsx가 설치된 경우 동적 import (tsx로 실행 시)
  try {
    const mod = await import("../lib/portfolio-data.ts");
    return mod.portfolioProjects;
  } catch {
    console.error(
      "\n[ERROR] 포트폴리오 데이터를 불러올 수 없습니다.\n" +
      "다음 중 하나를 선택하세요:\n" +
      "  1) tsx 설치 후: npx tsx tools/migrate-portfolio-to-db.mjs --dry-run\n" +
      "  2) JSON 캐시 생성: node tools/export-portfolio-cache.mjs 실행 후 재시도\n"
    );
    process.exit(1);
  }
}

// ─── 메인 ───────────────────────────────────────────────────────
async function main() {
  const portfolioProjects = await loadPortfolioData();

  console.log(`\n포트폴리오 총 ${portfolioProjects.length}개 ${DRY_RUN ? "[DRY RUN]" : "[LIVE]"}\n`);

  // 카테고리별 분포 미리 보기
  const groupCount = {};
  for (const p of portfolioProjects) {
    const g = getPortfolioGroup(p);
    groupCount[g] = (groupCount[g] ?? 0) + 1;
  }
  console.log("카테고리별 분포:");
  for (const [k, v] of Object.entries(groupCount)) {
    console.log(`  ${k.padEnd(22)} ${v}개`);
  }
  console.log();

  if (DRY_RUN) {
    console.log("── dry-run 샘플 (첫 5개) ──────────────────────────────");
    for (const p of portfolioProjects.slice(0, 5)) {
      const categoryId = getPortfolioGroup(p);
      console.log({
        slug: p.slug,
        primary_category_id: categoryId,
        title_ko: p.title.ko,
        client_name: typeof p.client === "string" ? p.client : null,
        duration_days: parseDurationDays(p.duration),
        is_featured: p.featured ?? false,
        is_published: p.visibility !== "private-result",
        tech_stack: p.stack ?? [],
        external_url: p.links?.live ?? null,
        cover: p.cover,
        gallery_count: (p.gallery ?? []).length,
        has_before_after: !!p.beforeAfter,
        kpis_count: (p.kpis ?? []).length,
      });
    }
    console.log("\n─ dry-run 완료. --dry-run 플래그 제거 후 실행하면 실제 적용됩니다.");
    return;
  }

  // ── LIVE 실행 ──────────────────────────────────────────────────
  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (const p of portfolioProjects) {
    const categoryId = getPortfolioGroup(p);

    // 1) portfolios row
    const { data: portfolio, error: insertErr } = await supabase
      .from("portfolios")
      .insert({
        slug: p.slug,
        primary_category_id: categoryId,
        title_ko: p.title.ko,
        title_en: p.title.en ?? null,
        client_name: typeof p.client === "string" ? p.client : null,
        summary_ko: p.summary?.ko ?? null,
        summary_en: p.summary?.en ?? null,
        duration_days: parseDurationDays(p.duration),
        is_featured: p.featured ?? false,
        is_published: p.visibility !== "private-result",
        tech_stack: p.stack ?? [],
        external_url: p.links?.live ?? null,
        testimonial: null,
        testimonial_author: null,
      })
      .select("id")
      .single();

    if (insertErr) {
      if (insertErr.code === "23505") {
        console.log(`  SKIP (already exists): ${p.slug}`);
        skipped++;
        continue;
      }
      console.error(`  FAIL: ${p.slug}`, insertErr.message);
      failed++;
      continue;
    }

    const pid = portfolio.id;

    // 2) cover → portfolio_assets (display_order = 0)
    if (p.cover) {
      await supabase.from("portfolio_assets").insert({
        portfolio_id: pid,
        asset_type: "image",
        url: p.cover,
        display_order: 0,
      });
    }

    // 3) gallery[] → portfolio_assets (display_order 1+)
    for (let i = 0; i < (p.gallery ?? []).length; i++) {
      await supabase.from("portfolio_assets").insert({
        portfolio_id: pid,
        asset_type: "image",
        url: p.gallery[i],
        display_order: i + 1,
      });
    }

    // 4) beforeAfter → portfolio_assets ('before' / 'after')
    if (p.beforeAfter) {
      await supabase.from("portfolio_assets").insert([
        { portfolio_id: pid, asset_type: "before", url: p.beforeAfter.before, display_order: 0 },
        { portfolio_id: pid, asset_type: "after",  url: p.beforeAfter.after,  display_order: 1 },
      ]);
    }

    // 5) kpis → portfolio_kpis
    for (let i = 0; i < (p.kpis ?? []).length; i++) {
      const k = p.kpis[i];
      await supabase.from("portfolio_kpis").insert({
        portfolio_id: pid,
        label_ko: k.label.ko,
        label_en: k.label.en ?? null,
        value_text: `${k.value}${k.unit ?? ""}`,
        display_order: i,
      });
    }

    console.log(`  ✓ ${p.slug} → ${categoryId}`);
    success++;
  }

  console.log(`\n완료: ${success}개 성공 / ${skipped}개 스킵(중복) / ${failed}개 실패`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
