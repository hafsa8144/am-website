import PageShell from "@/components/PageShell";
import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/api";

export const metadata = {
  title: "Under Rs. 500 (Lahore)",
};

export default async function Under500Page() {
  // Filtered by Strapi rather than in the browser, so the page only carries
  // the products it actually shows.
  const products = await getProducts({ maxPrice: 500, sort: "price:asc" });

  return (
    <PageShell>
      <nav className="text-[11px] font-semibold text-ink-soft">
        <a href="/" className="hover:text-pink-deep">
          Home
        </a>
        <span className="px-2 text-pink-deep">/</span>
        Under Rs. 500
      </nav>

      <section className="mt-5 rounded-3xl bg-ink p-7 sm:p-10">
        <p className="text-[11px] font-extrabold uppercase tracking-[.15em] text-white">
          Lahore only
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Small finds under Rs. 500
        </h1>

        <p className="mt-2 text-sm text-white">
          A handpicked selection for LHR customers. Delivery is discussed on
          WhatsApp.
        </p>
      </section>

      <ProductGrid
        products={products}
        title="Products under Rs. 500"
        subtitle={`${products.length} ${
          products.length === 1 ? "item" : "items"
        } at Rs. 500 or less.`}
        columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        emptyMessage="Nothing under Rs. 500 right now — check back soon."
      />
    </PageShell>
  );
}
