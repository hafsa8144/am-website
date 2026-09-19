"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronIcon } from "./icons";

// Top-right control icons, drawn in the same inline-SVG style as icons.jsx.
function ZoomIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="M15.3 15.3L21 21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M10.5 7.8v5.4M7.8 10.5h5.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function FullscreenIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M9 4H5a1 1 0 0 0-1 1v4M15 4h4a1 1 0 0 1 1 1v4M9 20H5a1 1 0 0 1-1-1v-4M15 20h4a1 1 0 0 0 1-1v-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// Full-screen product image viewer. Click once to zoom in on the point you
// clicked; while zoomed, drag to pan; click again (or the zoom icon) to reset.
// Left/right controls step through the product's other images.
export default function ImageLightbox({
  images = [],
  initialIndex = 0,
  open,
  onClose,
  onIndexChange,
  productName = "",
}) {
  const [index, setIndex] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  const moved = useRef(false);
  const containerRef = useRef(null);

  // Reopening on a different thumbnail should start the lightbox there.
  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  // Switching images always resets zoom/pan so the new image starts fresh.
  useEffect(() => {
    setZoomed(false);
    setPan({ x: 0, y: 0 });
  }, [index]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") goTo(1);
      if (event.key === "ArrowLeft") goTo(-1);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, images.length]);

  // Leaving fullscreen (Esc, browser chrome, etc.) shouldn't leave the tab stuck.
  useEffect(() => {
    if (!open && document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
  }, [open]);

  if (!open || !images.length) return null;

  const image = images[index];

  function goTo(direction) {
    const next = (index + direction + images.length) % images.length;
    setIndex(next);
    onIndexChange?.(next);
  }

  function toggleZoom(clientX, clientY) {
    if (zoomed) {
      setZoomed(false);
      setPan({ x: 0, y: 0 });
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    setOrigin({
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    });
    setZoomed(true);
  }

  function handlePointerDown(event) {
    if (!zoomed) return;
    moved.current = false;
    setDragging(true);
    dragStart.current = { x: event.clientX, y: event.clientY };
    panStart.current = pan;
  }

  function handlePointerMove(event) {
    if (!dragging) return;
    const dx = event.clientX - dragStart.current.x;
    const dy = event.clientY - dragStart.current.y;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved.current = true;

    setPan({ x: panStart.current.x + dx, y: panStart.current.y + dy });
  }

  function handlePointerUp(event) {
    setDragging(false);
    // A drag that barely moved still counts as a click-to-zoom-toggle.
    if (!moved.current) toggleZoom(event.clientX, event.clientY);
  }

  function handleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    } else {
      containerRef.current?.requestFullscreen?.().catch(() => {});
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
        <button
          onClick={() => toggleZoom(window.innerWidth / 2, window.innerHeight / 2)}
          aria-label={zoomed ? "Zoom out" : "Zoom in"}
          className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          <ZoomIcon />
        </button>

        <button
          onClick={handleFullscreen}
          aria-label="Toggle fullscreen"
          className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          <FullscreenIcon />
        </button>

        <button
          onClick={onClose}
          aria-label="Close"
          className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          <CloseIcon />
        </button>
      </div>

      {images.length > 1 && (
        <button
          onClick={() => goTo(-1)}
          aria-label="Previous image"
          className="absolute left-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          <ChevronIcon direction="left" className="h-6 w-6" />
        </button>
      )}

      <div
        ref={containerRef}
        className="relative flex h-full w-full items-center justify-center overflow-hidden"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => setDragging(false)}
      >
        <img
          src={image.url}
          alt={image.alt || productName}
          draggable={false}
          className="max-h-full max-w-full select-none object-contain transition-transform duration-200"
          style={{
            transform: zoomed
              ? `scale(2.2) translate(${pan.x / 2.2}px, ${pan.y / 2.2}px)`
              : "scale(1)",
            transformOrigin: `${origin.x}% ${origin.y}%`,
            cursor: zoomed ? (dragging ? "grabbing" : "grab") : "zoom-in",
            transitionProperty: dragging ? "none" : "transform",
          }}
        />
      </div>

      {images.length > 1 && (
        <button
          onClick={() => goTo(1)}
          aria-label="Next image"
          className="absolute right-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          <ChevronIcon className="h-6 w-6" />
        </button>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
