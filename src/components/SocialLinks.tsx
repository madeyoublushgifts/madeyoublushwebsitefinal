import { Instagram } from "lucide-react";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { instagram, tiktok } from "@/lib/social";

const linkClass =
  "text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 text-sm";

type SocialLinksProps = {
  className?: string;
};

const SocialLinks = ({ className }: SocialLinksProps) => (
  <div className={`flex flex-wrap items-center gap-4 ${className ?? ""}`}>
    <a
      href={instagram.url}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClass}
      aria-label={`Made You Blush on Instagram ${instagram.handle}`}
    >
      <Instagram className="h-5 w-5 shrink-0" />
      <span className="underline-offset-4 hover:underline">{instagram.handle}</span>
    </a>
    <a
      href={tiktok.url}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClass}
      aria-label={`Made You Blush on TikTok ${tiktok.handle}`}
    >
      <TikTokIcon className="h-5 w-5 shrink-0" />
      <span className="underline-offset-4 hover:underline">{tiktok.handle}</span>
    </a>
  </div>
);

export default SocialLinks;
