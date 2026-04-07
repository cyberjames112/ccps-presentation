import { SlideWrapper } from "@/components/SlideWrapper";
import { CcpsLogo } from "@/components/CcpsLogo";
import { IMAGES } from "@/lib/slideData";
import { useInView } from "@/hooks/useInView";
import { motion } from "framer-motion";
import { Stethoscope, GraduationCap, Plane } from "lucide-react";

export function Slide3Malaysia() {
  const { ref, isInView } = useInView(0.15);

  return (
    <SlideWrapper id="slide-2" className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-20 min-h-screen flex flex-col justify-center" ref={ref}>
        <div className="flex justify-end mb-3 md:mb-8">
          <CcpsLogo size="sm" />
        </div>

        <motion.h2
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-xl md:text-5xl font-black text-[#1a8a7d] leading-tight"
        >
          無痛轉移：為何大馬是醫師首選的「第二家園」？
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-2 md:mt-3 text-sm md:text-lg font-bold text-[#d4a843]"
        >
          無縫接軌您的頂級生活品質，滿足菁英家庭兩大剛需
        </motion.p>

        {/* Two pillars - stack on mobile */}
        <div className="mt-6 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative bg-white rounded-xl md:rounded-2xl p-5 md:p-8 shadow-lg border-t-4 border-[#1a8a7d] hover:shadow-xl transition-shadow group"
          >
            <div className="absolute -top-5 md:-top-6 left-5 md:left-8 w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-[#1a8a7d] flex items-center justify-center shadow-md">
              <Stethoscope className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h3 className="mt-3 md:mt-4 text-lg md:text-xl font-bold text-[#1a8a7d]">
              國際頂尖私立醫療水準
            </h3>
            <div className="mt-0.5 md:mt-1 text-xs md:text-sm font-semibold text-gray-400 tracking-wider">
              Medical
            </div>
            <p className="mt-2 md:mt-4 text-sm md:text-base text-gray-600 leading-relaxed">
              榮獲數十家 <span className="font-bold text-[#1a8a7d]">JCI 國際醫療認證</span>，設備技術與歐美同步，醫師同業絕對有感的頂級水準。
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative bg-white rounded-xl md:rounded-2xl p-5 md:p-8 shadow-lg border-t-4 border-[#d4a843] hover:shadow-xl transition-shadow group"
          >
            <div className="absolute -top-5 md:-top-6 left-5 md:left-8 w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-[#d4a843] flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h3 className="mt-3 md:mt-4 text-lg md:text-xl font-bold text-[#d4a843]">
              培育下一代的黃金跳板
            </h3>
            <div className="mt-0.5 md:mt-1 text-xs md:text-sm font-semibold text-gray-400 tracking-wider">
              Education
            </div>
            <p className="mt-2 md:mt-4 text-sm md:text-base text-gray-600 leading-relaxed">
              逾 <span className="font-bold text-[#d4a843]">100 所</span>國際學校聚落（英/美/IB 制度），學費僅台北外僑學校的{" "}
              <span className="font-bold text-[#d4a843]">1/3</span>，無縫接軌歐美名校。
            </p>
          </motion.div>
        </div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-5 md:mt-10 bg-[#1a8a7d]/5 rounded-xl md:rounded-2xl p-4 md:p-8 flex items-start md:items-center gap-4 md:gap-6"
        >
          <div className="flex-shrink-0 w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#1a8a7d]/10 flex items-center justify-center">
            <Plane className="w-5 h-5 md:w-7 md:h-7 text-[#1a8a7d]" />
          </div>
          <div>
            <h3 className="text-base md:text-xl font-bold text-[#1a8a7d]">
              真正的零時差避風港
            </h3>
            <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-600 leading-relaxed">
              華語暢通、與台灣<span className="font-bold text-[#d4a843]">零時差</span>（GMT+8），無地震颱風。看診與投資遙控完美兼顧。
            </p>
          </div>
        </motion.div>

        {/* Background image decoration - hidden on mobile */}
        <div className="absolute right-0 bottom-0 w-1/3 h-2/3 opacity-[0.07] pointer-events-none hidden md:block">
          <img src={IMAGES.medicalEducation} alt="" className="w-full h-full object-cover" />
        </div>
      </div>
    </SlideWrapper>
  );
}
