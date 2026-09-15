"use client";

import { useSiteSettings } from "@/lib/settings-context";
import { buildContactWhatsAppLink } from "@/lib/whatsapp";

// "Contact on WhatsApp" for static pages. The number comes from the CMS, and
// `context` becomes the opening line so the shop knows what the message is
// about before reading it.
export default function WhatsAppButton({
  context = "",
  label = "Chat on WhatsApp",
  className = "",
}) {
  const settings = useSiteSettings();

  return (
    <a
      href={buildContactWhatsAppLink(settings.whatsappNumber, context)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#72cfc0] bg-mint px-5 py-3 text-sm font-extrabold text-ink shadow-[0_8px_18px_rgba(163,240,232,.35)] transition hover:-translate-y-0.5 ${className}`}
    >
      <img src="/icons/whatsapp.svg" alt="" className="h-5 w-5 object-contain" />
      {label}
    </a>
  );
}
