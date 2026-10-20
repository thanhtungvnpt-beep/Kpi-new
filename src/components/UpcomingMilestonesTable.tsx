import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { UPCOMING_MILESTONES } from '../data/mockData';
import { MilestoneItem } from '../types';

interface UpcomingMilestonesTableProps {
  onOpenMilestoneModal?: () => void;
}

export const UpcomingMilestonesTable: React.FC<UpcomingMilestonesTableProps> = ({
  onOpenMilestoneModal,
}) => {
  const renderStatus = (status: MilestoneItem['status']) => {
    switch (status) {
      case 'On Track':
        return (
          <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            On Track
          </span>
        );
      case 'Planned':
        return (
          <span className="inline-block text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
            Planned
          </span>
        );
      case 'At Risk':
        return (
          <span className="inline-block text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
            At Risk
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center text-blue-600">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-xs font-bold text-slate-800">
            Upcoming Milestones
          </h2>
        </div>

        <button
          onClick={() => onOpenMilestoneModal?.()}
          className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-1.5 px-1">Date</th>
              <th className="py-1.5 px-1.5">Milestone</th>
              <th className="py-1.5 px-1">Vendor</th>
              <th className="py-1.5 px-1 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {UPCOMING_MILESTONES.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer"
              >
                <td className="py-2 px-1 text-slate-500 text-[11px] whitespace-nowrap tabular-nums">
                  {item.date}
                </td>
                <td className="py-2 px-1.5 font-semibold text-slate-800 text-[11px]">
                  {item.milestone}
                </td>
                <td className="py-2 px-1 text-slate-600 text-[11px] whitespace-nowrap">
                  {item.vendor}
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
