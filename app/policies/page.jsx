import PageShell from "@/components/PageShell";
import WhatsAppButton from "@/components/WhatsAppButton";

const points = [
  "We collect customer information, including a WhatsApp number, only to arrange and verify delivery.",
  "Information is shared only with credible courier agencies where needed to complete delivery.",
  "Delivery delays or scheduling problems will be communicated to the customer.",
  "There are no cash refunds. Unused items may be conditionally replaced with an item of equal value within 7 working days.",
  "Return and replacement delivery charges are paid by the customer.",
  "Fraud, scams, or other misconduct are handled under the applicable laws of Pakistan.",
];

export const metadata = {
  title: "Policies & privacy",
};

export default function PoliciesPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl text-center">
        <nav className="text-[11px] font-semibold text-ink-soft">
          <a href="/" className="hover:text-pink-deep">
            Home
          </a>
          <span className="px-2 text-pink-deep">/</span>Policies
        </nav>

        <article className="mt-5 rounded-3xl border border-line bg-card p-6 sm:p-10">
          <p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-pink-deep">
            Accessories Mart
          </p>

          <h1 className="mt-2 text-3xl font-extrabold">
            Privacy &amp; delivery policies
          </h1>

          <p className="mt-3 text-sm text-ink-soft">
            Clear, practical information on how orders and customer details are
            handled.
          </p>

          <ul className="mt-7 space-y-3 text-left">
            {points.map((point) => (
              <li
                key={point}
                className="rounded-2xl border border-line bg-paper p-4 text-sm leading-relaxed text-ink-soft"
              >
                <span className="mr-2 font-bold text-pink-deep">•</span>
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <WhatsAppButton context="your privacy and delivery policy" />

            <a
              href="/terms"
              className="text-xs font-extrabold text-pink-deep hover:underline"
            >
              Read terms &amp; conditions →
            </a>
          </div>
        </article>
      </div>
    </PageShell>
  );
}
