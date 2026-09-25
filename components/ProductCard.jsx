"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/strapi";

const ACCENT_STROKE = {
  mint: "#3ddba0",
  sky: "#4db8e8",
  violet: "#b06fe6",
  pink: "#ec5a96",
};

function ChartGlyph({ stroke }) {
  return (
    <svg viewBox="0 0 60 60" className="h-full w-full">
      <defs>
        <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
          <path
            d="M8 0H0V8"
            fill="none"
            stroke={stroke}
            strokeOpacity="0.18"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      <rect width="60" height="60" fill="url(#grid)" />

      <path
        d="M6 42 L18 30 L26 38 L46 14"
        fill="none"
        stroke={stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// `product` is always a normalised product from lib/strapi.js, so this card
// does no CMS parsing of its own.
export default function ProductCard({ product, accent = "pink" }) {
  const colors = product.colors || [];
  const [color, setColor] = useState(colors[0] || null);

  const { addItems, items, updateQty, buildCartId } = useCart();

  const cartId = buildCartId(product, color);
  const inCart = items.find((item) => item.id === cartId);

  const href = `/product/${product.slug}`;
  const soldOut = !product.inStock;

  return (
    <div className="flex h-full min-w-0 flex-col rounded-2xl border border-line bg-card p-3.5 transition-all duration-150 hover:-translate-y-1 hover:border-pink-deep hover:shadow-lift">
      <a
        href={href}
        className="relative mb-2.5 block aspect-square w-full overflow-hidden rounded-xl bg-card"
      >
        <div className="absolute left-2 top-2 z-10 flex flex-col items-start gap-1">
          {product.isPromoted && (
            <span className="rounded-full bg-pink/25 px-2 py-0.5 text-[9.5px] font-extrabold text-pink-deep">
              PROMOTED
            </span>
          )}

          {product.discount > 0 && (
            <span className="rounded-full bg-discount px-2 py-0.5 text-[9.5px] font-extrabold text-white">
              -{product.discount}%
            </span>
          )}

          {soldOut && (
            <span className="rounded-full bg-ink px-2 py-0.5 text-[9.5px] font-extrabold text-white">
              SOLD OUT
            </span>
          )}
        </div>

        {product.image ? (
          <img
            src={product.image.url}
            alt={product.image.alt || product.name}
            className={`h-full w-full object-cover transition duration-300 hover:scale-105 ${
              soldOut ? "opacity-60" : ""
            }`}
          />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <div className="h-16 w-16 rounded-xl border-2 border-ink/80 bg-white p-1.5 shadow-sm">
              <ChartGlyph stroke={ACCENT_STROKE[accent] || ACCENT_STROKE.pink} />
            </div>
          </div>
        )}
      </a>

      <p className="min-h-[15px] text-[10px] font-bold uppercase tracking-wide text-ink-soft">
        {product.brand}
      </p>

      <a
        href={href}
        className="mt-0.5 block min-h-[34px] text-[13px] font-bold leading-tight text-ink hover:text-pink-deep"
      >
        {product.name}
      </a>

      {product.rating ? (
        <p className="mt-1 text-[10.5px] font-bold text-ink-soft">
          <span className="text-pink-deep">★</span> {product.rating.toFixed(1)}
          <span className="font-semibold"> ({product.reviewCount})</span>
        </p>
      ) : (
        product.description && (
          <p className="mt-1 min-h-[30px] line-clamp-2 text-[11px] leading-relaxed text-ink-soft">
            {product.description}
          </p>
        )
      )}

      <div className="my-1.5 flex items-baseline gap-1.5">
        <p className="text-[13.5px] font-extrabold text-pink-deep">
          {formatPrice(product.price)}
        </p>

        {product.discount > 0 && (
          <p className="text-[11px] text-ink-soft line-through">
            {formatPrice(product.originalPrice)}
          </p>
        )}
      </div>

      <div className="mb-2.5 h-[14px]">
        {colors.length > 1 && (
          <div className="flex gap-1.5">
            {colors.map((c) => (
              <button
                key={c.hex}
                aria-label={`Choose colour ${c.name}`}
                onClick={() => setColor(c)}
                style={{ backgroundColor: c.hex }}
                className={`h-3.5 w-3.5 rounded-full border-2 border-card ${
                  color?.hex === c.hex
                    ? "ring-2 ring-pink-deep"
                    : "ring-1 ring-line"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto pt-2">
        {soldOut ? (
          <a
            href={href}
            className="block w-full rounded-full border-2 border-line py-2 text-center text-[12.5px] font-bold text-ink-soft"
          >
            Sold out
          </a>
        ) : inCart ? (
          <div className="am-pop mb-2.5 flex items-center justify-between rounded-full bg-pink/15 p-1">
            <button
              aria-label={
                inCart.qty === 1 ? "Remove item from cart" : "Decrease quantity"
              }
              onClick={() => updateQty(cartId, inCart.qty - 1)}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-white transition hover:scale-105"
            >
              {inCart.qty === 1 ? (
                <img
                  src="/icons/remove-item.png"
                  alt=""
                  className="h-4 w-4 object-contain"
                />
              ) : (
                "–"
              )}
            </button>

            <span className="text-xs font-bold">{inCart.qty}</span>

            <button
              aria-label="Increase quantity"
              onClick={() => updateQty(cartId, inCart.qty + 1)}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-sm font-bold text-white"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={() => addItems(1, product, color)}
            className="w-full rounded-full bg-pink py-2 text-[12.5px] font-bold text-white transition hover:-translate-y-0.5 active:scale-95"
          >
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
}
