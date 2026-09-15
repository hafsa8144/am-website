import Header from "./Header";
import Footer from "./Footer";
import BackToTop from "./BackToTop";
import WhatsAppFab from "./WhatsAppFab";

// Every page renders through here. Header and Footer pull their CMS data from
// SiteProvider (app/layout.jsx), so this stays a plain component that client
// pages — cart, checkout, order — can import too.
export default function PageShell({ children }) {
  return (
    <>
      <Header />

      <main className="mx-auto max-w-[82rem] px-4 pt-7 sm:px-7 sm:pt-10">
        {children}
        <Footer />
      </main>

      <BackToTop />
      <WhatsAppFab />
    </>
  );
}
