import { SlideWrapper } from "@/components/SlideWrapper";
import { IMAGES } from "@/lib/slideData";
import { useInView } from "@/hooks/useInView";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { motion } from "framer-motion";
import { Cpu, Microchip, Train, TrendingUp } from "lucide-react";

const items = [
  {
    icon: Cpu,
    title: "全球 AI 與數據中心新首都",
    text: "輝達 (Nvidia) 斥資 43 億美元、微軟 22 億、Google 20 億美元打造超級 AI 基礎設施，",
    highlight: "近百億美元",
    rest: "熱錢湧入。",
    stat: 100,
    statSuffix: "億美元+",
  },
  {
    icon: Microchip,
    title: "東方矽谷半導體聚落",
    text: "掌握全球",
    highlight: "13%",
    rest: "封測市占，Intel 與英飛凌強勢擴廠，中美貿易戰最大受惠國。",
    stat: 13,
    statSuffix: "%",
  },
  {
    icon: Train,
    title: "柔新經濟特區 (JS-SEZ)",
    text: "2026 RTS 捷運通車，5 分鐘直達新加坡。龐大外商進駐創造大量",
    highlight: "高消費力租客",
    rest: "。",
    stat: 5,
    statSuffix: "分鐘",
  },
  {
    icon: TrendingUp,
    title: "強大人口紅利",
    text: "年齡中位數僅",
    highlight: "30 歲",
    rest: "，房市剛需強勁。",
    stat: 30,
    statSuffix: "歲",
  },
];

export function Slide5Economy() {
  const { ref, isInView } = useInView(0.1);

  return (
    <SlideWrapper id="slide-4" className="bg-[#1a3a4a]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-12 min-h-screen flex flex-col justify-center relative" ref={ref}>
        <div className="flex justify-end mb-3 md:mb-4">
          <div className="flex items-baseline gap-1.5 md:gap-2">
            <span className="text-lg md:text-xl font-black tracking-tight">
              <span className="text-[#d4a843]">CC</span>
              <span className="text-[#4dc9b5]">PS</span>
            </span>
            <span className="text-xs md:text-sm font-bold tracking-widest text-gray-300">
              家慶佳業
            </span>
          </div>
        </div>

        <motion.h2
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-xl md:text-5xl font-black text-white leading-tight"
        >
          聰明錢的去向：微軟、輝達重金押注的經濟護城河
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-2 md:mt-3 text-sm md:text-lg font-bold text-[#d4a843]"
        >
          2025-2026 全球熱錢湧入，跟著科技巨頭佈局最安全
        </motion.p>

        <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-5 hover:bg-white/15 transition-all duration-300 border border-white/10"
            >
              <div className="flex items-center gap-2.5 md:gap-3 mb-2 md:mb-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#1a8a7d]/30 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 md:w-5 md:h-5 text-[#4dc9b5]" />
                </div>
                <h3 className="text-sm md:text-lg font-bold text-white">
                  {item.title}
                </h3>
              </div>
              <p className="text-gray-300 leading-relaxed text-xs md:text-sm">
                {item.text}
                <span className="font-bold text-[#d4a843]">{item.highlight}</span>
                {item.rest}
              </p>
              <div className="mt-2 md:mt-3 text-xl md:text-2xl font-black text-[#d4a843]">
                <AnimatedCounter
                  end={item.stat}
                  isActive={isInView}
                  suffix={item.statSuffix}
                  duration={1500}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Map background - hidden on mobile */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-[0.12] pointer-events-none hidden md:block">
          <img src={IMAGES.southeastAsiaMap} alt="" className="w-full h-full object-cover" />
        </div>
      </div>
    </SlideWrapper>
  );
}
