// Every call to the CMS lives here. Each getter returns ready-to-render data
// (see lib/strapi.js for the normalisers) and degrades to an empty result if
// Strapi is unreachable, so a backend hiccup never blanks out the whole site.

import {
  API_URL,
  normalizeBanner,
  normalizeBundle,
  normalizeCategory,
  normalizeProduct,
  normalizeReview,
  normalizeSiteSettings,
  SITE_SETTINGS_FALLBACK,
} from "./strapi";

// Catalogue content is revalidated rather than refetched on every request;
// orders and lookups always hit Strapi directly.
const CATALOG_REVALIDATE = 60;

async function strapiFetch(path, { revalidate = CATALOG_REVALIDATE, ...init } = {}) {
  const url = `${API_URL}${path}`;

  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    // `next` is ignored in the browser, where these run as plain fetches.
    next: revalidate === false ? undefined : { revalidate },
    cache: revalidate === false ? "no-store" : undefined,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    const error = new Error(
      `Strapi ${response.status} on ${path}${body ? ` — ${body.slice(0, 300)}` : ""}`
    );
    error.status = response.status;
    throw error;
  }

  return response.json();
}

// Read paths log and fall back; a missing banner should not take a page down.
async function collection(path, normalize, options) {
  try {
    const result = await strapiFetch(path, options);
    return (result.data || []).map(normalize).filter(Boolean);
  } catch (error) {
    console.error(`Failed to load ${path}:`, error.message);
    return [];
  }
}

const PAGE_SIZE = "pagination[pageSize]=100";

/* ---------------------------------------------------------------- products */

export async function getProducts({
  category,
  search,
  promotedOnly = false,
  maxPrice,
  sort = "createdAt:desc",
  limit,
} = {}) {
  const params = [
    "populate[images]=true",
    "populate[category]=true",
    "populate[reviews]=true",
    `sort=${encodeURIComponent(sort)}`,
    limit ? `pagination[pageSize]=${limit}` : PAGE_SIZE,
  ];

  if (category) {
    params.push(
      `filters[category][slug][$eq]=${encodeURIComponent(category)}`
    );
  }

  if (promotedOnly) {
    params.push("filters[isPromoted][$eq]=true");
  }

  if (maxPrice !== undefined) {
    params.push(`filters[price][$lte]=${Number(maxPrice)}`);
  }

  // Matched against name, brand and slug so "pilot" or "notebook" both work.
  if (search) {
    const term = encodeURIComponent(search);
    params.push(
      `filters[$or][0][name][$containsi]=${term}`,
      `filters[$or][1][brand][$containsi]=${term}`,
      `filters[$or][2][slug][$containsi]=${term}`
    );
  }

  return collection(`/products?${params.join("&")}`, normalizeProduct);
}

export async function getProductBySlug(slug) {
  if (!slug) return null;

  const products = await collection(
    `/products?filters[slug][$eq]=${encodeURIComponent(slug)}` +
      "&populate[images]=true&populate[category]=true" +
      "&populate[reviews][populate][product]=true&pagination[pageSize]=1",
    normalizeProduct
  );

  return products[0] || null;
}

// Same category, minus the product being viewed — powers "You may also like".
export async function getRelatedProducts(product, limit = 5) {
  if (!product?.category?.slug) return [];

  const products = await getProducts({
    category: product.category.slug,
    limit: limit + 1,
  });

  return products.filter((item) => item.slug !== product.slug).slice(0, limit);
}

/* -------------------------------------------------------------- categories */

export async function getCategories({ withProducts = false } = {}) {
  const params = [
    "populate[icon]=true",
    withProducts ? "populate[products]=true" : "",
    "sort=displayOrder:asc",
    PAGE_SIZE,
  ].filter(Boolean);

  return collection(`/categories?${params.join("&")}`, normalizeCategory);
}

export async function getCategoryBySlug(slug) {
  if (!slug) return null;

  const categories = await collection(
    `/categories?filters[slug][$eq]=${encodeURIComponent(slug)}` +
      "&populate[icon]=true&pagination[pageSize]=1",
    normalizeCategory
  );

  return categories[0] || null;
}

/* ----------------------------------------------------------------- bundles */

export async function getBundles() {
  return collection(
    "/bundles?populate[image]=true&populate[products][populate][images]=true" +
      `&sort=displayOrder:asc&${PAGE_SIZE}`,
    normalizeBundle
  );
}

export async function getBundleBySlug(slug) {
  if (!slug) return null;

  const bundles = await collection(
    `/bundles?filters[slug][$eq]=${encodeURIComponent(slug)}` +
      "&populate[image]=true&populate[products][populate][images]=true" +
      "&pagination[pageSize]=1",
    normalizeBundle
  );

  return bundles[0] || null;
}

/* ----------------------------------------------------------------- banners */

export async function getBanners() {
  return collection(
    "/banners?populate[image]=true&filters[isActive][$eq]=true" +
      `&sort=displayOrder:asc&${PAGE_SIZE}`,
    normalizeBanner
  );
}

/* ----------------------------------------------------------------- reviews */

// `isApproved` is the moderation gate: only approved reviews are ever shown.
// Strapi treats a null boolean as "not false", so filter for true explicitly.
export async function getReviews({ productSlug, featuredOnly = false, limit } = {}) {
  const params = [
    "populate[product]=true",
    "filters[isApproved][$eq]=true",
    "sort=createdAt:desc",
    limit ? `pagination[pageSize]=${limit}` : PAGE_SIZE,
  ];

  if (productSlug) {
    params.push(
      `filters[product][slug][$eq]=${encodeURIComponent(productSlug)}`
    );
  }

  if (featuredOnly) {
    params.push("filters[isFeatured][$eq]=true");
  }

  return collection(`/reviews?${params.join("&")}`, normalizeReview);
}

export function averageRating(reviews = []) {
  if (!reviews.length) return null;

  const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

/* ----------------------------------------------------------- site settings */

// Modelled as a collection in Strapi but used as a singleton: first entry wins.
export async function getSiteSettings() {
  try {
    const result = await strapiFetch(
      "/site-settings?populate[logo]=true&sort=createdAt:asc&pagination[pageSize]=1"
    );

    return normalizeSiteSettings((result.data || [])[0]);
  } catch (error) {
    console.error("Failed to load site settings:", error.message);
    return { ...SITE_SETTINGS_FALLBACK };
  }
}

/* ------------------------------------------------------------------ orders */

// Writes throw on failure — checkout needs to know, and shows the customer an
// error rather than a confirmation for an order that was never saved.
export async function createOrder(orderData) {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: orderData }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error("Create order failed:", response.status, body);
    throw new Error("Failed to create order");
  }

  return response.json();
}

// Reads an order back with the token the browser stored at checkout, so the
// confirmation page survives a refresh or a link opened in another tab.
export async function lookupOrder(orderNumber, token) {
  if (!orderNumber || !token) return null;

  try {
    const result = await strapiFetch(
      `/orders/lookup/${encodeURIComponent(orderNumber)}?token=${encodeURIComponent(token)}`,
      { revalidate: false }
    );

    return result.data || null;
  } catch (error) {
    if (error.status !== 404) {
      console.error("Order lookup failed:", error.message);
    }
    return null;
  }
}

// Flips whatsappConfirmed once the customer opens the WhatsApp message, so the
// shop can see in the admin which orders have actually reached them.
export async function markOrderWhatsappSent(orderNumber, token) {
  if (!orderNumber || !token) return null;

  try {
    const result = await strapiFetch(
      `/orders/lookup/${encodeURIComponent(orderNumber)}/whatsapp-confirmed`,
      {
        method: "POST",
        body: JSON.stringify({ token }),
        revalidate: false,
      }
    );

    return result.data || null;
  } catch (error) {
    console.error("Could not mark order as sent on WhatsApp:", error.message);
    return null;
  }
}
