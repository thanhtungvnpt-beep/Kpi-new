import React, { useState } from 'react';
import {
  BrainCircuit,
  AlertTriangle,
  AlertOctagon,
  Clock,
  ArrowRight,
  ChevronDown,
  TrendingDown,
  TrendingUp,
  Zap,
  ShieldAlert,
  Info,
  X,
  CheckCircle2,
  ExternalLink,
  SlidersHorizontal,
  Layers,
} from 'lucide-react';
import { PREDICTIVE_BOTTLENECK_ALERTS } from '../data/predictiveAlertsData';
import { PredictiveBottleneckAlert } from '../types';

interface AIPredictiveAlertsCardProps {
  onApplyAction?: (actionText: string) => void;
  onSelectVendor?: (vendorId: string) => void;
  onOpenAIAssistant?: () => void;
}

export const AIPredictiveAlertsCard: React.FC<AIPredictiveAlertsCardProps> = ({
  onApplyAction,
  onSelectVendor,
  onOpenAIAssistant,
}) => {
  const [horizonFilter, setHorizonFilter] = useState<'all' | '24h' | '48h'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high'>('all');
  const [selectedAlertForModal, setSelectedAlertForModal] = useState<PredictiveBottleneckAlert | null>(null);

  // Filter alerts based on user selection
  const filteredAlerts = PREDICTIVE_BOTTLENECK_ALERTS.filter((alert) => {
    if (horizonFilter === '24h' && alert.timeHorizonHours > 24) return false;
    if (horizonFilter === '48h' && alert.timeHorizonHours > 48) return false;
    if (severityFilter === 'critical' && alert.severity !== 'CRITICAL') return false;
    if (severityFilter === 'high' && alert.severity !== 'CRITICAL' && alert.severity !== 'HIGH') return false;
    return true;
  });

  const criticalCount = PREDICTIVE_BOTTLENECK_ALERTS.filter((a) => a.severity === 'CRITICAL').length;
  const highCount = PREDICTIVE_BOTTLENECK_ALERTS.filter((a) => a.severity === 'HIGH').length;

  const getSeverityBadge = (severity: 'CRITICAL' | 'HIGH' | 'MEDIUM') => {
    switch (severity) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-700',
          dot: 'bg-rose-500',
          label: 'CRITICAL',
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
          dot: 'bg-amber-500',
          label: 'HIGH RISK',
        };
      case 'MEDIUM':
      default:
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-700',
          dot: 'bg-blue-500',
          label: 'MEDIUM',
        };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col justify-between h-full relative">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-indigo-600 text-white flex items-center justify-center text-[10px] shadow-xs">
              <BrainCircuit className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-bold text-slate-800">
                  AI Predictive Alerts
                </h2>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              </div>
            </div>
          </div>

          {/* Time Horizon Selector */}
          <div className="relative">
            <select
              value={horizonFilter}
              onChange={(e) => setHorizonFilter(e.target.value as any)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-semibold rounded px-2.5 py-1 pr-6 hover:border-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả (7 ngày)</option>
              <option value="24h">Trong 24h tới</option>
              <option value="48h">Trong 48h tới</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Prediction Summary Strip */}
        <div className="grid grid-cols-3 gap-1.5 mt-2 p-1.5 rounded-lg bg-indigo-50/50 border border-indigo-100/80 text-[10px]">
          <div className="text-center">
            <span className="text-slate-500 block">Dự báo nghẽn</span>
            <span className="font-bold text-slate-800 text-xs">
              {filteredAlerts.length} Đối tác
            </span>
          </div>
          <div className="text-center border-x border-indigo-100">
            <span className="text-slate-500 block">Mức khẩn cấp</span>
            <span className="font-bold text-rose-600 text-xs">
              {criticalCount} Critical • {highCount} High
            </span>
          </div>
          <div className="text-center">
            <span className="text-slate-500 block">Hụt sản lượng</span>
            <span className="font-bold text-amber-700 text-xs">-3,450 pcs</span>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-2 mt-2.5 flex-1 overflow-y-auto max-h-[220px] pr-0.5">
          {filteredAlerts.map((alert) => {
            const badge = getSeverityBadge(alert.severity);

            return (
              <div
                key={alert.id}
                className="p-2.5 rounded-lg border border-slate-200/90 hover:border-indigo-300 hover:bg-slate-50/80 transition-all text-xs group relative shadow-2xs"
              >
                {/* Alert Top Meta: Vendor & Horizon & Severity */}
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <button
                      onClick={() => onSelectVendor?.(alert.vendorId)}
                      className="font-bold text-blue-600 hover:text-blue-800 hover:underline text-[11px] truncate flex items-center gap-1 cursor-pointer"
                      title="Xem hồ sơ chi tiết đối tác"
                    >
                      <span>{alert.vendorName}</span>
                    </button>
                    <span className="text-slate-300">•</span>
                    <span className="text-[10px] text-slate-500 truncate">
                      {alert.plantName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border ${badge.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      {badge.label}
                    </span>
                  </div>
                </div>

                {/* Bottleneck Title */}
                <h3
                  onClick={() => setSelectedAlertForModal(alert)}
                  className="font-bold text-slate-800 text-[11px] leading-snug hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1"
                  title="Nhấn để xem phân tích dữ liệu lịch sử"
                >
                  {alert.title}
                </h3>

                {/* Historical Root Cause Preview */}
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {alert.historicalRootCause}
                </p>

                {/* Probability Bar & Key Metric Chip */}
                <div className="mt-2 flex items-center justify-between gap-2 pt-1.5 border-t border-slate-100">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex items-center gap-1 text-[10px] font-medium text-slate-600 shrink-0">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{alert.timeHorizonLabel}</span>
                    </div>

                    {/* Mini Probability Bar */}
                    <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden flex-1 max-w-[60px]">
                      <div
                        className={`h-full rounded-full ${
                          alert.probability >= 90
                            ? 'bg-rose-500'
                            : alert.probability >= 75
                            ? 'bg-amber-500'
                            : 'bg-blue-500'
                        }`}
                        style={{ width: `${alert.probability}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">
                      {alert.probability}%
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setSelectedAlertForModal(alert)}
                      className="px-2 py-0.5 rounded text-[10px] text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition-colors cursor-pointer"
                      title="Xem phân tích chi tiết dữ liệu lịch sử"
                    >
                      Chi tiết
                    </button>

                    <button
                      onClick={() =>
                        onApplyAction?.(alert.actionPayload || alert.suggestedAction)
                      }
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-medium transition-colors shadow-2xs cursor-pointer"
                      title="Thực hiện giải pháp ngăn ngừa được AI đề xuất"
                    >
                      <Zap className="w-2.5 h-2.5 text-yellow-300" />
                      <span>Xử lý</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Dữ liệu lịch sử GMES & ERP 30 ngày</span>
        </div>

        <button
          onClick={onOpenAIAssistant}
          className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Mở Copilot</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Deep-Dive Bottleneck Analysis Modal */}
      {selectedAlertForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">Phân Tích Dự Báo Điểm Nghẽn</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${
                        getSeverityBadge(selectedAlertForModal.severity).bg
                      }`}
                    >
                      {selectedAlertForModal.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {selectedAlertForModal.vendorName} • {selectedAlertForModal.plantName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedAlertForModal(null)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto space-y-4 text-xs">
              {/* Bottleneck Title & Risk Probability */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-800 text-sm">
                    {selectedAlertForModal.title}
                  </span>
                  <span className="text-indigo-600 font-bold text-sm">
                    {selectedAlertForModal.probability}% Xác suất
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      selectedAlertForModal.probability >= 90
                        ? 'bg-rose-500'
                        : selectedAlertForModal.probability >= 75
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${selectedAlertForModal.probability}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>Dự báo thời điểm xảy ra: <strong>{selectedAlertForModal.timeHorizonLabel}</strong></span>
                  <span>Độ tin cậy mô hình: <strong>{selectedAlertForModal.confidenceScore}%</strong></span>
                </div>
              </div>

              {/* Historical Root Cause Details */}
              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-1 flex items-center gap-1.5">
                  <AlertOctagon className="w-3.5 h-3.5 text-amber-600" />
                  Căn Cứ Dữ Liệu Lịch Sử & Nguyên Nhân Gốc (Root Cause)
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed p-2.5 rounded-lg bg-amber-50/40 border border-amber-200/60">
                  {selectedAlertForModal.historicalRootCause}
                </p>
              </div>

              {/* Historical Metrics Table */}
              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  Các Chỉ Số Telemetry Thực Tế Đối Soát (30-day Window)
                </h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100 text-[10px] text-slate-600 uppercase border-b border-slate-200 font-semibold">
                      <tr>
                        <th className="p-2">Chỉ số giám sát</th>
                        <th className="p-2">Giá trị đo</th>
                        <th className="p-2">Xu hướng</th>
                        <th className="p-2">Ngưỡng chuẩn</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px]">
                      {selectedAlertForModal.historicalMetricsSummary.map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2 font-medium text-slate-800">{m.label}</td>
                          <td className="p-2 font-bold font-mono text-slate-900">{m.value}</td>
                          <td className="p-2">
                            <span
                              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                m.trend === 'worsening'
                                  ? 'bg-rose-50 text-rose-700'
                                  : 'bg-emerald-50 text-emerald-700'
                              }`}
                            >
                              {m.trend === 'worsening' ? (
                                <TrendingDown className="w-3 h-3 text-rose-600" />
                              ) : (
                                <TrendingUp className="w-3 h-3 text-emerald-600" />
                              )}
                              {m.trend === 'worsening' ? 'Xấu đi' : 'Ổn định'}
                            </span>
                          </td>
                          <td className="p-2 text-slate-500 font-mono text-[10px]">{m.benchmark}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Predicted Impact */}
              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-1 text-rose-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Dự Báo Tác Động Sản Xuất (Nếu Không Xử Lý)
                </h4>
                <p className="text-slate-700 text-xs leading-relaxed p-2.5 rounded-lg bg-rose-50/40 border border-rose-200/60 font-medium">
                  {selectedAlertForModal.predictedImpact}
                </p>
              </div>

              {/* Suggested Preventive Action */}
              <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-200">
                <span className="font-bold text-indigo-900 text-xs block mb-1">
                  Đề Xuất Hành Động Ngăn Ngừa Khẩn:
                </span>
                <p className="text-indigo-800 text-xs leading-relaxed mb-3">
                  {selectedAlertForModal.suggestedAction}
                </p>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      onApplyAction?.(
                        selectedAlertForModal.actionPayload || selectedAlertForModal.suggestedAction
                      );
                      setSelectedAlertForModal(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Thực hiện hành động này</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span>Mô hình: {selectedAlertForModal.modelEngine}</span>
              <button
                onClick={() => setSelectedAlertForModal(null)}
                className="px-3 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100 text-slate-700 font-medium cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
