import React, { useState } from 'react';
import {
  BarChart2,
  Truck,
  ShieldCheck,
  Cog,
  Users,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface KPICardData {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  target: string;
  source: 'GMES' | 'IoT Edge' | 'SAP ERP' | 'QA Manual' | 'RPA Bot';
  verification: 'VERIFIED' | 'ESTIMATED' | 'QUARANTINED' | 'SAMPLE_CHECK';
  sampleCount: string;
  lastSync: string;
  latency: string;
  errorRate: string;
  icon: React.ReactNode;
  iconBg: string;
  sparklineColors: string[];
  sparklineHeights: string[];
}

export const KPICardsRow: React.FC<{ onOpenDataQuality?: () => void }> = ({ onOpenDataQuality }) => {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  const kpis: KPICardData[] = [
    {
      title: 'Overall Production',
      value: '96.2%',
      change: '+2.1%',
      isPositive: true,
      target: 'Target ≥ 95%',
      source: 'GMES',
      verification: 'VERIFIED',
      sampleCount: '14,280/14,280',
      lastSync: '2 phút trước',
      latency: '118ms',
      errorRate: '0.04%',
      iconBg: 'bg-blue-100 text-blue-600',
      icon: <BarChart2 className="w-3.5 h-3.5" />,
      sparklineColors: ['bg-emerald-300', 'bg-emerald-400', 'bg-emerald-500', 'bg-emerald-500', 'bg-emerald-600'],
      sparklineHeights: ['h-2', 'h-2.5', 'h-3', 'h-3.5', 'h-4'],
    },
    {
      title: 'On-Time Delivery',
      value: '92.5%',
      change: '-1.8%',
      isPositive: false,
      target: 'Target ≥ 95%',
      source: 'SAP ERP',
      verification: 'VERIFIED',
      sampleCount: '3,842/3,850',
      lastSync: '12 phút trước',
      latency: '340ms',
      errorRate: '0.21%',
      iconBg: 'bg-blue-100 text-blue-600',
      icon: <Truck className="w-3.5 h-3.5" />,
      sparklineColors: ['bg-rose-300', 'bg-rose-400', 'bg-rose-400', 'bg-rose-500', 'bg-rose-600'],
      sparklineHeights: ['h-3.5', 'h-4', 'h-3', 'h-2.5', 'h-2'],
    },
    {
      title: 'Quality Yield',
      value: '98.6%',
      change: '+0.8%',
      isPositive: true,
      target: 'Target ≥ 98%',
      source: 'GMES',
      verification: 'QUARANTINED',
      sampleCount: '19,410/19,420 (2 cách ly)',
      lastSync: '4 phút trước',
      latency: '135ms',
      errorRate: '0.01%',
      iconBg: 'bg-emerald-100 text-emerald-600',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      sparklineColors: ['bg-emerald-300', 'bg-emerald-400', 'bg-emerald-500', 'bg-emerald-500', 'bg-emerald-600'],
      sparklineHeights: ['h-2.5', 'h-3', 'h-3.5', 'h-3.5', 'h-4'],
    },
    {
      title: 'Equipment Uptime',
      value: '92.4%',
      change: '+2.3%',
      isPositive: true,
      target: 'Target ≥ 90%',
      source: 'IoT Edge',
      verification: 'VERIFIED',
      sampleCount: '58,290 điểm đo',
      lastSync: '1 phút trước',
      latency: '45ms',
      errorRate: '0.00%',
      iconBg: 'bg-blue-100 text-blue-600',
      icon: <Cog className="w-3.5 h-3.5" />,
      sparklineColors: ['bg-emerald-300', 'bg-emerald-400', 'bg-emerald-500', 'bg-emerald-500', 'bg-emerald-600'],
      sparklineHeights: ['h-1.5', 'h-2.5', 'h-3', 'h-3.5', 'h-4'],
    },
    {
      title: 'Labor Efficiency',
      value: '89.1%',
      change: '+1.5%',
      isPositive: true,
      target: 'Target ≥ 85%',
      source: 'QA Manual',
      verification: 'SAMPLE_CHECK',
      sampleCount: '850 công nhân',
      lastSync: 'Ca 1 (14:00)',
      latency: 'Staged CSV',
      errorRate: '0.50%',
      iconBg: 'bg-blue-100 text-blue-600',
      icon: <Users className="w-3.5 h-3.5" />,
      sparklineColors: ['bg-emerald-300', 'bg-emerald-400', 'bg-emerald-500', 'bg-emerald-500', 'bg-emerald-600'],
      sparklineHeights: ['h-2', 'h-2', 'h-3', 'h-3.5', 'h-4'],
    },
    {
      title: 'Open Issues',
      value: '15',
      change: '+3',
      isPositive: false,
      target: 'Critical: 4',
      source: 'GMES',
      verification: 'VERIFIED',
      sampleCount: '15 sự vụ mở',
      lastSync: 'Ngay bây giờ',
      latency: '85ms',
      errorRate: '0.00%',
      iconBg: 'bg-red-100 text-red-600',
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
      sparklineColors: ['bg-rose-300', 'bg-rose-300', 'bg-rose-400', 'bg-rose-500', 'bg-rose-600'],
      sparklineHeights: ['h-2', 'h-2.5', 'h-3', 'h-3.5', 'h-4'],
    },
  ];

  const getVerificationBadge = (status: KPICardData['verification']) => {
    switch (status) {
      case 'VERIFIED':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          dot: 'bg-emerald-500',
          label: 'VERIFIED',
        };
      case 'QUARANTINED':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
          dot: 'bg-amber-500 animate-pulse',
          label: 'QUARANTINE (2)',
        };
      case 'SAMPLE_CHECK':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
          dot: 'bg-indigo-500',
          label: 'SAMPLE CHK',
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-600 border-slate-200',
          dot: 'bg-slate-400',
          label: status,
        };
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {kpis.map((kpi, index) => {
        const vBadge = getVerificationBadge(kpi.verification);
        const isOpen = activeTooltip === index;

        return (
          <div
            key={kpi.title}
            className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-2xs hover:shadow-xs transition-all relative flex flex-col justify-between"
            onMouseEnter={() => setActiveTooltip(index)}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            {/* Top row: Icon + Title + Data Provenance Badges */}
            <div>
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${kpi.iconBg}`}>
                    {kpi.icon}
                  </div>
                  <span className="text-[11.5px] font-bold text-slate-700 truncate" title={kpi.title}>
                    {kpi.title}
                  </span>
                </div>
              </div>

              {/* Source Tag & Trust Badge */}
              <div className="flex items-center gap-1 mb-2">
                <span className="text-[9.5px] font-bold tracking-tight px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60 uppercase">
                  {kpi.source}
                </span>
                <span
                  className={`text-[9px] font-bold tracking-tight px-1.5 py-0.5 rounded-full border inline-flex items-center gap-1 ${vBadge.bg}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${vBadge.dot}`} />
                  {vBadge.label}
                </span>
              </div>

              {/* Metric Value & Change */}
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-black text-slate-900 tracking-tight tabular-nums">
                  {kpi.value}
                </div>
                <div
                  className={`flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded ${
                    kpi.isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
                  }`}
                >
                  <span>{kpi.isPositive ? '▲' : '▼'}</span>
                  <span>{kpi.change}</span>
                </div>
              </div>
            </div>

            {/* Bottom target & sparkline */}
            <div className="flex items-end justify-between mt-2.5 pt-2 border-t border-slate-100">
              <span className={`text-[10.5px] font-medium ${kpi.title === 'Open Issues' ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                {kpi.target}
              </span>
              <div className="flex items-end gap-1 h-3.5">
                {kpi.sparklineHeights.map((h, sIdx) => (
                  <span
                    key={sIdx}
                    className={`w-1 rounded-xs ${h} ${kpi.sparklineColors[sIdx]}`}
                  />
                ))}
              </div>
            </div>

            {/* Data Trust Hover Popover */}
            {isOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-slate-900 text-white text-[11px] rounded-xl p-3 shadow-xl z-50 pointer-events-auto border border-slate-700 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-slate-750 pb-1.5 mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-blue-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Hồ sơ Chất lượng Dữ liệu</span>
                  </div>
                  <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {kpi.source}
                  </span>
                </div>

                <div className="space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Số mẫu kiểm định:</span>
                    <span className="font-semibold text-slate-100">{kpi.sampleCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lần đồng bộ cuối:</span>
                    <span className="font-semibold text-slate-100">{kpi.lastSync}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Độ trễ truyền nhận:</span>
                    <span className="font-semibold text-emerald-400 font-mono">{kpi.latency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tỷ lệ sai lệch / lỗi:</span>
                    <span className="font-semibold text-slate-100 font-mono">{kpi.errorRate}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                    <span className="text-slate-400">Trạng thái xác thực:</span>
                    <span className="font-bold text-emerald-400">{kpi.verification}</span>
                  </div>
                </div>

                {onOpenDataQuality && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDataQuality();
                    }}
                    className="w-full mt-2.5 pt-1.5 border-t border-slate-800 text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1 font-semibold text-[10px] cursor-pointer"
                  >
                    <span>Xem luồng kiểm định chi tiết</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
