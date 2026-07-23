import { MessageCircle } from "lucide-react";
import { TID } from "@/constants/testIds";

export default function FloatingWhatsApp() {
  const number = "+918109930614";
  const msg = encodeURIComponent("Hi Utkarsh Corporation, I have a question about your products.");
  return (
    <a
      href={`https://wa.me/${number}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={TID.floatingWhatsapp}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white rounded-full pl-3 pr-4 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="text-sm font-semibold hidden sm:inline">Chat with us</span>
    </a>
  );
}
