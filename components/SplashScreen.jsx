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
  "url(\"data:image/svg+xml,%3Csvg width='34' height='34' viewBox='0 0 34 34' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M17 7l1.6 6.4L25 15l-6.4 1.6L17 23l-1.6-6.4L9 15l6.4-1.6L17 7Z' fill='%23d8eef9' fill-opacity='.9'/%3E%3C/svg%3E\")",
backgroundSize: "34px 34px",
      }}
    >
              {/* static corner doodles — purely decorative, no animation */}
      <svg className="absolute top-8 left-8 w-10 h-10 opacity-70" viewBox="0 0 24 24" fill="none">
        <path d="M7 12V6a4 4 0 0 1 8 0v10a2.5 2.5 0 0 1-5 0V8" stroke="#c9a877" strokeWidth="1.8" strokeLinecap="round" />
      </svg>

      <div className="absolute top-10 right-10 w-16 h-7 opacity-60 rotate-[18deg] rounded-sm bg-[repeating-linear-gradient(45deg,#ffa3c1_0px,#ffa3c1_4px,#ffb2a3_4px,#ffb2a3_8px)]" />

      <svg className="absolute bottom-10 left-10 w-20 h-6 opacity-60 -rotate-[8deg]" viewBox="0 0 100 20" fill="none">
        <rect x="1" y="1" width="98" height="18" rx="3" stroke="#c9a877" strokeWidth="1.5" />
        <line x1="10" y1="1" x2="10" y2="8" stroke="#c9a877" strokeWidth="1.2" />
        <line x1="25" y1="1" x2="25" y2="8" stroke="#c9a877" strokeWidth="1.2" />
        <line x1="40" y1="1" x2="40" y2="8" stroke="#c9a877" strokeWidth="1.2" />
        <line x1="55" y1="1" x2="55" y2="8" stroke="#c9a877" strokeWidth="1.2" />
        <line x1="70" y1="1" x2="70" y2="8" stroke="#c9a877" strokeWidth="1.2" />
        <line x1="85" y1="1" x2="85" y2="8" stroke="#c9a877" strokeWidth="1.2" />
      </svg>

      <div className="absolute bottom-8 right-8 opacity-70">
        <div className="w-10 h-10 rounded-sm bg-pink rotate-[10deg]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 20%, 20% 0)" }} />
        <div className="w-9 h-9 rounded-sm bg-peach -rotate-[6deg] -mt-8 ml-1.5" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 20%, 20% 0)" }} />
      </div>
      <span className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink to-pink-deep flex items-center justify-center text-white font-extrabold text-3xl shadow-soft">
        AM
      </span>
      <span className="mt-4 font-semibold italic text-sm text-pink-deep">
        hamare yahan kafi kuch milta hai
      </span>
      <span className="mt-1 text-[9px] tracking-[0.2em] font-bold text-ink-soft">
        SINCE 1950
      </span>

            {/* ink flourish — a pen signing a small flourish beneath the logo */}
      <div className="relative mt-8" style={{ width: 260, height: 60 }}>
        <svg width="260" height="60" viewBox="0 0 260 60" style={{ overflow: "visible" }}>
          {/* ink pool where the pen touches down */}
          <circle cx="10" cy="35" r="3" fill="#3a3f4c" opacity="0.7" />

          <path
            d="M10,35 C 50,5 90,60 130,32 S 200,4 245,30"
            fill="none"
            stroke="#3a3f4c"
            strokeWidth="2.5"
            strokeLinecap="round"
            pathLength="1"
            style={{
              strokeDasharray: 1,
              strokeDashoffset: 1,
              animation: "am-splash-draw 4.6s cubic-bezier(.65,0,.35,1) infinite",
            }}
          />
        </svg>

        {/* fountain pen nib — rides the exact same path as the ink, so it can't drift out of alignment */}
        <div
          className="am-splash-nib"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 18,
            height: 18,
            offsetPath: "path('M10,35 C 50,5 90,60 130,32 S 200,4 245,30')",
            offsetRotate: "auto",
            animation: "am-splash-nib 4.6s cubic-bezier(.65,0,.35,1) infinite",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 20 20">
            <path d="M2,10 L14,4 L18,10 L14,16 Z" fill="#3a3f4c" />
            <line x1="10" y1="4" x2="10" y2="16" stroke="#f1e7d0" strokeWidth="1" />
          </svg>
        </div>
      </div>

      <style jsx>{`
        @keyframes am-splash-draw {
          0% { stroke-dashoffset: 1; }
          42% { stroke-dashoffset: 0; }
          50% { stroke-dashoffset: 0; }
          92% { stroke-dashoffset: 1; }
          100% { stroke-dashoffset: 1; }
        }
        @keyframes am-splash-nib {
          0% { offset-distance: 0%; }
          42% { offset-distance: 100%; }
          50% { offset-distance: 100%; }
          92% { offset-distance: 0%; }
          100% { offset-distance: 0%; }
        }
      `}</style>

    </div>
  );
}