import { useState } from "react";
import { contactService } from "@/services/contactService";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { TID } from "@/constants/testIds";

/**
 * Public registration modal for a health camp. Posts to
 * POST /health-camps/:id/register with { name, email, phone, age, notes }.
 */
export default function HealthCampRegisterModal({ camp, onClose, onRegistered }) {
    const { toast } = useToast();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        age: "",
        notes: "",
    });
    const [busy, setBusy] = useState(false);

    const inputCls =
        "w-full bg-[#F9F6F0] border border-[#1A3626]/15 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1A3626]";

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            await contactService.registerForHealthCamp(camp._id, {
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                age: form.age ? parseInt(form.age, 10) : null,
                notes: form.notes.trim(),
            });
            toast({
                title: "Success",
                description: "Registration confirmed! We'll reach out with details.",
            });
            if (onRegistered) onRegistered();
            onClose();
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

    return (
        <div
            className="fixed inset-0 z-50 bg-[#1A3626]/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-md p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[#1A3626]/60 hover:text-[#1A3626]"
                    aria-label="Close registration dialog"
                >
                    <X className="w-5 h-5" />
                </button>
                <h3 className="font-serif-display text-2xl text-[#1A3626] mb-1">
                    Register for camp
                </h3>
                <p className="text-sm text-[#1A3626]/70 mb-5">
                    {camp.name}
                    {camp.city ? ` · ${camp.city}` : ""}
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
                        type="email"
                        placeholder="Email (optional)"
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
    );
}
