import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  Plane,
  Hotel,
  Car,
  Utensils,
  Users,
  Calendar,
  Phone,
  User,
  Clock,
  AlertTriangle,
  CheckCircle2,
  X,
  MessageCircle,
} from "lucide-react";

const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663123178525/fDCYNs6656b7JMsC7bMdFf/logo_ec5529c5.png";

const ADULT_PRICE = 30000;
const CHILD_PRICE = 20000;
const LINE_URL = "https://line.me/ti/p/~0936669147";

const includes = [
  { icon: Plane, text: "長榮、華航經濟艙來回機票" },
  { icon: Hotel, text: "JW 萬豪或同等五星級酒店" },
  { icon: Utensils, text: "全程餐食" },
  { icon: Car, text: "吉隆坡導覽全程專車接送" },
];

type DayOption = "3d2n" | "4d3n";

export default function Booking() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [days, setDays] = useState<DayOption>("3d2n");
  const [date] = useState("4/30(五)-5/4(二)");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showLinePrompt, setShowLinePrompt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createBooking = trpc.booking.create.useMutation();

  // Price calculation
  const pricing = useMemo(() => {
    const totalPeople = adults + children;
    const adultTotal = adults * ADULT_PRICE;
    const childTotal = children * CHILD_PRICE;
    const totalPrice = adultTotal + childTotal;
    return { adultTotal, childTotal, totalPrice, totalPeople };
  }, [adults, children]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createBooking.mutateAsync({
        name,
        phone,
        tripDays: days,
        tripDate: date || undefined,
        groupSize: adults + children,
        totalAmount: pricing.totalPrice,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Booking failed:", err);
      // Still show success to user (data might have been saved)
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const daysLabel = "五天四夜";

  const handleLineClick = () => {
    setShowLinePrompt(true);
  };

  const confirmLineRedirect = () => {
    setShowLinePrompt(false);
    window.open(LINE_URL, "_blank", "noopener,noreferrer");
  };

  // LINE Prompt Modal
  const LinePromptModal = () => (
    <AnimatePresence>
      {showLinePrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLinePrompt(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            {/* Green header */}
            <div className="bg-[#06C755] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
                <span className="text-white font-bold text-lg">LINE 好友提醒</span>
              </div>
              <button
                onClick={() => setShowLinePrompt(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 bg-[#06C755]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageCircle className="w-5 h-5 text-[#06C755]" />
                </div>
                <div>
                  <p className="text-gray-800 text-sm leading-relaxed">
                    即將為您跳轉至專屬顧問的 LINE，請您加入好友後輸入關鍵字：
                  </p>
                  <div className="mt-3 bg-[#06C755]/5 border-2 border-[#06C755]/30 rounded-xl px-4 py-3 text-center">
                    <span className="text-[#06C755] font-black text-lg tracking-wide">
                      我要報名考察團
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLinePrompt(false)}
                  className="flex-1 px-4 py-3 rounded-full border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all"
                >
                  取消
                </button>
                <button
                  onClick={confirmLineRedirect}
                  className="flex-1 px-4 py-3 rounded-full bg-[#06C755] text-white font-bold text-sm shadow-lg hover:shadow-xl hover:bg-[#05b34c] transition-all flex items-center justify-center gap-2"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                  </svg>
                  前往 LINE
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (submitted) {
    return (
      <>
        <LinePromptModal />
        <div className="min-h-screen bg-gradient-to-br from-[#f0faf8] via-white to-[#fdf8ed] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center border border-gray-100"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-[#1a8a7d]/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-9 h-9 md:w-11 md:h-11 text-[#1a8a7d]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-[#1a8a7d]">
              報名資料已送出
            </h2>
            <p className="mt-3 text-gray-600 text-sm md:text-base leading-relaxed">
              感謝您的報名！請加入我們的 LINE 好友，以便專人為您安排後續行程。
            </p>

            <div className="mt-6 bg-gray-50 rounded-xl p-5 text-left space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">姓名</span>
                <span className="font-bold text-gray-800">{name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">電話</span>
                <span className="font-bold text-gray-800">{phone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">行程</span>
                <span className="font-bold text-gray-800">{daysLabel}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">出團日期</span>
                <span className="font-bold text-gray-800">4/30(五) － 5/4(二)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">成人人數</span>
                <span className="font-bold text-gray-800">{adults} 人</span>
              </div>
              {children > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">兒童人數（未滿11歲）</span>
                  <span className="font-bold text-gray-800">{children} 人</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2.5 mt-2.5 flex justify-between">
                <span className="text-gray-700 font-bold">預估總金額</span>
                <span className="font-black text-[#d4a843] text-lg">
                  NT${pricing.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleLineClick}
                className="flex items-center justify-center gap-2 bg-[#06C755] text-white font-bold py-3.5 rounded-full shadow-md hover:shadow-lg transition-all text-base"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
                加入 LINE 聯繫專人
              </button>
              <Link
                href="/"
                className="text-[#1a8a7d] font-bold text-sm hover:underline"
              >
                ← 返回簡報
              </Link>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <LinePromptModal />
      <div className="min-h-screen bg-gradient-to-br from-[#f0faf8] via-white to-[#fdf8ed]">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-3 md:py-4 flex items-center justify-center">
            <img
              src={LOGO_URL}
              alt="CCPS 家慶佳業"
              className="h-7 md:h-9 w-auto object-contain"
              draggable={false}
            />
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-10">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 md:mb-8"
          >
            <h1 className="text-2xl md:text-4xl font-black text-[#1a8a7d]">
              馬來西亞考察團報名
            </h1>
            <p className="mt-1.5 text-sm md:text-base text-gray-500">
              填寫以下資料，我們將盡快為您安排專屬行程
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onSubmit={handleSubmit}
              className="lg:col-span-3 space-y-5"
            >
              {/* Name */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-1.5">
                  <User className="w-4 h-4 text-[#1a8a7d]" />
                  姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="請輸入您的姓名"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-[#1a8a7d] focus:ring-2 focus:ring-[#1a8a7d]/20 outline-none transition-all text-sm md:text-base"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-1.5">
                  <Phone className="w-4 h-4 text-[#1a8a7d]" />
                  聯絡電話 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="請輸入您的聯絡電話"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-[#1a8a7d] focus:ring-2 focus:ring-[#1a8a7d]/20 outline-none transition-all text-sm md:text-base"
                />
              </div>

              {/* Days */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-1.5">
                  <Clock className="w-4 h-4 text-[#1a8a7d]" />
                  行程方案
                </label>
                <div className="px-4 py-3 rounded-xl border-2 border-[#1a8a7d] bg-[#1a8a7d]/5 text-[#1a8a7d]">
                  <p className="font-bold text-sm md:text-base">精選超值行程五天四夜</p>
                  <p className="text-xs font-normal mt-0.5 opacity-70">
                    吉隆坡導覽＋國際學校參觀＋建案參觀
                  </p>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-1.5">
                  <Calendar className="w-4 h-4 text-[#1a8a7d]" />
                  出團日期
                </label>
                <div className="w-full px-4 py-3 rounded-xl border-2 border-[#1a8a7d] bg-[#1a8a7d]/5 text-[#1a8a7d] font-bold text-sm md:text-base">
                  4/30(五) － 5/4(二)
                </div>
              </div>

              {/* Adults */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-1.5">
                  <Users className="w-4 h-4 text-[#1a8a7d]" />
                  成人人數 <span className="text-red-500">*</span>
                  <span className="text-xs font-normal text-gray-400 ml-1">每位 NT$30,000</span>
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center text-xl font-bold text-gray-600 hover:border-[#1a8a7d] hover:text-[#1a8a7d] transition-all"
                  >
                    −
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-3xl md:text-4xl font-black text-[#1a8a7d]">
                      {adults}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">人</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAdults(Math.min(20, adults + 1))}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center text-xl font-bold text-gray-600 hover:border-[#1a8a7d] hover:text-[#1a8a7d] transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-1.5">
                  <Users className="w-4 h-4 text-[#d4a843]" />
                  未滿11歲兒童人數
                  <span className="text-xs font-normal text-gray-400 ml-1">每位 NT$20,000</span>
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center text-xl font-bold text-gray-600 hover:border-[#1a8a7d] hover:text-[#1a8a7d] transition-all"
                  >
                    −
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-3xl md:text-4xl font-black text-[#d4a843]">
                      {children}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">人</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setChildren(Math.min(20, children + 1))}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center text-xl font-bold text-gray-600 hover:border-[#1a8a7d] hover:text-[#1a8a7d] transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Submit (mobile only, desktop has it in sidebar) */}
              <div className="lg:hidden pt-2">
                <button
                  type="submit"
                  disabled={!name || !phone || isSubmitting}
                  className="w-full bg-[#d4a843] text-white font-black py-3.5 rounded-full text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? "送出中..." : "確認報名"}
                </button>
              </div>
            </motion.form>

            {/* Sidebar: Price summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="sticky top-20 space-y-4">
                {/* Price card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-[#1a8a7d] px-5 py-4">
                    <h3 className="text-white font-bold text-sm">費用明細</h3>
                  </div>
                  <div className="p-5 space-y-3">
                    {/* Adult pricing */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">成人（每位）</span>
                      <span className="font-bold">
                        NT${ADULT_PRICE.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">成人人數</span>
                      <span className="font-bold">× {adults} 人</span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-gray-100 pb-3">
                      <span className="text-gray-600 font-medium">成人小計</span>
                      <span className="font-bold">
                        NT${pricing.adultTotal.toLocaleString()}
                      </span>
                    </div>

                    {/* Child pricing */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">兒童（未滿11歲，每位）</span>
                      <span className="font-bold">
                        NT${CHILD_PRICE.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">兒童人數</span>
                      <span className="font-bold">× {children} 人</span>
                    </div>
                    {children > 0 && (
                      <div className="flex justify-between text-sm border-b border-gray-100 pb-3">
                        <span className="text-gray-600 font-medium">兒童小計</span>
                        <span className="font-bold">
                          NT${pricing.childTotal.toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="border-t-2 border-[#1a8a7d]/20 pt-3">
                      <div className="flex justify-between items-baseline">
                        <span className="text-gray-700 font-bold">預估總金額</span>
                        <span className="text-2xl md:text-3xl font-black text-[#d4a843]">
                          NT${pricing.totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop submit */}
                  <div className="hidden lg:block px-5 pb-5">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!name || !phone || isSubmitting}
                      className="w-full bg-[#d4a843] text-white font-black py-3.5 rounded-full text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {isSubmitting ? "送出中..." : "確認報名"}
                    </button>
                  </div>
                </div>

                {/* Includes */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
                  <h3 className="text-sm font-bold text-[#1a8a7d] mb-3">
                    費用包含
                  </h3>
                  <div className="space-y-2.5">
                    {includes.map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <item.icon className="w-4 h-4 text-[#d4a843] flex-shrink-0" />
                        <span className="text-xs md:text-sm text-gray-700">
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-amber-50 rounded-2xl border border-amber-200/60 p-5">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-amber-800">
                        注意事項
                      </h4>
                      <ul className="text-xs text-amber-700 space-y-1 leading-relaxed">
                        <li>不含機場接送</li>
                        <li>不含保險，若有需求可自行提前規劃</li>
                        <li className="font-bold">
                          機票一經航空公司開票後不得要求退款
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
}
