import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Search, ShoppingBag, User, Menu, X, LogOut, Leaf } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { TID } from "@/constants/testIds";
import api from "@/lib/api";

export default function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
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
      } catch { /* ignore */ }
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
    `text-sm font-medium transition-colors ${isActive ? "text-[#1A3626]" : "text-[#1A3626]/70 hover:text-[#1A3626]"}`;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#F9F6F0]/85 border-b border-[#1A3626]/10">
      {/* Top promo strip */}
      <div className="bg-[#1A3626] text-[#F9F6F0] text-xs py-2 text-center tracking-wider uppercase">
        Free Shipping on Orders Over ₹499 · 100% Natural · GMP Certified
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link to="/" data-testid={TID.logo} className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#1A3626] flex items-center justify-center">
              <Leaf className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div className="leading-none">
              <div className="font-serif-display text-xl sm:text-2xl font-semibold text-[#1A3626]">Utkarsh</div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#5C4033]">Corporation</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" end className={linkCls} data-testid={TID.navHome}>Home</Link>
            <Link to="/shop" className={linkCls} data-testid={TID.navShop}>Shop</Link>
            <Link to="/health-camps" className={linkCls} data-testid={TID.navCamps}>Health Camps</Link>
            <Link to="/distributor" className={linkCls} data-testid={TID.navDistributor}>Distributor</Link>
            <Link to="/about" className={linkCls} data-testid={TID.navAbout}>About</Link>
            <Link to="/contact" className={linkCls} data-testid={TID.navContact}>Contact</Link>
          </nav>

          {/* Search + icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <form onSubmit={onSearchSubmit} className="relative hidden md:block" ref={sugRef}>
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#1A3626]/50" />
              <input
                data-testid={TID.headerSearch}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => q && setShowSug(true)}
                placeholder="Search herbs, remedies..."
                className="w-56 lg:w-72 pl-9 pr-3 py-2 text-sm rounded-full bg-white border border-[#1A3626]/15 focus:border-[#1A3626] focus:ring-1 focus:ring-[#1A3626] outline-none"
              />
              {showSug && suggest.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-[#1A3626]/10 overflow-hidden">
                  {suggest.map((s) => (
                    <Link
                      key={s.id}
                      to={`/product/${s.slug}`}
                      data-testid={TID.headerSearchSuggest}
                      onClick={() => { setShowSug(false); setQ(""); }}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-[#F9F6F0] transition"
                    >
                      <img src={s.images?.[0]} alt="" className="w-10 h-10 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-[#1A3626] truncate">{s.name}</div>
                        <div className="text-xs text-[#5C4033]">₹{s.price}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </form>

            <Link to="/admin/login" className="hidden sm:inline-flex items-center rounded-full border border-[#1A3626]/15 px-3 py-2 text-sm font-medium text-[#1A3626] hover:bg-[#F9F6F0] transition">
              Admin Login
            </Link>

            {/* Account */}
            <div className="relative" ref={acctRef}>
              <button
                type="button"
                data-testid={TID.accountIcon}
                onClick={() => setShowAcct((s) => !s)}
                className="p-2 rounded-full hover:bg-[#1A3626]/5 transition"
                aria-label="Account"
              >
                <User className="w-5 h-5 text-[#1A3626]" />
              </button>
              {showAcct && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-[#1A3626]/10 py-2 z-50">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-xs text-[#5C4033] border-b border-[#1A3626]/10">
                        Hi, <span className="font-semibold text-[#1A3626]">{user.name}</span>
                      </div>
                      <Link to="/account" onClick={() => setShowAcct(false)} className="block px-4 py-2 text-sm hover:bg-[#F9F6F0]">My Account</Link>
                      <button
                        type="button"
                        data-testid={TID.logoutBtn}
                        onClick={() => {
                          setShowAcct(false);
                          logout();
                          navigate("/");
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-[#F9F6F0] flex items-center gap-2 text-[#5C4033]"
                      >
                        <LogOut className="w-4 h-4" /> Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setShowAcct(false)} className="block px-4 py-2 text-sm hover:bg-[#F9F6F0]">Sign in</Link>
                      <Link to="/register" onClick={() => setShowAcct(false)} className="block px-4 py-2 text-sm hover:bg-[#F9F6F0]">Create account</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              data-testid={TID.cartIcon}
              className="relative p-2 rounded-full hover:bg-[#1A3626]/5 transition"
            >
              <ShoppingBag className="w-5 h-5 text-[#1A3626]" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#C5A059] text-[#1A3626] text-[10px] font-bold rounded-full px-1 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

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

        {menuOpen && (
          <div className="lg:hidden pb-4 border-t border-[#1A3626]/10">
            <div className="pt-4 flex flex-col gap-3">
              <Link to="/" end className={linkCls} onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/shop" className={linkCls} onClick={() => setMenuOpen(false)}>Shop</Link>
              <Link to="/health-camps" className={linkCls} onClick={() => setMenuOpen(false)}>Health Camps</Link>
              <Link to="/distributor" className={linkCls} onClick={() => setMenuOpen(false)}>Distributor</Link>
              <Link to="/about" className={linkCls} onClick={() => setMenuOpen(false)}>About</Link>
              <Link to="/contact" className={linkCls} onClick={() => setMenuOpen(false)}>Contact</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
