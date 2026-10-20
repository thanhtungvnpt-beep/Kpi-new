import React, { useState } from 'react';
import { UserCheck, CheckCheck, Search, X, Download, ChevronDown } from 'lucide-react';
import { APPROVAL_ACTIONS } from '../data/mockData';
import { ApprovalAction } from '../types';

interface ActionsApprovalTableProps {
  onOpenApprovalModal?: (item?: ApprovalAction) => void;
  onBatchApprove?: (count: number) => void;
}

export const ActionsApprovalTable: React.FC<ActionsApprovalTableProps> = ({
  onOpenApprovalModal,
  onBatchApprove,
}) => {
  const [actions, setActions] = useState<ApprovalAction[]>(APPROVAL_ACTIONS);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  // Filter actions by status and search query (description, ID, type, requester, priority)
  const filteredActions = actions.filter((a) => {
    const currentStatus = a.status || (a.approved ? 'Approved' : 'Pending');

    // Status filter
    if (statusFilter !== 'All' && currentStatus !== statusFilter) {
      return false;
    }

    // Search query filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const idMatch = a.id.toString().includes(q) || `#${a.id}`.includes(q);
    const descMatch = a.description.toLowerCase().includes(q);
    const typeMatch = a.type.toLowerCase().includes(q);
    const requestedByMatch = a.requestedBy.toLowerCase().includes(q);
    const priorityMatch = a.priority?.toLowerCase().includes(q);
    return idMatch || descMatch || typeMatch || requestedByMatch || priorityMatch;
  });

  const pendingActions = filteredActions.filter(
    (a) => (a.status || (a.approved ? 'Approved' : 'Pending')) === 'Pending'
  );
  const isAllSelected =
    pendingActions.length > 0 && selectedIds.length === pendingActions.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingActions.map((a) => a.id));
    }
  };

  const handleToggleSelectRow = (id: number, e: React.MouseEvent | React.ChangeEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBatchApprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIds.length === 0) return;

    const count = selectedIds.length;
    setActions((prev) =>
      prev.map((a) =>
        selectedIds.includes(a.id)
          ? { ...a, approved: true, status: 'Approved' }
          : a
      )
    );
    setSelectedIds([]);
    onBatchApprove?.(count);
  };

  const handleExportCSV = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (filteredActions.length === 0) return;

    // Headers & Rows with quotation escaping
    const headers = ['ID', 'Type', 'Description', 'Requested By', 'Priority', 'Date', 'Status'];
    const rows = filteredActions.map((a) => [
      a.id.toString(),
      `"${a.type.replace(/"/g, '""')}"`,
      `"${a.description.replace(/"/g, '""')}"`,
      `"${a.requestedBy.replace(/"/g, '""')}"`,
      `"${a.priority || 'Medium'}"`,
      `"${a.date.replace(/"/g, '""')}"`,
      a.status || (a.approved ? 'Approved' : 'Pending'),
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');

    // Trigger browser file download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `approval_requests_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderStatusBadge = (status?: 'Pending' | 'Approved' | 'Rejected', approved?: boolean) => {
    const current = status || (approved ? 'Approved' : 'Pending');
    switch (current) {
      case 'Approved':
        return (
          <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-block text-[9px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
            Rejected
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-block text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
            Pending
          </span>
        );
    }
  };

  const renderPriorityBadge = (priority?: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High':
        return (
          <span className="inline-block text-[9px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-block text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
            Medium
          </span>
        );
      case 'Low':
        return (
          <span className="inline-block text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
            Low
          </span>
        );
      default:
        return (
          <span className="inline-block text-[9px] font-medium text-slate-600 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
            Medium
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-rose-100 flex items-center justify-center text-rose-600">
            <UserCheck className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-xs font-bold text-slate-800">
              Actions Requiring Approval
            </h2>
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
              {actions.filter((a) => (a.status || (a.approved ? 'Approved' : 'Pending')) === 'Pending').length}
            </span>
          </div>
        </div>

        {/* Right Header Controls: Export to CSV + Batch Approve + View All */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={filteredActions.length === 0}
            className="px-2 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Export filtered approval requests to CSV"
          >
            <Download className="w-3 h-3 text-slate-500" />
            <span className="hidden sm:inline">Export to CSV</span>
            <span className="sm:hidden">CSV</span>
          </button>

          <button
            type="button"
            onClick={handleBatchApprove}
            disabled={selectedIds.length === 0}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              selectedIds.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white ring-1 ring-emerald-500 animate-in zoom-in-95'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
            }`}
            title={
              selectedIds.length > 0
                ? `Approve ${selectedIds.length} selected action(s)`
                : 'Select one or more pending items to batch approve'
            }
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>
              Batch Approve{selectedIds.length > 0 ? ` (${selectedIds.length})` : ''}
            </span>
          </button>

          <button
            onClick={() => onOpenApprovalModal?.()}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            View All
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="mt-2.5 flex items-center gap-2">
        {/* Search Input Field */}
        <div className="flex-1 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search approval requests by description, priority or ID (#)..."
            className="w-full pl-8 pr-7 py-1 text-[11px] bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 placeholder-slate-400 rounded-md border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              title="Clear search"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Status Dropdown Filter */}
        <div className="relative shrink-0">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as 'All' | 'Pending' | 'Approved' | 'Rejected')
            }
            className="appearance-none bg-slate-50 hover:bg-slate-100/70 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-md pl-2.5 pr-6 py-1 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {/* Header Checkbox */}
              <th className="py-1.5 px-2 w-7 text-center">
                <input
                  type="checkbox"
                  aria-label="Select all pending actions"
                  checked={isAllSelected}
                  disabled={pendingActions.length === 0}
                  onChange={handleToggleSelectAll}
                  className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 focus:ring-1 cursor-pointer accent-blue-600"
                />
              </th>
              <th className="py-1.5 px-1.5 w-6">#</th>
              <th className="py-1.5 px-1.5">Type</th>
              <th className="py-1.5 px-1.5">Description</th>
              <th className="py-1.5 px-1">Requested By</th>
              <th className="py-1.5 px-1 text-center">Priority</th>
              <th className="py-1.5 px-1 text-center">Status</th>
              <th className="py-1.5 px-1.5 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredActions.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-slate-400 text-xs">
                  <p>
                    No approval requests found matching{' '}
                    {statusFilter !== 'All' ? `status "${statusFilter}"` : ''}{' '}
                    {searchQuery ? `query "${searchQuery}"` : ''}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('All');
                    }}
                    className="mt-1 text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    Reset all filters
                  </button>
                </td>
              </tr>
            ) : (
              filteredActions.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const currentStatus = item.status || (item.approved ? 'Approved' : 'Pending');
                const isPending = currentStatus === 'Pending';

                return (
                  <tr
                    key={item.id}
                    onClick={() => onOpenApprovalModal?.(item)}
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer group ${
                      currentStatus === 'Approved'
                        ? 'opacity-60 bg-emerald-50/10'
                        : currentStatus === 'Rejected'
                        ? 'opacity-60 bg-rose-50/10'
                        : isSelected
                        ? 'bg-blue-50/50'
                        : ''
                    }`}
                  >
                    {/* Row Checkbox */}
                    <td
                      className="py-2 px-2 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        aria-label={`Select approval action #${item.id}`}
                        checked={isSelected}
                        disabled={!isPending}
                        onChange={(e) => handleToggleSelectRow(item.id, e)}
                        className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 focus:ring-1 cursor-pointer accent-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      />
                    </td>
                    <td className="py-2 px-1.5 font-bold text-slate-400 text-[10px]">
                      {item.id}
                    </td>
                    <td className="py-2 px-1.5 font-bold text-slate-800 text-[11px] whitespace-nowrap">
                      {item.type}
                    </td>
                    <td className="py-2 px-1.5 text-slate-700 text-[11px] max-w-[120px] truncate">
                      <span className={currentStatus === 'Approved' ? 'line-through' : ''}>
                        {item.description}
                      </span>
                    </td>
                    <td className="py-2 px-1 text-slate-600 text-[11px] whitespace-nowrap">
                      {item.requestedBy}
                    </td>
                    <td className="py-2 px-1 text-center whitespace-nowrap">
                      {renderPriorityBadge(item.priority)}
                    </td>
                    <td className="py-2 px-1 text-center whitespace-nowrap">
                      {renderStatusBadge(item.status, item.approved)}
                    </td>
                    <td className="py-2 px-1.5 text-slate-500 text-[11px] text-right tabular-nums whitespace-nowrap">
                      {item.date}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
