import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { productsService } from "@/services/productsService";
import { mediaSrc } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/context/AuthContext";
import { Star, Leaf, ShieldCheck, Truck, HeartHandshake, Heart } from "lucide-react";
import { TID } from "@/constants/testIds";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, setUser } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", body: "" });
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const productData = await productsService.getProductBySlug(slug);
        setProduct(productData);
        setActiveImg(0);

        const [relData, revData] = await Promise.all([
          productsService.getRelatedProducts(productData.id),
          productsService.getProductReviews(productData.id),
        ]);
        setRelated(relData);
        setReviews(revData);
      } catch (error) {
        console.error("Error loading product:", error);
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive",
        });
        navigate("/shop");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, navigate, toast]);

  if (loading) return <div className="max-w-7xl mx-auto p-8 text-[#1A3626]/60">Loading...</div>;

  const inWishlist = user?.wishlist?.includes(product.id);
  const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  const toggleWishlist = async () => {
    if (!user) {
      window.open("https://uttkarsh-member.vercel.app/", "_blank", "noopener,noreferrer");
      return;
    }
    if (!product) return;
    try {
      const { data } = await productsService.addReview(product.id, {});
      setUser(data);
      toast({
        title: "Success",
        description: "Added to wishlist",
      });
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to update wishlist";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };
  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      window.open("https://uttkarsh-member.vercel.app/", "_blank", "noopener,noreferrer");
      return;
    }
    if (!product) return;
    setPosting(true);
    try {
      await productsService.addReview(product.id, reviewForm);
      const reviewData = await productsService.getProductReviews(product.id);
      setReviews(reviewData);
      setReviewForm({ rating: 5, title: "", body: "" });
      toast({
        title: "Success",
        description: "Review posted!",
      });
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to post review";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setPosting(false);
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <nav className="text-xs text-[#1A3626]/60 mb-6 flex flex-wrap items-center gap-x-1.5">
          <Link to="/" className="hover:text-[#C5A059]">Home</Link>
          <span aria-hidden="true">·</span>
          <Link to="/shop" className="hover:text-[#C5A059]">Shop</Link>
          <span aria-hidden="true">·</span>
          <span className="text-[#1A3626]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <div>
            <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-[#1A3626]/10 mb-4">
              <img src={mediaSrc(product.images?.[activeImg])} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-3">
              {product.images?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 ${activeImg === i ? "border-[#1A3626]" : "border-transparent"}`}
                >
                  <img src={mediaSrc(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-2">
              {product.category_slug?.replace(/-/g, " ")}
            </div>
            <h1 data-testid={TID.productTitle} className="font-serif-display text-4xl lg:text-5xl text-[#1A3626] mb-4">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating || 4.5) ? "fill-[#C5A059] text-[#C5A059]" : "text-[#1A3626]/20"}`} />
                ))}
              </div>
              <span className="text-sm text-[#1A3626]/70 inline-flex items-center gap-x-1">
                <span>{product.rating || 4.5}</span>
                <span aria-hidden="true">·</span>
                <span>{product.review_count || 0}</span>
                <span>reviews</span>
              </span>
            </div>
            <p className="text-[#1A3626]/80 leading-relaxed mb-6">{product.short_description}</p>

            <div className="flex items-baseline gap-3 mb-2">
              <span data-testid={TID.productPrice} className="text-4xl font-serif-display text-[#1A3626] inline-flex items-baseline gap-0.5">
                <span aria-hidden="true">₹</span>
                <span>{product.price}</span>
              </span>
              {discount > 0 && (
                <>
                  <span className="text-lg text-[#1A3626]/50 line-through inline-flex items-baseline gap-0.5">
                    <span aria-hidden="true">₹</span>
                    <span>{product.mrp}</span>
                  </span>
                  <span className="text-sm font-semibold text-[#C5A059] inline-flex items-baseline gap-0.5">
                    <span>{discount}</span>
                    <span>% OFF</span>
                  </span>
                </>
              )}
            </div>
            <div className="text-xs text-[#1A3626]/60 mb-8">Inclusive of all taxes</div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={toggleWishlist}
                aria-label="Wishlist"
                className={`w-11 h-11 rounded-full border flex items-center justify-center transition ${inWishlist ? "bg-[#C5A059] border-[#C5A059] text-[#1A3626]" : "border-[#1A3626]/20 text-[#1A3626] hover:bg-[#F9F6F0]"
                  }`}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
              </button>
            </div>

            {product.stock < 10 && product.stock > 0 && (
              <div className="mb-6 text-sm text-[#5C4033] bg-[#C5A059]/15 rounded-lg px-4 py-2 inline-block">
                <span className="inline-flex flex-wrap items-baseline gap-x-1">
                  <span>Only</span>
                  <span>{product.stock}</span>
                  <span>left in stock — grab yours!</span>
                </span>
              </div>
            )}
            {product.stock === 0 && <div className="mb-6 text-sm text-red-700 bg-red-50 rounded-lg px-4 py-2 inline-block">Out of stock</div>}

            {/* Trust */}
            <div className="grid grid-cols-2 gap-3 mb-8 bg-white border border-[#1A3626]/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs text-[#1A3626]"><Leaf className="w-4 h-4 text-[#C5A059]" /> 100% Natural</div>
              <div className="flex items-center gap-2 text-xs text-[#1A3626]"><ShieldCheck className="w-4 h-4 text-[#C5A059]" /> GMP Certified</div>
              <div className="flex items-center gap-2 text-xs text-[#1A3626]"><Truck className="w-4 h-4 text-[#C5A059]" /> Free Ship ₹499+</div>
              <div className="flex items-center gap-2 text-xs text-[#1A3626]"><HeartHandshake className="w-4 h-4 text-[#C5A059]" /> Cash on Delivery</div>
            </div>

            {product.ailments?.length > 0 && (
              <div className="mb-6">
                <div className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-2">Helps with</div>
                <div className="flex flex-wrap gap-2">
                  {product.ailments.map((a) => (
                    <span key={a} className="rounded-full bg-[#C5A059]/15 text-[#5C4033] px-3 py-1 text-xs font-semibold uppercase tracking-wider">{a}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabbed details */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 border border-[#1A3626]/10">
            <h3 className="font-serif-display text-xl text-[#1A3626] mb-3">Description</h3>
            <p className="text-sm text-[#1A3626]/75 leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#1A3626]/10">
            <h3 className="font-serif-display text-xl text-[#1A3626] mb-3">Ingredients</h3>
            <p className="text-sm text-[#1A3626]/75 leading-relaxed whitespace-pre-line">{product.ingredients}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#1A3626]/10">
            <h3 className="font-serif-display text-xl text-[#1A3626] mb-3">How to Use</h3>
            <p className="text-sm text-[#1A3626]/75 leading-relaxed whitespace-pre-line">{product.usage}</p>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16">
          <h2 className="font-serif-display text-3xl text-[#1A3626] mb-6">Customer Reviews</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {reviews.length === 0 && <div className="text-sm text-[#1A3626]/60">No reviews yet — be the first to share.</div>}
              {reviews.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl p-6 border border-[#1A3626]/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-[#1A3626] text-sm">{r.user_name}</div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-[#C5A059] text-[#C5A059]" : "text-[#1A3626]/20"}`} />
                      ))}
                    </div>
                  </div>
                  <div className="font-semibold text-[#1A3626] mb-1">{r.title}</div>
                  <div className="text-sm text-[#1A3626]/75">{r.body}</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#1A3626]/10">
              <h4 className="font-serif-display text-xl text-[#1A3626] mb-3">Write a review</h4>
              {!user && <div className="text-xs text-[#5C4033] bg-[#C5A059]/15 rounded-lg px-3 py-2 mb-3">Please <a href="https://uttkarsh-member.vercel.app/" target="_blank" rel="noreferrer" className="underline">open the member panel</a> to review.</div>}
              <form onSubmit={submitReview} className="space-y-3">
                <div>
                  <label className="text-xs text-[#1A3626]/70 block mb-1">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button type="button" key={n} onClick={() => setReviewForm({ ...reviewForm, rating: n })}>
                        <Star className={`w-5 h-5 ${n <= reviewForm.rating ? "fill-[#C5A059] text-[#C5A059]" : "text-[#1A3626]/20"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  required
                  placeholder="Title"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                  className="w-full bg-[#F9F6F0] border border-[#1A3626]/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1A3626]"
                />
                <textarea
                  required
                  rows="4"
                  placeholder="Share your experience..."
                  value={reviewForm.body}
                  onChange={(e) => setReviewForm({ ...reviewForm, body: e.target.value })}
                  className="w-full bg-[#F9F6F0] border border-[#1A3626]/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1A3626]"
                />
                <button
                  type="submit"
                  data-testid={TID.submitReview}
                  disabled={!user || posting}
                  className="w-full rounded-full py-2.5 bg-[#1A3626] text-[#F9F6F0] font-semibold text-sm hover:bg-[#2C4C3B] transition disabled:opacity-50"
                >
                  {posting ? "Posting..." : "Post Review"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-serif-display text-3xl text-[#1A3626] mb-6">You may also love</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
