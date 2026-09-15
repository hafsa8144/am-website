"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "am-cart-items";

// A cart line is identified by product + color together, not product alone —
// so different colors of the same product become separate lines, each with
// their own quantity, instead of colliding into one.
function buildCartId(product, color) {
  const colourKey = color?.hex || color?.name || color;

  return colourKey
    ? `${product.id}::${colourKey}`
    : String(product.id);
}

// Only what the cart, checkout and WhatsApp message need is stored — not the
// whole CMS record. Keeps localStorage small and the order snapshot readable
// once it reaches Strapi.
function toCartLine(product, color, qty) {
  return {
    id: buildCartId(product, color),
    productId: product.id,
    // A bundle is one cart line at its bundle price, not its products at
    // theirs — `type` is what tells the cart which page to link back to.
    type: product.type === "bundle" ? "bundle" : "product",
    slug: product.slug || "",
    name: product.name || "Selected item",
    brand: product.brand || "",
    price: Number(product.price) || 0,
    image: product.image?.url || product.images?.[0]?.url || null,
    color: color || null,
    qty,
  };
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedItems = window.localStorage.getItem(STORAGE_KEY);
      if (savedItems) setItems(JSON.parse(savedItems));
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  // Another tab changing the cart should not leave this one stale.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== STORAGE_KEY) return;

      try {
        setItems(event.newValue ? JSON.parse(event.newValue) : []);
      } catch {
        setItems([]);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const count = items.reduce((total, item) => total + item.qty, 0);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price) * item.qty, 0),
    [items]
  );

  const addItems = (qty = 1, product = null, color = null) => {
    const base = product || { id: "quick-item", name: "Selected item", price: 0 };
    const line = toCartLine(base, color, qty);

    setItems((current) => {
      const exists = current.find((item) => item.id === line.id);

      if (exists) {
        return current.map((item) =>
          item.id === line.id ? { ...item, qty: item.qty + qty } : item
        );
      }

      return [...current, line];
    });
  };

  const updateQty = (id, qty) =>
    setItems((current) =>
      qty < 1
        ? current.filter((item) => item.id !== id)
        : current.map((item) => (item.id === id ? { ...item, qty } : item))
    );

  const removeItem = (id) =>
    setItems((current) => current.filter((item) => item.id !== id));

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{
        count,
        items,
        subtotal,
        hydrated,
        addItems,
        updateQty,
        removeItem,
        clearCart,
        buildCartId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
