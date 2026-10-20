import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  TrendingUp,
  AlertTriangle,
  AlertCircle,
  Info,
  ArrowRight,
} from 'lucide-react';
import { AI_INSIGHTS } from '../data/mockData';

interface AIExecutiveInsightCardProps {
  onOpenAllInsights?: () => void;
  onApplySuggestion?: (action: string) => void;
}

export const AIExecutiveInsightCard: React.FC<AIExecutiveInsightCardProps> = ({
  onOpenAllInsights,
  onApplySuggestion,
}) => {
  const [timeRange, setTimeRange] = useState('30');

  const renderIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return (
          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <TrendingUp className="w-3 h-3" />
          </div>
        );
      case 'alert':
        return (
          <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <AlertTriangle className="w-3 h-3" />
          </div>
        );
      case 'critical':
        return (
          <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <AlertCircle className="w-3 h-3" />
          </div>
        );
      case 'info':
        return (
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Info className="w-3 h-3" />
          </div>
        );
      case 'sparkle':
      default:
        return (
          <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <Sparkles className="w-3 h-3" />
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-purple-600 text-white flex items-center justify-center text-[10px] font-black">
            AI
          </div>
          <h2 className="text-xs font-bold text-slate-800">
            AI Executive Insight
          </h2>
        </div>

        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-semibold rounded px-2.5 py-1 pr-6 hover:border-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="30">Last 30 Days</option>
            <option value="7">Last 7 Days</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-2 mt-2 flex-1 overflow-y-auto">
        {AI_INSIGHTS.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-2.5 p-1 rounded hover:bg-slate-50 transition-colors"
          >
            {renderIcon(item.iconType)}
            <p className="text-[11px] text-slate-700 leading-snug">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      {/* Footer Button */}
      <div className="mt-3 pt-2 border-t border-slate-100">
        <button
          onClick={onOpenAllInsights}
          className="w-full py-1.5 px-3 border border-blue-500/50 hover:border-blue-600 hover:bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
        >
          <span>View All AI Insights</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
