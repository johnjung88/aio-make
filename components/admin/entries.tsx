"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { isSafeImageUrl } from "@/lib/domain";
import { ArrowUpRight } from "lucide-react";
import { divisions, divisionServices, type DivisionId } from "@/lib/content";
import type { EntryData, EntryDraft } from "./types";
type Props = {
  entries: EntryData;
  filteredEntries: EntryData["items"];
  entryFilter: string;
  page: number;
  setPage: (page: number) => void;
  loading: boolean;
  editor: EntryDraft | null;
  busy: boolean;
  openEditor: (next: EntryDraft | null) => boolean;
  savedEntry: EntryDraft | null;
  setEntryFilter: (v: string) => void;
  setEditor: React.Dispatch<React.SetStateAction<EntryDraft | null>>;
  setMessage: (v: string) => void;
  setError: (v: boolean) => void;
  setBusy: (v: boolean) => void;
  initialEntry: () => EntryDraft;
  updateEditor: <K extends keyof EntryDraft>(
    key: K,
    value: EntryDraft[K],
  ) => void;
  saveEntry: (event: React.FormEvent) => Promise<void>;
};
export function EntryPanel({
  entries,
  filteredEntries,
  entryFilter,
  page,
  setPage,
  loading,
  editor,
  busy,
  openEditor,
  savedEntry,
  setEntryFilter,
  setEditor,
  setMessage,
  setError,
  setBusy,
  initialEntry,
  updateEditor,
  saveEntry,
}: Props) {
  const heading = useRef<HTMLHeadingElement>(null),
    opener = useRef<HTMLButtonElement | null>(null);
  const editorKey = editor ? (editor.id ?? "new") : null;
  useEffect(() => {
    if (editorKey) heading.current?.focus();
  }, [editorKey]);
  return (
    <section className="admin-panel">
      <div className="admin-toolbar">
        <h2>레퍼런스·인사이트</h2>
        <div>
          <select
            aria-label="컨텐츠 종류"
            value={entryFilter}
            disabled={!!editor || loading}
            onChange={(e) => setEntryFilter(e.target.value)}
          >
            <option value="all">전체 컨텐츠</option>
            <option value="reference">레퍼런스</option>
            <option value="insight">인사이트</option>
          </select>
          <button
            className="button"
            onClick={(event) => {
              if (openEditor(initialEntry()))
                opener.current = event.currentTarget;
            }}
          >
            새 컨텐츠 +
          </button>
        </div>
      </div>
      {!entries.connected && (
        <div className="admin-message">
          {entries.error ??
            "데이터베이스 연결 전입니다 편집 내용을 입력할 수 있지만 저장에는 연결이 필요합니다"}
        </div>
      )}
      <div className="admin-table-wrap" aria-busy={loading}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>제목</th>
              <th>분야</th>
              <th>종류</th>
              <th>공개</th>
              <th>수정</th>
            </tr>
          </thead>
          <tbody>
            {!filteredEntries.length && (
              <tr>
                <td colSpan={5}>
                  {entries.connected
                    ? "등록된 컨텐츠가 없습니다 새 컨텐츠에서 첫 항목을 작성하세요"
                    : "데이터 연결 후 등록된 컨텐츠를 확인할 수 있습니다"}
                </td>
              </tr>
            )}
            {filteredEntries.map((e) => (
              <tr key={e.id}>
                <td className="wrap">{e.title}</td>
                <td>{divisions.find((d) => d.id === e.division)?.label}</td>
                <td>
                  {e.type === "insight"
                    ? "인사이트"
                    : e.kind === "example"
                      ? "제작 예시"
                      : "고객 사례"}
                </td>
                <td>{e.is_published ? "공개" : "초안"}</td>
                <td>
                  <button
                    aria-label={e.title + " 편집"}
                    onClick={(event) => {
                      if (openEditor(e)) opener.current = event.currentTarget;
                    }}
                  >
                    편집 ↗
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {entries.connected && (
        <div className="admin-toolbar">
          <p>
            총 {entries.total ?? 0}건 · {page} /{" "}
            {Math.max(1, Math.ceil((entries.total ?? 0) / 50))}페이지
          </p>
          <div>
            <button
              className="secondary-button"
              disabled={loading || !!editor || page === 1}
              onClick={() => setPage(page - 1)}
            >
              이전
            </button>
            <button
              className="secondary-button"
              disabled={
                loading || !!editor || page * 50 >= (entries.total ?? 0)
              }
              onClick={() => setPage(page + 1)}
            >
              다음
            </button>
          </div>
        </div>
      )}
      {editor && (
        <form onSubmit={saveEntry} className="entry-editor admin-detail">
          <h2 ref={heading} tabIndex={-1}>
            {editor.id ? "컨텐츠 편집" : "새 컨텐츠"}
          </h2>
          <div className="form-row">
            <label>
              컨텐츠 종류
              <select
                value={editor.type}
                onChange={(e) =>
                  updateEditor(
                    "type",
                    e.target.value as "reference" | "insight",
                  )
                }
              >
                <option value="reference">레퍼런스</option>
                <option value="insight">인사이트</option>
              </select>
            </label>
            <label>
              분야
              <select
                value={editor.division}
                onChange={(e) =>
                  setEditor({
                    ...editor,
                    division: e.target.value,
                    service: divisionServices(e.target.value as DivisionId)[0]
                      .id,
                  })
                }
              >
                {divisions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-row">
            <label>
              서비스
              <select
                value={editor.service}
                onChange={(e) => updateEditor("service", e.target.value)}
              >
                {divisionServices(editor.division as DivisionId).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              주소 슬러그
              <input
                value={editor.slug}
                onChange={(e) => updateEditor("slug", e.target.value)}
                required
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                maxLength={100}
                placeholder="project-name"
              />
            </label>
          </div>
          <label>
            제목
            <input
              required
              minLength={2}
              maxLength={150}
              value={editor.title}
              onChange={(e) => updateEditor("title", e.target.value)}
            />
          </label>
          <label>
            요약
            <textarea
              maxLength={400}
              value={editor.summary}
              onChange={(e) => updateEditor("summary", e.target.value)}
            />
          </label>
          <label>
            본문
            <textarea
              rows={10}
              maxLength={30000}
              value={editor.body}
              onChange={(e) => updateEditor("body", e.target.value)}
              placeholder="본문을 입력하세요 입력한 내용은 일반 텍스트로 표시됩니다"
            />
          </label>
          <div className="form-row">
            <label>
              대표 이미지 경로
              <input
                maxLength={1500}
                value={editor.cover_url}
                onChange={(e) => updateEditor("cover_url", e.target.value)}
                placeholder="/renewal/marketing.webp 또는 Supabase 이미지 URL"
              />
            </label>
            <label>
              컨텐츠 주소
              <input
                maxLength={1500}
                value={editor.video_url}
                onChange={(e) => updateEditor("video_url", e.target.value)}
                placeholder="YouTube 또는 Vimeo HTTPS 주소"
              />
            </label>
          </div>
          {editor.cover_url &&
            (isSafeImageUrl(editor.cover_url) ? (
              <Image
                className="entry-preview"
                src={editor.cover_url}
                alt="저장할 대표 이미지 미리보기"
                width={1200}
                height={800}
                sizes="(max-width:640px) 90vw, 560px"
              />
            ) : (
              <p role="alert" className="form-error">
                사이트 이미지 경로 또는 연결된 저장소의 공개 이미지 주소를
                입력해주세요
              </p>
            ))}
          <label>
            이미지 업로드
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setBusy(true);
                try {
                  const form = new FormData();
                  form.set("file", file);
                  const response = await fetch("/api/admin/media", {
                    method: "POST",
                    body: form,
                  });
                  const data = await response.json();
                  if (!response.ok) throw new Error(data.error);
                  updateEditor("cover_url", data.url);
                  setError(false);
                  setMessage(
                    "이미지를 업로드했습니다 공개 권리를 확인한 뒤 게시해주세요",
                  );
                } catch (e) {
                  setError(true);
                  setMessage(
                    e instanceof Error
                      ? e.message
                      : "이미지 업로드에 실패했습니다",
                  );
                } finally {
                  setBusy(false);
                }
              }}
            />
          </label>
          <div className="form-row">
            <label>
              사례 구분
              <select
                value={editor.kind}
                onChange={(e) =>
                  updateEditor("kind", e.target.value as "case" | "example")
                }
              >
                <option value="example">제작 예시</option>
                <option value="case">실제 고객 사례</option>
              </select>
            </label>
            <label>
              표시 순서
              <input
                type="number"
                min={0}
                max={9999}
                value={editor.display_order}
                onChange={(e) =>
                  updateEditor("display_order", Number(e.target.value))
                }
              />
            </label>
          </div>
          <label className="check-label">
            <input
              type="checkbox"
              checked={editor.rights_confirmed}
              onChange={(e) =>
                setEditor({
                  ...editor,
                  rights_confirmed: e.target.checked,
                  is_published: e.target.checked ? editor.is_published : false,
                })
              }
            />
            내용의 사실과 이미지·컨텐츠·고객 사례의 공개 권리를 확인했습니다
          </label>
          <label className="check-label">
            <input
              type="checkbox"
              disabled={!editor.rights_confirmed}
              checked={editor.is_published}
              onChange={(e) => updateEditor("is_published", e.target.checked)}
            />
            공개 사이트에 게시합니다 체크를 해제하면 비공개로 보관합니다
          </label>
          <label className="check-label">
            <input
              type="checkbox"
              checked={editor.is_featured}
              onChange={(e) => updateEditor("is_featured", e.target.checked)}
            />
            홈의 추천 레퍼런스로 표시
          </label>
          <div className="editor-actions">
            <button className="button" disabled={busy}>
              {busy ? "저장 중…" : "컨텐츠 저장"}
            </button>
            <button
              type="button"
              className="secondary-button"
              disabled={busy}
              onClick={() => {
                if (openEditor(null)) opener.current?.focus();
              }}
            >
              편집 닫기
            </button>
            {savedEntry?.is_published && (
              <a
                className="secondary-button"
                target="_blank"
                rel="noopener noreferrer"
                href={
                  "/" +
                  divisions.find((d) => d.id === savedEntry.division)?.path +
                  "/" +
                  (savedEntry.type === "reference" ? "work" : "insights") +
                  "/" +
                  savedEntry.slug
                }
              >
                저장된 공개 페이지 보기 <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
