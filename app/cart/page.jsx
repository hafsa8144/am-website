"use client";

import PageShell from "@/components/PageShell";
import { useCart } from "@/lib/cart-context";
import { useSiteSettings } from "@/lib/settings-context";
import { formatPrice } from "@/lib/strapi";

export default function CartPage() {
  const { items, subtotal, updateQty, removeItem, clearCart, hydrated } =
    useCart();
  const settings = useSiteSettings();

  const threshold = settings.freeShippingThreshold;
  const remaining = threshold ? Math.max(0, threshold - subtotal) : 0;
  const progress = threshold
    ? Math.min(100, Math.round((subtotal / threshold) * 100))
    : 0;

  return (
    <PageShell>
      <nav className="text-[11px] font-semibold text-ink-soft">
        <a href="/" className="hover:text-pink-deep">
          Home
        </a>
        <span className="px-2 text-pink-deep">/</span>Your cart
      </nav>

      <div className="mt-5 flex flex-col gap-5">
        <section className="flex-1 rounded-3xl border border-line bg-card p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold">Your cart</h1>

              <p className="mt-1 text-xs text-ink-soft">
                Review your items before checkout.
              </p>
            </div>

            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-extrabold text-pink-deep hover:underline"
              >
                Clear cart
              </button>
            )}
          </div>

          {/* `hydrated` avoids flashing the empty state before localStorage is read */}
          {!hydrated ? (
            <div className="py-14 text-center text-sm font-bold text-ink-soft">
              Loading your cart…
            </div>
          ) : items.length === 0 ? (
            <div className="py-14 text-center">
              <p className="text-4xl">🛍️</p>

              <h2 className="mt-3 font-extrabold">Your cart is waiting.</h2>

              <p className="mt-1 text-xs text-ink-soft">
                Add something you like and it will show up here.
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <a
                  href="/shop"
                  className="inline-flex rounded-full bg-pink-deep px-4 py-2.5 text-xs font-extrabold text-white"
                >
                  Start shopping
                </a>

                <a
                  href="/deals"
                  className="inline-flex rounded-full border-2 border-line px-4 py-2.5 text-xs font-extrabold"
                >
                  See deals
                </a>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {items.map((item) => {
                const href =
                  item.type === "bundle"
                    ? `/deals/${item.slug}`
                    : `/product/${item.slug}`;

                return (
                  <article
                    key={item.id}
                    className="flex items-center gap-4 rounded-2xl border border-line p-3"
                  >
                    <a
                      href={item.slug ? href : "#"}
                      className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-pink/25"
                    >
                      {item.image ? (
                        <img
                          src={
                            typeof item.image === "string"
                              ? item.image
                              : item.image.url
                          }
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">✎</span>
                      )}
                    </a>

                    <div className="min-w-0 flex-1">
                      <a
                        href={item.slug ? href : "#"}
                        className="flex items-center gap-2 text-sm font-extrabold hover:text-pink-deep"
                      >
                        <span className="truncate">{item.name}</span>

                        {item.color && (
                          <span
                            aria-label={`Colour: ${item.color.name}`}
                            className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-card"
                            style={{
                              background: item.color.hex,
                              boxShadow: "0 0 0 1px #e5d5dc",
                            }}
                          />
                        )}
                      </a>

                      <p className="mt-1 text-xs font-bold text-pink-deep">
                        {formatPrice(item.price)}
                        {item.qty > 1 && (
                          <span className="ml-2 font-semibold text-ink-soft">
                            {formatPrice(item.price * item.qty)} total
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center rounded-full bg-pink/15 p-1">
                      <button
                        aria-label={
                          item.qty === 1
                            ? "Remove item from cart"
                            : "Decrease quantity"
                        }
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-white transition hover:scale-105"
                      >
                        {item.qty === 1 ? (
                          <img
                            src="/icons/remove-item.png"
                            alt=""
                            className="h-4 w-4 object-contain"
                          />
                        ) : (
                          "−"
                        )}
                      </button>

                      <span className="w-8 text-center text-xs font-extrabold">
                        {item.qty}
                      </span>

                      <button
                        aria-label="Increase quantity"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="h-7 w-7 rounded-full bg-ink text-white"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="hidden text-[11px] font-extrabold text-ink-soft hover:text-discount sm:block"
                    >
                      Remove
                    </button>
                  </article>
                );
              })}

              <a
                href="/shop"
                className="inline-flex pt-2 text-xs font-extrabold text-pink-deep hover:underline"
              >
                ← Continue shopping
              </a>
            </div>
          )}
        </section>

        <aside className="rounded-3xl border border-line bg-gradient-to-br from-[#FFA3C2] to-[#B2A3FF] p-6 text-ink">
          <h2 className="text-lg font-extrabold">Order summary</h2>

          <div className="mt-5 flex justify-between border-t border-ink/10 pt-4 text-sm">
            <span className="text-ink-soft">Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>

          {threshold > 0 && items.length > 0 && (
            <div className="mt-4">
              <div className="h-2 overflow-hidden rounded-full bg-card/70">
                <div
                  className="h-full rounded-full bg-pink-deep transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-2 text-[11px] font-bold text-ink">
                {remaining > 0
                  ? `${formatPrice(remaining)} more for free shipping`
                  : "You have unlocked free shipping 🎉"}
              </p>
            </div>
          )}

          <p className="mt-4 rounded-2xl bg-card/70 p-3 text-[11px] leading-relaxed text-ink-soft">
            {settings.deliveryNote}
          </p>

          <a
            href={items.length ? "/checkout" : "/shop"}
            className={`mt-5 block rounded-full px-4 py-3 text-center text-xs font-extrabold text-white ${
              items.length
                ? "bg-pink-deep transition hover:-translate-y-0.5"
                : "pointer-events-none bg-ink/30"
            }`}
          >
            Proceed to checkout
          </a>

          
        </aside>
      </div>
    </PageShell>
  );
}
