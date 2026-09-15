import PageShell from "@/components/PageShell";
import ProductGrid from "@/components/ProductGrid";
import BundleActions from "@/components/BundleActions";
import { getBundleBySlug, getBundles } from "@/lib/api";
import { formatPrice } from "@/lib/strapi";

export async function generateMetadata({ params }) {
  const { "bundle-slug": slug } = await params;
  const bundle = await getBundleBySlug(slug);

  return { title: bundle ? bundle.name : "Bundle not found" };
}

export default async function BundlePage({ params }) {
  const { "bundle-slug": slug } = await params;
  const bundle = await getBundleBySlug(slug);

  if (!bundle) {
    return (
      <PageShell>
        <section className="py-16 text-center">
          <p className="text-4xl">🎁</p>

          <h1 className="mt-4 text-2xl font-extrabold text-ink">
            Bundle not found
          </h1>

          <p className="mt-2 text-sm text-ink-soft">
            This bundle does not exist or is no longer available.
          </p>

          <a
            href="/deals"
            className="mt-5 inline-flex rounded-full bg-pink-deep px-5 py-2.5 text-sm font-bold text-white"
          >
            Back to deals
          </a>
        </section>
      </PageShell>
    );
  }

  const otherBundles = (await getBundles()).filter(
    (item) => item.slug !== bundle.slug
  );

  return (
    <PageShell>
      <nav className="py-3 text-xs text-ink-soft">
        <a href="/" className="hover:text-pink-deep">
          Home
        </a>
        <span className="mx-2">/</span>

        <a href="/deals" className="hover:text-pink-deep">
          Deals &amp; Bundles
        </a>

        <span className="mx-2">/</span>
        <span>{bundle.name}</span>
      </nav>

      <section className="relative mt-2 overflow-hidden rounded-3xl bg-gradient-to-br from-mint/45 to-sky/35 p-7 sm:p-10">
        {bundle.imageUrl && (
          <>
            <img
              src={bundle.imageUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-25"
            />
            {/* keeps the heading legible whatever the bundle photo looks like */}
            <span className="absolute inset-0 bg-paper/70" />
          </>
        )}

        <div className="relative">
          <p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-pink-deep">
            Bundle
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">
            {bundle.name}
          </h1>

          {bundle.description && (
            <p className="mt-2 max-w-2xl text-sm text-ink-soft">
              {bundle.description}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {bundle.savings > 0 && (
              <span className="text-sm text-ink-soft line-through">
                {formatPrice(bundle.originalPrice)}
              </span>
            )}

            <span className="text-xl font-extrabold text-pink-deep">
              {formatPrice(bundle.bundlePrice)}
            </span>

            {bundle.savings > 0 && (
              <span className="rounded-full bg-discount px-2.5 py-1 text-[11px] font-extrabold text-white">
                Save {bundle.savings}%
              </span>
            )}
          </div>

          <BundleActions bundle={bundle} />
        </div>
      </section>

      <section className="pt-7">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-ink">What&apos;s inside</h2>

            <p className="mt-1 text-sm text-ink-soft">
              Products included in this bundle.
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-pink/15 px-3 py-1 text-xs font-extrabold text-pink-deep">
            {bundle.products.length}{" "}
            {bundle.products.length === 1 ? "item" : "items"}
          </span>
        </div>

        <ProductGrid
          products={bundle.products}
          columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          emptyMessage="No products have been added to this bundle yet."
        />
      </section>

      {otherBundles.length > 0 && (
        <section className="py-6">
          <h2 className="text-sm font-extrabold text-ink">More bundles</h2>

          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
            {otherBundles.map((item) => (
              <a
                key={item.id}
                href={`/deals/${item.slug}`}
                className="shrink-0 rounded-full border-2 border-line bg-card px-4 py-2 text-xs font-extrabold transition hover:-translate-y-0.5 hover:border-pink-deep"
              >
                {item.name} · {formatPrice(item.bundlePrice)}
              </a>
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}
