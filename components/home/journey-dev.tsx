"use client";

import { useMemo, useRef, useState } from "react";
import {
  devCopy,
  devFallback,
  devFallbackSteps,
  type DevProject,
} from "@/lib/home-journey";
import { CompareBlock, type CompareModel, type OpenState } from "./journey-dev-compare";
import {
  DetailDialog,
  type DetailContent,
  type ModalState,
} from "./journey-detail-dialog";
import "./journey-dev.css";

// 01 개발 (R7): one case, no tabs. Review builds pass the server-selected
// case; public builds pass null and show one neutral example frame.
function toModel(project: DevProject | null): CompareModel {
  if (!project)
    return {
      pc: { before: null, after: devFallback.media },
      mobile: null,
      caption: null,
    };
  const { before, after, afterMobile } = project;
  return {
    pc: { before: before?.pc ?? null, after },
    mobile:
      before && afterMobile
        ? { before: before.mobile, after: afterMobile }
        : null,
    caption: before?.caption ?? null,
  };
}

function toContent(project: DevProject | null): DetailContent {
  if (!project)
    return {
      title: devFallback.title,
      tag: devFallback.tag,
      description: devFallback.description,
      sections: [],
      steps: devFallbackSteps,
    };
  const { detail } = project;
  return {
    title: detail.title,
    tag: detail.status,
    description: detail.description,
    sections: [
      { label: devCopy.purposeLabel, text: detail.purpose },
      { label: devCopy.scopeLabel, text: detail.scope },
    ],
    steps: [],
  };
}

export function JourneyDev({ project }: { project: DevProject | null }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const count = useRef(0);
  const [modal, setModal] = useState<ModalState | null>(null);
  const model = useMemo(() => toModel(project), [project]);
  const content = useMemo(() => toContent(project), [project]);
  const title = project ? project.title : devFallback.title;
  const tag = project ? project.detail.status : devFallback.tag;

  const open = (state: OpenState, button: HTMLButtonElement) => {
    opener.current = button;
    count.current += 1;
    setModal({ ...state, id: count.current });
    dialog.current?.showModal();
  };

  return (
    <div className="wj-dev">
      <div className="wj-dev-head">
        <h3 className="wj-item-title t-h3">{title}</h3>
        <span className="wj-tag t-caption">{tag}</span>
      </div>
      <CompareBlock model={model} onOpen={open} />
      <DetailDialog
        dialogRef={dialog}
        model={model}
        content={content}
        state={modal}
        onClosed={() => {
          setModal(null);
          opener.current?.focus();
        }}
      />
    </div>
  );
}
