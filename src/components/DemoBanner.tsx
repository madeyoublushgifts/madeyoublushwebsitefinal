import { isDemoMode } from "@/lib/demo";

const DemoBanner = () => {
  if (!isDemoMode) return null;

  return (
    <div
      className="demo-banner sticky top-0 z-[60] py-1.5 text-center text-xs font-medium tracking-wide text-white shadow-sm"
      role="status"
    >
      Theme demo · localhost only · logo &amp; rose palette
    </div>
  );
};

export default DemoBanner;
