import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ordersService } from "@/services/ordersService";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Truck, Leaf, HeartHandshake } from "lucide-react";
import { TID } from "@/constants/testIds";

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: user?.email || "",
    full_name: user?.name || "",
    phone: user?.phone || "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    payment_method: "cod",
  });

  const shipping = subtotal >= 499 ? 0 : 49;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center">
        <h1 className="font-serif-display text-3xl text-[#1A3626] mb-3">Your cart is empty</h1>
        <Link to="/shop" className="text-[#C5A059] underline">Continue shopping</Link>
      </div>
    );
  }

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        email: form.email,
        items: items.map((i) => ({
          product_id: i.product_id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        address: {
          label: "Home",
          full_name: form.full_name,
          phone: form.phone,
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
        payment_method: form.payment_method,
      };
      const order = await ordersService.createOrder(payload);

      if (form.payment_method === "razorpay") {
        // Mock Razorpay flow — in production this would open Razorpay checkout
        toast({
          title: "Processing",
          description: "Simulating Razorpay payment...",
        });
        await new Promise((r) => setTimeout(r, 1200));
      }

      clear();
      navigate(`/order-success/${order.id}`);
      toast({
        title: "Success",
        description: "Order placed successfully!",
      });
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to create order";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full bg-[#F9F6F0] border border-[#1A3626]/15 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1A3626]";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <h1 className="font-serif-display text-4xl lg:text-5xl text-[#1A3626] mb-10">Checkout</h1>
      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {/* Contact */}
          <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-6">
            <h3 className="font-serif-display text-xl text-[#1A3626] mb-4">Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required type="email" placeholder="Email" value={form.email} onChange={update("email")} className={inputCls} />
              <input required placeholder="Phone" value={form.phone} onChange={update("phone")} className={inputCls} />
            </div>
          </div>
          {/* Shipping */}
          <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-6">
            <h3 className="font-serif-display text-xl text-[#1A3626] mb-4">Shipping Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required placeholder="Full name" value={form.full_name} onChange={update("full_name")} className={`${inputCls} md:col-span-2`} />
              <input required placeholder="Address line 1" value={form.line1} onChange={update("line1")} className={`${inputCls} md:col-span-2`} />
              <input placeholder="Address line 2 (optional)" value={form.line2} onChange={update("line2")} className={`${inputCls} md:col-span-2`} />
              <input required placeholder="City" value={form.city} onChange={update("city")} className={inputCls} />
              <input required placeholder="State" value={form.state} onChange={update("state")} className={inputCls} />
              <input required placeholder="Pincode" value={form.pincode} onChange={update("pincode")} className={inputCls} />
            </div>
          </div>
          {/* Payment */}
          <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-6">
            <h3 className="font-serif-display text-xl text-[#1A3626] mb-4">Payment Method</h3>
            <div className="space-y-3">
              <label data-testid={TID.paymentCod} className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition ${form.payment_method === "cod" ? "border-[#1A3626] bg-[#F9F6F0]" : "border-[#1A3626]/15"}`}>
                <input type="radio" checked={form.payment_method === "cod"} onChange={() => setForm({ ...form, payment_method: "cod" })} className="mt-1" />
                <div>
                  <div className="font-semibold text-[#1A3626]">Cash on Delivery</div>
                  <div className="text-xs text-[#1A3626]/60">Pay in cash when your order arrives. No extra charges.</div>
                </div>
              </label>
              <label data-testid={TID.paymentRazorpay} className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition ${form.payment_method === "razorpay" ? "border-[#1A3626] bg-[#F9F6F0]" : "border-[#1A3626]/15"}`}>
                <input type="radio" checked={form.payment_method === "razorpay"} onChange={() => setForm({ ...form, payment_method: "razorpay" })} className="mt-1" />
                <div>
                  <div className="font-semibold text-[#1A3626]">Razorpay (UPI · Cards · Netbanking)</div>
                  <div className="text-xs text-[#1A3626]/60">Simulated for demo. Real Razorpay integration ready — plug in your keys to enable.</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-6 sticky top-32">
            <h3 className="font-serif-display text-2xl text-[#1A3626] mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
              {items.map((it) => (
                <div key={it.product_id} className="flex justify-between text-sm">
                  <span className="text-[#1A3626]/70 truncate mr-2">{it.name} × {it.quantity}</span>
                  <span className="text-[#1A3626]">₹{(it.price * it.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#1A3626]/10 pt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#1A3626]/70">Subtotal</span><span>₹{subtotal.toFixed(0)}</span></div>
              <div className="flex justify-between"><span className="text-[#1A3626]/70">Shipping</span><span>{shipping === 0 ? <span className="text-[#C5A059]">FREE</span> : `₹${shipping}`}</span></div>
            </div>
            <div className="border-t border-[#1A3626]/10 pt-3 mt-3 flex justify-between items-baseline mb-6">
              <span className="text-[#1A3626]">Total</span>
              <span className="font-serif-display text-3xl text-[#1A3626]">₹{total.toFixed(0)}</span>
            </div>
            <button
              type="submit"
              data-testid={TID.checkoutSubmit}
              disabled={submitting}
              className="w-full rounded-full py-3 bg-[#1A3626] text-[#F9F6F0] font-semibold text-sm hover:bg-[#2C4C3B] transition disabled:opacity-50"
            >
              {submitting ? "Placing order..." : `Place Order · ₹${total.toFixed(0)}`}
            </button>
            <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] uppercase tracking-wider text-[#5C4033]">
              <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-[#C5A059]" /> Secure</div>
              <div className="flex items-center gap-1"><Truck className="w-3 h-3 text-[#C5A059]" /> Fast Ship</div>
              <div className="flex items-center gap-1"><Leaf className="w-3 h-3 text-[#C5A059]" /> Natural</div>
              <div className="flex items-center gap-1"><HeartHandshake className="w-3 h-3 text-[#C5A059]" /> COD</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
