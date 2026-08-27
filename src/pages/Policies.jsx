import { useParams, Link } from "react-router-dom";

const CONTENT = {
  return: {
    title: "Return & Refund Policy",
    body: `We stand behind every Utkarsh product. If you're not satisfied, return unopened items within 7 days of delivery for a full refund.

**Eligibility**
• Product must be unopened and in original packaging.
• Return request initiated within 7 days.
• Consumables opened for use are non-returnable for hygiene reasons.

**How to return**
1. Email us or WhatsApp us with your order number.
2. Pack the item securely.
3. Our courier will pick up within 3-5 business days.

**Refund timeline**
Refunds are processed within 5-7 business days once we receive the item. Amount is credited to the original payment method (or bank transfer for COD orders).`,
  },
  shipping: {
    title: "Shipping Policy",
    body: `We ship pan-India via trusted courier partners.

**Delivery timelines**
• Metro cities: 2-4 business days.
• Other cities/towns: 4-7 business days.
• Remote pincodes: 7-10 business days.

**Shipping charges**
• Free shipping on orders above ₹499.
• Below ₹499: flat ₹49 shipping.

**Order tracking**
Once dispatched, you'll receive a tracking number via SMS/email. You can also view live status from your account page.

**Cash on Delivery**
Available across India. No extra charges.`,
  },
  terms: {
    title: "Terms & Conditions",
    body: `Welcome to Utkarsh Corporation. By using this website you agree to the following terms.

**Product use**
Our products are Ayurvedic wellness formulations. They are not intended to diagnose, treat, cure, or prevent any disease. Please consult a qualified physician before use, especially if pregnant, nursing, or on medication.

**Orders and payments**
All prices are in INR and inclusive of GST. We reserve the right to cancel any order that fails fraud checks.

**Intellectual property**
All content on this site — including images, product descriptions, and brand marks — belongs to Utkarsh Corporation.

**Governing law**
These terms are governed by the laws of India. Jurisdiction: Nashik, Maharashtra.`,
  },
  privacy: {
    title: "Privacy Policy",
    body: `Your privacy is important to us.

**What we collect**
• Name, email, phone, delivery address at checkout.
• Order history, wishlist, product reviews.
• Basic browsing analytics (cookies) to improve the site.

**How we use it**
Only to process orders, deliver products, provide customer support, and send optional wellness updates (with your consent).

**What we don't do**
We never sell your data to third parties. Payment details are handled by Razorpay and never stored on our servers.

**Your rights**
Email us to access, update, or delete your data at any time.`,
  },
};

export default function Policies() {
  const { slug } = useParams();
  const item = CONTENT[slug];

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto p-16 text-center">
        <h1 className="font-serif-display text-3xl text-[#1A3626] mb-4">Policy not found</h1>
        <Link to="/" className="text-[#C5A059] underline">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <div className="text-xs uppercase tracking-[0.2em] text-[#5C4033] mb-3">Policies</div>
      <h1 className="font-serif-display text-4xl sm:text-5xl text-[#1A3626] mb-8">{item.title}</h1>
      <div className="bg-white rounded-2xl border border-[#1A3626]/10 p-8">
        {item.body.split("\n\n").map((para, i) => (
          <p key={i} className="text-[#1A3626]/85 leading-relaxed mb-4 whitespace-pre-line">{para}</p>
        ))}
      </div>
      <div className="mt-8 flex gap-4 text-sm">
        <Link to="/policies/return" className="text-[#1A3626]/70 hover:text-[#C5A059]">Returns</Link>
        <Link to="/policies/shipping" className="text-[#1A3626]/70 hover:text-[#C5A059]">Shipping</Link>
        <Link to="/policies/terms" className="text-[#1A3626]/70 hover:text-[#C5A059]">Terms</Link>
        <Link to="/policies/privacy" className="text-[#1A3626]/70 hover:text-[#C5A059]">Privacy</Link>
      </div>
    </div>
  );
}
