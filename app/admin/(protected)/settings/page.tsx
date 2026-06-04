import { CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react";

type Status = "ok" | "missing" | "warn";

interface CheckItem {
  label: string;
  key: string;
  status: Status;
  note?: string;
}

interface CheckGroup {
  title: string;
  items: CheckItem[];
}

function env(key: string): Status {
  const val = process.env[key];
  return val ? "ok" : "missing";
}

function getCheckGroups(): CheckGroup[] {
  return [
    {
      title: "분석 · 추적",
      items: [
        {
          label: "GA4",
          key: "NEXT_PUBLIC_GA_ID",
          status: env("NEXT_PUBLIC_GA_ID"),
          note: process.env.NEXT_PUBLIC_GA_ID ? `측정 ID: ${process.env.NEXT_PUBLIC_GA_ID}` : "G-XXXX 형식의 측정 ID를 설정하세요",
        },
        {
          label: "자체 분석 IP 익명화 (ANALYTICS_HMAC_SECRET)",
          key: "ANALYTICS_HMAC_SECRET",
          status: env("ANALYTICS_HMAC_SECRET"),
          note: !process.env.ANALYTICS_HMAC_SECRET ? "미설정 시 IP가 평문으로 저장됩니다 — 임의 문자열을 설정하세요" : undefined,
        },
      ],
    },
    {
      title: "광고 픽셀",
      items: [
        {
          label: "Meta(Facebook) Pixel",
          key: "NEXT_PUBLIC_META_PIXEL_ID",
          status: env("NEXT_PUBLIC_META_PIXEL_ID"),
        },
        {
          label: "카카오 픽셀",
          key: "NEXT_PUBLIC_KAKAO_PIXEL_ID",
          status: env("NEXT_PUBLIC_KAKAO_PIXEL_ID"),
        },
        {
          label: "네이버 광고 분석",
          key: "NEXT_PUBLIC_NAVER_AD_ID",
          status: env("NEXT_PUBLIC_NAVER_AD_ID"),
        },
      ],
    },
    {
      title: "검색엔진 소유확인",
      items: [
        {
          label: "Google Search Console",
          key: "NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION",
          status: env("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION"),
        },
        {
          label: "네이버 서치어드바이저",
          key: "NEXT_PUBLIC_NAVER_SITE_VERIFICATION",
          status: env("NEXT_PUBLIC_NAVER_SITE_VERIFICATION"),
        },
      ],
    },
    {
      title: "핵심 서비스",
      items: [
        {
          label: "Supabase",
          key: "NEXT_PUBLIC_SUPABASE_URL",
          status: env("NEXT_PUBLIC_SUPABASE_URL") === "ok" && env("SUPABASE_SERVICE_ROLE_KEY") === "ok" ? "ok" : "missing",
          note: "NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY",
        },
        {
          label: "Anthropic (챗봇)",
          key: "ANTHROPIC_API_KEY",
          status: env("ANTHROPIC_API_KEY"),
        },
        {
          label: "Telegram Bot",
          key: "TELEGRAM_BOT_TOKEN",
          status: env("TELEGRAM_BOT_TOKEN") === "ok" && env("TELEGRAM_CHAT_ID") === "ok" ? "ok" : "missing",
          note: "TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID",
        },
        {
          label: "Resend (이메일 발송)",
          key: "RESEND_API_KEY",
          status: env("RESEND_API_KEY"),
        },
        {
          label: "Cron 보안 시크릿",
          key: "CRON_SECRET",
          status: env("CRON_SECRET"),
        },
        {
          label: "어드민 인증",
          key: "ADMIN_PASSWORD",
          status: env("ADMIN_PASSWORD") === "ok" && env("ADMIN_SESSION_SECRET") === "ok" ? "ok" : "missing",
          note: "ADMIN_PASSWORD + ADMIN_SESSION_SECRET",
        },
      ],
    },
  ];
}

function StatusIcon({ status }: { status: Status }) {
  if (status === "ok") return <CheckCircle className="size-4 text-emerald-400 shrink-0" />;
  if (status === "warn") return <AlertCircle className="size-4 text-amber-400 shrink-0" />;
  return <XCircle className="size-4 text-red-400/80 shrink-0" />;
}

function StatusBadge({ status }: { status: Status }) {
  if (status === "ok") return <span className="text-xs text-emerald-400">연결됨</span>;
  if (status === "warn") return <span className="text-xs text-amber-400">경고</span>;
  return <span className="text-xs text-red-400/80">미설정</span>;
}

export default function SettingsPage() {
  const groups = getCheckGroups();
  const allItems = groups.flatMap((g) => g.items);
  const okCount = allItems.filter((i) => i.status === "ok").length;
  const missingCount = allItems.filter((i) => i.status === "missing").length;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-medium uppercase text-primary">Settings</p>
        <h2 className="mt-2 text-3xl font-semibold">설정 · 연동 점검</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          환경변수 설정 현황을 확인합니다. 값은 노출되지 않으며, 설정 여부만 표시됩니다.
        </p>
      </div>

      {/* 요약 KPI */}
      <section className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-white/10 bg-card p-5">
          <p className="text-sm text-muted-foreground">전체 항목</p>
          <p className="mt-3 text-2xl font-semibold">{allItems.length}</p>
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-5">
          <p className="text-sm text-muted-foreground">연결됨</p>
          <p className="mt-3 text-2xl font-semibold text-emerald-400">{okCount}</p>
        </div>
        <div className={`rounded-lg border p-5 ${missingCount > 0 ? "border-red-500/20 bg-red-500/5" : "border-white/10 bg-card"}`}>
          <p className="text-sm text-muted-foreground">미설정</p>
          <p className={`mt-3 text-2xl font-semibold ${missingCount > 0 ? "text-red-400/80" : ""}`}>{missingCount}</p>
        </div>
      </section>

      {/* 그룹별 점검 */}
      <section className="space-y-5">
        {groups.map((group) => (
          <div key={group.title} className="rounded-lg border border-white/10 bg-card overflow-hidden">
            <div className="border-b border-white/10 px-5 py-4">
              <h3 className="font-semibold">{group.title}</h3>
            </div>
            <div className="divide-y divide-white/5">
              {group.items.map((item) => (
                <div key={item.key} className="flex items-start gap-4 px-5 py-4">
                  <StatusIcon status={item.status} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium">{item.label}</p>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground font-mono">{item.key}</p>
                    {item.note && (
                      <p className={`mt-1 text-xs ${item.status === "missing" ? "text-amber-400/80" : "text-muted-foreground"}`}>
                        {item.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* 환경변수 추가 안내 */}
      <section className="rounded-lg border border-white/10 bg-card p-5 text-sm text-muted-foreground space-y-2">
        <p className="font-medium text-foreground">환경변수 추가 방법</p>
        <p>로컬: <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">aio-make-src/.env.local</code> 파일에 추가</p>
        <p>프로덕션: Vercel 대시보드 → 프로젝트 → Settings → Environment Variables</p>
        <p className="flex items-center gap-1">
          변경 후 <strong>Redeploy 필수</strong>
          <span className="text-[10px]">(NEXT_PUBLIC_ 접두사 변수는 빌드 시 번들에 포함)</span>
        </p>
        <a
          href="https://vercel.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-primary hover:underline"
        >
          Vercel 대시보드 열기
          <ExternalLink className="size-3" />
        </a>
      </section>
    </div>
  );
}
