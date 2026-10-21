import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Search,
  Database,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
} from 'lucide-react';
import { ReconciliationBatch } from '../types';

interface ReconciliationPipelineTabProps {
  batches: ReconciliationBatch[];
  onTriggerReconcile: () => void;
  isReconciling?: boolean;
}

export const ReconciliationPipelineTab: React.FC<ReconciliationPipelineTabProps> = ({
  batches,
  onTriggerReconcile,
  isReconciling = false,
}) => {
  const [selectedBatch, setSelectedBatch] = useState<ReconciliationBatch | null>(null);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3.5 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h2 className="text-xs font-bold text-slate-900 tracking-tight">
              Đối soát Nguồn - Đích & Nguồn gốc Dữ liệu (Source-to-Target Reconciliation)
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              100% Accounting Law
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Bảo đảm mọi bản ghi nhận từ nguồn đều được hạch toán đầy đủ: <strong>Thực nhận = Đạt chuẩn + Cách ly</strong> (Không để thất thoát số liệu).
          </p>
        </div>

        <button
          onClick={onTriggerReconcile}
          disabled={isReconciling}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0 self-start sm:self-auto"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isReconciling ? 'animate-spin' : ''}`} />
          <span>{isReconciling ? 'Đang đối soát toàn kho...' : 'Chạy Đối soát Tự động (Reconcile)'}</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">1. Raw Received</span>
          <span className="text-xl font-black text-slate-900 tabular-nums">6,810 recs</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Nhận từ 6 kênh nguồn</span>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">2. Normalized Staged</span>
          <span className="text-xl font-black text-slate-900 tabular-nums">6,794 recs</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Lệch 16 recs (Format error)</span>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">3. Validation Passed</span>
          <span className="text-xl font-black text-emerald-600 tabular-nums">6,786 recs</span>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Vào KPI Store chính thức</span>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">4. Quarantined</span>
          <span className="text-xl font-black text-amber-600 tabular-nums">8 recs</span>
          <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">Đang xử lý ngoại lệ</span>
        </div>
      </div>

      {/* Batches Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
              <th className="py-2.5 px-3">Batch ID & Thời gian</th>
              <th className="py-2.5 px-3">Hệ thống Nguồn</th>
              <th className="py-2.5 px-3 text-center">Gốc (Raw)</th>
              <th className="py-2.5 px-3 text-center">Chuẩn hóa</th>
              <th className="py-2.5 px-3 text-center">Đạt chuẩn (Passed)</th>
              <th className="py-2.5 px-3 text-center">Cách ly (Quarantine)</th>
              <th className="py-2.5 px-3 text-center">Cam kết KPI</th>
              <th className="py-2.5 px-3 text-center">Cân bằng Đối soát</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {batches.map((b) => (
              <tr
                key={b.batchId}
                onClick={() => setSelectedBatch(b)}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer"
              >
                <td className="py-2.5 px-3">
                  <span className="font-bold text-slate-900 block font-mono text-[11px]">{b.batchId}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{b.timestamp}</span>
                </td>
                <td className="py-2.5 px-3 font-semibold text-blue-700">{b.sourceSystem}</td>
                <td className="py-2.5 px-3 text-center tabular-nums text-slate-700">{b.rawReceived.toLocaleString()}</td>
                <td className="py-2.5 px-3 text-center tabular-nums text-slate-700">{b.normalized.toLocaleString()}</td>
                <td className="py-2.5 px-3 text-center tabular-nums text-emerald-600 font-bold">
                  {b.validationPassed.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-center tabular-nums text-amber-600 font-bold">
                  {b.quarantined}
                </td>
                <td className="py-2.5 px-3 text-center tabular-nums text-slate-900 font-black">
                  {b.kpiCommitted.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-center">
                  {b.reconciliationStatus === '100%_BALANCED' ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      100% Balanced
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      Lệch {b.discrepancyCount} recs
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lineage Trace Drawer if selected */}
      {selectedBatch && (
        <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-lg text-xs space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-blue-700" />
              <span>Nguồn gốc Dữ liệu (Data Lineage) của Lô: {selectedBatch.batchId}</span>
            </span>
            <button
              onClick={() => setSelectedBatch(null)}
              className="text-slate-400 hover:text-slate-700 font-bold"
            >
              ✕
            </button>
          </div>
          <p className="text-slate-700 text-[11px]">
            Hệ thống nguồn: <strong>{selectedBatch.sourceSystem}</strong> | Nhận lúc: <strong>{selectedBatch.timestamp}</strong>.
            Được tiếp nhận qua Kafka Topic <code className="bg-white px-1 py-0.2 rounded border">mes.telemetry.v1</code>,
            chuyển vào Staging Lake, sau đó chạy qua 8 quy tắc của Validation Engine.
            {selectedBatch.quarantined > 0 ? (
              <span className="text-amber-800 font-semibold block mt-1">
                ⚠️ Có {selectedBatch.quarantined} bản ghi không thỏa mãn quy tắc bị chuyển hướng vào Quarantine Pool. {selectedBatch.kpiCommitted} bản ghi sạch đã commit vào PostgreSQL Gold KPI Store.
              </span>
            ) : (
              <span className="text-emerald-800 font-semibold block mt-1">
                ✓ 100% bản ghi sạch đã commit thành công vào PostgreSQL Gold KPI Store.
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};
