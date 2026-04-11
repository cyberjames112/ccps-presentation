import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import {
  Plane,
  Hotel,
  Car,
  Utensils,
  Users,
  Calendar,
  Phone,
  Mail,
  User,
  Clock,
  AlertTriangle,
  CheckCircle2,
  X,
  MessageCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663123178525/fDCYNs6656b7JMsC7bMdFf/logo_ec5529c5.png";

const LINE_URL = "https://line.me/ti/p/~0936669147";

const includes = [
  { icon: Plane, text: "長榮、華航經濟艙來回機票" },
  { icon: Hotel, text: "JW 萬豪或同等五星級酒店" },
  { icon: Utensils, text: "全程餐食" },
  { icon: Car, text: "吉隆坡導覽全程專車接送" },
];

// ── Booking Calendar Component ──
function BookingCalendar({
  selectedDate,
  onSelectDate,
}: {
  selectedDate: Date | null;
  onSelectDate: (d: Date) => void;
}) {
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(firstDayOfWeek).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === day
    );
  };

  const isPast = (day: number) => {
    const d = new Date(year, month, day);
    return d < today;
  };

  const isToday = (day: number) => {
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };

  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
  const monthLabel = `${year} 年 ${month + 1} 月`;

  return (
    <div className="bg-white border-2 border-[#1a8a7d]/20 rounded-xl p-4 select-none">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setViewMonth(new Date(year, month - 1, 1))}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <span className="text-sm font-bold text-gray-800">{monthLabel}</span>
        <button
          type="button"
          onClick={() => setViewMonth(new Date(year, month + 1, 1))}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((d) => (
          <div key={d} className="text-center text-xs font-bold text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((day, i) => {
          if (day === null) return <div key={i} />;
          const sel = isSelected(day);
          const past = isPast(day);
          const todayMark = isToday(day);

          return (
            <button
              key={i}
              type="button"
              disabled={past}
              onClick={() => onSelectDate(new Date(year, month, day))}
              className={`w-full aspect-square rounded-lg text-sm font-bold flex items-center justify-center transition-all
                ${sel ? "bg-[#1a8a7d] text-white shadow-md" : ""}
                ${!sel && todayMark ? "bg-[#1a8a7d]/10 text-[#1a8a7d] ring-1 ring-[#1a8a7d]/30" : ""}
                ${!sel && !todayMark && !past ? "text-gray-700 hover:bg-[#1a8a7d]/5 hover:text-[#1a8a7d]" : ""}
                ${past ? "text-gray-300 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Helper: format selected date ──
function formatSelectedDate(d: Date): string {
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}(${weekDays[d.getDay()]})`;
}

export default function DynamicBooking({ slug }: { slug: string }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const templateQuery = trpc.tripTemplate.getBySlug.useQuery({ slug });

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [days, setDays] = useState<"3d2n" | "4d3n">("3d2n");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showLinePrompt, setShowLinePrompt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createBooking = trpc.booking.create.useMutation();

  const template = templateQuery.data;

  // Determine active prices based on day selection
  const activeAdultPrice = template
    ? (template.showDaySelector && days === "4d3n" && template.adultPrice4d != null
        ? template.adultPrice4d
        : template.adultPrice)
    : 0;
  const activeChildPrice = template
    ? (template.showDaySelector && days === "4d3n" && template.childPrice4d != null
        ? template.childPrice4d
        : template.childPrice)
    : 0;

  const pricing = useMemo(() => {
    const adultTotal = adults * activeAdultPrice;
    const childTotal = children * activeChildPrice;
    const totalPrice = adultTotal + childTotal;
    const totalPeople = adults + children;
    return { adultTotal, childTotal, totalPrice, totalPeople };
  }, [adults, children, activeAdultPrice, activeChildPrice]);

  const daysLabel = days === "3d2n" ? "三天兩夜" : "四天三夜";

  // Display title: standard template uses special title
  const pageTitle = template?.isStandard
    ? "CCPS客制化考察行程費用試算"
    : template?.name ?? "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || isSubmitting || !template) return;
    if (template.customDate && !selectedDate) return; // must pick a date
    setIsSubmitting(true);
    const tripDateStr = template.customDate && selectedDate
      ? formatSelectedDate(selectedDate)
      : template.tripDate;
    try {
      await createBooking.mutateAsync({
        name,
        phone,
        email,
        tripDays: days,
        tripDate: tripDateStr,
        groupSize: adults + children,
        totalAmount: pricing.totalPrice,
        templateSlug: slug,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Booking failed:", err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLineClick = () => {
    setShowLinePrompt(true);
  };

  const confirmLineRedirect = () => {
    setShowLinePrompt(false);
    window.open(LINE_URL, "_blank", "noopener,noreferrer");
  };

  // Loading state
  if (templateQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0faf8] via-white to-[#fdf8ed] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#1a8a7d] animate-spin mx-auto mb-4" />
          <p className="text-gray-500">載入行程資料中...</p>
        </div>
      </div>
    );
  }

  // Error / not found
  if (templateQuery.error || !template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0faf8] via-white to-[#fdf8ed] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">找不到此行程方案</h2>
          <p className="text-gray-500 text-sm">此連結可能已失效或不存在，請聯繫我們取得最新資訊。</p>
        </div>
      </div>
    );
  }

  // Inactive template
  if (!template.active) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0faf8] via-white to-[#fdf8ed] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">此行程已結束報名</h2>
          <p className="text-gray-500 text-sm">感謝您的關注，請聯繫我們了解最新行程。</p>
        </div>
      </div>
    );
  }

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLinePrompt(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          >
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
              已收到您的請求
            </h2>
            <p className="mt-3 text-gray-600 text-sm md:text-base leading-relaxed">
              將為您發送行程表到您的Email，點擊下方加入LINE好友，馬上與專屬顧問聊聊行程需求
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
                <span className="text-gray-500">Email</span>
                <span className="font-bold text-gray-800">{email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">行程</span>
                <span className="font-bold text-gray-800">
                  {template.showDaySelector ? daysLabel : template.name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">出團日期</span>
                <span className="font-bold text-gray-800">
                  {template.customDate && selectedDate
                    ? formatSelectedDate(selectedDate)
                    : template.tripDate}
                </span>
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

            <div className="mt-6">
              <button
                onClick={handleLineClick}
                className="w-full flex items-center justify-center gap-2 bg-[#06C755] text-white font-bold py-3.5 rounded-full shadow-md hover:shadow-lg transition-all text-base"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
                加入 LINE 聯繫專人
              </button>
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
              {pageTitle}
            </h1>
            {!template.isStandard && template.description && template.description !== "標準模式" && (
              <p className="mt-1.5 text-sm md:text-base text-gray-500">
                {template.description}
              </p>
            )}
            {template.isStandard && (
              <p className="mt-1.5 text-sm md:text-base text-gray-500">
                填寫以下資料，我們將盡快為您安排專屬行程
              </p>
            )}
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

              {/* Email */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-1.5">
                  <Mail className="w-4 h-4 text-[#1a8a7d]" />
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="請輸入您的 Email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-[#1a8a7d] focus:ring-2 focus:ring-[#1a8a7d]/20 outline-none transition-all text-sm md:text-base"
                />
              </div>

              {/* Trip Info / Day Selector */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-1.5">
                  <Clock className="w-4 h-4 text-[#1a8a7d]" />
                  行程方案
                </label>
                {template.showDaySelector ? (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDays("3d2n")}
                      className={`px-4 py-3 rounded-xl border-2 text-center transition-all ${
                        days === "3d2n"
                          ? "border-[#1a8a7d] bg-[#1a8a7d]/10 text-[#1a8a7d]"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      <p className="font-bold text-sm md:text-base">三天兩夜</p>
                      <p className="text-xs mt-0.5 opacity-70">
                        成人 NT${template.adultPrice.toLocaleString()}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDays("4d3n")}
                      className={`px-4 py-3 rounded-xl border-2 text-center transition-all ${
                        days === "4d3n"
                          ? "border-[#1a8a7d] bg-[#1a8a7d]/10 text-[#1a8a7d]"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      <p className="font-bold text-sm md:text-base">四天三夜</p>
                      <p className="text-xs mt-0.5 opacity-70">
                        成人 NT${(template.adultPrice4d ?? template.adultPrice).toLocaleString()}
                      </p>
                    </button>
                  </div>
                ) : (
                  <div className="px-4 py-3 rounded-xl border-2 border-[#1a8a7d] bg-[#1a8a7d]/5 text-[#1a8a7d]">
                    <p className="font-bold text-sm md:text-base">{template.name}</p>
                    {template.description && template.description !== "標準模式" && (
                      <p className="text-xs font-normal mt-0.5 opacity-70">
                        {template.description}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-1.5">
                  <Calendar className="w-4 h-4 text-[#1a8a7d]" />
                  出團日期 {template.customDate && <span className="text-red-500">*</span>}
                </label>
                {template.customDate ? (
                  <div className="space-y-2">
                    <BookingCalendar
                      selectedDate={selectedDate}
                      onSelectDate={setSelectedDate}
                    />
                    {selectedDate && (
                      <div className="px-4 py-2.5 rounded-xl bg-[#1a8a7d]/5 border-2 border-[#1a8a7d] text-[#1a8a7d] font-bold text-sm md:text-base">
                        已選擇：{formatSelectedDate(selectedDate)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full px-4 py-3 rounded-xl border-2 border-[#1a8a7d] bg-[#1a8a7d]/5 text-[#1a8a7d] font-bold text-sm md:text-base">
                    {template.tripDate}
                  </div>
                )}
              </div>

              {/* Adults */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-1.5">
                  <Users className="w-4 h-4 text-[#1a8a7d]" />
                  成人人數 <span className="text-red-500">*</span>
                  <span className="text-xs font-normal text-gray-400 ml-1">每位 NT${activeAdultPrice.toLocaleString()}</span>
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
                  <span className="text-xs font-normal text-gray-400 ml-1">每位 NT${activeChildPrice.toLocaleString()}</span>
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

              {/* Submit (mobile) */}
              <div className="lg:hidden pt-2">
                <button
                  type="submit"
                  disabled={!name || !phone || !email || isSubmitting || (template?.customDate && !selectedDate)}
                  className="w-full bg-[#d4a843] text-white font-black py-3.5 rounded-full text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? "送出中..." : "瞭解行程"}
                </button>
              </div>
            </motion.form>

            {/* Sidebar */}
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
                    {template.showDaySelector && (
                      <div className="flex justify-between text-sm border-b border-gray-100 pb-2 mb-1">
                        <span className="text-gray-500">方案</span>
                        <span className="font-bold text-[#1a8a7d]">{daysLabel}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">成人（每位）</span>
                      <span className="font-bold">NT${activeAdultPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">成人人數</span>
                      <span className="font-bold">× {adults} 人</span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-gray-100 pb-3">
                      <span className="text-gray-600 font-medium">成人小計</span>
                      <span className="font-bold">NT${pricing.adultTotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">兒童（未滿11歲，每位）</span>
                      <span className="font-bold">NT${activeChildPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">兒童人數</span>
                      <span className="font-bold">× {children} 人</span>
                    </div>
                    {children > 0 && (
                      <div className="flex justify-between text-sm border-b border-gray-100 pb-3">
                        <span className="text-gray-600 font-medium">兒童小計</span>
                        <span className="font-bold">NT${pricing.childTotal.toLocaleString()}</span>
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
                      disabled={!name || !phone || !email || isSubmitting || (template?.customDate && !selectedDate)}
                      className="w-full bg-[#d4a843] text-white font-black py-3.5 rounded-full text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {isSubmitting ? "送出中..." : "瞭解行程"}
                    </button>
                  </div>
                </div>

                {/* Includes */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
                  <h3 className="text-sm font-bold text-[#1a8a7d] mb-3">費用包含</h3>
                  <div className="space-y-2.5">
                    {includes.map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <item.icon className="w-4 h-4 text-[#d4a843] flex-shrink-0" />
                        <span className="text-xs md:text-sm text-gray-700">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-amber-50 rounded-2xl border border-amber-200/60 p-5">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-amber-800">注意事項</h4>
                      <ul className="text-xs text-amber-700 space-y-1 leading-relaxed">
                        <li>不含機場接送</li>
                        <li>不含保險，若有需求可自行提前規劃</li>
                        <li className="font-bold">機票一經航空公司開票後不得要求退款</li>
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
