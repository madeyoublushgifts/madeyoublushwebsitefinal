import { motion } from "framer-motion";
import { Flower } from "lucide-react";
import { cn } from "@/lib/utils";

type FloralDividerProps = {
  className?: string;
  animate?: boolean;
};

const FloralDivider = ({ className, animate = true }: FloralDividerProps) => {
  const line = (
    <div
      className="flex w-full max-w-lg mx-auto items-center gap-3 px-4"
      aria-hidden="true"
    >
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-primary/45" />
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary/35 bg-background/90 shadow-sm">
        <Flower className="h-4 w-4 text-primary" />
      </div>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/30 to-primary/45" />
    </div>
  );

  if (!animate) {
    return (
      <div className={cn("flex flex-col items-center", className)}>{line}</div>
    );
  }

  return (
    <motion.div
      className={cn("flex flex-col items-center", className)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.4 }}
    >
      {line}
    </motion.div>
  );
};

export default FloralDivider;
