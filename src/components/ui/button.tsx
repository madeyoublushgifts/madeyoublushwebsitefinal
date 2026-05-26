import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.96] active:duration-75 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 select-none relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:pointer-events-none before:-z-10 before:opacity-0 before:bg-[radial-gradient(circle_at_15%_30%,rgba(236,72,153,0.42)_0%,transparent_55%),radial-gradient(circle_at_85%_20%,rgba(34,197,94,0.28)_0%,transparent_50%),radial-gradient(circle_at_60%_80%,rgba(168,85,247,0.26)_0%,transparent_55%)] before:transition-opacity before:duration-200 hover:before:opacity-100 hover:before:animate-sparkle active:before:opacity-60",
  {
    variants: {
      variant: {
        default:
          "rounded-full bg-primary text-primary-foreground shadow-soft hover:bg-[hsl(var(--primary-hover))] hover:shadow-bloom hover:-translate-y-0.5 active:translate-y-0 active:bg-[hsl(340_62%_68%)] active:shadow-inner",
        destructive:
          "rounded-full bg-destructive text-destructive-foreground shadow-soft hover:bg-destructive/90 hover:-translate-y-0.5 active:translate-y-0 active:bg-destructive/80",
        outline:
          "rounded-full border-2 border-primary/45 bg-background text-foreground shadow-sm hover:bg-primary/12 hover:border-primary hover:text-primary hover:-translate-y-0.5 active:translate-y-0 active:bg-primary/22 active:border-primary",
        secondary:
          "rounded-full bg-secondary text-secondary-foreground shadow-soft hover:bg-[hsl(var(--secondary-hover))] hover:-translate-y-0.5 active:translate-y-0 active:bg-secondary/90",
        ghost:
          "rounded-full hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        link: "text-primary underline-offset-4 hover:underline rounded-none active:scale-100",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
