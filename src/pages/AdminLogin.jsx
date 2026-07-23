import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { formatApiError } from "@/lib/api";
import { toast } from "sonner";
import { Leaf } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.post("/admin/login", form);
      if (data?.token) {
        localStorage.setItem("frenchies_admin_token", data.token);
      }
      toast.success(data?.message || "Admin login successful");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#1A3626] flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-5 h-5 text-[#C5A059]" />
          </div>
          <h1 className="font-serif-display text-4xl text-[#1A3626] mb-2">Admin Login</h1>
          <p className="text-sm text-[#1A3626]/70">Access the Frenchies admin panel</p>
        </div>
        <form onSubmit={submit} className="bg-white rounded-2xl border border-[#1A3626]/10 p-8 space-y-4">
          <input required placeholder="Username or Email" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="w-full bg-white border border-[#1A3626]/15 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#1A3626]" />
          <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full bg-white border border-[#1A3626]/15 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#1A3626]" />
          <button disabled={busy} className="w-full rounded-full py-3 bg-[#1A3626] text-[#F9F6F0] font-semibold text-sm hover:bg-[#2C4C3B] transition disabled:opacity-50">
            {busy ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
