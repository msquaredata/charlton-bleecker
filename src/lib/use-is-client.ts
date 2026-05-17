import { useSyncExternalStore } from "react";

/** True after hydration; false during SSR. */
export function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
