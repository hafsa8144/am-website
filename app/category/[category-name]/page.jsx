import PageShell from "@/components/PageShell";
import ProductGrid from "@/components/ProductGrid";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/api";

export async function generateMetadata({ params }) {
  const { "category-name": slug } = await params;
  const category = await getCategoryBySlug(slug);

  return { title: category ? category.name : "Category" };
}

export default async function CategoryListing({ params }) {
  const { "category-name": slug } = await params;

  const [category, products, allCategories] = await Promise.all([
    getCategoryBySlug(slug),
    getProducts({ category: slug }),
    getCategories(),
  ]);

  if (!category) {
    return (
      <PageShell>
        <div className="py-20 text-center">
          <p className="text-4xl">🔍</p>

          <h1 className="mt-4 text-2xl font-extrabold">Category not found.</h1>

          <p className="mt-2 text-sm text-ink-soft">
            It may have been renamed or removed.
          </p>

          <a
            href="/categories"
            className="mt-6 inline-flex rounded-full bg-pink-deep px-5 py-3 text-xs font-extrabold text-white"
          >
            Back to categories
          </a>
        </div>
      </PageShell>
    );
  }

  // Sibling categories keep browsing going without a trip back to the index.
  const siblings = allCategories.filter((item) => item.slug !== category.slug);

  return (
    <PageShell>
      <nav className="text-[11px] font-semibold text-ink-soft">
        <a href="/" className="hover:text-pink-deep">
          Home
        </a>

        <span className="px-2 text-pink-deep">/</span>

        <a href="/categories" className="hover:text-pink-deep">
          Categories
        </a>

        <span className="px-2 text-pink-deep">/</span>

        {category.name}
      </nav>

      <section className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-pink/20">
            {category.iconUrl ? (
              <img
                src={category.iconUrl}
                alt={category.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-3xl">🛍️</span>
            )}
          </div>

          <h1 className="mt-3 text-3xl font-extrabold text-ink">
            {category.name}
          </h1>

          <p className="mt-1 text-sm text-ink-soft">
            {category.description ||
              `Explore everything in ${category.name.toLowerCase()}.`}
          </p>
        </div>

        <div className="rounded-full border border-line bg-card px-4 py-2 text-xs font-bold text-ink-soft">
          {products.length} {products.length === 1 ? "product" : "products"}
        </div>
      </section>

      <ProductGrid
        products={products}
        title={`${category.name} products`}
        emptyMessage="There are no products in this category yet."
      />

      {siblings.length > 0 && (
        <section className="py-6">
          <h2 className="text-sm font-extrabold text-ink">
            Keep browsing
          </h2>

          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
            {siblings.map((item) => (
              <a
                key={item.id}
                href={`/category/${item.slug}`}
                className="shrink-0 rounded-full border-2 border-line bg-card px-4 py-2 text-xs font-extrabold transition hover:-translate-y-0.5 hover:border-pink-deep"
              >
                {item.name}
              </a>
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}
