import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import {
  legalContentService,
  LEGAL_CONTENT_TYPES,
} from "@/services/legalContentService";

// ---------------------------------------------------------------------------
// Static policy pages (no backend-managed content exists for these).
// Return & Shipping policies are intentionally kept local.
// ---------------------------------------------------------------------------
const CONTENT = {
  return: {
    title: "Return & Refund Policy",
    body: `We stand behind every Utkarsh product. If you're not satisfied, return unopened items within 7 days of delivery for a full refund.

**Eligibility**
• Product must be unopened and in original packaging.
• Return request initiated within 7 days.
• Consumables opened for use are non-returnable for hygiene reasons.

**How to return**
1. Email us or WhatsApp us with your order number.
2. Pack the item securely.
3. Our courier will pick up within 3-5 business days.

**Refund timeline**
Refunds are processed within 5-7 business days once we receive the item. Amount is credited to the original payment method (or bank transfer for COD orders).`,
  },
  shipping: {
    title: "Shipping Policy",
    body: `We ship pan-India via trusted courier partners.

**Delivery timelines**
• Metro cities: 2-4 business days.
• Other cities/towns: 4-7 business days.
• Remote pincodes: 7-10 business days.

**Shipping charges**
• Free shipping on orders above ₹499.
• Below ₹499: flat ₹49 shipping.

**Order tracking**
Once dispatched, you'll receive a tracking number via SMS/email. You can also view live status from your account page.

**Cash on Delivery**
Available across India. No extra charges.`,
  },
};

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
            <span>{heading[1]}</span>
          </h2>
        );
      }
      return (
        <p
          key={i}
          className="text-[#1A3626]/85 leading-relaxed mb-4 whitespace-pre-line"
        >
          <span>{para}</span>
        </p>
      );
    });
}

function PolicyLinks() {
  return (
    <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-sm">
      <Link to="/policies/return" className="text-[#1A3626]/70 hover:text-[#C5A059]">Returns</Link>
      <Link to="/policies/shipping" className="text-[#1A3626]/70 hover:text-[#C5A059]">Shipping</Link>
      <Link to="/policies/terms" className="text-[#1A3626]/70 hover:text-[#C5A059]">Terms</Link>
      <Link to="/policies/privacy" className="text-[#1A3626]/70 hover:text-[#C5A059]">Privacy</Link>
    </div>
  );
}

export default function Policies() {
  const { slug } = useParams();
  const liveType = SLUG_TO_TYPE[slug];
  const isLive = Boolean(liveType);
  const staticItem = CONTENT[slug];

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
        setErrorMsg(err?.message || "Unable to load this policy right now.");
        setLoadState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [liveType, isLive, attempt]);

  // -------------------------------------------------------------------------
  // Unknown slug
  // -------------------------------------------------------------------------
  if (!isLive && !staticItem) {
    return (
      <div className="max-w-3xl mx-auto p-16 text-center">
        <h1 className="font-serif-display text-3xl text-[#1A3626] mb-4">Policy not found</h1>
        <Link to="/" className="text-[#C5A059] underline">Back to home</Link>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Backend-driven pages (terms / privacy)
  // -------------------------------------------------------------------------
  if (isLive) {
    let body = null;

    if (loadState === "loading") {
      body = (
        <div className="flex items-center justify-center py-16 text-[#1A3626]/70">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span>Loading latest policy…</span>
        </div>
      );
    } else if (loadState === "error") {
      body = (
        <div className="text-center py-14">
          <div className="text-[#1A3626]/80 text-sm mb-4">{errorMsg}</div>
          <button
            type="button"
            onClick={() => setAttempt((a) => a + 1)}
            className="rounded-full px-5 py-2 bg-[#1A3626] text-[#F9F6F0] text-sm font-semibold hover:bg-[#2C4C3B] transition"
          >
            Try again
          </button>
        </div>
      );
    } else if (!live) {
      body = (
        <div className="text-center py-14">
          <div className="font-serif-display text-xl text-[#1A3626] mb-2">
            This policy has not been published yet
          </div>
          <p className="text-sm text-[#1A3626]/70 max-w-md mx-auto">
            Please check back soon. Our team updates this page as soon as new
            content is made available.
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
        <div className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-3">Policies</div>
        <h1 className="font-serif-display text-4xl sm:text-5xl text-[#1A3626] mb-8">
          <span>{live && loadState === "ready" ? live.title : slug === "privacy" ? "Privacy Policy" : "Terms & Conditions"}</span>
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
      <div className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-3">Policies</div>
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
