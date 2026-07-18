import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { TID } from "@/constants/testIds";

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const navigate = useNavigate();

  const shipping = subtotal >= 499 ? 0 : items.length > 0 ? 49 : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-white rounded-full border border-[#1A3626]/10 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-8 h-8 text-[#1A3626]/40" />
        </div>
        <h1 className="font-serif-display text-4xl text-[#1A3626] mb-3">Your cart is empty</h1>
        <p className="text-[#1A3626]/70 mb-8">Browse our collection of trusted Ayurvedic essentials.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 rounded-full px-8 py-3 bg-[#1A3626] text-[#F9F6F0] font-semibold text-sm hover:bg-[#2C4C3B] transition">
          Shop the Collection <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <h1 className="font-serif-display text-4xl lg:text-5xl text-[#1A3626] mb-10">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {items.map((it) => (
            <div key={it.product_id} className="flex gap-4 bg-white rounded-2xl border border-[#1A3626]/10 p-4">
              <Link to={`/product/${it.slug}`} className="w-24 h-24 rounded-xl overflow-hidden bg-[#F9F6F0] shrink-0">
                <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${it.slug}`} className="font-semibold text-[#1A3626] hover:text-[#C5A059] line-clamp-2">{it.name}</Link>
                <div className="text-sm text-[#1A3626]/60 mt-1">₹{it.price} each</div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="inline-flex items-center border border-[#1A3626]/20 rounded-full">
                    <button data-testid={TID.cartQtyMinus} onClick={() => updateQuantity(it.product_id, it.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-[#F9F6F0]"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="w-8 text-center text-sm font-semibold">{it.quantity}</span>
                    <button data-testid={TID.cartQtyPlus} onClick={() => updateQuantity(it.product_id, it.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-[#F9F6F0]"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                  <button data-testid={TID.cartRemove} onClick={() => removeItem(it.product_id)} className="text-sm text-[#5C4033] hover:text-red-700 inline-flex items-center gap-1">
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-[#1A3626]">₹{(it.price * it.quantity).toFixed(0)}</div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-6 sticky top-32">
            <h3 className="font-serif-display text-2xl text-[#1A3626] mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between"><span className="text-[#1A3626]/70">Subtotal</span><span>₹{subtotal.toFixed(0)}</span></div>
              <div className="flex justify-between"><span className="text-[#1A3626]/70">Shipping</span><span>{shipping === 0 ? <span className="text-[#C5A059]">FREE</span> : `₹${shipping}`}</span></div>
              {subtotal < 499 && (
                <div className="text-xs text-[#5C4033] bg-[#C5A059]/15 rounded-lg px-3 py-2 mt-2">
                  Add ₹{(499 - subtotal).toFixed(0)} more to unlock <strong>free shipping</strong>.
                </div>
              )}
            </div>
            <div className="border-t border-[#1A3626]/10 pt-3 flex justify-between items-baseline mb-6">
              <span className="text-[#1A3626]">Total</span>
              <span className="font-serif-display text-3xl text-[#1A3626]">₹{total.toFixed(0)}</span>
            </div>
            <button
              data-testid={TID.cartCheckoutBtn}
              onClick={() => navigate("/checkout")}
              className="w-full rounded-full py-3 bg-[#1A3626] text-[#F9F6F0] font-semibold text-sm hover:bg-[#2C4C3B] transition"
            >
              Proceed to Checkout
            </button>
            <Link to="/shop" className="block text-center text-xs text-[#1A3626]/70 mt-3 hover:text-[#C5A059]">Continue shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
