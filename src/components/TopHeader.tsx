import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  User,
  X,
  CheckCircle2,
  Clock,
  Shield,
  LogOut,
} from 'lucide-react';
import { Language } from '../types';

interface TopHeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenNotifications?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentLang,
  onLanguageChange,
  onToggleSidebar,
  searchQuery,
  onSearchChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0c1527] text-white border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between gap-4 h-14">
      {/* Left: Brand Lockup */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-md transition-colors"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5 leading-none">
            <span className="font-extrabold text-lg tracking-tight text-white">VOMS</span>
            <span className="text-xs font-semibold text-sky-400">v9.0</span>
          </div>
          <span className="text-[10px] text-slate-400 leading-tight tracking-tight whitespace-nowrap hidden sm:block">
            Vendor Operation Management System
          </span>
        </div>
      </div>

      {/* Center: Search input */}
      <div className="flex-1 max-w-xl mx-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search anything... (e.g. vendor, work order, issue, part no...)"
            className="w-full pl-9 pr-8 py-1.5 bg-[#172239] text-xs text-slate-100 placeholder-slate-400 rounded-md border border-slate-700/60 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Language Switcher */}
        <div className="flex items-center bg-[#172239] p-0.5 rounded border border-slate-700/60 text-[11px] font-semibold">
          {(['VI', 'EN', 'KR'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageChange(lang)}
              className={`px-2 py-0.5 rounded transition-all ${
                currentLang === lang
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/40'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-md transition-colors"
            title="Notifications (12)"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1 rounded-full border border-[#0c1527] leading-tight min-w-[15px] text-center">
              12
            </span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#101b33] border border-slate-700 rounded-lg shadow-xl text-slate-200 z-50 p-3 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700 text-xs font-semibold">
                <span>Alerts & Notifications</span>
                <span className="text-[10px] text-blue-400 cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="mt-2 space-y-2 text-xs max-h-64 overflow-y-auto">
                <div className="p-2 bg-red-950/40 border border-red-800/40 rounded flex items-start gap-2">
                  <span className="text-red-400 font-bold shrink-0">●</span>
                  <div>
                    <p className="font-semibold text-red-200">KTECH: Machine Stop on Line 6</p>
                    <p className="text-[10px] text-slate-400">Downtime exceeded 35 mins · 12 mins ago</p>
                  </div>
                </div>
                <div className="p-2 bg-amber-950/40 border border-amber-800/40 rounded flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">●</span>
                  <div>
                    <p className="font-semibold text-amber-200">DREAM TECH: Material delivery delay</p>
                    <p className="text-[10px] text-slate-400">PCB substrates delayed by 4 hours · 34 mins ago</p>
                  </div>
                </div>
                <div className="p-2 bg-blue-950/40 border border-blue-800/40 rounded flex items-start gap-2">
                  <span className="text-blue-400 font-bold shrink-0">●</span>
                  <div>
                    <p className="font-semibold text-blue-200">New Approval: Purchase Chiller</p>
                    <p className="text-[10px] text-slate-400">Requested by KTECH Maintenance · 1 hr ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 hover:bg-slate-800/60 rounded-md transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-800 font-bold shrink-0">
              <User className="w-4 h-4 text-slate-700" />
            </div>
            <div className="text-left hidden md:block">
              <div className="flex items-center gap-1 text-xs font-semibold leading-tight text-white">
                <span>Admin</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <div className="text-[10px] text-slate-400 leading-none">Factory Manager</div>
            </div>
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#101b33] border border-slate-700 rounded-lg shadow-xl text-slate-200 z-50 p-2 text-xs space-y-1">
              <div className="px-2 py-1.5 border-b border-slate-700 font-medium">
                <p className="text-white font-semibold">Admin Account</p>
                <p className="text-[10px] text-slate-400">Factory Operations Hub</p>
              </div>
              <button className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-700/60 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>Security & Roles</span>
              </button>
              <button className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-700/60 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>System Health</span>
              </button>
              <button className="w-full text-left px-2 py-1.5 rounded hover:bg-red-950/60 text-red-300 flex items-center gap-2">
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Date / Timestamp */}
        <div className="hidden lg:flex flex-col text-right pl-2 border-l border-slate-700/70 text-[11px] leading-tight">
          <span className="text-slate-200 font-medium">Apr 25, 2025 14:32</span>
          <span className="text-slate-400 text-[10px]">Fri</span>
        </div>
      </div>
    </header>
  );
};
