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
        "group inline-flex min-w-0 items-center gap-3",
        isFooter ? "max-w-full" : "max-w-[220px] sm:max-w-[320px] lg:max-w-[420px]",
      ].join(" ")}
    >
      <span className="relative flex shrink-0 items-center justify-center">
        <Image
          src="/brand/wc26-hub-icon.png"
          alt=""
          width={72}
          height={72}
          priority={!isFooter}
          className={[
            "shrink-0 rounded-2xl object-contain",
            "drop-shadow-[0_0_18px_rgba(168,255,35,0.45)]",
            isFooter ? "h-11 w-11" : "h-11 w-11 sm:h-12 sm:w-12",
          ].join(" ")}
        />
      </span>

      <span className="min-w-0 sm:hidden">
        <span className="block truncate text-[1rem] font-black uppercase leading-none tracking-[0.22em] text-white">
          WC26 HUB
        </span>
        <span className="mt-1 block truncate text-[0.62rem] font-black uppercase tracking-[0.18em] text-cyan-200/80">
          Fan Chaos
        </span>
      </span>

      <Image
        src="/brand/wc26-hub-horizontal.png"
        alt="WC26 Hub"
        width={520}
        height={180}
        priority={!isFooter}
        className={[
          "hidden object-contain sm:block",
          "drop-shadow-[0_0_18px_rgba(0,245,255,0.22)]",
          isFooter
            ? "h-14 w-auto max-w-[260px]"
            : "h-14 w-auto max-w-[260px] md:max-w-[320px] xl:max-w-[390px]",
        ].join(" ")}
      />
    </Link>
  );
}
