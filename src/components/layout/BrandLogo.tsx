import Image from "next/image";
import { cn } from "@/lib/utils";

/** Full-color lockup — white background; works on `bg-[var(--color-bg)]`. */
const LOGO_SRC = "/cbg-logo.png";

type BrandLogoProps = {
  className?: string;
};

export default function BrandLogo({ className }: BrandLogoProps) {
  return (
    <Image
      src={LOGO_SRC}
      alt="Charlton Bleecker"
      width={830}
      height={160}
      className={cn(
        "h-14 w-auto object-contain object-left sm:h-16 md:h-[4.75rem] lg:h-20",
        className,
      )}
      priority
    />
  );
}
