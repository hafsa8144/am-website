import PageShell from "@/components/PageShell";
import WhatsAppButton from "@/components/WhatsAppButton";

const terms = [
  "Proof of purchase is required for any exchange request.",
  "Promoted items are not eligible for exchange.",
  "If an item is faulty, photo or video evidence must be sent within 30 minutes of delivery.",
  "By starting an order, customers consent to provide the information required to fulfil it.",
  "Product photographs are representative and an item may differ slightly from its pictured appearance.",
];

export const metadata = {
  title: "Terms & conditions",
};

export default function TermsPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl text-center">
        <nav className="text-[11px] font-semibold text-ink-soft">
          <a href="/" className="hover:text-pink-deep">
            Home
          </a>
          <span className="px-2 text-pink-deep">/</span>Terms &amp; Conditions
        </nav>

        <article className="mt-5 rounded-3xl border border-line bg-card p-6 sm:p-10">
          <p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-pink-deep">
            Accessories Mart
          </p>

          <h1 className="mt-2 text-3xl font-extrabold">Terms &amp; conditions</h1>

          <ol className="mt-7 space-y-3 text-left">
            {terms.map((term, index) => (
              <li
                key={term}
                className="flex items-center gap-3 rounded-2xl border border-line bg-paper p-4 text-sm leading-relaxed text-ink-soft"
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-pink-deep text-xs font-extrabold text-white">
                  {index + 1}
                </span>
                <span className="flex-1">{term}</span>
              </li>
            ))}
          </ol>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <WhatsAppButton context="your terms and conditions" />

            <a
              href="/policies"
              className="text-xs font-extrabold text-pink-deep hover:underline"
            >
              Read the privacy policy →
            </a>
          </div>
        </article>
      </div>
    </PageShell>
  );
}
