"use client";

import { useEffect, useState } from "react";

import PageShell from "@/components/PageShell";
import { getOrderHistory } from "@/lib/orders";
import { formatPrice } from "@/lib/strapi";

// Orders placed from this device. There are no customer accounts, so the list
// comes from localStorage — each entry keeps the token its confirmation page
// needs to read the order back from Strapi.
export default function OrdersPage() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    setOrders(getOrderHistory());
  }, []);

  return (
    <PageShell>
      <nav className="text-[11px] font-semibold text-ink-soft">
        <a href="/" className="hover:text-pink-deep">
          Home
        </a>
        <span className="px-2 text-pink-deep">/</span>Your orders
      </nav>

      <section className="mt-5 rounded-3xl border border-line bg-card p-6 sm:p-9">
        <h1 className="text-2xl font-extrabold">Your orders</h1>

        <p className="mt-1 text-xs text-ink-soft">
          Orders placed from this device.
        </p>

        {orders === null ? (
          <p className="py-12 text-center text-sm text-ink-soft">Loading…</p>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-4xl">🧾</p>

            <p className="mt-3 text-sm font-bold text-ink-soft">
              No orders yet from this device.
            </p>

            <a
              href="/shop"
              className="mt-5 inline-flex rounded-full bg-pink-deep px-5 py-2.5 text-xs font-extrabold text-white"
            >
              Start shopping
            </a>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {orders.map((order) => (
              <li key={order.orderNumber}>
                <a
                  href={`/order/${order.orderNumber}`}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-line p-4 transition hover:-translate-y-0.5 hover:border-pink-deep"
                >
                  <div>
                    <p className="text-sm font-extrabold text-ink">
                      {order.orderNumber}
                    </p>

                    <p className="mt-0.5 text-[11px] text-ink-soft">
                      {order.itemCount}{" "}
                      {order.itemCount === 1 ? "item" : "items"}
                      {order.placedAt
                        ? ` · ${new Date(order.placedAt).toLocaleDateString(
                            "en-GB"
                          )}`
                        : ""}
                    </p>
                  </div>

                  <span className="text-sm font-extrabold text-pink-deep">
                    {formatPrice(order.subtotal)}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageShell>
  );
}
