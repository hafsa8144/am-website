"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useSiteSettings } from "@/lib/settings-context";
import { buildProductWhatsAppLink } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/strapi";
import { Stars } from "./Reviews";

// The interactive half of the product page: gallery, colour choice, cart
// controls and the WhatsApp enquiry. The page itself stays a server component.
export default function ProductDetail({ product }) {
  const colors = product.colors || [];

  const [colour, setColour] = useState(colors[0] || null);
  const [activeImage, setActiveImage] = useState(0);
  const [zoom, setZoom] = useState(false);

  const { addItems, items, updateQty, buildCartId } = useCart();
  const settings = useSiteSettings();

  const cartId = buildCartId(product, colour);
  const inCart = items.find((item) => item.id === cartId);

  const image = product.images[activeImage] || product.image;
  const soldOut = !product.inStock;

  return (
    <section className="mt-5 grid gap-7 md:grid-cols-2">
      <div>
        <button
          onClick={() => setZoom((on) => !on)}
          aria-label="Zoom product image"
          className={`relative grid min-h-80 w-full place-items-center overflow-hidden rounded-3xl border border-line bg-pink/25 transition ${
            zoom ? "scale-[1.02]" : "hover:border-pink-deep"
          }`}
        >
          {image ? (
            <img
              src={image.url}
              alt={image.alt || product.name}
              className={`h-full w-full object-contain p-6 transition duration-300 ${
                zoom ? "scale-125" : ""
              }`}
            />
          ) : (
            <div className="grid h-40 w-40 place-items-center rounded-3xl border-2 border-ink bg-card shadow-lift">
              <span className="text-6xl">✎</span>
            </div>
          )}

          <span className="absolute bottom-4 right-4 rounded-full bg-card/90 px-3 py-1.5 text-[11px] font-bold">
            Click to {zoom ? "reset" : "zoom"}
          </span>
        </button>

        {product.images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {product.images.map((item, index) => (
              <button
                key={item.url}
                onClick={() => setActiveImage(index)}
                aria-label={`Show image ${index + 1}`}
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                  index === activeImage
                    ? "border-pink-deep"
                    : "border-line hover:border-pink"
                }`}
              >
                <img
                  src={item.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[.14em] text-pink-deep">
          {product.brand}
        </p>

        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
          {product.name}
        </h1>

        {product.rating ? (
          <a
            href="#reviews-heading"
            className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-ink-soft hover:text-pink-deep"
          >
            <Stars rating={product.rating} />
            {product.rating.toFixed(1)} · {product.reviewCount}{" "}
            {product.reviewCount === 1 ? "review" : "reviews"}
          </a>
        ) : null}

        <div className="mt-4 flex flex-wrap items-baseline gap-3">
          <p className="text-2xl font-extrabold text-pink-deep">
            {formatPrice(product.price)}
          </p>

          {product.discount > 0 && (
            <>
              <p className="text-sm text-ink-soft line-through">
                {formatPrice(product.originalPrice)}
              </p>

              <span className="rounded-full bg-discount px-2.5 py-1 text-[11px] font-extrabold text-white">
                Save {product.discount}%
              </span>
            </>
          )}
        </div>

        <p className="mt-2 text-xs font-extrabold">
          {soldOut ? (
            <span className="text-discount">Out of stock</span>
          ) : product.stock !== null && product.stock <= 5 ? (
            <span className="text-discount">
              Only {product.stock} left in stock
            </span>
          ) : (
            <span className="text-[#219b63]">In stock</span>
          )}
        </p>

        {product.description && (
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
            {product.description}
          </p>
        )}

        {colors.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-extrabold">
              Choose colour
              {colour && (
                <span className="ml-2 font-semibold text-ink-soft">
                  {colour.name}
                </span>
              )}
            </p>

            <div className="mt-3 flex gap-2">
              {colors.map((color) => (
                <button
                  key={color.hex}
                  aria-label={`Choose ${color.name}`}
                  onClick={() => setColour(color)}
                  style={{ background: color.hex }}
                  className={`h-8 w-8 rounded-full border-4 border-card ${
                    colour?.hex === color.hex
                      ? "ring-2 ring-pink-deep"
                      : "ring-1 ring-line"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {soldOut ? (
          <p className="mt-6 rounded-2xl border-2 border-line bg-card p-4 text-center text-sm font-bold text-ink-soft">
            This item is out of stock. Message us on WhatsApp and we will tell
            you when it is back.
          </p>
        ) : inCart ? (
          <div className="am-pop mt-6 flex items-center justify-between rounded-full bg-pink/15 p-1">
            <button
              aria-label={
                inCart.qty === 1 ? "Remove item from cart" : "Decrease quantity"
              }
              onClick={() => updateQty(cartId, inCart.qty - 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white transition hover:scale-105"
            >
              {inCart.qty === 1 ? (
                <img
                  src="/icons/remove-item.png"
                  alt=""
                  className="h-5 w-5 object-contain"
                />
              ) : (
                "−"
              )}
            </button>

            <span className="w-10 text-center text-sm font-extrabold">
              {inCart.qty}
            </span>

            <button
              aria-label="Increase quantity"
              onClick={() => updateQty(cartId, inCart.qty + 1)}
              className="h-10 w-10 rounded-full bg-ink text-white"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={() => addItems(1, product, colour)}
            className="mt-6 w-full rounded-full bg-pink-deep py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:brightness-105"
          >
            Add to cart
          </button>
        )}

        {inCart && (
          <a
            href="/cart"
            className="mt-3 block rounded-full border-2 border-line bg-card py-3 text-center text-sm font-extrabold transition hover:border-pink-deep"
          >
            Go to cart ({inCart.qty} in cart)
          </a>
        )}

        <a
          href={buildProductWhatsAppLink(settings.whatsappNumber, product)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 rounded-full border-2 border-[#72cfc0] bg-mint px-5 py-3 text-sm font-extrabold text-ink shadow-[0_8px_18px_rgba(163,240,232,.35)] transition hover:-translate-y-0.5"
        >
          <img
            src="/icons/whatsapp.svg"
            alt=""
            className="h-5 w-5 object-contain"
          />
          Ask about this on WhatsApp
        </a>

        <p className="mt-4 rounded-2xl bg-violet/20 p-3 text-[11px] leading-relaxed text-ink">
          {settings.deliveryNote}
        </p>
      </div>
    </section>
  );
}
