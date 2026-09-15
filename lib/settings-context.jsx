"use client";

import { createContext, useContext, useMemo } from "react";
import { SITE_SETTINGS_FALLBACK } from "./strapi";

// Site-wide CMS data is fetched once, server-side, in app/layout.jsx and handed
// down from here — so the header, footer, WhatsApp buttons and checkout all
// read the same values without each one refetching them.
//
// It lives in a context rather than in props because the shell is rendered from
// client pages (cart, checkout) as well as server pages, and a client component
// cannot import an async server component.
const SiteContext = createContext({
  settings: SITE_SETTINGS_FALLBACK,
  categories: [],
});

export function SiteProvider({ settings, categories, children }) {
  const value = useMemo(
    () => ({
      settings: settings || SITE_SETTINGS_FALLBACK,
      categories: categories || [],
    }),
    [settings, categories]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSiteSettings() {
  return useContext(SiteContext).settings;
}

// Categories for the nav and footer, in CMS displayOrder.
export function useNavCategories() {
  return useContext(SiteContext).categories;
}
