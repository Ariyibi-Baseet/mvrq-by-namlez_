import React, { useEffect, useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { ProductProvider, useProducts } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TopBanner } from "./components/layout/TopBanner";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { CartDrawer } from "./components/layout/CartDrawer";
import { CheckoutModal } from "./components/layout/CheckoutModal";
import { WhatsAppFloat } from "./components/layout/WhatsAppFloat";
import { Preloader } from "./components/layout/Preloader";
import { Hero } from "./components/home/Hero";
import { CollectionGrid } from "./components/home/CollectionGrid";
import { Philosophy } from "./components/home/Philosophy";
import { ProductDetailPage } from "./components/product/ProductDetailPage";
import { AboutPage } from "./components/pages/AboutPage";
import { SizingPage } from "./components/pages/SizingPage";
import { ReturnsPage } from "./components/pages/ReturnsPage";
import { ContactPage } from "./components/pages/ContactPage";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AdminLogin } from "./components/admin/AdminLogin";

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("shop");
  const { isAdminAuthenticated, authLoading } = useAuth();
  const {
    activeProductModal,
    setActiveProductModal,
    loading: productsLoading,
  } = useProducts();

  // Preloader stays up until we know whether someone is signed in AND the
  // first product fetch has resolved, so nothing empty or half-loaded flashes.
  const [appReady, setAppReady] = useState(false);
  useEffect(() => {
    if (!authLoading && !productsLoading) setAppReady(true);
  }, [authLoading, productsLoading]);

  const handleExploreClick = () => {
    setActiveTab("shop");
    setActiveProductModal(null);
    const el = document.getElementById("products");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavTab = (tab: string) => {
    setActiveProductModal(null);
    setActiveTab(tab);
  };

  return (
    <>
      <Preloader ready={appReady} />

      <div className="min-h-screen flex flex-col justify-between selection:bg-electric-500 selection:text-white relative">
        <TopBanner />
        <Navbar activeTab={activeTab} setActiveTab={handleNavTab} />

        <main className="flex-1">
          {isAdminAuthenticated ? (
            <AdminDashboard />
          ) : activeProductModal ? (
            /* Render Full Dedicated Product Detail Page matching mvrq-rs8c56.app.builtwithrocket.new/product-detail */
            <ProductDetailPage
              product={activeProductModal}
              onBackToShop={() => setActiveProductModal(null)}
              onOpenSizeGuide={() => {
                setActiveProductModal(null);
                setActiveTab("sizing");
              }}
            />
          ) : (
            <>
              {activeTab === "shop" && (
                <>
                  <Hero onExploreClick={handleExploreClick} />
                  <CollectionGrid />
                  <Philosophy />
                </>
              )}

              {activeTab === "about" && <AboutPage />}
              {activeTab === "sizing" && <SizingPage />}
              {activeTab === "returns" && <ReturnsPage />}
              {activeTab === "contact" && <ContactPage />}
            </>
          )}
        </main>

        <Footer setActiveTab={handleNavTab} />
        <WhatsAppFloat />

        {/* Overlays & Modals */}
        <CartDrawer />
        <CheckoutModal />
        <AdminLogin />
      </div>
    </>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <ProductProvider>
        <CartProvider>
          <AuthProvider>
            <MainContent />
          </AuthProvider>
        </CartProvider>
      </ProductProvider>
    </ThemeProvider>
  );
}

export default App;
