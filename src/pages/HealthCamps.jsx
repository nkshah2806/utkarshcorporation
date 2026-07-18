import { useEffect, useState } from "react";
import { contactService } from "@/services/contactService";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Clock, Users, Stethoscope, X } from "lucide-react";
import { TID } from "@/constants/testIds";

const GALLERY = [
  "https://images.unsplash.com/photo-1492552085122-36706c238263?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
  "https://images.unsplash.com/photo-1615485499958-69973683793c?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
  "https://images.unsplash.com/photo-1525923838299-2312b60f6d69?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
  "https://images.unsplash.com/photo-1585328000852-779be6a6582b?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
];

export default function HealthCamps() {
  const { toast } = useToast();
  const [camps, setCamps] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    notes: "",
  });
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadCamps = async () => {
    try {
      setLoading(true);
      const data = await contactService.getHealthCamps();
      setCamps(data);
    } catch (error) {
      console.error("Error loading health camps:", error);
      setCamps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCamps();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await contactService.submitDistributorInquiry({
        camp_id: selected.id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        age: form.age ? parseInt(form.age) : null,
        notes: form.notes,
      });
      toast({
        title: "Success",
        description: "Registration confirmed! We'll reach out with details.",
      });
      setSelected(null);
      setForm({ name: "", email: "", phone: "", age: "", notes: "" });
      await loadCamps();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to register";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    "w-full bg-[#F9F6F0] border border-[#1A3626]/15 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1A3626]";

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#1A3626] text-[#F9F6F0] py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-3">
            Free Wellness Events
          </div>
          <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl mb-4 leading-tight">
            Health Camps &<br />
            Ayurveda Awareness
          </h1>
          <p className="text-[#F9F6F0]/80 max-w-2xl mx-auto">
            Meet our doctors in person. Free consultations, pulse diagnosis
            (Nadi Pariksha), dosha assessment and wellness guidance — right in
            your city.
          </p>
        </div>
      </section>

      {/* Upcoming */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1A3626] mb-8">
          Upcoming camps
        </h2>
        {loading ? (
          <div className="text-[#1A3626]/60">Loading health camps...</div>
        ) : camps.length === 0 ? (
          <div className="text-[#1A3626]/60">
            No camps scheduled — check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {camps.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-[#1A3626]/10 overflow-hidden flex flex-col md:flex-row"
              >
                <img
                  src={c.image}
                  alt=""
                  className="w-full md:w-56 h-48 md:h-auto object-cover"
                />
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-2">
                    {c.city}
                  </div>
                  <h3 className="font-serif-display text-2xl text-[#1A3626] mb-3">
                    {c.title}
                  </h3>
                  <ul className="space-y-1.5 text-sm text-[#1A3626]/75 mb-4">
                    <li className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#C5A059]" />{" "}
                      {new Date(c.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#C5A059]" /> {c.time}
                    </li>
                    <li className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#C5A059] mt-0.5" />{" "}
                      {c.venue}
                    </li>
                    <li className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-[#C5A059]" />{" "}
                      {c.doctor}
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#C5A059]" />{" "}
                      {c.registered}/{c.seats} registered
                    </li>
                  </ul>
                  <p className="text-sm text-[#1A3626]/70 mb-4 flex-1">
                    {c.description}
                  </p>
                  <button
                    data-testid={TID.campRegisterBtn}
                    onClick={() => setSelected(c)}
                    className="self-start rounded-full px-5 py-2 bg-[#1A3626] text-[#F9F6F0] text-sm font-semibold hover:bg-[#2C4C3B] transition"
                  >
                    Register Free
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-3">
          Past camps
        </div>
        <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1A3626] mb-8">
          Moments from the field
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {GALLERY.map((g, i) => (
            <div key={i} className="aspect-square rounded-2xl overflow-hidden">
              <img
                src={g}
                alt=""
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-[#1A3626]/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-[#1A3626]/60 hover:text-[#1A3626]"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif-display text-2xl text-[#1A3626] mb-1">
              Register for camp
            </h3>
            <p className="text-sm text-[#1A3626]/70 mb-5">
              {selected.title} · {selected.city}
            </p>
            <form onSubmit={submit} className="space-y-3">
              <input
                required
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputCls}
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputCls}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputCls}
                />
                <input
                  type="number"
                  placeholder="Age (optional)"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  className={inputCls}
                />
              </div>
              <textarea
                rows="3"
                placeholder="Any health concerns? (optional)"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className={inputCls}
              />
              <button
                type="submit"
                data-testid={TID.campRegisterSubmit}
                disabled={busy}
                className="w-full rounded-full py-2.5 bg-[#1A3626] text-[#F9F6F0] font-semibold text-sm hover:bg-[#2C4C3B] transition disabled:opacity-50"
              >
                {busy ? "Submitting..." : "Confirm Registration"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
