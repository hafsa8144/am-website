import PageShell from "@/components/PageShell";
import ProductGrid from "@/components/ProductGrid";
import { getCategories, getProducts } from "@/lib/api";

export const metadata = {
  title: "Search",
};

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = (params?.q || "").trim();

  // Searching in Strapi (name, brand, slug) rather than filtering a local list,
  // so results cover the whole catalogue.
  const [results, categories] = await Promise.all([
    query ? getProducts({ search: query }) : Promise.resolve([]),
    getCategories(),
  ]);

  return (
    <PageShell>
      <nav className="text-[11px] font-semibold text-ink-soft">
        <a href="/" className="hover:text-pink-deep">
          Home
        </a>
        <span className="px-2 text-pink-deep">/</span>
        Search
      </nav>

      <section className="mt-5">
        <p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-pink-deep">
          Search results
        </p>

        <h1 className="mt-2 text-3xl font-extrabold">
          {query ? `Results for “${query}”` : "Find your next favourite"}
        </h1>

        <p className="mt-2 text-sm text-ink-soft">
          {query
            ? `${results.length} matching ${
                results.length === 1 ? "item" : "items"
              }`
            : "Try searching for pens, notebooks, bags, or organisers."}
        </p>
      </section>

      {query ? (
        <ProductGrid
          products={results}
          columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          emptyMessage={`Nothing matched “${query}”. Try a different word, or browse a category below.`}
        />
      ) : null}

      {categories.length > 0 && (
        <section className="py-6">
          <h2 className="text-sm font-extrabold text-ink">
            {results.length ? "Browse more" : "Browse by category"}
          </h2>

          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`/category/${category.slug}`}
                className="shrink-0 rounded-full border-2 border-line bg-card px-4 py-2 text-xs font-extrabold transition hover:-translate-y-0.5 hover:border-pink-deep"
              >
                {category.name}
              </a>
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}
