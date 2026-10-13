"use client";

import { useRef, type KeyboardEvent } from "react";

export type JourneyTabItem = { id: string; label: string };

export const tabId = (prefix: string, id: string) => `${prefix}-tab-${id}`;
export const panelId = (prefix: string, id: string) => `${prefix}-panel-${id}`;

// Roving-tabindex tab list: ←/→ move, Home/End jump, selection follows focus.
export function JourneyTabList({
  prefix,
  label,
  items,
  selected,
  onSelect,
}: {
  prefix: string;
  label: string;
  items: JourneyTabItem[];
  selected: number;
  onSelect: (index: number) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const move = (index: number) => {
    const next = (index + items.length) % items.length;
    onSelect(next);
    refs.current[next]?.focus();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, () => void> = {
      ArrowRight: () => move(selected + 1),
      ArrowLeft: () => move(selected - 1),
      Home: () => move(0),
      End: () => move(items.length - 1),
    };
    const action = keys[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  };
  return (
    <div className="wj-tabs" role="tablist" aria-label={label}>
      {items.map((item, index) => (
        <button
          key={item.id}
          ref={(node) => {
            refs.current[index] = node;
          }}
          type="button"
          role="tab"
          id={tabId(prefix, item.id)}
          className="wj-tab t-chip"
          aria-selected={index === selected}
          aria-controls={panelId(prefix, item.id)}
          tabIndex={index === selected ? 0 : -1}
          onClick={() => onSelect(index)}
          onKeyDown={onKeyDown}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
