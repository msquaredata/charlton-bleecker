import { ONE_PAGER_VARIANTS } from "@/data/onePagerContent";

export const ONE_PAGER_SLUGS = ONE_PAGER_VARIANTS.map((v) => v.slug);

export type OnePagerSlug = (typeof ONE_PAGER_VARIANTS)[number]["slug"];

export function isOnePagerSlug(value: string): value is OnePagerSlug {
  return ONE_PAGER_SLUGS.includes(value as OnePagerSlug);
}

export function onePagerPdfFilename(slug: OnePagerSlug): string {
  return `charlton-bleecker-one-pager-${slug}.pdf`;
}

export function isSinglePagePdf(slug: OnePagerSlug): boolean {
  return slug === "model";
}
