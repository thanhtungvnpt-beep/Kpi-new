import React from 'react';
import {
  Home,
  Inbox,
  Building2,
  Activity,
  Cpu,
  ShieldCheck,
  Box,
  Users,
  FileCheck,
  AlertTriangle,
  BookOpen,
  Share2,
  Lock,
  Settings,
  Bot,
  Sparkles,
} from 'lucide-react';
import { SIDEBAR_ITEMS } from '../data/mockData';

interface SidebarProps {
  isOpen: boolean;
  activeItem: string;
  onSelectItem: (id: string) => void;
  onOpenAIAssistant: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  Home,
  Inbox,
  Building2,
  Activity,
  Cpu,
  ShieldCheck,
  Box,
  Users,
  FileCheck,
  AlertTriangle,
  BookOpen,
  Share2,
  Lock,
  Settings,
};

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  activeItem,
  onSelectItem,
  onOpenAIAssistant,
}) => {
  return (
    <aside
      className={`fixed lg:static top-14 left-0 h-[calc(100vh-3.5rem-2rem)] z-30 transition-all duration-200 ease-in-out flex flex-col justify-between bg-[#0b1426] border-r border-slate-800/80 select-none ${
        isOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-16'
      }`}
    >
      {/* Navigation Links */}
      <div className="py-2 overflow-y-auto overflow-x-hidden flex-1 scrollbar-thin scrollbar-thumb-slate-700">
        <ul className="space-y-0.5 px-2">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = iconMap[item.icon] || Home;
            const isActive = activeItem === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onSelectItem(item.id)}
                  title={item.label}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all group relative ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span
                    className={`truncate transition-opacity duration-200 ${
                      isOpen ? 'opacity-100' : 'lg:opacity-0 lg:w-0'
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Badge if present */}
                  {item.badge !== undefined && (
                    <span
                      className={`ml-auto shrink-0 px-1.5 py-0.2 text-[10px] font-bold rounded-full text-white ${
                        item.badgeColor || 'bg-red-500'
                      } ${!isOpen ? 'lg:absolute lg:top-1 lg:right-1' : ''}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom AI Assistant Widget */}
      <div className="p-3 border-t border-slate-800/80 bg-[#081020]/90">
        <button
          onClick={onOpenAIAssistant}
          className="w-full text-left bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-blue-950/70 border border-blue-500/40 hover:border-blue-400 p-2.5 rounded-lg shadow-lg shadow-blue-950/40 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center gap-3 group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/40 group-hover:bg-blue-500 transition-colors relative">
            <Bot className="w-5 h-5" />
            <Sparkles className="w-3 h-3 text-cyan-300 absolute -top-1 -right-1" />
          </div>

          {isOpen && (
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>AI Assistant</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[11px] text-blue-200/80 truncate">
                Ask anything about VOMS...
              </div>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
