import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import DemoBanner from "./components/DemoBanner";
import Seo from "./components/Seo";

const Index = lazy(() => import("./pages/Index"));
const Shop = lazy(() => import("./pages/Shop"));
const CreateBouquet = lazy(() => import("./pages/CreateBouquet"));
const Contact = lazy(() => import("./pages/Contact"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const CheckoutCancel = lazy(() => import("./pages/CheckoutCancel"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const INDEXABLE_ROUTES = new Set([
  "/",
  "/shop",
  "/create-bouquet",
  "/contact",
  "/coming-soon",
]);

const AppSeo = () => {
  const { pathname } = useLocation();
  const noindex =
    !INDEXABLE_ROUTES.has(pathname) ||
    pathname.startsWith("/checkout/");
  return <Seo noindex={noindex} />;
};

const PageFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center bg-background" aria-hidden="true">
    <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/checkout/cancel" element={<CheckoutCancel />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
