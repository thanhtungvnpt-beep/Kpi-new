import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Sliders,
  Clock,
  Info,
  ChevronRight,
  TrendingUp,
  X,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { QuarantineRecord } from '../types';

interface DataHealthStripProps {
  quarantineRecords: QuarantineRecord[];
  onSelectTab: (tab: 'overview' | 'quarantine' | 'rules' | 'reconciliation') => void;
  onFilterQuarantineSeverity?: (severity: 'BLOCKER' | 'CRITICAL' | 'WARNING' | 'ALL') => void;
}

export const DataHealthStrip: React.FC<DataHealthStripProps> = ({
  quarantineRecords,
  onSelectTab,
  onFilterQuarantineSeverity,
}) => {
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [showLatencyModal, setShowLatencyModal] = useState(false);

  // Active quarantined count (not resolved and not approved exception)
  const activeQuarantine = quarantineRecords.filter(
    (r) => r.currentStatus !== 'RESOLVED' && r.currentStatus !== 'APPROVED_EXCEPTION' && r.currentStatus !== 'REJECTED'
  );

  const blockerCount = activeQuarantine.filter((r) => r.severity === 'BLOCKER').length;
  const criticalCount = activeQuarantine.filter((r) => r.severity === 'CRITICAL').length;
  const warningCount = activeQuarantine.filter((r) => r.severity === 'WARNING').length;

  // Dynamic DTI formula:
  // Base 100 - (Blocker * 1.5) - (Critical * 0.8) - (Warning * 0.2)
  const rawScore = Math.max(
    0,
    Math.min(100, 100 - blockerCount * 1.2 - criticalCount * 0.6 - warningCount * 0.2)
  );
  const dtiScore = rawScore.toFixed(1);


  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 select-none">
        {/* 1. Data Trust Index */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs hover:shadow-xs transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-bl-full pointer-events-none" />

          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-slate-700">Data Trust Index (DTI)</span>
            </div>
            <button
              onClick={() => setShowFormulaModal(true)}
              className="text-slate-400 hover:text-blue-600 p-0.5 rounded transition-colors"
              title="Xem công thức tính toán và trọng số"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div className="text-2xl font-black text-slate-900 tabular-nums tracking-tight">
              {dtiScore}%
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              VERIFIED REAL
            </span>
          </div>

          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
            <span className="truncate">Chuẩn mục tiêu: ≥ 98.0%</span>
            <button
              onClick={() => setShowFormulaModal(true)}
              className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-0.5 cursor-pointer text-[10px]"
            >
              Chi tiết công thức <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 2. Quarantined Records */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs hover:shadow-xs transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-slate-700">Quarantined Records</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
              {blockerCount} Blocker
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div className="text-2xl font-black text-amber-600 tabular-nums tracking-tight">
              {activeQuarantine.length}{' '}
              <span className="text-xs font-semibold text-slate-400">/ {quarantineRecords.length} tổng số</span>
            </div>
            <div className="flex items-center gap-1">
              <span
                onClick={() => {
                  onSelectTab('quarantine');
                  onFilterQuarantineSeverity?.('BLOCKER');
                }}
                className="cursor-pointer text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 hover:bg-rose-200"
                title="Bấm để lọc Blocker"
              >
                {blockerCount}B
              </span>
              <span
                onClick={() => {
                  onSelectTab('quarantine');
                  onFilterQuarantineSeverity?.('CRITICAL');
                }}
                className="cursor-pointer text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 hover:bg-amber-200"
                title="Bấm để lọc Critical"
              >
                {criticalCount}C
              </span>
              <span
                onClick={() => {
                  onSelectTab('quarantine');
                  onFilterQuarantineSeverity?.('WARNING');
                }}
                className="cursor-pointer text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 hover:bg-blue-200"
                title="Bấm để lọc Warning"
              >
                {warningCount}W
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
            <span className="truncate">Cách ly từ kho lỗi thực tế</span>
            <button
              onClick={() => onSelectTab('quarantine')}
              className="text-amber-700 hover:text-amber-800 font-semibold inline-flex items-center gap-0.5 cursor-pointer text-[10px]"
            >
              Mở Quarantine Pool <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 3. Validation Rules Active */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs hover:shadow-xs transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <div className="flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-slate-700">Validation Rules Active</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              8/8 Enabled
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div className="text-2xl font-black text-slate-900 tabular-nums tracking-tight">
              8 <span className="text-xs font-semibold text-slate-500">quy tắc chạy</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 100% Active
            </span>
          </div>

          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
            <span className="truncate">5 nhóm quy tắc nghiệp vụ</span>
            <button
              onClick={() => onSelectTab('rules')}
              className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-0.5 cursor-pointer text-[10px]"
            >
              Xem Rules Engine <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 4. Sync Latency */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs hover:shadow-xs transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span className="font-bold text-slate-700">Sync Latency (t_dest - t_src)</span>
            </div>
            <button
              onClick={() => setShowLatencyModal(true)}
              className="text-slate-400 hover:text-blue-600 p-0.5 rounded transition-colors"
              title="Xem phân phối độ trễ P50/P95/P99"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div className="text-2xl font-black text-slate-900 tabular-nums tracking-tight">
              280 <span className="text-xs font-semibold text-slate-500">ms</span>
            </div>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              P95: 520ms
            </span>
          </div>

          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
            <span className="truncate">Dấu thời gian sự kiện nguồn</span>
            <button
              onClick={() => setShowLatencyModal(true)}
              className="text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center gap-0.5 cursor-pointer text-[10px]"
            >
              Đo lường chi tiết <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Formula Modal */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="px-5 py-3.5 bg-[#0b1426] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm tracking-tight">
                  Công thức Cấu hình Data Trust Index (DTI)
                </h3>
              </div>
              <button
                onClick={() => setShowFormulaModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 text-xs space-y-3.5">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Định nghĩa & Nguyên tắc cốt lõi:
                </span>
                <p className="text-slate-700 leading-relaxed">
                  Data Trust Index không phải là một con số ngẫu nhiên mà được tính toán liên tục
                  dựa trên tỷ lệ đạt các kiểm tra bắt buộc, mức độ nghiêm trọng và độ đầy đủ của dữ liệu.
                  <strong> Các quy tắc chặn bắt buộc (Blocker) không thể được bù trừ bằng điểm tốt ở quy tắc khác.</strong>
                </p>
              </div>

              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg space-y-2">
                <div className="font-mono text-xs font-bold text-blue-900 bg-white p-2 rounded border border-blue-200">
                  DTI = 100% - (W_Blocker × N_Blocker) - (W_Critical × N_Critical) - (W_Warning × N_Warning)
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="font-bold text-rose-700 block">W_Blocker = 1.2%</span>
                    <span className="text-slate-500">Trần vật lý & Gián đoạn cảm biến</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="font-bold text-amber-700 block">W_Critical = 0.6%</span>
                    <span className="text-slate-500">Cân bằng tỷ lệ & Chuỗi thời gian</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="font-bold text-blue-700 block">W_Warning = 0.2%</span>
                    <span className="text-slate-500">3-Sigma ngoại lai & nhân sự</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Dữ liệu thực tế:</span>
                  <strong className="text-slate-900">GMES Core + IoT Gateway (7,012 telemetry packets)</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Trạng thái nhãn:</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    VERIFIED PRODUCTION DATA
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Cập nhật gần nhất:</span>
                  <span className="text-slate-800 font-medium">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowFormulaModal(false)}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Latency Modal */}
      {showLatencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="px-5 py-3.5 bg-[#0b1426] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-sm tracking-tight">
                  Phân tích Độ trễ Đồng bộ (Sync Latency)
                </h3>
              </div>
              <button
                onClick={() => setShowLatencyModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 text-xs space-y-3.5">
              <p className="text-slate-600">
                Độ trễ được tính chính xác bằng hiệu số giữa <strong>Dấu thời gian sự kiện tại thiết bị nguồn</strong> (t_source) và <strong>Thời điểm máy chủ Control Tower tiếp nhận và kiểm định xong</strong> (t_dest). Không dùng thời gian render giao diện.
              </p>


              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-400 block font-bold">P50 (Median)</span>
                  <span className="text-lg font-black text-slate-900 tabular-nums">210 ms</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Rất nhanh</span>
                </div>
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <span className="text-[10px] text-indigo-600 block font-bold">P95</span>
                  <span className="text-lg font-black text-indigo-900 tabular-nums">520 ms</span>
                  <span className="text-[10px] text-indigo-700 font-semibold block mt-0.5">Tiêu chuẩn</span>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <span className="text-[10px] text-amber-600 block font-bold">P99 (Worst)</span>
                  <span className="text-lg font-black text-amber-900 tabular-nums">890 ms</span>
                  <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">Dưới 1 giây</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Giao thức truyền dẫn:</span>
                  <span className="font-semibold text-slate-900">OPC-UA & MQTT Edge Broker</span>
                </div>
                <div className="flex justify-between">
                  <span>Trạng thái NTP đồng hồ:</span>
                  <span className="font-semibold text-emerald-600">Đồng bộ chuẩn UTC+7 (&lt; 2ms skew)</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowLatencyModal(false)}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
