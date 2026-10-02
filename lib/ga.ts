import "server-only";
import { createSign } from "node:crypto";
import { readFile } from "node:fs/promises";
import {
  reportRequests,
  normalizeReports,
  type ApiReport,
  type GaDays,
  type GaReport,
} from "./ga-data.ts";
export type { GaReport } from "./ga-data.ts";
class GaError extends Error {
  status: GaReport["status"];
  constructor(status: GaReport["status"], message: string) {
    super(message);
    this.status = status;
  }
}
const cache = new Map<string, { until: number; data: GaReport }>();
const pending = new Map<string, Promise<GaReport>>();
async function credentials() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
      const json = JSON.parse(
        await readFile(process.env.GOOGLE_APPLICATION_CREDENTIALS, "utf8"),
      );
      if (
        json.type !== "service_account" ||
        !json.client_email ||
        !json.private_key
      )
        throw new Error();
      return {
        email: String(json.client_email),
        key: String(json.private_key),
      };
    } catch {
      throw new GaError(
        "invalid_config",
        "등록된 Google 인증 파일을 읽을 수 없습니다 서버의 파일 경로와 서비스 계정 형식을 확인해주세요",
      );
    }
  }
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n",
  );
  if (!email || !key)
    throw new GaError(
      "not_configured",
      "방문 통계를 가져오는 Google 읽기 연결이 필요합니다",
    );
  return { email, key };
}
async function accessToken() {
  const { email, key } = await credentials();
  const now = Math.floor(Date.now() / 1000);
  const encode = (value: object) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  const unsigned =
    encode({ alg: "RS256", typ: "JWT" }) +
    "." +
    encode({
      iss: email,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    });
  let assertion: string;
  try {
    const signer = createSign("RSA-SHA256");
    signer.update(unsigned);
    assertion = unsigned + "." + signer.sign(key, "base64url");
  } catch {
    throw new GaError(
      "invalid_config",
      "Google 인증 정보의 형식을 확인해주세요",
    );
  }
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok)
    throw new GaError("authentication", "Google 인증 설정을 확인해주세요");
  const result = await res.json();
  if (!result.access_token)
    throw new GaError(
      "authentication",
      "Google 인증 응답을 확인할 수 없습니다",
    );
  return result.access_token as string;
}
async function query(
  propertyId: string,
  token: string,
  requests: ReturnType<typeof reportRequests>,
): Promise<ApiReport[]> {
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:batchRunReports`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requests }),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    },
  );
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    if (response.status === 429)
      throw new GaError(
        "quota",
        "Google의 조회 한도에 도달했습니다 잠시 후 다시 확인해주세요",
      );
    if (response.status === 401)
      throw new GaError("authentication", "Google 인증을 다시 확인해주세요");
    if (response.status === 403) {
      const disabled = JSON.stringify(body.error?.details ?? []).includes(
        "SERVICE_DISABLED",
      );
      throw new GaError(
        disabled ? "api_disabled" : "permission",
        disabled
          ? "Google Analytics Data API 사용 설정이 필요합니다"
          : "이 사이트의 GA4 속성을 읽을 권한이 필요합니다",
      );
    }
    if (response.status === 404)
      throw new GaError(
        "invalid_config",
        "GA4 속성을 찾을 수 없습니다 속성 ID와 읽기 권한을 확인해주세요",
      );
    throw new GaError(
      "unavailable",
      "Google 통계를 불러오지 못했습니다 잠시 후 다시 확인해주세요",
    );
  }
  const result = await response.json();
  if (
    !Array.isArray(result.reports) ||
    result.reports.length !== requests.length
  )
    throw new GaError(
      "unavailable",
      "Google 보고서가 일부 누락됐습니다 다시 조회해주세요",
    );
  return result.reports;
}
export async function gaReport(days: GaDays = 28): Promise<GaReport> {
  const propertyId = process.env.GA4_PROPERTY_ID ?? "";
  const measurementId = process.env.NEXT_PUBLIC_GA_ID ?? "";
  const configuration = {
    property: /^\d+$/.test(propertyId),
    measurement: /^G-[A-Z0-9]+$/.test(measurementId),
    credentials: Boolean(
      process.env.GOOGLE_APPLICATION_CREDENTIALS ||
        (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
          process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY),
    ),
  };
  const base: GaReport = {
    connected: false,
    status: "not_configured",
    propertyId,
    measurementId,
    days,
    period: `최근 ${days}일 · 어제까지`,
    configuration,
  };
  if (!configuration.property)
    return {
      ...base,
      status: "invalid_config",
      error: "사이트의 GA4 속성 ID를 설정해주세요",
    };
  if (!configuration.credentials)
    return {
      ...base,
      error:
        "방문 기록을 보내는 설정은 조회 연결과 별개입니다 대시보드에서 통계를 읽을 Google 연결을 완료해주세요",
    };
  const key = `${propertyId}:${days}`;
  const cached = cache.get(key);
  if (cached && cached.until > Date.now()) return cached.data;
  const running = pending.get(key);
  if (running) return running;
  const request = (async (): Promise<GaReport> => {
    try {
      const token = await accessToken();
      const requests = reportRequests(days);
      const batches = await Promise.all([
        query(propertyId, token, requests.slice(0, 5)),
        query(propertyId, token, requests.slice(5)),
      ]);
      const data: GaReport = {
        ...base,
        connected: true,
        status: "connected",
        ...normalizeReports(batches.flat(), days),
        fetchedAt: new Date().toISOString(),
      };
      cache.set(key, { until: Date.now() + 300000, data });
      return data;
    } catch (error) {
      return {
        ...base,
        status: error instanceof GaError ? error.status : "unavailable",
        error:
          error instanceof GaError
            ? error.message
            : "Google 통계에 연결하지 못했습니다 네트워크와 연결 설정을 확인한 뒤 다시 시도해주세요",
      };
    }
  })();
  pending.set(key, request);
  try {
    return await request;
  } finally {
    pending.delete(key);
  }
}
