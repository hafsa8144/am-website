"use client";

import { useNavCategories, useSiteSettings } from "@/lib/settings-context";
import { buildContactWhatsAppLink } from "@/lib/whatsapp";

const HELP_LINKS = [
  ["Policies & privacy", "/policies"],
  ["Terms & conditions", "/terms"],
  ["Your cart", "/cart"],
  ["Your orders", "/orders"],
  ["How ordering works", "/how-to-order"],
];

const SHOP_LINKS = [
  ["All products", "/shop"],
  ["Deals & bundles", "/deals"],
  ["Below Rs. 500 · LHR only", "/under-500-lhr"],
];

// Contact details, socials and the shop name all come from the CMS
// (siteSetting), so they are edited in one place instead of in this file.
export default function Footer() {
  const categories = useNavCategories();
  const settings = useSiteSettings();

  const shopLinks = [
    ...SHOP_LINKS,
    ...categories
      .slice(0, 5)
      .map((category) => [category.name, `/category/${category.slug}`]),
  ];

  const socials = [
    ["Instagram", settings.instagramUrl, "/icons/instagram.svg", "h-7 w-7"],
    ["Facebook", settings.facebookUrl, "/icons/facebook.svg", "h-8 w-8"],
    ["TikTok", settings.tiktokUrl, "/icons/tiktok.svg", "h-5 w-5"],
  ].filter(([, url]) => Boolean(url));

  return (
    <footer className="mt-7 overflow-hidden rounded-t-[32px] border-x border-t border-line bg-card/90 px-6 pt-9 sm:px-10 sm:pt-11">
      <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.25fr_.9fr_.9fr_1.25fr]">
        <div>
          <a href="/" className="inline-flex items-center gap-2.5">
            <img
              src={settings.logoUrl || "/logo-mark.png"}
              alt={settings.companyName}
              className="h-12 w-12 object-contain"
            />

            <span className="text-xl font-extrabold leading-none text-ink">
              {settings.companyName}
              <span className="mt-1 block text-[10px] tracking-[.16em] text-pink-deep">
                SINCE 1950
              </span>
            </span>
          </a>

          <p className="mt-4 max-w-[285px] text-sm leading-relaxed text-ink-soft">
            {settings.tagline}
            {settings.addressLine ? ` — ${settings.addressLine}.` : "."} You can also order on
            WhatsApp, we deliver across Lahore and the rest of Pakistan.
          </p>

          {socials.length > 0 && (
            <div className="mt-5 flex gap-3">
              {socials.map(([label, url, icon, size]) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-full border-2 border-line transition hover:border-pink-deep hover:bg-pink/15"
                >
                  <img src={icon} alt="" className={`${size} object-contain`} />
                </a>
              ))}
            </div>
          )}
           <img
  src="/icons/secure-shield.png"
  alt=""
  className="mx-auto mt-6 block h-44 w-44 object-contain"
/>   
        </div>

        {[
          ["Shop", shopLinks],
          ["Help", HELP_LINKS],
        ].map(([heading, links]) => (
          <div key={heading}>
            <h2 className="text-lg font-extrabold text-ink">{heading}</h2>

            <span className="mt-2 block h-1.5 w-14 rounded-full bg-pink" />

            <ul className="mt-5 space-y-2.5">
              {links.map(([label, href]) => (
                <li key={`${heading}-${href}-${label}`}>
                  <a
                    href={href}
                    className="text-sm font-semibold text-ink-soft transition hover:pl-1 hover:text-pink-deep"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h2 className="text-lg font-extrabold text-ink">Reach us</h2>

          <span className="mt-2 block h-1.5 w-14 rounded-full bg-pink" />

          <div className="mt-5 space-y-4 text-sm leading-relaxed text-ink-soft">
            <p>
              <b className="inline-flex items-center gap-1.5 text-ink">
                <img
                  src="/icons/clock.svg"
                  alt=""
                  className="h-4 w-4 shrink-0 object-contain"
                />
                {settings.openingHours}
              </b>
              {settings.closedDays && (
                <>
                  <br />
                  {settings.closedDays}
                </>
              )}
            </p>

            {settings.phoneNumber && (
              <p className="flex items-center gap-1.5">
                <img
                  src="/icons/call.png"
                  alt=""
                  className="h-4 w-4 shrink-0 object-contain"
                />
                <a href={`tel:${settings.phoneNumber}`}>
                  <b className="text-ink">{settings.phoneNumber}</b>
                </a>
              </p>
            )}

            <p className="flex items-start gap-1.5">
              <img
                src="/icons/whatsapp.svg"
                alt=""
                className="mt-0.5 h-5 w-5 shrink-0 object-contain"
              />
              <span>{settings.deliveryNote}</span>
            </p>
          </div>

          <a
            href={buildContactWhatsAppLink(settings.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex items-center justify-center gap-2 rounded-full border-2 border-[#B2A3FF] bg-[#E9DFFF] px-5 py-3 text-sm font-extrabold text-ink shadow-[0_8px_18px_rgba(163,240,232,.35)] transition hover:-translate-y-0.5"
          >
            <img
              src="/icons/whatsapp.svg"
              alt=""
              className="h-5 w-5 object-contain"
            />
            &nbsp; Chat on WhatsApp
          </a>
        </div>
      </div>
            <div className="mt-8 overflow-hidden rounded-3xl border border-line">
        <iframe
          title="Our location on the map"
          src="https://www.google.com/maps?q=31.573146404526042,74.30960932095441&output=embed"
          width="100%"
          height="220"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="flex flex-col justify-between gap-2 border-t border-line py-4 text-[11px] font-semibold text-ink-soft sm:flex-row">
        <p>
          © {new Date().getFullYear()} {settings.companyName}. All rights
          reserved.
        </p>
        <p>Made for the everyday details.</p>
      </div>
    </footer>
  );
}
