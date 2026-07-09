import { Link } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";
import SocialLinks from "@/components/SocialLinks";
import { googleBusiness } from "@/lib/seo";

const footerLinkClass =
  "inline-flex items-center min-h-11 py-1.5 text-muted-foreground hover:text-primary transition-colors text-sm";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand + Social Media */}
          <div className="space-y-4">
            <BrandLogo variant="footer" />
            <p className="text-muted-foreground text-sm leading-relaxed">
              Toronto florist for affordable hand-tied bouquets, custom flower gifts, floral
              subscriptions, pop-ups across the GTA, and personalized notes.
            </p>
            <SocialLinks className="pt-2" />
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-medium">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <Link to="/shop" className={footerLinkClass}>
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/create-bouquet" className={footerLinkClass}>
                  Build a Bouquet
                </Link>
              </li>
              <li>
                <Link to="/subscription" className={footerLinkClass}>
                  Floral Subscription
                </Link>
              </li>
              <li>
                <Link to="/coming-soon" className={footerLinkClass}>
                  Coming Soon
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-medium">Contact</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Toronto, ON</p>
              <p>Pop-ups & markets across Toronto</p>
              <p>
                <a
                  href={googleBusiness.shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${footerLinkClass} break-words`}
                >
                  Find us on Google
                </a>
              </p>
              <p>
                <a href="tel:+16475508476" className={footerLinkClass}>
                  +1 647-550-8476
                </a>
              </p>
              <p>
                <a
                  href="mailto:madeyoublushgifts@gmail.com"
                  className={`${footerLinkClass} break-all`}
                >
                  madeyoublushgifts@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2026 Made You Blush. All rights reserved. Made with 💝 in Toronto.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
