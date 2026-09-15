# AM (Accessories Mart) — Storefront

Next.js 14 (App Router) storefront for Accessories Mart, with Strapi 5 + PostgreSQL as the CMS
and order store.

## Setup

```bash
npm install
npm run dev
```

The Strapi backend must be running too (`npm run develop` in the backend repo, default
`http://localhost:1337`). Point the site at it with `.env.local`:

```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

Open http://localhost:3000.

## Where the content comes from

Everything on the site is CMS-driven. Nothing in `lib/data.js` is catalogue content any more.

| Strapi type   | Drives                                                                     |
| ------------- | -------------------------------------------------------------------------- |
| `product`     | Shop, category pages, search, under-500, bundles, product pages             |
| `category`    | Category grid, header nav, footer links, shop filter, breadcrumbs           |
| `bundle`      | Deals page, bundle detail pages, home deals row                             |
| `banner`      | Home hero carousel (falls back to `FALLBACK_BANNERS` when none are active)  |
| `review`      | Home testimonials, per-product reviews and star ratings                     |
| `siteSetting` | Shop name, tagline, logo, announcement ticker, hours, phone numbers, socials, WhatsApp number, free-shipping threshold, delivery note |
| `order`       | Checkout writes here; confirmation pages read back through a lookup token   |

Site settings and categories are fetched once per request in `app/layout.jsx` and shared through
`lib/settings-context.jsx` (`useSiteSettings()`, `useNavCategories()`), so the header, footer and
every WhatsApp button read the same values.

## The data layer

- **`lib/strapi.js`** — the Strapi base URL, `mediaUrl()`, rich-text → plain text, colour
  normalisation (the CMS stores colours both as `"#ec5a96"` and `{ name, hex }`), price
  formatting, and a normaliser per content type. Components never parse CMS shapes themselves.
- **`lib/api.js`** — every CMS call. Read calls return ready-to-render data and fall back to an
  empty result if Strapi is unreachable, so a backend outage degrades one section instead of
  taking a page down. Writes (`createOrder`) throw, so checkout can show a real error.
- **`lib/cart-context.jsx`** — cart in `localStorage`, synced across tabs. A line is
  product + colour, so two colours of one product are two lines. Bundles are stored as a single
  line at the bundle price (`type: "bundle"`).
- **`lib/orders.js`** — order numbers, lookup tokens, and the per-device order history behind
  `/orders`.
- **`lib/whatsapp.js`** — every WhatsApp link. `wa.me` opens the chat with the message
  pre-filled but **unsent**; the customer taps send.

## Ordering flow

1. Cart → `/checkout`, which validates the WhatsApp number and posts the order to Strapi with a
   random `orderToken`.
2. The token and order snapshot are saved in `localStorage`; the cart is cleared.
3. `/order/<number>` shows the confirmation and a **Send order on WhatsApp** button whose message
   contains the order number, items, subtotal and delivery address.
4. Opening that message flips `whatsappConfirmed` on the order in Strapi, so the shop can see in
   the admin which orders actually arrived.

Reopening `/order/<number>` later reads the order back from Strapi using the stored token.

## Backend notes

The Strapi side carries the matching changes: a bootstrap (`src/index.js`) that grants the public
role read access to products, categories, bundles, banners, reviews and site settings — and
**revokes** public `find`/`findOne` on orders, which was exposing every customer's name, phone and
address. Orders are read back only through the token-guarded routes in
`src/api/order/routes/01-order-lookup.js`.

Reviews link to a product (`review.product`); a review with no product still shows as a general
testimonial on the home page. Only reviews with `isApproved` set are ever fetched.

## Design notes

- **Colors, fonts, radii, shadows** are Tailwind theme tokens in `tailwind.config.js` — change the
  palette there, not in individual components.
- **The two red margin lines and paper texture** live in `globals.css` / `app/layout.jsx`, so every
  page inherits them.
- `components/PageShell.jsx` is the shell every page renders through (header, footer, back-to-top,
  WhatsApp button). `components/ProductGrid.jsx` is the single product grid used by every listing.
