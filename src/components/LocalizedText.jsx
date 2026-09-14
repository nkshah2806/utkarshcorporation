import { useTranslatedText } from "@/hooks/useTranslatedText";

/**
 * Renders a dynamic (database/API) value in the active language.
 *
 * - Localized objects `{ en, hi, gu }` are resolved client-side (no API call).
 * - Plain English strings are machine-translated via the secure backend and
 *   cached (memory + localStorage).
 * - While a translation is loading we show a graceful placeholder / the original
 *   text — never `undefined`, `null` or `[object Object]`.
 */
export default function LocalizedText({ value, fallback = "", placeholder, className, as }) {
    const text = useTranslatedText(value, fallback);
    const Tag = as || "span";

    if ((text === undefined || text === null || text === "") && placeholder) {
        return <Tag className={className}>{placeholder}</Tag>;
    }

    return <Tag className={className}>{text || fallback}</Tag>;
}
