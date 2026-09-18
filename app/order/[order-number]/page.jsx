"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import PageShell from "@/components/PageShell";
import { useSiteSettings } from "@/lib/settings-context";
import { lookupOrder, markOrderWhatsappSent } from "@/lib/api";
import { getRememberedOrder, markOrderSentLocally } from "@/lib/orders";
import {
  buildFollowUpWhatsAppLink,
  buildOrderConfirmationWhatsAppLink,
} from "@/lib/whatsapp";
import { formatPrice } from "@/lib/strapi";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderNumber = params["order-number"];

  const settings = useSiteSettings();

  const [order, setOrder] = useState(undefined); // undefined = still checking
  const [sent, setSent] = useState(false);

  useEffect(() => {
    // The local copy renders immediately; Strapi is then asked for the
    // authoritative version (status, whether WhatsApp was already sent) using
    // the token saved at checkout.
    const local = getRememberedOrder(orderNumber);
    setOrder(local || null);
    setSent(Boolean(local?.whatsappConfirmed));

    if (!local?.token) return;

    let cancelled = false;

    lookupOrder(orderNumber, local.token).then((remote) => {
      if (cancelled || !remote) return;

      setOrder({
        ...local,
        ...remote,
        // The API returns the snapshot under its Strapi field name.
        items: remote.cartSnapshot || local.items,
        token: local.token,
      });

      setSent(Boolean(remote.whatsappConfirmed));
    });

    return () => {
      cancelled = true;
    };
  }, [orderNumber]);

  if (order === undefined) {
    return (
      <PageShell>
        <p className="py-20 text-center text-sm text-ink-soft">
          Loading your order…
        </p>
      </PageShell>
    );
  }

  if (!order) {
    return (
      <PageShell>
        <div className="mx-auto max-w-md py-16 text-center">
          <p className="text-4xl">🔍</p>

          <h1 className="mt-4 text-2xl font-extrabold">
            We could not find that order
          </h1>

          <p className="mt-2 text-sm text-ink-soft">
            Order details are kept on the device they were placed from. If you
            ordered on another phone or browser, message us on WhatsApp with
            your order number and we will pull it up.
          </p>

          <a
            href={buildFollowUpWhatsAppLink(
              settings.whatsappNumber,
              orderNumber
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-[#B2A3FF] bg-[#E9DFFF] shadow-[0_8px_18px_rgba(178,163,255,.35)] px-5 py-3 text-sm font-extrabold text-ink"
          >
            <img
              src="/icons/whatsapp.svg"
              alt=""
              className="h-5 w-5 object-contain"
            />
            Ask about {orderNumber}
          </a>

          <a
            href="/"
            className="mt-4 block text-xs font-extrabold text-pink-deep hover:underline"
          >
            Back to home
          </a>
        </div>
      </PageShell>
    );
  }

  const items = order.items || [];
  const subtotal = Number(order.subtotal) || 0;

  const whatsappHref = buildOrderConfirmationWhatsAppLink(
    settings.whatsappNumber,
    { ...order, items, subtotal }
  );

  // Opening the message is what tells the shop the order has reached them, so
  // record it — on this device and, via the token, in Strapi.
  const handleSend = () => {
    setSent(true);
    markOrderSentLocally(order.orderNumber);

    if (order.token) {
      markOrderWhatsappSent(order.orderNumber, order.token);
    }
  };

  return (
    <PageShell>
      <nav className="text-[11px] font-semibold text-ink-soft">
        <a href="/" className="hover:text-pink-deep">
          Home
        </a>
        <span className="px-2 text-pink-deep">/</span>Order confirmed
      </nav>

      <div className="mx-auto mt-5 max-w-2xl rounded-3xl border border-line bg-card p-6 text-center sm:p-9">
        <p className="text-4xl">🎉</p>

        <p className="mt-3 text-[11px] font-extrabold uppercase tracking-[.16em] text-pink-deep">
          Order placed
        </p>

        <h1 className="mt-1 text-3xl font-extrabold">Thank you!</h1>

        <p className="mt-2 text-sm text-ink-soft">Your order number is</p>

        <p className="mt-1 text-2xl font-extrabold tracking-wide text-ink">
          {order.orderNumber}
        </p>

        {/* Step 2 of ordering: the message that actually reaches the shop. */}
        <section
          className={`mt-7 rounded-3xl border-2 p-5 text-left ${
            sent
              ? "border-[#b7dfc8] bg-[#eef8f1]/90"
              : "border-[#72cfc0] bg-mint/40"
          }`}
        >
          <h2 className="text-base font-extrabold text-ink">
            {sent
              ? "Order details sent on WhatsApp"
              : "One last step — send us the details"}
          </h2>

          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            {sent
              ? "We have your order. If WhatsApp did not open, use the button again."
              : "Tap below and WhatsApp opens with your full order ready to send. We reply with the delivery charge and confirm your order."}
          </p>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleSend}
            className="mt-4 flex items-center justify-center gap-2 rounded-full border-2 border-[#B2A3FF] bg-[#E9DFFF] px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_18px_rgba(37,211,102,.35)] transition hover:-translate-y-0.5"
          >
            <img
              src="/icons/whatsapp.svg"
              alt=""
              className="h-5 w-5 object-contain brightness-0"
            />
            {sent ? "Open WhatsApp again" : "Send order on WhatsApp"}
          </a>
        </section>

        <div className="mt-7 divide-y divide-line rounded-2xl border border-line text-left">
          <div className="bg-violet/20 px-4 py-3 text-xs leading-relaxed text-ink">
            <strong>Delivery charges are not included.</strong>
            <br />
            {settings.deliveryNote}
          </div>

          {items.map((item, index) => (
            <div
              key={item.id || index}
              className="flex items-center justify-between px-4 py-3 text-sm"
            >
              <span className="font-semibold">
                {item.name}{" "}
                <span className="font-normal text-ink-soft">× {item.qty}</span>
                {item.color?.name && (
                  <span className="ml-1 text-[11px] text-ink-soft">
                    ({item.color.name})
                  </span>
                )}
              </span>

              <span className="font-extrabold text-pink-deep">
                {formatPrice(item.price * item.qty)}
              </span>
            </div>
          ))}

          <div className="flex items-center justify-between px-4 py-3 text-sm font-extrabold">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
        </div>

        {(order.customerName || order.deliveryAddress) && (
          <div className="mt-4 rounded-2xl border border-line p-4 text-left text-xs leading-relaxed text-ink-soft">
            <p className="text-[11px] font-extrabold uppercase tracking-[.12em] text-ink">
              Delivering to
            </p>

            {order.customerName && (
              <p className="mt-1 font-bold text-ink">{order.customerName}</p>
            )}
            {order.customerPhone && <p>{order.customerPhone}</p>}
            {order.deliveryAddress && <p>{order.deliveryAddress}</p>}
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <a
            href="/shop"
            className="text-xs font-extrabold text-pink-deep hover:underline"
          >
            Continue shopping →
          </a>

          <a
            href="/orders"
            className="text-xs font-extrabold text-ink-soft hover:text-pink-deep hover:underline"
          >
            View your orders
          </a>
        </div>
      </div>
    </PageShell>
  );
}
