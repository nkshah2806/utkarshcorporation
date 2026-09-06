import { Link } from "react-router-dom";
import { Leaf, Mail, Phone, MapPin, Instagram, Facebook, Youtube } from "lucide-react";
import { useState } from "react";
import api, { formatApiError } from "@/lib/api";
import { toast } from "sonner";
import { TID } from "@/constants/testIds";
import { useContent } from "@/context/ContentContext";

export default function Footer() {
  const { content } = useContent();
  const { footer } = content;
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setBusy(true);
    try {
      await api.post("/newsletter", { email });
      toast.success("Subscribed! Watch your inbox for wellness tips.");
      setEmail("");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <footer className="bg-[#1A3626] text-[#F9F6F0] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#C5A059] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-[#1A3626]" />
              </div>
              <div>
                <div className="font-serif-display text-xl">Utkarsh Corporation</div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-[#C5A059]">Local for Vocal</div>
              </div>
            </div>
            <p className="text-sm text-[#F9F6F0]/70 leading-relaxed">
              {footer?.brandDescription || "Rooted in ancient Ayurvedic wisdom, we craft trusted herbal products for the progress of every Indian family — from local hands to your home."}
            </p>
            <div className="flex gap-3 mt-6">
              <a href={footer?.instagramUrl || "#"} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-[#F9F6F0]/20 flex items-center justify-center hover:bg-[#C5A059] hover:border-[#C5A059] hover:text-[#1A3626] transition"><Instagram className="w-4 h-4" /></a>
              <a href={footer?.facebookUrl || "#"} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-[#F9F6F0]/20 flex items-center justify-center hover:bg-[#C5A059] hover:border-[#C5A059] hover:text-[#1A3626] transition"><Facebook className="w-4 h-4" /></a>
              <a href={footer?.youtubeUrl || "#"} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-[#F9F6F0]/20 flex items-center justify-center hover:bg-[#C5A059] hover:border-[#C5A059] hover:text-[#1A3626] transition"><Youtube className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-[#C5A059] mb-5">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/shop?category=immunity" className="text-[#F9F6F0]/70 hover:text-[#C5A059]">Immunity</Link></li>
              <li><Link to="/shop?category=digestive-health" className="text-[#F9F6F0]/70 hover:text-[#C5A059]">Digestive Health</Link></li>
              <li><Link to="/shop?category=skin-care" className="text-[#F9F6F0]/70 hover:text-[#C5A059]">Skin Care</Link></li>
              <li><Link to="/shop?category=stress-sleep" className="text-[#F9F6F0]/70 hover:text-[#C5A059]">Stress & Sleep</Link></li>
              <li><Link to="/shop?bestseller=true" className="text-[#F9F6F0]/70 hover:text-[#C5A059]">Best Sellers</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-[#C5A059] mb-5">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="text-[#F9F6F0]/70 hover:text-[#C5A059]">About Us</Link></li>
              <li><Link to="/health-camps" className="text-[#F9F6F0]/70 hover:text-[#C5A059]">Health Camps</Link></li>
              <li><Link to="/distributor" className="text-[#F9F6F0]/70 hover:text-[#C5A059]">Become a Distributor</Link></li>
              <li><Link to="/contact" className="text-[#F9F6F0]/70 hover:text-[#C5A059]">Contact</Link></li>
              <li><Link to="/policies/shipping" className="text-[#F9F6F0]/70 hover:text-[#C5A059]">Shipping Policy</Link></li>
              <li><Link to="/policies/return" className="text-[#F9F6F0]/70 hover:text-[#C5A059]">Returns & Refund</Link></li>
              <li><Link to="/policies/terms" className="text-[#F9F6F0]/70 hover:text-[#C5A059]">Terms</Link></li>
              <li><Link to="/policies/privacy" className="text-[#F9F6F0]/70 hover:text-[#C5A059]">Privacy</Link></li>
            </ul>
          </div>

          {/* Newsletter + contact */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-[#C5A059] mb-5">Stay Connected</h4>
            <p className="text-sm text-[#F9F6F0]/70 mb-4">Weekly wellness tips, launches and 10% off your first order.</p>
            <form onSubmit={subscribe} className="flex gap-2 mb-6">
              <input
                data-testid={TID.newsletterInput}
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 min-w-0 bg-[#F9F6F0]/10 border border-[#F9F6F0]/20 focus:border-[#C5A059] outline-none rounded-full px-4 py-2 text-sm text-[#F9F6F0] placeholder-[#F9F6F0]/40"
              />
              <button
                data-testid={TID.newsletterSubmit}
                disabled={busy}
                className="rounded-full px-5 py-2 bg-[#C5A059] text-[#1A3626] text-sm font-semibold hover:bg-[#d4b06a] transition disabled:opacity-60"
              >
                Join
              </button>
            </form>
            <ul className="space-y-2 text-sm text-[#F9F6F0]/70">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#C5A059]" /> {footer?.phone || ""}</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#C5A059]" /> {footer?.email || ""}</li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-[#C5A059] mt-0.5" /> {footer?.address || ""}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-[#F9F6F0]/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#F9F6F0]/50">
          <div className="inline-flex flex-wrap items-center gap-x-1">
            <span aria-hidden="true">©</span>
            <span>{new Date().getFullYear()}</span>
            <span>{footer?.copyrightText || "Utkarsh Corporation. All rights reserved."}</span>
          </div>
          <div className="flex gap-4">
            <span>GMP Certified</span>
            <span>·</span>
            <span>AYUSH Compliant</span>
            <span>·</span>
            <span>100% Natural</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
