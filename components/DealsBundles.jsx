import { ChevronIcon } from "./icons";
import { formatPrice } from "@/lib/strapi";

const PALETTES = [
  "from-mint/70 to-sky/60",
  "from-violet/55 to-pink/35",
  "from-peach/60 to-pink/40",
];

// Bundles arrive normalised, with their products (and product images) already
// populated, so the card can preview what is inside without another fetch.
export default function DealsBundles({
  bundles = [],
  showHeading = true,
  emptyMessage = "No bundles are available right now.",
}) {
  return (
    <section className="py-8" aria-labelledby="deals-heading">
      {showHeading && (
        <div className="mb-4 flex items-end gap-4">
          <div>
            <h2
              id="deals-heading"
              className="flex items-center gap-2 text-xl font-extrabold text-ink sm:text-2xl"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-pink-deep" />
              Deals &amp; bundles
            </h2>

            <p className="mt-1 text-xs text-ink-soft">
              More good things together, for less.
            </p>
          </div>

          <a
            href="/deals"
            className="ml-auto hidden rounded-full border-2 border-line bg-card px-5 py-3 text-sm font-extrabold transition hover:-translate-y-0.5 hover:border-pink-deep sm:inline-flex"
          >
            View all deals
            <span className="ml-2">›</span>
          </a>
        </div>
      )}

      {bundles.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line bg-card/60 py-12 text-center">
          <p className="text-3xl">🎁</p>
          <p className="mt-3 text-sm font-bold text-ink-soft">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {bundles.map((bundle, index) => (
            <article
              key={bundle.id}
              className="relative overflow-hidden rounded-3xl border border-line bg-card p-5 transition hover:-translate-y-1 hover:border-pink-deep hover:shadow-lift"
            >
              <div
                className={`absolute inset-x-0 top-0 h-24 overflow-hidden bg-gradient-to-br ${
                  PALETTES[index % PALETTES.length]
                }`}
              >
                {bundle.imageUrl && (
                  <img
                    src={bundle.imageUrl}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-cover opacity-45"
                  />
                )}
              </div>

              <div className="relative flex items-start justify-between gap-3">
                <div className="flex -space-x-3">
                  {bundle.products.slice(0, 3).map((product) => (
                    <div
                      key={product.id}
                      className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border-2 border-card bg-card shadow-sm"
                    >
                      {product.image ? (
                        <img
                          src={product.image.url}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xl">📦</span>
                      )}
                    </div>
                  ))}
                </div>

                {bundle.savings > 0 && (
                  <span className="rounded-full bg-discount px-2.5 py-1 text-[11px] font-extrabold text-white">
                    Save {bundle.savings}%
                  </span>
                )}
              </div>

              <div className="relative mt-7">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-pink-deep">
                  Limited-time bundle
                </p>

                <h3 className="mt-1 text-base font-extrabold text-ink">
                  {bundle.name}
                </h3>

                {bundle.description && (
                  <p className="mt-1.5 min-h-9 line-clamp-2 text-[12px] leading-relaxed text-ink-soft">
                    {bundle.description}
                  </p>
                )}

                {bundle.products.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {bundle.products.map((product) => (
                      <a
                        key={product.id}
                        href={`/product/${product.slug}`}
                        className="rounded-full bg-pink/15 px-2.5 py-1 text-[10px] font-bold text-ink transition hover:bg-pink/30"
                      >
                        {product.name}
                      </a>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                  <div>
                    {bundle.savings > 0 && (
                      <p className="text-[11px] text-ink-soft line-through">
                        {formatPrice(bundle.originalPrice)}
                      </p>
                    )}

                    <p className="text-sm font-extrabold text-ink">
                      {formatPrice(bundle.bundlePrice)}
                    </p>
                  </div>

                  <a
                    href={`/deals/${bundle.slug}`}
                    className="rounded-full bg-pink-deep px-3.5 py-2 text-[11px] font-extrabold text-white transition hover:brightness-105"
                  >
                    See bundle
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {showHeading && bundles.length > 0 && (
        <a
          href="/deals"
          className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-pink-deep sm:hidden"
        >
          View all deals
          <ChevronIcon className="h-3.5 w-3.5" />
        </a>
      )}
    </section>
  );
}
