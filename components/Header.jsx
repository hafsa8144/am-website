"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronIcon } from "./icons";
import SearchBox from "./SearchBox";
import { useCart } from "@/lib/cart-context";
import { useSiteSettings } from "@/lib/settings-context";
import { buildContactWhatsAppLink } from "@/lib/whatsapp";

const STATIC_LINKS_START = [
  ["Home", "/"],
  ["Shop", "/shop"],
  ["Categories", "/categories"],
  ["Deals & Bundles", "/deals"],
  ["Under Rs. 500 (LHR)", "/under-500-lhr"],
];

const STATIC_LINKS_END = [
  ["How to order", "/how-to-order"],
  ["Policies", "/policies"],
  ["Terms & conditions", "/terms"],
];

// Repeats per lap — needs to be enough that ONE lap alone is wider
// than the header on any screen you support, or the loop point will
// show a gap. ~300px per repeat × 10 ≈ 3000px, safe up to ultrawide.
const TICKER_REPEATS = 10;

function TickerLap({ text }) {
  return Array.from({ length: TICKER_REPEATS }).map((_, i) => (
    <span key={i} className="pr-14">
      {text}
    </span>
  ));
}

// Nav categories come from the CMS via SiteProvider, so adding a category in
// Strapi adds it to the nav.
export default function Header() {
  const { count } = useCart();
  const settings = useSiteSettings();
  const pathname = usePathname();

  const navRef = useRef(null);
  const [compact, setCompact] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [edges, setEdges] = useState({ left: false, right: false });
  const lastScrollY = useRef(0);
  const compactLockUntil = useRef(0);
  const navLinks = [
  ...STATIC_LINKS_START,
  ...STATIC_LINKS_END,
];

  useEffect(() => {
  let frame;

  const onScroll = () => {
    window.cancelAnimationFrame(frame);

    frame = window.requestAnimationFrame(() => {
      const y = window.scrollY;
      const goingDown = y > lastScrollY.current;
      const now = performance.now();

      if (now < compactLockUntil.current) {
        lastScrollY.current = y;
        return;
      }

      if (!compact && goingDown && y >= 150) {
        setCompact(true);
        compactLockUntil.current = now + 450;
      }

      if (compact && !goingDown && y <= 65) {
        setCompact(false);
        compactLockUntil.current = now + 450;
      }

      lastScrollY.current = y;
    });
  };

  lastScrollY.current = window.scrollY;
  window.addEventListener("scroll", onScroll, { passive: true });

  return () => {
    window.cancelAnimationFrame(frame);
    window.removeEventListener("scroll", onScroll);
  };
}, [compact]);

  const updateEdges = () => {
    const nav = navRef.current;

    if (nav) {
      setEdges({
        left: nav.scrollLeft > 4,
        right: nav.scrollLeft + nav.clientWidth < nav.scrollWidth - 4,
      });
    }
  };

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [navLinks.length]);

  const nudge = (direction) =>
    navRef.current?.scrollBy({
      left: direction * Math.max(220, navRef.current.clientWidth * 0.65),
      behavior: "smooth",
    });

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95 shadow-[0_5px_18px_rgba(42,36,56,.05)] backdrop-blur-md">
      {/* announcement + contact bar */}
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ${
          compact ? "max-h-0 opacity-0" : "max-h-9 opacity-100"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-1.5 text-[15px] sm:px-6">
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="w-max animate-[scroll-left_50s_linear_infinite] whitespace-nowrap font-extrabold text-pink-deep">
              <TickerLap text={settings.announcementText} />
              <TickerLap text={settings.announcementText} />
            </div>
          </div>

          <span className="hidden shrink-0 font-bold text-ink sm:block">
            {settings.openingHours}
          </span>

          <span className="hidden shrink-0 font-bold lg:block">
            {settings.landlineNumber && <>📞 {settings.landlineNumber} &nbsp;</>}
            {settings.phoneNumber && <>💬 {settings.phoneNumber}</>}
          </span>
        </div>
      </div>

      <div
        className={`mx-auto max-w-[85rem] px-4 transition-all duration-500 sm:px-7 ${
          compact ? "py-1.5" : "py-2"
        }`}
      >
                <div
  className={`relative flex items-center ${
    compact ? "min-h-[84px]" : "min-h-[224px]"
  }`}
>
          <a
            href="/"
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            aria-label={`${settings.companyName} home`}
          >
            <img
  src={compact ? "/logo-mark.png" : "/logo-full.png"}
  alt={`${settings.companyName} — ${settings.tagline}`}
  className={`w-auto object-contain transition-all duration-300 ${
    compact ? "h-[84px]" : "h-[208px]"
  }`}
/>
          </a>

          <div className="ml-auto flex items-center gap-2">
            <div
              className={`hidden w-[350px] transition-all duration-300 lg:block ${
                compact ? "invisible w-0 opacity-0" : ""
              }`}
            >
              <SearchBox />
            </div>

            <button
              onClick={() => setSearchOpen((open) => !open)}
              aria-label="Open search"
              className={`${
                compact ? "grid" : "grid lg:hidden"
              } group h-12 w-12 place-items-center rounded-full border-2 border-line bg-card transition hover:-translate-y-0.5 hover:border-pink-deep hover:bg-pink/10 ${
                searchOpen ? "bg-pink/20" : ""
              }`}
            >
              <img
                src="/icons/search.png"
                alt="Search"
                className="h-6 w-6 object-contain transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
              />
            </button>

            <a
              href={buildContactWhatsAppLink(settings.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact us on WhatsApp"
              className="hidden h-12 w-12 place-items-center rounded-full border-2 border-[#B2A3FF] bg-[#E9DFFF] text-ink shadow-[0_8px_18px_rgba(178,163,255,.35)] transition hover:-translate-y-0.5 sm:grid"
            >
              <img
                src="/icons/whatsapp.svg"
                alt=""
                className="h-6 w-6 object-contain"
              />
            </a>

            <a
              href="/cart"
              aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
              className="relative grid h-12 w-12 place-items-center rounded-full border-2 border-line bg-card transition hover:-translate-y-0.5 hover:border-pink-deep hover:bg-pink/10"
            >
              <img
                src="/icons/cart.png"
                alt=""
                className="h-6 w-6 object-contain"
              />

              <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-pink-deep text-[9px] font-bold text-white">
                {count}
              </span>
            </a>
          </div>
        </div>

        <div
          className={`grid overflow-hidden transition-all duration-300 ${
            searchOpen ? "grid-rows-[1fr] pt-3 opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0">
            <SearchBox onDone={() => setSearchOpen(false)} />
          </div>
        </div>

        <div
          className={`relative overflow-hidden transition-[max-height,opacity] duration-300 ${
            compact ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
          }`}
        >
          <button
            onClick={() => nudge(-1)}
            disabled={!edges.left}
            aria-label="Scroll navigation left"
            className="absolute left-0 top-[calc(50%+0.25rem)] z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-card disabled:opacity-0"
          >
            <ChevronIcon direction="left" className="h-4 w-4" />
          </button>

          <nav
            ref={navRef}
            onScroll={updateEdges}
            className="no-scrollbar mt-2 flex gap-2.5 overflow-x-auto scroll-smooth px-1 py-2.5"
          >
            {navLinks.map(([label, href]) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              const featured = ["Policies", "Terms & conditions"].includes(label);

              return (
                <a
                  key={href}
                  href={href}
                  className={`shrink-0 rounded-full border px-6 py-3 text-[15px] font-extrabold transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 ${
                    active || featured
                      ? "border-transparent bg-gradient-to-r from-peach to-pink text-ink"
                      : "border-line bg-card hover:border-pink-deep hover:bg-pink/10"
                  }`}
                >
                  {label}
                </a>
              );
            })}
          </nav>

          <button
            onClick={() => nudge(1)}
            disabled={!edges.right}
            aria-label="Scroll navigation right"
            className="absolute right-0 top-[calc(50%+0.25rem)] z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-card disabled:opacity-0"
          >
            <ChevronIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
