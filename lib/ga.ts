import "server-only";
import { createSign } from "node:crypto";
export type GaReport = {
  connected: boolean;
  propertyId: string;
  measurementId: string;
  period: string;
  error?: string;
  totals?: {
    activeUsers: number;
    sessions: number;
    views: number;
    leads: number;
  };
  channels?: { name: string; value: number }[];
  pages?: { name: string; value: number }[];
  devices?: { name: string; value: number }[];
  fetchedAt?: string;
};
const propertyId = process.env.GA4_PROPERTY_ID ?? "536780274",
  measurementId = process.env.NEXT_PUBLIC_GA_ID ?? "G-7R9P2N40RW";
let cached: { until: number; data: GaReport } | undefined;
async function accessToken() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !key) throw new Error("GA4 서버 인증 설정이 필요합니다.");
  const now = Math.floor(Date.now() / 1000),
    header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString(
      "base64url",
    ),
    claims = Buffer.from(
      JSON.stringify({
        iss: email,
        scope: "https://www.googleapis.com/auth/analytics.readonly",
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600,
      }),
    ).toString("base64url"),
    unsigned = header + "." + claims;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  const assertion = unsigned + "." + signer.sign(key, "base64url");
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("Google 서버 인증을 확인해주세요.");
  const data = await response.json();
  if (!data.access_token) throw new Error("Google 인증 응답을 확인해주세요.");
  return data.access_token as string;
}
type Report = {
  rows?: {
    dimensionValues?: { value: string }[];
    metricValues?: { value: string }[];
  }[];
};
export async function gaReport(): Promise<GaReport> {
  const base = {
    connected: false,
    propertyId,
    measurementId,
    period: "최근 28일 · 어제까지",
  };
  if (cached && cached.until > Date.now()) return cached.data;
  if (
    !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    !process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  )
    return {
      ...base,
      error:
        "웹 스트림은 확인했습니다. 대시보드 조회에는 GA4 속성 읽기 권한이 있는 서비스 계정 연결이 필요합니다.",
    };
  if (!/^\d+$/.test(propertyId))
    return { ...base, error: "GA4 속성 ID 형식을 확인해주세요." };
  try {
    const token = await accessToken();
    async function report(
      metrics: string[],
      dimensions: string[] = [],
      filter?: object,
    ): Promise<Report> {
      const res = await fetch(
        "https://analyticsdata.googleapis.com/v1beta/properties/" +
          propertyId +
          ":runReport",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dateRanges: [{ startDate: "28daysAgo", endDate: "yesterday" }],
            metrics: metrics.map((name) => ({ name })),
            dimensions: dimensions.map((name) => ({ name })),
            dimensionFilter: filter,
            limit: 10,
            orderBys: [{ metric: { metricName: metrics[0] }, desc: true }],
          }),
          cache: "no-store",
          signal: AbortSignal.timeout(15000),
        },
      );
      if (!res.ok)
        throw new Error("GA4 Data API 활성화와 속성 읽기 권한을 확인해주세요.");
      return res.json();
    }
    const [total, channel, page, device, lead] = await Promise.all([
      report(["activeUsers", "sessions", "screenPageViews"]),
      report(["sessions"], ["sessionDefaultChannelGroup"]),
      report(["screenPageViews"], ["pagePath"]),
      report(["sessions"], ["deviceCategory"]),
      report(["eventCount"], [], {
        filter: {
          fieldName: "eventName",
          stringFilter: { matchType: "EXACT", value: "generate_lead" },
        },
      }),
    ]);
    const values = total.rows?.[0]?.metricValues?.map((v) =>
      Number(v.value),
    ) ?? [0, 0, 0];
    const rows = (r: Report) =>
      (r.rows ?? []).map((row) => ({
        name: row.dimensionValues?.[0]?.value ?? "(not set)",
        value: Number(row.metricValues?.[0]?.value ?? 0),
      }));
    const data: GaReport = {
      ...base,
      connected: true,
      totals: {
        activeUsers: values[0],
        sessions: values[1],
        views: values[2],
        leads: Number(lead.rows?.[0]?.metricValues?.[0]?.value ?? 0),
      },
      channels: rows(channel),
      pages: rows(page),
      devices: rows(device),
      fetchedAt: new Date().toISOString(),
    };
    cached = { until: Date.now() + 300000, data };
    return data;
  } catch (e) {
    return {
      ...base,
      error:
        e instanceof Error
          ? e.message
          : "GA4 데이터 조회를 완료하지 못했습니다.",
    };
  }
}
