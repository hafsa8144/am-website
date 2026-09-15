"use client";

import { useSiteSettings } from "@/lib/settings-context";
import { formatPrice } from "@/lib/strapi";

export default function TrustRow() {
  const settings = useSiteSettings();

  const items = [
    {
      icon: "🚚",
      label: settings.freeShippingThreshold
        ? `Free shipping over ${formatPrice(settings.freeShippingThreshold)}`
        : "Countrywide delivery",
    },
    { icon: "🔒", label: settings.trustBadgeText },
    { icon: "✨", label: "Premium quality" },
  ];

  return (
    <div className="mt-2 flex justify-around gap-3 border-t border-dashed border-line py-7">
      {items.map((item) => (
        <div key={item.label} className="text-center">
          <div className="text-2xl">{item.icon}</div>
          <p className="mt-1.5 text-[11px] font-bold text-ink-soft">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}
