import React, { useState } from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { ISSUE_ITEMS } from '../data/mockData';
import { IssueItem } from '../types';

interface IssueRiskTableProps {
  onOpenIssueModal?: (issue?: IssueItem) => void;
}

export const IssueRiskTable: React.FC<IssueRiskTableProps> = ({ onOpenIssueModal }) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredIssues =
    filterSeverity === 'all'
      ? ISSUE_ITEMS
      : ISSUE_ITEMS.filter((i) => i.severity.toLowerCase() === filterSeverity.toLowerCase());

  const renderStatus = (status: IssueItem['status']) => {
    switch (status) {
      case 'Open':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
            <span>▲</span>
            <span>Open</span>
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
            <span>+</span>
            <span>In Progress</span>
          </span>
        );
      case 'Monitoring':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
            <span>✦</span>
            <span>Monitoring</span>
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-medium text-slate-500">
            {status}
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
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-xs font-bold text-slate-800">
            Issue & Risk Summary
          </h2>
        </div>

        <button
          onClick={() => onOpenIssueModal?.()}
          className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          View All
        </button>
      </div>

      {/* Severity Filter Badges */}
      <div className="flex items-center gap-1.5 mt-2">
        <button
          onClick={() => setFilterSeverity(filterSeverity === 'Critical' ? 'all' : 'Critical')}
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
            filterSeverity === 'Critical'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-rose-500 text-white hover:bg-rose-600'
          }`}
        >
          <span className="w-3 h-3 rounded-full bg-white text-rose-600 flex items-center justify-center text-[9px] font-extrabold">
            4
          </span>
          <span>Critical</span>
        </button>

        <button
          onClick={() => setFilterSeverity(filterSeverity === 'High' ? 'all' : 'High')}
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
            filterSeverity === 'High'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'bg-rose-400 text-white hover:bg-rose-500'
          }`}
        >
          <span className="w-3 h-3 rounded-full bg-white text-rose-500 flex items-center justify-center text-[9px] font-extrabold">
            7
          </span>
          <span>High</span>
        </button>

        <button
          onClick={() => setFilterSeverity(filterSeverity === 'Medium' ? 'all' : 'Medium')}
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
            filterSeverity === 'Medium'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
          }`}
        >
          <span className="w-3 h-3 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px] font-extrabold">
            11
          </span>
          <span>Medium</span>
        </button>

        <button
          onClick={() => setFilterSeverity(filterSeverity === 'Low' ? 'all' : 'Low')}
          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
            filterSeverity === 'Low'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
          }`}
        >
          Low
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-1.5 px-1.5 w-6">#</th>
              <th className="py-1.5 px-1">Date</th>
              <th className="py-1.5 px-1.5">Vendor</th>
              <th className="py-1.5 px-1">Category</th>
              <th className="py-1.5 px-1.5">Issue</th>
              <th className="py-1.5 px-1 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredIssues.map((item) => (
              <tr
                key={item.id}
                onClick={() => onOpenIssueModal?.(item)}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                <td className="py-2 px-1.5 font-bold text-slate-400 text-[10px]">
                  {item.id}
                </td>
                <td className="py-2 px-1 text-slate-600 text-[11px] whitespace-nowrap">
                  {item.date}
                </td>
                <td className="py-2 px-1.5 font-bold text-slate-800 text-[11px]">
                  {item.vendor}
                </td>
                <td className="py-2 px-1 text-slate-600 text-[11px]">
                  {item.category}
                </td>
                <td className="py-2 px-1.5 text-slate-700 font-medium text-[11px] max-w-[120px] truncate">
                  {item.issue}
                </td>
                <td className="py-2 px-1 text-center whitespace-nowrap">
                  {renderStatus(item.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
