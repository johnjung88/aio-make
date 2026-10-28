import { useId } from "react";

/** AIO's four planes, drawn as a lightweight decorative prism, not a new logo. */
export function Prism() {
  const id = `prism-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 600 790" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient
          id={`${id}-blue`}
          x1="300"
          y1="25"
          x2="100"
          y2="540"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--cyan)" />
          <stop offset=".42" stopColor="var(--blue)" />
          <stop offset="1" stopColor="var(--cyan)" />
        </linearGradient>
        <linearGradient
          id={`${id}-pink`}
          x1="340"
          y1="50"
          x2="490"
          y2="525"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--pink)" />
          <stop offset=".3" stopColor="var(--orange)" />
          <stop offset=".65" stopColor="var(--rose)" />
          <stop offset="1" stopColor="var(--orange)" />
        </linearGradient>
        <linearGradient
          id={`${id}-gold`}
          x1="180"
          y1="366"
          x2="420"
          y2="480"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--yellow)" />
          <stop offset="1" stopColor="var(--orange)" />
        </linearGradient>
        <linearGradient
          id={`${id}-green`}
          x1="190"
          y1="430"
          x2="430"
          y2="470"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--cyan)" />
          <stop offset="1" stopColor="var(--mint)" />
        </linearGradient>
        <radialGradient id={`${id}-aura`}>
          <stop stopColor="var(--blue)" stopOpacity=".65" />
          <stop offset="1" stopColor="var(--blue)" stopOpacity="0" />
        </radialGradient>
        <linearGradient
          id={`${id}-fade`}
          x1="0"
          y1="545"
          x2="0"
          y2="770"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity=".5" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask id={`${id}-reflection`}>
          <path d="M0 540H600V790H0Z" fill={`url(#${id}-fade)`} />
        </mask>
        <filter id={`${id}-glow`} x="-50%" y="-35%" width="200%" height="180%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
        <g id={`${id}-mark`} strokeWidth="1.7" strokeLinejoin="round">
          <path
            d="M298 26 337 49 180 488 53 543Z"
            fill={`url(#${id}-blue)`}
            stroke="var(--cyan)"
          />
          <path
            d="m298 26 39 23 211 493-137-55Z"
            fill={`url(#${id}-pink)`}
            stroke="var(--rose)"
          />
          <path
            d="m337 49 28 16 210 491-27-14Z"
            fill="var(--pink)"
            fillOpacity=".6"
            stroke="var(--rose)"
          />
          <path
            d="m298 26 39 23-96 266-39 48Z"
            fill="var(--cyan)"
            fillOpacity=".4"
            stroke="var(--cyan)"
          />
          <path
            d="m179 366 180 0 43 93-257 0Z"
            fill={`url(#${id}-green)`}
            stroke="var(--cyan)"
          />
          <path
            d="m145 459 55-43 202 43-222 29-127 55Z"
            fill={`url(#${id}-gold)`}
            stroke="var(--yellow)"
          />
          <path
            d="m337 49 22 317 43 93 9 28Z"
            fill="var(--yellow)"
            fillOpacity=".26"
          />
          <path
            d="m298 26-96 337m135-314 74 438M179 366h180"
            stroke="var(--text)"
            strokeOpacity=".7"
          />
        </g>
      </defs>
      <ellipse cx="300" cy="310" rx="300" ry="310" fill={`url(#${id}-aura)`} />
      <g opacity=".58" filter={`url(#${id}-glow)`}>
        <use href={`#${id}-mark`} />
      </g>
      <use href={`#${id}-mark`} />
      <g mask={`url(#${id}-reflection)`}>
        <use href={`#${id}-mark`} transform="translate(0 770) scale(1 -.42)" />
      </g>
      <ellipse
        cx="300"
        cy="548"
        rx="258"
        ry="8"
        fill="var(--cyan)"
        opacity=".22"
        filter={`url(#${id}-glow)`}
      />
    </svg>
  );
}
