import { SlideWrapper } from "@/components/SlideWrapper";
import { CcpsLogo } from "@/components/CcpsLogo";
import { useInView } from "@/hooks/useInView";
import { motion } from "framer-motion";
import { Lightbulb, Wallet, Users, ShieldCheck } from "lucide-react";

const cards = [
  {
    icon: Lightbulb,
    title: "打破迷思",
    text: "這不是花錢買簽證，而是將資金放在大馬銀行",
    highlight: "定存生息",
    rest: "。",
    color: "#1a8a7d",
  },
  {
    icon: Wallet,
    title: "資金靈活度極高",
    text: "定存金額可提領",
    highlight: "最高 50%",
    rest: "用於當地購屋、醫療與教育。",
    color: "#d4a843",
  },
  {
    icon: Users,
    title: "一人申請，三代同行",
    text: "完美契合幫父母規劃退休醫療、幫小孩規劃國際教育的需求。",
    highlight: "",
    rest: "",
    color: "#1a8a7d",
  },
  {
    icon: ShieldCheck,
    title: "最穩健的 Plan B",
    text: "保留台灣國籍，替家族買一份",
    highlight: "沒有期限的保險",
    rest: "。",
    color: "#d4a843",
  },
];

export function Slide4MM2H() {
  const { ref, isInView } = useInView(0.15);

  return (
    <SlideWrapper id="slide-3" className="bg-white">
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
          MM2H 計畫：不是消費，而是會生息的「萬能門票」
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-2 md:mt-3 text-sm md:text-lg text-gray-600 font-medium"
        >
          高 CP 值的備用身分，資金不卡死
        </motion.p>

        {/* Balance scale visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-5 md:mt-8 flex justify-center items-center gap-5 md:gap-8"
        >
          <div className="flex flex-col items-center gap-1.5 md:gap-2">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-red-50 flex items-center justify-center border-2 border-red-200">
              <span className="text-xl md:text-2xl font-black text-red-400">✕</span>
            </div>
            <span className="text-xs md:text-sm text-gray-500 font-medium">歐美捐款買國籍</span>
          </div>

          <div className="text-2xl md:text-3xl text-gray-300 font-light">VS</div>

          <div className="flex flex-col items-center gap-1.5 md:gap-2">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#1a8a7d]/10 flex items-center justify-center border-2 border-[#1a8a7d]/30">
              <span className="text-xl md:text-2xl font-black text-[#d4a843]">✓</span>
            </div>
            <span className="text-xs md:text-sm text-[#1a8a7d] font-bold">大馬銀行生息定存</span>
          </div>
        </motion.div>

        {/* Four cards - 1 col on mobile, 2 cols on desktop */}
        <div className="mt-5 md:mt-10 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="bg-gray-50 rounded-lg md:rounded-xl p-4 md:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="flex items-center gap-2.5 md:gap-3 mb-2 md:mb-3">
                <div
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${card.color}15` }}
                >
                  <card.icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: card.color }} />
                </div>
                <h3 className="text-base md:text-lg font-bold" style={{ color: card.color }}>
                  {card.title}
                </h3>
              </div>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                {card.text}
                {card.highlight && (
                  <span className="font-bold" style={{ color: card.color }}>
                    {card.highlight}
                  </span>
                )}
                {card.rest}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  );
}
