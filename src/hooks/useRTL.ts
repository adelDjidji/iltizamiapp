import { useSelector } from "react-redux";

/**
 * Returns direction-aware style helpers based on the current language.
 * Use `isRTL` to conditionally apply right-to-left styles without
 * requiring an app reload.
 */
export function useRTL() {
  const language =
    useSelector((state: any) => state.settings?.language as "ar" | "en") ??
    "ar";
  const isRTL = language === "ar";

  return {
    isRTL,
    /** "row-reverse" for Arabic, "row" for English */
    flexRow: isRTL ? ("row-reverse" as const) : ("row" as const),
    /** "right" for Arabic, "left" for English */
    textAlign: isRTL ? ("right" as const) : ("left" as const),
  };
}
