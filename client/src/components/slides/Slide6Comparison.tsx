import { SlideWrapper } from "@/components/SlideWrapper";
import { CcpsLogo } from "@/components/CcpsLogo";
import { IMAGES } from "@/lib/slideData";
import { useInView } from "@/hooks/useInView";
import { motion } from "framer-motion";

const comparisonData = [
  {
    label: "房價水準",
    taipei: "約 150-250 萬+ 台幣/坪",
    kl: "約 40-80 萬 台幣/坪",
    klHighlight: true,
  },
  {
    label: "購屋門檻",
    taipei: "動輒 1 億至 3 億台幣以上",
    kl: "約 800-2,000 萬台幣即可入手",
    klHighlight: true,
  },
  {
    label: "租金投報率",
    taipei: "約 1.5% - 2%（偏低）",
    kl: "約 4% - 6%（穩定金流）",
    klHighlight: true,
  },
  {
    label: "產品規格",
    taipei: "多需自行費時裝潢裝修",
    kl: "精裝修交屋，附五星級公設",
    klHighlight: true,
  },
];

export function Slide6Comparison() {
  const { ref, isInView } = useInView(0.15);

  return (
    <SlideWrapper id="slide-5" className="bg-gray-50">
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
          降維打擊：用台北老屋價格，入主吉隆坡頂級豪宅
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-2 md:mt-3 text-sm md:text-lg text-gray-600 font-medium"
        >
          首都核心區 (KLCC) 房地產關鍵數據對比
        </motion.p>

        {/* Desktop: Table layout */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-6 md:mt-10 hidden md:block overflow-hidden rounded-2xl shadow-lg"
        >
          {/* Table header */}
          <div className="grid grid-cols-3 bg-[#1a8a7d] text-white">
            <div className="p-5 font-bold text-center border-r border-white/20">比較項目</div>
            <div className="p-5 font-bold text-center border-r border-white/20">
              <span className="mr-1">🇹🇼</span> 台北市精華區
              <span className="block text-sm font-normal opacity-80">（信義/大安）</span>
            </div>
            <div className="p-5 font-bold text-center">
              <span className="mr-1">🇲🇾</span> 吉隆坡核心區
              <span className="block text-sm font-normal opacity-80">（KLCC）</span>
            </div>
          </div>
          {comparisonData.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className={`grid grid-cols-3 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-[#1a8a7d]/5 transition-colors`}
            >
              <div className="p-5 font-bold text-gray-800 text-center border-r border-gray-100 flex items-center justify-center">{row.label}</div>
              <div className="p-5 text-gray-600 text-center border-r border-gray-100 flex items-center justify-center">{row.taipei}</div>
              <div className="p-5 text-center flex items-center justify-center">
                <span className={row.klHighlight ? "font-bold text-[#d4a843]" : "text-gray-600"}>{row.kl}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile: Card layout */}
        <div className="mt-4 md:hidden space-y-3">
          {comparisonData.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="text-sm font-bold text-[#1a8a7d] mb-2">{row.label}</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] font-semibold text-gray-400 uppercase mb-1">🇹🇼 台北</div>
                  <div className="text-xs text-gray-600">{row.taipei}</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-gray-400 uppercase mb-1">🇲🇾 吉隆坡</div>
                  <div className={`text-xs ${row.klHighlight ? "font-bold text-[#d4a843]" : "text-gray-600"}`}>{row.kl}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-4 md:mt-8 bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-md border-l-4 border-[#d4a843] text-center"
        >
          <p className="text-sm md:text-lg font-bold text-gray-800">
            資金效率極大化：
            <span className="text-[#1a8a7d]">
              無需將大筆資金鎖死在單一物件，輕鬆當跨國包租公。
            </span>
          </p>
        </motion.div>

        {/* Background decoration - hidden on mobile */}
        <div className="absolute left-0 bottom-0 w-1/4 h-1/2 opacity-[0.06] pointer-events-none hidden md:block">
          <img src={IMAGES.luxuryCondo} alt="" className="w-full h-full object-cover" />
        </div>
      </div>
    </SlideWrapper>
  );
}
