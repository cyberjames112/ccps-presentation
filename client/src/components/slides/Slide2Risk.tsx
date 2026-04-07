import { SlideWrapper } from "@/components/SlideWrapper";
import { CcpsLogo } from "@/components/CcpsLogo";
import { useInView } from "@/hooks/useInView";
import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp, Shield } from "lucide-react";

const items = [
  {
    icon: AlertTriangle,
    text: "每日滿診的高壓生活中，您的資產是否 100% 綁定在",
    highlight: "單一市場",
    rest: "",
  },
  {
    icon: Shield,
    text: "面對地緣政治與通膨，高資產族群需要的不僅是投資，而是",
    highlight: "無縫接軌的備用方案",
    rest: "",
  },
  {
    icon: TrendingUp,
    text: "我是您的專屬海外資產配置顧問，今天我們只談數據、結論，以及如何幫您",
    highlight: "省去所有麻煩",
    rest: "",
  },
];

export function Slide2Risk() {
  const { ref, isInView } = useInView(0.3);

  return (
    <SlideWrapper id="slide-1" className="bg-white">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-12 md:py-20 min-h-screen flex flex-col justify-center">
        <div className="flex justify-end mb-4 md:mb-8">
          <CcpsLogo size="sm" />
        </div>

        <motion.h2
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-2xl md:text-5xl font-black text-[#1a8a7d] leading-tight"
        >
          您的資產，是否過度集中在
          <br />
          單一風險中？
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-3 md:mt-4 text-base md:text-xl font-bold text-[#d4a843]"
        >
          台灣高資產醫師的專屬「Plan B」海外資產配置策略
        </motion.p>

        <div ref={ref} className="mt-8 md:mt-12 space-y-5 md:space-y-8">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.2 }}
              className="flex items-start gap-3 md:gap-5 group"
            >
              <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1a8a7d]/10 flex items-center justify-center group-hover:bg-[#1a8a7d]/20 transition-colors">
                <item.icon className="w-5 h-5 md:w-6 md:h-6 text-[#1a8a7d]" />
              </div>
              <p className="text-sm md:text-lg text-gray-700 leading-relaxed pt-1.5 md:pt-2">
                {item.text}
                <span className="font-bold text-[#d4a843]">
                  {item.highlight}
                </span>
                {item.rest}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Decorative chart lines */}
        <div className="absolute right-0 bottom-0 w-1/3 h-1/2 opacity-10 pointer-events-none overflow-hidden hidden md:block">
          <svg viewBox="0 0 400 300" className="w-full h-full">
            <polyline fill="none" stroke="#1a8a7d" strokeWidth="2" points="0,250 50,200 100,220 150,150 200,180 250,100 300,130 350,60 400,80" />
            <polyline fill="none" stroke="#d4a843" strokeWidth="2" points="0,280 50,260 100,240 150,200 200,210 250,160 300,170 350,120 400,100" />
            <polyline fill="none" stroke="#1a8a7d" strokeWidth="1.5" opacity="0.5" points="0,270 50,230 100,250 150,180 200,200 250,140 300,150 350,90 400,110" />
          </svg>
        </div>
      </div>
    </SlideWrapper>
  );
}
