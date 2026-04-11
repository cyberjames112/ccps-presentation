import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import {
  Plus,
  Copy,
  Check,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";

const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663123178525/fDCYNs6656b7JMsC7bMdFf/logo_ec5529c5.png";

// ── Calendar Component ──
function MiniCalendar({
  selectedDate,
  onSelectDate,
  highlightedDates,
}: {
  selectedDate: Date | null;
  onSelectDate: (d: Date) => void;
  highlightedDates: { date: string; label: string }[];
}) {
  const [viewMonth, setViewMonth] = useState(() => {
    const now = selectedDate || new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0=Sun

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

  const highlightMap = useMemo(() => {
    const map = new Map<string, string>();
    highlightedDates.forEach(({ date, label }) => {
      map.set(date, label);
    });
    return map;
  }, [highlightedDates]);

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === day
    );
  };

  const getHighlight = (day: number) => {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return highlightMap.get(key);
  };

  const isToday = (day: number) => {
    const now = new Date();
    return now.getFullYear() === year && now.getMonth() === month && now.getDate() === day;
  };

  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
  const monthLabel = `${year} 年 ${month + 1} 月`;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 select-none">
      {/* Header */}
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

      {/* Week headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((d) => (
          <div key={d} className="text-center text-xs font-bold text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((day, i) => {
          if (day === null) return <div key={i} />;
          const sel = isSelected(day);
          const highlight = getHighlight(day);
          const today = isToday(day);

          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelectDate(new Date(year, month, day))}
              className={`relative w-full aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition-all
                ${sel ? "bg-[#1a8a7d] text-white shadow-md" : ""}
                ${!sel && highlight ? "bg-orange-100 text-orange-700 ring-1 ring-orange-300" : ""}
                ${!sel && !highlight && today ? "bg-blue-50 text-blue-600 ring-1 ring-blue-200" : ""}
                ${!sel && !highlight && !today ? "text-gray-700 hover:bg-gray-100" : ""}
              `}
              title={highlight || undefined}
            >
              {day}
              {highlight && !sel && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      {highlightedDates.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
          <p className="text-xs font-bold text-gray-500 mb-1">已設定出團日期：</p>
          {highlightedDates.map(({ date, label }) => (
            <div key={date} className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
              <span className="text-gray-500">{date}</span>
              <span className="text-gray-700 font-medium truncate">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Helper: parse dates from existing templates ──
function parseTemplateDates(templates: { tripDate: string; name: string }[]): { date: string; label: string }[] {
  const results: { date: string; label: string }[] = [];
  const currentYear = new Date().getFullYear();

  for (const t of templates) {
    // Match patterns like "4/29", "04/29", "4/29(四)" etc.
    const regex = /(\d{1,2})\/(\d{1,2})/g;
    let match;
    while ((match = regex.exec(t.tripDate)) !== null) {
      const m = match[1].padStart(2, "0");
      const d = match[2].padStart(2, "0");
      results.push({ date: `${currentYear}-${m}-${d}`, label: t.name });
    }
  }
  return results;
}

// ── Helper: format date to display text ──
function formatDateRange(start: Date, days: number): string {
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
  const end = new Date(start);
  end.setDate(end.getDate() + days - 1);

  const s = `${start.getMonth() + 1}/${start.getDate()}(${weekDays[start.getDay()]})`;
  const e = `${end.getMonth() + 1}/${end.getDate()}(${weekDays[end.getDay()]})`;
  return `${s}-${e}`;
}

// ── Main Admin Page ──
export default function Admin() {
  const utils = trpc.useUtils();
  const templatesQuery = trpc.tripTemplate.list.useQuery();
  const createMutation = trpc.tripTemplate.create.useMutation({
    onSuccess: () => {
      utils.tripTemplate.list.invalidate();
      resetForm();
    },
  });
  const updateMutation = trpc.tripTemplate.update.useMutation({
    onSuccess: () => utils.tripTemplate.list.invalidate(),
  });
  const deleteMutation = trpc.tripTemplate.delete.useMutation({
    onSuccess: () => utils.tripTemplate.list.invalidate(),
  });

  const [showForm, setShowForm] = useState(false);

  // Form state
  const [nameMode, setNameMode] = useState<"standard" | "custom">("standard");
  const [customName, setCustomName] = useState("");
  const [descMode, setDescMode] = useState<"standard" | "custom">("standard");
  const [customDesc, setCustomDesc] = useState("");
  const [dateMode, setDateMode] = useState<"preset" | "custom">("preset");
  const [tripDate, setTripDate] = useState("");
  const [selectedCalDate, setSelectedCalDate] = useState<Date | null>(null);
  const [tripDays, setTripDays] = useState(5); // default 5 days
  const [adultPrice, setAdultPrice] = useState(30000);
  const [childPrice, setChildPrice] = useState(20000);
  const [adultPrice4d, setAdultPrice4d] = useState(25000);
  const [childPrice4d, setChildPrice4d] = useState(18000);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const isStandard = nameMode === "standard";
  const showDaySelector = descMode === "standard";

  const finalName = isStandard ? "標準方案" : customName;
  const finalDesc = showDaySelector ? "標準模式" : customDesc;
  const finalTripDate = dateMode === "custom" && selectedCalDate
    ? formatDateRange(selectedCalDate, tripDays)
    : tripDate;

  const resetForm = () => {
    setNameMode("standard");
    setCustomName("");
    setDescMode("standard");
    setCustomDesc("");
    setDateMode("preset");
    setTripDate("");
    setSelectedCalDate(null);
    setTripDays(5);
    setAdultPrice(30000);
    setChildPrice(20000);
    setAdultPrice4d(25000);
    setChildPrice4d(18000);
    setShowForm(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalName || !finalTripDate) return;
    await createMutation.mutateAsync({
      name: finalName,
      description: finalDesc || undefined,
      tripDate: finalTripDate,
      isStandard,
      showDaySelector,
      adultPrice,
      childPrice,
      adultPrice4d: showDaySelector ? adultPrice4d : undefined,
      childPrice4d: showDaySelector ? childPrice4d : undefined,
    });
  };

  const handleToggleActive = async (id: number, currentActive: boolean) => {
    await updateMutation.mutateAsync({ id, active: !currentActive });
  };

  const handleDelete = async (id: number, templateName: string) => {
    if (!confirm(`確定要刪除「${templateName}」嗎？此操作無法復原。`)) return;
    await deleteMutation.mutateAsync({ id });
  };

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/b/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const templates = templatesQuery.data ?? [];

  // Highlighted dates from existing templates
  const highlightedDates = useMemo(
    () => parseTemplateDates(templates),
    [templates]
  );

  const handleCalDateSelect = (d: Date) => {
    setSelectedCalDate(d);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="CCPS" className="h-7 w-auto" />
            <span className="text-lg font-bold text-gray-800">行程方案管理</span>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 bg-[#1a8a7d] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#15756a] transition-colors"
          >
            <Plus className="w-4 h-4" />
            新增方案
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-6">
        {/* ── Create Form ── */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5">建立新行程方案</h2>
            <form onSubmit={handleCreate} className="space-y-5">

              {/* 方案名稱 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  方案名稱 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setNameMode("standard")}
                    className={`px-4 py-2 rounded-lg text-sm font-bold border-2 transition-all ${
                      nameMode === "standard"
                        ? "border-[#1a8a7d] bg-[#1a8a7d]/10 text-[#1a8a7d]"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    標準方案
                  </button>
                  <button
                    type="button"
                    onClick={() => setNameMode("custom")}
                    className={`px-4 py-2 rounded-lg text-sm font-bold border-2 transition-all ${
                      nameMode === "custom"
                        ? "border-[#1a8a7d] bg-[#1a8a7d]/10 text-[#1a8a7d]"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    自訂名稱
                  </button>
                </div>
                {nameMode === "standard" && (
                  <div className="px-4 py-2.5 rounded-lg bg-[#1a8a7d]/5 border border-[#1a8a7d]/20 text-sm text-[#1a8a7d] font-medium">
                    報名頁標題將顯示「CCPS客制化考察行程費用試算」
                  </div>
                )}
                {nameMode === "custom" && (
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="例：馬來西亞深度五日考察團"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-[#1a8a7d] focus:ring-2 focus:ring-[#1a8a7d]/20 outline-none text-sm"
                  />
                )}
              </div>

              {/* 方案描述 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  方案描述
                </label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setDescMode("standard")}
                    className={`px-4 py-2 rounded-lg text-sm font-bold border-2 transition-all ${
                      descMode === "standard"
                        ? "border-[#1a8a7d] bg-[#1a8a7d]/10 text-[#1a8a7d]"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    標準模式
                  </button>
                  <button
                    type="button"
                    onClick={() => setDescMode("custom")}
                    className={`px-4 py-2 rounded-lg text-sm font-bold border-2 transition-all ${
                      descMode === "custom"
                        ? "border-[#1a8a7d] bg-[#1a8a7d]/10 text-[#1a8a7d]"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    自訂描述
                  </button>
                </div>
                {descMode === "standard" && (
                  <div className="px-4 py-2.5 rounded-lg bg-[#1a8a7d]/5 border border-[#1a8a7d]/20 text-sm text-[#1a8a7d] font-medium">
                    報名頁將顯示「三天兩夜」及「四天三夜」方案選擇按鈕
                  </div>
                )}
                {descMode === "custom" && (
                  <textarea
                    value={customDesc}
                    onChange={(e) => setCustomDesc(e.target.value)}
                    placeholder="例：吉隆坡導覽＋國際學校參觀＋建案參觀"
                    rows={2}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-[#1a8a7d] focus:ring-2 focus:ring-[#1a8a7d]/20 outline-none text-sm resize-none"
                  />
                )}
              </div>

              {/* 出團日期 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  出團日期 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setDateMode("preset")}
                    className={`px-4 py-2 rounded-lg text-sm font-bold border-2 transition-all ${
                      dateMode === "preset"
                        ? "border-[#1a8a7d] bg-[#1a8a7d]/10 text-[#1a8a7d]"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    直接輸入
                  </button>
                  <button
                    type="button"
                    onClick={() => setDateMode("custom")}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold border-2 transition-all ${
                      dateMode === "custom"
                        ? "border-[#1a8a7d] bg-[#1a8a7d]/10 text-[#1a8a7d]"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <CalendarIcon className="w-3.5 h-3.5" />
                    自訂日期
                  </button>
                </div>
                {dateMode === "preset" && (
                  <input
                    type="text"
                    value={tripDate}
                    onChange={(e) => setTripDate(e.target.value)}
                    placeholder="例：4/29(四)-5/3(一)"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-[#1a8a7d] focus:ring-2 focus:ring-[#1a8a7d]/20 outline-none text-sm"
                  />
                )}
                {dateMode === "custom" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-bold text-gray-500">行程天數：</label>
                      {[3, 4, 5, 6, 7].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setTripDays(d)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            tripDays === d
                              ? "border-[#1a8a7d] bg-[#1a8a7d] text-white"
                              : "border-gray-200 text-gray-500 hover:border-gray-300"
                          }`}
                        >
                          {d}天
                        </button>
                      ))}
                    </div>
                    <MiniCalendar
                      selectedDate={selectedCalDate}
                      onSelectDate={handleCalDateSelect}
                      highlightedDates={highlightedDates}
                    />
                    {selectedCalDate && (
                      <div className="px-4 py-2.5 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-700 font-medium">
                        已選擇：{formatDateRange(selectedCalDate, tripDays)}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 價格 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  費用設定
                </label>
                {showDaySelector ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-xs font-bold text-gray-500 mb-3">三天兩夜方案</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">成人價格 (NT$)</label>
                          <input
                            type="number"
                            min={0}
                            value={adultPrice}
                            onChange={(e) => setAdultPrice(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#1a8a7d] focus:ring-2 focus:ring-[#1a8a7d]/20 outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">兒童價格 (NT$)</label>
                          <input
                            type="number"
                            min={0}
                            value={childPrice}
                            onChange={(e) => setChildPrice(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#1a8a7d] focus:ring-2 focus:ring-[#1a8a7d]/20 outline-none text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-xs font-bold text-gray-500 mb-3">四天三夜方案</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">成人價格 (NT$)</label>
                          <input
                            type="number"
                            min={0}
                            value={adultPrice4d}
                            onChange={(e) => setAdultPrice4d(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#1a8a7d] focus:ring-2 focus:ring-[#1a8a7d]/20 outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">兒童價格 (NT$)</label>
                          <input
                            type="number"
                            min={0}
                            value={childPrice4d}
                            onChange={(e) => setChildPrice4d(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#1a8a7d] focus:ring-2 focus:ring-[#1a8a7d]/20 outline-none text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">成人價格 (NT$)</label>
                      <input
                        type="number"
                        min={0}
                        value={adultPrice}
                        onChange={(e) => setAdultPrice(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-[#1a8a7d] focus:ring-2 focus:ring-[#1a8a7d]/20 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">兒童價格 (NT$)</label>
                      <input
                        type="number"
                        min={0}
                        value={childPrice}
                        onChange={(e) => setChildPrice(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-[#1a8a7d] focus:ring-2 focus:ring-[#1a8a7d]/20 outline-none text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={createMutation.isPending || !finalName || !finalTripDate}
                  className="flex items-center gap-2 bg-[#1a8a7d] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#15756a] disabled:opacity-50 transition-colors"
                >
                  {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  建立方案並生成連結
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Templates List ── */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800">
            所有方案 ({templates.length})
          </h2>

          {templatesQuery.isLoading && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-[#1a8a7d] animate-spin mx-auto" />
            </div>
          )}

          {templates.length === 0 && !templatesQuery.isLoading && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-400 text-sm">尚未建立任何行程方案</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 text-[#1a8a7d] text-sm font-bold hover:underline"
              >
                建立第一個方案
              </button>
            </div>
          )}

          {templates.map((t) => (
            <div
              key={t.id}
              className={`bg-white rounded-xl shadow-sm border p-5 transition-all ${
                t.active ? "border-gray-200" : "border-gray-200 opacity-60"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-base font-bold text-gray-800 truncate">
                      {t.name}
                    </h3>
                    {t.isStandard && (
                      <span className="text-xs bg-[#1a8a7d]/10 text-[#1a8a7d] px-2 py-0.5 rounded-full font-bold">
                        標準方案
                      </span>
                    )}
                    {t.showDaySelector && (
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                        天數選擇
                      </span>
                    )}
                    {!t.active && (
                      <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-bold">
                        已停用
                      </span>
                    )}
                  </div>
                  {t.description && (
                    <p className="text-sm text-gray-500 mb-2">{t.description}</p>
                  )}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span>出團：{t.tripDate}</span>
                    <span>成人 NT${t.adultPrice.toLocaleString()}</span>
                    <span>兒童 NT${t.childPrice.toLocaleString()}</span>
                    {t.adultPrice4d != null && (
                      <span>4天成人 NT${t.adultPrice4d.toLocaleString()}</span>
                    )}
                    {t.childPrice4d != null && (
                      <span>4天兒童 NT${t.childPrice4d.toLocaleString()}</span>
                    )}
                    <span>建立：{new Date(t.createdAt).toLocaleDateString("zh-TW")}</span>
                  </div>

                  {/* Link */}
                  <div className="mt-3 flex items-center gap-2">
                    <code className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-mono truncate max-w-xs md:max-w-md">
                      {window.location.origin}/b/{t.slug}
                    </code>
                    <button
                      onClick={() => copyLink(t.slug)}
                      className="flex items-center gap-1 text-xs text-[#1a8a7d] font-bold hover:underline flex-shrink-0"
                    >
                      {copiedSlug === t.slug ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          已複製
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          複製
                        </>
                      )}
                    </button>
                    <a
                      href={`/b/${t.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-600 font-bold hover:underline flex-shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      預覽
                    </a>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggleActive(t.id, t.active)}
                    disabled={updateMutation.isPending}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${
                      t.active
                        ? "border-amber-300 text-amber-700 hover:bg-amber-50"
                        : "border-green-300 text-green-700 hover:bg-green-50"
                    }`}
                  >
                    {t.active ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        停用
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        啟用
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(t.id, t.name)}
                    disabled={deleteMutation.isPending}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    刪除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
