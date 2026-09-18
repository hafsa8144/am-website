// Customer reviews from the CMS. Only reviews marked isApproved are fetched
// (see lib/api.js getReviews), so nothing appears on the site until the shop
// has approved it in the admin.

const TINTS = [
  "bg-[#D9FFF2]",
  "bg-[#E5F7FF]",
  "bg-[#EEE5FF]",
  "bg-[#FFE6DF]",
];

export function Stars({ rating = 0, className = "" }) {
  const rounded = Math.round(rating);

  return (
    <span
      className={`tracking-[.1em] text-pink-deep ${className}`}
      aria-label={`${rating} out of 5`}
    >
      {"★".repeat(rounded)}
      <span className="text-line">{"★".repeat(Math.max(0, 5 - rounded))}</span>
    </span>
  );
}

export function ReviewCard({ review, tint = TINTS[0] }) {
  return (
    <article
      className={`flex h-full flex-col rounded-3xl border border-line p-5 ${tint}`}
    >
      <Stars rating={review.rating} className="text-base" />

      {review.comment && (
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink">
          {review.comment}
        </p>
      )}

      <div className="mt-4 border-t border-ink/10 pt-3">
        <p className="text-sm font-extrabold text-ink">{review.name}</p>

        <p className="text-[11px] font-semibold text-ink-soft">
          {[review.city, review.product?.name].filter(Boolean).join(" · ") ||
            "Verified customer"}
        </p>
      </div>
    </article>
  );
}

export default function Reviews({
  reviews = [],
  title = "What our customers say",
  subtitle = "Real words from people who shop with us.",
  emptyMessage = "No reviews yet — yours could be the first.",
  showEmpty = false,
}) {
  if (!reviews.length && !showEmpty) return null;

  const average = reviews.length
    ? Math.round(
        (reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length) *
          10
      ) / 10
    : 0;

  return (
    <section className="py-8" aria-labelledby="reviews-heading">
      <div className="mb-5 flex flex-wrap items-end gap-4">
        <div>
          <h2
            id="reviews-heading"
            className="flex items-center gap-2 text-xl font-extrabold text-ink sm:text-2xl"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-pink-deep" />
            {title}
          </h2>

          <p className="mt-1 text-xs text-ink-soft">{subtitle}</p>
        </div>

        {reviews.length > 0 && (
          <div className="ml-auto flex items-center gap-2 rounded-full border-2 border-line bg-card px-4 py-2">
            <Stars rating={average} />
            <span className="text-sm font-extrabold text-ink">
              {average.toFixed(1)}
            </span>
            <span className="text-[11px] font-semibold text-ink-soft">
              ({reviews.length})
            </span>
          </div>
        )}
      </div>

      {reviews.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <ReviewCard
              key={review.id}
              review={review}
              tint={TINTS[index % TINTS.length]}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-line bg-card py-12 text-center">
          <p className="text-3xl">💬</p>
          <p className="mt-3 text-sm font-bold text-ink-soft">{emptyMessage}</p>
        </div>
      )}
    </section>
  );
}
