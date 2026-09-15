import PageShell from "@/components/PageShell";
import ProductDetail from "@/components/ProductDetail";
import ProductGrid from "@/components/ProductGrid";
import Reviews from "@/components/Reviews";
import {
  getProductBySlug,
  getRelatedProducts,
  getReviews,
} from "@/lib/api";

export async function generateMetadata({ params }) {
  const { "product-name": slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.description?.slice(0, 160) || undefined,
  };
}

export default async function ProductPage({ params }) {
  const { "product-name": slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <PageShell>
        <div className="py-20 text-center">
          <p className="text-4xl">🔍</p>

          <h1 className="mt-4 text-2xl font-extrabold">Product not found.</h1>

          <p className="mt-2 text-sm text-ink-soft">
            It may have sold out or been removed from the catalogue.
          </p>

          <a
            href="/shop"
            className="mt-6 inline-flex rounded-full bg-pink-deep px-5 py-3 text-xs font-extrabold text-white"
          >
            Browse all products
          </a>
        </div>
      </PageShell>
    );
  }

  // Reviews for this product, and more from the same category.
  const [reviews, related] = await Promise.all([
    getReviews({ productSlug: product.slug }),
    getRelatedProducts(product),
  ]);

  return (
    <PageShell>
      <nav className="text-[11px] font-semibold text-ink-soft">
        <a href="/" className="hover:text-pink-deep">
          Home
        </a>

        <span className="px-2 text-pink-deep">/</span>

        {product.category ? (
          <>
            <a
              href={`/category/${product.category.slug}`}
              className="hover:text-pink-deep"
            >
              {product.category.name}
            </a>
            <span className="px-2 text-pink-deep">/</span>
          </>
        ) : (
          <>
            <a href="/shop" className="hover:text-pink-deep">
              Shop
            </a>
            <span className="px-2 text-pink-deep">/</span>
          </>
        )}

        {product.name}
      </nav>

      <ProductDetail product={product} />

      <Reviews
        reviews={reviews}
        showEmpty
        title="Reviews"
        subtitle={`What customers think of the ${product.name}.`}
        emptyMessage="No reviews for this product yet."
      />

      {related.length > 0 && (
        <ProductGrid
          products={related}
          title="You may also like"
          subtitle={
            product.category
              ? `More from ${product.category.name}.`
              : "More from the shop."
          }
          cta={product.category ? `All ${product.category.name}` : "Shop all"}
          ctaHref={
            product.category ? `/category/${product.category.slug}` : "/shop"
          }
        />
      )}
    </PageShell>
  );
}
