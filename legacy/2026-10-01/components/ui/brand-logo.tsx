import Image from "next/image";

type BrandLogoVariant = "header" | "footer" | "hero";

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  className?: string;
}

/**
 * 정사각형 아이코닉 로고 (/brand/aio-logo.png) 단일 소스.
 * variant 별 사이즈만 다름.
 */
const styles: Record<
  BrandLogoVariant,
  { size: number; className: string }
> = {
  header: {
    size: 48,
    className: "h-10 w-10 md:h-12 md:w-12",
  },
  footer: {
    size: 80,
    className: "h-16 w-16",
  },
  hero: {
    size: 120,
    className: "h-24 w-24 md:h-28 md:w-28",
  },
};

export function BrandLogo({
  variant = "header",
  className = "",
}: BrandLogoProps) {
  const style = styles[variant];

  return (
    <span
      className={`inline-flex items-center ${style.className} ${className}`}
      aria-label="AIO All-In-One Agency"
    >
      <Image
        src="/brand/aio-logo.png"
        alt="AIO All-In-One Agency"
        width={style.size}
        height={style.size}
        priority={variant === "header"}
        className="h-full w-full object-contain"
      />
    </span>
  );
}
