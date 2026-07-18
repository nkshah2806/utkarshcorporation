import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ordersService } from "@/services/ordersService";
import { productsService } from "@/services/productsService";
import { Package, Heart, MapPin, LogOut } from "lucide-react";
import { TID } from "@/constants/testIds";

export default function Account() {
  const { user, logout, checking } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!checking && !user) navigate("/login", { state: { from: "/account" } });
  }, [checking, user, navigate]);

  useEffect(() => {
    if (!user) return;
    
    const loadData = async () => {
      setLoading(true);
      try {
        const ordersData = await ordersService.getMyOrders();
        setOrders(ordersData);
        
        if (user.wishlist?.length) {
          const productsData = await productsService.getProducts();
          setWishlist(productsData.filter((p) => user.wishlist.includes(p.id)));
        }
      } catch (error) {
        console.error("Error loading account data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="mb-10">
        <div className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-2">My Account</div>
        <h1 className="font-serif-display text-4xl text-[#1A3626]">Namaste, {user.name.split(" ")[0]}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-4">
            <div className="text-xs uppercase tracking-wider text-[#5C4033] mb-2 px-3">{user.email}</div>
            <button onClick={() => setTab("orders")} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-2 ${tab === "orders" ? "bg-[#F9F6F0] text-[#1A3626] font-semibold" : "text-[#1A3626]/70"}`}>
              <Package className="w-4 h-4" /> My Orders
            </button>
            <button onClick={() => setTab("wishlist")} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-2 ${tab === "wishlist" ? "bg-[#F9F6F0] text-[#1A3626] font-semibold" : "text-[#1A3626]/70"}`}>
              <Heart className="w-4 h-4" /> Wishlist
            </button>
            <button onClick={() => setTab("addresses")} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-2 ${tab === "addresses" ? "bg-[#F9F6F0] text-[#1A3626] font-semibold" : "text-[#1A3626]/70"}`}>
              <MapPin className="w-4 h-4" /> Addresses
            </button>
            <button onClick={() => { logout(); navigate("/"); }} className="w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-2 text-[#5C4033] hover:bg-[#F9F6F0]">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </aside>

        <div className="lg:col-span-3">
          {tab === "orders" && (
            <div>
              <h2 className="font-serif-display text-2xl text-[#1A3626] mb-4">My Orders</h2>
              {orders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-8 text-center">
                  <p className="text-[#1A3626]/60 mb-4">You haven't placed any orders yet.</p>
                  <Link to="/shop" className="text-[#C5A059] underline text-sm">Start shopping</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div key={o.id} className="bg-white rounded-2xl border border-[#1A3626]/10 p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-semibold text-[#1A3626]">#{o.order_number}</div>
                          <div className="text-xs text-[#1A3626]/60">{new Date(o.created_at).toLocaleDateString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-[#1A3626]">₹{o.total.toFixed(0)}</div>
                          <span className="text-xs uppercase bg-[#C5A059]/15 text-[#5C4033] px-2 py-0.5 rounded-full">{o.order_status}</span>
                        </div>
                      </div>
                      <div className="text-sm text-[#1A3626]/75">
                        {o.items.map((it, i) => (
                          <span key={i}>{it.name} × {it.quantity}{i < o.items.length - 1 && ", "}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "wishlist" && (
            <div>
              <h2 className="font-serif-display text-2xl text-[#1A3626] mb-4">My Wishlist</h2>
              {wishlist.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-8 text-center text-[#1A3626]/60">No items in wishlist yet.</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {wishlist.map((p) => (
                    <Link key={p.id} to={`/product/${p.slug}`} className="bg-white rounded-2xl border border-[#1A3626]/10 overflow-hidden">
                      <img src={p.images?.[0]} alt="" className="aspect-square object-cover" />
                      <div className="p-3">
                        <div className="text-sm font-semibold text-[#1A3626] truncate">{p.name}</div>
                        <div className="text-xs text-[#1A3626]/70">₹{p.price}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "addresses" && (
            <div>
              <h2 className="font-serif-display text-2xl text-[#1A3626] mb-4">Saved Addresses</h2>
              {(!user.addresses || user.addresses.length === 0) ? (
                <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-8 text-center text-[#1A3626]/60">
                  You have no saved addresses. New addresses are saved automatically at checkout.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.addresses.map((a, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-[#1A3626]/10 p-5 text-sm text-[#1A3626]">
                      <div className="font-semibold mb-1">{a.full_name}</div>
                      <div className="text-[#1A3626]/75">{a.line1}, {a.line2 && `${a.line2}, `}{a.city}, {a.state} - {a.pincode}</div>
                      <div className="text-[#1A3626]/60 mt-1">{a.phone}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
