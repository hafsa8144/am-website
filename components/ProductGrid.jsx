import ProductCard from "./ProductCard";
import { ACCENT_CYCLE } from "@/lib/data";

// One grid used by every listing (home, shop, category, search, bundle,
// under-500) so a change to spacing or empty states lands everywhere at once.
export default function ProductGrid({
  products = [],
  title,
  subtitle,
  cta,
  ctaHref,
  columns = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  emptyMessage = "Nothing to show here yet.",
}) {
  return (
    <section className="py-6">
      {title && (
        <div className="mb-4 flex items-end gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-ink sm:text-2xl">
              <span className="inline-block h-2 w-2 rounded-full bg-pink-deep" />
              {title}
            </h2>

            {subtitle && (
              <p className="mt-1 text-xs text-ink-soft">{subtitle}</p>
            )}
          </div>

          {cta && ctaHref && (
            <a
              href={ctaHref}
              className="ml-auto hidden rounded-full border-2 border-line bg-card px-5 py-3 text-sm font-extrabold transition hover:-translate-y-0.5 hover:border-pink-deep sm:inline-flex"
            >
              {cta}
              <span className="ml-2">›</span>
            </a>
          )}
        </div>
      )}

      {products.length > 0 ? (
        <div className={`grid gap-4 ${columns}`}>
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              accent={ACCENT_CYCLE[index % ACCENT_CYCLE.length]}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-line bg-card/60 py-14 text-center">
          <p className="text-3xl">🗂️</p>
          <p className="mt-3 text-sm font-bold text-ink-soft">{emptyMessage}</p>
        </div>
      )}
    </section>
  );
}
