import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    pickLocalized,
    pickLocalizedWithLang,
    translateText,
    getCachedTranslation,
    isTranslatable,
} from "@/lib/translate";
import { DEFAULT_LANGUAGE } from "@/i18n/config";

/**
 * Resolve a dynamic value (from the API/DB) into the active language.
 *
 * - Localized object (`{ en, hi, gu }`) -> resolved synchronously (no network).
 * - Plain English string -> translated through the secure backend, cached.
 * - Returns the original text immediately, then swaps in the translation once
 *   available (so the UI never goes blank or shows `undefined`).
 *
 * IMPORTANT: `lang` is part of the effect dependency array, so switching the
 * application language re-runs the resolution immediately — no refresh needed.
 */
export function useTranslatedText(value, fallback = "") {
    const { i18n } = useTranslation();
    const lang = i18n.language || DEFAULT_LANGUAGE;
    const activeLang = (lang || DEFAULT_LANGUAGE).split("-")[0];

    const resolveBase = () =>
        value === undefined || value === null
            ? fallback
            : pickLocalized(value, lang) || fallback;

    const [text, setText] = useState(resolveBase);

    useEffect(() => {
        let active = true;
        setText(resolveBase());

        // A localized object only counts as "already translated" when it
        // truly supplied the active language. Backfilled rows (`hi === en`)
        // fall through so the English source is machine-translated instead.
        let objectHasActiveLang = false;
        if (value && typeof value === "object" && !Array.isArray(value)) {
            const picked = pickLocalizedWithLang(value, lang);
            objectHasActiveLang = Boolean(picked) && picked.fromLang === activeLang;
        }

        // The text to translate is whatever `pickLocalized` resolved — for a
        // plain string that is the string itself; for a localized object that
        // fell back to English it is the English source.
        const sourceText = pickLocalized(value, lang);

        const needsTranslation =
            activeLang !== DEFAULT_LANGUAGE &&
            !objectHasActiveLang &&
            typeof sourceText === "string" &&
            isTranslatable(sourceText);

        if (needsTranslation) {
            const cached = getCachedTranslation(sourceText, lang);
            if (cached !== null) {
                setText(cached);
            } else {
                translateText(sourceText, lang)
                    .then((translated) => {
                        if (active && translated) setText(translated);
                    })
                    .catch(() => { });
            }
        }

        return () => {
            active = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, lang, fallback]);

    return text;
}

export default useTranslatedText;
