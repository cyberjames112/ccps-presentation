import { SlideWrapper } from "@/components/SlideWrapper";
import { CcpsLogo } from "@/components/CcpsLogo";
import { IMAGES } from "@/lib/slideData";
import { motion } from "framer-motion";

export function Slide1Cover() {
  return (
    <SlideWrapper
      id="slide-0"
      bgImage={IMAGES.heroBg}
      bgOverlay="bg-white/60"
    >
      <div className="flex flex-col items-center justify-center min-h-screen px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex flex-col items-center"
        >
          <CcpsLogo size="xl" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-3 md:mt-4 text-sm md:text-xl tracking-[0.2em] md:tracking-[0.3em] text-gray-500 font-light"
          >
            INTERNATIONAL REAL ESTATE
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-10 md:mt-16 text-center"
        >
          <p className="text-base md:text-lg text-gray-600 font-medium px-4">
            台灣高資產醫師的專屬海外資產配置策略
          </p>
          <div className="mt-4 md:mt-6 w-16 md:w-20 h-0.5 bg-[#1a8a7d] mx-auto" />
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
