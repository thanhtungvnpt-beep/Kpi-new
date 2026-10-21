import React, { useState } from 'react';
import {
  Server,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RotateCw,
  ExternalLink,
  ShieldAlert,
  Info,
  X,
  User,
  Phone,
  FileText,
} from 'lucide-react';
import { SourceSystemHealth } from '../types';

interface SourceHealthMatrixProps {
  sources: SourceSystemHealth[];
  onTriggerPreflight: (sourceId: string) => void;
  preflightingSourceId?: string | null;
}

export const SourceHealthMatrix: React.FC<SourceHealthMatrixProps> = ({
  sources,
  onTriggerPreflight,
  preflightingSourceId,
}) => {
  const [selectedSource, setSelectedSource] = useState<SourceSystemHealth | null>(null);

  const getProtocolBadge = (protocol: string) => {
    switch (protocol) {
      case 'OPC-UA':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'MQTT':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'SAP_RFC':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'SFTP_CSV':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'WEBHOOK':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getConnectionBadge = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            CONNECTED
          </span>
        );
      case 'INTERMITTENT':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            INTERMITTENT
          </span>
        );
      case 'OFFLINE':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            OFFLINE
          </span>
        );
    }
  };

  const getQualityBadge = (quality: string) => {
    switch (quality) {
      case 'EXCELLENT':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
            CLEAN / PASS
          </span>
        );
      case 'WARNINGS':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
            WARNINGS
          </span>
        );
      case 'CRITICAL_QUARANTINE':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
            QUARANTINE
          </span>
        );
      case 'STALE':
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700 border border-slate-300">
            STALE DATA
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-slate-800" />
            <h2 className="text-xs font-bold text-slate-900 tracking-tight">
              Tổng quan Tình trạng Nguồn Dữ liệu (Source Ingestion Health Matrix)
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              6 Ingestion Channels
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Phân biệt độc lập giữa <strong className="text-slate-700">Trạng thái Kỹ thuật Kết nối</strong> và <strong className="text-slate-700">Chất lượng Dữ liệu Nội dung</strong> (Không suy đoán dữ liệu tốt chỉ từ việc kết nối thành công).
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50">
              <th className="py-2.5 px-3">Hệ thống Nguồn & Giao thức</th>
              <th className="py-2.5 px-3 text-center">Kết nối Kỹ thuật</th>
              <th className="py-2.5 px-3 text-center">Chất lượng Dữ liệu</th>
              <th className="py-2.5 px-3 text-center">Đồng bộ Gần nhất</th>
              <th className="py-2.5 px-3 text-center">Dự kiến vs Thực nhận</th>
              <th className="py-2.5 px-3 text-center">Lỗi tồn đọng</th>
              <th className="py-2.5 px-3">Chủ sở hữu (Owner)</th>
              <th className="py-2.5 px-3 text-right">Preflight Check</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sources.map((src) => {
              const isPreflighting = preflightingSourceId === src.id;
              return (
                <tr
                  key={src.id}
                  onClick={() => setSelectedSource(src)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 block">{src.name}</span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${getProtocolBadge(
                          src.protocol
                        )}`}
                      >
                        {src.protocol}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5 truncate max-w-[240px]">
                      {src.description}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    {getConnectionBadge(src.connectionStatus)}
                  </td>

                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    {getQualityBadge(src.dataQualityHealth)}
                  </td>

                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span className="text-[11px] font-medium text-slate-700 block">
                      {src.lastSyncTimestamp}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {src.averageLatencyMs > 0 ? `${src.averageLatencyMs}ms latency` : 'No ping'}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <div className="text-[11px] font-bold text-slate-800 tabular-nums">
                      {src.receivedRecords.toLocaleString()} / {src.expectedRecords.toLocaleString()}
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-0.5">
                      <span
                        className={`text-[9px] font-semibold ${
                          src.driftPercentage === 0
                            ? 'text-emerald-600'
                            : src.driftPercentage < 1
                            ? 'text-amber-600'
                            : 'text-rose-600'
                        }`}
                      >
                        {src.driftPercentage === 0
                          ? '0% Drift'
                          : `Lệch ${src.driftPercentage.toFixed(1)}%`}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-center">
                    {src.unresolvedErrorsCount > 0 ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                        {src.unresolvedErrorsCount}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-semibold">—</span>
                    )}
                  </td>

                  <td className="py-3 px-3">
                    <span className="text-xs font-semibold text-slate-800 block truncate max-w-[180px]">
                      {src.sourceOwner}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate max-w-[180px]">
                      {src.ownerContact}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTriggerPreflight(src.id);
                      }}
                      disabled={isPreflighting}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-bold inline-flex items-center gap-1 transition-colors border border-slate-200 cursor-pointer"
                    >
                      <RotateCw
                        className={`w-3 h-3 text-blue-600 ${isPreflighting ? 'animate-spin' : ''}`}
                      />
                      <span>{isPreflighting ? 'Testing...' : 'Preflight'}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Source Detail Modal */}
      {selectedSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="px-5 py-3.5 bg-[#0b1426] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-sm tracking-tight">
                  Chi tiết Nguồn Dữ liệu: {selectedSource.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSource(null)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 text-xs space-y-3.5">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Mô tả tích hợp
                </span>
                <p className="text-slate-800 font-medium">{selectedSource.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-medium block">Giao thức kết nối</span>
                  <span className="text-xs font-bold text-slate-900 font-mono">
                    {selectedSource.protocol}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-medium block">Độ trễ trung bình</span>
                  <span className="text-xs font-bold text-indigo-700">
                    {selectedSource.averageLatencyMs} ms
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-medium block">Kết nối kỹ thuật</span>
                  <div className="mt-1">{getConnectionBadge(selectedSource.connectionStatus)}</div>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-medium block">Chất lượng dữ liệu</span>
                  <div className="mt-1">{getQualityBadge(selectedSource.dataQualityHealth)}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Số bản ghi dự kiến:</span>
                  <strong className="text-slate-800">{selectedSource.expectedRecords.toLocaleString()} recs</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Số bản ghi thực nhận:</span>
                  <strong className="text-slate-800">{selectedSource.receivedRecords.toLocaleString()} recs</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tỷ lệ rơi rớt / Drift:</span>
                  <strong className={selectedSource.driftPercentage > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                    {selectedSource.driftPercentage.toFixed(2)}%
                  </strong>
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg space-y-1">
                <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">
                  Đầu mối liên hệ & Escalation SLA:
                </span>
                <p className="text-blue-950 font-semibold">{selectedSource.sourceOwner}</p>
                <p className="text-blue-700 text-[11px]">{selectedSource.ownerContact}</p>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                <button
                  onClick={() => {
                    onTriggerPreflight(selectedSource.id);
                    setSelectedSource(null);
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Chạy Preflight Protocol Check</span>
                </button>
                <button
                  onClick={() => setSelectedSource(null)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
