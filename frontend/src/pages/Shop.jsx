import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { TID } from "@/constants/testIds";

const SORTS = [
  { value: "", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = params.get("category") || "";
  const q = params.get("q") || "";
  const sort = params.get("sort") || "";
  const bestseller = params.get("bestseller") === "true";
  const minP = params.get("min_price") || "";
  const maxP = params.get("max_price") || "";
  const ailment = params.get("ailment") || "";

  useEffect(() => {
    api.get("/categories").then((r) => setCategories(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (category) qs.set("category", category);
    if (q) qs.set("q", q);
    if (sort) qs.set("sort", sort);
    if (bestseller) qs.set("bestseller", "true");
    if (minP) qs.set("min_price", minP);
    if (maxP) qs.set("max_price", maxP);
    if (ailment) qs.set("ailment", ailment);
    api.get(`/products?${qs.toString()}`).then((r) => {
      setProducts(r.data);
      setLoading(false);
    });
  }, [category, q, sort, bestseller, minP, maxP, ailment]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value === "" || value == null || value === false) next.delete(key);
    else next.set(key, String(value));
    setParams(next);
  };

  const clearAll = () => setParams(new URLSearchParams());

  const activeFilters = useMemo(() => {
    const arr = [];
    if (category) arr.push({ k: "category", label: `Category: ${category.replace(/-/g, " ")}` });
    if (q) arr.push({ k: "q", label: `Search: "${q}"` });
    if (bestseller) arr.push({ k: "bestseller", label: "Bestsellers" });
    if (minP) arr.push({ k: "min_price", label: `Min ₹${minP}` });
    if (maxP) arr.push({ k: "max_price", label: `Max ₹${maxP}` });
    if (ailment) arr.push({ k: "ailment", label: `Ailment: ${ailment}` });
    return arr;
  }, [category, q, bestseller, minP, maxP, ailment]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Header */}
      <div className="mb-10">
        <div className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-3">The Utkarsh Collection</div>
        <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-[#1A3626]">Shop Ayurveda</h1>
        <p className="mt-3 text-[#1A3626]/70 max-w-xl">Classical formulations, single herbs and wellness essentials — all crafted by trusted local partners.</p>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#1A3626]/50" />
        <input
          data-testid={TID.shopSearchInput}
          value={q}
          onChange={(e) => setParam("q", e.target.value)}
          placeholder="Search products..."
          className="w-full md:max-w-md pl-9 pr-3 py-3 rounded-full bg-white border border-[#1A3626]/15 focus:border-[#1A3626] outline-none text-sm"
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <button
          onClick={() => setFiltersOpen((o) => !o)}
          className="lg:hidden inline-flex items-center gap-2 text-sm text-[#1A3626] border border-[#1A3626]/20 rounded-full px-4 py-2"
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
        <div className="text-sm text-[#1A3626]/60">{loading ? "Loading..." : `${products.length} products`}</div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-xs text-[#1A3626]/60">Sort:</span>
          <select
            data-testid={TID.shopSort}
            value={sort}
            onChange={(e) => setParam("sort", e.target.value)}
            className="text-sm bg-white border border-[#1A3626]/20 rounded-full px-4 py-2 focus:border-[#1A3626] outline-none"
          >
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {activeFilters.map((f) => (
            <button
              key={f.k}
              onClick={() => setParam(f.k, "")}
              className="inline-flex items-center gap-1.5 text-xs bg-[#C5A059]/15 text-[#5C4033] rounded-full px-3 py-1.5 hover:bg-[#C5A059]/30"
            >
              {f.label} <X className="w-3 h-3" />
            </button>
          ))}
          <button onClick={clearAll} className="text-xs text-[#1A3626] underline hover:no-underline">Clear all</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar */}
        <aside className={`lg:col-span-1 ${filtersOpen ? "block" : "hidden lg:block"}`}>
          <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-6 sticky top-32">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-4">Category</h3>
            <ul className="space-y-2 mb-6">
              <li>
                <button
                  data-testid={TID.shopFilterCategory}
                  onClick={() => setParam("category", "")}
                  className={`text-sm ${!category ? "text-[#1A3626] font-semibold" : "text-[#1A3626]/60"} hover:text-[#C5A059]`}
                >
                  All
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    data-testid={TID.shopFilterCategory}
                    onClick={() => setParam("category", c.slug)}
                    className={`text-sm ${category === c.slug ? "text-[#1A3626] font-semibold" : "text-[#1A3626]/60"} hover:text-[#C5A059]`}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>

            <h3 className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-4">Price (₹)</h3>
            <div className="flex items-center gap-2 mb-6">
              <input
                type="number"
                placeholder="Min"
                value={minP}
                onChange={(e) => setParam("min_price", e.target.value)}
                className="w-full text-sm bg-[#F9F6F0] border border-[#1A3626]/15 rounded-lg px-3 py-2 outline-none focus:border-[#1A3626]"
              />
              <span className="text-[#1A3626]/40">—</span>
              <input
                type="number"
                placeholder="Max"
                value={maxP}
                onChange={(e) => setParam("max_price", e.target.value)}
                className="w-full text-sm bg-[#F9F6F0] border border-[#1A3626]/15 rounded-lg px-3 py-2 outline-none focus:border-[#1A3626]"
              />
            </div>

            <h3 className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-4">Quick Filters</h3>
            <label className="flex items-center gap-2 text-sm text-[#1A3626] cursor-pointer">
              <input
                type="checkbox"
                checked={bestseller}
                onChange={(e) => setParam("bestseller", e.target.checked ? "true" : "")}
                className="rounded border-[#1A3626]/30 text-[#1A3626]"
              />
              Bestsellers only
            </label>
          </div>
        </aside>

        {/* Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-white rounded-2xl animate-pulse border border-[#1A3626]/10" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-[#1A3626]/10">
              <p className="text-[#1A3626]/60">No products match your filters.</p>
              <button onClick={clearAll} className="mt-4 text-sm text-[#C5A059] underline">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
