import PageShell from "@/components/PageShell";
import { getCategories } from "@/lib/api";

export const metadata = {
  title: "Categories",
};

const TINTS = [
  "from-mint/55 to-sky/40",
  "from-sky/55 to-violet/35",
  "from-violet/45 to-pink/30",
  "from-pink/40 to-peach/45",
  "from-peach/55 to-lime/35",
];

export default async function CategoriesPage() {
  // withProducts gives each card a live product count straight from the CMS.
  const categories = await getCategories({ withProducts: true });

  return (
    <PageShell>
      <nav aria-label="Breadcrumb" className="text-[11px] font-semibold text-ink-soft">
        <a href="/" className="hover:text-pink-deep">
          Home
        </a>

        <span className="px-2 text-pink-deep">/</span>

        <span>Categories</span>
      </nav>

      <section className="relative mt-5 overflow-hidden rounded-3xl bg-gradient-to-br from-pink-deep via-pink to-peach px-6 py-10 shadow-soft sm:px-10 sm:py-14">
        <span className="absolute -right-14 -top-20 h-64 w-64 rounded-full bg-white/15" />
        <span className="absolute -bottom-24 -left-16 h-52 w-52 rounded-full border-[24px] border-white/15" />

        <div className="relative max-w-xl">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/75">
            Shop your way
          </p>

          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            Everything, neatly sorted.
          </h1>

          <p className="mt-3 text-sm text-white/90 sm:text-base">
            Find supplies for school, work, art, gifting, and all the little
            things in between.
          </p>
        </div>
      </section>

      <section className="py-9" aria-labelledby="all-categories">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2
              id="all-categories"
              className="flex items-center gap-2 text-2xl font-extrabold text-ink"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-pink-deep" />
              All categories
            </h2>

            <p className="mt-1 text-xs text-ink-soft">
              {categories.length
                ? `Explore ${categories.length} departments`
                : "Categories added in Strapi appear here"}
            </p>
          </div>

          <a
            href="/deals"
            className="hidden rounded-full border-2 border-line bg-card px-5 py-3 text-sm font-extrabold transition hover:-translate-y-0.5 hover:border-pink-deep sm:inline-flex"
          >
            View current deals
            <span className="ml-2">›</span>
          </a>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((category, index) => (
              <a
                key={category.id}
                href={`/category/${category.slug}`}
                className="group flex min-h-52 flex-col rounded-3xl border border-line bg-card p-4 transition hover:-translate-y-1 hover:border-pink-deep hover:shadow-lift sm:p-5"
              >
                <div
                  className={`aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br ${
                    TINTS[index % TINTS.length]
                  }`}
                >
                  {category.iconUrl ? (
                    <img
                      src={category.iconUrl}
                      alt={category.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-4xl">
                      📦
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-5">
                  {category.productCount !== null && (
                    <span className="rounded-full bg-pink/15 px-2.5 py-1 text-[10px] font-extrabold text-pink-deep">
                      {category.productCount}{" "}
                      {category.productCount === 1 ? "item" : "items"}
                    </span>
                  )}

                  <h3 className="mt-2 text-lg font-extrabold text-ink">
                    {category.name}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-soft">
                    {category.description || "Explore this category"}
                  </p>

                  <span className="mt-4 inline-flex items-center text-[11px] font-extrabold text-ink group-hover:text-pink-deep">
                    Shop category
                    <span className="ml-1 transition group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-line bg-card/60 py-16 text-center">
            <p className="text-3xl">🗂️</p>
            <p className="mt-3 text-sm font-bold text-ink-soft">
              No categories yet. Add them in Strapi and they will show up here.
            </p>
          </div>
        )}
      </section>

      <section className="flex flex-col items-start justify-between gap-5 rounded-3xl bg-ink p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-pink">
            Need a quick win?
          </p>

          <h2 className="mt-1 text-xl font-extrabold text-white">
            Browse our bundles and save.
          </h2>

          <p className="mt-1 text-xs text-white/65">
            Ready-made sets for school, art, and your desk.
          </p>
        </div>

        <a
          href="/deals"
          className="shrink-0 rounded-full bg-pink-deep px-5 py-2.5 text-xs font-extrabold text-white transition hover:brightness-110"
        >
          Shop bundles
        </a>
      </section>
    </PageShell>
  );
}
