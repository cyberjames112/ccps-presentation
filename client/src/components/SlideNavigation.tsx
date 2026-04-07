import { SLIDE_TITLES } from "@/lib/slideData";
import { motion } from "framer-motion";

const DARK_SLIDES = new Set([4, 8]);

interface SlideNavigationProps {
  currentSlide: number;
  onNavigate: (index: number) => void;
  totalSlides: number;
}

export function SlideNavigation({
  currentSlide,
  onNavigate,
  totalSlides,
}: SlideNavigationProps) {
  const isDark = DARK_SLIDES.has(currentSlide);

  return (
    <nav className="fixed right-2 md:right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-1.5 md:gap-2">
      {Array.from({ length: totalSlides }).map((_, i) => (
        <button
          key={i}
          onClick={() => onNavigate(i)}
          className="group flex items-center gap-2 md:gap-3 py-0.5 md:py-1"
          aria-label={`前往第 ${i + 1} 頁: ${SLIDE_TITLES[i]}`}
        >
          {/* Text label: hidden on mobile, show on hover on desktop */}
          <span
            className={`text-xs font-medium transition-all duration-300 whitespace-nowrap hidden md:inline-block max-w-0 overflow-hidden group-hover:max-w-[200px] ${
              currentSlide === i
                ? isDark
                  ? "text-[#d4a843]"
                  : "text-[#1a8a7d]"
                : isDark
                ? "text-gray-300"
                : "text-gray-400"
            }`}
          >
            {SLIDE_TITLES[i]}
          </span>
          <motion.div
            className={`rounded-full transition-all duration-300 ${
              currentSlide === i
                ? isDark
                  ? "w-2.5 h-2.5 md:w-3 md:h-3 bg-[#d4a843] shadow-[0_0_8px_rgba(212,168,67,0.5)]"
                  : "w-2.5 h-2.5 md:w-3 md:h-3 bg-[#1a8a7d] shadow-[0_0_8px_rgba(26,138,125,0.5)]"
                : isDark
                ? "w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 group-hover:bg-[#d4a843]"
                : "w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-300 group-hover:bg-[#d4a843]"
            }`}
            layoutId={currentSlide === i ? "activeDot" : undefined}
          />
        </button>
      ))}
    </nav>
  );
}
