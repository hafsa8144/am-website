"use client";

import { useEffect, useRef, useState } from "react";
import { getProducts } from "@/lib/api";
import { formatPrice } from "@/lib/strapi";

// Type-ahead against the real catalogue. Queries are debounced so a fast
// typist makes one request, not one per keystroke.
export default function SearchBox({ onDone, className = "" }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    const term = query.trim();

    if (term.length < 2) {
      setResults([]);
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      const products = await getProducts({ search: term, limit: 5 });
      if (!cancelled) {
        setResults(products);
        setOpen(true);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  // Clicking anywhere else closes the suggestions.
  useEffect(() => {
    const onClick = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const showResults = open && results.length > 0;

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <form
        action="/search"
        className="group flex items-center gap-2 rounded-full border-2 border-line bg-card px-3 py-1.5 transition-all duration-300 focus-within:border-pink-deep focus-within:shadow-lift hover:border-pink-deep"
      >
        <img
          src="/icons/search.png"
          alt=""
          className="h-5 w-5 shrink-0 object-contain transition-transform duration-300 group-focus-within:scale-110 group-hover:-rotate-12"
        />

        <input
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search pens, notebooks, bags..."
          aria-label="Search products"
          className="min-w-0 flex-1 bg-transparent px-1 py-1.5 text-sm font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink-soft"
        />

        <button
          type="submit"
          onClick={onDone}
          className="hidden rounded-full bg-pink px-4 py-2 text-xs font-extrabold text-white transition hover:-translate-y-0.5 sm:block"
        >
          Search
        </button>
      </form>

      {showResults && (
        <div className="am-fade-up absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-3xl border border-line bg-card p-2 shadow-lift">
          {results.map((product) => (
            <a
              key={product.id}
              href={`/product/${product.slug}`}
              onClick={onDone}
              className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition hover:translate-x-1 hover:bg-pink/15"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-pink/20">
                {product.image ? (
                  <img
                    src={product.image.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm">✎</span>
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-extrabold">
                  {product.name}
                </span>
                <span className="text-[11px] text-ink-soft">
                  {product.brand}
                </span>
              </span>

              <span className="shrink-0 text-xs font-extrabold text-pink-deep">
                {formatPrice(product.price)}
              </span>
            </a>
          ))}

          <a
            href={`/search?q=${encodeURIComponent(query.trim())}`}
            onClick={onDone}
            className="mt-1 block rounded-2xl bg-pink/10 px-3 py-2 text-center text-[11px] font-extrabold text-pink-deep"
          >
            See all results for “{query.trim()}”
          </a>
        </div>
      )}
    </div>
  );
}
