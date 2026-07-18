import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { formatApiError } from "@/lib/api";
import { toast } from "sonner";
import { TID } from "@/constants/testIds";
import { Leaf } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const from = location.state?.from || "/";

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const u = await login(email, password);
      toast.success(`Welcome back, ${u.name}`);
      navigate(u.role === "admin" ? "/admin" : from);
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
          <h1 className="font-serif-display text-4xl text-[#1A3626] mb-2">Welcome back</h1>
          <p className="text-sm text-[#1A3626]/70">Sign in to your Utkarsh account</p>
        </div>
        <form onSubmit={submit} className="bg-white rounded-2xl border border-[#1A3626]/10 p-8 space-y-4">
          <div>
            <label className="text-xs text-[#5C4033] uppercase tracking-wider mb-1 block">Email</label>
            <input
              data-testid={TID.loginEmail}
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls} placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-xs text-[#5C4033] uppercase tracking-wider mb-1 block">Password</label>
            <input
              data-testid={TID.loginPassword}
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls} placeholder="••••••••"
            />
          </div>
          <button
            data-testid={TID.loginSubmit}
            disabled={busy}
            className="w-full rounded-full py-3 bg-[#1A3626] text-[#F9F6F0] font-semibold text-sm hover:bg-[#2C4C3B] transition disabled:opacity-50"
          >
            {busy ? "Signing in..." : "Sign In"}
          </button>
          <div className="text-center text-sm text-[#1A3626]/70">
            New here? <Link to="/register" className="text-[#C5A059] font-semibold hover:underline">Create an account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
