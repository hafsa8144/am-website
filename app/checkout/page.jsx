"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PageShell from "@/components/PageShell";
import { useCart } from "@/lib/cart-context";
import { useSiteSettings } from "@/lib/settings-context";
import { createOrder } from "@/lib/api";
import {
  generateOrderNumber,
  generateOrderToken,
  rememberOrder,
} from "@/lib/orders";
import { buildOrderWhatsAppLink } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/strapi";

export default function CheckoutPage() {
  const { count, items, subtotal, clearCart, hydrated } = useCart();
  const settings = useSiteSettings();
  const router = useRouter();

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    streetAddress: "",
    landmark: "",
    city: "",
    postalCode: "",
    province: "",
    country: "Pakistan",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleCompleteOrder = async (event) => {
    event.preventDefault();

    if (count === 0 || isSubmitting) return;

    // A WhatsApp number is how the shop reaches the customer about delivery,
    // so check it looks like one before taking the order.
    const digits = form.customerPhone.replace(/\D/g, "");

    if (digits.length < 10) {
      setError("Please enter a valid WhatsApp number, for example 0300 1234567.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const orderNumber = generateOrderNumber();
    const token = generateOrderToken();

    const deliveryAddress = [
      form.streetAddress,
      form.landmark,
      form.city,
      form.postalCode,
      form.province,
      form.country,
    ]
      .filter(Boolean)
      .join(", ");

    try {
      await createOrder({
        orderNumber,
        orderToken: token,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        deliveryAddress,
        cartSnapshot: items,
        subtotal,
        deliveryCharge: 0,
        orderStatus: "pending",
        whatsappConfirmed: false,
      });

      // Kept on this device so the confirmation page can be reopened later —
      // the token is what lets it read the order back from Strapi.
      rememberOrder({
        orderNumber,
        token,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        deliveryAddress,
        items,
        subtotal,
        placedAt: Date.now(),
      });

      clearCart();

      router.push(`/order/${orderNumber}`);
    } catch (err) {
      console.error("Order creation failed:", err);
      setError(
        "We could not place your order right now. Please try again, or send it to us on WhatsApp."
      );
      setIsSubmitting(false);
    }
  };

  const fieldStyle =
    "mt-1 w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm outline-none transition focus:border-pink-deep focus:bg-card";

  if (hydrated && count === 0) {
    return (
      <PageShell>
        <div className="mx-auto max-w-md py-20 text-center">
          <p className="text-4xl">🧺</p>

          <h1 className="mt-4 text-2xl font-extrabold">Your cart is empty</h1>

          <p className="mt-2 text-sm text-ink-soft">
            Add a few things first and then come back to checkout.
          </p>

          <a
            href="/shop"
            className="mt-6 inline-flex rounded-full bg-pink-deep px-5 py-3 text-xs font-extrabold text-white"
          >
            Start shopping
          </a>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <nav className="text-[11px] font-semibold text-ink-soft">
        <a href="/" className="hover:text-pink-deep">
          Home
        </a>
        <span className="px-2 text-pink-deep">/</span>
        <a href="/cart" className="hover:text-pink-deep">
          Cart
        </a>
        <span className="px-2 text-pink-deep">/</span>
        Checkout
      </nav>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <div className="rounded-3xl border border-line bg-card p-6 sm:p-9">
          <p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-pink-deep">
            Almost there
          </p>

          <h1 className="mt-2 text-3xl font-extrabold">Checkout securely</h1>

          <p className="mt-2 text-sm text-ink-soft">
            Your details are used only to coordinate delivery and are shared
            only with credible courier agencies.
          </p>

          <form onSubmit={handleCompleteOrder} className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-violet/20 p-4 text-xs leading-relaxed text-ink sm:col-span-2">
              <strong>Delivery charges:</strong>
              <br />
              {settings.deliveryNote} They are not included in the subtotal
              below.
            </div>

            <label className="text-xs font-extrabold text-ink">
              Full name
              <input
                required
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                autoComplete="name"
                placeholder="Your full name"
                className={fieldStyle}
              />
            </label>

            <label className="text-xs font-extrabold text-ink">
              WhatsApp number
              <input
                required
                name="customerPhone"
                value={form.customerPhone}
                onChange={handleChange}
                type="tel"
                autoComplete="tel"
                placeholder="03XX XXX XXXX"
                className={fieldStyle}
              />
            </label>

            <label className="text-xs font-extrabold text-ink sm:col-span-2">
              Street address
              <input
                required
                name="streetAddress"
                value={form.streetAddress}
                onChange={handleChange}
                autoComplete="street-address"
                placeholder="House / street / area"
                className={fieldStyle}
              />
            </label>

            <label className="text-xs font-extrabold text-ink sm:col-span-2">
              Apartment, building, floor or landmark{" "}
              <span className="font-semibold text-ink-soft">(optional)</span>
              <input
                name="landmark"
                value={form.landmark}
                onChange={handleChange}
                placeholder="Apartment, building name, floor, or nearby landmark"
                className={fieldStyle}
              />
            </label>

            <label className="text-xs font-extrabold text-ink">
              City
              <input
                required
                name="city"
                value={form.city}
                onChange={handleChange}
                autoComplete="address-level2"
                placeholder="Lahore"
                className={fieldStyle}
              />
            </label>

            <label className="text-xs font-extrabold text-ink">
              Postal code{" "}
              <span className="font-semibold text-ink-soft">(optional)</span>
              <input
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="e.g. 54000"
                className={fieldStyle}
              />
            </label>

            <label className="text-xs font-extrabold text-ink">
              Province / region
              <input
                name="province"
                value={form.province}
                onChange={handleChange}
                autoComplete="address-level1"
                placeholder="Punjab"
                className={fieldStyle}
              />
            </label>

            <label className="text-xs font-extrabold text-ink">
              Country
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                autoComplete="country-name"
                className={fieldStyle}
              />
            </label>

            {error && (
              <p
                role="alert"
                className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-600 sm:col-span-2"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={count === 0 || isSubmitting}
              className="rounded-full bg-pink-deep px-5 py-3 text-xs font-extrabold text-white transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40 sm:col-span-2"
            >
              {isSubmitting ? "Placing order…" : "Complete order"}
            </button>

            <p className="text-center text-[11px] text-ink-soft sm:col-span-2">
              You will get your order number next, with a WhatsApp message ready
              to send to the shop.
            </p>
          </form>
        </div>

        {/* the cart, carried through to checkout so nothing has to be re-checked */}
        <aside className="rounded-3xl border border-line bg-gradient-to-br from-pink/35 via-lime/30 to-mint/35 p-6">
          <h2 className="text-lg font-extrabold">Your order</h2>

          <div className="mt-4 space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 text-sm"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold">{item.name}</span>
                  <span className="text-[11px] text-ink-soft">
                    × {item.qty}
                    {item.color ? ` · ${item.color.name}` : ""}
                  </span>
                </span>

                <span className="shrink-0 font-extrabold">
                  {formatPrice(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between border-t border-ink/10 pt-3 text-sm">
            <span className="text-ink-soft">Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>

          <a
            href="/cart"
            className="mt-4 inline-flex text-[11px] font-extrabold text-pink-deep hover:underline"
          >
            ← Edit cart
          </a>

          <a
            href={buildOrderWhatsAppLink(
              settings.whatsappNumber,
              items,
              subtotal
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex items-center justify-center gap-2 rounded-full border-2 border-[#B2A3FF] bg-[#E9DFFF] text-ink shadow-[0_8px_18px_rgba(178,163,255,.35)] px-5 py-3 text-sm font-extrabold transition hover:-translate-y-0.5"
          >
            <img
              src="/icons/whatsapp.svg"
              alt=""
              className="h-5 w-5 object-contain"
            />
            Chat on WhatsApp
          </a>
        </aside>
      </div>
    </PageShell>
  );
}
