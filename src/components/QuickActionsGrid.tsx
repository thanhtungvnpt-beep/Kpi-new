import React from 'react';
import {
  Zap,
  PlusCircle,
  Briefcase,
  CheckCircle,
  Settings,
  FileSpreadsheet,
  PhoneCall,
} from 'lucide-react';

interface QuickActionsGridProps {
  onActionClick: (actionName: string) => void;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({ onActionClick }) => {
  const actions = [
    {
      id: 'create_issue',
      label: 'Create Issue',
      icon: PlusCircle,
      iconColor: 'text-rose-500 bg-rose-50',
    },
    {
      id: 'create_wo',
      label: 'Create Work Order',
      icon: Briefcase,
      iconColor: 'text-blue-500 bg-blue-50',
    },
    {
      id: 'request_approval',
      label: 'Request Approval',
      icon: CheckCircle,
      iconColor: 'text-emerald-500 bg-emerald-50',
    },
    {
      id: 'check_plan',
      label: 'Check Production Plan',
      icon: Settings,
      iconColor: 'text-sky-500 bg-sky-50',
    },
    {
      id: 'manual_qa',
      label: 'Nhập Liệu Ca (Manual QA)',
      icon: FileSpreadsheet,
      iconColor: 'text-purple-600 bg-purple-50',
    },
    {
      id: 'contact_vendor',
      label: 'Contact Vendor',
      icon: PhoneCall,
      iconColor: 'text-blue-600 bg-blue-50',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center text-blue-600">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-xs font-bold text-slate-800">Quick Actions</h2>
        </div>
      </div>

      {/* Grid of 6 buttons: 2 cols x 3 rows */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => onActionClick(act.label)}
              className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-slate-200/80 hover:border-blue-400 hover:bg-blue-50/40 active:scale-[0.98] transition-all group text-center cursor-pointer shadow-2xs"
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1.5 transition-transform group-hover:scale-110 ${act.iconColor}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 group-hover:text-blue-700 leading-tight">
                {act.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
