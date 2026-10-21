import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Check,
  X,
  Send,
  ExternalLink,
  Search,
  Filter,
  Activity,
  Database,
  ArrowLeft,
  Eye,
  FileCheck2,
  Layers,
  Server,
  User,
  Users,
  Sparkles,
  Play,
  RotateCw,
} from 'lucide-react';
import { DataHealthStrip } from './DataHealthStrip';
import { ArchitecturePipelineVisualizer } from './ArchitecturePipelineVisualizer';
import { SourceHealthMatrix } from './SourceHealthMatrix';
import { DataQuarantinePool } from './DataQuarantinePool';
import { ValidationEngineTab } from './ValidationEngineTab';
import { ReconciliationPipelineTab } from './ReconciliationPipelineTab';
import { ManualDataEntryScreen } from './ManualDataEntryScreen';
import {
  INITIAL_QUARANTINE_RECORDS,
  SOURCE_SYSTEMS_HEALTH,
  VALIDATION_RULES_CATALOG,
  RECONCILIATION_BATCHES,
  RULE_GROUP_SUMMARIES,
} from '../data/enterpriseDataQualityData';
import {
  QuarantineRecord,
  SourceSystemHealth,
  ValidationRule,
  ReconciliationBatch,
  UserRole,
  RuleGroupExecutionSummary,
  RuleCategory,
  RuleParameterConfig,
} from '../types';

interface DataQualityCenterProps {
  onBackToControlTower: () => void;
  onShowToast: (msg: string) => void;
  initialTab?: 'overview' | 'quarantine' | 'rules' | 'reconciliation' | 'manual_entry';
}

export const DataQualityCenter: React.FC<DataQualityCenterProps> = ({
  onBackToControlTower,
  onShowToast,
  initialTab = 'overview',
}) => {
  // Main Navigation Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'quarantine' | 'rules' | 'reconciliation' | 'manual_entry'>(initialTab);

  // State collections
  const [quarantineRecords, setQuarantineRecords] = useState<QuarantineRecord[]>(INITIAL_QUARANTINE_RECORDS);
  const [sourceSystems, setSourceSystems] = useState<SourceSystemHealth[]>(SOURCE_SYSTEMS_HEALTH);
  const [validationRules, setValidationRules] = useState<ValidationRule[]>(VALIDATION_RULES_CATALOG);
  const [ruleGroupSummaries, setRuleGroupSummaries] = useState<RuleGroupExecutionSummary[]>(RULE_GROUP_SUMMARIES);
  const [reconciliationBatches, setReconciliationBatches] = useState<ReconciliationBatch[]>(RECONCILIATION_BATCHES);

  // Persona / RBAC State
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('DATA_STEWARD');
  const [currentUserName, setCurrentUserName] = useState<string>('Nguyễn Văn Hùng (Data Governance Lead)');

  // Simulation states
  const [isSimulatingIngestion, setIsSimulatingIngestion] = useState(false);
  const [preflightingSourceId, setPreflightingSourceId] = useState<string | null>(null);
  const [isDryRunningRules, setIsDryRunningRules] = useState(false);
  const [isReconciling, setIsReconciling] = useState(false);

  // Switch Persona handler
  const handleSwitchRole = (role: UserRole) => {
    setCurrentUserRole(role);
    switch (role) {
      case 'EXECUTIVE':
        setCurrentUserName('Trần Văn Long (Phó TGĐ Sản xuất)');
        break;
      case 'DATA_STEWARD':
        setCurrentUserName('Nguyễn Văn Hùng (Data Governance Lead)');
        break;
      case 'PLANT_QA':
        setCurrentUserName('Vũ Đức Thịnh (Trưởng phòng QA Nhà máy)');
        break;
      case 'IT_ADMIN':
        setCurrentUserName('Trịnh Công Sơn (Kiến trúc sư Hệ thống IT)');
        break;
    }
    onShowToast(`Đã chuyển đổi ngữ cảnh vai trò sang: ${role}`);
  };

  // Preflight check trigger
  const handleTriggerPreflight = (sourceId: string) => {
    setPreflightingSourceId(sourceId);
    setTimeout(() => {
      setPreflightingSourceId(null);
      setSourceSystems((prev) =>
        prev.map((s) =>
          s.id === sourceId
            ? {
                ...s,
                lastSyncTimestamp: 'Vừa xong (0s)',
                preflightStatus: 'HEALTHY',
                averageLatencyMs: s.averageLatencyMs > 0 ? s.averageLatencyMs : 180,
              }
            : s
        )
      );
      onShowToast(`Đã hoàn tất Preflight Check kết nối & schema cho nguồn #${sourceId}. Tín hiệu đạt chuẩn!`);
    }, 1100);
  };

  // Pipeline simulation trigger
  const handleSimulateIngestion = () => {
    setIsSimulatingIngestion(true);
    setTimeout(() => {
      setIsSimulatingIngestion(false);
      onShowToast('Đã mô phỏng nạp 1 lô dữ liệu micro-batch (250 bản ghi). 248 đạt chuẩn, 2 bản ghi bị cách ly.');
    }, 1200);
  };

  // Dry run rules trigger
  const handleDryRunRules = () => {
    setIsDryRunningRules(true);
    setTimeout(() => {
      setIsDryRunningRules(false);
      onShowToast('Đã hoàn tất Dry-Run kiểm định 8 quy tắc trên 15,200 bản ghi lịch sử. Tất cả assertion logic đạt chuẩn.');
    }, 1300);
  };

  // Reconciliation trigger
  const handleTriggerReconcile = () => {
    setIsReconciling(true);
    setTimeout(() => {
      setIsReconciling(false);
      onShowToast('Đã hoàn tất kiểm toán đối soát Nguồn - Đích. Tỷ lệ cân bằng hạch toán đạt 100%.');
    }, 1000);
  };

  // Rule toggle single
  const handleToggleRule = (ruleId: string) => {
    setValidationRules((prev) => {
      const next = prev.map((r) => (r.id === ruleId ? { ...r, active: !r.active } : r));
      // update ruleGroupSummaries active count
      setRuleGroupSummaries((grpPrev) =>
        grpPrev.map((grp) => {
          const activeInGroup = next.filter((r) => r.category === grp.group && r.active).length;
          return { ...grp, activeRulesCount: activeInGroup };
        })
      );
      return next;
    });
    onShowToast(`Đã cập nhật trạng thái hoạt động của quy tắc ${ruleId}.`);
  };

  // Rule toggle whole group
  const handleToggleGroup = (group: RuleCategory, active: boolean) => {
    setValidationRules((prev) =>
      prev.map((r) => (r.category === group ? { ...r, active } : r))
    );
    setRuleGroupSummaries((prev) =>
      prev.map((grp) =>
        grp.group === group
          ? { ...grp, activeRulesCount: active ? grp.rulesCount : 0 }
          : grp
      )
    );
  };

  // Update rule parameters
  const handleUpdateRuleParameters = (ruleId: string, updatedParams: RuleParameterConfig[]) => {
    setValidationRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, parameters: updatedParams } : r))
    );
  };

  // Update single quarantine record
  const handleUpdateQuarantineRecord = (updated: QuarantineRecord) => {
    setQuarantineRecords((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
  };

  // Batch revalidate
  const handleBatchRevalidate = (ids: string[]) => {
    onShowToast(`Đang chạy kiểm định lại cho ${ids.length} bản ghi được chọn...`);
    setTimeout(() => {
      setQuarantineRecords((prev) =>
        prev.map((r) =>
          ids.includes(r.id)
            ? {
                ...r,
                currentStatus: 'RESOLVED',
                resolutionNote: 'Đã giải phóng sau đợt kiểm định lại đồng loạt.',
                history: [
                  {
                    id: `HIST-${Date.now()}-${r.id}`,
                    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                    action: 'BATCH_REVALIDATE_RESOLVED',
                    actor: currentUserName,
                    actorRole: currentUserRole,
                    fromStatus: r.currentStatus,
                    toStatus: 'RESOLVED',
                    notes: 'Đã vượt qua kiểm định lại đồng loạt.',
                  },
                  ...r.history,
                ],
              }
            : r
        )
      );
      onShowToast(`Đã hoàn tất kiểm định lại và giải phóng ${ids.length} bản ghi vào KPI Store.`);
    }, 1000);
  };

  return (
    <div className="space-y-3.5 animate-in fade-in select-none">
      {/* Top Header & Breadcrumb Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToControlTower}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Quay lại màn hình Executive Control Tower"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                KPI Data Quality & Governance Control Center
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                GMES Live Guardian
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                ISO-8000 Ready
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Cổng kiểm soát chất lượng dữ liệu tập trung giữa các Hệ thống Nguồn và Kho KPI Chính thức
            </p>
          </div>
        </div>

        {/* Persona Switcher & Top Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* RBAC Persona Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1">
            <User className="w-3.5 h-3.5 text-slate-500 ml-1" />
            <span className="text-[10px] font-bold text-slate-500">Vai trò:</span>
            <select
              value={currentUserRole}
              onChange={(e) => handleSwitchRole(e.target.value as UserRole)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer pr-1"
            >
              <option value="DATA_STEWARD">Data Steward (Governance)</option>
              <option value="EXECUTIVE">Executive (Ban Lãnh Đạo)</option>
              <option value="PLANT_QA">Plant QA Lead (Nhà máy)</option>
              <option value="IT_ADMIN">IT Integration Admin</option>
            </select>
          </div>

          <button
            onClick={onBackToControlTower}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            Màn hình Control Tower
          </button>
        </div>
      </div>

      {/* Principle 3: Data Truth Indicator Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs border border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-tight">
                Chế độ Dữ liệu: VERIFIED PRODUCTION TELEMETRY
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono font-bold">
                100% AUDITABLE
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Mọi số liệu minh họa có gắn nhãn nguồn. Không trộn lẫn số liệu demo vào kho KPI chính thức.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[11px] text-slate-400">
            Lần đồng bộ GMES: <strong className="text-white">12 giây trước</strong>
          </span>
        </div>
      </div>

      {/* 4 Health KPI Cards Strip */}
      <DataHealthStrip
        quarantineRecords={quarantineRecords}
        onSelectTab={(tab) => setActiveTab(tab)}
        onFilterQuarantineSeverity={() => setActiveTab('quarantine')}
      />

      {/* Main Tabs Navigation Header */}
      <div className="flex items-center justify-between bg-white border border-slate-200/90 rounded-xl p-1.5 shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Tổng quan & Luồng Kiến trúc</span>
          </button>

          <button
            onClick={() => setActiveTab('quarantine')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'quarantine'
                ? 'bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Quarantine Pool (Xử lý Ngoại lệ)</span>
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
              {
                quarantineRecords.filter(
                  (r) => r.currentStatus !== 'RESOLVED' && r.currentStatus !== 'APPROVED_EXCEPTION' && r.currentStatus !== 'REJECTED'
                ).length
              }
            </span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'rules'
                ? 'bg-blue-50 text-blue-900 border border-blue-300 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            <span>Validation Rules Catalog (Danh Mục Quy Tắc)</span>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">
              {validationRules.filter((r) => r.active).length} / {validationRules.length} Active
            </span>
          </button>

          <button
            onClick={() => setActiveTab('reconciliation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'reconciliation'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Đối soát Nguồn - Đích (Reconciliation)</span>
          </button>

          <button
            onClick={() => setActiveTab('manual_entry')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'manual_entry'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Nhập Liệu Manual & Upload Tệp</span>
            <span className="text-[9px] bg-purple-500 text-white px-1.5 py-0.2 rounded-full font-bold">
              New
            </span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT RENDERING */}
      {activeTab === 'overview' && (
        <div className="space-y-3.5">
          {/* Architecture Pipeline Flowchart */}
          <ArchitecturePipelineVisualizer
            onSimulateIngestion={handleSimulateIngestion}
            isSimulating={isSimulatingIngestion}
          />

          {/* Source Health Matrix */}
          <SourceHealthMatrix
            sources={sourceSystems}
            onTriggerPreflight={handleTriggerPreflight}
            preflightingSourceId={preflightingSourceId}
          />
        </div>
      )}

      {activeTab === 'quarantine' && (
        <DataQuarantinePool
          records={quarantineRecords}
          onUpdateRecord={handleUpdateQuarantineRecord}
          onBatchRevalidate={handleBatchRevalidate}
          onShowToast={onShowToast}
          currentUserRole={currentUserRole}
          currentUserName={currentUserName}
        />
      )}

      {activeTab === 'rules' && (
        <ValidationEngineTab
          rules={validationRules}
          groupSummaries={ruleGroupSummaries}
          onToggleRule={handleToggleRule}
          onToggleGroup={handleToggleGroup}
          onUpdateRuleParameters={handleUpdateRuleParameters}
          onDryRunValidation={handleDryRunRules}
          isDryRunning={isDryRunningRules}
          onShowToast={onShowToast}
        />
      )}

      {activeTab === 'reconciliation' && (
        <ReconciliationPipelineTab
          batches={reconciliationBatches}
          onTriggerReconcile={handleTriggerReconcile}
          isReconciling={isReconciling}
        />
      )}

      {activeTab === 'manual_entry' && (
        <ManualDataEntryScreen
          onBackToControlTower={onBackToControlTower}
          onOpenDataQuality={(tab) => setActiveTab(tab || 'overview')}
          onShowToast={onShowToast}
          onAddQuarantineRecord={(rec) => {
            setQuarantineRecords((prev) => [rec, ...prev]);
          }}
        />
      )}
    </div>
  );
};
