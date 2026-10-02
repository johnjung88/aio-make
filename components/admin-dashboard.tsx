"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
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
import type { GaReport, GaDays } from "@/lib/ga-data";
import { InquiryConnection } from "./admin/inquiry-connection";
import { Overview } from "./admin/overview";
import type {
  Inquiry,
  Note,
  InquiryData,
  EntryData,
  EntryDraft,
} from "./admin/types";
import { InquiryPanel } from "./admin/inquiries";
import { EntryPanel } from "./admin/entries";
import { AnalyticsPanel, GaConnection } from "./admin/analytics";
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
async function read<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(path, { cache: "no-store", signal });
  if (res.status === 401) {
    location.href = "/admin/login";
    throw new Error("로그인이 필요합니다");
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "데이터 조회에 실패했습니다");
  return data;
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
    [gaDays, setGaDays] = useState<GaDays>(28),
    [gaLoading, setGaLoading] = useState(true),
    [recent, setRecent] = useState<InquiryData>({
      connected: false,
      items: [],
      total: null,
    }),
    [loading, setLoading] = useState(true),
    [message, setMessage] = useState(""),
    [error, setError] = useState(false),
    [page, setPage] = useState(1),
    [statusFilter, setStatusFilter] = useState("all"),
    [search, setSearch] = useState(""),
    [appliedSearch, setAppliedSearch] = useState(""),
    [selected, setSelected] = useState<Inquiry | null>(null),
    [notes, setNotes] = useState<Note[]>([]),
    [nextStatus, setNextStatus] = useState("new"),
    [note, setNote] = useState(""),
    [editor, setEditor] = useState<ReturnType<typeof initialEntry> | null>(
      null,
    ),
    [busy, setBusy] = useState(false),
    [entryFilter, setEntryFilter] = useState("all"),
    [entryPage, setEntryPage] = useState(1);
  const refreshRequest = useRef<AbortController | null>(null);
  const navigation = useRef<HTMLElement>(null);
  const editorBaseline = useRef<EntryDraft | null>(null);
  useEffect(() => {
    const rail = navigation.current;
    const current = rail?.querySelector<HTMLElement>('[aria-current="page"]');
    if (rail && current && rail.scrollWidth > rail.clientWidth)
      rail.scrollLeft = Math.max(0, current.offsetLeft - rail.offsetLeft - 12);
  }, [view]);
  const [pendingEditor, setPendingEditor] = useState<{
    next: EntryDraft | null;
  } | null>(null);
  const keepEditing = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (pendingEditor) keepEditing.current?.focus();
  }, [pendingEditor]);
  const refresh = useCallback(async () => {
    refreshRequest.current?.abort();
    const controller = new AbortController();
    refreshRequest.current = controller;
    setLoading(true);
    try {
      const [a, b, c] = await Promise.allSettled([
        read<InquiryData>(
          "/api/admin/inquiries?" +
            new URLSearchParams({
              page: String(page),
              status: statusFilter,
              search: appliedSearch,
            }),
          controller.signal,
        ),
        read<EntryData>(
          "/api/admin/entries?" +
            new URLSearchParams({ page: String(entryPage), type: entryFilter }),
          controller.signal,
        ),
        read<InquiryData>(
          "/api/admin/inquiries?page=1&status=all",
          controller.signal,
        ),
      ]);
      if (controller.signal.aborted) return;
      setInquiries(
        a.status === "fulfilled"
          ? a.value
          : {
              connected: false,
              items: [],
              total: null,
              error: "문의 목록을 불러오지 못했습니다 다시 시도해주세요",
            },
      );
      setEntries(
        b.status === "fulfilled"
          ? b.value
          : {
              connected: false,
              items: [],
              error: "컨텐츠 목록을 불러오지 못했습니다 다시 시도해주세요",
            },
      );
      setRecent(
        c.status === "fulfilled"
          ? c.value
          : { connected: false, items: [], total: null },
      );
    } catch {
      if (controller.signal.aborted) return;
      setError(true);
      setMessage("데이터 조회를 완료하지 못했습니다 연결 상태를 확인해주세요");
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [page, statusFilter, appliedSearch, entryPage, entryFilter]);
  useEffect(() => {
    void refresh();
    return () => refreshRequest.current?.abort();
  }, [refresh]);
  useEffect(() => {
    if (view !== "overview" && view !== "inquiries") return;
    const timer = setInterval(() => {
      if (document.visibilityState === "visible" && !busy) void refresh();
    }, 30000);
    return () => clearInterval(timer);
  }, [refresh, view, busy]);
  const gaRequest = useRef<AbortController | null>(null);
  const refreshGa = useCallback(async () => {
    gaRequest.current?.abort();
    const controller = new AbortController();
    gaRequest.current = controller;
    setGaLoading(true);
    setGa(null);
    try {
      const data = await read<GaReport>(
        "/api/admin/analytics?days=" + gaDays,
        controller.signal,
      );
      if (!controller.signal.aborted) setGa(data);
    } catch {
      if (!controller.signal.aborted)
        setGa({
          connected: false,
          status: "unavailable",
          propertyId: "",
          measurementId: "",
          period: `최근 ${gaDays}일`,
          days: gaDays,
          error: "통계를 불러오지 못했습니다 잠시 후 다시 시도해주세요",
        });
    } finally {
      if (!controller.signal.aborted) setGaLoading(false);
    }
  }, [gaDays]);
  useEffect(() => {
    void refreshGa();
    return () => gaRequest.current?.abort();
  }, [refreshGa]);
  useEffect(() => {
    const value = location.hash.slice(1);
    if (views.some((v) => v.id === value)) setView(value as View);
  }, []);
  function navigate(next: View) {
    setView(next);
    setMessage("");
    history.replaceState(null, "", "/admin#" + next);
    window.scrollTo({ top: 0 });
  }
  async function logout() {
    const res = await fetch("/api/admin/logout", { method: "POST" });
    if (res.ok) {
      router.replace("/admin/login");
      router.refresh();
    } else {
      setError(true);
      setMessage("로그아웃을 완료하지 못했습니다");
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
      setMessage(e instanceof Error ? e.message : "문의 조회에 실패했습니다");
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
      setMessage("상담 내역을 저장했습니다");
    } catch (e) {
      setError(true);
      setMessage(e instanceof Error ? e.message : "저장에 실패했습니다");
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
      editorBaseline.current = data.item;
      setEditor(data.item);
      await refresh();
      setError(false);
      setMessage("컨텐츠를 저장했습니다");
    } catch (e) {
      setError(true);
      setMessage(e instanceof Error ? e.message : "저장에 실패했습니다");
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
  const entryFields = Object.keys(initialEntry()) as (keyof EntryDraft)[];
  const baseline = editorBaseline.current ?? initialEntry();
  const editorDirty =
    !!editor && entryFields.some((key) => editor[key] !== baseline[key]);
  function openEditor(next: EntryDraft | null) {
    if (busy) return false;
    if (editorDirty) {
      setPendingEditor({ next });
      return false;
    }
    editorBaseline.current = next;
    setEditor(next);
    setMessage("");
    return true;
  }
  useEffect(() => {
    if (!editorDirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [editorDirty]);
  const filteredInquiries = inquiries.items;
  const filteredEntries = entries.items.filter(
    (e) => entryFilter === "all" || e.type === entryFilter,
  );
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/">
          <Brand />
        </Link>
        <nav ref={navigation} aria-label="관리자 메뉴">
          {views.map((v) => (
            <button
              key={v.id}
              className={view === v.id ? "active" : ""}
              aria-current={view === v.id ? "page" : undefined}
              onClick={() => navigate(v.id)}
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
            <p>
              {
                {
                  overview:
                    "새로운 문의와 컨텐츠, 사이트 방문 흐름을 확인하세요",
                  inquiries: "접수된 문의를 확인하고 다음 상담을 이어가세요",
                  entries: "작업 사례와 서비스 안내 글을 관리하세요",
                  analytics: "방문부터 문의까지, 사이트의 흐름을 살펴보세요",
                  settings: "사이트에 연결된 데이터 서비스의 상태입니다",
                }[view]
              }
            </p>
          </div>
          <button
            aria-label="데이터 새로고침"
            className="secondary-button"
            disabled={loading || gaLoading}
            onClick={() => {
              void refresh();
              void refreshGa();
            }}
          >
            <RefreshCw size={16} /> 새로고침
          </button>
        </div>
        {message && (
          <div
            role={error ? "alert" : "status"}
            className={"admin-message" + (error ? " error" : "")}
          >
            {message}
          </div>
        )}
        {loading && view !== "overview" && (
          <p role="status" className="admin-loading">
            데이터 확인 중…
          </p>
        )}
        {pendingEditor && (
          <div className="admin-message confirm-message" role="alert">
            <p>저장하지 않은 변경이 있습니다 편집 내용을 버리시겠습니까?</p>
            <div className="editor-actions">
              <button
                ref={keepEditing}
                className="button"
                onClick={() => setPendingEditor(null)}
              >
                계속 편집
              </button>
              <button
                className="secondary-button"
                onClick={() => {
                  editorBaseline.current = pendingEditor.next;
                  setEditor(pendingEditor.next);
                  setPendingEditor(null);
                  setMessage("");
                }}
              >
                변경 버리기
              </button>
            </div>
          </div>
        )}
        {view === "overview" && (
          <Overview
            inquiries={recent}
            entries={entries}
            ga={ga}
            gaLoading={gaLoading}
            loading={loading}
            openInquiries={() => navigate("inquiries")}
            openEntries={() => navigate("entries")}
            openAnalytics={() => navigate("analytics")}
            openSettings={() => navigate("settings")}
            openInquiry={(id) => {
              navigate("inquiries");
              void detail(id);
            }}
          />
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
            loading={loading}
            appliedSearch={appliedSearch}
            applySearch={() => {
              if (search.trim() === appliedSearch && page === 1) void refresh();
              setAppliedSearch(search.trim());
              setPage(1);
              setSelected(null);
            }}
            clearSearch={() => {
              setSearch("");
              setAppliedSearch("");
              setPage(1);
              setSelected(null);
            }}
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
            page={entryPage}
            setPage={setEntryPage}
            loading={loading}
            editor={editor}
            busy={busy}
            setEntryFilter={(value) => {
              setEntryFilter(value);
              setEntryPage(1);
            }}
            setEditor={setEditor}
            setMessage={setMessage}
            setError={setError}
            setBusy={setBusy}
            openEditor={openEditor}
            savedEntry={editorBaseline.current}
            initialEntry={initialEntry}
            updateEditor={updateEditor}
            saveEntry={saveEntry}
          />
        )}
        {view === "analytics" && (
          <AnalyticsPanel
            ga={ga}
            days={gaDays}
            onDays={setGaDays}
            loading={gaLoading}
            onRetry={refreshGa}
          />
        )}
        {view === "settings" && (
          <>
            <section className="admin-panel">
              <h2>저장소 연결</h2>
              <p>
                문의: {inquiries.connected ? "조회 연결됨" : "연결 대기"} ·
                컨텐츠: {entries.connected ? "조회 연결됨" : "연결 대기"}
              </p>
              <p>
                문의는 운영 문의 저장소에 직접 접수됩니다. 레퍼런스 편집
                저장소는 별도로 연결 상태를 확인합니다.
              </p>
            </section>
            <InquiryConnection />
            <GaConnection ga={ga} loading={gaLoading} onRetry={refreshGa} />
            <section className="admin-panel">
              <h2>AI 챗봇</h2>
              <p>
                사용자 요청에 따라 보류했습니다 공개 사이트에 챗봇 버튼과 API를
                설치하지 않았습니다
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
