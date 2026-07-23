import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { formatApiError } from "@/lib/api";
import { toast } from "sonner";
import { TID } from "@/constants/testIds";
import { Leaf } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [registerAsAdmin, setRegisterAsAdmin] = useState(false);
  const [busy, setBusy] = useState(false);
  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        phoneNumber: form.phone,
        password: form.password,
        isAdmin: registerAsAdmin,
      };
      const u = await register(payload);
      const role = u?.role || (u?.isAdmin ? "admin" : "member");
      toast.success(`Welcome, ${u?.name || form.name}!`);
      navigate(role === "admin" ? "/" : "/");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setBusy(false);
    }
  };

  const inputCls = "w-full bg-white border border-[#1A3626]/15 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#1A3626]";

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#1A3626] flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-5 h-5 text-[#C5A059]" />
          </div>
          <h1 className="font-serif-display text-4xl text-[#1A3626] mb-2">Join Utkarsh</h1>
          <p className="text-sm text-[#1A3626]/70">Create your account to start shopping</p>
        </div>
        <form onSubmit={submit} className="bg-white rounded-2xl border border-[#1A3626]/10 p-8 space-y-4">
          <input data-testid={TID.registerName} required placeholder="Full name" value={form.name} onChange={upd("name")} className={inputCls} />
          <input data-testid={TID.registerEmail} type="email" required placeholder="Email" value={form.email} onChange={upd("email")} className={inputCls} />
          <input data-testid={TID.registerPhone} placeholder="Phone (optional)" value={form.phone} onChange={upd("phone")} className={inputCls} />
          <input data-testid={TID.registerPassword} type="password" required minLength="6" placeholder="Password (min 6 chars)" value={form.password} onChange={upd("password")} className={inputCls} />
          <label className="flex items-center gap-2 text-sm text-[#1A3626]/80">
            <input type="checkbox" checked={registerAsAdmin} onChange={(e) => setRegisterAsAdmin(e.target.checked)} className="h-4 w-4 rounded border-[#1A3626]/20" />
            Register as admin
          </label>
          <button
            data-testid={TID.registerSubmit}
            disabled={busy}
            className="w-full rounded-full py-3 bg-[#1A3626] text-[#F9F6F0] font-semibold text-sm hover:bg-[#2C4C3B] transition disabled:opacity-50"
          >
            {busy ? "Creating..." : "Create Account"}
          </button>
          <div className="text-center text-sm text-[#1A3626]/70">
            Already have an account? <Link to="/login" className="text-[#C5A059] font-semibold hover:underline">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
