import { useState } from "react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import FloralDivider from "@/components/FloralDivider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { submitToFormbricksContact } from "@/lib/formbricks";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { instagram, tiktok } from "@/lib/social";
import { googleBusiness } from "@/lib/seo";

const Contact = () => {
  // ---------------------------
  // Local form state management
  // ---------------------------
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitToFormbricksContact({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        source: "Contact page",
      });

      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (err) {
      toast({
        title: "Could not send message",
        description:
          err instanceof Error
            ? err.message
            : "Please try again or email madeyoublushgifts@gmail.com.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* ================= HEADER ================= */}
      <Header />

      <main>
        {/* ================= HERO SECTION ================= */}
        <section className="py-20 lg:py-32 bg-hero">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              {/* Main heading (consistent with Home page) */}
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight animate-fade-in">
                Contact us
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Use the form below or email{" "}
                <a
                  href="mailto:madeyoublushgifts@gmail.com"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  madeyoublushgifts@gmail.com
                </a>
                —we help with bouquet orders, floral subscriptions, gift bundles, Toronto pop-ups,
                bouquet-building experiences, and event florals across the GTA. We&apos;re also open
                to partnerships and collaborations—markets, studios, brands, and community projects.
                You can also{" "}
                <a
                  href={googleBusiness.shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  find us on Google
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        <FloralDivider className="pt-8 lg:pt-10" />

        {/* ================= CONTACT SECTION ================= */}
       <section id="contact-form" className="pt-8 lg:pt-10 pb-20 bg-background scroll-mt-24">
  <div className="container mx-auto px-4 lg:px-8">
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      {/* ---------- Contact Form ---------- */}
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        {/* Section Title */}
        <div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Send Us a Message
          </h2>
          <p className="text-lg text-muted-foreground">
            Share dates, neighbourhood, palette, allergies, and budget. Ready-made
            bouquets are in the shop with cart checkout; use this form for custom
            orders, events, and anything that needs a human touch. We&apos;re open to
            partnerships and collaborations—the more context you give, the faster we
            can help.
          </p>
        </div>

        {/* Contact Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Card className="border-0 shadow-elegant bg-card-gradient">
            <CardContent className="p-5 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    disabled={isSubmitting}
                    placeholder="Your full name"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    disabled={isSubmitting}
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    required
                    disabled={isSubmitting}
                    placeholder="Bouquet tier, add-ons (cards, snail-mail notes, gifts), subscription cadence, pop-up collab, or event details…"
                    rows={4}
                    className="min-h-[5.5rem] resize-none"
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Phone className="mr-2 h-5 w-5" />
                      <Mail className="mr-2 h-5 w-5" />
                      Contact Us
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* ---------- Contact Information ---------- */}
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
      >
        {/* Section Title */}
        <div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Visit & pop-ups
          </h2>
          <p className="text-lg text-muted-foreground">
            We don’t have a permanent storefront yet—we’re Toronto-based and
            popping up around the city. See{" "}
            <Link to="/pop-ups" className="text-primary underline-offset-4 hover:underline">
              Pop-ups
            </Link>{" "}
            for upcoming dates and past markets, or{" "}
            <Link to="/events" className="text-primary underline-offset-4 hover:underline">
              Events
            </Link>{" "}
            for Bloom Bar and make-your-own bouquet experiences. Stay tuned on{" "}
            <a
              href={instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              Instagram {instagram.handle}
            </a>{" "}
            and{" "}
            <a
              href={tiktok.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              TikTok {tiktok.handle}
            </a>
            .
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="space-y-6">
          {[
            {
              icon: <MapPin className="h-6 w-6 text-primary" />,
              title: "Visit us",
              content: (
                <>
                  <p className="font-medium text-foreground">Made You Blush — Toronto, ON</p>
                  <p className="mt-2 text-sm">
                    No public shop address for now. Follow{" "}
                    <a
                      href={instagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      {instagram.handle}
                    </a>{" "}
                    on Instagram and{" "}
                    <a
                      href={tiktok.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      {tiktok.handle}
                    </a>{" "}
                    on TikTok, or visit our{" "}
                    <Link to="/pop-ups" className="text-primary underline-offset-4 hover:underline">
                      Pop-ups
                    </Link>{" "}
                    page for dates and past markets.
                  </p>
                </>
              ),
            },
            {
              icon: <Phone className="h-6 w-6 text-primary" />,
              title: "Call or text",
              content: (
                <>
                  <a
                    href="tel:+16475508476"
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                  >
                    +1 647-550-8476
                  </a>
                  <p className="text-sm mt-1">
                    Text-friendly for quick questions about same-week bouquets or add-ons.
                  </p>
                </>
              ),
            },
            {
              icon: <Mail className="h-6 w-6 text-primary" />,
              title: "Email",
              content: (
                <>
                  <a
                    href="mailto:madeyoublushgifts@gmail.com"
                    className="text-foreground hover:text-primary transition-colors break-all"
                  >
                    madeyoublushgifts@gmail.com
                  </a>
                  <p className="text-sm mt-1">
                    Best for detailed inquiries, custom builds, subscription planning, or vendor collaborations.
                  </p>
                </>
              ),
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-soft bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-3">
                    {card.icon}
                    <span>{card.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground">{card.content}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  </div>
</section>
      </main>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
};

export default Contact;
