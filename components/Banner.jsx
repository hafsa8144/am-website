"use client";

import { useEffect, useState } from "react";
import { ChevronIcon } from "./icons";

// Slides come from the CMS (title / subtitle / link / image), normalised by
// lib/strapi.js. The heading and subtitle were previously fetched but never
// rendered — the hero showed the image alone.
export default function Banner({ slides = [] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slides.length < 2 || paused) return;

    const id = setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 4500);

    return () => clearInterval(id);
  }, [slides.length, paused]);

  // A slide removed in the CMS should not leave the carousel pointing past the
  // end of the list.
  useEffect(() => {
    setActive((current) => (current >= slides.length ? 0 : current));
  }, [slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[active] || slides[0];

  const move = (direction) => {
    setActive(
      (current) => (current + direction + slides.length) % slides.length
    );
  };

  return (
    <section
      aria-label="Featured offers"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative flex min-h-[calc(100svh-12rem)] max-h-[680px] flex-col justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-pink-deep via-pink to-peach px-7 py-12 shadow-soft sm:min-h-[calc(100svh-13rem)] sm:px-14"
    >
      {slide.imageUrl && (
        <>
          <img
            src={slide.imageUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* keeps the heading readable over any photograph */}
          <span className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/45 to-transparent" />
        </>
      )}

      <span className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-white/15" />
      <span className="absolute -bottom-28 -left-20 h-64 w-64 rounded-full border-[28px] border-white/15" />

      <div className="relative max-w-xl am-fade-up" key={slide.id}>
        <p className="text-[11px] font-extrabold uppercase tracking-[.18em] text-white/80">
          Accessories Mart
        </p>

        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-white drop-shadow-sm sm:text-5xl">
          {slide.heading}
        </h2>

        {slide.sub && (
          <p className="mt-3 max-w-lg text-sm font-semibold text-white/90 sm:text-base">
            {slide.sub}
          </p>
        )}

        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href={slide.link || "/shop"}
            className="rounded-full bg-card px-6 py-3 text-sm font-extrabold text-ink shadow-lift transition hover:-translate-y-0.5"
          >
            Shop now
          </a>

          <a
            href="/deals"
            className="rounded-full border-2 border-white/70 px-6 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
          >
            See deals
          </a>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-ink/15 px-2 py-1.5 backdrop-blur-sm">
          <button
            aria-label="Previous banner"
            onClick={() => move(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-card/95 text-ink shadow-lift transition hover:scale-105 hover:bg-card"
          >
            <ChevronIcon direction="left" className="h-4 w-4" />
          </button>

          <div className="flex gap-2 px-1">
            {slides.map((item, index) => (
              <button
                key={item.id}
                aria-label={`Show slide ${index + 1}`}
                onClick={() => setActive(index)}
                className={`h-2 w-2 rounded-full transition-colors duration-150 ${
                  index === active ? "bg-white" : "bg-white/45"
                }`}
              />
            ))}
          </div>

          <button
            aria-label="Next banner"
            onClick={() => move(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-card/95 text-ink shadow-lift transition hover:scale-105 hover:bg-card"
          >
            <ChevronIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </section>
  );
}
