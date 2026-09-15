import PageShell from "@/components/PageShell";
import ProductGrid from "@/components/ProductGrid";
import { getCategories, getProducts } from "@/lib/api";

export const metadata = {
  title: "All products",
};

const SORTS = [
  ["Newest", "createdAt:desc"],
  ["Price: low to high", "price:asc"],
  ["Price: high to low", "price:desc"],
  ["Name A–Z", "name:asc"],
];

// Filter and sort live in the URL, so a filtered shelf can be linked and shared
// and the page stays a server component.
export default async function ShopPage({ searchParams }) {
  const params = await searchParams;
  const activeCategory = params?.category || "";
  const activeSort = SORTS.some(([, value]) => value === params?.sort)
    ? params.sort
    : SORTS[0][1];

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ category: activeCategory || undefined, sort: activeSort }),
  ]);

  const buildHref = (next) => {
    const query = new URLSearchParams();

    const category = next.category ?? activeCategory;
    const sort = next.sort ?? activeSort;

    if (category) query.set("category", category);
    if (sort !== SORTS[0][1]) query.set("sort", sort);

    const qs = query.toString();
    return qs ? `/shop?${qs}` : "/shop";
  };

  const current = categories.find((item) => item.slug === activeCategory);

  return (
    <PageShell>
      <nav className="text-[11px] font-semibold text-ink-soft">
        <a href="/" className="hover:text-pink-deep">
          Home
        </a>
        <span className="px-2 text-pink-deep">/</span>
        Shop
      </nav>

      <section className="mt-5 rounded-3xl bg-gradient-to-br from-sky/45 to-violet/35 p-7 sm:p-10">
        <p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-pink-deep">
          The AM shelf
        </p>

        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
          {current ? current.name : "All products"}
        </h1>

        <p className="mt-2 text-sm text-ink-soft">
          {current?.description ||
            "Everything currently available in one easy place."}
        </p>
      </section>

      {/* category filter */}
      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
        <a
          href={buildHref({ category: "" })}
          className={`shrink-0 rounded-full border-2 px-4 py-2 text-xs font-extrabold transition ${
            activeCategory
              ? "border-line bg-card hover:border-pink-deep"
              : "border-transparent bg-pink-deep text-white"
          }`}
        >
          All
        </a>

        {categories.map((category) => (
          <a
            key={category.id}
            href={buildHref({ category: category.slug })}
            className={`shrink-0 rounded-full border-2 px-4 py-2 text-xs font-extrabold transition ${
              activeCategory === category.slug
                ? "border-transparent bg-pink-deep text-white"
                : "border-line bg-card hover:border-pink-deep"
            }`}
          >
            {category.name}
          </a>
        ))}
      </div>

      {/* sort */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-extrabold uppercase tracking-[.12em] text-ink-soft">
          Sort
        </span>

        {SORTS.map(([label, value]) => (
          <a
            key={value}
            href={buildHref({ sort: value })}
            className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold transition ${
              activeSort === value
                ? "bg-ink text-white"
                : "bg-card border border-line hover:border-pink-deep"
            }`}
          >
            {label}
          </a>
        ))}

        <span className="ml-auto rounded-full border border-line bg-card px-3 py-1.5 text-[11px] font-bold text-ink-soft">
          {products.length} {products.length === 1 ? "product" : "products"}
        </span>
      </div>

      <ProductGrid
        products={products}
        columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        emptyMessage={
          activeCategory
            ? "No products in this category yet."
            : "No products to display right now."
        }
      />
    </PageShell>
  );
}
