import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  User,
  Menu,
  X,
  Leaf,
  UserCheck,
  UserPlus,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { TID } from "@/constants/testIds";
import { mediaSrc } from "@/lib/api";
import api from "@/lib/api";

export default function Header() {
  const { content } = useContent();
  const { header } = content;

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");
  const [suggest, setSuggest] = useState([]);
  const [showSug, setShowSug] = useState(false);
  const [showAcct, setShowAcct] = useState(false);

  const sugRef = useRef(null);
  const acctRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (sugRef.current && !sugRef.current.contains(e.target)) setShowSug(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (acctRef.current && !acctRef.current.contains(e.target)) setShowAcct(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!q) return setSuggest([]);
    const t = setTimeout(async () => {
      try {
        const { data } = await api.get(`/products/search-suggest?q=${encodeURIComponent(q)}`);
        setSuggest(data);
        setShowSug(true);
      } catch {
        /* ignore */
      }
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/shop?q=${encodeURIComponent(q.trim())}`);
      setShowSug(false);
    }
  };

  const linkCls = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? "text-[#1A3626]" : "text-[#1A3626]/70 hover:text-[#1A3626]"
    }`;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#F9F6F0]/85 border-b border-[#1A3626]/10">
      {/* Top promo strip */}
      <div className="bg-[#1A3626] text-[#F9F6F0] text-xs py-2 text-center tracking-wider uppercase px-4">
        {header?.announcement ||
          "Free Shipping on Orders Over ₹499 · 100% Natural · GMP Certified"}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link to="/" data-testid={TID.logo} className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#1A3626] flex items-center justify-center">
              <Leaf className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div className="leading-none">
              <div className="font-serif-display text-xl sm:text-2xl font-semibold text-[#1A3626]">
                Utkarsh
              </div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#5C4033]">
                Corporation
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" end className={linkCls} data-testid={TID.navHome}>
              Home
            </Link>
            <Link to="/shop" className={linkCls} data-testid={TID.navShop}>
              Shop
            </Link>
            <Link to="/health-camps" className={linkCls} data-testid={TID.navCamps}>
              Health Camps
            </Link>
            <Link to="/gallery" className={linkCls} data-testid={TID.navGallery}>
              Gallery
            </Link>
            <Link to="/distributor" className={linkCls} data-testid={TID.navDistributor}>
              Distributor
            </Link>
            <Link to="/about" className={linkCls} data-testid={TID.navAbout}>
              About
            </Link>
            <Link to="/contact" className={linkCls} data-testid={TID.navContact}>
              Contact
            </Link>
          </nav>

          {/* Search + Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3">
            <form onSubmit={onSearchSubmit} className="relative hidden md:block" ref={sugRef}>
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#1A3626]/50" />
              <input
                data-testid={TID.headerSearch}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => q && setShowSug(true)}
                placeholder={header?.searchPlaceholder || "Search herbs, remedies..."}
                className="w-56 lg:w-72 pl-9 pr-3 py-2 text-sm rounded-full bg-white border border-[#1A3626]/15 focus:border-[#1A3626] focus:ring-1 focus:ring-[#1A3626] outline-none"
              />
              {showSug && suggest.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-[#1A3626]/10 overflow-hidden">
                  {suggest.map((s) => (
                    <Link
                      key={s.id}
                      to={`/product/${s.slug}`}
                      data-testid={TID.headerSearchSuggest}
                      onClick={() => {
                        setShowSug(false);
                        setQ("");
                      }}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-[#F9F6F0] transition"
                    >
                      <img src={mediaSrc(s.images?.[0])} alt="" className="w-10 h-10 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-[#1A3626] truncate">{s.name}</div>
                        <div className="text-xs text-[#5C4033]">
                          <span className="inline-flex items-baseline gap-0.5">
                            <span aria-hidden="true">₹</span>
                            <span>{s.price}</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </form>

            {/* Profile Dropdown containing the 3 links */}
            <div className="relative" ref={acctRef}>
              <button
                type="button"
                data-testid={TID.accountIcon}
                onClick={() => setShowAcct((s) => !s)}
                className="p-2.5 rounded-full border border-[#1A3626]/15 hover:bg-[#1A3626]/10 transition flex items-center justify-center text-[#1A3626]"
                aria-label="Account & Portals Dropdown"
              >
                <User className="w-5 h-5 text-[#1A3626]" />
              </button>

              {showAcct && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#1A3626]/10 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-[#1A3626]/10">
                    <div className="text-xs font-bold text-[#1A3626] uppercase tracking-wider">
                      Member Access
                    </div>
                    <div className="text-[11px] text-[#5C4033]">
                      Member registration and member portal
                    </div>
                  </div>

                  <div className="py-1">
                    {/* Link 1: Member Panel */}
                    <a
                      href="https://uttkarsh-member.vercel.app/"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setShowAcct(false)}
                      className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-[#1A3626] hover:bg-[#F9F6F0] transition group"
                    >
                      <div className="flex items-center gap-2.5">
                        <UserCheck className="w-4 h-4 text-[#1A3626] group-hover:scale-110 transition-transform" />
                        <span>Member Panel</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-[#5C4033] opacity-60 group-hover:opacity-100" />
                    </a>

                    {/* Link 2: Admin Portal */}
                    <a
                      href="https://uttkarsh-admin.vercel.app/"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setShowAcct(false)}
                      className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-[#1A3626] hover:bg-[#F9F6F0] transition group"
                    >
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-[#1A3626] group-hover:scale-110 transition-transform" />
                        <span>Admin Portal</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-[#5C4033] opacity-60 group-hover:opacity-100" />
                    </a>

                    {/* Link 3: Register */}
                    <a
                      href="/register"
                      onClick={() => setShowAcct(false)}
                      className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-[#C5A059] hover:bg-[#F9F6F0] transition group border-t border-[#1A3626]/5 mt-1"
                    >
                      <div className="flex items-center gap-2.5">
                        <UserPlus className="w-4 h-4 text-[#C5A059] group-hover:scale-110 transition-transform" />
                        <span>Register</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-[#C5A059] opacity-60 group-hover:opacity-100" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle button */}
            <button
              data-testid={TID.mobileMenuBtn}
              onClick={() => setMenuOpen((o) => !o)}
              className="lg:hidden p-2 rounded-full hover:bg-[#1A3626]/5"
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {menuOpen && (
          <div className="lg:hidden pb-4 border-t border-[#1A3626]/10">
            <div className="pt-4 flex flex-col gap-3">
              <Link to="/" end className={linkCls} onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link to="/shop" className={linkCls} onClick={() => setMenuOpen(false)}>
                Shop
              </Link>
              <Link to="/health-camps" className={linkCls} onClick={() => setMenuOpen(false)}>
                Health Camps
              </Link>
              <Link to="/gallery" className={linkCls} onClick={() => setMenuOpen(false)}>
                Gallery
              </Link>
              <Link to="/distributor" className={linkCls} onClick={() => setMenuOpen(false)}>
                Distributor
              </Link>
              <Link to="/about" className={linkCls} onClick={() => setMenuOpen(false)}>
                About
              </Link>
              <Link to="/contact" className={linkCls} onClick={() => setMenuOpen(false)}>
                Contact
              </Link>

              {/* Mobile Portal Links */}
              <div className="pt-3 border-t border-[#1A3626]/10 flex flex-col gap-2">
                <div className="text-[11px] font-bold uppercase text-[#5C4033] tracking-wider px-1">
                  Portals & Access
                </div>
                <a
                  href="https://uttkarsh-member.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#1A3626] text-[#F9F6F0] text-xs font-semibold"
                >
                  <span className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4" /> Member Panel
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://uttkarsh-admin.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-[#1A3626]/20 text-[#1A3626] text-xs font-semibold"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Admin Portal
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://uttkarsh-member.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#C5A059] text-[#1A3626] text-xs font-bold"
                >
                  <span className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" /> Register
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
