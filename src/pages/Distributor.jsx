import { useState } from "react";
import { useTranslation } from "react-i18next";
import { contactService } from "@/services/contactService";
import { useToast } from "@/hooks/use-toast";
import { TID } from "@/constants/testIds";
import { TrendingUp, Users, GraduationCap, Handshake, CheckCircle2 } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import LocalizedText from "@/components/LocalizedText";

export default function Distributor() {
  const { t } = useTranslation();
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
        title: t("distributor.successTitle"),
        description: t("distributor.successDesc"),
      });
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        t("distributor.errorDesc");
      toast({
        title: t("distributor.errorTitle"),
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
          <div className="text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-3"><LocalizedText value={distributorCta?.badge} /></div>
          <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl mb-4">
            <LocalizedText value={distributorCta?.title} />
          </h1>
          <p className="text-[#F9F6F0]/85 max-w-2xl mx-auto">
            <LocalizedText value={distributorCta?.description} />
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Benefits */}
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-3">{t("distributor.whyPartner")}</div>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1A3626] mb-8">{t("distributor.growWithBrand")}</h2>
          <div className="space-y-5">
            {(content?.distributorPage?.benefits || []).map((b) => (
              <div key={b.title} className="flex gap-4">
                <div className="w-11 h-11 rounded-full bg-[#C5A059]/20 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-[#5C4033]" />
                </div>
                <div>
                  <div className="font-semibold text-[#1A3626] mb-1"><LocalizedText value={b.title} /></div>
                  <div className="text-sm text-[#1A3626]/70"><LocalizedText value={b.description || b.body} /></div>
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
                <h3 className="font-serif-display text-2xl text-[#1A3626] mb-2">{t("distributor.applicationReceived")}</h3>
                <p className="text-sm text-[#1A3626]/70">{t("distributor.applicationReceivedDesc")}</p>
              </div>
            ) : (
              <>
                <h3 className="font-serif-display text-2xl text-[#1A3626] mb-1">{t("distributor.applyNow")}</h3>
                <p className="text-sm text-[#1A3626]/70 mb-5">{t("distributor.takesUnder")}</p>
                <form onSubmit={submit} className="space-y-3">
                  <input required placeholder={t("distributor.fullName")} value={form.name} onChange={upd("name")} className={inputCls} />
                  <div className="grid grid-cols-2 gap-3">
                    <input required placeholder={t("distributor.phone")} value={form.phone} onChange={upd("phone")} className={inputCls} />
                    <input required type="email" placeholder={t("distributor.email")} value={form.email} onChange={upd("email")} className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input required placeholder={t("distributor.city")} value={form.city} onChange={upd("city")} className={inputCls} />
                    <input required placeholder={t("distributor.state")} value={form.state} onChange={upd("state")} className={inputCls} />
                  </div>
                  <select required value={form.business_type} onChange={upd("business_type")} className={inputCls}>
                    <option value="">{t("distributor.businessType")}</option>
                    <option>{t("distributor.retailPharmacy")}</option>
                    <option>{t("distributor.ayurvedicClinic")}</option>
                    <option>{t("distributor.wellnessStore")}</option>
                    <option>{t("distributor.onlineReseller")}</option>
                    <option>{t("distributor.individualFreelancer")}</option>
                    <option>{t("distributor.other")}</option>
                  </select>
                  <textarea rows="3" placeholder={t("distributor.goalsPlaceholder")} value={form.message} onChange={upd("message")} className={inputCls} />
                  <button
                    type="submit"
                    data-testid={TID.distributorSubmit}
                    disabled={busy}
                    className="w-full rounded-full py-3 bg-[#1A3626] text-[#F9F6F0] font-semibold text-sm hover:bg-[#2C4C3B] transition disabled:opacity-50"
                  >
                    {busy ? t("distributor.submitting") : t("distributor.submitApplication")}
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
