import React from 'react';
import { BarChart3, ChevronDown, Download, SlidersHorizontal } from 'lucide-react';

interface ControlTowerHeaderProps {
  selectedVendor: string;
  onVendorChange: (v: string) => void;
  selectedPlant: string;
  onPlantChange: (p: string) => void;
  timeRange: string;
  onTimeRangeChange: (t: string) => void;
  onExport: () => void;
}

export const ControlTowerHeader: React.FC<ControlTowerHeaderProps> = ({
  selectedVendor,
  onVendorChange,
  selectedPlant,
  onPlantChange,
  timeRange,
  onTimeRangeChange,
  onExport,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Title & Subtitle */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Executive Control Tower
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Real-time Visibility <span className="text-slate-300">|</span> AI-driven Insight{' '}
            <span className="text-slate-300">|</span> Human-in-the-Loop Decision
          </p>
        </div>
      </div>

      {/* Filter controls & Export button */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* All Vendors */}
        <div className="relative">
          <select
            value={selectedVendor}
            onChange={(e) => onVendorChange(e.target.value)}
            className="appearance-none bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg pl-3 pr-8 py-2 hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
          >
            <option value="all">All Vendors</option>
            <option value="khv">KHV</option>
            <option value="dreamtech">DREAM TECH</option>
            <option value="hstec">HSTEC</option>
            <option value="ktech">KTECH</option>
            <option value="hojeongb">HOJEONGB</option>
            <option value="hojeong_vina">HOJEONG VINA</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* All Plants */}
        <div className="relative">
          <select
            value={selectedPlant}
            onChange={(e) => onPlantChange(e.target.value)}
            className="appearance-none bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg pl-3 pr-8 py-2 hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
          >
            <option value="all">All Plants</option>
            <option value="plant1">Plant 1 (Bac Ninh)</option>
            <option value="plant2">Plant 2 (Thai Nguyen)</option>
            <option value="plant3">Plant 3 (Binh Duong)</option>
            <option value="plant4">Plant 4 (Hai Duong)</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Time Range */}
        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
            className="appearance-none bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg pl-3 pr-8 py-2 hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
          >
            <option value="30">Last 30 Days</option>
            <option value="7">Last 7 Days</option>
            <option value="14">Last 14 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Export Button */}
        <button
          onClick={onExport}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};
