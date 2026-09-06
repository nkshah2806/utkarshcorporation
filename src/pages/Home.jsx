import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productsService } from "@/services/productsService";
import { categoriesService } from "@/services/categoriesService";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, ShieldCheck, Leaf, Truck, HeartHandshake, Sparkles, Quote } from "lucide-react";
import { TID } from "@/constants/testIds";
import { useContent } from "@/context/ContentContext";

const ICON_MAP = {
  ShieldCheck,
  Leaf,
  Truck,
  HeartHandshake,
  Sparkles,
};

export default function Home() {
  const { content } = useContent();
  const { hero, trustBadges, mission, testimonials, distributorCta } = content;

  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [best, setBest] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featuredData, bestData, categoriesData] = await Promise.all([
          productsService.getFeaturedProducts(8),
          productsService.getProducts({ bestseller: true, limit: 4 }),
          categoriesService.getCategories(),
        ]);
        setFeatured(featuredData || []);
        setBest(bestData || []);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error("Error loading home data:", error);
      }
    };
    loadData();
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={hero.bgImage} alt="Hero Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 lg:py-44">
          <div className="max-w-2xl text-[#F9F6F0]">
            <div className="inline-flex items-center gap-2 bg-[#C5A059]/20 backdrop-blur-sm border border-[#C5A059]/40 rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-[#F9F6F0] mb-6">
              <Leaf className="w-3.5 h-3.5" /> {hero.badge}
            </div>
            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-6">
              {hero.titleLine1}<br />
              <span className="italic text-[#C5A059]">{hero.titleLine2}</span>
            </h1>
            <p className="text-lg text-[#F9F6F0]/85 max-w-lg mb-8 leading-relaxed">
              {hero.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to={hero.primaryCtaLink || "/shop"}
                data-testid={TID.heroCta}
                className="rounded-full px-8 py-3.5 bg-[#C5A059] text-[#1A3626] text-sm font-semibold hover:bg-[#d4b06a] transition-colors flex items-center gap-2"
              >
                {hero.primaryCtaText} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={hero.secondaryCtaLink || "/about"}
                className="rounded-full px-8 py-3.5 bg-transparent border border-[#F9F6F0]/60 text-[#F9F6F0] text-sm font-semibold hover:bg-[#F9F6F0]/10 transition-colors"
              >
                {hero.secondaryCtaText}
              </Link>
            </div>
          </div>
        </div>

        {/* Trust badges strip */}
        <div className="relative bg-[#1A3626] text-[#F9F6F0] py-4 border-t border-[#C5A059]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs sm:text-sm">
            {trustBadges.map((badge) => {
              const IconComponent = ICON_MAP[badge.icon] || Leaf;
              return (
                <div key={badge.id || badge.text} className="flex items-center gap-3">
                  <IconComponent className="w-5 h-5 text-[#C5A059]" /> {badge.text}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories - Bento */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-3">Shop by concern</div>
            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#1A3626]">
              Rooted remedies for every need
            </h2>
          </div>
          <Link to="/shop" className="hidden md:inline-flex items-center gap-1 text-sm text-[#1A3626] hover:text-[#C5A059]">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-6">
          {categories.slice(0, 6).map((c, idx) => (
            <Link
              key={c.id}
              data-testid={TID.categoryCard}
              to={`/shop?category=${c.slug}`}
              className={`group relative rounded-2xl overflow-hidden bg-white border border-[#1A3626]/10 hover:shadow-lg transition-all ${idx === 0 ? "lg:col-span-2 lg:row-span-2 aspect-square lg:aspect-auto" :
                  idx === 3 ? "lg:col-span-2" : ""
                }`}
            >
              <div className="absolute inset-0">
                <img src={c.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A3626] via-[#1A3626]/75 to-[#1A3626]/20" />
              </div>
              <div className="relative h-full min-h-[180px] p-5 flex items-end">
                <div>
                  <div className="font-serif-display text-xl lg:text-2xl text-[#F9F6F0] mb-1 font-bold drop-shadow-sm">{c.name}</div>
                  <div className="text-xs text-[#F9F6F0]/90 line-clamp-2 font-medium">{c.description}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-20 lg:py-28 border-y border-[#1A3626]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-3">Handpicked for you</div>
            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#1A3626]">
              Featured this season
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" data-testid={TID.featuredProduct}>
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Mission story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
            <img src={mission.image} alt="Herbs preparation" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-3">{mission.badge}</div>
            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#1A3626] mb-6 leading-tight">
              {mission.title}
            </h2>
            <p className="text-[#1A3626]/80 leading-relaxed mb-4">
              {mission.paragraph1}
            </p>
            <p className="text-[#1A3626]/80 leading-relaxed mb-8">
              {mission.paragraph2}
            </p>
            <div className="grid grid-cols-3 gap-6">
              {mission.stats?.map((stat, idx) => (
                <div key={stat.id || idx}>
                  <div className="font-serif-display text-3xl text-[#1A3626]">{stat.number}</div>
                  <div className="text-xs text-[#5C4033] uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Best sellers */}
      {best.length > 0 && (
        <section className="bg-[#1A3626] text-[#F9F6F0] py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10 gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-3 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" /> Loved by our community
                </div>
                <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl">
                  Best sellers
                </h2>
              </div>
              <Link to="/shop?bestseller=true" className="hidden md:inline-flex items-center gap-1 text-sm text-[#C5A059] hover:underline">
                See all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {best.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-3">Voices from families</div>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#1A3626]">What our customers say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={t.id || i} data-testid={TID.testimonial} className="bg-white rounded-2xl p-8 border border-[#1A3626]/10 relative">
              <Quote className="w-8 h-8 text-[#C5A059]/40 mb-4" />
              <p className="text-[#1A3626]/85 leading-relaxed mb-6">
                <span aria-hidden="true">"</span>
                <span>{t.body}</span>
                <span aria-hidden="true">"</span>
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-[#1A3626]">{t.name}</div>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars || 5 }).map((_, k) => (
                    <span key={k} className="text-[#C5A059]">★</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Distributor CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 lg:pb-28">
        <div className="relative rounded-2xl overflow-hidden bg-[#5C4033] p-10 md:p-16 text-[#F9F6F0]">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-3">{distributorCta.badge}</div>
            <h3 className="font-serif-display text-3xl md:text-4xl mb-4">
              {distributorCta.title}
            </h3>
            <p className="text-[#F9F6F0]/80 mb-6 leading-relaxed">
              {distributorCta.description}
            </p>
            <Link
              to={distributorCta.ctaLink || "/distributor"}
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 bg-[#C5A059] text-[#1A3626] text-sm font-semibold hover:bg-[#d4b06a] transition"
            >
              {distributorCta.ctaText} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
