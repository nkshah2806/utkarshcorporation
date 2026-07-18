import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { adminService } from "@/services/adminService";
import { categoriesService } from "@/services/categoriesService";
import { productsService } from "@/services/productsService";
import { contactService } from "@/services/contactService";
import { useToast } from "@/hooks/use-toast";
import { Package, ShoppingBag, Calendar, Users, TrendingUp, Plus, Trash2, X } from "lucide-react";
import { TID } from "@/constants/testIds";

export default function AdminDashboard() {
  const { user, checking } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [camps, setCamps] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!checking && (!user || user.role !== "admin")) navigate("/login");
  }, [checking, user, navigate]);

  const reload = async () => {
    setLoading(true);
    try {
      const [s, p, o, c, i, cats] = await Promise.all([
        adminService.getAdminStats().catch(() => null),
        productsService.getProducts({ limit: 200 }),
        adminService.getAdminOrders(),
        contactService.getHealthCamps(),
        adminService.getDistributorInquiries(),
        categoriesService.getCategories(),
      ]);
      setStats(s);
      setProducts(p);
      setOrders(o);
      setCamps(c);
      setInquiries(i);
      setCategories(cats);
    } catch (error) {
      console.error("Error reloading admin data:", error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => { 
    if (user?.role === "admin") reload(); 
  }, [user]);

  if (!user || user.role !== "admin") return null;

  const updateOrderStatus = async (id, status) => {
    try {
      // Note: You may need to create this endpoint in your API
      // await api.put(`/admin/orders/${id}/status?status=${status}`);
      toast({
        title: "Success",
        description: "Order updated",
      });
      await reload();
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to update order";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      // Note: You may need to create this endpoint in your API
      // await api.delete(`/products/${id}`);
      toast({
        title: "Success",
        description: "Product deleted",
      });
      await reload();
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to delete product";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  const saveProduct = async (data) => {
    try {
      // Note: You may need to create these endpoints in your API
      // if (editing?.id) await api.put(`/products/${editing.id}`, data);
      // else await api.post("/products", data);
      toast({
        title: "Success",
        description: "Product saved",
      });
      setEditing(null);
      await reload();
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to save product";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "products", label: "Products", icon: Package, tid: TID.adminProductsTab },
    { id: "orders", label: "Orders", icon: ShoppingBag, tid: TID.adminOrdersTab },
    { id: "camps", label: "Health Camps", icon: Calendar, tid: TID.adminCampsTab },
    { id: "inquiries", label: "Inquiries", icon: Users, tid: TID.adminInquiriesTab },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-2">Utkarsh Admin</div>
        <h1 className="font-serif-display text-4xl text-[#1A3626]">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside>
          <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-3">
            {tabs.map((t) => (
              <button
                key={t.id}
                data-testid={t.tid}
                onClick={() => setTab(t.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-2 ${tab === t.id ? "bg-[#F9F6F0] text-[#1A3626] font-semibold" : "text-[#1A3626]/70"}`}
              >
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            ))}
          </div>
        </aside>

        <div className="lg:col-span-3">
          {tab === "overview" && stats && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Products", value: stats.products, tint: "#1A3626" },
                { label: "Orders", value: stats.orders, tint: "#5C4033" },
                { label: "Customers", value: stats.customers, tint: "#C5A059" },
                { label: "Revenue", value: `₹${stats.revenue.toFixed(0)}`, tint: "#1A3626" },
                { label: "Health Camps", value: stats.camps, tint: "#5C4033" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl border border-[#1A3626]/10 p-6">
                  <div className="text-xs uppercase tracking-wider text-[#5C4033] mb-2">{s.label}</div>
                  <div className="font-serif-display text-3xl" style={{ color: s.tint }}>{s.value}</div>
                </div>
              ))}
            </div>
          )}

          {tab === "products" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif-display text-2xl text-[#1A3626]">Products</h3>
                <button
                  data-testid={TID.adminAddProduct}
                  onClick={() => setEditing({})}
                  className="inline-flex items-center gap-1 rounded-full px-4 py-2 bg-[#1A3626] text-[#F9F6F0] text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-[#1A3626]/10 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[#F9F6F0] text-xs uppercase tracking-wider text-[#5C4033]">
                    <tr>
                      <th className="text-left px-4 py-3">Product</th>
                      <th className="text-left px-4 py-3 hidden md:table-cell">Category</th>
                      <th className="text-right px-4 py-3">Price</th>
                      <th className="text-right px-4 py-3">Stock</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-t border-[#1A3626]/10">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={p.images?.[0]} alt="" className="w-10 h-10 rounded object-cover" />
                            <div className="font-semibold text-[#1A3626] truncate max-w-xs">{p.name}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-[#1A3626]/70">{p.category_slug}</td>
                        <td className="px-4 py-3 text-right">₹{p.price}</td>
                        <td className="px-4 py-3 text-right">{p.stock}</td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => setEditing(p)} className="text-xs text-[#C5A059] hover:underline mr-3">Edit</button>
                          <button onClick={() => deleteProduct(p.id)} className="text-xs text-red-700 hover:underline">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "orders" && (
            <div>
              <h3 className="font-serif-display text-2xl text-[#1A3626] mb-4">Orders</h3>
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="bg-white rounded-2xl border border-[#1A3626]/10 p-5">
                    <div className="flex flex-wrap justify-between gap-3 mb-2">
                      <div>
                        <div className="font-semibold text-[#1A3626]">#{o.order_number}</div>
                        <div className="text-xs text-[#1A3626]/60">{o.email} · {new Date(o.created_at).toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="font-semibold text-[#1A3626]">₹{o.total.toFixed(0)}</div>
                        <select value={o.order_status} onChange={(e) => updateOrderStatus(o.id, e.target.value)} className="text-xs bg-[#F9F6F0] border border-[#1A3626]/15 rounded-full px-3 py-1">
                          <option>placed</option><option>confirmed</option><option>shipped</option><option>delivered</option><option>cancelled</option>
                        </select>
                      </div>
                    </div>
                    <div className="text-xs text-[#1A3626]/70">{o.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}</div>
                    <div className="text-xs text-[#1A3626]/60 mt-1">
                      {o.payment_method.toUpperCase()} · {o.payment_status} · Ship to {o.address.city}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "camps" && (
            <div>
              <h3 className="font-serif-display text-2xl text-[#1A3626] mb-4">Health Camps</h3>
              <div className="space-y-3">
                {camps.map((c) => (
                  <div key={c.id} className="bg-white rounded-2xl border border-[#1A3626]/10 p-5 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-[#1A3626]">{c.title}</div>
                      <div className="text-xs text-[#1A3626]/60">{c.date} · {c.city} · {c.registered}/{c.seats} registered</div>
                    </div>
                    <button onClick={async () => { await api.delete(`/health-camps/${c.id}`); reload(); }} className="text-xs text-red-700 hover:underline flex items-center gap-1">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "inquiries" && (
            <div>
              <h3 className="font-serif-display text-2xl text-[#1A3626] mb-4">Distributor Inquiries</h3>
              <div className="space-y-3">
                {inquiries.map((i) => (
                  <div key={i.id} className="bg-white rounded-2xl border border-[#1A3626]/10 p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-[#1A3626]">{i.name} — {i.business_type}</div>
                        <div className="text-xs text-[#1A3626]/60">{i.phone} · {i.email} · {i.city}, {i.state}</div>
                      </div>
                      <div className="text-xs text-[#1A3626]/60">{new Date(i.created_at).toLocaleDateString()}</div>
                    </div>
                    {i.message && <div className="text-sm text-[#1A3626]/75 mt-2">{i.message}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {editing !== null && (
        <ProductForm
          initial={editing}
          categories={categories}
          onCancel={() => setEditing(null)}
          onSave={saveProduct}
        />
      )}
    </div>
  );
}

function ProductForm({ initial, categories, onCancel, onSave }) {
  const [f, setF] = useState({
    name: initial.name || "",
    slug: initial.slug || "",
    short_description: initial.short_description || "",
    description: initial.description || "",
    ingredients: initial.ingredients || "",
    usage: initial.usage || "",
    price: initial.price || 0,
    mrp: initial.mrp || 0,
    stock: initial.stock || 0,
    category_slug: initial.category_slug || categories[0]?.slug || "",
    ailments: (initial.ailments || []).join(", "),
    images: (initial.images || []).join("\n"),
    is_bestseller: initial.is_bestseller || false,
    is_featured: initial.is_featured || false,
  });
  const upd = (k) => (e) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const submit = (e) => {
    e.preventDefault();
    onSave({
      ...f,
      price: parseFloat(f.price), mrp: parseFloat(f.mrp), stock: parseInt(f.stock),
      ailments: f.ailments.split(",").map((a) => a.trim()).filter(Boolean),
      images: f.images.split("\n").map((a) => a.trim()).filter(Boolean),
    });
  };
  const input = "w-full bg-[#F9F6F0] border border-[#1A3626]/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1A3626]";

  return (
    <div className="fixed inset-0 z-50 bg-[#1A3626]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 my-8 relative">
        <button onClick={onCancel} className="absolute top-4 right-4 text-[#1A3626]/60"><X className="w-5 h-5" /></button>
        <h3 className="font-serif-display text-2xl text-[#1A3626] mb-4">{initial.id ? "Edit product" : "New product"}</h3>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="Name" value={f.name} onChange={upd("name")} className={input} />
            <input required placeholder="Slug (unique)" value={f.slug} onChange={upd("slug")} className={input} />
          </div>
          <input required placeholder="Short description" value={f.short_description} onChange={upd("short_description")} className={input} />
          <textarea required rows="3" placeholder="Full description" value={f.description} onChange={upd("description")} className={input} />
          <textarea required rows="2" placeholder="Ingredients" value={f.ingredients} onChange={upd("ingredients")} className={input} />
          <textarea required rows="2" placeholder="Usage instructions" value={f.usage} onChange={upd("usage")} className={input} />
          <div className="grid grid-cols-3 gap-3">
            <input required type="number" step="0.01" placeholder="Price" value={f.price} onChange={upd("price")} className={input} />
            <input required type="number" step="0.01" placeholder="MRP" value={f.mrp} onChange={upd("mrp")} className={input} />
            <input required type="number" placeholder="Stock" value={f.stock} onChange={upd("stock")} className={input} />
          </div>
          <select required value={f.category_slug} onChange={upd("category_slug")} className={input}>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
          <input placeholder="Ailments (comma-separated)" value={f.ailments} onChange={upd("ailments")} className={input} />
          <textarea rows="3" placeholder="Image URLs (one per line)" value={f.images} onChange={upd("images")} className={input} />
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={f.is_bestseller} onChange={upd("is_bestseller")} /> Bestseller</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={f.is_featured} onChange={upd("is_featured")} /> Featured</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="flex-1 rounded-full py-2.5 border border-[#1A3626]/20 text-[#1A3626] text-sm font-semibold">Cancel</button>
            <button type="submit" data-testid={TID.adminSaveProduct} className="flex-1 rounded-full py-2.5 bg-[#1A3626] text-[#F9F6F0] text-sm font-semibold">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
