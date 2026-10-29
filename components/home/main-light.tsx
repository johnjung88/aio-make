/** The four brand planes decorate the existing photograph; this is not a logo. */
export function MainLight() {
  return (
    <svg
      className="main-light"
      viewBox="0 0 1440 800"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="home-dev" x1="0" y1="1" x2="1" y2="0">
          <stop stopColor="var(--brand-blue)" />
          <stop offset="1" stopColor="var(--brand-cyan)" />
        </linearGradient>
        <linearGradient id="home-content" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="var(--brand-pink)" />
          <stop offset="1" stopColor="var(--brand-rose)" />
        </linearGradient>
        <linearGradient id="home-design" x1="0" y1="1" x2="1" y2="0">
          <stop stopColor="var(--brand-orange)" />
          <stop offset="1" stopColor="var(--brand-yellow)" />
        </linearGradient>
        <linearGradient id="home-growth" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="var(--brand-green)" />
          <stop offset="1" stopColor="var(--brand-mint)" />
        </linearGradient>
      </defs>
      <path
        d="M 170 520 L 460 28 Q 475 8 500 8 L 720 8"
        stroke="url(#home-dev)"
      />
      <path
        d="M 720 8 L 940 8 Q 965 8 980 28 L 1270 520"
        stroke="url(#home-content)"
      />
      <path d="M 0 800 L 170 520" stroke="url(#home-design)" />
      <path d="M 1270 520 L 1440 800" stroke="url(#home-growth)" />
    </svg>
  );
}
