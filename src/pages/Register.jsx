import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { formatApiError } from "@/lib/api";
import { toast } from "sonner";
import { TID } from "@/constants/testIds";
import { Leaf } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", mobileNumber: "", email: "", address: "", city: "", state: "", pinCode: "", password: "" });
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // Keep the mobile number to digits only (max 10) so the same real number is
  // always submitted in one consistent format and duplicate detection works.
  const updPhone = (e) =>
    setForm({ ...form, mobileNumber: e.target.value.replace(/\D/g, "").slice(0, 10) });

  const submit = async (e) => {
    e.preventDefault();
    if (!consent) {
      toast.error(t("register.acceptTerms"));
      return;
    }
    if (!/^\d{10}$/.test(form.mobileNumber)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    setBusy(true);
    try {
      const { data } = await api.post("/members/register", form);
      if (data?.token) {
        localStorage.setItem("frenchies_member_token", data.token);
      }
      toast.success(data?.message || t("register.success"));
      navigate("/register-success", { state: { fullName: form.fullName, email: form.email } });
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setBusy(false);
    }
  };

  const inputCls = "w-full bg-white border border-[#1A3626]/15 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#1A3626]";

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#1A3626] flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-5 h-5 text-[#C5A059]" />
          </div>
          <h1 className="font-serif-display text-4xl text-[#1A3626] mb-2">{t("register.title")}</h1>
          <p className="text-sm text-[#1A3626]/70">{t("register.subtitle")}</p>
        </div>
        <form onSubmit={submit} className="bg-white rounded-2xl border border-[#1A3626]/10 p-8 space-y-4">
          <input data-testid={TID.registerName} required placeholder={t("register.fullName")} value={form.fullName} onChange={upd("fullName")} className={inputCls} />
          <input
            data-testid={TID.registerPhone}
            required
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            pattern="\d{10}"
            maxLength={10}
            title="Enter a 10-digit mobile number"
            placeholder={t("register.mobileNumber")}
            value={form.mobileNumber}
            onChange={updPhone}
            className={inputCls}
          />
          <input data-testid={TID.registerEmail} type="email" required placeholder={t("register.email")} value={form.email} onChange={upd("email")} className={inputCls} />
          <textarea required placeholder={t("register.address")} value={form.address} onChange={upd("address")} className={inputCls} rows="3" />
          <div className="grid gap-4 md:grid-cols-2">
            <input required placeholder={t("register.city")} value={form.city} onChange={upd("city")} className={inputCls} />
            <input required placeholder={t("register.state")} value={form.state} onChange={upd("state")} className={inputCls} />
          </div>
          <input required placeholder={t("register.pinCode")} value={form.pinCode} onChange={upd("pinCode")} className={inputCls} />
          <input data-testid={TID.registerPassword} type="password" required minLength="8" placeholder={t("register.password")} value={form.password} onChange={upd("password")} className={inputCls} />

          {/* Registration consent — unchecked by default; submit is blocked until accepted */}
          <div className="flex items-start gap-2.5 text-sm text-[#1A3626]/80">
            <input
              data-testid={TID.registerConsent}
              id="register-consent"
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#1A3626]/25 accent-[#1A3626] cursor-pointer"
            />
            <label htmlFor="register-consent" className="leading-relaxed cursor-pointer">
              <span>
                {t("register.consentPrefix")}{" "}
                <Link
                  data-testid={TID.registerTermsLink}
                  to="/policies/terms"
                  className="text-[#C5A059] font-semibold hover:underline cursor-pointer"
                >
                  {t("register.terms")}
                </Link>{" "}
                {t("register.and")}{" "}
                <Link
                  data-testid={TID.registerPrivacyLink}
                  to="/policies/privacy"
                  className="text-[#C5A059] font-semibold hover:underline cursor-pointer"
                >
                  {t("register.privacy")}
                </Link>
                .
              </span>
            </label>
          </div>

          <button data-testid={TID.registerSubmit} disabled={busy} className="w-full rounded-full py-3 bg-[#1A3626] text-[#F9F6F0] font-semibold text-sm hover:bg-[#2C4C3B] transition disabled:opacity-50">
            {busy ? t("register.creating") : t("register.createAccount")}
          </button>
          <div className="text-center text-sm text-[#1A3626]/70">
            {t("register.needAccess")}{' '}
            <a href="https://uttkarsh-member.vercel.app/" target="_blank" rel="noreferrer" className="text-[#C5A059] font-semibold hover:underline">
              {t("register.openMemberPanel")}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
