import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronDown, Globe, Loader2 } from "lucide-react";
import { SUPPORTED_LANGUAGES, getLanguageMeta } from "@/i18n/config";

/**
 * Global language selector. Available everywhere via the Header (desktop +
 * mobile). Uses React state through react-i18next — no DOM manipulation, no
 * `google_translate_element`, no page reload. Selection persists via
 * `localStorage` (see `src/i18n/index.js`).
 */
export default function LanguageSelector({ variant = "desktop" }) {
    const { i18n, t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [switching, setSwitching] = useState(false);
    const ref = useRef(null);

    const current = getLanguageMeta(i18n.language);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const change = async (code) => {
        setOpen(false);
        if (code === i18n.language) return;
        setSwitching(true);
        try {
            await i18n.changeLanguage(code);
        } finally {
            setSwitching(false);
        }
    };

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                data-testid="language-selector"
                aria-label={t("language.select")}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 px-3 py-2 rounded-full border border-[#1A3626]/15 hover:bg-[#1A3626]/10 transition text-sm font-medium text-[#1A3626]"
            >
                {switching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Globe className="w-4 h-4" />
                )}
                <span className={variant === "mobile" ? "" : "hidden xl:inline"}>
                    {current.nativeLabel}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {open && (
                <div
                    role="listbox"
                    className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#1A3626]/10 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                    {SUPPORTED_LANGUAGES.map((lang) => {
                        const active = lang.code === i18n.language;
                        return (
                            <button
                                key={lang.code}
                                type="button"
                                role="option"
                                aria-selected={active}
                                data-testid={`language-option-${lang.code}`}
                                onClick={() => change(lang.code)}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition ${active
                                        ? "bg-[#F9F6F0] text-[#1A3626] font-semibold"
                                        : "text-[#1A3626]/80 hover:bg-[#F9F6F0]"
                                    }`}
                            >
                                <span className="flex flex-col items-start leading-tight">
                                    <span>{lang.nativeLabel}</span>
                                    <span className="text-[10px] uppercase tracking-wider text-[#5C4033]">
                                        {lang.label}
                                    </span>
                                </span>
                                {active && <Check className="w-4 h-4 text-[#C5A059]" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
