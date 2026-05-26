import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { submitToFormspree, type FormspreeFormType } from "@/lib/formspree";
import { ClipboardCheck, Loader2 } from "lucide-react";

interface InquiryFormProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  /** Helps you filter Formspree submissions (e.g. Shop vs Build a Bouquet). */
  source?: string;
  /** Which Formspree form receives the submission (defaults to shop inquiry). */
  formType?: FormspreeFormType;
  /** Card / snail-mail add-ons only—message text for the handwritten note. */
  showPersonalMessage?: boolean;
}

const InquiryForm = ({
  isOpen,
  onClose,
  title = "Inquiry Form",
  description = "We’ll reply with Made You Blush availability, pickup or delivery options, and any personalization ideas.",
  itemName,
  source = "Website",
  formType = "inquiry",
  showPersonalMessage = false,
}: InquiryFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    isGift: false,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitToFormspree(formType, {
        _subject: itemName
          ? `Inquiry: ${itemName}`
          : "Made You Blush — product inquiry",
        _replyto: formData.email,
        source,
        item: itemName ?? "",
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        isGift: formData.isGift,
        personalMessage: showPersonalMessage ? formData.message : "",
      });

      toast({
        title: "Thank you for your inquiry!",
        description: "We'll reach out to you soon to discuss your order.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        isGift: false,
        message: "",
      });
      onClose();
    } catch (err) {
      toast({
        title: "Could not send inquiry",
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[22rem] p-0 gap-0 overflow-hidden flex flex-col max-h-[min(92dvh,calc(100%-1rem))] sm:max-h-[min(88dvh,36rem)]">
        <DialogHeader className="shrink-0 px-4 pt-4 pb-2 sm:px-5 sm:pt-5 space-y-1">
          <DialogTitle className="font-heading text-base sm:text-lg">{title}</DialogTitle>
          <DialogDescription className="text-xs leading-snug">{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
          <div className="overflow-y-auto flex-1 px-4 sm:px-5 space-y-2.5 pb-2">
            {itemName && (
              <div className="text-xs text-muted-foreground bg-muted/80 p-2 rounded-md max-h-16 overflow-y-auto leading-snug">
                <strong>Item:</strong> {itemName}
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="inq-name" className="text-xs">
                Full Name *
              </Label>
              <Input
                id="inq-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                disabled={isSubmitting}
                placeholder="Your full name"
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="inq-email" className="text-xs">
                Email *
              </Label>
              <Input
                id="inq-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                disabled={isSubmitting}
                placeholder="your.email@example.com"
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="inq-phone" className="text-xs">
                Phone Number *
              </Label>
              <Input
                id="inq-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
                disabled={isSubmitting}
                placeholder="(555) 123-4567"
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="inq-address" className="text-xs">
                Delivery Address *
              </Label>
              <Textarea
                id="inq-address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                required
                disabled={isSubmitting}
                placeholder="Street, city, postal code"
                rows={2}
                className="text-sm min-h-[3.5rem] resize-none"
              />
            </div>

            <div className="flex items-center space-x-2 py-0.5">
              <Checkbox
                id="inq-isGift"
                checked={formData.isGift}
                disabled={isSubmitting}
                onCheckedChange={(checked) =>
                  handleInputChange("isGift", checked as boolean)
                }
              />
              <Label htmlFor="inq-isGift" className="text-xs font-normal">
                Make it a gift
              </Label>
            </div>

            {showPersonalMessage && (
              <div className="space-y-1">
                <Label htmlFor="inq-message" className="text-xs">
                  Card message
                </Label>
                <Textarea
                  id="inq-message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  disabled={isSubmitting}
                  placeholder="What should we write on your card?"
                  rows={2}
                  className="text-sm min-h-[3.5rem] resize-none"
                />
              </div>
            )}
          </div>

          <div className="shrink-0 flex gap-2 border-t border-border bg-background px-4 py-3 sm:px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <ClipboardCheck className="mr-1.5 h-3.5 w-3.5" />
                  Inquire / Pre-order
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InquiryForm;
