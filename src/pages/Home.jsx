import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productsService } from "@/services/productsService";
import { categoriesService } from "@/services/categoriesService";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, ShieldCheck, Leaf, Truck, HeartHandshake, Sparkles, Quote } from "lucide-react";
import { TID } from "@/constants/testIds";

const HERO_IMG = "https://images.unsplash.com/photo-1492552085122-36706c238263?crop=entropy&cs=srgb&fm=jpg&q=85&w=1800";
const STORY_IMG = "https://images.unsplash.com/photo-1615485499958-69973683793c?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400";

const TESTIMONIALS = [
  { name: "Anita R., Mumbai", body: "The Chyawanprash has become my daily ritual. My kids love it too — no cold this whole season.", stars: 5 },
  { name: "Rajesh P., Pune", body: "Ashwagandha capsules genuinely helped with stress and sleep. Authentic, effective and reasonably priced.", stars: 5 },
  { name: "Sonal M., Delhi", body: "Attended their free health camp — such warm, knowledgeable doctors. Trustworthy brand.", stars: 5 },
];

export default function Home() {
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
        setFeatured(featuredData);
        setBest(bestData);
        setCategories(categoriesData);
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
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 lg:py-44">
          <div className="max-w-2xl text-[#F9F6F0]">
            <div className="inline-flex items-center gap-2 bg-[#C5A059]/20 backdrop-blur-sm border border-[#C5A059]/40 rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-[#F9F6F0] mb-6">
              <Leaf className="w-3.5 h-3.5" /> Local for Vocal · GMP Certified
            </div>
            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-6">
              Ancient wisdom.<br />
              <span className="italic text-[#C5A059]">Everyday wellness.</span>
            </h1>
            <p className="text-lg text-[#F9F6F0]/85 max-w-lg mb-8 leading-relaxed">
              Trusted Ayurvedic medicines and herbal essentials — crafted by local artisans, made for
              every Indian family's progress toward better health.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/shop"
                data-testid={TID.heroCta}
                className="rounded-full px-8 py-3.5 bg-[#C5A059] text-[#1A3626] text-sm font-semibold hover:bg-[#d4b06a] transition-colors flex items-center gap-2"
              >
                Shop the Collection <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="rounded-full px-8 py-3.5 bg-transparent border border-[#F9F6F0]/60 text-[#F9F6F0] text-sm font-semibold hover:bg-[#F9F6F0]/10 transition-colors"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>

        {/* Trust badges strip */}
        <div className="relative bg-[#1A3626] text-[#F9F6F0] py-4 border-t border-[#C5A059]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-[#C5A059]" /> GMP Certified</div>
            <div className="flex items-center gap-3"><Leaf className="w-5 h-5 text-[#C5A059]" /> 100% Natural</div>
            <div className="flex items-center gap-3"><Truck className="w-5 h-5 text-[#C5A059]" /> Free Shipping ₹499+</div>
            <div className="flex items-center gap-3"><HeartHandshake className="w-5 h-5 text-[#C5A059]" /> COD Available</div>
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
              className={`group relative rounded-2xl overflow-hidden bg-white border border-[#1A3626]/10 hover:shadow-lg transition-all ${
                idx === 0 ? "lg:col-span-2 lg:row-span-2 aspect-square lg:aspect-auto" :
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
            <img src={STORY_IMG} alt="Herbs preparation" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-3">Our Mission</div>
            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#1A3626] mb-6 leading-tight">
              Progress for every family, through <span className="italic text-[#C5A059]">health</span>.
            </h2>
            <p className="text-[#1A3626]/80 leading-relaxed mb-4">
              Utkarsh Corporation stands with India's small and domestic Ayurvedic manufacturers.
              Every jar and bottle you receive supports local artisans, farmers and doctors — a
              true <em>Local for Vocal</em> promise.
            </p>
            <p className="text-[#1A3626]/80 leading-relaxed mb-8">
              We host free health camps in cities and villages, mentor budding distributors, and
              craft classical Ayurvedic products with modern quality controls — so wellness stays
              accessible, affordable, and authentic.
            </p>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="font-serif-display text-3xl text-[#1A3626]">50+</div>
                <div className="text-xs text-[#5C4033] uppercase tracking-wider">Health Camps</div>
              </div>
              <div>
                <div className="font-serif-display text-3xl text-[#1A3626]">40k</div>
                <div className="text-xs text-[#5C4033] uppercase tracking-wider">Families Served</div>
              </div>
              <div>
                <div className="font-serif-display text-3xl text-[#1A3626]">120+</div>
                <div className="text-xs text-[#5C4033] uppercase tracking-wider">Local Partners</div>
              </div>
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
          {TESTIMONIALS.map((t, i) => (
            <div key={i} data-testid={TID.testimonial} className="bg-white rounded-2xl p-8 border border-[#1A3626]/10 relative">
              <Quote className="w-8 h-8 text-[#C5A059]/40 mb-4" />
              <p className="text-[#1A3626]/85 leading-relaxed mb-6">"{t.body}"</p>
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-[#1A3626]">{t.name}</div>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, k) => (
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
            <div className="text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-3">Business Opportunity</div>
            <h3 className="font-serif-display text-3xl md:text-4xl mb-4">
              Grow with us. Become a distributor.
            </h3>
            <p className="text-[#F9F6F0]/80 mb-6 leading-relaxed">
              Join 120+ partners across India selling trusted Ayurvedic products. Attractive margins,
              full training, marketing support and a mission that matters.
            </p>
            <Link
              to="/distributor"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 bg-[#C5A059] text-[#1A3626] text-sm font-semibold hover:bg-[#d4b06a] transition"
            >
              Apply now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
