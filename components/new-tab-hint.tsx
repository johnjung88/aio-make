import { NEW_TAB_HINT } from "@/lib/new-tab";
import "./new-tab-hint.css";

// Visually hidden suffix for links that open in a new tab (see lib/new-tab.ts).
export function NewTabHint() {
  return <span className="new-tab-hint">({NEW_TAB_HINT})</span>;
}
