import { useState } from "react";
import { contactService } from "@/services/contactService";
import { useToast } from "@/hooks/use-toast";
import { TID } from "@/constants/testIds";
import { TrendingUp, Users, GraduationCap, Handshake, CheckCircle2 } from "lucide-react";
import { useContent } from "@/context/ContentContext";

export default function Distributor() {
  const { content } = useContent();
  const { distributorCta } = content;
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "", phone: "", email: "", city: "", state: "", business_type: "", message: "",
  });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await contactService.submitDistributorInquiry(form);
      setSent(true);
      toast({
        title: "Success",
        description: "Application received. Our team will call within 48 hours.",
      });
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to submit application";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const inputCls = "w-full bg-[#F9F6F0] border border-[#1A3626]/15 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1A3626]";

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#5C4033] text-[#F9F6F0] py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-3">{distributorCta?.badge || "Business Opportunity"}</div>
          <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl mb-4">
            {distributorCta?.title || "Become an Utkarsh Distributor"}
          </h1>
          <p className="text-[#F9F6F0]/85 max-w-2xl mx-auto">
            {distributorCta?.description || "Build a rewarding business selling India's most trusted Ayurvedic products. Attractive margins, complete training, marketing support — and a mission that matters."}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Benefits */}
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-3">Why partner with us</div>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1A3626] mb-8">Grow with a mission-driven brand</h2>
          <div className="space-y-5">
            {[
              { icon: TrendingUp, title: "High margins", body: "Attractive per-unit margins with tiered volume bonuses." },
              { icon: GraduationCap, title: "Complete training", body: "Product knowledge, Ayurvedic basics, sales training — all covered." },
              { icon: Users, title: "Marketing support", body: "Digital assets, brochures, and lead generation from our network." },
              { icon: Handshake, title: "Trusted brand", body: "Ride on 40k+ happy customers and 120+ existing partners across India." },
            ].map((b) => (
              <div key={b.title} className="flex gap-4">
                <div className="w-11 h-11 rounded-full bg-[#C5A059]/20 flex items-center justify-center shrink-0">
                  <b.icon className="w-5 h-5 text-[#5C4033]" />
                </div>
                <div>
                  <div className="font-semibold text-[#1A3626] mb-1">{b.title}</div>
                  <div className="text-sm text-[#1A3626]/70">{b.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div>
          <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-8">
            {sent ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-[#C5A059] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6 text-[#1A3626]" />
                </div>
                <h3 className="font-serif-display text-2xl text-[#1A3626] mb-2">Application received</h3>
                <p className="text-sm text-[#1A3626]/70">Our partnerships team will call you within 48 hours to discuss next steps.</p>
              </div>
            ) : (
              <>
                <h3 className="font-serif-display text-2xl text-[#1A3626] mb-1">Apply now</h3>
                <p className="text-sm text-[#1A3626]/70 mb-5">Takes under 2 minutes.</p>
                <form onSubmit={submit} className="space-y-3">
                  <input required placeholder="Full name" value={form.name} onChange={upd("name")} className={inputCls} />
                  <div className="grid grid-cols-2 gap-3">
                    <input required placeholder="Phone" value={form.phone} onChange={upd("phone")} className={inputCls} />
                    <input required type="email" placeholder="Email" value={form.email} onChange={upd("email")} className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input required placeholder="City" value={form.city} onChange={upd("city")} className={inputCls} />
                    <input required placeholder="State" value={form.state} onChange={upd("state")} className={inputCls} />
                  </div>
                  <select required value={form.business_type} onChange={upd("business_type")} className={inputCls}>
                    <option value="">Business Type</option>
                    <option>Retail Pharmacy</option>
                    <option>Ayurvedic Clinic</option>
                    <option>Wellness Store</option>
                    <option>Online Reseller</option>
                    <option>Individual / Freelancer</option>
                    <option>Other</option>
                  </select>
                  <textarea rows="3" placeholder="Tell us about your goals (optional)" value={form.message} onChange={upd("message")} className={inputCls} />
                  <button
                    type="submit"
                    data-testid={TID.distributorSubmit}
                    disabled={busy}
                    className="w-full rounded-full py-3 bg-[#1A3626] text-[#F9F6F0] font-semibold text-sm hover:bg-[#2C4C3B] transition disabled:opacity-50"
                  >
                    {busy ? "Submitting..." : "Submit Application"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
