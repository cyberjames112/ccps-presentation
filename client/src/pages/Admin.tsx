import { useState } from "react";
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
} from "lucide-react";

const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663123178525/fDCYNs6656b7JMsC7bMdFf/logo_ec5529c5.png";

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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tripDate, setTripDate] = useState("");
  const [adultPrice, setAdultPrice] = useState(30000);
  const [childPrice, setChildPrice] = useState(20000);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setDescription("");
    setTripDate("");
    setAdultPrice(30000);
    setChildPrice(20000);
    setShowForm(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !tripDate) return;
    await createMutation.mutateAsync({
      name,
      description: description || undefined,
      tripDate,
      adultPrice,
      childPrice,
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
        {/* Create Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">建立新行程方案</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    方案名稱 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例：馬來西亞深度五日考察團"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-[#1a8a7d] focus:ring-2 focus:ring-[#1a8a7d]/20 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    出團日期 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={tripDate}
                    onChange={(e) => setTripDate(e.target.value)}
                    placeholder="例：4/29(四)-5/3(一)"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-[#1a8a7d] focus:ring-2 focus:ring-[#1a8a7d]/20 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  方案描述
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="例：吉隆坡導覽＋國際學校參觀＋建案參觀"
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-[#1a8a7d] focus:ring-2 focus:ring-[#1a8a7d]/20 outline-none text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    成人價格 (NT$)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={adultPrice}
                    onChange={(e) => setAdultPrice(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-[#1a8a7d] focus:ring-2 focus:ring-[#1a8a7d]/20 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    兒童價格 (NT$)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={childPrice}
                    onChange={(e) => setChildPrice(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-[#1a8a7d] focus:ring-2 focus:ring-[#1a8a7d]/20 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
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

        {/* Templates List */}
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
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-gray-800 truncate">
                      {t.name}
                    </h3>
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
