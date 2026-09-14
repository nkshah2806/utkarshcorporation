import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { contactService } from "@/services/contactService";
import { Calendar, MapPin, Clock, Users, Stethoscope, ArrowRight } from "lucide-react";
import { TID } from "@/constants/testIds";
import { useContent } from "@/context/ContentContext";
import HealthCampRegisterModal from "@/components/HealthCampRegisterModal";
import { mediaSrc } from "@/lib/api";
import LocalizedText from "@/components/LocalizedText";
import { Loader } from "@/components/Loader";

/**
 * Map a camp document (new HealthCamp model) or a legacy CMS fallback item to a
 * single consistent shape used by this page and the View Details page.
 */
export const normalizeCamp = (c) => ({
  _id: c?._id || c?.id || c?.campId || "",
  name: c?.name || c?.title || "",
  description: c?.description || "",
  date: c?.date || "",
  start_time: c?.start_time || "",
  end_time: c?.end_time || "",
  time: c?.time || "",
  venue: c?.venue || "",
  address: c?.address || "",
  city: c?.city || "",
  state: c?.state || "",
  pincode: c?.pincode || "",
  contact_person: c?.contact_person || c?.doctor || "",
  contact_number: c?.contact_number || "",
  contact_email: c?.contact_email || "",
  image: c?.image || "",
  is_active: c?.is_active !== false,
  registration_required: Boolean(c?.registration_required),
  registration_limit: c?.registration_limit || null,
  registeredCount: Array.isArray(c?.registrations)
    ? c.registrations.length
    : Number(c?.registered) || 0,
  additional_notes: c?.additional_notes || "",
});

/** "09:30" → "9:30 AM" while leaving already-formatted strings untouched. */
export const formatCampTime = (value) => {
  if (!value) return "";
  if (/am|pm/i.test(value)) return value;
  const parts = value.split(":");
  const hours = parseInt(parts[0], 10);
  if (Number.isNaN(hours)) return value;
  const suffix = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;
  return `${h12}:${parts[1] || "00"} ${suffix}`;
};

export const formatCampTimeRange = (camp) => {
  const start = formatCampTime(camp.start_time);
  const end = formatCampTime(camp.end_time);
  return [start, end].filter(Boolean).join(" – ") || camp.time || "";
};

export const formatCampDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const campLocationLine = (camp) =>
  [camp.venue, camp.city, camp.state].filter(Boolean).join(", ") || camp.venue || "";

export const campAddressLine = (camp, pincodeLabel = "Pincode") =>
  [
    camp.address,
    camp.city,
    camp.state,
    camp.pincode ? `${pincodeLabel}: ${camp.pincode}` : "",
  ]
    .filter(Boolean)
    .join(", ") || camp.venue;

const activeOnly = (camps) => (camps || []).filter((c) => c.is_active !== false);

export default function HealthCamps() {
  const { t } = useTranslation();
  const { content } = useContent();
  const { healthCamps } = content;
  const [camps, setCamps] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCamps = async () => {
    try {
      setLoading(true);
      const data = await contactService.getHealthCamps();
      const normalized = activeOnly((data || []).map(normalizeCamp));
      if (normalized.length > 0) {
        setCamps(normalized);
      } else {
        setCamps(activeOnly((healthCamps?.camps || []).map(normalizeCamp)));
      }
    } catch (error) {
      console.error("Error loading health camps:", error);
      setCamps(activeOnly((healthCamps?.camps || []).map(normalizeCamp)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCamps();
  }, [healthCamps]);

  const refreshRegistrations = async () => {
    await loadCamps();
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#1A3626] text-[#F9F6F0] py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-3">
            {t("healthCamps.freeWellnessEvents")}
          </div>
          <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl mb-4 leading-tight">
            {t("healthCamps.heroLine1")}<br />
            {t("healthCamps.heroLine2")}
          </h1>
          <p className="text-[#F9F6F0]/80 max-w-2xl mx-auto">
            {t("healthCamps.heroDescription")}
          </p>
        </div>
      </section>

      {/* Upcoming */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1A3626] mb-8">
          {t("healthCamps.upcomingCamps")}
        </h2>
        {loading ? (
          <div className="py-10 text-center text-[#1A3626]/60">
            <Loader size={40} label={t("healthCamps.loading")} style={{ flexDirection: "column" }} />
          </div>
        ) : camps.length === 0 ? (
          <div className="text-[#1A3626]/60">
            {t("healthCamps.noCampsShort")}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {camps.map((c) => (
              <div
                key={c._id || c.name}
                className="bg-white rounded-2xl border border-[#1A3626]/10 overflow-hidden flex flex-col md:flex-row"
              >
                {c.image ? (
                  <img
                    src={mediaSrc(c.image)}
                    alt={c.name}
                    className="w-full md:w-56 h-48 md:h-auto object-cover"
                  />
                ) : (
                  <div className="w-full md:w-56 h-48 md:h-auto flex items-center justify-center bg-[#E9E4D8] text-[#1A3626]/30 shrink-0">
                    <Stethoscope className="w-10 h-10" />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-2">
                    <LocalizedText value={c.city} />
                  </div>
                  <h3 className="font-serif-display text-2xl text-[#1A3626] mb-3">
                    <LocalizedText value={c.name} fallback={t("healthCamps.campName")} />
                  </h3>
                  <ul className="space-y-1.5 text-sm text-[#1A3626]/75 mb-4">
                    {formatCampDate(c.date) && (
                      <li className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#C5A059]" />{" "}
                        {formatCampDate(c.date)}
                      </li>
                    )}
                    {formatCampTimeRange(c) && (
                      <li className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#C5A059]" />{" "}
                        {formatCampTimeRange(c)}
                      </li>
                    )}
                    {campLocationLine(c) && (
                      <li className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#C5A059] mt-0.5" />{" "}
                        {campLocationLine(c)}
                      </li>
                    )}
                    {c.registration_required && (
                      <li className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#C5A059]" />{" "}
                        {c.registeredCount} {t("healthCamps.registered")}
                        {c.registration_limit
                          ? ` / ${c.registration_limit} ${t("healthCamps.seats")}`
                          : ""}
                      </li>
                    )}
                  </ul>
                  <p className="text-sm text-[#1A3626]/70 mb-4 flex-1 line-clamp-3">
                    <LocalizedText value={c.description} />
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {c._id && (
                      <Link
                        to={`/health-camps/${c._id}`}
                        className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 border border-[#1A3626]/30 text-[#1A3626] text-sm font-semibold hover:bg-[#1A3626] hover:text-[#F9F6F0] transition"
                      >
                        {t("healthCamps.viewDetails")} <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                    {c.registration_required && (
                      <button
                        data-testid={TID.campRegisterBtn}
                        onClick={() => setSelected(c)}
                        className="rounded-full px-5 py-2 bg-[#1A3626] text-[#F9F6F0] text-sm font-semibold hover:bg-[#2C4C3B] transition"
                      >
                        {t("healthCamps.registerNow")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Registration modal */}
      {selected && (
        <HealthCampRegisterModal
          camp={selected}
          onClose={() => setSelected(null)}
          onRegistered={refreshRegistrations}
        />
      )}
    </div>
  );
}
