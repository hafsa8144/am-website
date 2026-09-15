// Local, non-CMS content.
//
// The catalogue (products, categories, bundles, banners, reviews, site
// settings) now comes from Strapi via lib/api.js. What is left here is the
// brand strip artwork that ships with the repo, plus the accent rotation and
// the hero copy used only when the CMS has no banners yet.

export const brandLogos = [
  { name: "Kum", src: "/brands/KUM.webp" },
  { name: "Monami", src: "/brands/Monami.png" },
  { name: "3M", src: "/brands/3M.svg" },
  { name: "Mungyo", src: "/brands/Mungyo.jpg" },
  { name: "DalerRowner", src: "/brands/DALERROWNEY.jpg" },
  { name: "Winsor&Newton", src: "/brands/winsor.jpg" },
  { name: "Sakura", src: "/brands/sakura.png" },
  { name: "MontMarte", src: "/brands/montmarte.png" },
  { name: "Kangaro", src: "/brands/kangaro.png" },
  { name: "Pantel", src: "/brands/pantel.webp" },
  { name: "pilot", src: "/brands/pilot.png" },
  { name: "fabercastell", src: "/brands/fabercastell.png" },
  { name: "steadler", src: "/brands/steadler.png" },
  { name: "Uhu", src: "/brands/Uhu.png" },
  { name: "parker", src: "/brands/parker.webp" },
  { name: "deli", src: "/brands/deli.png" },
  { name: "schneider", src: "/brands/schneider.png" },
  { name: "sheaffer", src: "/brands/sheaffer.webp" },
  { name: "pelikan", src: "/brands/pelikan.webp" },
];

// accent cycles through this order — mirrors the mint / sky / violet / pink
// rotation used for the reference catalog cards
export const ACCENT_CYCLE = ["mint", "sky", "violet", "pink"];

// Shown only while the CMS has no active banners, so the home page never opens
// with an empty hero. Add banners in Strapi and these disappear.
export const FALLBACK_BANNERS = [
  {
    id: "bts",
    heading: "Back to school essentials",
    sub: "Notebooks · pens · pouches — everything for the new term",
    link: "/shop",
  },
  {
    id: "art",
    heading: "Art & craft corner",
    sub: "Sketchbooks, watercolour sets, and colour by the shelf",
    link: "/categories",
  },
  {
    id: "office",
    heading: "Office desk refresh",
    sub: "Organisers, planners, and pen sets that earn their place",
    link: "/deals",
  },
];
