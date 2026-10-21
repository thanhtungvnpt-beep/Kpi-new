import React, { useState } from 'react';
import { BarChart3, ChevronDown, Download, SlidersHorizontal, ShieldCheck } from 'lucide-react';

interface ControlTowerHeaderProps {
  selectedVendor: string;
  onVendorChange: (v: string) => void;
  selectedPlant: string;
  onPlantChange: (p: string) => void;
  timeRange: string;
  onTimeRangeChange: (t: string) => void;
  onExport: () => void;
  onOpenDataQuality?: () => void;
}

export const ControlTowerHeader: React.FC<ControlTowerHeaderProps> = ({
  selectedVendor,
  onVendorChange,
  selectedPlant,
  onPlantChange,
  timeRange,
  onTimeRangeChange,
  onExport,
  onOpenDataQuality,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [reportingPeriod, setReportingPeriod] = useState('all');
  const [sourceSystem, setSourceSystem] = useState('all');
  const [selectedLine, setSelectedLine] = useState('all');
  const [kpiGroup, setKpiGroup] = useState('all');
  const [ingestionMethod, setIngestionMethod] = useState('all');
  const [validationStatus, setValidationStatus] = useState('all');

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Title & Subtitle */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Executive Control Tower
            </h1>
            {onOpenDataQuality && (
              <button
                type="button"
                onClick={onOpenDataQuality}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
                title="Bấm để mở màn hình kiểm soát chất lượng dữ liệu"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                <span>Data Health: 97.8% (4 Quarantined)</span>
              </button>
            )}
          </div>
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

        {/* Global Filters Toggle */}
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer shadow-2xs ${
            showAdvancedFilters
              ? 'bg-blue-50 text-blue-700 border-blue-300'
              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
          }`}
          title="Mở rộng bộ lọc toàn cục 10 tiêu chí"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
          <span>Bộ lọc Toàn cục</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${
              showAdvancedFilters ? 'rotate-180 text-blue-600' : 'text-slate-400'
            }`}
          />
        </button>

        {/* Export Button */}
        <button
          onClick={onExport}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>

      {/* Collapsible Global Enterprise Filters Panel */}
      {showAdvancedFilters && (
        <div className="w-full mt-3 pt-3 border-t border-slate-200/90 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs animate-in slide-in-from-top-2">
          {/* 1. Reporting Period */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Kỳ báo cáo
            </label>
            <select
              value={reportingPeriod}
              onChange={(e) => setReportingPeriod(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Tất cả kỳ</option>
              <option value="shift1">Ca 1 (06:00 - 14:00)</option>
              <option value="shift2">Ca 2 (14:00 - 22:00)</option>
              <option value="shift3">Ca 3 (22:00 - 06:00)</option>
              <option value="weekly">Tuần này (W17)</option>
              <option value="monthly">Tháng này (Apr 2025)</option>
            </select>
          </div>

          {/* 2. Source System */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Hệ thống nguồn
            </label>
            <select
              value={sourceSystem}
              onChange={(e) => setSourceSystem(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Tất cả nguồn</option>
              <option value="gmes">GMES MES (OPC-UA)</option>
              <option value="iot">IoT Gateways (MQTT)</option>
              <option value="sap">SAP S/4HANA (RFC)</option>
              <option value="csv">QA Manual (CSV)</option>
              <option value="rpa">RPA Crawler</option>
              <option value="api">Supplier REST API</option>
            </select>
          </div>

          {/* 3. Dây chuyền (Line) */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Dây chuyền
            </label>
            <select
              value={selectedLine}
              onChange={(e) => setSelectedLine(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Tất cả dây chuyền</option>
              <option value="smt06">SMT Line 06 (Mounter #2)</option>
              <option value="smt02">SMT Line 02</option>
              <option value="insp02">Inspection AOI 02</option>
              <option value="pack03">Packing Line 03</option>
              <option value="oven01">Reflow Oven Line 01</option>
            </select>
          </div>

          {/* 4. Nhóm KPI */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Nhóm KPI
            </label>
            <select
              value={kpiGroup}
              onChange={(e) => setKpiGroup(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Tất cả nhóm KPI</option>
              <option value="oee">Sản lượng & OEE</option>
              <option value="otd">Giao hàng đúng hạn (OTD)</option>
              <option value="quality">Chất lượng & Yield</option>
              <option value="equipment">Khả dụng thiết bị</option>
              <option value="manpower">Hiệu suất nhân sự</option>
            </select>
          </div>

          {/* 5. Phương thức thu thập */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Phương thức lấy
            </label>
            <select
              value={ingestionMethod}
              onChange={(e) => setIngestionMethod(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Tất cả phương thức</option>
              <option value="realtime">Realtime Stream (OPC/MQTT)</option>
              <option value="batch">Micro-batch Sync</option>
              <option value="manual">File Staging Upload</option>
              <option value="rpa">RPA Bot Automated</option>
            </select>
          </div>

          {/* 6. Trạng thái kiểm định */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Trạng thái kiểm định
            </label>
            <select
              value={validationStatus}
              onChange={(e) => setValidationStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="passed">Đạt chuẩn (100% Passed)</option>
              <option value="quarantined">Đang bị Cách ly (Quarantine)</option>
              <option value="approved_exception">Ngoại lệ có Phê duyệt</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};


