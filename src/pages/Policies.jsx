import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { PageLoader } from "@/components/Loader";
import {
  legalContentService,
  LEGAL_CONTENT_TYPES,
} from "@/services/legalContentService";
import LocalizedText from "@/components/LocalizedText";

// Terms & Conditions and Privacy Policy are served from the backend so the
// site always shows the currently-active documents configured by the admin.
const SLUG_TO_TYPE = {
  terms: LEGAL_CONTENT_TYPES.TERMS_CONDITIONS,
  privacy: LEGAL_CONTENT_TYPES.PRIVACY_POLICY,
};

/**
 * Renders policy body text. Blocks that are exactly a `**Heading**` line are
 * turned into headings; everything else is rendered as a paragraph.
 */
function PolicyBody({ body }) {
  return String(body || "")
    .split("\n\n")
    .map((para, i) => {
      const heading = para.match(/^\*\*(.+)\*\*$/);
      if (heading) {
        return (
          <h2
            key={i}
            className="font-bold text-[#1A3626] text-lg mt-6 mb-2 first:mt-0"
          >
            <LocalizedText value={heading[1]} />
          </h2>
        );
      }
      return (
        <p
          key={i}
          className="text-[#1A3626]/85 leading-relaxed mb-4 whitespace-pre-line"
        >
          <LocalizedText value={para} />
        </p>
      );
    });
}

function PolicyLinks() {
  const { t } = useTranslation();
  return (
    <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-sm">
      <Link to="/policies/return" className="text-[#1A3626]/70 hover:text-[#C5A059]">{t("policies.returns")}</Link>
      <Link to="/policies/shipping" className="text-[#1A3626]/70 hover:text-[#C5A059]">{t("policies.shipping")}</Link>
      <Link to="/policies/terms" className="text-[#1A3626]/70 hover:text-[#C5A059]">{t("policies.terms")}</Link>
      <Link to="/policies/privacy" className="text-[#1A3626]/70 hover:text-[#C5A059]">{t("policies.privacy")}</Link>
    </div>
  );
}

export default function Policies() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const liveType = SLUG_TO_TYPE[slug];
  const isLive = Boolean(liveType);
  const staticItem =
    slug === "return"
      ? { title: t("policies.returnPolicy.title"), body: t("policies.returnPolicy.body") }
      : slug === "shipping"
        ? { title: t("policies.shippingPolicy.title"), body: t("policies.shippingPolicy.body") }
        : null;

  const [live, setLive] = useState(null);
  const [loadState, setLoadState] = useState(isLive ? "loading" : "ready"); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!isLive) return;
    let cancelled = false;
    setLoadState("loading");
    setLive(null);
    setErrorMsg("");
    (async () => {
      try {
        const active = await legalContentService.getActiveContent(liveType);
        if (cancelled) return;
        setLive(active);
        setLoadState("ready");
      } catch (err) {
        if (cancelled) return;
        setErrorMsg(err?.message || t("policies.loadErrorMessage"));
        setLoadState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [liveType, isLive, attempt, t]);

  // -------------------------------------------------------------------------
  // Unknown slug
  // -------------------------------------------------------------------------
  if (!isLive && !staticItem) {
    return (
      <div className="max-w-3xl mx-auto p-16 text-center">
        <h1 className="font-serif-display text-3xl text-[#1A3626] mb-4">{t("policies.notFoundTitle")}</h1>
        <Link to="/" className="text-[#C5A059] underline">{t("policies.backToHome")}</Link>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Backend-driven pages (terms / privacy)
  // -------------------------------------------------------------------------
  if (isLive) {
    let body = null;

    if (loadState === "loading") {
      body = <PageLoader label={t("policies.loadingLatest")} minHeight="18rem" />;
    } else if (loadState === "error") {
      body = (
        <div className="text-center py-14">
          <div className="text-[#1A3626]/80 text-sm mb-4">{errorMsg}</div>
          <button
            type="button"
            onClick={() => setAttempt((a) => a + 1)}
            className="rounded-full px-5 py-2 bg-[#1A3626] text-[#F9F6F0] text-sm font-semibold hover:bg-[#2C4C3B] transition"
          >
            {t("policies.tryAgain")}
          </button>
        </div>
      );
    } else if (!live) {
      body = (
        <div className="text-center py-14">
          <div className="font-serif-display text-xl text-[#1A3626] mb-2">
            {t("policies.notPublished")}
          </div>
          <p className="text-sm text-[#1A3626]/70 max-w-md mx-auto">
            {t("policies.notPublishedDesc")}
          </p>
        </div>
      );
    } else {
      body = (
        <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-8">
          <PolicyBody body={live.content} />
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-3">{t("policies.title")}</div>
        <h1 className="font-serif-display text-4xl sm:text-5xl text-[#1A3626] mb-8">
          {live && loadState === "ready" ? (
            <LocalizedText value={live.title} />
          ) : (
            <span>{slug === "privacy" ? t("policies.privacyPolicy") : t("policies.termsConditions")}</span>
          )}
        </h1>
        {body}
        <PolicyLinks />
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Static pages (return / shipping)
  // -------------------------------------------------------------------------
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <div className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-3">{t("policies.title")}</div>
      <h1 className="font-serif-display text-4xl sm:text-5xl text-[#1A3626] mb-8">
        <span>{staticItem.title}</span>
      </h1>
      <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-8">
        <PolicyBody body={staticItem.body} />
      </div>
      <PolicyLinks />
    </div>
  );
}
