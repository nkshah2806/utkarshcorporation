import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ordersService } from "@/services/ordersService";
import { CheckCircle2 } from "lucide-react";
import { TID } from "@/constants/testIds";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const data = await ordersService.getOrderById(orderId);
        setOrder(data);
      } catch (error) {
        console.error("Error loading order:", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [orderId]);

  if (loading) return <div className="p-12 text-center text-[#1A3626]/60">Loading order...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-[#C5A059] flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-8 h-8 text-[#1A3626]" />
      </div>
      <h1 data-testid={TID.orderSuccess} className="font-serif-display text-4xl text-[#1A3626] mb-3">
        Order Confirmed!
      </h1>
      <p className="text-[#1A3626]/70 mb-2">Thank you for choosing Utkarsh Corporation.</p>
      <p className="text-sm text-[#1A3626]/60 mb-8">
        Order <strong className="text-[#1A3626]">#{order.order_number}</strong>
        {" · "}
        {order.payment_method === "cod" ? "Pay on delivery" : order.payment_status === "paid" ? "Payment received" : "Payment pending"}
      </p>

      <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-6 text-left mb-8">
        <div className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-3">Shipping to</div>
        <div className="text-sm text-[#1A3626] mb-4">
          {order.address.full_name}, {order.address.phone}<br />
          {order.address.line1}{order.address.line2 && `, ${order.address.line2}`}<br />
          {order.address.city}, {order.address.state} - {order.address.pincode}
        </div>
        <div className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-3">Items</div>
        <div className="space-y-2 mb-4">
          {order.items.map((it, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-[#1A3626]/80">{it.name} × {it.quantity}</span>
              <span className="text-[#1A3626]">₹{(it.price * it.quantity).toFixed(0)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[#1A3626]/10 pt-3 flex justify-between font-semibold">
          <span>Total</span><span>₹{order.total.toFixed(0)}</span>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <Link to="/shop" className="rounded-full px-6 py-2.5 border border-[#1A3626] text-[#1A3626] text-sm font-semibold hover:bg-[#1A3626] hover:text-[#F9F6F0] transition">Continue Shopping</Link>
        <Link to="/account" className="rounded-full px-6 py-2.5 bg-[#1A3626] text-[#F9F6F0] text-sm font-semibold hover:bg-[#2C4C3B] transition">My Orders</Link>
      </div>
    </div>
  );
}
