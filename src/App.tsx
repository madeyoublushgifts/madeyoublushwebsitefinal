import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import DemoBanner from "./components/DemoBanner";
import Seo from "./components/Seo";
import { CartProvider } from "./context/CartContext";
import { isIndexablePath } from "./lib/seo";
import Index from "./pages/Index";

const Shop = lazy(() => import("./pages/Shop"));
const CreateBouquet = lazy(() => import("./pages/CreateBouquet"));
const Contact = lazy(() => import("./pages/Contact"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));
const Events = lazy(() => import("./pages/Events"));
const PopUps = lazy(() => import("./pages/PopUps"));
const Subscription = lazy(() => import("./pages/Subscription"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const SubscriptionBuildBouquet = lazy(() => import("./pages/SubscriptionBuildBouquet"));
const EarlyAccessGiveaway = lazy(() => import("./pages/EarlyAccessGiveaway"));
const EarlyAccessBuildBouquet = lazy(() => import("./pages/EarlyAccessBuildBouquet"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const CheckoutCancel = lazy(() => import("./pages/CheckoutCancel"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AppSeo = () => {
  const { pathname } = useLocation();
  // Early-access, cart, checkout, build-bouquet tools, 404 → noindex, nofollow
  const noindex = !isIndexablePath(pathname);
  return <Seo noindex={noindex} />;
};

const PageFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background px-6" role="status" aria-live="polite">
    <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" aria-hidden="true" />
    <p className="font-heading text-lg text-foreground">Loading Made You Blush…</p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CartProvider>
        <BrowserRouter>
          <DemoBanner />
          <ScrollToTop />
          <AppSeo />
          <Suspense fallback={<PageFallback />}>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<Navigate to="/" replace />} />
            <Route path="/explore" element={<Navigate to="/" replace />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/create-bouquet" element={<CreateBouquet />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/events" element={<Events />} />
            <Route path="/pop-ups" element={<PopUps />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/subscription/build-bouquet" element={<SubscriptionBuildBouquet />} />
            <Route path="/early-access/monthly-mini" element={<EarlyAccessGiveaway />} />
            <Route path="/early-access/monthly-mini/build" element={<EarlyAccessBuildBouquet />} />
            <Route path="/subscribe" element={<Navigate to="/subscription" replace />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/checkout/cancel" element={<CheckoutCancel />} />
            <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
