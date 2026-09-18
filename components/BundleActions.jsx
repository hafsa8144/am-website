"use client";

import { useCart } from "@/lib/cart-context";
import { useSiteSettings } from "@/lib/settings-context";
import { buildBundleWhatsAppLink } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/strapi";

// A bundle goes into the cart as a single line at the bundle price — adding
// its products separately would charge the individual prices and quietly lose
// the discount.
export default function BundleActions({ bundle }) {
  const { addItems, items, updateQty, buildCartId } = useCart();
  const settings = useSiteSettings();

  const asLine = {
    id: `bundle-${bundle.slug}`,
    type: "bundle",
    slug: bundle.slug,
    name: bundle.name,
    brand: "Bundle",
    price: bundle.bundlePrice,
    image: bundle.imageUrl
      ? { url: bundle.imageUrl }
      : bundle.products[0]?.image || null,
  };

  const cartId = buildCartId(asLine, null);
  const inCart = items.find((item) => item.id === cartId);

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      {inCart ? (
        <div className="am-pop flex items-center justify-between gap-4 rounded-full bg-pink/15 p-1 sm:w-56">
          <button
            aria-label={
              inCart.qty === 1 ? "Remove bundle from cart" : "Decrease quantity"
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

          <span className="text-sm font-extrabold">
            {inCart.qty} in cart
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
          onClick={() => addItems(1, asLine, null)}
          className="rounded-full bg-pink-deep px-6 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:brightness-105"
        >
          Add bundle — {formatPrice(bundle.bundlePrice)}
        </button>
      )}

      <a
        href={buildBundleWhatsAppLink(settings.whatsappNumber, bundle)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-full border-2 px-5 py-3 text-sm font-extrabold text-ink transition hover:-translate-y-0.5"
      >
        <img
          src="/icons/whatsapp.svg"
          alt=""
          className="h-5 w-5 object-contain"
        />
        Ask about this bundle
      </a>

      {inCart && (
        <a
          href="/cart"
          className="flex items-center justify-center rounded-full border-2 border-line bg-card px-5 py-3 text-sm font-extrabold transition hover:border-pink-deep"
        >
          Go to cart
        </a>
      )}
    </div>
  );
}
