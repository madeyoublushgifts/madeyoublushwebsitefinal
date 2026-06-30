import { Link } from "react-router-dom";
import logoImage from "@/assets/logo-made-you-blush.png";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  variant?: "header" | "footer" | "hero";
};

const imgBase = "brand-logo-img block max-w-full object-contain object-left";

const BrandLogo = ({ className, imageClassName, variant = "header" }: BrandLogoProps) => {
  if (variant === "hero") {
    return (
      <img
        src={logoImage}
        alt="Made You Blush"
        width={756}
        height={388}
        decoding="async"
        className={cn(
          imgBase,
          "w-full h-auto object-center lg:object-left",
          imageClassName,
          className
        )}
      />
    );
  }

  return (
    <Link
      to="/"
      className={cn(
        "inline-flex shrink-0 items-center justify-start leading-none",
        variant === "header" && "h-full py-1",
        className
      )}
    >
      <img
        src={logoImage}
        alt="Made You Blush"
        width={756}
        height={388}
        decoding="async"
        className={cn(
          imgBase,
          variant === "header"
            ? "h-full w-auto max-h-[3.25rem] sm:max-h-[3.75rem] md:max-h-[4.25rem] lg:max-h-[4.75rem]"
            : "h-10 sm:h-11 w-auto",
          imageClassName
        )}
      />
    </Link>
  );
};

export default BrandLogo;
