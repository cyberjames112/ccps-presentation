import { useCallback, useEffect, useState } from "react";
import { SlideNavigation } from "@/components/SlideNavigation";
import { Slide1Cover } from "@/components/slides/Slide1Cover";
import { Slide2Risk } from "@/components/slides/Slide2Risk";
import { Slide3Malaysia } from "@/components/slides/Slide3Malaysia";
import { Slide4MM2H } from "@/components/slides/Slide4MM2H";
import { Slide5Economy } from "@/components/slides/Slide5Economy";
import { Slide6Comparison } from "@/components/slides/Slide6Comparison";
import { Slide7Service } from "@/components/slides/Slide7Service";
import { Slide8PlanB } from "@/components/slides/Slide8PlanB";
import { Slide9Tour } from "@/components/slides/Slide9Tour";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_SLIDES = 9;
const DARK_SLIDES = new Set([4, 8]);

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);

  const isDark = DARK_SLIDES.has(currentSlide);

  const navigateToSlide = useCallback((index: number) => {
    const el = document.getElementById(`slide-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const newSlide = Math.round(scrollY / windowHeight);
      setCurrentSlide(Math.min(newSlide, TOTAL_SLIDES - 1));
      if (scrollY > 100) setShowScrollHint(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        const next = Math.min(currentSlide + 1, TOTAL_SLIDES - 1);
        navigateToSlide(next);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        const prev = Math.max(currentSlide - 1, 0);
        navigateToSlide(prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, navigateToSlide]);

  return (
    <div className="relative">
      <SlideNavigation
        currentSlide={currentSlide}
        onNavigate={navigateToSlide}
        totalSlides={TOTAL_SLIDES}
      />

      {/* Page counter - smaller on mobile */}
      <div
        className={`fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50 flex items-center gap-1.5 md:gap-2 backdrop-blur-sm rounded-full px-3 py-1.5 md:px-4 md:py-2 shadow-lg transition-colors duration-500 ${
          isDark
            ? "bg-black/40 border border-white/10"
            : "bg-white/80"
        }`}
      >
        <span
          className={`text-xs md:text-sm font-bold transition-colors duration-500 ${
            isDark ? "text-[#d4a843]" : "text-[#1a8a7d]"
          }`}
        >
          {String(currentSlide + 1).padStart(2, "0")}
        </span>
        <div
          className={`w-8 md:w-12 h-0.5 rounded-full overflow-hidden transition-colors duration-500 ${
            isDark ? "bg-white/20" : "bg-gray-200"
          }`}
        >
          <motion.div
            className={`h-full rounded-full transition-colors duration-500 ${
              isDark ? "bg-[#d4a843]" : "bg-[#1a8a7d]"
            }`}
            animate={{ width: `${((currentSlide + 1) / TOTAL_SLIDES) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span
          className={`text-xs md:text-sm transition-colors duration-500 ${
            isDark ? "text-gray-400" : "text-gray-400"
          }`}
        >
          {String(TOTAL_SLIDES).padStart(2, "0")}
        </span>
      </div>

      {/* Scroll hint */}
      <AnimatePresence>
        {showScrollHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1"
          >
            <span className="text-[10px] md:text-xs text-gray-400 tracking-wider">
              SCROLL
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-[#1a8a7d]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Slide1Cover />
      <Slide2Risk />
      <Slide3Malaysia />
      <Slide4MM2H />
      <Slide5Economy />
      <Slide6Comparison />
      <Slide7Service />
      <Slide8PlanB />
      <Slide9Tour />
    </div>
  );
}
