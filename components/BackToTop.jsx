"use client";

import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
  aria-label="Back to top"
  onClick={() =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  className="group fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full transition hover:-translate-y-1"
>
  <img
    src="/icons/up-arrow.png"
    alt=""
    className="h-12 w-12 object-contain transition-transform duration-200 group-hover:-translate-y-1 group-hover:scale-105"
  />
</button>
  );
}
