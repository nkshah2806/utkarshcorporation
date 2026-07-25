import { Leaf, ShieldCheck, HeartHandshake, Sparkles } from "lucide-react";
import { useContent } from "@/context/ContentContext";

const IMG_MISSION = "https://images.unsplash.com/photo-1492552085122-36706c238263?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600";
const IMG_LEAF = "https://images.unsplash.com/photo-1525923838299-2312b60f6d69?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600";

export default function About() {
  const { content } = useContent();
  const { mission } = content;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={mission?.image || IMG_MISSION} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-40 text-[#F9F6F0] text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-4">Our Story</div>
          <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Progress for every family, <br />through the science of Ayurveda.
          </h1>
          <p className="text-lg text-[#F9F6F0]/85 max-w-2xl mx-auto">
            {mission?.paragraph1 || "Utkarsh Corporation is more than a brand. It is a movement — supporting India's small Ayurvedic manufacturers, doctors and farmers to bring authentic wellness to every home."}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="prose prose-lg max-w-none text-[#1A3626]">
          <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1A3626] mb-6">Rooted in tradition. Driven by purpose.</h2>
          <p className="text-[#1A3626]/85 leading-relaxed mb-6">
            {mission?.paragraph1}
          </p>
          <p className="text-[#1A3626]/85 leading-relaxed mb-6">
            {mission?.paragraph2}
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20 border-y border-[#1A3626]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-3">What we stand for</div>
            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#1A3626]">Our values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Leaf, title: "Authenticity", body: "Classical formulations, verified ingredients, transparent sourcing." },
              { icon: ShieldCheck, title: "Quality", body: "GMP-certified facilities, batch testing, AYUSH compliance." },
              { icon: HeartHandshake, title: "Community", body: "Fair trade with small manufacturers, empowering local artisans." },
              { icon: Sparkles, title: "Wellness", body: "Free camps, health education, and doctor-led awareness." },
            ].map((v) => (
              <div key={v.title} className="bg-[#F9F6F0] rounded-2xl p-6 border border-[#1A3626]/10">
                <div className="w-12 h-12 rounded-full bg-[#C5A059]/20 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-[#5C4033]" />
                </div>
                <h4 className="font-serif-display text-xl text-[#1A3626] mb-2">{v.title}</h4>
                <p className="text-sm text-[#1A3626]/70">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden aspect-[5/4]">
            <img src={IMG_LEAF} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-3">Certifications</div>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1A3626] mb-6">Trusted, tested and traceable.</h2>
            <ul className="space-y-4">
              {[
                { title: "GMP Certified", body: "All manufacturing units follow Good Manufacturing Practices." },
                { title: "AYUSH Compliant", body: "Approved by the Ministry of AYUSH, Government of India." },
                { title: "ISO 9001", body: "International quality management standards for consistency." },
                { title: "Lab Tested", body: "Every batch is independently tested for potency and safety." },
              ].map((c) => (
                <li key={c.title} className="flex gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-[#C5A059] shrink-0" />
                  <div>
                    <div className="font-semibold text-[#1A3626]">{c.title}</div>
                    <div className="text-sm text-[#1A3626]/70">{c.body}</div>
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
