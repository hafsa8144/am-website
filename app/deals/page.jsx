import PageShell from "@/components/PageShell";
import DealsBundles from "@/components/DealsBundles";
import ProductGrid from "@/components/ProductGrid";
import { getBundles, getProducts } from "@/lib/api";

export const metadata = {
  title: "Deals & Bundles",
};

export default async function DealsPage() {
  const [bundles, products] = await Promise.all([
    getBundles(),
    getProducts(),
  ]);

  // Anything marked down in the CMS (originalprice above price) counts as a
  // deal, so single-product discounts show up here alongside the bundles.
  const discounted = products
    .filter((product) => product.discount > 0)
    .sort((a, b) => b.discount - a.discount);

  return (
    <PageShell>
      <nav className="py-3 text-xs text-ink-soft">
        <a href="/" className="hover:text-pink-deep">
          Home
        </a>
        <span className="mx-2">/</span>
        <span>Deals &amp; Bundles</span>
      </nav>

      <section className="mt-2 rounded-3xl bg-ink p-7 sm:p-10">
        <p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-white">
          Better together
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Deals &amp; bundles
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-white">
          Grab your favourite essentials together and save more.
        </p>
      </section>

      <DealsBundles
        bundles={bundles}
        showHeading={false}
        emptyMessage="No bundles are available right now."
      />

      {discounted.length > 0 && (
        <ProductGrid
          products={discounted}
          title="Individual items on offer"
          subtitle="Marked down right now."
          columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        />
      )}
    </PageShell>
  );
}
