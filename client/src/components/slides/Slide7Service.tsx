import { SlideWrapper } from "@/components/SlideWrapper";
import { CcpsLogo } from "@/components/CcpsLogo";
import { useInView } from "@/hooks/useInView";
import { motion } from "framer-motion";
import { Search, FileCheck, Home } from "lucide-react";

const steps = [
  {
    icon: Search,
    phase: "前端",
    title: "精準選品與規劃",
    items: [
      "嚴選 KLCC 頂尖建案",
      "提供跨國稅務諮詢",
      { text: "MM2H 資格快速申辦", highlight: true },
    ],
  },
  {
    icon: FileCheck,
    phase: "中端",
    title: "交易與交屋把關",
    items: [
      "合規匯款、律師簽約協助",
      "專人代為驗屋",
      { text: "軟裝佈置", highlight: true },
      "直接升級為可出租狀態",
    ],
  },
  {
    icon: Home,
    phase: "後端",
    title: "無憂代租代管（核心價值）",
    items: [
      "嚴選外商高階主管租客",
      "全天候處理租金催繳與修繕",
      { text: "您完全不需接聽跨國抱怨電話", highlight: true },
      "提供未來精準估價",
      { text: "出場代售服務", highlight: true },
    ],
  },
];

export function Slide7Service() {
  const { ref, isInView } = useInView(0.1);

  return (
    <SlideWrapper id="slide-6" className="bg-white">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-20 min-h-screen flex flex-col justify-center" ref={ref}>
        <div className="flex justify-end mb-3 md:mb-8">
          <CcpsLogo size="sm" />
        </div>

        <motion.h2
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-xl md:text-4xl font-black text-[#1a8a7d] leading-tight"
        >
          CCPS 尊榮一站式服務：您專心看診，我們為您收租
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-2 md:mt-3 text-sm md:text-lg font-bold text-[#d4a843]"
        >
          解決海外投資最大痛點：端到端 (End-to-End) 無憂代管
        </motion.p>

        {/* Timeline */}
        <div className="mt-6 md:mt-12 relative">
          {/* Desktop connecting line */}
          <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-[#1a8a7d] via-[#d4a843] to-[#1a8a7d] rounded-full" />

          {/* Mobile vertical connecting line */}
          <div className="md:hidden absolute left-[23px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#1a8a7d] via-[#d4a843] to-[#1a8a7d]" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
                className="relative"
              >
                {/* Mobile: horizontal layout with circle + card */}
                <div className="flex md:flex-col items-start md:items-stretch gap-3 md:gap-0">
                  {/* Circle node */}
                  <div className="flex md:justify-center md:mb-6 flex-shrink-0">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#d4a843] flex items-center justify-center shadow-lg z-10 relative">
                        <step.icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
                      </div>
                      <div className="absolute -inset-1.5 md:-inset-2 rounded-full bg-[#d4a843]/20 animate-pulse" />
                    </div>
                  </div>

                  {/* Card */}
                  <div className="flex-1 bg-gray-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-2 mb-2 md:mb-3">
                      <span className="text-[10px] md:text-xs font-bold text-white bg-[#1a8a7d] px-2.5 md:px-3 py-0.5 md:py-1 rounded-full">
                        {step.phase}
                      </span>
                      <h3 className="text-sm md:text-base font-bold text-gray-800">
                        {step.title}
                      </h3>
                    </div>
                    <ul className="space-y-1.5 md:space-y-2">
                      {step.items.map((item, j) => {
                        const isObj = typeof item === "object";
                        const text = isObj ? item.text : item;
                        const highlight = isObj ? item.highlight : false;
                        return (
                          <li key={j} className="flex items-start gap-1.5 md:gap-2 text-xs md:text-sm">
                            <span className="text-[#1a8a7d] mt-0.5 flex-shrink-0 text-[10px] md:text-sm">●</span>
                            <span className={highlight ? "font-bold text-[#d4a843]" : "text-gray-600"}>
                              {text}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SlideWrapper>
  );
}
