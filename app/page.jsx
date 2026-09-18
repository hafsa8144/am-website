import PageShell from "@/components/PageShell";
import Banner from "@/components/Banner";
import Categories from "@/components/Categories";
import ProductGrid from "@/components/ProductGrid";
import DealsBundles from "@/components/DealsBundles";

import {FALLBACK_BANNERS } from "@/lib/data";
import {
  getBanners,
  getBundles,
  getCategories,
  getProducts,
} from "@/lib/api";

// Rendered on the server: one round of parallel CMS calls, no loading flicker,
// and the whole home page arrives as HTML.
export default async function HomePage() {
  const [banners, categories, promoted, latest, bundles] =
  await Promise.all([
    getBanners(),
    getCategories({ withProducts: true }),
    getProducts({ promotedOnly: true, limit: 5 }),
    getProducts({ limit: 10 }),
    getBundles(),
  ]);

  // Nothing promoted in the CMS yet? Show the newest arrivals instead of an
  // empty shelf.
  const spotlight = promoted.length > 0 ? promoted : latest.slice(0, 5);

  // Whatever the spotlight did not already show, newest first.
  const spotlightIds = new Set(spotlight.map((product) => product.id));
  const newArrivals = latest
    .filter((product) => !spotlightIds.has(product.id))
    .slice(0, 5);

  return (
    <PageShell>
      <Banner slides={banners.length > 0 ? banners : FALLBACK_BANNERS} />

      <Categories categories={categories} />

      <ProductGrid
        products={spotlight}
        title={promoted.length > 0 ? "Promoted items" : "Fresh on the shelf"}
        subtitle="Hand-picked by the shop."
        cta="Shop all"
        ctaHref="/shop"
        emptyMessage="Products added in Strapi will appear here."
      />

      <DealsBundles bundles={bundles} />

      {newArrivals.length > 0 && (
        <ProductGrid
          products={newArrivals}
          title="New arrivals"
          subtitle="The latest to reach the shelves."
          cta="See everything"
          ctaHref="/shop"
        />
      )}
    </PageShell>
  );
}
