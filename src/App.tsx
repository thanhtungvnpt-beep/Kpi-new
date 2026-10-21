import React, { useState } from 'react';
import { TopHeader } from './components/TopHeader';
import { Sidebar } from './components/Sidebar';
import { ControlTowerHeader } from './components/ControlTowerHeader';
import { KPICardsRow } from './components/KPICardsRow';
import { ProductionChartCard } from './components/ProductionChartCard';
import { VendorMapCard } from './components/VendorMapCard';
import { AIExecutiveInsightCard } from './components/AIExecutiveInsightCard';
import { AIPredictiveAlertsCard } from './components/AIPredictiveAlertsCard';
import { KeyMetricsVendorTable } from './components/KeyMetricsVendorTable';
import { IssueRiskTable } from './components/IssueRiskTable';
import { ActionsApprovalTable } from './components/ActionsApprovalTable';
import { PlantLiveStatusGrid } from './components/PlantLiveStatusGrid';
import { UpcomingMilestonesTable } from './components/UpcomingMilestonesTable';
import { QuickActionsGrid } from './components/QuickActionsGrid';
import { BottomStatusBar } from './components/BottomStatusBar';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { QuickActionModal } from './components/QuickActionModal';
import { ExportModal } from './components/ExportModal';
import { VendorDetailModal } from './components/VendorDetailModal';
import { DataQualityCenter } from './components/DataQualityCenter';
import { DataHealthStrip } from './components/DataHealthStrip';
import { ManualDataEntryScreen } from './components/ManualDataEntryScreen';
import { INITIAL_QUARANTINE_RECORDS } from './data/enterpriseDataQualityData';
import { Language, IssueItem, ApprovalAction, QuarantineRecord } from './types';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('EN');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSidebarItem, setActiveSidebarItem] = useState('control_tower');
  const [dataQualityTab, setDataQualityTab] = useState<'overview' | 'quarantine' | 'rules' | 'reconciliation' | 'manual_entry'>('overview');
  const [quarantineList, setQuarantineList] = useState<QuarantineRecord[]>(INITIAL_QUARANTINE_RECORDS);
  const [searchQuery, setSearchQuery] = useState('');

  // Header filter states
  const [selectedVendor, setSelectedVendor] = useState('all');
  const [selectedPlant, setSelectedPlant] = useState('all');
  const [timeRange, setTimeRange] = useState('30');

  // Modals & Drawers state
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(null);
  const [selectedVendorModal, setSelectedVendorModal] = useState<string | null>(null);

  // Success Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleApplyAction = (actionText: string) => {
    setIsAIAssistantOpen(false);
    showToast(`Đã áp dụng hành động: "${actionText}"`);
  };

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-slate-800 flex flex-col font-sans">
      {/* Top Navigation Header */}
      <TopHeader
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          activeItem={activeSidebarItem}
          onSelectItem={setActiveSidebarItem}
          onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        />

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 z-20 lg:hidden"
          />
        )}

        {/* Main Dashboard Viewport */}
        <main className="flex-1 overflow-y-auto p-3.5 space-y-3 pb-12 transition-all">
          {activeSidebarItem === 'data_quality' ? (
            <DataQualityCenter
              onBackToControlTower={() => setActiveSidebarItem('control_tower')}
              onShowToast={showToast}
              initialTab={dataQualityTab}
            />
          ) : activeSidebarItem === 'manual_entry' ? (
            <ManualDataEntryScreen
              onBackToControlTower={() => setActiveSidebarItem('control_tower')}
              onOpenDataQuality={(tab) => {
                setDataQualityTab(tab || 'overview');
                setActiveSidebarItem('data_quality');
              }}
              onShowToast={showToast}
              onAddQuarantineRecord={(rec) => {
                setQuarantineList((prev) => [rec, ...prev]);
                INITIAL_QUARANTINE_RECORDS.unshift(rec);
              }}
            />
          ) : (
            <>
              {/* Executive Control Tower Bar */}
              <ControlTowerHeader
                selectedVendor={selectedVendor}
                onVendorChange={setSelectedVendor}
                selectedPlant={selectedPlant}
                onPlantChange={setSelectedPlant}
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
                onExport={() => setIsExportModalOpen(true)}
                onOpenDataQuality={() => {
                  setDataQualityTab('overview');
                  setActiveSidebarItem('data_quality');
                }}
              />

              {/* Enterprise Data Health KPI Strip (Phase 5.2) */}
              <DataHealthStrip
                quarantineRecords={quarantineList}
                onSelectTab={(tab) => {
                  setDataQualityTab(tab);
                  setActiveSidebarItem('data_quality');
                }}
              />

              {/* Top 6 KPI Metric Cards with Provenance & Lineage */}
              <KPICardsRow
                onOpenDataQuality={() => {
                  setDataQualityTab('overview');
                  setActiveSidebarItem('data_quality');
                }}
              />

              {/* Row 2: Production Overview | Vendor Map | AI Executive Insight | AI Predictive Alerts */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 items-stretch">
                <div className="h-full">
                  <ProductionChartCard />
                </div>
                <div className="h-full">
                  <VendorMapCard onSelectVendor={(id) => setSelectedVendorModal(id)} />
                </div>
                <div className="h-full">
                  <AIExecutiveInsightCard
                    onOpenAllInsights={() => setIsAIAssistantOpen(true)}
                    onApplySuggestion={(act) => handleApplyAction(act)}
                  />
                </div>
                <div className="h-full">
                  <AIPredictiveAlertsCard
                    onApplyAction={(act) => handleApplyAction(act)}
                    onSelectVendor={(vendorId) => setSelectedVendorModal(vendorId)}
                    onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
                  />
                </div>
              </div>

              {/* Row 3: Key Metrics by Vendor | Issue & Risk Summary | Actions Requiring Approval */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-stretch">
                <div className="h-full">
                  <KeyMetricsVendorTable
                    onSelectVendor={(id) => setSelectedVendorModal(id)}
                  />
                </div>
                <div className="h-full">
                  <IssueRiskTable
                    onOpenIssueModal={(issue) =>
                      setActiveQuickAction(issue ? `Issue #${issue.id}: ${issue.issue}` : 'Create Issue')
                    }
                  />
                </div>
                <div className="h-full">
                  <ActionsApprovalTable
                    onOpenApprovalModal={(act) =>
                      setActiveQuickAction(act ? `Approve #${act.id}: ${act.description}` : 'Request Approval')
                    }
                    onBatchApprove={(count) =>
                      showToast(`Đã duyệt đồng loạt ${count} yêu cầu thành công!`)
                    }
                  />
                </div>
              </div>

              {/* Row 4: Plant Live Status | Upcoming Milestones | Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
                {/* Plant Live Status (Images + Key Info) - spans 5 cols */}
                <div className="lg:col-span-5 h-full">
                  <PlantLiveStatusGrid
                    onSelectPlant={(plantId) => setSelectedVendorModal(plantId)}
                  />
                </div>

                {/* Upcoming Milestones - spans 4 cols */}
                <div className="lg:col-span-4 h-full">
                  <UpcomingMilestonesTable
                    onOpenMilestoneModal={() => showToast('Mở danh sách toàn bộ các mốc tiến độ dự án')}
                  />
                </div>

                {/* Quick Actions - spans 3 cols */}
                <div className="lg:col-span-3 h-full">
                  <QuickActionsGrid
                    onActionClick={(actionName) => {
                      if (actionName.includes('Manual QA') || actionName.includes('Nhập Liệu')) {
                        setActiveSidebarItem('manual_entry');
                        showToast('Đã mở Màn hình Nhập Liệu Thủ Công & Nạp Tệp KPI');
                      } else {
                        setActiveQuickAction(actionName);
                      }
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Fixed Bottom Status Bar */}
      <BottomStatusBar
        onFixZoom={() => showToast('Đã thiết lập tỷ lệ hiển thị chuẩn 100%')}
      />

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        onApplyAction={handleApplyAction}
      />

      {/* Quick Action Modal */}
      <QuickActionModal
        actionTitle={activeQuickAction}
        onClose={() => setActiveQuickAction(null)}
        onSubmitSuccess={showToast}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* Vendor Drilldown Modal */}
      <VendorDetailModal
        vendorId={selectedVendorModal}
        onClose={() => setSelectedVendorModal(null)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-12 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
