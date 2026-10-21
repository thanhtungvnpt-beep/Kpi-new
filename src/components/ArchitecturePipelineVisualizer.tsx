import React, { useState } from 'react';
import {
  Database,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck2,
  Lock,
  Layers,
  Sparkles,
  Play,
  RotateCw,
} from 'lucide-react';

interface ArchitecturePipelineVisualizerProps {
  onSimulateIngestion?: () => void;
  isSimulating?: boolean;
}

export const ArchitecturePipelineVisualizer: React.FC<ArchitecturePipelineVisualizerProps> = ({
  onSimulateIngestion,
  isSimulating = false,
}) => {
  const [selectedStage, setSelectedStage] = useState<number | null>(null);

  const stages = [
    {
      id: 1,
      title: 'DATA SOURCE',
      subtitle: 'GMES, IoT, ERP, API',
      badge: '6 Sources',
      status: 'active',
      desc: 'Nguồn phát sinh sự kiện: GMES MES, 24 Edge Gateways, SAP RFC, File Upload, RPA.',
    },
    {
      id: 2,
      title: 'SOURCE PREFLIGHT',
      subtitle: 'Protocol & Schema Check',
      badge: 'Pass 99.8%',
      status: 'active',
      desc: 'Kiểm tra sơ bộ kết nối, xác thực token, kiểm tra schema định dạng JSON/CSV trước khi nuốt.',
    },
    {
      id: 3,
      title: 'DATA INGESTION',
      subtitle: 'Streaming & Micro-batch',
      badge: '7,012 rec/min',
      status: 'active',
      desc: 'Hàng đợi Kafka/RabbitMQ tiếp nhận gói tin bảo đảm thứ tự và idempotency (chống trùng lặp).',
    },
    {
      id: 4,
      title: 'RAW STAGING',
      subtitle: 'Immutable Raw Lake',
      badge: '100% Retained',
      status: 'active',
      desc: 'Lưu trữ nguyên trạng bản ghi gốc (Raw Payload) không chỉnh sửa để bảo đảm kiểm toán pháp lý.',
    },
    {
      id: 5,
      title: 'DATA NORMALIZATION',
      subtitle: 'Unit & Time Standard',
      badge: 'UTC+7 & ISO',
      status: 'active',
      desc: 'Chuẩn hóa định dạng số, chuyển đổi đơn vị đo (pcs, kg, h), chuẩn hóa múi giờ đồng bộ.',
    },
    {
      id: 6,
      title: 'VALIDATION ENGINE',
      subtitle: '5 Business Rule Tiers',
      badge: '8 Rules Active',
      status: 'warning',
      desc: 'Bộ quy tắc kiểm định: Giới hạn vật lý, Cân bằng toán học, Ngoại lai 3-Sigma, Trôi dạt đồng hồ.',
    },
    {
      id: 7,
      title: 'RECONCILIATION',
      subtitle: 'Source vs Target Audit',
      badge: '100% Balanced',
      status: 'active',
      desc: 'Đối soát số lượng bản ghi giữa hệ thống nguồn và đích. Phát hiện rơi rớt và lệch số liệu.',
    },
    {
      id: 8,
      title: 'TRIAGE & APPROVAL',
      subtitle: 'Quarantine / Override',
      badge: '4 Quarantined',
      status: 'warning',
      desc: 'Bản ghi lỗi bị cô lập vào Quarantine Pool. Phê duyệt ngoại lệ yêu cầu Segregation of Duties.',
    },
    {
      id: 9,
      title: 'KPI DATA STORE',
      subtitle: 'Certified Gold Layer',
      badge: '100% Trusted',
      status: 'active',
      desc: 'Kho dữ liệu KPI chính thức. Dữ liệu DEMO hoặc chưa kiểm định tuyệt đối không được ghi nhận.',
    },
    {
      id: 10,
      title: 'CONTROL TOWER',
      subtitle: 'Executive Dashboard',
      badge: '97.8% DTI',
      status: 'active',
      desc: 'Giao diện hiển thị điều hành thời gian thực cho Ban lãnh đạo và đối tác vendor.',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h2 className="text-xs font-bold text-slate-900 tracking-tight">
              Kiến trúc Luồng Kiểm soát Dữ liệu Đầu vào (End-to-End Governance Pipeline)
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Zero Contamination Policy
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Dữ liệu chưa vượt qua kiểm định bắt buộc hoặc chưa được phê duyệt ngoại lệ tuyệt đối không được tác động đến KPI chính thức.
          </p>
        </div>

        {onSimulateIngestion && (
          <button
            onClick={onSimulateIngestion}
            disabled={isSimulating}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 shrink-0 self-start sm:self-auto"
          >
            <RotateCw className={`w-3.5 h-3.5 text-blue-600 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Đang chạy mô phỏng luồng...' : 'Mô phỏng Gói tin (Dry-run)'}</span>
          </button>
        )}
      </div>

      {/* Horizontal Pipeline Steps */}
      <div className="overflow-x-auto pb-1 scrollbar-thin">
        <div className="flex items-stretch min-w-[980px] gap-1.5 py-1">
          {stages.map((st, idx) => {
            const isSelected = selectedStage === st.id;
            return (
              <React.Fragment key={st.id}>
                <div
                  onClick={() => setSelectedStage(isSelected ? null : st.id)}
                  className={`flex-1 min-w-[94px] p-2 rounded-lg border transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : st.status === 'warning'
                      ? 'border-amber-300 bg-amber-50/20 hover:border-amber-400'
                      : 'border-slate-200 bg-slate-50/40 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-mono font-bold text-slate-400">
                      0{st.id}
                    </span>
                    <span
                      className={`text-[8px] font-bold px-1 py-0.2 rounded ${
                        st.status === 'warning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {st.badge}
                    </span>
                  </div>

                  <h3 className="text-[10px] font-bold text-slate-900 leading-tight truncate">
                    {st.title}
                  </h3>
                  <p className="text-[9px] text-slate-500 truncate mt-0.5">
                    {st.subtitle}
                  </p>
                </div>

                {idx < stages.length - 1 && (
                  <div className="flex items-center justify-center text-slate-300 shrink-0">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Stage Detail Expansion Banner if selected */}
      {selectedStage !== null && (
        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs flex items-start justify-between gap-3 animate-in fade-in">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-blue-900">
                Giai đoạn 0{selectedStage}: {stages[selectedStage - 1].title} — {stages[selectedStage - 1].subtitle}
              </span>
              <span className="text-[10px] bg-blue-200 text-blue-800 px-1.5 py-0.2 rounded font-bold">
                {stages[selectedStage - 1].badge}
              </span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              {stages[selectedStage - 1].desc}
            </p>
          </div>
          <button
            onClick={() => setSelectedStage(null)}
            className="text-slate-400 hover:text-slate-700 font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
