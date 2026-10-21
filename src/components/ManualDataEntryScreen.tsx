import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Clock,
  User,
  ShieldAlert,
  ShieldCheck,
  RotateCw,
  Download,
  Info,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  Eye,
  Check,
  X,
  FileCheck2,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import { ManualEntryRecord, ManualBatchSubmission, QuarantineRecord } from '../types';

interface ManualDataEntryScreenProps {
  onBackToControlTower: () => void;
  onOpenDataQuality: (tab?: 'overview' | 'quarantine' | 'rules' | 'reconciliation') => void;
  onShowToast: (msg: string) => void;
  onAddQuarantineRecord?: (record: QuarantineRecord) => void;
}

export const ManualDataEntryScreen: React.FC<ManualDataEntryScreenProps> = ({
  onBackToControlTower,
  onOpenDataQuality,
  onShowToast,
  onAddQuarantineRecord,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'upload' | 'history'>('form');

  // Form state
  const [plant, setPlant] = useState('KHV');
  const [line, setLine] = useState('Line 02 - SMT High Speed');
  const [station, setStation] = useState('SMT-Mounter-02');
  const [shift, setShift] = useState('Ca 1 (06:00 - 14:00)');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('14:00');
  const [workOrderId, setWorkOrderId] = useState('WO-2025-0425-088');
  const [planQty, setPlanQty] = useState<number>(1000);
  const [actualQty, setActualQty] = useState<number>(980);
  const [scrapQty, setScrapQty] = useState<number>(15);
  const [reworkQty, setReworkQty] = useState<number>(5);
  const [downtimeMinutes, setDowntimeMinutes] = useState<number>(20);
  const [downtimeReason, setDowntimeReason] = useState('Thay cuộn linh kiện Feeder');
  const [headcount, setHeadcount] = useState<number>(12);
  const [inspectorName, setInspectorName] = useState('Đỗ Thanh Hùng (QA Lead)');
  const [inspectorBadgeId, setInspectorBadgeId] = useState('QA-VN-8842');
  const [notes, setNotes] = useState('Kiểm tra chất lượng định kỳ ca 1. Thông số đáp ứng dung sai tiêu chuẩn.');

  // Upload state
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewRows, setPreviewRows] = useState<ManualEntryRecord[]>([]);
  const [isValidatingBatch, setIsValidatingBatch] = useState(false);

  // Ingestion history state
  const [batchHistory, setBatchHistory] = useState<ManualBatchSubmission[]>([
    {
      batchId: 'BATCH-MANUAL-20250425-01',
      timestamp: '25/04/2025 13:45',
      method: 'FORM_DIRECT',
      plant: 'KHV (Bắc Ninh)',
      operator: 'Đỗ Thanh Hùng (QA-VN-8842)',
      totalRecords: 1,
      validRecords: 1,
      quarantinedRecords: 0,
      status: 'COMMITTED',
      summary: 'Sản lượng 980 pcs | Yield 98.5% | Hợp lệ',
    },
    {
      batchId: 'BATCH-CSV-20250425-04',
      timestamp: '25/04/2025 11:20',
      method: 'CSV_UPLOAD',
      plant: 'KTECH (Đà Nẵng)',
      operator: 'Lê Hoàng Nam (IT-OPS-09)',
      totalRecords: 12,
      validRecords: 10,
      quarantinedRecords: 2,
      status: 'QUARANTINED',
      summary: '10 bản ghi nạp thành công, 2 bản ghi cách ly do vi phạm giới hạn công suất',
    },
    {
      batchId: 'BATCH-CSV-20250424-02',
      timestamp: '24/04/2025 16:30',
      method: 'CSV_UPLOAD',
      plant: 'DREAM TECH (Hải Dương)',
      operator: 'Trần Minh Quân (QA-DT-10)',
      totalRecords: 25,
      validRecords: 25,
      quarantinedRecords: 0,
      status: 'COMMITTED',
      summary: '25 bản ghi kiểm định ca 2 nạp thành công vào Kho KPI',
    },
  ]);

  // Live Calculations for Real-Time Validation
  const totalProduced = actualQty + scrapQty;
  const yieldRate = totalProduced > 0 ? (actualQty / totalProduced) * 100 : 0;
  const defectRate = totalProduced > 0 ? (scrapQty / totalProduced) * 100 : 0;
  const planAttainment = planQty > 0 ? (actualQty / planQty) * 100 : 0;
  const paritySum = yieldRate + defectRate;

  // Validation Checks
  const isCapacityExceeded = planQty > 0 && actualQty > planQty * 1.15;
  const isParityViolated = totalProduced > 0 && Math.abs(paritySum - 100) > 0.5;
  const isDowntimeExcessive = downtimeMinutes > 480;
  const isFutureDate = new Date(`${date}T${time}`) > new Date();

  const hasFormErrors = isCapacityExceeded || isParityViolated || isDowntimeExcessive || isFutureDate;

  // Handler: Set Quick Demo Form Valid
  const handleLoadValidSample = () => {
    setPlant('KHV');
    setLine('Line 02 - SMT High Speed');
    setStation('SMT-Mounter-02');
    setShift('Ca 1 (06:00 - 14:00)');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('14:00');
    setWorkOrderId('WO-2025-0425-088');
    setPlanQty(1000);
    setActualQty(975);
    setScrapQty(25);
    setReworkQty(8);
    setDowntimeMinutes(15);
    setDowntimeReason('Thay cuộn linh kiện Feeder');
    setHeadcount(12);
    setInspectorName('Đỗ Thanh Hùng (QA Lead)');
    setInspectorBadgeId('QA-VN-8842');
    setNotes('Dữ liệu lấy mẫu ca 1 hợp lệ, tỷ lệ đạt 97.5%, dung sai ổn định.');
    onShowToast('Đã nạp mẫu dữ liệu HỢP LỆ (100% Pass)');
  };

  // Handler: Set Quick Demo Form Anomaly (Triggers Quarantine)
  const handleLoadAnomalySample = () => {
    setPlant('KTECH');
    setLine('Line 06 - CNC Stamping');
    setStation('CNC-Mill-06');
    setShift('Ca 2 (14:00 - 22:00)');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('18:30');
    setWorkOrderId('WO-ANOM-2025-099');
    setPlanQty(500);
    setActualQty(780); // 156% of plan -> violates physical capacity ceiling!
    setScrapQty(85);
    setReworkQty(10);
    setDowntimeMinutes(120);
    setDowntimeReason('Dừng máy hỏng trục chính Spindle');
    setHeadcount(8);
    setInspectorName('Nguyễn Quốc Tuấn (Kỹ thuật viên)');
    setInspectorBadgeId('OP-KT-4412');
    setNotes('Báo cáo ca 2 máy dừng 2 tiếng nhưng sản lượng vượt 156% định mức kế hoạch!');
    onShowToast('Đã nạp mẫu BẤT THƯỜNG (Sản lượng 780/500 pcs - Vượt 156% công suất)');
  };

  // Reset form
  const handleResetForm = () => {
    setPlanQty(1000);
    setActualQty(0);
    setScrapQty(0);
    setReworkQty(0);
    setDowntimeMinutes(0);
    setNotes('');
    onShowToast('Đã làm mới biểu mẫu nhập');
  };

  // Submit Single Form
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    const batchId = `BATCH-MANUAL-${Date.now().toString().slice(-6)}`;
    const nowTimeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    if (hasFormErrors) {
      // Create quarantined record
      let ruleId = 'RULE-01';
      let ruleName = 'Physical Capacity Ceiling';
      let reasonText = `Sản lượng nhập ${actualQty} pcs vượt quá 115% công suất thiết kế định mức (${planQty} pcs).`;

      if (isParityViolated) {
        ruleId = 'RULE-02';
        ruleName = 'Mathematical Quality Parity';
        reasonText = `Tổng tỷ lệ Đạt (${yieldRate.toFixed(1)}%) và Phế phẩm (${defectRate.toFixed(1)}%) lệch 100% (Tổng = ${paritySum.toFixed(1)}%).`;
      } else if (isFutureDate) {
        ruleId = 'RULE-04';
        ruleName = 'Temporal Continuity Check';
        reasonText = `Thời gian lấy mẫu (${date} ${time}) ở tương lai so với thời gian hiện tại của hệ thống.`;
      }

      const quarantineItem: QuarantineRecord = {
        id: `QR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        batchId,
        sourceSystem: 'QA_Manual_Upload',
        sourceRecordId: `REC-${Date.now().toString().slice(-5)}`,
        kpiCode: 'OEE',
        reportingPeriod: shift,
        factory: `${plant} Plant`,
        line,
        equipment: station,
        vendor: plant,
        originalValue: `${actualQty.toLocaleString()} pcs (Kế hoạch: ${planQty.toLocaleString()})`,
        normalizedValue: `${actualQty.toLocaleString()} pcs`,
        expectedRange: `≤ ${(planQty * 1.15).toLocaleString()} pcs (Định mức max 115%)`,
        validationRuleId: ruleId,
        violationDescription: reasonText,
        severity: 'CRITICAL',
        detectionTimestamp: `${nowTimeStr} hôm nay`,
        evidenceRef: `MANUAL-FORM-REF-${Date.now().toString().slice(-4)}`,
        evidencePayload: {
          plant,
          line,
          station,
          shift,
          planQty,
          actualQty,
          scrapQty,
          downtimeMinutes,
          downtimeReason,
          inspectorName,
          inspectorBadgeId,
          notes,
        },
        assignedOwner: inspectorName,
        resolutionSlaHours: 12,
        slaDeadline: '12 giờ kể từ khi phát hiện',
        isSlaBreached: false,
        currentStatus: 'QUARANTINED',
        history: [
          {
            id: `LOG-${Date.now()}`,
            timestamp: nowTimeStr,
            actor: inspectorName,
            actorRole: 'PLANT_QA',
            action: 'QUARANTINED',
            notes: `Bản ghi nhập thủ công bị Validation Engine chặn và cách ly: ${reasonText}`,
          },
        ],
      };

      if (onAddQuarantineRecord) {
        onAddQuarantineRecord(quarantineItem);
      }

      // Add to batch history
      setBatchHistory((prev) => [
        {
          batchId,
          timestamp: `${date} ${time}`,
          method: 'FORM_DIRECT',
          plant: `${plant} Plant`,
          operator: `${inspectorName} (${inspectorBadgeId})`,
          totalRecords: 1,
          validRecords: 0,
          quarantinedRecords: 1,
          status: 'QUARANTINED',
          summary: `Bị cách ly: ${reasonText}`,
        },
        ...prev,
      ]);

      onShowToast(`⚠️ PHÁT HIỆN LỖI: Bản ghi đã bị chuyển vào Khu cách ly (${quarantineItem.id}) để bảo vệ kho KPI.`);
    } else {
      // Valid record committed
      setBatchHistory((prev) => [
        {
          batchId,
          timestamp: `${date} ${time}`,
          method: 'FORM_DIRECT',
          plant: `${plant} Plant`,
          operator: `${inspectorName} (${inspectorBadgeId})`,
          totalRecords: 1,
          validRecords: 1,
          quarantinedRecords: 0,
          status: 'COMMITTED',
          summary: `Thành công: ${actualQty} pcs | Yield: ${yieldRate.toFixed(1)}% | Đã nạp vào Kho KPI`,
        },
        ...prev,
      ]);

      onShowToast(`✅ THÀNH CÔNG: Lô ${batchId} đã vượt qua 28 quy tắc kiểm định và được nạp vào Kho KPI chính thức [MANUAL_ENTRY].`);
    }
  };

  // Download Sample CSV Template
  const handleDownloadTemplate = () => {
    const csvContent =
      'Plant,Line,Station,Shift,Date,WorkOrderId,PlanQty,ActualQty,ScrapQty,ReworkQty,DowntimeMinutes,DowntimeReason,Headcount,InspectorId,Notes\n' +
      'KHV,Line 02,SMT-02,Ca 1,2025-04-25,WO-101,1000,980,15,5,15,Thay Feeder,12,QA-8842,Dữ liệu ca 1 đạt chuẩn\n' +
      'HSTEC,Line 01,SMT-01,Ca 1,2025-04-25,WO-102,1200,1185,10,5,10,Bảo dưỡng nhỏ,14,QA-9912,Đạt tiêu chuẩn xuất xưởng\n' +
      'DREAM TECH,Line 03,AOI-03,Ca 1,2025-04-25,WO-103,800,790,8,2,20,Hiệu chuẩn quang học,8,QA-7721,Đạt chuẩn 98.7%\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_kpi_manual_ingestion.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Đã tải xuống file mẫu template_kpi_manual_ingestion.csv');
  };

  // Load Valid Batch Preview (Demo)
  const handleLoadValidBatchDemo = () => {
    setUploadedFileName('batch_production_shift1_valid.csv');
    setPreviewRows([
      {
        id: 'ROW-01',
        timestamp: '14:00',
        plant: 'KHV',
        line: 'Line 02 - SMT',
        station: 'SMT-02',
        shift: 'Ca 1',
        date: '2025-04-25',
        workOrderId: 'WO-2025-01',
        planQty: 1000,
        actualQty: 980,
        scrapQty: 15,
        reworkQty: 5,
        downtimeMinutes: 15,
        downtimeReason: 'Thay Feeder',
        headcount: 12,
        inspectorName: 'Đỗ Thanh Hùng',
        inspectorBadgeId: 'QA-8842',
        notes: 'Chất lượng ổn định',
        validationStatus: 'PASS',
        provenanceTag: 'FILE_IMPORT',
      },
      {
        id: 'ROW-02',
        timestamp: '14:05',
        plant: 'HSTEC',
        line: 'Line 01 - SMT',
        station: 'SMT-01',
        shift: 'Ca 1',
        date: '2025-04-25',
        workOrderId: 'WO-2025-02',
        planQty: 1200,
        actualQty: 1190,
        scrapQty: 8,
        reworkQty: 2,
        downtimeMinutes: 10,
        downtimeReason: 'Bảo dưỡng định kỳ',
        headcount: 14,
        inspectorName: 'Trần Văn Nam',
        inspectorBadgeId: 'QA-9912',
        notes: 'Yield cao 99.3%',
        validationStatus: 'PASS',
        provenanceTag: 'FILE_IMPORT',
      },
      {
        id: 'ROW-03',
        timestamp: '14:10',
        plant: 'DREAM TECH',
        line: 'Line 03 - AOI',
        station: 'AOI-03',
        shift: 'Ca 1',
        date: '2025-04-25',
        workOrderId: 'WO-2025-03',
        planQty: 850,
        actualQty: 835,
        scrapQty: 12,
        reworkQty: 3,
        downtimeMinutes: 25,
        downtimeReason: 'Cân chỉnh quang học',
        headcount: 10,
        inspectorName: 'Nguyễn Văn Minh',
        inspectorBadgeId: 'QA-7721',
        notes: 'Đạt chuẩn dung sai',
        validationStatus: 'PASS',
        provenanceTag: 'FILE_IMPORT',
      },
    ]);
    onShowToast('Đã nạp tệp mẫu hợp lệ (100% Pass) để xem trước');
  };

  // Load Anomaly Batch Preview (Demo)
  const handleLoadAnomalyBatchDemo = () => {
    setUploadedFileName('batch_production_mixed_with_anomalies.csv');
    setPreviewRows([
      {
        id: 'ROW-01',
        timestamp: '14:00',
        plant: 'KHV',
        line: 'Line 02 - SMT',
        station: 'SMT-02',
        shift: 'Ca 1',
        date: '2025-04-25',
        workOrderId: 'WO-2025-01',
        planQty: 1000,
        actualQty: 980,
        scrapQty: 15,
        reworkQty: 5,
        downtimeMinutes: 15,
        downtimeReason: 'Thay linh kiện',
        headcount: 12,
        inspectorName: 'Đỗ Thanh Hùng',
        inspectorBadgeId: 'QA-8842',
        notes: 'Hợp lệ',
        validationStatus: 'PASS',
        provenanceTag: 'FILE_IMPORT',
      },
      {
        id: 'ROW-02',
        timestamp: '14:15',
        plant: 'KTECH',
        line: 'Line 06 - CNC',
        station: 'CNC-06',
        shift: 'Ca 1',
        date: '2025-04-25',
        workOrderId: 'WO-2025-99',
        planQty: 500,
        actualQty: 850, // 170% -> Rule 01
        scrapQty: 40,
        reworkQty: 10,
        downtimeMinutes: 180,
        downtimeReason: 'Hỏng máy dừng 3h',
        headcount: 8,
        inspectorName: 'Lê Hoàng Nam',
        inspectorBadgeId: 'OP-4412',
        notes: 'Bất thường: dừng máy 3h nhưng sản lượng vượt 170%',
        validationStatus: 'BLOCKER',
        violationMessage: '[RULE-01] Vượt 115% công suất máy (170%) khi máy có trạng thái dừng',
        provenanceTag: 'FILE_IMPORT',
      },
      {
        id: 'ROW-03',
        timestamp: '14:20',
        plant: 'HOJEONG VINA',
        line: 'Line 04 - Assembly',
        station: 'ASSY-04',
        shift: 'Ca 1',
        date: '2025-04-25',
        workOrderId: 'WO-2025-88',
        planQty: 600,
        actualQty: 580,
        scrapQty: 90, // Defect rate mismatch
        reworkQty: 4,
        downtimeMinutes: 10,
        downtimeReason: 'Bình thường',
        headcount: 9,
        inspectorName: 'Vũ Đức Thịnh',
        inspectorBadgeId: 'QA-5511',
        notes: 'Tỷ lệ phế phẩm ghi nhận 15.5% nhưng tổng phế liệu không khớp biên bản',
        validationStatus: 'WARNING',
        violationMessage: '[RULE-02] Cross-Metric Parity: Tổng Đạt + Phế phẩm lệch định mức vật tư',
        provenanceTag: 'FILE_IMPORT',
      },
    ]);
    onShowToast('Đã nạp tệp có 2 bản ghi bất thường để kiểm tra cơ chế Cách ly tự động');
  };

  // Commit Batch Upload
  const handleExecuteBatchCommit = () => {
    if (previewRows.length === 0) return;
    setIsValidatingBatch(true);

    setTimeout(() => {
      setIsValidatingBatch(false);
      const batchId = `BATCH-CSV-${Date.now().toString().slice(-6)}`;
      const passCount = previewRows.filter((r) => r.validationStatus === 'PASS').length;
      const quarantineCount = previewRows.filter((r) => r.validationStatus !== 'PASS').length;

      // Add to batch history
      setBatchHistory((prev) => [
        {
          batchId,
          timestamp: new Date().toLocaleString('vi-VN'),
          method: 'CSV_UPLOAD',
          plant: 'Tập hợp nhiều nhà máy (CSV Batch)',
          operator: 'Hệ thống Ingestion Gateway (CSV Ingestion)',
          totalRecords: previewRows.length,
          validRecords: passCount,
          quarantinedRecords: quarantineCount,
          status: quarantineCount > 0 ? 'QUARANTINED' : 'COMMITTED',
          summary: `${passCount} bản ghi hợp lệ nạp vào KPI Store | ${quarantineCount} bản ghi vi phạm đã cách ly`,
        },
        ...prev,
      ]);

      // If quarantine items exist, trigger quarantine callback
      if (quarantineCount > 0 && onAddQuarantineRecord) {
        previewRows
          .filter((r) => r.validationStatus !== 'PASS')
          .forEach((row, idx) => {
            onAddQuarantineRecord({
              id: `QR-${new Date().getFullYear()}-${Math.floor(2000 + Math.random() * 7000)}`,
              batchId,
              sourceSystem: 'QA_Manual_Upload',
              sourceRecordId: `CSV-${idx + 1}`,
              kpiCode: 'OEE',
              reportingPeriod: row.shift,
              factory: `${row.plant} Plant`,
              line: row.line,
              equipment: row.station,
              vendor: row.plant,
              originalValue: `${row.actualQty.toLocaleString()} pcs`,
              normalizedValue: `${row.actualQty.toLocaleString()} pcs`,
              expectedRange: `≤ ${(row.planQty * 1.15).toLocaleString()} pcs`,
              validationRuleId: row.validationStatus === 'BLOCKER' ? 'RULE-01' : 'RULE-02',
              violationDescription: row.violationMessage || 'Phát hiện dữ liệu bất thường trong tệp tải lên.',
              severity: row.validationStatus === 'BLOCKER' ? 'BLOCKER' : 'WARNING',
              detectionTimestamp: 'Vừa xong',
              evidenceRef: `${uploadedFileName || 'upload.csv'}#row-${idx + 2}`,
              evidencePayload: row,
              assignedOwner: row.inspectorName,
              resolutionSlaHours: 8,
              slaDeadline: '8 giờ tới',
              isSlaBreached: false,
              currentStatus: 'QUARANTINED',
              history: [
                {
                  id: `LOG-${Date.now()}-${idx}`,
                  timestamp: 'Vừa xong',
                  actor: 'Batch Validation Engine',
                  actorRole: 'IT_ADMIN',
                  action: 'QUARANTINED',
                  notes: `Tự động cách ly dòng ${idx + 1} từ tệp ${uploadedFileName}: ${row.violationMessage}`,
                },
              ],
            });
          });
      }

      onShowToast(
        `Xử lý lô ${batchId} hoàn tất: ${passCount} bản ghi đã nạp vào KPI Store, ${quarantineCount} bản ghi vi phạm được cách ly an toàn!`
      );
      setPreviewRows([]);
      setUploadedFileName(null);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner Navigation & Context */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Nhập Liệu Thủ Công & Nạp Tệp KPI (Manual QA & File Ingestion)
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  SCHEMA V2.4 ACTIVE
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  28 RULES HOOKED
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Tiếp nhận dữ liệu báo cáo ca, kiểm tra QA định kỳ, kiểm kê kho và nạp tệp CSV/Excel qua cùng bộ quy tắc Kiểm định Doanh nghiệp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenDataQuality('quarantine')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Xem Khu Cách Ly (Quarantine Pool)</span>
            </button>
            <button
              onClick={onBackToControlTower}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Về Control Tower
            </button>
          </div>
        </div>

        {/* Data Truth / Integrity Callout Banner */}
        <div className="mt-3.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-600">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Nguyên tắc Trung thực Dữ liệu:</strong> Mọi bản ghi nhập tại đây sẽ được gắn nhãn nguồn gốc{' '}
              <code className="text-[11px] font-mono px-1 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">
                [MANUAL_ENTRY]
              </code>{' '}
              hoặc{' '}
              <code className="text-[11px] font-mono px-1 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">
                [FILE_IMPORT]
              </code>
              . Không ghi đè hoặc mạo danh số liệu tự động từ cảm biến GMES.
            </span>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 shrink-0 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300">
            Preflight Engine: Sẵn sàng
          </span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('form')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'form'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>1. Nhập Biểu Mẫu Trực Tiếp (Form Entry)</span>
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'upload'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>2. Tải Lên Tệp Hàng Loạt (CSV / Excel Batch)</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>3. Nhật Ký Nạp & Kiểm Toán ({batchHistory.length} lô)</span>
        </button>
      </div>

      {/* TAB 1: FORM ENTRY */}
      {activeTab === 'form' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800">
                  Biểu Mẫu Báo Cáo Sản Lượng & Chất Lượng Ca
                </h2>
                <p className="text-xs text-slate-500">
                  Dành cho Trưởng ca, Kỹ thuật viên QA và Thanh tra kiểm soát chất lượng tại nhà máy
                </p>
              </div>

              {/* Quick Load Test Samples */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleLoadValidSample}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Điền dữ liệu chuẩn để kiểm tra kết quả PASS"
                >
                  <Check className="w-3 h-3" />
                  <span>Mẫu Hợp Lệ (Pass)</span>
                </button>
                <button
                  type="button"
                  onClick={handleLoadAnomalySample}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Điền dữ liệu có lỗi để kiểm tra cơ chế Cách ly"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>Mẫu Lỗi (Test Cách Ly)</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Section 1: Administrative Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nhà máy (Plant) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={plant}
                    onChange={(e) => setPlant(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="KHV">KHV (Bắc Ninh)</option>
                    <option value="DREAM TECH">DREAM TECH (Hải Dương)</option>
                    <option value="HSTEC">HSTEC (Thái Nguyên)</option>
                    <option value="KTECH">KTECH (Đà Nẵng)</option>
                    <option value="HOJEONG VINA">HOJEONG VINA (Bình Dương)</option>
                    <option value="HOJEONGB">HOJEONGB (Đồng Nai)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dây chuyền (Line) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={line}
                    onChange={(e) => setLine(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="Line 01 - SMT Fast">Line 01 - SMT Fast Line</option>
                    <option value="Line 02 - SMT High Speed">Line 02 - SMT High Speed</option>
                    <option value="Line 03 - Wave Soldering">Line 03 - Wave Soldering</option>
                    <option value="Line 04 - Assembly">Line 04 - Final Assembly</option>
                    <option value="Line 06 - CNC Stamping">Line 06 - CNC Stamping & Press</option>
                    <option value="Line 08 - Packaging">Line 08 - Auto Packaging</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Trạm / Thiết bị (Station ID) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={station}
                    onChange={(e) => setStation(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="VD: SMT-Mounter-02"
                    required
                  />
                </div>
              </div>

              {/* Section 2: Shift, Date, Time, Work Order */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ca sản xuất <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="Ca 1 (06:00 - 14:00)">Ca 1 (06:00 - 14:00)</option>
                    <option value="Ca 2 (14:00 - 22:00)">Ca 2 (14:00 - 22:00)</option>
                    <option value="Ca 3 (22:00 - 06:00)">Ca 3 (22:00 - 06:00)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ngày lấy mẫu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Giờ lấy mẫu <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-300 p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const now = new Date();
                        setTime(now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }));
                      }}
                      className="px-2 py-1 text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 cursor-pointer"
                      title="Lấy giờ hiện tại"
                    >
                      Now
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mã lệnh SX (Work Order / Lot) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={workOrderId}
                    onChange={(e) => setWorkOrderId(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="WO-2025-..."
                    required
                  />
                </div>
              </div>

              {/* Section 3: Physical Metric Inputs */}
              <div className="pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span>Số liệu Đo lường Thực tế (Physical Ingestion Parameters)</span>
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kế hoạch (Target pcs) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={planQty}
                      onChange={(e) => setPlanQty(Number(e.target.value))}
                      className="w-full text-xs rounded-lg border border-slate-300 p-2 text-slate-800 font-mono focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Thực tế Đạt (Good pcs) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={actualQty}
                      onChange={(e) => setActualQty(Number(e.target.value))}
                      className={`w-full text-xs rounded-lg border p-2 font-mono font-bold focus:ring-2 ${
                        isCapacityExceeded
                          ? 'border-rose-400 bg-rose-50 text-rose-800 focus:ring-rose-500'
                          : 'border-slate-300 text-slate-900 focus:ring-blue-500'
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phế phẩm (Scrap pcs)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={scrapQty}
                      onChange={(e) => setScrapQty(Number(e.target.value))}
                      className="w-full text-xs rounded-lg border border-slate-300 p-2 font-mono text-slate-800 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Sửa lại (Rework pcs)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={reworkQty}
                      onChange={(e) => setReworkQty(Number(e.target.value))}
                      className="w-full text-xs rounded-lg border border-slate-300 p-2 font-mono text-slate-800 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Dừng máy (Phút)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="720"
                      value={downtimeMinutes}
                      onChange={(e) => setDowntimeMinutes(Number(e.target.value))}
                      className={`w-full text-xs rounded-lg border p-2 font-mono ${
                        isDowntimeExcessive
                          ? 'border-rose-400 bg-rose-50 text-rose-800'
                          : 'border-slate-300 text-slate-800'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nguyên nhân dừng máy
                    </label>
                    <select
                      value={downtimeReason}
                      onChange={(e) => setDowntimeReason(e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Không có dừng máy">Không có dừng máy (Bình thường)</option>
                      <option value="Thay cuộn linh kiện Feeder">Thay cuộn linh kiện Feeder</option>
                      <option value="Cân chỉnh khuôn & Dao cắt">Cân chỉnh khuôn & Dao cắt</option>
                      <option value="Sự cố điện / Khí nén">Sự cố điện / Khí nén</option>
                      <option value="Chờ cấp nguyên vật liệu">Chờ cấp nguyên vật liệu từ kho</option>
                      <option value="Bảo trì định kỳ">Bảo trì thiết bị định kỳ</option>
                      <option value="Hỏng hóc máy đột xuất">Hỏng hóc máy đột xuất (Breakdown)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nhân sự hiện diện (Headcount)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="150"
                      value={headcount}
                      onChange={(e) => setHeadcount(Number(e.target.value))}
                      className="w-full text-xs rounded-lg border border-slate-300 p-2 font-mono text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: QA Inspector Signoff & Notes */}
              <div className="pt-2 border-t border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Người lập báo cáo & Kiểm định <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inspectorName}
                        onChange={(e) => setInspectorName(e.target.value)}
                        className="w-2/3 text-xs rounded-lg border border-slate-300 p-2 text-slate-800"
                        placeholder="Họ tên người kiểm tra"
                        required
                      />
                      <input
                        type="text"
                        value={inspectorBadgeId}
                        onChange={(e) => setInspectorBadgeId(e.target.value)}
                        className="w-1/3 text-xs rounded-lg border border-slate-300 p-2 text-slate-800 font-mono text-center"
                        placeholder="Mã thẻ (Badge ID)"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Biên bản / Ghi chú hiện trường
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-300 p-2 text-slate-800"
                      placeholder="Ghi chú điều kiện máy, vật tư, nhiệt độ môi trường..."
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Làm mới biểu mẫu
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className={`px-5 py-2 text-xs font-bold rounded-lg text-white transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
                      hasFormErrors
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {hasFormErrors ? (
                      <>
                        <ShieldAlert className="w-4 h-4" />
                        <span>Nạp & Đưa Vào Khu Cách Ly (Quarantine)</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Kiểm Định & Đẩy Vào Staging (Commit KPI)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Live Preflight Validation Card */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Live Preflight Engine
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    hasFormErrors
                      ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  {hasFormErrors ? 'VI PHẠM QUY TẮC' : 'THÔNG QUA (PASS)'}
                </span>
              </div>

              {/* Derived Metric Pills */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 font-medium block">Tỷ lệ Đạt (Yield):</span>
                  <span className="text-base font-extrabold text-slate-800 font-mono">
                    {yieldRate.toFixed(1)}%
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 font-medium block">Tỷ lệ Lỗi (Defect):</span>
                  <span className={`text-base font-extrabold font-mono ${defectRate > 5 ? 'text-amber-600' : 'text-slate-800'}`}>
                    {defectRate.toFixed(1)}%
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 font-medium block">Công suất Kế hoạch:</span>
                  <span className={`text-base font-extrabold font-mono ${isCapacityExceeded ? 'text-rose-600' : 'text-slate-800'}`}>
                    {planAttainment.toFixed(1)}%
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 font-medium block">Tổng Yield + Defect:</span>
                  <span className={`text-base font-extrabold font-mono ${isParityViolated ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {paritySum.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Live Rule Traces */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-[11px] font-bold text-slate-600">Trạng thái Kiểm định Thời gian thực:</h4>

                <div className={`p-2.5 rounded-lg text-xs border flex items-start gap-2 ${
                  isCapacityExceeded
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-emerald-50/60 border-emerald-200/80 text-emerald-800'
                }`}>
                  {isCapacityExceeded ? (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block">[RULE-01] Physical Capacity Ceiling:</span>
                    <span className="text-[11px]">
                      {isCapacityExceeded
                        ? `Sản lượng đạt ${actualQty} pcs (>115% kế hoạch ${planQty} pcs). Bản ghi sẽ bị cách ly để chống thổi phồng OEE.`
                        : `Sản lượng nằm trong giới hạn công suất cho phép (≤ ${(planQty * 1.15).toFixed(0)} pcs).`}
                    </span>
                  </div>
                </div>

                <div className={`p-2.5 rounded-lg text-xs border flex items-start gap-2 ${
                  isParityViolated
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-emerald-50/60 border-emerald-200/80 text-emerald-800'
                }`}>
                  {isParityViolated ? (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block">[RULE-02] Mathematical Parity:</span>
                    <span className="text-[11px]">
                      {isParityViolated
                        ? `Lệch tổng logic: Yield (${yieldRate.toFixed(1)}%) + Defect (${defectRate.toFixed(1)}%) ≠ 100%. Cần kiểm tra lại số liệu phế phẩm.`
                        : `Cân đối toán học chính xác: Tổng tỷ lệ = 100% (±0.5%).`}
                    </span>
                  </div>
                </div>

                <div className={`p-2.5 rounded-lg text-xs border flex items-start gap-2 ${
                  isFutureDate
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-emerald-50/60 border-emerald-200/80 text-emerald-800'
                }`}>
                  {isFutureDate ? (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block">[RULE-04] Temporal Horizon Guard:</span>
                    <span className="text-[11px]">
                      {isFutureDate
                        ? 'Thời gian lấy mẫu vượt quá thời gian thực hiện tại của hệ thống. Không cho phép ghi số liệu tương lai.'
                        : 'Dấu thời gian hợp lệ, nằm trong cửa sổ thời gian cho phép.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Policy Reminder */}
            <div className="bg-blue-50/70 rounded-xl border border-blue-200/80 p-3.5 text-xs text-blue-900">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <FileCheck2 className="w-4 h-4 text-blue-700" />
                <span>Quy định Ký duyệt Báo cáo Thủ công:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px] pl-1">
                <li>Bắt buộc cung cấp Mã thẻ thanh tra QA khi nhập liệu.</li>
                <li>Mọi số liệu bị cách ly cần có giải trình từ Quản đốc Phân xưởng trong vòng 12h.</li>
                <li>Dữ liệu nạp thành công sẽ được đối soát tự động vào ca kế tiếp.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BATCH CSV / EXCEL UPLOAD */}
      {activeTab === 'upload' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800">
                  Nạp Dữ Liệu Lô từ Tệp CSV / Excel
                </h2>
                <p className="text-xs text-slate-500">
                  Hỗ trợ tải lên file danh sách sản lượng, phế phẩm và kiểm định ca từ các nhà máy vệ tinh
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadTemplate}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải File Mẫu (.CSV)</span>
                </button>
              </div>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleLoadValidBatchDemo();
              }}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/50'
                  : 'border-slate-300 hover:border-blue-400 bg-slate-50/50'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">
                Kéo và thả tệp dữ liệu vào đây hoặc nhấn để chọn tệp
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Hỗ trợ định dạng: .CSV, .XLSX, .XLS (Dung lượng tối đa: 15MB)
              </p>

              {/* Quick Test Demo Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-slate-200/80 max-w-md mx-auto">
                <span className="text-[11px] text-slate-500 w-full mb-1">
                  Chưa có sẵn tệp? Nạp nhanh dữ liệu thử nghiệm:
                </span>
                <button
                  type="button"
                  onClick={handleLoadValidBatchDemo}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Nạp Tệp Mẫu Chuẩn (100% Pass)</span>
                </button>

                <button
                  type="button"
                  onClick={handleLoadAnomalyBatchDemo}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Nạp Tệp Có Bất Thường (Test Cách Ly)</span>
                </button>
              </div>
            </div>

            {/* Preview Section if rows exist */}
            {previewRows.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800">
                      Xem trước dữ liệu tệp: <span className="font-mono text-blue-700">{uploadedFileName}</span> ({previewRows.length} bản ghi)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Hợp lệ: {previewRows.filter((r) => r.validationStatus === 'PASS').length}
                    </span>
                    <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Cần cách ly: {previewRows.filter((r) => r.validationStatus !== 'PASS').length}
                    </span>
                  </div>
                </div>

                {/* Data Grid Preview */}
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                      <tr>
                        <th className="p-2.5">ID</th>
                        <th className="p-2.5">Nhà máy / Dây chuyền</th>
                        <th className="p-2.5">Ca & Lệnh SX</th>
                        <th className="p-2.5 text-right">Kế hoạch</th>
                        <th className="p-2.5 text-right">Thực tế</th>
                        <th className="p-2.5 text-right">Phế phẩm</th>
                        <th className="p-2.5 text-center">Dừng máy</th>
                        <th className="p-2.5">Tiền Kiểm Định (Preflight)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {previewRows.map((row) => (
                        <tr
                          key={row.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            row.validationStatus === 'BLOCKER'
                              ? 'bg-rose-50/30'
                              : row.validationStatus === 'WARNING'
                              ? 'bg-amber-50/30'
                              : ''
                          }`}
                        >
                          <td className="p-2.5 font-mono text-[11px] font-semibold text-slate-500">
                            {row.id}
                          </td>
                          <td className="p-2.5">
                            <span className="font-bold text-slate-800">{row.plant}</span>
                            <span className="block text-[11px] text-slate-500">{row.line}</span>
                          </td>
                          <td className="p-2.5">
                            <span className="font-semibold text-slate-700">{row.shift}</span>
                            <span className="block text-[11px] font-mono text-slate-500">{row.workOrderId}</span>
                          </td>
                          <td className="p-2.5 text-right font-mono font-medium">
                            {row.planQty.toLocaleString()}
                          </td>
                          <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                            {row.actualQty.toLocaleString()}
                          </td>
                          <td className="p-2.5 text-right font-mono text-rose-600 font-semibold">
                            {row.scrapQty.toLocaleString()}
                          </td>
                          <td className="p-2.5 text-center font-mono">
                            {row.downtimeMinutes > 0 ? `${row.downtimeMinutes}p` : '-'}
                          </td>
                          <td className="p-2.5">
                            {row.validationStatus === 'PASS' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>PASS</span>
                              </span>
                            ) : (
                              <div className="space-y-0.5">
                                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                                  row.validationStatus === 'BLOCKER'
                                    ? 'text-rose-700 bg-rose-50 border-rose-200'
                                    : 'text-amber-700 bg-amber-50 border-amber-200'
                                }`}>
                                  <AlertTriangle className="w-3 h-3" />
                                  <span>{row.validationStatus} (Sẽ Cách Ly)</span>
                                </span>
                                {row.violationMessage && (
                                  <span className="block text-[10.5px] text-slate-600 leading-tight">
                                    {row.violationMessage}
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Batch Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      setPreviewRows([]);
                      setUploadedFileName(null);
                    }}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Hủy xem trước
                  </button>

                  <button
                    onClick={handleExecuteBatchCommit}
                    disabled={isValidatingBatch}
                    className="px-5 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isValidatingBatch ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" />
                        <span>Đang Chạy Kiểm Định Validation Engine...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Xác Nhận Nạp Lô Vào Hệ Thống (Execute Batch)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: INGESTION AUDIT TRAIL */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Nhật Ký & Kiểm Toán Các Lô Nạp Thủ Công (Manual Ingestion Audit Trail)
              </h2>
              <p className="text-xs text-slate-500">
                Theo dõi đầy đủ vết kiểm toán, mã lô nạp, người thực hiện và trạng thái phê chuẩn
              </p>
            </div>
            <span className="text-xs text-slate-500">
              Tổng số lô ghi nhận: <strong>{batchHistory.length}</strong>
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                <tr>
                  <th className="p-3">Mã Lô (Batch ID)</th>
                  <th className="p-3">Phương thức</th>
                  <th className="p-3">Nhà máy / Đơn vị</th>
                  <th className="p-3">Người thực hiện</th>
                  <th className="p-3 text-center">Tổng / Hợp lệ / Cách ly</th>
                  <th className="p-3">Thời gian nạp</th>
                  <th className="p-3">Trạng thái Kiểm định</th>
                  <th className="p-3">Tóm tắt kết quả</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batchHistory.map((batch) => (
                  <tr key={batch.batchId} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-blue-700">
                      {batch.batchId}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-tight uppercase ${
                        batch.method === 'FORM_DIRECT'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {batch.method === 'FORM_DIRECT' ? 'Form Nhập' : 'Tệp CSV'}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">
                      {batch.plant}
                    </td>
                    <td className="p-3 text-slate-600">
                      {batch.operator}
                    </td>
                    <td className="p-3 text-center font-mono">
                      <span className="text-slate-800 font-bold">{batch.totalRecords}</span>
                      <span className="text-slate-400"> / </span>
                      <span className="text-emerald-600 font-bold">{batch.validRecords}</span>
                      <span className="text-slate-400"> / </span>
                      <span className={`font-bold ${batch.quarantinedRecords > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                        {batch.quarantinedRecords}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">
                      {batch.timestamp}
                    </td>
                    <td className="p-3">
                      {batch.status === 'COMMITTED' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>COMMITTED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>QUARANTINED</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-600 text-[11px]">
                      {batch.summary}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
