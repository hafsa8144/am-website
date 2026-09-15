// Low-level Strapi helpers + normalisers.
//
// Everything the CMS returns passes through here first, so components never
// deal with Strapi shapes: rich-text blocks, relative /uploads paths,
// colours stored as bare hex strings, decimals as strings.

export const STRAPI_URL = (
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
).replace(/\/+$/, "");

export const API_URL = `${STRAPI_URL}/api`;

// Strapi media comes back either as an object or a one-element array
// (`multiple: true` fields), and its url is relative to the Strapi host.
export function firstMedia(value) {
  if (!value) return null;
  return Array.isArray(value) ? value[0] || null : value;
}

export function mediaUrl(value) {
  const media = firstMedia(value);
  if (!media?.url) return null;

  return media.url.startsWith("http") ? media.url : `${STRAPI_URL}${media.url}`;
}

// Strapi "blocks" fields are arrays of paragraph nodes; plain text fields come
// through as-is. Both end up as one readable string.
export function richTextToPlain(value, fallback = "") {
  if (Array.isArray(value)) {
    const text = value
      .map((block) =>
        (block.children || []).map((child) => child.text || "").join("")
      )
      .join("\n")
      .trim();

    return text || fallback;
  }

  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

// The CMS stores colours in a JSON field, and they have been entered both ways
// — ["#ec5a96"] and [{ name, hex }] — so accept either and always hand
// components { name, hex }. Cards were rendering blank swatches without this.
export function normalizeColors(colors) {
  if (!Array.isArray(colors)) return [];

  return colors
    .map((color) => {
      if (typeof color === "string") {
        return { name: color, hex: color };
      }

      if (color && typeof color === "object") {
        const hex = color.hex || color.value || color.color || null;
        if (!hex) return null;
        return { name: color.name || hex, hex };
      }

      return null;
    })
    .filter(Boolean);
}

// "en-US" rather than the runtime default: the grouping has to match between
// the server render and the browser or React reports a hydration mismatch.
export function formatPrice(value) {
  const amount = Number(value);
  return `Rs. ${(Number.isFinite(amount) ? amount : 0).toLocaleString("en-US")}`;
}

export function discountPercent(price, originalPrice) {
  const now = Number(price);
  const was = Number(originalPrice);

  if (!Number.isFinite(now) || !Number.isFinite(was) || was <= now) return 0;

  return Math.round(((was - now) / was) * 100);
}

export function normalizeCategory(raw) {
  if (!raw) return null;

  return {
    id: raw.documentId || raw.id,
    documentId: raw.documentId,
    name: raw.name || "",
    slug: raw.slug || "",
    description: richTextToPlain(raw.description),
    iconUrl: mediaUrl(raw.icon),
    displayOrder: raw.displayOrder ?? 0,
    productCount: Array.isArray(raw.products) ? raw.products.length : null,
  };
}

export function normalizeProduct(raw) {
  if (!raw) return null;

  const images = (Array.isArray(raw.images) ? raw.images : [raw.images])
    .filter(Boolean)
    .map((image) => ({
      url: mediaUrl(image),
      alt: image.alternativeText || raw.name || "",
    }))
    .filter((image) => image.url);

  const price = Number(raw.price) || 0;
  const originalPrice = Number(raw.originalprice) || 0;

  // Populated reviews are unfiltered, so apply the same moderation gate the
  // reviews endpoint uses — an unapproved review must not move the rating.
  const reviews = Array.isArray(raw.reviews)
    ? raw.reviews.filter((review) => review.isApproved === true)
    : [];

  const ratingTotal = reviews.reduce(
    (sum, review) => sum + (Number(review.rating) || 0),
    0
  );

  const stock =
    raw.stock === null || raw.stock === undefined ? null : Number(raw.stock);

  return {
    id: raw.documentId || raw.id,
    documentId: raw.documentId,
    name: raw.name || "",
    slug: raw.slug || "",
    brand: raw.brand || "",
    price,
    originalPrice,
    discount: discountPercent(price, originalPrice),
    description: richTextToPlain(raw.description),
    images,
    image: images[0] || null,
    colors: normalizeColors(raw.colors),
    stock,
    // No stock number set at all means "not tracked", not "sold out".
    inStock: stock === null ? true : stock > 0,
    isPromoted: raw.isPromoted === true,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    category: raw.category
      ? { name: raw.category.name, slug: raw.category.slug }
      : null,
    reviewCount: reviews.length,
    rating: reviews.length
      ? Math.round((ratingTotal / reviews.length) * 10) / 10
      : null,
  };
}

export function normalizeBundle(raw) {
  if (!raw) return null;

  const originalPrice = Number(raw.originalPrice) || 0;
  const bundlePrice = Number(raw.bundlePrice) || 0;

  return {
    id: raw.documentId || raw.id,
    documentId: raw.documentId,
    name: raw.name || "",
    slug: raw.slug || "",
    description: richTextToPlain(raw.description),
    imageUrl: mediaUrl(raw.image),
    originalPrice,
    bundlePrice,
    savings: discountPercent(bundlePrice, originalPrice),
    displayOrder: raw.displayOrder ?? 0,
    products: (Array.isArray(raw.products) ? raw.products : [])
      .map(normalizeProduct)
      .filter(Boolean),
  };
}

export function normalizeBanner(raw) {
  if (!raw) return null;

  return {
    id: raw.documentId || raw.id,
    heading: raw.title || "",
    sub: raw.subtitle || "",
    link: raw.link || "",
    imageUrl: mediaUrl(raw.image),
    displayOrder: raw.displayOrder ?? 0,
  };
}

export function normalizeReview(raw) {
  if (!raw) return null;

  return {
    id: raw.documentId || raw.id,
    name: raw.name || "AM customer",
    rating: Math.max(0, Math.min(5, Number(raw.rating) || 0)),
    comment: richTextToPlain(raw.comment),
    city: raw.city || "",
    isFeatured: raw.isFeatured === true,
    createdAt: raw.createdAt || null,
    product: raw.product
      ? { name: raw.product.name, slug: raw.product.slug }
      : null,
  };
}

// The fallbacks are the copy the site shipped with, so an empty or unreachable
// CMS still renders a complete page instead of blanks.
export const SITE_SETTINGS_FALLBACK = {
  companyName: "Accessories Mart",
  tagline: "hamare yahan kafi kuch milta hai — since 1950",
  whatsappNumber: "923001234567",
  phoneNumber: "+92 300 1234567",
  landlineNumber: "042 111 789 456",
  email: "",
  addressLine: "Urdu Bazaar, Lahore, Pakistan",
  openingHours: "Mon – Sat, 10:00 AM – 9:00 PM",
  closedDays: "Closed on Sunday",
  announcementText: "Free shipping on orders above Rs. 1500",
  freeShippingThreshold: 1500,
  trustBadgeText: "Your information is secure",
  deliveryNote:
    "Delivery charges are agreed on WhatsApp before the order is completed.",
  instagramUrl: "",
  facebookUrl: "",
  tiktokUrl: "",
  logoUrl: "",
};

export function normalizeSiteSettings(raw) {
  if (!raw) return { ...SITE_SETTINGS_FALLBACK };

  const pick = (value, key) =>
    value === null || value === undefined || value === ""
      ? SITE_SETTINGS_FALLBACK[key]
      : value;

  return {
    companyName: pick(raw.companyName, "companyName"),
    tagline: pick(raw.tagline, "tagline"),
    whatsappNumber: pick(raw.whatsappNumber, "whatsappNumber"),
    phoneNumber: pick(raw.phoneNumber, "phoneNumber"),
    landlineNumber: pick(raw.landlineNumber, "landlineNumber"),
    email: pick(raw.email, "email"),
    addressLine: pick(raw.addressLine, "addressLine"),
    openingHours: pick(raw.openingHours, "openingHours"),
    closedDays: pick(raw.closedDays, "closedDays"),
    announcementText: pick(raw.announcementText, "announcementText"),
    freeShippingThreshold:
      Number(pick(raw.freeShippingThreshold, "freeShippingThreshold")) || 0,
    trustBadgeText: pick(raw.trustBadgeText, "trustBadgeText"),
    deliveryNote: pick(raw.deliveryNote, "deliveryNote"),
    instagramUrl: pick(raw.instagramUrl, "instagramUrl"),
    facebookUrl: pick(raw.facebookUrl, "facebookUrl"),
    tiktokUrl: pick(raw.tiktokUrl, "tiktokUrl"),
    logoUrl: mediaUrl(raw.logo) || SITE_SETTINGS_FALLBACK.logoUrl,
  };
}
