import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  variant?: "header" | "footer";
};

export function BrandLogo({ variant = "header" }: BrandLogoProps) {
  const isFooter = variant === "footer";

  return (
    <Link
      href="/"
      aria-label="WC26 Hub home"
      className={[
        "group inline-flex min-w-0 items-center",
        isFooter
          ? "max-w-[260px]"
          : "max-w-[210px] sm:max-w-[280px] md:max-w-[340px] lg:max-w-[420px]",
      ].join(" ")}
    >
      <Image
        src="/brand/wc26-hub-horizontal.png"
        alt="WC26 Hub"
        width={900}
        height={360}
        priority={!isFooter}
        className={[
          "block h-auto w-full object-contain",
          "drop-shadow-[0_0_18px_rgba(0,245,255,0.22)]",
          isFooter ? "max-h-16" : "max-h-14 sm:max-h-16",
        ].join(" ")}
      />
    </Link>
  );
}
