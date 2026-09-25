import PageShell from "@/components/PageShell";

const terms = [
  "The images of products displayed on the website can vary from the actual product, due to the difference between pictorial demonstration and physical appearance.",
  "The delivery charges vary on the basis of location, quantity ordered, etc.",
  "No cash refunds — anything ordered will only be exchanged conditionally, within seven working days, with a product of at least equal value. Products sent for exchange must not be tampered with at all, otherwise the exchange will not be entertained. The delivery charges to send the product for exchange as well as to receive the exchanged product will be paid by customer only.",
  "We will inform you when your order has to be rescheduled.",
  "Working hours and days can be changed as per the need of conducting the business.",
  "Once you have started shopping, you should be fully aware of your actions and the results of those actions, and you should be aware that you are providing your personal information in full consent.",
  "No exchange will be observed or entertained afterwards without genuine proof of purchase.",
  "Nothing will be exchanged which falls in the category of promoted products.",
  "For Lahore city, the minimum order value is Rs. 500. For cities other than Lahore, the minimum order value is Rs. 1000.",
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
