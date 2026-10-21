import React, { useState } from 'react';
import {
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Search,
  Check,
  X,
  Info,
  ShieldCheck,
  Zap,
  Cpu,
  Calculator,
  TrendingUp,
  Clock,
  Database,
  Eye,
  Settings,
  Code2,
  Play,
  FileText,
  ChevronDown,
  ChevronRight,
  Filter,
  Layers,
  Sparkles,
  ExternalLink,
  Save,
  RefreshCw,
  HelpCircle,
  Copy,
} from 'lucide-react';
import {
  ValidationRule,
  RuleSeverity,
  RuleCategory,
  RuleGroupExecutionSummary,
  RuleParameterConfig,
  RuleExecutionResult,
} from '../types';

interface ValidationRulesCatalogProps {
  rules: ValidationRule[];
  groupSummaries?: RuleGroupExecutionSummary[];
  onToggleRule: (ruleId: string) => void;
  onToggleGroup?: (group: RuleCategory, active: boolean) => void;
  onUpdateRuleParameters?: (ruleId: string, updatedParams: RuleParameterConfig[]) => void;
  onDryRunValidation: () => void;
  isDryRunning?: boolean;
  onShowToast: (msg: string) => void;
}

export const ValidationRulesCatalog: React.FC<ValidationRulesCatalogProps> = ({
  rules,
  groupSummaries = [],
  onToggleRule,
  onToggleGroup,
  onUpdateRuleParameters,
  onDryRunValidation,
  isDryRunning = false,
  onShowToast,
}) => {
  // Navigation & Filtering State
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [activeStatusFilter, setActiveStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'CARDS' | 'TABLE'>('CARDS');

  // Interactive Modals State
  const [paramModalRule, setParamModalRule] = useState<ValidationRule | null>(null);
  const [editingParams, setEditingParams] = useState<RuleParameterConfig[]>([]);
  const [activeParamTab, setActiveParamTab] = useState<'FORM' | 'JSON'>('FORM');

  // Execution Trace Modal State
  const [traceModalGroup, setTraceModalGroup] = useState<RuleGroupExecutionSummary | null>(null);
  const [isReExecutingGroup, setIsReExecutingGroup] = useState(false);

  // Expanded Rule IDs in Card View
  const [expandedRuleIds, setExpandedRuleIds] = useState<Record<string, boolean>>({
    'RULE-01': true,
    'RULE-02': true,
  });

  const categories: { key: string; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'ALL', label: 'Tất cả Nhóm Quy tắc', icon: Layers },
    { key: 'Physical Limit', label: 'Giới Hạn Vật Lý', icon: Cpu },
    { key: 'Business Logic', label: 'Logic Nghiệp Vụ', icon: Calculator },
    { key: 'Statistical Outlier', label: 'Bất Thường Thống Kê', icon: TrendingUp },
    { key: 'Temporal Continuity', label: 'Liên Tục Thời Gian', icon: Clock },
    { key: 'Schema & Types', label: 'Cấu Trúc Schema', icon: Database },
  ];

  // Toggle card expansion
  const toggleCardExpansion = (id: string) => {
    setExpandedRuleIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Open Parameter Inspector & Editor
  const handleOpenParamModal = (rule: ValidationRule) => {
    setParamModalRule(rule);
    setEditingParams(
      rule.parameters ? JSON.parse(JSON.stringify(rule.parameters)) : []
    );
    setActiveParamTab('FORM');
  };

  // Save modified parameters
  const handleSaveParameters = () => {
    if (!paramModalRule) return;
    if (onUpdateRuleParameters) {
      onUpdateRuleParameters(paramModalRule.id, editingParams);
    }
    onShowToast(
      `Đã cập nhật thành công tham số cấu hình cho quy tắc ${paramModalRule.id} (${paramModalRule.name}).`
    );
    setParamModalRule(null);
  };

  // Re-execute specific group
  const handleReExecuteGroup = (groupSummary: RuleGroupExecutionSummary) => {
    setIsReExecutingGroup(true);
    setTimeout(() => {
      setIsReExecutingGroup(false);
      onShowToast(
        `Đã chạy lại kiểm định nhóm [${groupSummary.groupNameVi}] trên lô mới nhất. Tỷ lệ đạt: 99.98%.`
      );
    }, 1100);
  };

  // Filtered Rules
  const filteredRules = rules.filter((r) => {
    if (selectedCategory !== 'ALL' && r.category !== selectedCategory) return false;
    if (selectedSeverity !== 'ALL' && r.severity !== selectedSeverity) return false;
    if (activeStatusFilter === 'ACTIVE' && !r.active) return false;
    if (activeStatusFilter === 'INACTIVE' && r.active) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      r.id.toLowerCase().includes(q) ||
      r.name.toLowerCase().includes(q) ||
      r.ruleDescription.toLowerCase().includes(q) ||
      (r.kpiCode && r.kpiCode.toLowerCase().includes(q)) ||
      (r.threshold && r.threshold.toLowerCase().includes(q)) ||
      (r.parameters &&
        r.parameters.some(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.key.toLowerCase().includes(q) ||
            String(p.value).toLowerCase().includes(q)
        ))
    );
  });

  const getSeverityBadge = (severity?: RuleSeverity) => {
    switch (severity) {
      case 'BLOCKER':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-black';
      case 'CRITICAL':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      case 'WARNING':
        return 'bg-blue-100 text-blue-800 border-blue-300 font-semibold';
      case 'INFO':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Physical Limit':
        return <Cpu className="w-3.5 h-3.5 text-blue-600" />;
      case 'Business Logic':
        return <Calculator className="w-3.5 h-3.5 text-purple-600" />;
      case 'Statistical Outlier':
        return <TrendingUp className="w-3.5 h-3.5 text-amber-600" />;
      case 'Temporal Continuity':
        return <Clock className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Schema & Types':
        return <Database className="w-3.5 h-3.5 text-indigo-600" />;
      default:
        return <Sliders className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  const getExecutionStatusBadge = (status: 'PASSED' | 'WARNING' | 'FAILED') => {
    switch (status) {
      case 'PASSED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            PASSED
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            WARNINGS DETECTED
          </span>
        );
      case 'FAILED':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
            <X className="w-3 h-3 text-rose-600" />
            FAILED
          </span>
        );
    }
  };

  // Quick stats
  const activeRulesCount = rules.filter((r) => r.active).length;
  const totalViolations = rules.reduce((acc, r) => acc + (r.violationsCount || 0), 0);
  const totalPassedRecords = rules.reduce((acc, r) => acc + (r.passCount || 0), 0);

  return (
    <div className="space-y-4 select-none">
      {/* SECTION 1: TOP HEADER & QUICK STATS BANNER */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                <Sliders className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Danh Mục Quy Tắc Thẩm Định (Validation Rules Catalog & Config Engine)
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {activeRulesCount} / {rules.length} Quy tắc Đang Chạy
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                5 Nhóm Kiểm Định
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Quản trị toàn diện bộ quy tắc kiểm soát chất lượng dữ liệu: Bật/tắt trực tiếp, xem &amp; tinh chỉnh tham số vận hành, và giám sát kết quả thực thi gần nhất theo từng nhóm.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={onDryRunValidation}
              disabled={isDryRunning}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-60"
              title="Chạy mô phỏng kiểm định toàn bộ quy tắc trên 15,200 bản ghi"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isDryRunning ? 'animate-spin' : ''}`} />
              <span>{isDryRunning ? 'Đang chạy Dry-Run...' : 'Chạy Dry-Run Toàn Bộ Rules'}</span>
            </button>

            <button
              onClick={() => {
                const catalogJson = JSON.stringify(rules, null, 2);
                navigator.clipboard?.writeText(catalogJson);
                onShowToast('Đã sao chép cấu hình JSON của toàn bộ 8 quy tắc vào Clipboard.');
              }}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
              title="Sao chép toàn bộ định nghĩa Rules dưới dạng JSON"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* High-level KPI Summary Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tổng Quy Tắc / Đang Chạy</div>
            <div className="text-base font-black text-slate-900 mt-0.5">
              {activeRulesCount} <span className="text-xs font-normal text-slate-400">/ {rules.length} Active</span>
            </div>
          </div>
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-lg p-2.5">
            <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Bản Ghi Đã Thẩm Định Đạt</div>
            <div className="text-base font-black text-emerald-800 mt-0.5">
              {totalPassedRecords.toLocaleString()} <span className="text-xs font-normal text-emerald-600">recs</span>
            </div>
          </div>
          <div className="bg-rose-50/60 border border-rose-200/80 rounded-lg p-2.5">
            <div className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Tổng Vi Phạm Đã Chặn</div>
            <div className="text-base font-black text-rose-800 mt-0.5">
              {totalViolations} <span className="text-xs font-normal text-rose-600">lần cách ly</span>
            </div>
          </div>
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-lg p-2.5">
            <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Tỷ Lệ Đạt TB (Avg Pass Rate)</div>
            <div className="text-base font-black text-blue-800 mt-0.5">
              99.96% <span className="text-xs font-normal text-blue-600">(ISO-8000)</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: CHECK LAST EXECUTION RESULT FOR EACH RULE GROUP */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Kết Quả Thực Thi Gần Nhất Theo Từng Nhóm Quy Tắc (Rule Groups Execution Results)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">
            Nhấn vào thẻ nhóm để lọc nhanh danh mục quy tắc bên dưới hoặc xem Trace Log chi tiết
          </span>
        </div>

        {/* 5 Rule Group Execution Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {groupSummaries.map((grp) => {
            const isGroupActive = grp.activeRulesCount > 0;
            const isSelected = selectedCategory === grp.group;

            return (
              <div
                key={grp.group}
                onClick={() => setSelectedCategory(selectedCategory === grp.group ? 'ALL' : grp.group)}
                className={`p-3 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/40 shadow-xs ring-2 ring-blue-500/20'
                    : 'border-slate-200/90 bg-slate-50/40 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="space-y-2">
                  {/* Group header */}
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                        {getCategoryIcon(grp.group)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">
                          {grp.groupNameVi}
                        </h4>
                        <span className="text-[9px] font-mono text-slate-500">{grp.group}</span>
                      </div>
                    </div>

                    {/* Status badge */}
                    {getExecutionStatusBadge(grp.lastExecution.status)}
                  </div>

                  {/* Description */}
                  <p className="text-[10px] text-slate-600 line-clamp-2 leading-relaxed">
                    {grp.description}
                  </p>

                  {/* Execution metrics */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-200/60">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-medium">Tỷ lệ đạt (Pass Rate):</span>
                      <span className="font-bold font-mono text-emerald-700">
                        {grp.lastExecution.passRate.toFixed(2)}%
                      </span>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          grp.lastExecution.status === 'PASSED'
                            ? 'bg-emerald-500'
                            : grp.lastExecution.status === 'WARNING'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, grp.lastExecution.passRate)}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[9px] text-slate-500 pt-0.5">
                      <div>
                        Đã kiểm: <strong className="text-slate-800">{grp.lastExecution.recordsEvaluated.toLocaleString()}</strong>
                      </div>
                      <div className="text-right">
                        Vi phạm: <strong className="text-rose-700 font-bold">{grp.lastExecution.violationCount}</strong>
                      </div>
                      <div>
                        Độ trễ: <strong className="text-slate-800 font-mono">{grp.lastExecution.durationMs}ms</strong>
                      </div>
                      <div className="text-right">
                        Lô: <strong className="text-slate-800 font-mono truncate">{grp.lastExecution.batchId.split('-').slice(0, 2).join('-')}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between gap-1">
                  <span className="text-[9px] text-slate-400 font-medium">
                    {grp.lastExecution.timestamp.split('(')[1]?.replace(')', '') || 'Gần đây'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTraceModalGroup(grp);
                      }}
                      className="px-2 py-0.5 text-[10px] font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-100/60 rounded transition-colors flex items-center gap-1"
                      title="Xem nhật ký thực thi chi tiết (Execution Trace Log)"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Trace Log</span>
                    </button>

                    {onToggleGroup && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleGroup(grp.group, !isGroupActive);
                          onShowToast(
                            `Đã ${!isGroupActive ? 'bật' : 'tắt'} toàn bộ quy tắc nhóm [${grp.groupNameVi}].`
                          );
                        }}
                        className={`p-1 rounded text-[10px] font-bold transition-colors ${
                          isGroupActive
                            ? 'text-emerald-700 hover:bg-emerald-100'
                            : 'text-slate-400 hover:bg-slate-200'
                        }`}
                        title={isGroupActive ? 'Đang kích hoạt toàn nhóm' : 'Đã tạm dừng nhóm'}
                      >
                        {isGroupActive ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: RULES CATALOG FILTER & TOOLBAR */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              const count = cat.key === 'ALL'
                ? rules.length
                : rules.filter((r) => r.category === cat.key).length;

              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === cat.key
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      selectedCategory === cat.key
                        ? 'bg-blue-700 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start lg:self-auto shrink-0">
            <button
              onClick={() => setViewMode('CARDS')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'CARDS'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Thẻ Chi Tiết & Tham Số
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'TABLE'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bảng Tổng Hợp
            </button>
          </div>
        </div>

        {/* Secondary Filters Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Severity Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[11px] font-bold text-slate-500">Mức Độ:</span>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Tất cả Mức Độ</option>
                <option value="BLOCKER">BLOCKER (Chặn cứng)</option>
                <option value="CRITICAL">CRITICAL (Nghiêm trọng)</option>
                <option value="WARNING">WARNING (Cảnh báo)</option>
                <option value="INFO">INFO (Thông tin)</option>
              </select>
            </div>

            {/* Active Status Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[11px] font-bold text-slate-500">Trạng Thái:</span>
              <select
                value={activeStatusFilter}
                onChange={(e) => setActiveStatusFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Tất cả Trạng thái</option>
                <option value="ACTIVE">Đang Chạy (Active)</option>
                <option value="INACTIVE">Tạm Dừng (Inactive)</option>
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo mã, tên, tham số, KPI..."
              className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 4: RULES CATALOG CONTENT (CARD VIEW OR TABLE VIEW) */}
      {viewMode === 'CARDS' ? (
        <div className="space-y-3">
          {filteredRules.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center space-y-2">
              <Sliders className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-xs font-bold text-slate-700">Không tìm thấy quy tắc thẩm định phù hợp</h4>
              <p className="text-[11px] text-slate-500">
                Vui lòng thử xóa từ khóa tìm kiếm hoặc điều chỉnh bộ lọc nhóm / mức độ nghiêm trọng.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedSeverity('ALL');
                  setActiveStatusFilter('ALL');
                  setSearchQuery('');
                }}
                className="mt-2 px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Đặt lại toàn bộ bộ lọc
              </button>
            </div>
          ) : (
            filteredRules.map((rule) => {
              const isExpanded = !!expandedRuleIds[rule.id];
              const params = rule.parameters || [];

              return (
                <div
                  key={rule.id}
                  className={`bg-white rounded-xl border transition-all overflow-hidden ${
                    rule.active
                      ? 'border-slate-200/90 shadow-2xs hover:border-blue-300'
                      : 'border-slate-200/60 bg-slate-50/50 opacity-70'
                  }`}
                >
                  {/* Top Rule Header Row */}
                  <div className="p-4 flex flex-col md:flex-row md:items-start justify-between gap-3 border-b border-slate-100">
                    <div className="space-y-2 flex-1">
                      {/* Meta badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                          {rule.id}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                          {rule.name}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                          {getCategoryIcon(rule.category)}
                          <span>{rule.category}</span>
                        </span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded border ${getSeverityBadge(
                            rule.severity
                          )}`}
                        >
                          {rule.severity || 'CRITICAL'}
                        </span>
                        {rule.kpiCode && (
                          <span className="text-[9px] px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-mono font-bold">
                            KPI: {rule.kpiCode}
                          </span>
                        )}
                        {rule.executionMode && (
                          <span className="text-[9px] px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-mono">
                            {rule.executionMode}
                          </span>
                        )}
                      </div>

                      {/* Rule Description */}
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {rule.ruleDescription}
                      </p>

                      {/* Formula / Threshold badge & quick stats */}
                      <div className="flex items-center gap-3 text-xs text-slate-500 pt-1 flex-wrap">
                        <span className="font-mono text-[11px] bg-slate-50 px-2.5 py-1 rounded border border-slate-200 text-slate-700">
                          Ngưỡng logic: <strong className="text-blue-900 font-bold">{rule.threshold}</strong>
                        </span>
                        <span className="text-rose-700 font-semibold text-[11px]">
                          Đã chặn: <strong>{rule.violationsCount}</strong> lần vi phạm
                        </span>
                        {rule.passCount && (
                          <span className="text-emerald-700 font-semibold text-[11px]">
                            Đã kiểm tra đạt: <strong>{rule.passCount.toLocaleString()}</strong> bản ghi
                          </span>
                        )}
                        {rule.lastExecuted && (
                          <span className="text-slate-400 text-[11px]">Lần chạy: {rule.lastExecuted}</span>
                        )}
                      </div>
                    </div>

                    {/* Rule Action Buttons (Toggle Active & Parameter Inspector) */}
                    <div className="flex items-center gap-2 shrink-0 self-start md:self-auto pt-1">
                      {/* Toggle Active Button */}
                      <button
                        type="button"
                        onClick={() => onToggleRule(rule.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 ${
                          rule.active
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                        }`}
                        title={rule.active ? 'Quy tắc đang chạy. Nhấn để tạm dừng' : 'Quy tắc đang tạm dừng. Nhấn để kích hoạt'}
                      >
                        {rule.active ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Đang Hoạt Động</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5" />
                            <span>Tạm Dừng</span>
                          </>
                        )}
                      </button>

                      {/* View & Edit Parameters Modal trigger */}
                      <button
                        type="button"
                        onClick={() => handleOpenParamModal(rule)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Xem & Tinh chỉnh tham số cấu hình quy tắc"
                      >
                        <Settings className="w-3.5 h-3.5 text-blue-600" />
                        <span>Xem Tham Số ({params.length})</span>
                      </button>

                      {/* Expand/Collapse parameters accordion */}
                      <button
                        type="button"
                        onClick={() => toggleCardExpansion(rule.id)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                        title="Mở rộng / Thu gọn tham số chi tiết"
                      >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* EXPANDED SECTION: CONFIGURATION PARAMETERS & LAST RESULT */}
                  {isExpanded && (
                    <div className="bg-slate-50/70 p-4 border-t border-slate-100 space-y-3.5 text-xs animate-in slide-in-from-top-1">
                      {/* Configuration Parameters Details */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Settings className="w-3.5 h-3.5 text-slate-600" />
                            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                              Tham Số Cấu Hình Hoạt Động (Active Configuration Parameters)
                            </h4>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Owner: {rule.owner || 'System Administrator'}
                          </span>
                        </div>

                        {params.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                            {params.map((p) => (
                              <div
                                key={p.key}
                                className="bg-white rounded-lg border border-slate-200 p-2.5 space-y-1 shadow-2xs"
                              >
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="font-bold text-slate-900">{p.name}</span>
                                  <span className="font-mono text-[9px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                                    {p.dataType}
                                  </span>
                                </div>
                                <div className="flex items-baseline gap-1.5 pt-0.5">
                                  <span className="text-xs font-mono font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                    {String(p.value)} {p.unit || ''}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    (Mặc định: {String(p.defaultValue)} {p.unit || ''})
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-500 leading-tight pt-0.5">
                                  {p.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-500 italic bg-white p-2.5 rounded-lg border border-slate-200">
                            Không có tham số độc lập. Quy tắc áp dụng assertion trực tiếp theo ngưỡng: {rule.threshold}
                          </div>
                        )}
                      </div>

                      {/* Expression & Target Tables */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-1">
                        {rule.expression && (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                              <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Biểu Thức Logic Thẩm Định (Evaluation Expression):</span>
                            </div>
                            <div className="bg-slate-900 text-emerald-400 font-mono text-[11px] p-2.5 rounded-lg overflow-x-auto leading-relaxed border border-slate-800">
                              {rule.expression}
                            </div>
                          </div>
                        )}

                        {rule.lastResult && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                              <div className="flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5 text-amber-600" />
                                <span>Kết Quả Lần Chạy Gần Nhất:</span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400">
                                Lô: {rule.lastResult.batchId}
                              </span>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-600">Đã kiểm: <strong>{rule.lastResult.recordsEvaluated.toLocaleString()}</strong> bản ghi</span>
                                <span className="text-emerald-700 font-bold">Pass Rate: {rule.lastResult.passRate.toFixed(2)}%</span>
                              </div>
                              <p className="text-[11px] text-slate-600 leading-tight">
                                {rule.lastResult.summaryMessage}
                              </p>
                              {rule.lastResult.logSnippet && (
                                <div className="text-[10px] font-mono text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-150 truncate">
                                  {rule.lastResult.logSnippet}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* SECTION 4B: TABLE VIEW */
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-2.5 px-3">Mã &amp; Nhóm</th>
                  <th className="py-2.5 px-3">Tên Quy Tắc</th>
                  <th className="py-2.5 px-3">Ngưỡng Thẩm Định</th>
                  <th className="py-2.5 px-3">Tham Số Cấu Hình</th>
                  <th className="py-2.5 px-3">Mức Độ</th>
                  <th className="py-2.5 px-3">KPI Đích</th>
                  <th className="py-2.5 px-3 text-right">Đã Chặn</th>
                  <th className="py-2.5 px-3 text-center">Trạng Thái</th>
                  <th className="py-2.5 px-3 text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredRules.map((rule) => {
                  const params = rule.parameters || [];
                  return (
                    <tr
                      key={rule.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        !rule.active ? 'opacity-60 bg-slate-50/50' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="font-mono font-bold text-slate-900">{rule.id}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          {getCategoryIcon(rule.category)}
                          <span>{rule.category}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{rule.name}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1 max-w-xs">
                          {rule.ruleDescription}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-blue-900 max-w-xs truncate">
                        {rule.threshold}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1 flex-wrap max-w-xs">
                          {params.map((p) => (
                            <span
                              key={p.key}
                              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 whitespace-nowrap"
                              title={`${p.name}: ${p.description}`}
                            >
                              {p.key.split('_')[0]}: <strong>{String(p.value)}</strong>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded border ${getSeverityBadge(
                            rule.severity
                          )}`}
                        >
                          {rule.severity || 'CRITICAL'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[10px] font-bold text-purple-700 whitespace-nowrap">
                        {rule.kpiCode || 'ALL'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-700 whitespace-nowrap">
                        {rule.violationsCount}
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            rule.active
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {rule.active ? 'ACTIVE' : 'PAUSED'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenParamModal(rule)}
                            className="p-1 rounded text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Xem & Tinh chỉnh tham số"
                          >
                            <Settings className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onToggleRule(rule.id)}
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              rule.active
                                ? 'text-emerald-700 hover:bg-emerald-50'
                                : 'text-slate-400 hover:bg-slate-100'
                            }`}
                            title={rule.active ? 'Tạm dừng quy tắc' : 'Kích hoạt quy tắc'}
                          >
                            {rule.active ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: PARAMETER INSPECTOR & CONFIGURATION EDITOR */}
      {paramModalRule && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Cấu Hình Tham Số Hoạt Động: {paramModalRule.id}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {paramModalRule.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{paramModalRule.name}</p>
              </div>

              <button
                onClick={() => setParamModalRule(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="px-4 pt-2 border-b border-slate-200 bg-white flex items-center gap-2">
              <button
                onClick={() => setActiveParamTab('FORM')}
                className={`px-3 py-1.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeParamTab === 'FORM'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Giao Diện Tinh Chỉnh (Interactive Form)
              </button>
              <button
                onClick={() => setActiveParamTab('JSON')}
                className={`px-3 py-1.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeParamTab === 'JSON'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Schema JSON &amp; Assertion
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
              {activeParamTab === 'FORM' ? (
                <div className="space-y-3.5">
                  <div className="bg-blue-50/60 border border-blue-200/80 rounded-lg p-3 text-slate-700 text-xs leading-relaxed">
                    <strong>Quy định thẩm định:</strong> {paramModalRule.ruleDescription}
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Danh Sách Tham Số Có Thể Cấu Hình ({editingParams.length})
                    </h4>

                    {editingParams.map((param, idx) => (
                      <div
                        key={param.key}
                        className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-900">{param.name}</span>
                            <span className="ml-2 font-mono text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                              {param.key}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500">
                            Mặc định: <strong>{String(param.defaultValue)}</strong> {param.unit || ''}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600">{param.description}</p>

                        {/* Input Control */}
                        <div className="pt-1 flex items-center gap-3">
                          {param.dataType === 'boolean' ? (
                            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                              <input
                                type="checkbox"
                                checked={Boolean(param.value)}
                                disabled={!param.isEditable}
                                onChange={(e) => {
                                  const updated = [...editingParams];
                                  updated[idx].value = e.target.checked;
                                  setEditingParams(updated);
                                }}
                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                              />
                              <span>Kích hoạt ràng buộc ({param.value ? 'BẬT' : 'TẮT'})</span>
                            </label>
                          ) : param.dataType === 'percentage' || param.dataType === 'number' ? (
                            <div className="flex items-center gap-2 w-full max-w-xs">
                              <input
                                type="number"
                                step={param.dataType === 'percentage' ? '0.05' : '1'}
                                min={param.min}
                                max={param.max}
                                value={Number(param.value)}
                                disabled={!param.isEditable}
                                onChange={(e) => {
                                  const updated = [...editingParams];
                                  updated[idx].value = parseFloat(e.target.value) || 0;
                                  setEditingParams(updated);
                                }}
                                className="w-28 px-2 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                              />
                              <span className="text-slate-600 font-bold">{param.unit || ''}</span>
                              {param.min !== undefined && param.max !== undefined && (
                                <span className="text-[10px] text-slate-400">
                                  (Khoảng: {param.min} - {param.max})
                                </span>
                              )}
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={String(param.value)}
                              disabled={!param.isEditable}
                              onChange={(e) => {
                                const updated = [...editingParams];
                                updated[idx].value = e.target.value;
                                setEditingParams(updated);
                              }}
                              className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                            />
                          )}

                          {!param.isEditable && (
                            <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 whitespace-nowrap">
                              Khóa hệ thống
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">JSON Specification:</span>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(JSON.stringify(paramModalRule, null, 2));
                        onShowToast('Đã sao chép cấu hình JSON của quy tắc.');
                      }}
                      className="text-blue-600 hover:text-blue-800 text-[11px] font-bold flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Sao chép JSON</span>
                    </button>
                  </div>
                  <pre className="bg-slate-900 text-emerald-400 font-mono text-[11px] p-3 rounded-lg overflow-x-auto max-h-80 border border-slate-800 leading-relaxed">
                    {JSON.stringify(paramModalRule, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  if (paramModalRule.parameters) {
                    setEditingParams(
                      paramModalRule.parameters.map((p) => ({ ...p, value: p.defaultValue }))
                    );
                    onShowToast('Đã khôi phục các tham số về giá trị mặc định.');
                  }
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Khôi Phục Mặc Định
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setParamModalRule(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleSaveParameters}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu Cấu Hình Tham Số</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: GROUP EXECUTION TRACE LOG INSPECTOR */}
      {traceModalGroup && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Nhật Ký Thực Thi Nhóm: {traceModalGroup.groupNameVi}
                  </h3>
                  {getExecutionStatusBadge(traceModalGroup.lastExecution.status)}
                </div>
                <p className="text-xs text-slate-500 font-mono">
                  Mã lần chạy: {traceModalGroup.lastExecution.runId} | Lô: {traceModalGroup.lastExecution.batchId}
                </p>
              </div>

              <button
                onClick={() => setTraceModalGroup(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Metrics Summary Strip */}
              <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <div className="text-[10px] text-slate-500 font-medium">Đã Kiểm Định</div>
                  <div className="text-sm font-bold text-slate-900 font-mono">
                    {traceModalGroup.lastExecution.recordsEvaluated.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-medium">Bản Ghi Đạt</div>
                  <div className="text-sm font-bold text-emerald-700 font-mono">
                    {traceModalGroup.lastExecution.passedCount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-medium">Vi Phạm Đã Bắt</div>
                  <div className="text-sm font-bold text-rose-700 font-mono">
                    {traceModalGroup.lastExecution.violationCount}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-medium">Thời Gian Chạy</div>
                  <div className="text-sm font-bold text-blue-700 font-mono">
                    {traceModalGroup.lastExecution.durationMs}ms
                  </div>
                </div>
              </div>

              {/* Summary message */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3 text-slate-800 text-xs">
                <strong>Đánh giá tổng quát:</strong> {traceModalGroup.lastExecution.summaryMessage}
              </div>

              {/* Console log snippet */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-slate-600" />
                    <span>Chi Tiết Console Execution Trace Log:</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Channel: GMES-Pipeline-Daemon</span>
                </div>
                <div className="bg-slate-950 text-emerald-400 font-mono text-[11px] p-3 rounded-lg overflow-x-auto leading-relaxed border border-slate-800 whitespace-pre-wrap">
                  {traceModalGroup.lastExecution.logSnippet || 'No trace log available for this batch.'}
                </div>
              </div>

              {/* Historical runs list */}
              {traceModalGroup.history && traceModalGroup.history.length > 0 && (
                <div className="space-y-2 pt-1">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Lịch Sử Các Lần Chạy Trước Đó ({traceModalGroup.history.length})
                  </h4>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                    {traceModalGroup.history.map((h, i) => (
                      <div key={i} className="p-2.5 bg-white flex items-center justify-between text-[11px]">
                        <div className="space-y-0.5">
                          <div className="font-mono font-bold text-slate-800">{h.runId}</div>
                          <div className="text-slate-500 text-[10px]">Thời gian: {h.timestamp} | Lô: {h.batchId}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold font-mono text-emerald-700">{h.passRate}% Pass</div>
                          <div className="text-[10px] text-slate-500">{h.durationMs}ms</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                disabled={isReExecutingGroup}
                onClick={() => handleReExecuteGroup(traceModalGroup)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition-colors cursor-pointer shadow-xs flex items-center gap-1.5 disabled:opacity-60"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isReExecutingGroup ? 'animate-spin' : ''}`} />
                <span>{isReExecutingGroup ? 'Đang thực thi lại...' : 'Chạy Lại Nhóm Này (Re-Run Group)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setTraceModalGroup(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer"
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
