import { SlideWrapper } from "@/components/SlideWrapper";
import { IMAGES } from "@/lib/slideData";
import { useInView } from "@/hooks/useInView";
import { PriceCountdown } from "@/components/PriceCountdown";
import { motion } from "framer-motion";
import { Plane, Hotel, Car, Utensils, Clock, Users } from "lucide-react";
import { Link } from "wouter";

const includes = [
  { icon: Plane, text: "來回機票" },
  { icon: Hotel, text: "JW 萬豪或同等五星級酒店" },
  { icon: Utensils, text: "全程餐食" },
  { icon: Car, text: "全程專車接送" },
];

export function Slide9Tour() {
  const { ref, isInView } = useInView(0.15);

  return (
    <SlideWrapper
      id="slide-8"
      bgImage={IMAGES.malaysiaKlcc}
      bgOverlay="bg-gradient-to-t from-black/85 via-black/65 to-black/45"
    >
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-10 md:py-16 min-h-screen flex flex-col justify-center" ref={ref}>
        {/* Urgency badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 md:gap-2 bg-red-600 text-white px-3 md:px-5 py-1.5 md:py-2 rounded-full font-bold text-xs md:text-sm mb-4 md:mb-6 self-start shadow-lg"
        >
          <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
          限今日 3/29 現場付款者，僅三個名額
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-2xl md:text-5xl font-black text-white leading-tight"
        >
          考察團超級限量優惠
        </motion.h2>

        {/* Price */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-4 md:mt-6 flex items-baseline gap-2 md:gap-3"
        >
          <span className="text-sm md:text-lg text-gray-300">每位</span>
          <span className="text-4xl md:text-7xl font-black text-[#d4a843]">
            <PriceCountdown
              start={50000}
              end={19900}
              isActive={isInView}
              duration={2800}
            />
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-1.5 md:mt-2 flex items-center gap-1.5 md:gap-2"
        >
          <Users className="w-4 h-4 md:w-5 md:h-5 text-[#d4a843]" />
          <span className="text-sm md:text-lg text-gray-300">
            兩人成行，含<span className="font-bold text-white">三天兩夜</span>
          </span>
        </motion.div>

        {/* Includes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-5 md:mt-8 grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4"
        >
          {includes.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 flex flex-col items-center gap-1.5 md:gap-2 border border-white/10 hover:bg-white/20 transition-colors"
            >
              <item.icon className="w-6 h-6 md:w-8 md:h-8 text-[#d4a843]" />
              <span className="text-xs md:text-sm text-white font-medium text-center leading-tight">
                {item.text}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Extra note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-3 md:mt-5 text-xs md:text-sm text-gray-400"
        >
          單人成行或四天三夜費用加 5 千
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-4 md:mt-6"
        >
          <Link href="/booking">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-[#d4a843] text-white font-black px-8 md:px-10 py-3 md:py-4 rounded-full text-lg md:text-xl shadow-2xl hover:shadow-[0_0_30px_rgba(212,168,67,0.4)] transition-shadow cursor-pointer"
            >
              Book Now
            </motion.span>
          </Link>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.3 }}
          className="mt-6 md:mt-10 pt-4 md:pt-5 border-t border-white/10 flex items-center justify-between"
        >
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663123178525/fDCYNs6656b7JMsC7bMdFf/logo_ec5529c5.png"
            alt="CCPS 家慶佳業"
            className="h-7 md:h-9 w-auto object-contain brightness-0 invert opacity-80"
            draggable={false}
          />
          <span className="text-[10px] md:text-xs text-gray-500">
            INTERNATIONAL REAL ESTATE
          </span>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
