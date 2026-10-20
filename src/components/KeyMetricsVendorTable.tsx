import React from 'react';
import { LayoutGrid, ArrowRight } from 'lucide-react';
import { VENDOR_METRICS } from '../data/mockData';
import { VendorMetric } from '../types';

interface KeyMetricsVendorTableProps {
  onSelectVendor?: (vendorId: string) => void;
}

export const KeyMetricsVendorTable: React.FC<KeyMetricsVendorTableProps> = ({
  onSelectVendor,
}) => {
  const renderTrend = (trend: 'up' | 'down' | 'flat' | 'square', val: number) => {
    switch (trend) {
      case 'up':
        return <span className="text-emerald-500 font-bold ml-1 text-[10px]">▲</span>;
      case 'down':
        return <span className="text-rose-500 font-bold ml-1 text-[10px]">▼</span>;
      case 'flat':
        return <span className="text-emerald-600 font-bold ml-1 text-[10px]">→</span>;
      case 'square':
        return <span className="text-slate-400 font-bold ml-1 text-[10px]">■</span>;
    }
  };

  const renderStatus = (status: VendorMetric['status']) => {
    switch (status) {
      case 'On Track':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <span>▲</span>
            <span>On Track</span>
          </span>
        );
      case 'At Risk':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
            <span>▲</span>
            <span>At Risk</span>
          </span>
        );
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
            <span>▲</span>
            <span>Critical</span>
          </span>
        );
    }
  };

  const getMetricTextColor = (val: number, status: string) => {
    if (val < 85) return 'text-rose-600 font-bold';
    if (val < 90) return 'text-amber-600 font-semibold';
    return 'text-slate-800 font-medium';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center text-blue-600">
            <LayoutGrid className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-xs font-bold text-slate-800">
            Key Metrics by Vendor
          </h2>
        </div>

        <button
          onClick={() => {}}
          className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-1.5 px-1.5">Vendor</th>
              <th className="py-1.5 px-1 text-center">
                Production<br /><span className="text-[9px] lowercase font-normal">%</span>
              </th>
              <th className="py-1.5 px-1 text-center">
                On-Time<br /><span className="text-[9px] lowercase font-normal">%</span>
              </th>
              <th className="py-1.5 px-1 text-center">
                Quality<br /><span className="text-[9px] lowercase font-normal">%</span>
              </th>
              <th className="py-1.5 px-1 text-center">
                Equipment<br /><span className="text-[9px] lowercase font-normal">%</span>
              </th>
              <th className="py-1.5 px-1 text-center">
                Manpower<br /><span className="text-[9px] lowercase font-normal">%</span>
              </th>
              <th className="py-1.5 px-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {VENDOR_METRICS.map((row) => (
              <tr
                key={row.id}
                onClick={() => onSelectVendor?.(row.id)}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                <td className="py-2 px-1.5 font-bold text-slate-800 text-[11px]">
                  {row.vendor}
                </td>
                <td className="py-2 px-1 text-center tabular-nums">
                  <span className={getMetricTextColor(row.production, row.status)}>
                    {row.production.toFixed(1)}
                  </span>
                  {renderTrend(row.productionTrend, row.production)}
                </td>
                <td className="py-2 px-1 text-center tabular-nums">
                  <span className={getMetricTextColor(row.onTime, row.status)}>
                    {row.onTime.toFixed(1)}
                  </span>
                  {renderTrend(row.onTimeTrend, row.onTime)}
                </td>
                <td className="py-2 px-1 text-center tabular-nums">
                  <span className={getMetricTextColor(row.quality, row.status)}>
                    {row.quality.toFixed(1)}
                  </span>
                  {renderTrend(row.qualityTrend, row.quality)}
                </td>
                <td className="py-2 px-1 text-center tabular-nums">
                  <span className={getMetricTextColor(row.equipment, row.status)}>
                    {row.equipment.toFixed(1)}
                  </span>
                  {renderTrend(row.equipmentTrend, row.equipment)}
                </td>
                <td className="py-2 px-1 text-center tabular-nums">
                  <span className={getMetricTextColor(row.manpower, row.status)}>
                    {row.manpower.toFixed(1)}
                  </span>
                  {renderTrend(row.manpowerTrend, row.manpower)}
                </td>
                <td className="py-2 px-2 text-center">
                  {renderStatus(row.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
