"use client";

import { useSiteSettings } from "@/lib/settings-context";
import { buildContactWhatsAppLink, buildOrderWhatsAppLink } from "@/lib/whatsapp";
import { useCart } from "@/lib/cart-context";

// Always-there "Contact on WhatsApp" button. When the cart has something in
// it the message carries the basket, so a customer who would rather order in
// chat does not have to retype what they picked.
export default function WhatsAppFab() {
  const settings = useSiteSettings();
  const { items, subtotal, count } = useCart();

  const href =
    count > 0
      ? buildOrderWhatsAppLink(settings.whatsappNumber, items, subtotal)
      : buildContactWhatsAppLink(settings.whatsappNumber);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className="group fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full border-2 px-4 py-3 shadow-[0_8px_18px_rgba(163,240,232,.45)] transition hover:-translate-y-1"
    >
      <img
        src="/icons/whatsapp.svg"
        alt=""
        className="h-6 w-6 shrink-0 object-contain"
      />

      <span className="hidden text-sm font-extrabold text-ink sm:block">
        {count > 0 ? "Order on WhatsApp" : "Chat on WhatsApp"}
      </span>
    </a>
  );
}
