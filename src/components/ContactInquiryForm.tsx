import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { submitToFormbricksContact } from "@/lib/formbricks";
import { Loader2, Mail } from "lucide-react";

export type ContactInquiryFormProps = {
  /** Formbricks `source` value for filtering submissions. */
  source: string;
  /** Prefill / fallback subject sent to Formbricks. */
  defaultSubject: string;
  /** Optional interest field label (maps into subject when filled). */
  interestLabel?: string;
  interestPlaceholder?: string;
  messagePlaceholder?: string;
  submitLabel?: string;
  idPrefix?: string;
};

const ContactInquiryForm = ({
  source,
  defaultSubject,
  interestLabel,
  interestPlaceholder,
  messagePlaceholder = "Share dates, neighbourhood, vibe, and anything else we should know…",
  submitLabel = "Send inquiry",
  idPrefix = "inquire",
}: ContactInquiryFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interest: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const subject = formData.interest.trim()
      ? `${defaultSubject}: ${formData.interest.trim()}`
      : defaultSubject;

    try {
      await submitToFormbricksContact({
        name: formData.name,
        email: formData.email,
        subject,
        message: formData.message,
        source,
      });

      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });

      setFormData({ name: "", email: "", interest: "", message: "" });
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

  return (
    <Card className="border-0 shadow-elegant bg-card-gradient">
      <CardContent className="p-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-name`}>Full Name *</Label>
            <Input
              id={`${idPrefix}-name`}
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="Your full name"
              autoComplete="name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-email`}>Email Address *</Label>
            <Input
              id={`${idPrefix}-email`}
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="your.email@example.com"
              autoComplete="email"
            />
          </div>

          {interestLabel && (
            <div className="space-y-2">
              <Label htmlFor={`${idPrefix}-interest`}>{interestLabel}</Label>
              <Input
                id={`${idPrefix}-interest`}
                value={formData.interest}
                onChange={(e) => handleChange("interest", e.target.value)}
                disabled={isSubmitting}
                placeholder={interestPlaceholder}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-message`}>Message *</Label>
            <Textarea
              id={`${idPrefix}-message`}
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              required
              disabled={isSubmitting}
              placeholder={messagePlaceholder}
              rows={4}
              className="min-h-[5.5rem] resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full min-h-12"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Mail className="mr-2 h-5 w-5" />
                {submitLabel}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactInquiryForm;
