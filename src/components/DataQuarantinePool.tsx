import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCw,
  Eye,
  FileText,
  UserCheck,
  Send,
  Download,
  AlertTriangle,
  ChevronDown,
  X,
  History,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
  HelpCircle,
  FileSpreadsheet,
} from 'lucide-react';
import {
  QuarantineRecord,
  QuarantineStatus,
  RuleSeverity,
  UserRole,
} from '../types';

interface DataQuarantinePoolProps {
  records: QuarantineRecord[];
  onUpdateRecord: (updated: QuarantineRecord) => void;
  onBatchRevalidate: (ids: string[]) => void;
  onShowToast: (msg: string) => void;
  currentUserRole: UserRole;
  currentUserName: string;
}

export const DataQuarantinePool: React.FC<DataQuarantinePoolProps> = ({
  records,
  onUpdateRecord,
  onBatchRevalidate,
  onShowToast,
  currentUserRole,
  currentUserName,
}) => {
  const [selectedRecord, setSelectedRecord] = useState<QuarantineRecord | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'details' | 'evidence' | 'audit' | 'action'>('details');

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [vendorFilter, setVendorFilter] = useState<string>('ALL');

  // Row selections for batch operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Action form state inside modal
  const [actionType, setActionType] = useState<
    'ASSIGN' | 'RESUBMIT' | 'REVALIDATE' | 'APPROVE_OVERRIDE' | 'REJECT' | null
  >(null);
  const [assigneeInput, setAssigneeInput] = useState('');
  const [actionReasonInput, setActionReasonInput] = useState('');
  const [overrideScopeInput, setOverrideScopeInput] = useState('Đơn hàng hiện tại (Shift ca này)');
  const [overrideExpiryDays, setOverrideExpiryDays] = useState('7');

  // Filter logic
  const filteredRecords = records.filter((r) => {
    if (statusFilter !== 'ALL' && r.currentStatus !== statusFilter) return false;
    if (severityFilter !== 'ALL' && r.severity !== severityFilter) return false;
    if (sourceFilter !== 'ALL' && r.sourceSystem !== sourceFilter) return false;
    if (vendorFilter !== 'ALL' && r.vendor.toLowerCase() !== vendorFilter.toLowerCase()) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      r.id.toLowerCase().includes(q) ||
      r.batchId.toLowerCase().includes(q) ||
      r.vendor.toLowerCase().includes(q) ||
      r.line.toLowerCase().includes(q) ||
      r.kpiCode.toLowerCase().includes(q) ||
      r.violationDescription.toLowerCase().includes(q) ||
      r.validationRuleId.toLowerCase().includes(q) ||
      r.assignedOwner.toLowerCase().includes(q)
    );
  });

  const isAllSelected =
    filteredRecords.length > 0 && selectedIds.length === filteredRecords.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRecords.map((r) => r.id));
    }
  };

  const handleToggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: QuarantineStatus) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'QUARANTINED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'UNDER_REVIEW':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'WAITING_FOR_SOURCE':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'RESUBMISSION_REQUIRED':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'REVALIDATION_PENDING':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200 animate-pulse';
      case 'RESOLVED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'REJECTED':
        return 'bg-slate-100 text-slate-500 line-through border-slate-200';
      case 'APPROVED_EXCEPTION':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getSeverityBadge = (severity: RuleSeverity) => {
    switch (severity) {
      case 'BLOCKER':
        return 'bg-rose-600 text-white font-black';
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border border-rose-300 font-bold';
      case 'WARNING':
        return 'bg-amber-100 text-amber-900 border border-amber-300 font-bold';
      case 'INFO':
      default:
        return 'bg-blue-100 text-blue-800 border border-blue-300';
    }
  };

  // Actions handling
  const handleAssignOwnerSubmit = (record: QuarantineRecord) => {
    if (!assigneeInput.trim()) {
      onShowToast('Vui lòng nhập tên người được giao việc.');
      return;
    }
    const updated: QuarantineRecord = {
      ...record,
      assignedOwner: assigneeInput.trim(),
      currentStatus: 'UNDER_REVIEW',
      history: [
        {
          id: `HIST-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          action: 'ASSIGN_OWNER',
          actor: currentUserName,
          actorRole: currentUserRole,
          fromStatus: record.currentStatus,
          toStatus: 'UNDER_REVIEW',
          notes: `Giao xử lý cho: ${assigneeInput.trim()}. ${actionReasonInput}`,
        },
        ...record.history,
      ],
    };
    onUpdateRecord(updated);
    setSelectedRecord(updated);
    setActionType(null);
    onShowToast(`Đã giao bản ghi #${record.id} cho ${assigneeInput.trim()} xử lý.`);
  };

  const handleRequestResubmissionSubmit = (record: QuarantineRecord) => {
    const updated: QuarantineRecord = {
      ...record,
      currentStatus: 'RESUBMISSION_REQUIRED',
      resolutionNote: actionReasonInput || 'Yêu cầu trích xuất lại log gốc từ thiết bị và nộp lại biên bản số hóa.',
      history: [
        {
          id: `HIST-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          action: 'REQUEST_RESUBMISSION',
          actor: currentUserName,
          actorRole: currentUserRole,
          fromStatus: record.currentStatus,
          toStatus: 'RESUBMISSION_REQUIRED',
          notes: actionReasonInput || 'Yêu cầu nhà máy gửi lại dữ liệu đã điều chỉnh.',
        },
        ...record.history,
      ],
    };
    onUpdateRecord(updated);
    setSelectedRecord(updated);
    setActionType(null);
    onShowToast(`Đã gửi yêu cầu nộp lại cho đối tác ${record.vendor}.`);
  };

  const handleRevalidateRecord = (record: QuarantineRecord) => {
    onShowToast(`Đang chạy kiểm định lại bản ghi #${record.id} qua Validation Engine...`);
    setTimeout(() => {
      // Simulate successful revalidation
      const updated: QuarantineRecord = {
        ...record,
        currentStatus: 'RESOLVED',
        resolutionNote: 'Đã kiểm định lại thành công sau khi cập nhật dữ liệu. Bản ghi đã được ghi nhận vào KPI Store.',
        history: [
          {
            id: `HIST-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            action: 'REVALIDATE_AND_PASS',
            actor: currentUserName,
            actorRole: currentUserRole,
            fromStatus: record.currentStatus,
            toStatus: 'RESOLVED',
            notes: 'Validation Engine xác nhận dữ liệu đã thỏa mãn đầy đủ các quy tắc logic nghiệp vụ.',
          },
          ...record.history,
        ],
      };
      onUpdateRecord(updated);
      setSelectedRecord(updated);
      onShowToast(`Bản ghi #${record.id} đã vượt qua kiểm định lại và được giải phóng!`);
    }, 900);
  };

  const handleApproveOverrideSubmit = (record: QuarantineRecord) => {
    // Segregation of duties check:
    if (currentUserRole === 'PLANT_QA') {
      onShowToast('Quyền bị chặn: Kỹ sư Plant QA không thể tự phê duyệt ngoại lệ (yêu cầu Data Steward hoặc Executive).');
      return;
    }

    if (!actionReasonInput.trim()) {
      onShowToast('Bắt buộc nhập lý do và căn cứ pháp lý phê duyệt ngoại lệ.');
      return;
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(overrideExpiryDays || '7', 10));

    const updated: QuarantineRecord = {
      ...record,
      currentStatus: 'APPROVED_EXCEPTION',
      approvalRecord: {
        approverName: currentUserName,
        approverRole: currentUserRole,
        approvalTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        justification: actionReasonInput.trim(),
        validUntil: expiryDate.toISOString().replace('T', ' ').substring(0, 19),
        scope: overrideScopeInput,
        approvedExceptionRef: `EXC-${record.id}-${Date.now().toString().slice(-4)}`,
      },
      history: [
        {
          id: `HIST-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          action: 'APPROVE_EXCEPTION_OVERRIDE',
          actor: currentUserName,
          actorRole: currentUserRole,
          fromStatus: record.currentStatus,
          toStatus: 'APPROVED_EXCEPTION',
          notes: `Phê duyệt ngoại lệ: ${actionReasonInput.trim()} (Hiệu lực: ${overrideScopeInput})`,
        },
        ...record.history,
      ],
    };
    onUpdateRecord(updated);
    setSelectedRecord(updated);
    setActionType(null);
    onShowToast(`Đã phê duyệt ngoại lệ có kiểm soát cho bản ghi #${record.id}.`);
  };

  const handleRejectRecord = (record: QuarantineRecord) => {
    const updated: QuarantineRecord = {
      ...record,
      currentStatus: 'REJECTED',
      resolutionNote: actionReasonInput || 'Bác bỏ vĩnh viễn. Không cho phép dữ liệu này đi vào KPI Store.',
      history: [
        {
          id: `HIST-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          action: 'PERMANENT_REJECT',
          actor: currentUserName,
          actorRole: currentUserRole,
          fromStatus: record.currentStatus,
          toStatus: 'REJECTED',
          notes: actionReasonInput || 'Dữ liệu sai lệch không có cơ sở chứng minh. Đã bác bỏ.',
        },
        ...record.history,
      ],
    };
    onUpdateRecord(updated);
    setSelectedRecord(updated);
    setActionType(null);
    onShowToast(`Bản ghi #${record.id} đã bị bác bỏ vĩnh viễn khỏi hệ thống KPI.`);
  };

  const handleExportCSV = () => {
    const headers = [
      'Record ID',
      'Batch ID',
      'Source System',
      'Source Record ID',
      'Vendor',
      'Factory',
      'Line',
      'KPI Code',
      'Severity',
      'Status',
      'Detection Timestamp',
      'Rule ID',
      'Violation Description',
      'Original Value',
      'Expected Range',
      'Assigned Owner',
      'SLA Deadline',
    ];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.batchId,
      r.sourceSystem,
      r.sourceRecordId,
      r.vendor,
      r.factory,
      r.line,
      r.kpiCode,
      r.severity,
      r.currentStatus,
      r.detectionTimestamp,
      r.validationRuleId,
      `"${r.violationDescription.replace(/"/g, '""')}"`,
      `"${r.originalValue.replace(/"/g, '""')}"`,
      `"${r.expectedRange.replace(/"/g, '""')}"`,
      r.assignedOwner,
      r.slaDeadline,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `data_quarantine_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast(`Đã xuất báo cáo kiểm toán cách ly (${filteredRecords.length} bản ghi).`);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3.5 select-none">
      {/* Top Header & Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <h2 className="text-xs font-bold text-slate-900 tracking-tight">
              Kho Lưu trữ & Xử lý Ngoại lệ Dữ liệu (Data Quarantine Pool)
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              {filteredRecords.length} Bản ghi trong bộ lọc
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Mọi bản ghi vi phạm quy tắc bắt buộc được giữ lại có ID ổn định, nhật ký trạng thái kiểm toán bất biến và phân định thẩm quyền xử lý rõ ràng.
          </p>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {selectedIds.length > 0 && (
            <button
              onClick={() => {
                onBatchRevalidate(selectedIds);
                setSelectedIds([]);
              }}
              className="px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Kiểm định lại hàng loạt ({selectedIds.length})</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
            title="Tải toàn bộ danh sách ngoại lệ dạng CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất CSV Kiểm toán</span>
          </button>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 pt-0.5">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo ID, vendor, lỗi, quy tắc..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Severity */}
        <div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-semibold focus:outline-none"
          >
            <option value="ALL">Tất cả Mức độ</option>
            <option value="BLOCKER">BLOCKER (Trần vật lý)</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="WARNING">WARNING</option>
            <option value="INFO">INFO</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-semibold focus:outline-none"
          >
            <option value="ALL">Tất cả Trạng thái</option>
            <option value="QUARANTINED">QUARANTINED</option>
            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
            <option value="RESUBMISSION_REQUIRED">RESUBMISSION_REQUIRED</option>
            <option value="REVALIDATION_PENDING">REVALIDATION_PENDING</option>
            <option value="APPROVED_EXCEPTION">APPROVED_EXCEPTION</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>

        {/* Source System */}
        <div>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-semibold focus:outline-none"
          >
            <option value="ALL">Tất cả Nguồn</option>
            <option value="GMES">GMES</option>
            <option value="IoT_Gateway">IoT Gateway</option>
            <option value="SAP_ERP">SAP ERP</option>
            <option value="QA_Manual_Upload">QA Manual Upload</option>
            <option value="RPA_Crawler">RPA Crawler</option>
            <option value="Supplier_API">Supplier API</option>
          </select>
        </div>

        {/* Vendor */}
        <div>
          <select
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-semibold focus:outline-none"
          >
            <option value="ALL">Tất cả Nhà cung cấp</option>
            <option value="KHV">KHV</option>
            <option value="DREAM TECH">DREAM TECH</option>
            <option value="HSTEC">HSTEC</option>
            <option value="KTECH">KTECH</option>
            <option value="HOJEONGB">HOJEONGB</option>
            <option value="HOJEONG VINA">HOJEONG VINA</option>
          </select>
        </div>
      </div>

      {/* Main Table View */}
      <div className="overflow-x-auto border border-slate-200/80 rounded-lg">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
              <th className="py-2.5 px-3 w-8 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleToggleSelectAll}
                  className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                />
              </th>
              <th className="py-2.5 px-2">Record ID & Batch</th>
              <th className="py-2.5 px-2">Nguồn & Vị trí</th>
              <th className="py-2.5 px-2">Chỉ số & Nội dung Vi phạm</th>
              <th className="py-2.5 px-2">Giá trị gửi vs Ngưỡng logic</th>
              <th className="py-2.5 px-2 text-center">Mức độ</th>
              <th className="py-2.5 px-2">Người phụ trách</th>
              <th className="py-2.5 px-2 text-center">Trạng thái</th>
              <th className="py-2.5 px-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  Không tìm thấy bản ghi ngoại lệ phù hợp với điều kiện tìm kiếm.
                </td>
              </tr>
            ) : (
              filteredRecords.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    onClick={() => {
                      setSelectedRecord(item);
                      setActiveModalTab('details');
                      setActionType(null);
                    }}
                    className={`hover:bg-blue-50/40 transition-colors cursor-pointer group ${
                      isSelected ? 'bg-blue-50/70' : ''
                    }`}
                  >
                    <td
                      className="py-2.5 px-3 text-center"
                      onClick={(e) => handleToggleSelectRow(item.id, e)}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                      />
                    </td>

                    <td className="py-2.5 px-2">
                      <span className="font-bold text-slate-900 block font-mono text-[11px]">
                        {item.id}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {item.batchId}
                      </span>
                    </td>

                    <td className="py-2.5 px-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-blue-700">{item.vendor}</span>
                        <span className="text-[9px] px-1 bg-slate-100 text-slate-600 rounded font-semibold">
                          {item.sourceSystem}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block truncate max-w-[140px]">
                        {item.factory} • {item.line}
                      </span>
                    </td>

                    <td className="py-2.5 px-2 max-w-[220px]">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[9px] font-mono font-bold bg-slate-200 text-slate-700 px-1 rounded">
                          {item.validationRuleId}
                        </span>
                        <span className="text-[10px] font-bold text-slate-800">
                          {item.kpiCode}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-tight">
                        {item.violationDescription}
                      </p>
                    </td>

                    <td className="py-2.5 px-2 text-[11px] max-w-[200px]">
                      <div className="font-semibold text-rose-600 line-through decoration-rose-300 truncate">
                        {item.originalValue}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        Chuẩn: {item.expectedRange}
                      </div>
                    </td>

                    <td className="py-2.5 px-2 text-center whitespace-nowrap">
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full ${getSeverityBadge(
                          item.severity
                        )}`}
                      >
                        {item.severity}
                      </span>
                    </td>

                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <span className="font-medium text-slate-800 block text-xs truncate max-w-[110px]">
                        {item.assignedOwner}
                      </span>
                      <span
                        className={`text-[9px] font-semibold block ${
                          item.isSlaBreached ? 'text-rose-600 font-bold' : 'text-slate-400'
                        }`}
                      >
                        {item.isSlaBreached ? 'Quá hạn SLA' : `SLA: ${item.resolutionSlaHours}h`}
                      </span>
                    </td>

                    <td className="py-2.5 px-2 text-center whitespace-nowrap">
                      <span
                        className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(
                          item.currentStatus
                        )}`}
                      >
                        {item.currentStatus}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecord(item);
                          setActiveModalTab('details');
                        }}
                        className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors"
                        title="Xem toàn bộ hồ sơ ngoại lệ"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Comprehensive Exception Handling Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            {/* Header */}
            <div className="px-5 py-3.5 bg-[#0b1426] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm tracking-tight">
                      Hồ sơ Ngoại lệ: #{selectedRecord.id}
                    </h3>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${getSeverityBadge(
                        selectedRecord.severity
                      )}`}
                    >
                      {selectedRecord.severity}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded border ${getStatusBadge(
                        selectedRecord.currentStatus
                      )}`}
                    >
                      {selectedRecord.currentStatus}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Batch: {selectedRecord.batchId} • Source ID: {selectedRecord.sourceRecordId}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center px-5 border-b border-slate-200 bg-slate-50 shrink-0">
              <button
                onClick={() => setActiveModalTab('details')}
                className={`py-2 px-3 text-xs font-bold border-b-2 transition-colors ${
                  activeModalTab === 'details'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                1. Thông tin Chi tiết
              </button>
              <button
                onClick={() => setActiveModalTab('evidence')}
                className={`py-2 px-3 text-xs font-bold border-b-2 transition-colors ${
                  activeModalTab === 'evidence'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                2. Bằng chứng & Log Kỹ thuật
              </button>
              <button
                onClick={() => setActiveModalTab('audit')}
                className={`py-2 px-3 text-xs font-bold border-b-2 transition-colors ${
                  activeModalTab === 'audit'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                3. Nhật ký Trạng thái (Audit Trail)
              </button>
              <button
                onClick={() => setActiveModalTab('action')}
                className={`py-2 px-3 text-xs font-bold border-b-2 transition-colors ${
                  activeModalTab === 'action'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                4. Xử lý Thao tác (Triage)
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="p-5 overflow-y-auto space-y-3.5 text-xs flex-1">
              {/* TAB 1: DETAILS */}
              {activeModalTab === 'details' && (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg text-amber-900">
                    <span className="font-bold block mb-1">Mô tả Vi phạm Quy tắc Nghiệp vụ:</span>
                    <p className="leading-relaxed">{selectedRecord.violationDescription}</p>
                    <div className="mt-1.5 flex items-center gap-2 text-[10px] text-amber-800 font-mono">
                      <span>Mã quy tắc: <strong>{selectedRecord.validationRuleId}</strong></span>
                      <span>•</span>
                      <span>Chỉ số: <strong>{selectedRecord.kpiCode}</strong></span>
                      <span>•</span>
                      <span>Phát hiện lúc: {selectedRecord.detectionTimestamp}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <span className="text-[10px] text-slate-400 font-medium block">Nhà cung cấp / Plant</span>
                      <span className="text-xs font-bold text-slate-900">{selectedRecord.vendor}</span>
                      <span className="text-[10px] text-slate-500 block">{selectedRecord.factory}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <span className="text-[10px] text-slate-400 font-medium block">Dây chuyền / Thiết bị</span>
                      <span className="text-xs font-bold text-slate-900">{selectedRecord.line}</span>
                      <span className="text-[10px] text-slate-500 block">{selectedRecord.equipment}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <span className="text-[10px] text-slate-400 font-medium block">Người phụ trách xử lý</span>
                      <span className="text-xs font-bold text-slate-900">{selectedRecord.assignedOwner}</span>
                      <span className="text-[10px] text-slate-500 block">{selectedRecord.ownerEmail}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <span className="text-[10px] text-slate-400 font-medium block">Hạn SLA giải quyết</span>
                      <span className={`text-xs font-bold ${selectedRecord.isSlaBreached ? 'text-rose-600' : 'text-slate-900'}`}>
                        {selectedRecord.slaDeadline}
                      </span>
                      <span className="text-[10px] text-slate-500 block">SLA chuẩn: {selectedRecord.resolutionSlaHours} giờ</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Đối chiếu Số liệu (Source vs Normalized vs Reference Truth):
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-white rounded border border-rose-200">
                        <span className="text-[9px] text-slate-400 block font-bold">Số liệu Gốc (Raw Input)</span>
                        <span className="text-xs font-bold text-rose-600 block mt-1">{selectedRecord.originalValue}</span>
                      </div>
                      <div className="p-2 bg-white rounded border border-slate-200">
                        <span className="text-[9px] text-slate-400 block font-bold">Đã Chuẩn hóa (Normalized)</span>
                        <span className="text-xs font-semibold text-slate-800 block mt-1">{selectedRecord.normalizedValue}</span>
                      </div>
                      <div className="p-2 bg-white rounded border border-emerald-200">
                        <span className="text-[9px] text-slate-400 block font-bold">Ngưỡng Logic Cho Phép</span>
                        <span className="text-xs font-bold text-emerald-700 block mt-1">{selectedRecord.expectedRange}</span>
                      </div>
                    </div>
                  </div>

                  {selectedRecord.approvalRecord && (
                    <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg space-y-1">
                      <div className="flex items-center gap-1.5 text-indigo-900 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Hồ sơ Phê duyệt Ngoại lệ có Thẩm quyền:</span>
                      </div>
                      <p className="text-indigo-950">Lý do: {selectedRecord.approvalRecord.justification}</p>
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-indigo-800 pt-1">
                        <span>Người duyệt: <strong>{selectedRecord.approvalRecord.approverName} ({selectedRecord.approvalRecord.approverRole})</strong></span>
                        <span>Thời hạn: Đến <strong>{selectedRecord.approvalRecord.validUntil}</strong></span>
                        <span>Phạm vi: {selectedRecord.approvalRecord.scope}</span>
                        <span>Mã duyệt: {selectedRecord.approvalRecord.approvedExceptionRef}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: EVIDENCE */}
              {activeModalTab === 'evidence' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>Tham chiếu Bằng chứng: {selectedRecord.evidenceRef}</span>
                    </span>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      SHA-256 Validated
                    </span>
                  </div>

                  {selectedRecord.evidenceLogSnippet && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Trích đoạn Log Gateway & Sensor Telemetry:
                      </span>
                      <pre className="p-3 bg-[#0c1527] text-emerald-400 rounded-lg font-mono text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
                        {selectedRecord.evidenceLogSnippet}
                      </pre>
                    </div>
                  )}

                  {selectedRecord.evidencePayload && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        JSON Payload Gốc (Raw Staging Capture):
                      </span>
                      <pre className="p-3 bg-slate-50 text-slate-800 rounded-lg font-mono text-[11px] overflow-x-auto border border-slate-200">
                        {JSON.stringify(selectedRecord.evidencePayload, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: AUDIT TRAIL */}
              {activeModalTab === 'audit' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-blue-600" />
                      <span>Nhật ký Thay đổi Trạng thái Bất biến (Immutable Audit Trail)</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Không xóa dấu vết sau khi xử lý</span>
                  </div>

                  <div className="space-y-2 relative before:absolute before:inset-0 before:left-2.5 before:w-0.5 before:bg-slate-200">
                    {selectedRecord.history.map((hist) => (
                      <div key={hist.id} className="relative pl-7 group">
                        <span className="absolute left-1 top-1.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-xs" />
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-xs">
                              {hist.action}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {hist.timestamp}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600">
                            Thực hiện bởi: <strong className="text-slate-800">{hist.actor}</strong> ({hist.actorRole})
                          </div>
                          {hist.notes && (
                            <p className="text-[11px] text-slate-700 bg-white p-1.5 rounded border border-slate-100">
                              {hist.notes}
                            </p>
                          )}
                          {hist.fromStatus && hist.toStatus && (
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-0.5">
                              <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                                {hist.fromStatus}
                              </span>
                              <span>→</span>
                              <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-bold">
                                {hist.toStatus}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: ACTIONS */}
              {activeModalTab === 'action' && (
                <div className="space-y-3.5">
                  <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-blue-800 uppercase block">Vai trò người dùng hiện tại:</span>
                      <strong className="text-xs text-blue-950">{currentUserName} ({currentUserRole})</strong>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-white text-blue-700 border border-blue-200">
                      RBAC Active
                    </span>
                  </div>

                  {actionType === null ? (
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => {
                          setActionType('ASSIGN');
                          setAssigneeInput(selectedRecord.assignedOwner);
                        }}
                        className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-all"
                      >
                        <UserCheck className="w-4 h-4 text-blue-600 mb-1" />
                        <span className="font-bold text-slate-900 block text-xs">Giao việc (Assign Owner)</span>
                        <span className="text-[10px] text-slate-500">Chuyển tiếp cho QA hoặc Kỹ sư nhà máy</span>
                      </button>

                      <button
                        onClick={() => {
                          setActionType('RESUBMIT');
                          setActionReasonInput('Yêu cầu trích xuất log quang học AOI và nộp lại biên bản số hóa.');
                        }}
                        className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-all"
                      >
                        <Send className="w-4 h-4 text-amber-600 mb-1" />
                        <span className="font-bold text-slate-900 block text-xs">Yêu cầu Nộp lại (Request Resubmission)</span>
                        <span className="text-[10px] text-slate-500">Yêu cầu nguồn sửa và gửi lại dữ liệu</span>
                      </button>

                      <button
                        onClick={() => handleRevalidateRecord(selectedRecord)}
                        className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-all"
                      >
                        <RotateCw className="w-4 h-4 text-emerald-600 mb-1" />
                        <span className="font-bold text-slate-900 block text-xs">Kiểm định lại (Revalidate)</span>
                        <span className="text-[10px] text-slate-500">Chạy lại Validation Engine kiểm tra bản ghi</span>
                      </button>

                      <button
                        onClick={() => {
                          setActionType('APPROVE_OVERRIDE');
                          setActionReasonInput('');
                        }}
                        className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-all"
                      >
                        <ShieldCheck className="w-4 h-4 text-indigo-600 mb-1" />
                        <span className="font-bold text-slate-900 block text-xs">Phê duyệt Ngoại lệ (Override)</span>
                        <span className="text-[10px] text-slate-500">Cho phép bỏ qua lỗi có điều kiện & thời hạn</span>
                      </button>

                      <button
                        onClick={() => {
                          setActionType('REJECT');
                          setActionReasonInput('Dữ liệu mâu thuẫn hoàn toàn với cảm biến máy. Bác bỏ.');
                        }}
                        className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-all col-span-2"
                      >
                        <XCircle className="w-4 h-4 text-rose-600 mb-1" />
                        <span className="font-bold text-slate-900 block text-xs">Bác bỏ & Cô lập Vĩnh viễn (Reject & Purge)</span>
                        <span className="text-[10px] text-slate-500">Tuyệt đối không cho phép bản ghi lọt vào KPI Data Store</span>
                      </button>
                    </div>
                  ) : (
                    /* Specific Action Form */
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                        <span className="font-bold text-slate-900 text-xs">
                          {actionType === 'ASSIGN' && 'Phân công Người phụ trách mới'}
                          {actionType === 'RESUBMIT' && 'Gửi Yêu cầu Nộp lại Dữ liệu'}
                          {actionType === 'APPROVE_OVERRIDE' && 'Phê duyệt Ngoại lệ (Override Approval)'}
                          {actionType === 'REJECT' && 'Xác nhận Bác bỏ Vĩnh viễn'}
                        </span>
                        <button
                          onClick={() => setActionType(null)}
                          className="text-slate-400 hover:text-slate-700 text-xs font-bold"
                        >
                          Hủy bỏ
                        </button>
                      </div>

                      {actionType === 'ASSIGN' && (
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">
                            Tên Kỹ sư / QA Lead phụ trách:
                          </label>
                          <input
                            type="text"
                            value={assigneeInput}
                            onChange={(e) => setAssigneeInput(e.target.value)}
                            placeholder="Nhập tên người nhận việc..."
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800"
                          />
                        </div>
                      )}

                      {actionType === 'APPROVE_OVERRIDE' && (
                        <div className="space-y-2">
                          {currentUserRole === 'PLANT_QA' && (
                            <div className="p-2 bg-rose-50 border border-rose-200 rounded text-[11px] text-rose-800 font-bold">
                              Cảnh báo Segregation of Duties: Bạn đang đăng nhập vai trò Plant QA. Quyền phê duyệt Override bị giới hạn cho Data Steward hoặc Ban Lãnh Đạo (Executive).
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Phạm vi phê duyệt (Scope):</label>
                              <input
                                type="text"
                                value={overrideScopeInput}
                                onChange={(e) => setOverrideScopeInput(e.target.value)}
                                className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Thời hạn hiệu lực (Ngày):</label>
                              <input
                                type="number"
                                value={overrideExpiryDays}
                                onChange={(e) => setOverrideExpiryDays(e.target.value)}
                                className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">
                          Ghi chú giải trình / Căn cứ quyết định:
                        </label>
                        <textarea
                          rows={3}
                          value={actionReasonInput}
                          onChange={(e) => setActionReasonInput(e.target.value)}
                          placeholder="Nhập lý do, căn cứ kỹ thuật hoặc mã biên bản đính kèm..."
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => setActionType(null)}
                          className="px-3 py-1 bg-slate-200 text-slate-700 rounded text-xs font-bold"
                        >
                          Đóng
                        </button>
                        {actionType === 'ASSIGN' && (
                          <button
                            onClick={() => handleAssignOwnerSubmit(selectedRecord)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-bold"
                          >
                            Xác nhận Giao việc
                          </button>
                        )}
                        {actionType === 'RESUBMIT' && (
                          <button
                            onClick={() => handleRequestResubmissionSubmit(selectedRecord)}
                            className="px-3 py-1 bg-amber-600 text-white rounded text-xs font-bold"
                          >
                            Gửi Yêu cầu
                          </button>
                        )}
                        {actionType === 'APPROVE_OVERRIDE' && (
                          <button
                            disabled={currentUserRole === 'PLANT_QA'}
                            onClick={() => handleApproveOverrideSubmit(selectedRecord)}
                            className={`px-3 py-1 rounded text-xs font-bold ${
                              currentUserRole === 'PLANT_QA'
                                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                          >
                            Xác nhận Duyệt Ngoại lệ
                          </button>
                        )}
                        {actionType === 'REJECT' && (
                          <button
                            onClick={() => handleRejectRecord(selectedRecord)}
                            className="px-3 py-1 bg-rose-600 text-white rounded text-xs font-bold"
                          >
                            Xác nhận Bác bỏ
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-[10px] text-slate-400">
                Nhật ký kiểm toán ghi nhận theo chuẩn ISO-27001 & Enterprise Data Governance.
              </span>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs"
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
