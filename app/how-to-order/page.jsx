import PageShell from "@/components/PageShell";
import WhatsAppButton from "@/components/WhatsAppButton";

// Mirrors what the site actually does now: the confirmation page hands the
// customer a ready-to-send WhatsApp message with their full order.
const steps = [
  ["1", "Add your favourites", "Choose a product and add it to your cart."],
  ["2", "Confirm your basket", "Review quantities and continue to checkout."],
  [
    "3",
    "Complete your order",
    "Fill in your delivery details and get your order number straight away.",
  ],
  [
    "4",
    "Send it on WhatsApp",
    "Tap the WhatsApp button on your confirmation page — your order details are already written out. We reply with the delivery charge.",
  ],
];

export const metadata = {
  title: "How to order",
};

export default function HowToOrderPage() {
  return (
    <PageShell>
      <section className="max-w-3xl">
        <nav className="text-[11px] font-semibold text-ink-soft">
          <a href="/" className="hover:text-pink-deep">
            Home
          </a>
          <span className="px-2 text-pink-deep">/</span>How to order
        </nav>

        <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[.16em] text-pink-deep">
          Simple ordering
        </p>

        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
          How to order
        </h1>

        <p className="mt-2 text-sm text-ink-soft">
          A quick, friendly path from browsing to delivery.
        </p>

        <div className="mt-7 space-y-3">
          {steps.map(([number, title, text]) => (
            <article
              key={number}
              className="flex gap-4 rounded-3xl border border-line bg-card p-5 transition hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-pink to-violet font-extrabold text-white">
                {number}
              </span>

              <div>
                <h2 className="text-lg font-extrabold">{title}</h2>
                <p className="mt-1 text-sm text-ink-soft">{text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a
            href="/shop"
            className="rounded-full bg-pink-deep px-5 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5"
          >
            Start shopping
          </a>

          <WhatsAppButton context="how ordering works" />
        </div>
      </section>
    </PageShell>
  );
}
