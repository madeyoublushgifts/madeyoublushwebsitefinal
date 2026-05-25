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
import { submitToFormspree } from "@/lib/formspree";
import { Loader2 } from "lucide-react";

interface InquiryFormProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  /** Helps you filter Formspree submissions (e.g. Shop vs Build a Bouquet). */
  source?: string;
}

const InquiryForm = ({
  isOpen,
  onClose,
  title = "Inquiry Form",
  description = "We’ll reply with Made You Blush availability, pickup or delivery options, and any personalization ideas.",
  itemName,
  source = "Website",
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
      await submitToFormspree("inquiry", {
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
        personalMessage: formData.isGift ? formData.message : "",
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {itemName && (
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              <strong>Item:</strong> {itemName}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="inq-name">Full Name *</Label>
            <Input
              id="inq-name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="Your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inq-email">Email *</Label>
            <Input
              id="inq-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="your.email@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inq-phone">Phone Number *</Label>
            <Input
              id="inq-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inq-address">Delivery Address *</Label>
            <Textarea
              id="inq-address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="Full delivery address including city and postal code"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="inq-isGift"
              checked={formData.isGift}
              disabled={isSubmitting}
              onCheckedChange={(checked) =>
                handleInputChange("isGift", checked as boolean)
              }
            />
            <Label htmlFor="inq-isGift" className="text-sm">
              Make it a gift
            </Label>
          </div>

          {formData.isGift && (
            <div className="space-y-2">
              <Label htmlFor="inq-message">Personal Message</Label>
              <Textarea
                id="inq-message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                disabled={isSubmitting}
                placeholder="Add a personal message for the recipient..."
                rows={3}
              />
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending…
                </>
              ) : (
                "Inquire / Pre-order"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InquiryForm;
