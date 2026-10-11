"use client";

import { useEffect, useRef, useState } from "react";

const DISPLAY_MS = 1800;
const FADE_MS = 400;

export default function SplashScreen() {
  // Visible by default — this is what gets painted first, including in
  // the server-rendered HTML, so there's no gap where the real page
  // shows before the splash catches up.
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const decidedRef = useRef(false);

  useEffect(() => {
    if (!decidedRef.current) {
      decidedRef.current = true;
      const alreadySeen = window.sessionStorage.getItem("am-splash-seen");
      if (alreadySeen) {
        setVisible(false);
        return;
      }
      window.sessionStorage.setItem("am-splash-seen", "true");
    }

    if (!visible) return;

    const fadeTimer = setTimeout(() => setFading(true), DISPLAY_MS);
    const removeTimer = setTimeout(() => setVisible(false), DISPLAY_MS + FADE_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [visible]);

  if (!visible) return null;

  return (
       <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-paper transition-opacity duration-[400ms] ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='34' height='34' viewBox='0 0 34 34' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M17 7l1.6 6.4L25 15l-6.4 1.6L17 23l-1.6-6.4L9 15l6.4-1.6L17 7Z' fill='%23f7d8e4' fill-opacity='.75'/%3E%3C/svg%3E\")",
        backgroundSize: "34px 34px",
      }}
    >
      <img
  src="/logo-full.png"
  alt=""
  className="h-64 w-auto object-contain drop-shadow-[0_8px_18px_rgba(42,36,56,.12)]"
/>
    </div>
  );
}