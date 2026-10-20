import React, { useState } from 'react';
import { BarChart3, ChevronDown } from 'lucide-react';
import { PRODUCTION_CHART_DATA } from '../data/mockData';

export const ProductionChartCard: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState('30');

  const maxPieces = 200; // in thousands (200K)
  const minY = 70; // 70%
  const maxY = 100; // 100%

  // Chart dimension definitions
  const chartHeight = 160;
  const chartWidth = 380;
  const paddingX = 40;
  const paddingY = 20;
  const effectiveWidth = chartWidth - paddingX * 2;
  const effectiveHeight = chartHeight - paddingY * 2;

  // Calculate coordinates for Yield line points
  const points = PRODUCTION_CHART_DATA.map((d, i) => {
    const x = paddingX + (i / (PRODUCTION_CHART_DATA.length - 1)) * effectiveWidth;
    const normalizedYield = (d.yieldRate - minY) / (maxY - minY);
    const y = chartHeight - paddingY - normalizedYield * effectiveHeight;
    return { x, y, data: d };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center text-blue-600">
            <BarChart3 className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-xs font-bold text-slate-800">
            Production Overview (All Vendors)
          </h2>
        </div>

        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-semibold rounded px-2.5 py-1 pr-6 hover:border-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="30">Last 30 Days</option>
            <option value="14">Last 14 Days</option>
            <option value="7">Last 7 Days</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 mt-2 text-[11px] font-medium text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-2xs bg-sky-200" />
          <span>Plan (pcs)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-2xs bg-blue-600" />
          <span>Actual (pcs)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-emerald-500 inline-block" />
            <span>Yield (%)</span>
          </span>
        </div>
      </div>

      {/* Dual Axis Chart */}
      <div className="relative mt-2 w-full select-none">
        {/* Left Y-Axis Labels (0, 50K, 100K, 150K, 200K) */}
        <div className="absolute left-0 top-0 bottom-6 w-9 flex flex-col justify-between text-[10px] text-slate-400 font-mono tabular-nums text-right pr-1">
          <span>200K</span>
          <span>150K</span>
          <span>100K</span>
          <span>50K</span>
          <span>0</span>
        </div>

        {/* Right Y-Axis Labels (70%, 80%, 90%, 100%) */}
        <div className="absolute right-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[10px] text-slate-400 font-mono tabular-nums pl-1">
          <span>100%</span>
          <span>90%</span>
          <span>80%</span>
          <span>70%</span>
        </div>

        {/* Chart Area with Gridlines and Bars */}
        <div className="mx-9 h-44 relative border-b border-slate-200">
          {/* Horizontal Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className="border-b border-slate-100 w-full" />
            <div className="border-b border-slate-100 w-full" />
            <div className="border-b border-slate-100 w-full" />
            <div className="border-b border-slate-100 w-full" />
            <div className="w-full" />
          </div>

          {/* SVG for Yield Line and Hover Nodes */}
          <svg
            className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-10"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polylinePoints}
            />
            {points.map((p, idx) => (
              <circle
                key={idx}
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === idx ? 5 : 3.5}
                fill="#ffffff"
                stroke="#10b981"
                strokeWidth="2.5"
                className="transition-all"
              />
            ))}
          </svg>

          {/* Grouped Bars Container */}
          <div className="absolute inset-0 flex items-end justify-between px-2 pt-2">
            {PRODUCTION_CHART_DATA.map((item, idx) => {
              const planPercent = (item.plan / maxPieces) * 100;
              const actualPercent = (item.actual / maxPieces) * 100;
              const isHovered = hoveredIdx === idx;

              return (
                <div
                  key={item.date}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="flex flex-col items-center h-full justify-end group cursor-pointer relative"
                  style={{ width: '14%' }}
                >
                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div className="absolute -top-12 z-30 bg-slate-900 text-white text-[10px] py-1 px-2 rounded shadow-lg whitespace-nowrap pointer-events-none -translate-x-1/2 left-1/2">
                      <p className="font-bold text-slate-200">{item.date}</p>
                      <p className="text-sky-300">Plan: {item.plan}K pcs</p>
                      <p className="text-blue-400">Actual: {item.actual}K pcs</p>
                      <p className="text-emerald-400 font-semibold">Yield: {item.yieldRate}%</p>
                    </div>
                  )}

                  {/* Pair of bars */}
                  <div className="flex items-end gap-1 h-full w-full justify-center">
                    {/* Plan Bar (Light Blue) */}
                    <div
                      className="w-2.5 bg-sky-200 rounded-t-xs hover:bg-sky-300 transition-all duration-300"
                      style={{ height: `${planPercent}%` }}
                    />
                    {/* Actual Bar (Solid Blue) */}
                    <div
                      className="w-2.5 bg-blue-600 rounded-t-xs hover:bg-blue-700 transition-all duration-300 shadow-2xs"
                      style={{ height: `${actualPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* X-Axis Dates */}
        <div className="mx-9 flex justify-between mt-1 px-2 text-[11px] text-slate-500 font-medium">
          {PRODUCTION_CHART_DATA.map((item) => (
            <span key={item.date} className="w-10 text-center">
              {item.date}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
