import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, FileText, Send } from 'lucide-react';

interface QuickActionModalProps {
  actionTitle: string | null;
  onClose: () => void;
  onSubmitSuccess?: (message: string) => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  actionTitle,
  onClose,
  onSubmitSuccess,
}) => {
  const [vendor, setVendor] = useState('HSTEC');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('High');
  const [category, setCategory] = useState('Equipment');
  const [submitted, setSubmitted] = useState(false);

  if (!actionTitle) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onSubmitSuccess?.(`Thực hiện thành công "${actionTitle}" cho nhà cung cấp ${vendor}!`);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#0c1527] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-bold text-sm tracking-tight">{actionTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Đã cập nhật hệ thống VOMS</h4>
            <p className="text-xs text-slate-500">
              Yêu cầu của bạn đã được chuyển tới trung tâm vận hành và GMES.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Chọn Nhà cung cấp / Đối tác
              </label>
              <select
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="HSTEC">HSTEC (Thai Nguyen)</option>
                <option value="KHV">KHV (Bac Ninh)</option>
                <option value="DREAM TECH">DREAM TECH (Hai Duong)</option>
                <option value="KTECH">KTECH (Da Nang)</option>
                <option value="HOJEONGB">HOJEONGB (Dong Nai)</option>
                <option value="HOJEONG VINA">HOJEONG VINA (Binh Duong)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Hạng mục / Phân loại
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                >
                  <option value="Equipment">Thiết bị (Equipment)</option>
                  <option value="Material">Vật tư (Material)</option>
                  <option value="Quality">Chất lượng (Quality)</option>
                  <option value="Manpower">Nhân lực (Manpower)</option>
                  <option value="Delivery">Giao hàng (Delivery)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mức độ ưu tiên
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-semibold"
                >
                  <option value="Critical" className="text-rose-600 font-bold">
                    Critical (Khẩn cấp)
                  </option>
                  <option value="High" className="text-amber-600 font-semibold">
                    High (Cao)
                  </option>
                  <option value="Medium">Medium (Trung bình)</option>
                  <option value="Low">Low (Thấp)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Chi tiết nội dung / Ghi chú
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập thông tin chi tiết lệnh hoặc sự cố cần xử lý..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Xác nhận gửi</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
