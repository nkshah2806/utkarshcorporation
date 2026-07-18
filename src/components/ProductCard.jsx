import { Link } from "react-router-dom";
import { ShoppingBag, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { TID } from "@/constants/testIds";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const discount = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const add = (e) => {
    e.preventDefault();
    addItem(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      data-testid={TID.productCard}
      className="group bg-white rounded-2xl overflow-hidden border border-[#1A3626]/10 hover:shadow-lg transition-all flex flex-col"
    >
      <div className="relative aspect-square bg-[#F9F6F0] overflow-hidden">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.is_bestseller && (
          <span className="absolute top-3 left-3 bg-[#C5A059] text-[#1A3626] text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
            Bestseller
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-[#1A3626] text-[#F9F6F0] text-[10px] font-bold px-2 py-1 rounded-full">
            {discount}% OFF
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="text-[10px] uppercase tracking-[0.15em] text-[#5C4033] mb-1">
          {product.category_slug?.replace(/-/g, " ")}
        </div>
        <h3 className="font-serif-display text-lg text-[#1A3626] mb-1 line-clamp-2 font-bold">{product.name}</h3>
        <p className="text-xs text-[#1A3626]/70 line-clamp-2 mb-3 flex-1">{product.short_description}</p>

        <div className="flex items-center gap-1 mb-3">
          <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
          <span className="text-xs text-[#1A3626]">{product.rating || 4.5}</span>
          <span className="text-xs text-[#1A3626]/50">({product.review_count || 0})</span>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div>
            <span className="text-lg font-semibold text-[#1A3626]">₹{product.price}</span>
            {discount > 0 && (
              <span className="text-xs text-[#1A3626]/50 line-through ml-2">₹{product.mrp}</span>
            )}
          </div>
          <button
            data-testid={TID.addToCartBtn}
            onClick={add}
            className="w-9 h-9 rounded-full bg-[#1A3626] text-[#F9F6F0] flex items-center justify-center hover:bg-[#2C4C3B] transition"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
