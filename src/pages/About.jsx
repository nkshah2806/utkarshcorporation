import { Leaf, ShieldCheck, HeartHandshake, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useContent } from "@/context/ContentContext";
import { mediaSrc } from "@/lib/api";
import LocalizedText from "@/components/LocalizedText";

const ICON_MAP = { Leaf, ShieldCheck, HeartHandshake, Sparkles };

export default function About() {
  const { t } = useTranslation();
  const { content } = useContent();
  const { mission, about } = content;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={mediaSrc(about?.heroImage || mission?.image)} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-40 text-[#F9F6F0] text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-4">{t("about.ourStory")}</div>
          <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            <LocalizedText value={about?.heroTitleLine1} fallback={t("about.heroTitleLine1")} /> <br />
            <span className="italic text-[#C5A059]"><LocalizedText value={about?.heroTitleLine2} fallback={t("about.heroTitleLine2")} /></span>
          </h1>
          <p className="text-lg text-[#F9F6F0]/85 max-w-2xl mx-auto">
            <LocalizedText value={about?.heroDescription || mission?.paragraph1} />
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="prose prose-lg max-w-none text-[#1A3626]">
          <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1A3626] mb-6"><LocalizedText value={about?.storyTitle} fallback={t("about.storyTitle")} /></h2>
          <p className="text-[#1A3626]/85 leading-relaxed mb-6">
            <LocalizedText value={mission?.paragraph1} />
          </p>
          <p className="text-[#1A3626]/85 leading-relaxed mb-6">
            <LocalizedText value={mission?.paragraph2} />
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20 border-y border-[#1A3626]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-3">{t("about.whatWeStandFor")}</div>
            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#1A3626]">{t("about.ourValues")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(about?.values || []).map((v) => {
              const IconComp = ICON_MAP[v.icon] || Leaf;
              return (
                <div key={v.title} className="bg-[#F9F6F0] rounded-2xl p-6 border border-[#1A3626]/10">
                  <div className="w-12 h-12 rounded-full bg-[#C5A059]/20 flex items-center justify-center mb-4">
                    <IconComp className="w-5 h-5 text-[#5C4033]" />
                  </div>
                  <h4 className="font-serif-display text-xl text-[#1A3626] mb-2"><LocalizedText value={v.title} /></h4>
                  <p className="text-sm text-[#1A3626]/70"><LocalizedText value={v.body} /></p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden aspect-[5/4]">
            <img src={mediaSrc(about?.heroImage || mission?.image)} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-3">{t("about.certifications")}</div>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1A3626] mb-6">{t("about.trustedTested")}</h2>
            <ul className="space-y-4">
              {(about?.certifications || []).map((c) => (
                <li key={c.title} className="flex gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-[#C5A059] shrink-0" />
                  <div>
                    <div className="font-semibold text-[#1A3626]"><LocalizedText value={c.title} /></div>
                    <div className="text-sm text-[#1A3626]/70"><LocalizedText value={c.body} /></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

