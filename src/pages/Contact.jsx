import { useState } from "react";
import { useTranslation } from "react-i18next";
import { contactService } from "@/services/contactService";
import { useToast } from "@/hooks/use-toast";
import { TID } from "@/constants/testIds";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import LocalizedText from "@/components/LocalizedText";

export default function Contact() {
  const { t } = useTranslation();
  const { content } = useContent();
  const { footer } = content;
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [busy, setBusy] = useState(false);
  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await contactService.submitContactForm(form);
      toast({
        title: t("contact.successTitle"),
        description: t("contact.successDesc"),
      });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        t("contact.errorDesc");
      toast({
        title: t("contact.errorTitle"),
        description: errorMsg,
        variant: "destructive",
      });
    } finally { setBusy(false); }
  };

  const inputCls = "w-full bg-[#F9F6F0] border border-[#1A3626]/15 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1A3626]";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <div className="text-center mb-12">
        <div className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-3">{t("contact.getInTouch")}</div>
        <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-[#1A3626]">{t("contact.headline")}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact info + map */}
        <div>
          <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center shrink-0"><Phone className="w-4 h-4 text-[#5C4033]" /></div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-[#5C4033]">{t("contact.callUs")}</div>
                  <div className="text-sm text-[#1A3626] font-semibold"><LocalizedText value={footer?.phone} /></div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center shrink-0"><Mail className="w-4 h-4 text-[#5C4033]" /></div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-[#5C4033]">{t("contact.emailLabel")}</div>
                  <div className="text-sm text-[#1A3626] font-semibold"><LocalizedText value={footer?.email} /></div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center shrink-0"><MapPin className="w-4 h-4 text-[#5C4033]" /></div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-[#5C4033]">{t("contact.office")}</div>
                  <div className="text-sm text-[#1A3626]"><LocalizedText value={footer?.address} /></div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center shrink-0"><Clock className="w-4 h-4 text-[#5C4033]" /></div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-[#5C4033]">{t("contact.hours")}</div>
                  <div className="text-sm text-[#1A3626]">{t("contact.hoursValue")}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-[#1A3626]/10 aspect-video">
            <iframe
              title="Utkarsh Corporation Location"
              src="https://maps.google.com/maps?q=Nashik%2C%20Maharashtra&t=&z=11&ie=UTF8&iwloc=&output=embed"
              width="100%" height="100%" style={{ border: 0 }} loading="lazy"
            />
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-6 md:p-8">
          <h3 className="font-serif-display text-2xl text-[#1A3626] mb-1">{t("contact.sendMessageTitle")}</h3>
          <p className="text-sm text-[#1A3626]/70 mb-5">{t("contact.respondWithin")}</p>
          <form onSubmit={submit} className="space-y-3">
            <input required placeholder={t("contact.fullName")} value={form.name} onChange={upd("name")} className={inputCls} />
            <div className="grid grid-cols-2 gap-3">
              <input required type="email" placeholder={t("contact.email")} value={form.email} onChange={upd("email")} className={inputCls} />
              <input placeholder={t("contact.phoneOptional")} value={form.phone} onChange={upd("phone")} className={inputCls} />
            </div>
            <input required placeholder={t("contact.subject")} value={form.subject} onChange={upd("subject")} className={inputCls} />
            <textarea required rows="5" placeholder={t("contact.yourMessage")} value={form.message} onChange={upd("message")} className={inputCls} />
            <button
              type="submit"
              data-testid={TID.contactSubmit}
              disabled={busy}
              className="w-full rounded-full py-3 bg-[#1A3626] text-[#F9F6F0] font-semibold text-sm hover:bg-[#2C4C3B] transition disabled:opacity-50"
            >
              {busy ? t("contact.sending") : t("contact.send")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
