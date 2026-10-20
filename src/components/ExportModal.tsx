import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [format, setFormat] = useState<'csv' | 'pdf' | 'excel'>('excel');
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      setTimeout(() => {
        setDownloaded(false);
        onClose();
      }, 1200);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95">
        <div className="px-5 py-3.5 bg-[#0c1527] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-sm tracking-tight">Xuất Báo Cáo Control Tower</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 text-xs space-y-4">
          <p className="text-slate-600">
            Dữ liệu bao gồm: 6 đối tác cung ứng, biểu đồ sản lượng 30 ngày, danh sách 5 sự cố rủi ro và các mốc tiến độ chính.
          </p>

          <div className="space-y-2">
            <label className="block font-semibold text-slate-700">Định dạng tập tin:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormat('excel')}
                className={`p-2.5 rounded-lg border text-center flex flex-col items-center gap-1 transition-all ${
                  format === 'excel'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <span>Excel (.xlsx)</span>
              </button>
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`p-2.5 rounded-lg border text-center flex flex-col items-center gap-1 transition-all ${
                  format === 'pdf'
                    ? 'border-rose-600 bg-rose-50 text-rose-800 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <FileText className="w-5 h-5 text-rose-600" />
                <span>PDF Summary</span>
              </button>
              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`p-2.5 rounded-lg border text-center flex flex-col items-center gap-1 transition-all ${
                  format === 'csv'
                    ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                <span>CSV Raw</span>
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
            >
              Đóng
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading || downloaded}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              {downloaded ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Đã tải xuống!</span>
                </>
              ) : downloading ? (
                <span>Đang kết xuất...</span>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải Báo Cáo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
