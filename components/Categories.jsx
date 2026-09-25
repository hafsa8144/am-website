const TINTS = [
  "from-pink/35 to-violet/30",
  "from-peach/45 to-pink/25",
  "from-sky/40 to-violet/25",
  "from-pink/30 to-peach/45",
];

// Categories arrive normalised (name, slug, description, iconUrl, productCount).
export default function Categories({ categories = [] }) {
  if (!categories.length) return null;

  return (
    <section className="py-9">
      <div className="mb-5 flex items-end gap-4">
        <div>
  <div className="inline-block">
    <h2 className="text-2xl font-extrabold text-ink sm:text-4xl">
      Shop by category
    </h2>

    <span className="mt-2 block h-2 w-full rounded-full bg-pink" />
  </div>

  <p className="mt-3 text-sm font-semibold text-ink-soft sm:text-base">
    Everything at AM, neatly organised for you.
  </p>
</div>

        <a
          href="/categories"
          className="ml-auto hidden rounded-full border-2 border-line bg-card px-5 py-3 text-sm font-extrabold transition hover:-translate-y-0.5 hover:border-pink-deep sm:inline-flex"
        >
          All categories
          <span className="ml-2">›</span>
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((category, index) => (
          <a
            key={category.id}
            href={`/category/${category.slug}`}
            className="group min-w-0"
          >
            <article className="h-full rounded-2xl border border-line bg-card p-3.5 transition-all duration-150 hover:-translate-y-1 hover:border-pink-deep hover:shadow-lift">
              <div
                className={`flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${
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
                  <span className="text-4xl">📦</span>
                )}
              </div>

              <h3 className="mt-3 text-base font-extrabold text-ink">
                {category.name}
              </h3>

              <p className="mt-1 line-clamp-2 text-xs text-ink-soft">
                {category.description || "Explore this category"}
              </p>

              <span className="mt-3 inline-flex text-xs font-extrabold text-pink-deep">
                Shop category
                <span className="ml-1 transition group-hover:translate-x-1">
                  →
                </span>
              </span>
            </article>
          </a>
        ))}
      </div>
    </section>
  );
}
