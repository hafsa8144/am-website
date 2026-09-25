import PageShell from "@/components/PageShell";

const points = [
  "We collect your information only for the purpose of delivering your order properly.",
  "We share your profile with credible courier agencies only, to avoid harmful activities.",
  "We secure all possible rights to change policies whenever and wherever required.",
  "Any kind of misconduct by the customer will be handled as per the laws of the Government of Pakistan.",
  "We assure you that your information is secured to the extent it can be.",
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
