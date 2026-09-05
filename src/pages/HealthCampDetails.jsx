import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { contactService } from "@/services/contactService";
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    Users,
    Stethoscope,
    Phone,
    Mail,
    User as UserIcon,
    Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TID } from "@/constants/testIds";
import { useContent } from "@/context/ContentContext";
import HealthCampRegisterModal from "@/components/HealthCampRegisterModal";
import {
    normalizeCamp,
    formatCampDate,
    formatCampTimeRange,
    campAddressLine,
} from "@/pages/HealthCamps";

export default function HealthCampDetails() {
    const { campId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { content } = useContent();
    const { healthCamps } = content;

    const [camp, setCamp] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            try {
                // Prefer the live backend record; falls back to the CMS list.
                let found = null;
                if (campId) {
                    const remote = await contactService.getHealthCampById(campId);
                    if (remote && remote.is_active !== false) found = normalizeCamp(remote);
                }
                if (!found) {
                    const fallback = (healthCamps?.camps || []).find(
                        (c) => (c._id || c.id) === campId
                    );
                    if (fallback && fallback.is_active !== false) found = normalizeCamp(fallback);
                }
                if (cancelled) return;
                if (!found) {
                    toast({
                        title: "Camp not found",
                        description: "This health camp is no longer available.",
                        variant: "destructive",
                    });
                    navigate("/health-camps", { replace: true });
                    return;
                }
                setCamp(found);
            } catch (error) {
                console.error("Error loading health camp:", error);
                if (cancelled) return;
                toast({
                    title: "Error",
                    description: "Unable to load this health camp.",
                    variant: "destructive",
                });
                navigate("/health-camps", { replace: true });
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [campId, healthCamps, navigate, toast]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-[#1A3626]/60">
                Loading camp details...
            </div>
        );
    }

    if (!camp) return null;

    const canRegister = camp.registration_required;
    const seatsLeft =
        canRegister && camp.registration_limit
            ? Math.max(camp.registration_limit - camp.registeredCount, 0)
            : null;

    return (
        <div>
            {/* Hero */}
            <section className="bg-[#1A3626] text-[#F9F6F0] py-14 lg:py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        to="/health-camps"
                        className="inline-flex items-center gap-1.5 text-sm text-[#F9F6F0]/70 hover:text-[#C5A059] transition mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" /> All health camps
                    </Link>
                    <div className="text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-3">
                        {camp.city || "Health Camp"}
                    </div>
                    <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4 max-w-3xl">
                        {camp.name}
                    </h1>
                    <p className="text-[#F9F6F0]/80 max-w-2xl">{camp.description}</p>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: details */}
                    <div className="lg:col-span-2 space-y-8">
                        {camp.image && (
                            <img
                                src={camp.image}
                                alt={camp.name}
                                className="w-full h-72 sm:h-96 object-cover rounded-2xl"
                            />
                        )}

                        <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-6">
                            <h2 className="font-serif-display text-2xl text-[#1A3626] mb-4">
                                Camp Details
                            </h2>
                            <ul className="space-y-3 text-sm text-[#1A3626]/80">
                                {formatCampDate(camp.date) && (
                                    <li className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-semibold text-[#1A3626]">Date:</span>{" "}
                                            {formatCampDate(camp.date)}
                                        </div>
                                    </li>
                                )}
                                {formatCampTimeRange(camp) && (
                                    <li className="flex items-start gap-3">
                                        <Clock className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-semibold text-[#1A3626]">Time:</span>{" "}
                                            {formatCampTimeRange(camp)}
                                        </div>
                                    </li>
                                )}
                                <li className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-semibold text-[#1A3626]">
                                            Venue / Location:
                                        </span>
                                        <br />
                                        {campAddressLine(camp)}
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {camp.description && (
                            <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-6">
                                <h2 className="font-serif-display text-2xl text-[#1A3626] mb-3">
                                    About this camp
                                </h2>
                                <p className="text-sm text-[#1A3626]/75 leading-relaxed whitespace-pre-line">
                                    {camp.description}
                                </p>
                            </div>
                        )}

                        {camp.additional_notes && (
                            <div className="bg-[#F9F6F0] rounded-2xl border border-[#C5A059]/30 p-6">
                                <h2 className="font-serif-display text-xl text-[#1A3626] mb-3 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-[#C5A059]" /> Notes for
                                    attendees
                                </h2>
                                <p className="text-sm text-[#1A3626]/75 whitespace-pre-line">
                                    {camp.additional_notes}
                                </p>
                            </div>
                        )}

                        {/* Contact info */}
                        {(camp.contact_person ||
                            camp.contact_number ||
                            camp.contact_email) && (
                                <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-6">
                                    <h2 className="font-serif-display text-2xl text-[#1A3626] mb-4">
                                        Contact
                                    </h2>
                                    <ul className="space-y-3 text-sm text-[#1A3626]/80">
                                        {camp.contact_person && (
                                            <li className="flex items-center gap-3">
                                                <UserIcon className="w-5 h-5 text-[#C5A059] shrink-0" />
                                                {camp.contact_person}
                                            </li>
                                        )}
                                        {camp.contact_number && (
                                            <li className="flex items-center gap-3">
                                                <Phone className="w-5 h-5 text-[#C5A059] shrink-0" />
                                                {camp.contact_number}
                                            </li>
                                        )}
                                        {camp.contact_email && (
                                            <li className="flex items-center gap-3">
                                                <Mail className="w-5 h-5 text-[#C5A059] shrink-0" />
                                                {camp.contact_email}
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}
                    </div>

                    {/* Right: registration card */}
                    <aside>
                        <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-6 sticky top-24">
                            <h3 className="font-serif-display text-xl text-[#1A3626] mb-2">
                                Registration
                            </h3>
                            {canRegister ? (
                                <>
                                    <p className="text-sm text-[#1A3626]/70 mb-4">
                                        Limited seats available. Register now to reserve your spot.
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-[#1A3626]/75 mb-5">
                                        <Users className="w-4 h-4 text-[#C5A059]" />
                                        {camp.registration_limit
                                            ? `${seatsLeft} of ${camp.registration_limit} seats left`
                                            : `${camp.registeredCount} registered so far`}
                                    </div>
                                    <button
                                        data-testid={TID.campRegisterBtn}
                                        onClick={() => setShowRegister(true)}
                                        disabled={seatsLeft === 0}
                                        className="w-full rounded-full py-3 bg-[#1A3626] text-[#F9F6F0] font-semibold text-sm hover:bg-[#2C4C3B] transition disabled:opacity-50"
                                    >
                                        {seatsLeft === 0 ? "Registration Full" : "Register Now"}
                                    </button>
                                </>
                            ) : (
                                <p className="text-sm text-[#1A3626]/70">
                                    This is an open camp — no registration needed. Just walk in and
                                    meet our team.
                                </p>
                            )}
                            <div className="mt-6 pt-5 border-t border-[#1A3626]/10 flex items-center gap-2 text-xs text-[#1A3626]/60">
                                <Stethoscope className="w-4 h-4 text-[#C5A059] shrink-0" />
                                Free consultations · Nadi Pariksha · Wellness guidance
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            {showRegister && camp && (
                <HealthCampRegisterModal
                    camp={camp}
                    onClose={() => setShowRegister(false)}
                    onRegistered={() => setCamp((prev) => ({ ...prev, registeredCount: prev.registeredCount + 1 }))}
                />
            )}
        </div>
    );
}
