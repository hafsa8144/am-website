// Order numbers, lookup tokens, and the browser-side record of what this
// visitor has ordered.
//
// The order itself lives in Strapi. What stays in the browser is the token
// that lets this device read that order back — order numbers alone are
// guessable, so the API refuses to return an order without its token.

const ORDER_KEY_PREFIX = "am-order-";
const ORDER_INDEX_KEY = "am-orders";
const LAST_ORDER_KEY = "am-last-order";

export function generateOrderNumber() {
  const random = Math.floor(100000 + Math.random() * 900000); // 6 digits
  return `AM-${random}`;
}

export function generateOrderToken() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function readJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

// Stores the order three ways: by number (for its own confirmation page), in a
// short index (for the "your orders" list), and as the last order (so the
// confirmation page can render instantly without waiting on the API).
export function rememberOrder(order) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      `${ORDER_KEY_PREFIX}${order.orderNumber}`,
      JSON.stringify(order)
    );

    const index = readJSON(ORDER_INDEX_KEY, []);

    const entry = {
      orderNumber: order.orderNumber,
      token: order.token,
      subtotal: order.subtotal,
      itemCount: (order.items || []).reduce((sum, item) => sum + item.qty, 0),
      placedAt: order.placedAt || Date.now(),
    };

    const next = [
      entry,
      ...index.filter((item) => item.orderNumber !== order.orderNumber),
    ].slice(0, 20);

    window.localStorage.setItem(ORDER_INDEX_KEY, JSON.stringify(next));
    window.sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch (error) {
    console.error("Could not save the order locally:", error);
  }
}

export function getRememberedOrder(orderNumber) {
  if (typeof window === "undefined" || !orderNumber) return null;

  const stored = readJSON(`${ORDER_KEY_PREFIX}${orderNumber}`, null);
  if (stored) return stored;

  // Older sessions only kept the last order, so fall back to that.
  try {
    const raw = window.sessionStorage.getItem(LAST_ORDER_KEY);
    const last = raw ? JSON.parse(raw) : null;
    return last && last.orderNumber === orderNumber ? last : null;
  } catch {
    return null;
  }
}

export function getOrderHistory() {
  if (typeof window === "undefined") return [];

  return readJSON(ORDER_INDEX_KEY, []).sort(
    (a, b) => (b.placedAt || 0) - (a.placedAt || 0)
  );
}

export function markOrderSentLocally(orderNumber) {
  if (typeof window === "undefined" || !orderNumber) return;

  const stored = getRememberedOrder(orderNumber);
  if (!stored) return;

  try {
    window.localStorage.setItem(
      `${ORDER_KEY_PREFIX}${orderNumber}`,
      JSON.stringify({ ...stored, whatsappConfirmed: true })
    );
  } catch {
    // A full or blocked localStorage is not worth failing the flow over.
  }
}
