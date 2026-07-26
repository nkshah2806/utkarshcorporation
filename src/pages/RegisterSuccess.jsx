import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, ArrowRight, Home, LogIn } from "lucide-react";

export default function RegisterSuccess() {
  const location = useLocation();
  const fullName = location.state?.fullName || "there";
  const email = location.state?.email || "";

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl text-center">
        <div className="w-16 h-16 rounded-full bg-[#C5A059] flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-[#1A3626]" />
        </div>

        <h1 className="font-serif-display text-4xl text-[#1A3626] mb-3">Registration Successful!</h1>
        <p className="text-[#1A3626]/70 mb-2">
          Welcome, <span className="font-semibold text-[#1A3626]">{fullName}</span>! Your account has been created successfully.
        </p>
        {email && (
          <p className="text-sm text-[#1A3626]/60 mb-8">
            A confirmation message has been sent to <span className="font-medium text-[#1A3626]">{email}</span>.
          </p>
        )}

        <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-8 shadow-sm">
          <div className="flex items-center justify-center gap-3 text-[#1A3626] mb-4">
            <Home className="w-5 h-5" />
            <p className="text-sm font-medium">You can now explore our products and manage your membership.</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
            <a
              href="https://uttkarsh-member.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 bg-[#1A3626] text-[#F9F6F0] text-sm font-semibold hover:bg-[#2C4C3B] transition"
            >
              <LogIn className="w-4 h-4" />
              Go to Member Panel
            </a>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 border border-[#1A3626] text-[#1A3626] text-sm font-semibold hover:bg-[#1A3626] hover:text-[#F9F6F0] transition"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
