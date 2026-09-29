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

// Every collapsing piece of the header shares this duration + easing so
// they move in lockstep instead of drifting out of sync with each other.
const COLLAPSE_TRANSITION = "duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]";

function TickerLap({ items }) {
  return Array.from({ length: TICKER_REPEATS }).map((_, i) => (
    <span key={i} className="inline-flex">
      {items.map((item, j) => (
        <span key={j} className="pr-14">
          {item}
        </span>
      ))}
    </span>
  ));
}

// Nav categories come from the CMS via SiteProvider, so adding a category in
// Strapi adds it to the nav.
export default function Header() {
  const { count } = useCart();
  const settings = useSiteSettings();
  const pathname = usePathname();
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const mobileSearchButtonRef = useRef(null);
  const navRef = useRef(null);
  const [compact, setCompact] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [edges, setEdges] = useState({ left: false, right: false });
  const lastScrollY = useRef(0);
  const compactLockUntil = useRef(0);
  const navLinks = [...STATIC_LINKS_START, ...STATIC_LINKS_END];

  useEffect(() => {
    if (!searchOpen) return;

    const onClickOutside = (event) => {
      const target = event.target;
      const inside =
        (searchRef.current && searchRef.current.contains(target)) ||
        (mobileSearchRef.current && mobileSearchRef.current.contains(target)) ||
        (mobileSearchButtonRef.current &&
          mobileSearchButtonRef.current.contains(target));
      if (!inside) setSearchOpen(false);
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") setSearchOpen(false);
    };

    document.addEventListener("mousedown", onClickOutside);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [searchOpen]);

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
        className={`overflow-hidden transition-[max-height,opacity] ${COLLAPSE_TRANSITION} ${
          compact ? "max-h-0 opacity-0" : "max-h-9 opacity-100"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-1.5 text-[15px] sm:px-6">
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="w-max animate-[scroll-left_120s_linear_infinite] whitespace-nowrap font-extrabold text-pink-deep">
              <TickerLap items={settings.announcementItems || []} />
              <TickerLap items={settings.announcementItems || []} />
            </div>
          </div>

          <span className="hidden shrink-0 font-bold text-ink sm:block">
            {settings.openingHours}
          </span>

          <span className="hidden shrink-0 items-center gap-1.5 font-bold lg:flex">
            {settings.phoneNumber && (
              <>
                <img
                  src="/icons/whatsapp.svg"
                  alt=""
                  className="h-5 w-5 object-contain"
                />
                {settings.phoneNumber}
              </>
            )}
          </span>
        </div>
      </div>

      <div
        className={`mx-auto max-w-[85rem] px-4 transition-[padding] ${COLLAPSE_TRANSITION} sm:px-7 ${
          compact ? "py-1" : "py-2"
        }`}
      >
        <div
          className={`relative flex items-center transition-[min-height] ${COLLAPSE_TRANSITION} ${
            compact ? "min-h-[56px]" : "min-h-[128px]"
          }`}
        >
          <a
            href="/"
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2"
            aria-label={`${settings.companyName} home`}
          >
            <img
              src={compact ? "/logo-mark.png" : "/logo-full.png"}
              alt={`${settings.companyName} — ${settings.tagline}`}
              style={{ willChange: "height" }}
              className={`w-auto object-contain transition-[height] ${COLLAPSE_TRANSITION} ${
                compact ? "h-[72px]" : "h-[176px]"
              }`}
            />
          </a>

          <div className="ml-auto flex min-w-0 items-center gap-2">
            <div
              className={`hidden w-[400px] min-w-0 max-w-full transition-[opacity,width] ${COLLAPSE_TRANSITION} lg:block ${
                compact ? "invisible w-0 opacity-0" : ""
              }`}
            >
              <SearchBox />
            </div>

             <div
              ref={searchRef}
              className={`hidden h-12 origin-right transition-[width] ${COLLAPSE_TRANSITION} ${
                compact ? "sm:grid" : "sm:grid lg:hidden"
              } ${searchOpen ? "w-[230px] -translate-x-3 sm:w-[300px] sm:-translate-x-6" : "w-12"}`}
            >
              {searchOpen ? (
                <SearchBox
                  className="w-full"
                  placeholder="Search..."
                  onDone={() => setSearchOpen(false)}
                />
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  aria-label="Open search"
                  className="group grid h-12 w-12 place-items-center rounded-full border-2 border-line bg-card transition hover:-translate-y-0.5 hover:border-pink hover:bg-pink/10"
                >
                  <img
                    src="/icons/search.png"
                    alt="Search"
                    className="h-6 w-6 object-contain transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
                  />
                </button>
              )}
            </div>

            <button
              ref={mobileSearchButtonRef}
              onClick={() => setSearchOpen((open) => !open)}
              aria-label="Open search"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-line bg-card transition hover:-translate-y-0.5 hover:border-pink hover:bg-pink/10 sm:hidden"
            >
              <img
                src="/icons/search.png"
                alt="Search"
                className="h-6 w-6 object-contain"
              />
            </button>
            <a
              href={buildContactWhatsAppLink(settings.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact us on WhatsApp"
              className="hidden h-12 w-12 place-items-center rounded-full border-2 border-pink-deep bg-pink text-ink transition hover:-translate-y-0.5 sm:grid"
            >
              <img
                src="/icons/whatsapp copy.svg"
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

              <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-pink text-[9px] font-bold text-white">
                {count}
              </span>
            </a>
          </div>
        </div>

        {searchOpen && (
          <div
            ref={mobileSearchRef}
            className="am-fade-up relative z-40 px-1 pb-3 pt-1 sm:hidden"
          >
            <SearchBox className="w-full" onDone={() => setSearchOpen(false)} />
          </div>
        )}

        <div
          className={`relative overflow-hidden transition-[max-height,opacity] ${COLLAPSE_TRANSITION} ${
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
            className={`no-scrollbar mt-2 flex gap-2.5 overflow-x-auto scroll-smooth px-1 py-2.5 ${
              edges.left || edges.right ? "justify-start" : "justify-center"
            }`}
          >
            {navLinks.map(([label, href]) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              const featured = ["Policies", "Terms & conditions"].includes(
                label,
              );

              return (
                <a
                  key={href}
                  href={href}
                  className={`shrink-0 rounded-full border px-6 py-3 text-[15px] font-extrabold transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 ${
                    active || featured
                      ? "border-transparent bg-pink text-white"
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
