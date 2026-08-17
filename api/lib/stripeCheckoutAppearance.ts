import type Stripe from "stripe";

/** Matches the Made You Blush live Stripe brand settings (blush mauve + Lora). */
export const CHECKOUT_BRANDING: Stripe.Checkout.SessionCreateParams.BrandingSettings = {
  background_color: "#ffffff",
  border_style: "rounded",
  button_color: "#BF5A75",
  display_name: "Made You Blush",
  font_family: "lora",
};

export function checkoutDeliveryNote(deliveryDate: string): Stripe.Checkout.SessionCreateParams.CustomText {
  return {
    submit: {
      message: `Delivery is scheduled for ${deliveryDate}.`,
    },
  };
}
