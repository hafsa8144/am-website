"use client";

import { createContext, useContext, useMemo } from "react";
import { SITE_SETTINGS_FALLBACK, splitAnnouncement } from "./strapi";

const SiteContext = createContext({
  settings: {
    ...SITE_SETTINGS_FALLBACK,
    announcementItems: splitAnnouncement(SITE_SETTINGS_FALLBACK.announcementText),
  },
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
