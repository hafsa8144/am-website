import { Baloo_2, Nunito } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import { SiteProvider } from "@/lib/settings-context";
import { getCategories, getSiteSettings } from "@/lib/api";
import "./globals.css";
import SplashScreen from "@/components/SplashScreen";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-baloo",
});
const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--font-nunito" });

// Title and description follow the CMS, so renaming the shop in Strapi renames
// it in the browser tab too.
export async function generateMetadata() {
  const settings = await getSiteSettings();

  return {
    title: {
      default: settings.companyName,
      template: `%s | ${settings.companyName}`,
    },
    description: settings.tagline,
  };
}

export default async function RootLayout({ children }) {
  // Fetched once for the whole app: the header nav, footer links and every
  // WhatsApp button read these from context.
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getCategories(),
  ]);

  return (
    <html lang="en" className={`${baloo.variable} ${nunito.variable}`}>
      <body className="font-sans text-ink">
        <SiteProvider settings={settings} categories={categories}>
          <CartProvider>
            <SplashScreen />

            {/* the two rule-lines that frame every page, per the brand brief */}
            <span className="am-margin-l" aria-hidden="true" />
            <span className="am-margin-r" aria-hidden="true" />

            <div id="am-root">{children}</div>
          </CartProvider>
        </SiteProvider>
      </body>
    </html>
  );
}
