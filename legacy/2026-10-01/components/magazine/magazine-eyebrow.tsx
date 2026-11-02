interface Props {
  children: React.ReactNode;
  /** Line color — default ink-3, "ink" for stronger */
  lineColor?: "ink-3" | "ink";
  /** Text color — default ink-2 */
  textColor?: "ink-2" | "ink-3";
  /** Render rule lines on both sides */
  withRules?: boolean;
  className?: string;
}

/**
 * Magazine tone eyebrow — small jetbrains-mono uppercase label with optional rule lines.
 * Use as section header above the H2.
 */
export function MagazineEyebrow({
  children,
  lineColor = "ink-3",
  textColor = "ink-2",
  withRules = true,
  className = "",
}: Props) {
  const line = lineColor === "ink" ? "var(--tone-magazine-ink)" : "var(--tone-magazine-ink-3)";
  const text = textColor === "ink-3" ? "var(--tone-magazine-ink-3)" : "var(--tone-magazine-ink-2)";

  return (
    <div
      className={`inline-flex items-center gap-[14px] ${className}`}
      style={{
        fontFamily: "var(--font-jetbrains)",
        fontSize: "11.5px",
        color: text,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
      }}
    >
      {withRules && (
        <span style={{ width: 28, height: 1, background: line, display: "inline-block" }} />
      )}
      {children}
      {withRules && (
        <span style={{ width: 28, height: 1, background: line, display: "inline-block" }} />
      )}
    </div>
  );
}
