/** Shared loading state while cart/checkout pages verify session storage. */
const PageLoading = () => (
  <div className="min-h-[50vh] flex items-center justify-center bg-background" aria-hidden="true">
    <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
  </div>
);

export default PageLoading;
