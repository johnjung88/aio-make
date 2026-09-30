"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  LayoutDashboard,
  MessagesSquare,
  Images,
  BarChart3,
  Settings,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Brand } from "./site-shell";
import { divisionServices } from "@/lib/content";
import type { GaReport } from "@/lib/ga";
import type {
  Inquiry,
  Note,
  InquiryData,
  EntryData,
  EntryDraft,
} from "./admin/types";
import { InquiryPanel } from "./admin/inquiries";
import { EntryPanel } from "./admin/entries";
import { AnalyticsPanel } from "./admin/analytics";
type View = "overview" | "inquiries" | "entries" | "analytics" | "settings";
const views = [
  { id: "overview", label: "대시보드", icon: LayoutDashboard },
  { id: "inquiries", label: "문의·상담 내역", icon: MessagesSquare },
  { id: "entries", label: "레퍼런스·인사이트", icon: Images },
  { id: "analytics", label: "방문·문의 통계", icon: BarChart3 },
  { id: "settings", label: "연결 상태", icon: Settings },
] as const;
const initialEntry = (): EntryDraft => ({
  type: "reference",
  division: "marketing",
  service: divisionServices("marketing")[0].id,
  slug: "",
  title: "",
  summary: "",
  body: "",
  cover_url: "",
  video_url: "",
  kind: "example",
  rights_confirmed: false,
  is_published: false,
  is_featured: false,
  display_order: 0,
});
async function read<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: "no-store" });
  if (res.status === 401) {
    location.href = "/admin/login";
    throw new Error("로그인이 필요합니다.");
  }
  return res.json();
}
export function AdminDashboard() {
  const router = useRouter(),
    [view, setView] = useState<View>("overview"),
    [inquiries, setInquiries] = useState<InquiryData>({
      connected: false,
      items: [],
      total: null,
    }),
    [entries, setEntries] = useState<EntryData>({
      connected: false,
      items: [],
    }),
    [ga, setGa] = useState<GaReport | null>(null),
    [loading, setLoading] = useState(true),
    [message, setMessage] = useState(""),
    [error, setError] = useState(false),
    [page, setPage] = useState(1),
    [statusFilter, setStatusFilter] = useState("all"),
    [search, setSearch] = useState(""),
    [selected, setSelected] = useState<Inquiry | null>(null),
    [notes, setNotes] = useState<Note[]>([]),
    [nextStatus, setNextStatus] = useState("new"),
    [note, setNote] = useState(""),
    [editor, setEditor] = useState<ReturnType<typeof initialEntry> | null>(
      null,
    ),
    [busy, setBusy] = useState(false),
    [entryFilter, setEntryFilter] = useState("all");
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [a, b, c] = await Promise.all([
        read<InquiryData>(
          "/api/admin/inquiries?page=" + page + "&status=" + statusFilter,
        ),
        read<EntryData>("/api/admin/entries"),
        read<GaReport>("/api/admin/analytics"),
      ]);
      setInquiries(a);
      setEntries(b);
      setGa(c);
    } catch {
      setError(true);
      setMessage(
        "데이터 조회를 완료하지 못했습니다. 연결 상태를 확인해주세요.",
      );
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  async function logout() {
    const res = await fetch("/api/admin/logout", { method: "POST" });
    if (res.ok) {
      router.replace("/admin/login");
      router.refresh();
    } else {
      setError(true);
      setMessage("로그아웃을 완료하지 못했습니다.");
    }
  }
  async function detail(id: string) {
    setMessage("");
    try {
      const res = await fetch("/api/admin/inquiries/" + id, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSelected(data.item);
      setNextStatus(data.item.status);
      setNotes(data.notes);
      setNote("");
    } catch (e) {
      setError(true);
      setMessage(e instanceof Error ? e.message : "문의 조회에 실패했습니다.");
    }
  }
  async function saveInquiry() {
    if (!selected) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected.id, status: nextStatus, note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await detail(selected.id);
      await refresh();
      setError(false);
      setMessage("상담 내역을 저장했습니다.");
    } catch (e) {
      setError(true);
      setMessage(e instanceof Error ? e.message : "저장에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }
  async function saveEntry(event: React.FormEvent) {
    event.preventDefault();
    if (!editor) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editor),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEditor(data.item);
      await refresh();
      setError(false);
      setMessage("콘텐츠를 저장했습니다.");
    } catch (e) {
      setError(true);
      setMessage(e instanceof Error ? e.message : "저장에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }
  function updateEditor<K extends keyof ReturnType<typeof initialEntry>>(
    key: K,
    value: ReturnType<typeof initialEntry>[K],
  ) {
    setEditor((e) => (e ? { ...e, [key]: value } : e));
  }
  const filteredInquiries = inquiries.items.filter((i) =>
    [i.leads?.customer_name, i.leads?.company_name, i.leads?.email, i.raw_text]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const filteredEntries = entries.items.filter(
    (e) => entryFilter === "all" || e.type === entryFilter,
  );
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/">
          <Brand />
        </Link>
        <nav aria-label="관리자 메뉴">
          {views.map((v) => (
            <button
              key={v.id}
              className={view === v.id ? "active" : ""}
              onClick={() => {
                setView(v.id);
                setMessage("");
              }}
            >
              <v.icon size={18} />
              {v.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <Link href="/" target="_blank" rel="noopener noreferrer">
            공개 사이트 보기 ↗
          </Link>
          <button onClick={logout}>로그아웃</button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-heading">
          <div>
            <p className="eyebrow">AIO MAKE / MANAGEMENT</p>
            <h1>{views.find((v) => v.id === view)?.label}</h1>
            <p>필요한 데이터만, 확인된 상태로.</p>
          </div>
          <button
            aria-label="데이터 새로고침"
            className="secondary-button"
            disabled={loading}
            onClick={refresh}
          >
            <RefreshCw size={18} />
          </button>
        </div>
        {message && (
          <div
            role="status"
            className={"admin-message" + (error ? " error" : "")}
          >
            {message}
          </div>
        )}
        {loading && (
          <p role="status" className="admin-loading">
            데이터 확인 중…
          </p>
        )}
        {view === "overview" && (
          <>
            <div className="admin-cards">
              {[
                [
                  "전체 문의",
                  inquiries.connected
                    ? (inquiries.globalTotal ?? inquiries.total)
                    : null,
                ],
                ["신규 문의", inquiries.connected ? inquiries.newCount : null],
                [
                  "공개 콘텐츠",
                  entries.connected
                    ? entries.items.filter((e) => e.is_published).length
                    : null,
                ],
                [
                  "최근 28일 방문자",
                  ga?.connected ? ga.totals?.activeUsers : null,
                ],
              ].map(([label, value]) => (
                <div className="admin-card" key={String(label)}>
                  <p>{label}</p>
                  <strong>
                    {value == null ? "—" : Number(value).toLocaleString()}
                  </strong>
                </div>
              ))}
            </div>
            <div className="admin-two-cols">
              <section className="admin-panel">
                <h2>문의 확인</h2>
                <p>
                  {inquiries.connected
                    ? "새로운 문의와 진행 중인 상담을 확인하세요."
                    : "문의 데이터베이스 연결을 준비 중입니다."}
                </p>
                <button
                  className="secondary-button"
                  onClick={() => setView("inquiries")}
                >
                  상담 내역으로 →
                </button>
              </section>
              <section className="admin-panel">
                <h2>GA4 연결</h2>
                <p>
                  {ga?.connected
                    ? "최근 28일 데이터를 조회했습니다."
                    : (ga?.error ?? "서버 조회 연결을 확인 중입니다.")}
                </p>
                <button
                  className="secondary-button"
                  onClick={() => setView("analytics")}
                >
                  방문 통계 확인 →
                </button>
              </section>
            </div>
            <section className="admin-panel">
              <h2>콘텐츠 공개 기준</h2>
              <p>
                고객 사례와 제작 예시를 구분하고, 내용의 사실과 공개 권리를
                확인한 항목만 공개합니다. 챗봇은 사용자 요청에 따라 보류
                상태입니다.
              </p>
            </section>
          </>
        )}
        {view === "inquiries" && (
          <InquiryPanel
            inquiries={inquiries}
            filteredInquiries={filteredInquiries}
            page={page}
            search={search}
            statusFilter={statusFilter}
            selected={selected}
            notes={notes}
            nextStatus={nextStatus}
            note={note}
            busy={busy}
            setSearch={setSearch}
            setStatusFilter={setStatusFilter}
            setPage={setPage}
            setSelected={setSelected}
            setNextStatus={setNextStatus}
            setNote={setNote}
            detail={detail}
            saveInquiry={saveInquiry}
          />
        )}
        {view === "entries" && (
          <EntryPanel
            entries={entries}
            filteredEntries={filteredEntries}
            entryFilter={entryFilter}
            editor={editor}
            busy={busy}
            setEntryFilter={setEntryFilter}
            setEditor={setEditor}
            setMessage={setMessage}
            setError={setError}
            setBusy={setBusy}
            initialEntry={initialEntry}
            updateEditor={updateEditor}
            saveEntry={saveEntry}
          />
        )}
        {view === "analytics" && <AnalyticsPanel ga={ga} />}
        {view === "settings" && (
          <>
            <section className="admin-panel">
              <h2>데이터베이스</h2>
              <p>
                문의: {inquiries.connected ? "조회 연결됨" : "연결 대기"} ·
                콘텐츠: {entries.connected ? "조회 연결됨" : "연결 대기"}
              </p>
              <p>
                기존 문의와 고객 자료를 보존하는 추가 마이그레이션을
                준비했습니다. 운영 DB 적용은 백업과 실제 스키마 확인 뒤
                진행합니다.
              </p>
            </section>
            <section className="admin-panel">
              <h2>Google Analytics</h2>
              <p>속성 536780274 · 웹 스트림 14842217461 · 측정 G-7R9P2N40RW</p>
              <p>
                GA4 화면에서 최근 데이터 수집을 확인했습니다. 관리자 API 조회:{" "}
                {ga?.connected ? "연결됨" : "인증 연결 대기"}.
              </p>
            </section>
            <section className="admin-panel">
              <h2>AI 챗봇</h2>
              <p>
                사용자 요청에 따라 보류했습니다. 공개 사이트에 챗봇 버튼과 API를
                설치하지 않았습니다.
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
