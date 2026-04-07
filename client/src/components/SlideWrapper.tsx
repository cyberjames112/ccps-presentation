import { useInView } from "@/hooks/useInView";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SlideWrapperProps {
  children: ReactNode;
  className?: string;
  id: string;
  bgImage?: string;
  bgOverlay?: string;
}

export function SlideWrapper({
  children,
  className = "",
  id,
  bgImage,
  bgOverlay,
}: SlideWrapperProps) {
  const { ref, isInView } = useInView(0.2);

  return (
    <section
      id={id}
      ref={ref}
      className={`relative min-h-screen w-full flex items-center justify-center overflow-hidden ${className}`}
    >
      {bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}
      {bgOverlay && (
        <div className={`absolute inset-0 ${bgOverlay}`} />
      )}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full"
      >
        {children}
      </motion.div>
    </section>
  );
}
