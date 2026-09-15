// WhatsApp links.
//
// wa.me opens the chat with the message pre-filled but UNSENT — the customer
// still taps send themselves. Nothing here sends a message on anyone's behalf.

import { formatPrice } from "./strapi";

const DEFAULT_COUNTRY_CODE = "92"; // Pakistan

// Store numbers are typed into the CMS however the shop writes them
// ("+92 300 1234567", "0300-1234567"). wa.me wants bare digits with the
// country code, so normalise every one of them the same way.
export function normalizePhone(phone) {
  if (!phone) return "";

  const digits = String(phone).replace(/[^\d]/g, "");
  if (!digits) return "";

  // 03001234567 -> 923001234567
  if (digits.startsWith("0")) {
    return `${DEFAULT_COUNTRY_CODE}${digits.slice(1)}`;
  }

  // A local 10-digit number with no leading zero.
  if (digits.length === 10 && !digits.startsWith(DEFAULT_COUNTRY_CODE)) {
    return `${DEFAULT_COUNTRY_CODE}${digits}`;
  }

  return digits;
}

export function buildWhatsAppLink(phone, message) {
  const number = normalizePhone(phone);
  const base = number ? `https://wa.me/${number}` : "https://wa.me/";

  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// Colours entered in the CMS as bare hex get no readable name, so label them
// rather than dropping a raw "#ec5a96" into the middle of a sentence.
function colourLabel(color) {
  const value = color?.name || color?.hex || color || "";
  if (!value) return "";

  return /^#[0-9a-f]{3,8}$/i.test(value) ? `colour ${value}` : value;
}

function itemLines(items = []) {
  return items.map((item) => {
    const colour = colourLabel(item.color);
    const price = formatPrice(Number(item.price) * item.qty);
    const name = String(item.name || "").trim();

    return `• ${name}${colour ? ` (${colour})` : ""} × ${item.qty} — ${price}`;
  });
}

/* --------------------------------------------------- general contact links */

// The "Chat on WhatsApp" buttons in the header, footer and policy pages.
export function buildContactWhatsAppLink(phone, context = "") {
  const message = context
    ? `Hi Accessories Mart! I have a question about ${context}.`
    : "Hi Accessories Mart! I have a question.";

  return buildWhatsAppLink(phone, message);
}

// Product page — carries the product name, price and link so the shop knows
// exactly what is being asked about.
export function buildProductWhatsAppLink(phone, product, siteUrl = "") {
  const lines = [
    `Hi! I would like to ask about this item:`,
    "",
    `${product.name}${product.brand ? ` — ${product.brand}` : ""}`,
    `Price: ${formatPrice(product.price)}`,
  ];

  if (siteUrl) {
    lines.push(`Link: ${siteUrl}/product/${product.slug}`);
  }

  return buildWhatsAppLink(phone, lines.join("\n"));
}

// Bundle page.
export function buildBundleWhatsAppLink(phone, bundle) {
  const lines = [
    "Hi! I am interested in this bundle:",
    "",
    bundle.name,
    `Bundle price: ${formatPrice(bundle.bundlePrice)}`,
  ];

  if (bundle.products?.length) {
    lines.push("", "Includes:", ...bundle.products.map((p) => `• ${p.name}`));
  }

  return buildWhatsAppLink(phone, lines.join("\n"));
}

/* --------------------------------------------------------- cart / checkout */

// Cart and checkout — the basket as it stands, before an order exists.
export function buildOrderWhatsAppLink(phone, items, subtotal) {
  const message = [
    "Hi! I would like to order:",
    "",
    ...itemLines(items),
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    "",
    "Can we discuss the delivery charge?",
  ].join("\n");

  return buildWhatsAppLink(phone, message);
}

/* ------------------------------------------------------ order confirmation */

// The confirmation message: the full order, so the shop can act on it straight
// from WhatsApp without looking anything up.
export function buildOrderConfirmationMessage(order) {
  const {
    orderNumber,
    customerName,
    customerPhone,
    deliveryAddress,
    items = [],
    subtotal = 0,
  } = order;

  const lines = [
    `*New order ${orderNumber}*`,
    "",
    "*Items*",
    ...itemLines(items),
    "",
    `*Subtotal:* ${formatPrice(subtotal)}`,
    "(delivery charge to be confirmed)",
    "",
    "*Delivery details*",
    `Name: ${customerName}`,
  ];

  if (customerPhone) lines.push(`WhatsApp: ${customerPhone}`);
  if (deliveryAddress) lines.push(`Address: ${deliveryAddress}`);

  lines.push(
    "",
    "Please confirm my order and the delivery charge. Thank you!"
  );

  return lines.join("\n");
}

export function buildOrderConfirmationWhatsAppLink(phone, order) {
  return buildWhatsAppLink(phone, buildOrderConfirmationMessage(order));
}

// Used when returning to a confirmation page later — the order is already
// with the shop, so this just needs the number for reference.
export function buildFollowUpWhatsAppLink(phone, orderNumber) {
  return buildWhatsAppLink(
    phone,
    `Hi! I am following up on my order ${orderNumber}.`
  );
}
