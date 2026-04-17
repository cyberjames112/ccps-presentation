import { SlideWrapper } from "@/components/SlideWrapper";
import { CcpsLogo } from "@/components/CcpsLogo";
import { IMAGES } from "@/lib/slideData";
import { useInView } from "@/hooks/useInView";
import { motion } from "framer-motion";
import { Building2, Calculator, MessageCircle, UserPlus, ExternalLink } from "lucide-react";

const LINE_ID = "0936669147";
const LINE_ADD_URL = `https://line.me/ti/p/~${LINE_ID}`;

export function Slide8PlanB() {
  const { ref, isInView } = useInView(0.15);

  return (
    <SlideWrapper
      id="slide-7"
      bgImage={IMAGES.malaysiaKlcc}
      bgOverlay="bg-gradient-to-b from-white/95 via-white/90 to-white/80 md:bg-gradient-to-r md:from-white/95 md:via-white/90 md:to-white/75"
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-16 min-h-screen flex flex-col justify-center" ref={ref}>
        <div className="flex justify-end mb-3 md:mb-6">
          <CcpsLogo size="sm" />
        </div>

        <motion.h2
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-xl md:text-5xl font-black text-[#1a8a7d] leading-tight"
        >
          啟動您的專屬 Plan B：領取大馬核心房產白皮書
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-2 text-sm md:text-lg font-bold text-gray-700"
        >
          立即加入 LINE 好友，獲取醫師專屬客製化評估
        </motion.p>

        <div className="mt-5 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4 md:space-y-5"
          >
            <div>
              <h3 className="text-base md:text-lg font-bold text-[#1a8a7d] mb-2 md:mb-3">
                限時索取高價值資料：
              </h3>
              <div className="space-y-2 md:space-y-3">
                <a
                  href="https://papyrus-north-kiara-production.up.railway.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 md:gap-3 bg-white/80 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 hover:bg-[#1a8a7d]/10 hover:border-[#1a8a7d]/30 transition-all cursor-pointer group"
                >
                  <Building2 className="w-5 h-5 md:w-6 md:h-6 text-[#1a8a7d] flex-shrink-0 mt-0.5" />
                  <p className="text-sm md:text-base text-gray-700 font-medium group-hover:text-[#1a8a7d] transition-colors flex items-center gap-1.5">
                    超高CP值精選建案 — Papyrus North Kiara
                    <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                </a>
                <a
                  href="https://golden-crown-residence-production.up.railway.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 md:gap-3 bg-white/80 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 hover:bg-[#d4a843]/10 hover:border-[#d4a843]/30 transition-all cursor-pointer group"
                >
                  <Building2 className="w-5 h-5 md:w-6 md:h-6 text-[#d4a843] flex-shrink-0 mt-0.5" />
                  <p className="text-sm md:text-base text-gray-700 font-medium group-hover:text-[#d4a843] transition-colors flex items-center gap-1.5">
                    超高CP值精選建案 — Golden Crown Residence
                    <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                </a>
                <div className="flex items-start gap-2.5 md:gap-3 bg-white/80 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 shadow-sm border border-gray-100">
                  <Calculator className="w-5 h-5 md:w-6 md:h-6 text-[#d4a843] flex-shrink-0 mt-0.5" />
                  <p className="text-sm md:text-base text-gray-700 font-medium">
                    您的家庭 MM2H 通關資格與資金試算
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#1a8a7d]/5 rounded-lg md:rounded-xl p-4 md:p-5 border-l-4 border-[#1a8a7d]">
              <div className="flex items-start gap-2.5 md:gap-3">
                <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-[#1a8a7d] flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 leading-relaxed italic text-xs md:text-sm">
                  「各位醫師平時看診已經極度辛勞，海外資產的繁瑣細節，請交給 CCPS 家慶佳業。現在花{" "}
                  <span className="font-bold text-[#d4a843]">3 秒鐘加入好友</span>
                  ，讓我們為您與家人，規劃最安穩的第二家園。」
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: LINE Add Friend CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-10 shadow-xl border border-gray-100 flex flex-col items-center w-full max-w-xs md:max-w-sm">
              {/* LINE icon */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-[#06C755] flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 24 24" className="w-12 h-12 md:w-14 md:h-14 text-white" fill="currentColor">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
              </div>

              <h3 className="mt-4 md:mt-5 text-lg md:text-xl font-black text-gray-800 text-center">
                加入 LINE 好友
              </h3>
              <p className="mt-1.5 text-xs md:text-sm text-gray-500 text-center">
                LINE ID：<span className="font-bold text-[#1a8a7d]">{LINE_ID}</span>
              </p>

              {/* Main CTA button */}
              <motion.a
                href={LINE_ADD_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-5 md:mt-6 w-full flex items-center justify-center gap-2.5 bg-[#06C755] text-white font-bold px-6 md:px-8 py-3 md:py-3.5 rounded-full shadow-lg hover:shadow-xl hover:bg-[#05b34c] transition-all text-base md:text-lg"
              >
                <UserPlus className="w-5 h-5" />
                立即加入好友
              </motion.a>

              {/* Secondary CTA - Papyrus建案 */}
              <motion.a
                href="https://papyrus-north-kiara-production.up.railway.app"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-3 w-full flex items-center justify-center gap-2 bg-[#1a8a7d] text-white font-bold px-6 py-2.5 md:py-3 rounded-full shadow-md hover:shadow-lg transition-all text-sm md:text-base"
              >
                <Building2 className="w-4 h-4 md:w-5 md:h-5" />
                Papyrus North Kiara
              </motion.a>

              {/* Tertiary CTA - Golden Crown建案 */}
              <motion.a
                href="https://golden-crown-residence-production.up.railway.app"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-2 w-full flex items-center justify-center gap-2 bg-[#d4a843] text-white font-bold px-6 py-2.5 md:py-3 rounded-full shadow-md hover:shadow-lg transition-all text-sm md:text-base"
              >
                <Building2 className="w-4 h-4 md:w-5 md:h-5" />
                Golden Crown Residence
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </SlideWrapper>
  );
}
