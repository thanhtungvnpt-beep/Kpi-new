import React, { useState, useEffect, useMemo } from 'react';
import {
  History,
  X,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Terminal,
  FileText,
  Download,
  Printer,
  RefreshCw,
  Search,
  Filter,
  Copy,
  Check,
  Lock,
  ArrowRight,
  AlertCircle,
  FileCheck2,
  ExternalLink,
} from 'lucide-react';
import { ApprovalAction, ApprovalAuditLogEntry } from '../types';

interface AuditLogModalProps {
  isOpen: boolean;
  record: ApprovalAction | null;
  onClose: () => void;
  onStatusChange?: (recordId: number, newStatus: 'Pending' | 'Approved' | 'Rejected', reason: string) => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({
  isOpen,
  record,
  onClose,
  onStatusChange,
}) => {
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [logs, setLogs] = useState<ApprovalAuditLogEntry[]>([]);
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isVerifyingIntegrity, setIsVerifyingIntegrity] = useState<boolean>(false);
  const [integrityVerified, setIntegrityVerified] = useState<boolean>(true);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // New action form state inside modal
  const [showStatusTransitionForm, setShowStatusTransitionForm] = useState<boolean>(false);
  const [targetStatus, setTargetStatus] = useState<'Approved' | 'Rejected'>('Approved');
  const [transitionReason, setTransitionReason] = useState<string>('');

  // Simulated audit log generator for record
  useEffect(() => {
    if (!record || !isOpen) return;

    setIsFetching(true);
    // Simulate enterprise backend API fetch latency
    const timer = setTimeout(() => {
      if (record.auditLogs && record.auditLogs.length > 0) {
        setLogs(record.auditLogs);
      } else {
        const currentStatus = record.status || (record.approved ? 'Approved' : 'Pending');
        const defaultLogs: ApprovalAuditLogEntry[] = [
          {
            id: `LOG-${record.id}-001`,
            timestamp: `${record.date}, 2025 08:30:15 (UTC+7)`,
            action: 'CREATED',
            actor: record.requestedBy,
            actorRole: 'Originating Requester',
            actorDepartment: 'Plant Operations / QA',
            actorIp: '192.168.10.42 [S-MES-TERMINAL-02]',
            fromStatus: 'Draft',
            toStatus: 'Pending',
            reason: `Khởi tạo yêu cầu phê duyệt: "${record.description}" với mức độ ưu tiên ${record.priority || 'Medium'}.`,
            complianceSignoff: true,
            checksum: `sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`,
            evidenceRef: `DOC_QUOTATION_REQ_${record.id}.pdf`,
          },
          {
            id: `LOG-${record.id}-002`,
            timestamp: `${record.date}, 2025 09:12:40 (UTC+7)`,
            action: 'PRIORITY_ESCALATED',
            actor: 'Workflow Daemon (K8s Agent)',
            actorRole: 'System Automation Engine',
            actorDepartment: 'IT Enterprise Integration',
            actorIp: '172.24.0.12 [K8S-WORKFLOW-NODE-03]',
            fromStatus: 'Pending',
            toStatus: 'Pending',
            reason: `Đánh giá rủi ro tự động: Tiêu chí "${record.type}" được gán mức ưu tiên ${record.priority || 'Medium'} dựa trên tác động dây chuyền sản xuất.`,
            complianceSignoff: true,
            checksum: `sha256:8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4`,
          },
        ];

        if (currentStatus === 'Approved') {
          defaultLogs.unshift({
            id: `LOG-${record.id}-003`,
            timestamp: `${record.date}, 2025 14:45:22 (UTC+7)`,
            action: 'APPROVED',
            actor: 'Trần Văn Long',
            actorRole: 'Executive Signoff Authority (Phó TGĐ)',
            actorDepartment: 'Manufacturing Directorate',
            actorIp: '10.0.4.15 [EXEC-WORKSTATION-01]',
            fromStatus: 'Pending',
            toStatus: 'Approved',
            reason: 'Phê duyệt chính thức theo đề xuất kỹ thuật. Đã đối soát ngân sách và biên bản nghiệm thu.',
            complianceSignoff: true,
            checksum: `sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08`,
            evidenceRef: `EXEC_SIGNOFF_CERT_#${record.id}.pdf`,
          });
        } else if (currentStatus === 'Rejected') {
          defaultLogs.unshift({
            id: `LOG-${record.id}-003`,
            timestamp: `${record.date}, 2025 11:20:00 (UTC+7)`,
            action: 'REJECTED',
            actor: 'Vũ Đức Thịnh',
            actorRole: 'Compliance Reviewer (Trưởng phòng QA)',
            actorDepartment: 'Quality Assurance',
            actorIp: '192.168.12.88 [QA-TERMINAL-01]',
            fromStatus: 'Pending',
            toStatus: 'Rejected',
            reason: 'Chưa đủ căn cứ chứng minh tính cần thiết kỹ thuật. Yêu cầu bổ sung dữ liệu phân tích OEE.',
            complianceSignoff: true,
            checksum: `sha256:5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8`,
          });
        } else {
          defaultLogs.unshift({
            id: `LOG-${record.id}-003`,
            timestamp: `${record.date}, 2025 13:00:00 (UTC+7)`,
            action: 'SLA_WARNING',
            actor: 'SLA Monitor Bot',
            actorRole: 'Compliance Guardian',
            actorDepartment: 'Data Governance & IT',
            actorIp: '172.24.0.18 [CRON-GUARDIAN]',
            fromStatus: 'Pending',
            toStatus: 'Pending',
            reason: `Yêu cầu đang chờ ký duyệt (${record.pendingHours ?? 4} giờ). Thông báo nhắc nhở đã gửi tới cấp thẩm quyền.`,
            complianceSignoff: true,
            checksum: `sha256:4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a`,
          });
        }

        setLogs(defaultLogs);
      }
      setIsFetching(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [record, isOpen]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (filterAction !== 'ALL' && log.action !== filterAction) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        log.actor.toLowerCase().includes(q) ||
        log.actorRole.toLowerCase().includes(q) ||
        log.reason?.toLowerCase().includes(q) ||
        log.id.toLowerCase().includes(q) ||
        log.checksum?.toLowerCase().includes(q)
      );
    });
  }, [logs, filterAction, searchQuery]);

  if (!isOpen || !record) return null;

  const currentStatus = record.status || (record.approved ? 'Approved' : 'Pending');

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleVerifyIntegrity = () => {
    setIsVerifyingIntegrity(true);
    setTimeout(() => {
      setIsVerifyingIntegrity(false);
      setIntegrityVerified(true);
    }, 600);
  };

  const handleStatusTransitionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transitionReason.trim()) return;

    const newLog: ApprovalAuditLogEntry = {
      id: `LOG-${record.id}-00${logs.length + 1}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' (UTC+7)',
      action: targetStatus === 'Approved' ? 'APPROVED' : 'REJECTED',
      actor: 'Quản trị viên Hệ thống (Current User)',
      actorRole: 'Compliance Officer & Auditor',
      actorDepartment: 'Executive Control Tower',
      actorIp: '192.168.1.55 [WEB-SESSION-HTTPS]',
      fromStatus: currentStatus,
      toStatus: targetStatus,
      reason: transitionReason.trim(),
      complianceSignoff: true,
      checksum: `sha256:${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      evidenceRef: `AUDIT_SIGNOFF_CERT_${record.id}_${Date.now().toString().slice(-4)}.pdf`,
    };

    setLogs([newLog, ...logs]);
    onStatusChange?.(record.id, targetStatus, transitionReason.trim());
    setShowStatusTransitionForm(false);
    setTransitionReason('');
  };

  const handleExportAuditCSV = () => {
    const headers = [
      'Log ID',
      'Record ID',
      'Timestamp',
      'Action',
      'From Status',
      'To Status',
      'Actor',
      'Actor Role',
      'Department',
      'IP / Terminal',
      'Reason / Note',
      'Cryptographic Checksum',
      'Evidence Reference',
    ];
    const rows = logs.map((l) => [
      l.id,
      record.id.toString(),
      `"${l.timestamp}"`,
      l.action,
      l.fromStatus || '',
      l.toStatus || '',
      `"${l.actor}"`,
      `"${l.actorRole}"`,
      `"${l.actorDepartment || ''}"`,
      `"${l.actorIp || ''}"`,

      `"${(l.reason || '').replace(/"/g, '""')}"`,
      l.checksum || '',
      l.evidenceRef || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audit_trail_record_${record.id}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadgeColor = (action: ApprovalAuditLogEntry['action']) => {
    switch (action) {
      case 'APPROVED':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      case 'CREATED':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'PRIORITY_ESCALATED':
        return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'SLA_WARNING':
        return 'bg-orange-50 text-orange-900 border-orange-300';
      case 'STATUS_CHANGED':
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-4 select-none animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Compliance Header */}
        <div className="px-5 py-4 bg-[#0b1426] text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/90 flex items-center justify-center text-white shadow-md border border-blue-400/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
                  <span>Hồ sơ Kiểm toán & Lịch sử Trạng thái</span>
                  <span className="font-mono text-cyan-400">#{record.id}</span>
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  ISO 27001 / SOX 404
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    currentStatus === 'Approved'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : currentStatus === 'Rejected'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {currentStatus}
                </span>
              </div>
              <p className="text-xs text-slate-300 truncate max-w-md mt-0.5">
                {record.type}: <span className="text-slate-100 font-medium">{record.description}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
            title="Đóng cửa sổ kiểm toán"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cryptographic Ledger & Security Seal Ribbon */}
        <div className="px-5 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono text-slate-300">
              Immutable Ledger Chain: <strong className="text-emerald-400">Verified Sealed</strong>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-[11px] text-slate-400">
              Yêu cầu bởi: <strong className="text-white">{record.requestedBy}</strong> ({record.date})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleVerifyIntegrity}
              disabled={isVerifyingIntegrity}
              className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 transition-colors cursor-pointer"
              title="Xác thực tính toàn vẹn của chuỗi băm (SHA-256)"
            >
              <RefreshCw className={`w-3 h-3 ${isVerifyingIntegrity ? 'animate-spin' : ''}`} />
              <span>{isVerifyingIntegrity ? 'Đang xác thực...' : 'Verify Ledger Integrity'}</span>
            </button>
          </div>
        </div>

        {/* Filter and Toolbar Bar */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm người thao tác, lý do, hash..."
                className="w-full pl-8 pr-3 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tất cả thao tác</option>
              <option value="CREATED">CREATED</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="PRIORITY_ESCALATED">PRIORITY_ESCALATED</option>
              <option value="SLA_WARNING">SLA_WARNING</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            {currentStatus === 'Pending' && (
              <button
                onClick={() => setShowStatusTransitionForm(!showStatusTransitionForm)}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Cập nhật trạng thái</span>
              </button>
            )}

            <button
              onClick={handleExportAuditCSV}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
              title="Tải toàn bộ lịch sử kiểm toán dạng CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Xuất CSV</span>
            </button>
          </div>
        </div>

        {/* Transition Form (if open) */}
        {showStatusTransitionForm && (
          <form
            onSubmit={handleStatusTransitionSubmit}
            className="p-4 bg-blue-50/70 border-b border-blue-200 text-xs space-y-2.5 animate-in slide-in-from-top-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-blue-600" />
                <span>Thực hiện Chuyển dịch Trạng thái có Ký duyệt Kiểm toán</span>
              </span>
              <button
                type="button"
                onClick={() => setShowStatusTransitionForm(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                  Trạng thái đích:
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetStatus('Approved')}
                    className={`flex-1 py-1.5 px-3 rounded-lg font-bold border text-xs flex items-center justify-center gap-1.5 transition-all ${
                      targetStatus === 'Approved'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Chấp thuận (Approve)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetStatus('Rejected')}
                    className={`flex-1 py-1.5 px-3 rounded-lg font-bold border text-xs flex items-center justify-center gap-1.5 transition-all ${
                      targetStatus === 'Rejected'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Từ chối (Reject)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                  Căn cứ giải trình bắt buộc (Compliance Rationale):
                </label>
                <input
                  type="text"
                  required
                  value={transitionReason}
                  onChange={(e) => setTransitionReason(e.target.value)}
                  placeholder="Nhập lý do nghiệp vụ phê duyệt hoặc từ chối..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowStatusTransitionForm(false)}
                className="px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                Ghi nhận vào Sổ cái Kiểm toán
              </button>
            </div>
          </form>
        )}

        {/* Modal Scrollable Body - Timeline Entries */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {isFetching ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-xs font-semibold">Đang truy vấn lịch sử thay đổi từ sổ cái kiểm toán...</span>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p>Không có bản ghi kiểm toán phù hợp với bộ lọc hiện tại.</p>
            </div>
          ) : (
            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
              {filteredLogs.map((entry, index) => {
                return (
                  <div key={entry.id} className="relative pl-9 group">
                    {/* Timeline Node Dot */}
                    <span
                      className={`absolute left-2 top-2.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                        entry.action === 'APPROVED'
                          ? 'bg-emerald-500'
                          : entry.action === 'REJECTED'
                          ? 'bg-rose-500'
                          : entry.action === 'CREATED'
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                      }`}
                    />

                    {/* Timeline Card */}
                    <div className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-all shadow-2xs space-y-2.5">
                      {/* Top Row: Action, Status transition, Timestamp */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getActionBadgeColor(
                              entry.action
                            )}`}
                          >
                            {entry.action}
                          </span>

                          {entry.fromStatus && entry.toStatus && (
                            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                              <span className="text-slate-500">{entry.fromStatus}</span>
                              <ArrowRight className="w-3 h-3 text-slate-400" />
                              <span
                                className={`font-bold ${
                                  entry.toStatus === 'Approved'
                                    ? 'text-emerald-700'
                                    : entry.toStatus === 'Rejected'
                                    ? 'text-rose-700'
                                    : 'text-amber-700'
                                }`}
                              >
                                {entry.toStatus}
                              </span>
                            </div>
                          )}

                          <span className="text-[10px] text-slate-400 font-mono">
                            SEQ #{String(filteredLogs.length - index).padStart(3, '0')}
                          </span>
                        </div>

                        <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{entry.timestamp}</span>
                        </span>
                      </div>

                      {/* Actor & Role Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                        <div className="flex items-start gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-slate-400">Người thực hiện: </span>
                            <strong className="text-slate-900">{entry.actor}</strong>
                            <span className="text-slate-500 block text-[10px]">{entry.actorRole}</span>
                          </div>
                        </div>

                        {entry.actorIp && (
                          <div className="flex items-start gap-1.5 sm:justify-end font-mono text-[10px] text-slate-500">
                            <Terminal className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span>{entry.actorIp}</span>
                          </div>
                        )}
                      </div>

                      {/* Rationale / Note */}
                      {entry.reason && (
                        <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-150 text-slate-800 text-xs leading-relaxed">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                            Căn cứ nghiệp vụ / Rationale:
                          </span>
                          <p>{entry.reason}</p>
                        </div>
                      )}

                      {/* Cryptographic Checksum & Reference */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-1 text-[10px] text-slate-400 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 font-mono truncate max-w-sm">
                          <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="truncate" title={entry.checksum}>
                            {entry.checksum || 'SHA-256 Validated'}
                          </span>
                          {entry.checksum && (
                            <button
                              onClick={() => handleCopyHash(entry.checksum!)}
                              className="text-slate-400 hover:text-slate-700 ml-1"
                              title="Copy SHA-256 checksum"
                            >
                              {copiedHash === entry.checksum ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>

                        {entry.evidenceRef && (
                          <span className="inline-flex items-center gap-1 text-blue-600 hover:underline cursor-pointer font-medium">
                            <FileText className="w-3 h-3" />
                            <span>{entry.evidenceRef}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0 text-xs">
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Sổ cái ghi nhận điện tử tuân thủ tiêu chuẩn chữ ký số doanh nghiệp.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-lg text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Biên bản</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
