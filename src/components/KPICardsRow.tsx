import React from 'react';
import {
  BarChart2,
  Truck,
  ShieldCheck,
  Cog,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export const KPICardsRow: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {/* 1. Overall Production */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <BarChart2 className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-slate-700 truncate">
            Overall Production
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            96.2%
          </div>
          <div className="flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            <span>▲</span>
            <span>+2.1%</span>
          </div>
        </div>

        <div className="flex items-end justify-between mt-3 pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-500 font-medium">Target ≥ 95%</span>
          {/* Mini 5-bar Sparkline */}
          <div className="flex items-end gap-1 h-4">
            <span className="w-1 bg-emerald-300 rounded-xs h-2"></span>
            <span className="w-1 bg-emerald-400 rounded-xs h-2.5"></span>
            <span className="w-1 bg-emerald-500 rounded-xs h-3"></span>
            <span className="w-1 bg-emerald-500 rounded-xs h-3.5"></span>
            <span className="w-1 bg-emerald-600 rounded-xs h-4"></span>
          </div>
        </div>
      </div>

      {/* 2. On-Time Delivery */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Truck className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-slate-700 truncate">
            On-Time Delivery
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            92.5%
          </div>
          <div className="flex items-center gap-0.5 text-xs font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
            <span>▼</span>
            <span>-1.8%</span>
          </div>
        </div>

        <div className="flex items-end justify-between mt-3 pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-500 font-medium">Target ≥ 95%</span>
          {/* Mini 5-bar Sparkline (Red down) */}
          <div className="flex items-end gap-1 h-4">
            <span className="w-1 bg-rose-300 rounded-xs h-3.5"></span>
            <span className="w-1 bg-rose-400 rounded-xs h-4"></span>
            <span className="w-1 bg-rose-400 rounded-xs h-3"></span>
            <span className="w-1 bg-rose-500 rounded-xs h-2.5"></span>
            <span className="w-1 bg-rose-600 rounded-xs h-2"></span>
          </div>
        </div>
      </div>

      {/* 3. Quality Yield */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-slate-700 truncate">
            Quality Yield
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            98.6%
          </div>
          <div className="flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            <span>▲</span>
            <span>+0.8%</span>
          </div>
        </div>

        <div className="flex items-end justify-between mt-3 pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-500 font-medium">Target ≥ 98%</span>
          {/* Mini 5-bar Sparkline */}
          <div className="flex items-end gap-1 h-4">
            <span className="w-1 bg-emerald-300 rounded-xs h-2.5"></span>
            <span className="w-1 bg-emerald-400 rounded-xs h-3"></span>
            <span className="w-1 bg-emerald-500 rounded-xs h-3.5"></span>
            <span className="w-1 bg-emerald-500 rounded-xs h-3.5"></span>
            <span className="w-1 bg-emerald-600 rounded-xs h-4"></span>
          </div>
        </div>
      </div>

      {/* 4. Equipment Uptime */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Cog className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-slate-700 truncate">
            Equipment Uptime
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            92.4%
          </div>
          <div className="flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            <span>▲</span>
            <span>+2.3%</span>
          </div>
        </div>

        <div className="flex items-end justify-between mt-3 pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-500 font-medium">Target ≥ 90%</span>
          {/* Mini 5-bar Sparkline */}
          <div className="flex items-end gap-1 h-4">
            <span className="w-1 bg-emerald-300 rounded-xs h-1.5"></span>
            <span className="w-1 bg-emerald-400 rounded-xs h-2.5"></span>
            <span className="w-1 bg-emerald-500 rounded-xs h-3"></span>
            <span className="w-1 bg-emerald-500 rounded-xs h-3.5"></span>
            <span className="w-1 bg-emerald-600 rounded-xs h-4"></span>
          </div>
        </div>
      </div>

      {/* 5. Labor Efficiency */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Users className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-slate-700 truncate">
            Labor Efficiency
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            89.1%
          </div>
          <div className="flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            <span>▲</span>
            <span>+1.5%</span>
          </div>
        </div>

        <div className="flex items-end justify-between mt-3 pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-500 font-medium">Target ≥ 85%</span>
          {/* Mini 5-bar Sparkline */}
          <div className="flex items-end gap-1 h-4">
            <span className="w-1 bg-emerald-300 rounded-xs h-2"></span>
            <span className="w-1 bg-emerald-400 rounded-xs h-2"></span>
            <span className="w-1 bg-emerald-500 rounded-xs h-3"></span>
            <span className="w-1 bg-emerald-500 rounded-xs h-3.5"></span>
            <span className="w-1 bg-emerald-600 rounded-xs h-4"></span>
          </div>
        </div>
      </div>

      {/* 6. Open Issues */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center text-red-600 shrink-0">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-slate-700 truncate">
            Open Issues
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            15
          </div>
          <div className="flex items-center gap-0.5 text-xs font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
            <span>▲</span>
            <span>+3</span>
          </div>
        </div>

        <div className="flex items-end justify-between mt-3 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-rose-600">Critical: 4</span>
          {/* Mini sparkline alert */}
          <div className="flex items-end gap-1 h-4">
            <span className="w-1 bg-rose-300 rounded-xs h-2"></span>
            <span className="w-1 bg-rose-300 rounded-xs h-2.5"></span>
            <span className="w-1 bg-rose-400 rounded-xs h-3"></span>
            <span className="w-1 bg-rose-500 rounded-xs h-3.5"></span>
            <span className="w-1 bg-rose-600 rounded-xs h-4"></span>
          </div>
        </div>
      </div>
    </div>
  );
};
