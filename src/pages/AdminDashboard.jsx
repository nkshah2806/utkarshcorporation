import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { formatApiError } from "@/lib/api";
import { toast } from "sonner";
import {
  Leaf,
  LayoutDashboard,
  Megaphone,
  ShoppingBag,
  Stethoscope,
  Users,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Image as ImageIcon
} from "lucide-react";
import { useContent } from "@/context/ContentContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { content, updateContent, resetContent } = useContent();

  const [activeTab, setActiveTab] = useState("homepage");
  const [members, setMembers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state for content editing
  const [formContent, setFormContent] = useState(content);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormContent(content);
  }, [content]);

  useEffect(() => {
    const token = localStorage.getItem("frenchies_admin_token") || localStorage.getItem("uc_token");
    if (!token) {
      // allow view mode or login redirect, but let's check local token
    }

    const loadAdminData = async () => {
      try {
        const [memRes, inqRes] = await Promise.allSettled([
          api.get("/admin/members"),
          api.get("/admin/distributor-inquiries"),
        ]);

        if (memRes.status === "fulfilled") {
          setMembers(memRes.value.data?.members || memRes.value.data || []);
        }
        if (inqRes.status === "fulfilled") {
          setInquiries(inqRes.value.data || []);
        }
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [navigate]);

  const handleSaveAll = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      await updateContent(formContent);
    } catch (err) {
      toast.error("Failed to save content updates.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (window.confirm("Are you sure you want to reset all dynamic content to default values?")) {
      await resetContent();
    }
  };

  const updateNestedField = (category, field, value) => {
    setFormContent((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  // Testimonial helpers
  const handleTestimonialChange = (index, field, value) => {
    const list = [...(formContent.testimonials || [])];
    list[index] = { ...list[index], [field]: value };
    setFormContent((prev) => ({ ...prev, testimonials: list }));
  };

  const addTestimonial = () => {
    const newTestimonial = {
      id: Date.now(),
      name: "New Customer",
      body: "Great experience with Utkarsh products!",
      stars: 5,
    };
    setFormContent((prev) => ({
      ...prev,
      testimonials: [...(prev.testimonials || []), newTestimonial],
    }));
  };

  const removeTestimonial = (index) => {
    const list = [...(formContent.testimonials || [])];
    list.splice(index, 1);
    setFormContent((prev) => ({ ...prev, testimonials: list }));
  };

  // Stat helpers
  const handleStatChange = (index, field, value) => {
    const stats = [...(formContent.mission?.stats || [])];
    stats[index] = { ...stats[index], [field]: value };
    setFormContent((prev) => ({
      ...prev,
      mission: { ...prev.mission, stats },
    }));
  };

  const addStat = () => {
    const newStat = { id: Date.now(), number: "100+", label: "New Metric" };
    const stats = [...(formContent.mission?.stats || []), newStat];
    setFormContent((prev) => ({
      ...prev,
      mission: { ...prev.mission, stats },
    }));
  };

  const removeStat = (index) => {
    const stats = [...(formContent.mission?.stats || [])];
    stats.splice(index, 1);
    setFormContent((prev) => ({
      ...prev,
      mission: { ...prev.mission, stats },
    }));
  };

  // Trust badge helpers
  const handleBadgeChange = (index, field, value) => {
    const badges = [...(formContent.trustBadges || [])];
    badges[index] = { ...badges[index], [field]: value };
    setFormContent((prev) => ({ ...prev, trustBadges: badges }));
  };

  const inputStyle =
    "w-full bg-[#F9F6F0] border border-[#1A3626]/20 rounded-xl px-4 py-2.5 text-sm text-[#1A3626] outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition";

  return (
    <div className="min-h-screen bg-[#F9F6F0]/60 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#1A3626]/10">
          <div>
            <div className="flex items-center gap-2 text-[#1A3626] mb-1">
              <Leaf className="w-6 h-6 text-[#C5A059]" />
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#5C4033]">
                Utkarsh Admin Console
              </span>
            </div>
            <h1 className="font-serif-display text-3xl sm:text-4xl text-[#1A3626]">
              Dynamic Frontend Manager
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#1A3626]/20 bg-white text-[#5C4033] hover:bg-[#F9F6F0] text-sm font-medium transition"
            >
              <RotateCcw className="w-4 h-4" /> Reset Defaults
            </button>
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1A3626] text-[#F9F6F0] hover:bg-[#2C4C3B] text-sm font-semibold transition shadow-md disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-[#C5A059]" />
              {saving ? "Saving Changes..." : "Publish Live Updates"}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-[#1A3626]/10 shadow-sm">
          {[
            { id: "homepage", label: "Homepage Components", icon: LayoutDashboard },
            { id: "headerfooter", label: "Header & Footer CMS", icon: Megaphone },
            { id: "products", label: "Products Overview", icon: ShoppingBag },
            { id: "healthcamps", label: "Health Camps", icon: Stethoscope },
            { id: "members", label: "Registered Members", icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition ${
                  active
                    ? "bg-[#1A3626] text-[#F9F6F0] shadow-sm"
                    : "text-[#1A3626]/70 hover:bg-[#F9F6F0] hover:text-[#1A3626]"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-[#C5A059]" : ""}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT */}

        {/* TAB 1: HOMEPAGE COMPONENTS */}
        {activeTab === "homepage" && (
          <div className="space-y-10">
            {/* Hero Editor */}
            <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-6 md:p-8 shadow-sm">
              <h2 className="font-serif-display text-2xl text-[#1A3626] mb-6 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#C5A059]" /> Hero Banner Component
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5C4033] mb-2">
                    Top Badge Text
                  </label>
                  <input
                    value={formContent.hero?.badge || ""}
                    onChange={(e) => updateNestedField("hero", "badge", e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5C4033] mb-2">
                    Hero Background Image URL
                  </label>
                  <input
                    value={formContent.hero?.bgImage || ""}
                    onChange={(e) => updateNestedField("hero", "bgImage", e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5C4033] mb-2">
                    Title Line 1
                  </label>
                  <input
                    value={formContent.hero?.titleLine1 || ""}
                    onChange={(e) => updateNestedField("hero", "titleLine1", e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5C4033] mb-2">
                    Title Line 2 (Highlighted)
                  </label>
                  <input
                    value={formContent.hero?.titleLine2 || ""}
                    onChange={(e) => updateNestedField("hero", "titleLine2", e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5C4033] mb-2">
                    Description Paragraph
                  </label>
                  <textarea
                    rows={3}
                    value={formContent.hero?.description || ""}
                    onChange={(e) => updateNestedField("hero", "description", e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5C4033] mb-2">
                    Primary CTA Button Text
                  </label>
                  <input
                    value={formContent.hero?.primaryCtaText || ""}
                    onChange={(e) => updateNestedField("hero", "primaryCtaText", e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5C4033] mb-2">
                    Primary CTA Link
                  </label>
                  <input
                    value={formContent.hero?.primaryCtaLink || "/shop"}
                    onChange={(e) => updateNestedField("hero", "primaryCtaLink", e.target.value)}
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-6 md:p-8 shadow-sm">
              <h2 className="font-serif-display text-2xl text-[#1A3626] mb-6">
                Trust Badges Strip
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(formContent.trustBadges || []).map((badge, idx) => (
                  <div key={badge.id || idx} className="bg-[#F9F6F0] p-4 rounded-xl border border-[#1A3626]/10">
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#5C4033] mb-1">
                      Badge #{idx + 1}
                    </label>
                    <input
                      value={badge.text}
                      onChange={(e) => handleBadgeChange(idx, "text", e.target.value)}
                      className={inputStyle}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Mission Story & Stats Editor */}
            <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-6 md:p-8 shadow-sm">
              <h2 className="font-serif-display text-2xl text-[#1A3626] mb-6">
                Our Mission Story & Impact Stats Component
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5C4033] mb-2">
                    Mission Badge
                  </label>
                  <input
                    value={formContent.mission?.badge || ""}
                    onChange={(e) => updateNestedField("mission", "badge", e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5C4033] mb-2">
                    Mission Image URL
                  </label>
                  <input
                    value={formContent.mission?.image || ""}
                    onChange={(e) => updateNestedField("mission", "image", e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5C4033] mb-2">
                    Mission Title
                  </label>
                  <input
                    value={formContent.mission?.title || ""}
                    onChange={(e) => updateNestedField("mission", "title", e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5C4033] mb-2">
                    Paragraph 1
                  </label>
                  <textarea
                    rows={2}
                    value={formContent.mission?.paragraph1 || ""}
                    onChange={(e) => updateNestedField("mission", "paragraph1", e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5C4033] mb-2">
                    Paragraph 2
                  </label>
                  <textarea
                    rows={2}
                    value={formContent.mission?.paragraph2 || ""}
                    onChange={(e) => updateNestedField("mission", "paragraph2", e.target.value)}
                    className={inputStyle}
                  />
                </div>
              </div>

              {/* Stats */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#1A3626]">Impact Statistics Counters</h3>
                  <button
                    onClick={addStat}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A3626] bg-[#C5A059]/20 px-3 py-1.5 rounded-full hover:bg-[#C5A059]/30"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Stat Counter
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(formContent.mission?.stats || []).map((stat, idx) => (
                    <div key={stat.id || idx} className="bg-[#F9F6F0] p-4 rounded-xl border border-[#1A3626]/10 relative">
                      <button
                        onClick={() => removeStat(idx)}
                        className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#5C4033]">Number Value</label>
                          <input
                            value={stat.number}
                            onChange={(e) => handleStatChange(idx, "number", e.target.value)}
                            className={inputStyle}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#5C4033]">Label Text</label>
                          <input
                            value={stat.label}
                            onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                            className={inputStyle}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Testimonials Editor */}
            <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-serif-display text-2xl text-[#1A3626]">Customer Testimonials Component</h2>
                  <p className="text-xs text-[#1A3626]/70">Add or modify reviews displayed on the home page.</p>
                </div>
                <button
                  onClick={addTestimonial}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A3626] bg-[#C5A059]/20 px-3.5 py-2 rounded-full hover:bg-[#C5A059]/30"
                >
                  <Plus className="w-4 h-4" /> Add Testimonial
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(formContent.testimonials || []).map((t, idx) => (
                  <div key={t.id || idx} className="bg-[#F9F6F0] p-5 rounded-2xl border border-[#1A3626]/10 relative">
                    <button
                      onClick={() => removeTestimonial(idx)}
                      className="absolute top-3 right-3 p-1 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs uppercase font-bold text-[#5C4033] mb-1">Customer Name & City</label>
                        <input
                          value={t.name}
                          onChange={(e) => handleTestimonialChange(idx, "name", e.target.value)}
                          className={inputStyle}
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase font-bold text-[#5C4033] mb-1">Review Body</label>
                        <textarea
                          rows={3}
                          value={t.body}
                          onChange={(e) => handleTestimonialChange(idx, "body", e.target.value)}
                          className={inputStyle}
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase font-bold text-[#5C4033] mb-1">Rating Stars (1-5)</label>
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={t.stars}
                          onChange={(e) => handleTestimonialChange(idx, "stars", parseInt(e.target.value) || 5)}
                          className={inputStyle}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Distributor CTA Banner */}
            <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-6 md:p-8 shadow-sm">
              <h2 className="font-serif-display text-2xl text-[#1A3626] mb-6">Distributor Banner Component</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5C4033] mb-2">
                    Badge Title
                  </label>
                  <input
                    value={formContent.distributorCta?.badge || ""}
                    onChange={(e) => updateNestedField("distributorCta", "badge", e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5C4033] mb-2">
                    Heading Title
                  </label>
                  <input
                    value={formContent.distributorCta?.title || ""}
                    onChange={(e) => updateNestedField("distributorCta", "title", e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5C4033] mb-2">
                    Description Text
                  </label>
                  <textarea
                    rows={2}
                    value={formContent.distributorCta?.description || ""}
                    onChange={(e) => updateNestedField("distributorCta", "description", e.target.value)}
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HEADER & FOOTER CMS */}
        {activeTab === "headerfooter" && (
          <div className="space-y-10">
            {/* Header Settings */}
            <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-6 md:p-8 shadow-sm">
              <h2 className="font-serif-display text-2xl text-[#1A3626] mb-6">Header Component Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5C4033] mb-2">
                    Top Announcement Bar Text
                  </label>
                  <input
                    value={formContent.header?.announcement || ""}
                    onChange={(e) => updateNestedField("header", "announcement", e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5C4033] mb-2">
                    Search Bar Placeholder
                  </label>
                  <input
                    value={formContent.header?.searchPlaceholder || ""}
                    onChange={(e) => updateNestedField("header", "searchPlaceholder", e.target.value)}
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Footer Settings */}
            <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-6 md:p-8 shadow-sm">
              <h2 className="font-serif-display text-2xl text-[#1A3626] mb-6">Footer & Contact Info Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5C4033] mb-2">
                    Footer Brand Description
                  </label>
                  <textarea
                    rows={3}
                    value={formContent.footer?.brandDescription || ""}
                    onChange={(e) => updateNestedField("footer", "brandDescription", e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5C4033] mb-2">
                    Customer Care Phone Number
                  </label>
                  <input
                    value={formContent.footer?.phone || ""}
                    onChange={(e) => updateNestedField("footer", "phone", e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5C4033] mb-2">
                    Support Email Address
                  </label>
                  <input
                    value={formContent.footer?.email || ""}
                    onChange={(e) => updateNestedField("footer", "email", e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5C4033] mb-2">
                    Headquarters Address
                  </label>
                  <input
                    value={formContent.footer?.address || ""}
                    onChange={(e) => updateNestedField("footer", "address", e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5C4033] mb-2">
                    Copyright Notice
                  </label>
                  <input
                    value={formContent.footer?.copyrightText || ""}
                    onChange={(e) => updateNestedField("footer", "copyrightText", e.target.value)}
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS OVERVIEW */}
        {activeTab === "products" && (
          <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif-display text-2xl text-[#1A3626]">Products Catalog</h2>
              <button
                onClick={() => navigate("/shop")}
                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-[#1A3626] text-[#F9F6F0]"
              >
                View Live Storefront Catalog
              </button>
            </div>
            <p className="text-sm text-[#1A3626]/80 mb-4">
              Products and categories are dynamically rendered on the frontend from the API service. All items support filtering, search, and stock status.
            </p>
          </div>
        )}

        {/* TAB 4: HEALTH CAMPS */}
        {activeTab === "healthcamps" && (
          <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif-display text-2xl text-[#1A3626]">Health Camps & Events</h2>
              <button
                onClick={() => navigate("/health-camps")}
                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-[#1A3626] text-[#F9F6F0]"
              >
                View Live Health Camps Page
              </button>
            </div>
            <p className="text-sm text-[#1A3626]/80 mb-4">
              Health camps are dynamically loaded onto the frontend. Users can register online for upcoming sessions.
            </p>
          </div>
        )}

        {/* TAB 5: MEMBERS & SUBMISSIONS */}
        {activeTab === "members" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-6 md:p-8 shadow-sm">
              <h2 className="font-serif-display text-2xl text-[#1A3626] mb-4">Registered Members</h2>
              {loading ? (
                <div className="p-8 text-center text-[#1A3626]/60">Loading members...</div>
              ) : members.length === 0 ? (
                <div className="p-6 text-center text-[#1A3626]/60 bg-[#F9F6F0] rounded-xl">
                  No members registered yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-[#F9F6F0] text-[#5C4033]">
                      <tr>
                        <th className="px-4 py-3">Full Name</th>
                        <th className="px-4 py-3">Mobile Number</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">City</th>
                        <th className="px-4 py-3">State</th>
                        <th className="px-4 py-3">Registered On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member) => (
                        <tr key={member._id || member.id} className="border-t border-[#1A3626]/10">
                          <td className="px-4 py-3 font-semibold">{member.fullName || member.name}</td>
                          <td className="px-4 py-3">{member.mobileNumber || member.phone}</td>
                          <td className="px-4 py-3">{member.email}</td>
                          <td className="px-4 py-3">{member.city}</td>
                          <td className="px-4 py-3">{member.state}</td>
                          <td className="px-4 py-3">
                            {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
