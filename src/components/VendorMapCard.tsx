import React, { useState } from 'react';
import { Network, ArrowRight, MapPin } from 'lucide-react';
import { VENDOR_METRICS } from '../data/mockData';
import { VendorMetric } from '../types';

interface VendorMapCardProps {
  onSelectVendor?: (vendorId: string) => void;
}

export const VendorMapCard: React.FC<VendorMapCardProps> = ({ onSelectVendor }) => {
  const [selectedVendor, setSelectedVendor] = useState<VendorMetric | null>(null);

  // Vendor pins mapped to coordinates on an SVG map of Vietnam
  // Map dimensions: 320 x 220
  const vendorPins = [
    {
      id: 'khv',
      name: 'KHV',
      score: '92%',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      badgeBg: 'bg-emerald-50 border-emerald-300',
      x: 145,
      y: 40,
      labelPos: 'right',
    },
    {
      id: 'dreamtech',
      name: 'DREAM TECH',
      score: '88%',
      color: 'bg-amber-400',
      textColor: 'text-amber-700',
      badgeBg: 'bg-amber-50 border-amber-300',
      x: 172,
      y: 52,
      labelPos: 'right',
    },
    {
      id: 'hstec',
      name: 'HSTEC',
      score: '96%',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      badgeBg: 'bg-emerald-50 border-emerald-300',
      x: 135,
      y: 72,
      labelPos: 'right',
    },
    {
      id: 'ktech',
      name: 'KTECH',
      score: '85%',
      color: 'bg-amber-400',
      textColor: 'text-amber-700',
      badgeBg: 'bg-amber-50 border-amber-300',
      x: 180,
      y: 105,
      labelPos: 'right',
    },
    {
      id: 'hojeong_vina',
      name: 'HOJEONG VINA',
      score: '87%',
      color: 'bg-amber-400',
      textColor: 'text-amber-700',
      badgeBg: 'bg-amber-50 border-amber-300',
      x: 148,
      y: 165,
      labelPos: 'right',
    },
    {
      id: 'hojeongb',
      name: 'HOJEONGB',
      score: '90%',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      badgeBg: 'bg-emerald-50 border-emerald-300',
      x: 185,
      y: 152,
      labelPos: 'right',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center text-blue-600">
            <Network className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-xs font-bold text-slate-800">
            Vendor Performance Map
          </h2>
        </div>

        <button
          onClick={() => {}}
          className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Main Map + Summary Row */}
      <div className="grid grid-cols-12 gap-2 mt-2 items-center">
        {/* Map area (9 cols) */}
        <div className="col-span-9 relative bg-gradient-to-br from-sky-50/70 via-slate-50/50 to-blue-50/60 rounded-lg p-1 border border-slate-200/70 h-48 overflow-hidden select-none">
          {/* Subtle Map SVG silhouette */}
          <svg
            viewBox="0 0 280 200"
            className="w-full h-full object-contain pointer-events-none opacity-40"
          >
            {/* Ocean Waves / Grid */}
            <defs>
              <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="280" height="200" fill="url(#grid)" opacity="0.3" />

            {/* Stylized Vietnam / Indochina Coastline */}
            <path
              d="M 60,10 Q 110,15 150,25 Q 180,35 160,50 Q 140,65 170,85 Q 200,105 180,130 Q 160,155 175,185 Q 160,195 130,190 Q 110,170 120,150 Q 100,120 70,100 Z"
              fill="#e2e8f0"
              stroke="#94a3b8"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
            {/* South China Sea text watermarked */}
            <text x="195" y="100" fill="#94a3b8" fontSize="8" fontWeight="600" opacity="0.4" letterSpacing="1">
              EAST SEA
            </text>
          </svg>

          {/* Map Legend inside map */}
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs border border-slate-200 rounded px-2 py-1 text-[9px] font-semibold text-slate-600 shadow-2xs space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>≥ 95%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-lime-500" />
              <span>90 – 95%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>85 – 90%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>&lt; 85%</span>
            </div>
          </div>

          {/* Interactive Vendor Pins */}
          {vendorPins.map((pin) => (
            <div
              key={pin.id}
              className="absolute group cursor-pointer transition-transform hover:scale-110"
              style={{ left: `${(pin.x / 280) * 100}%`, top: `${(pin.y / 200) * 100}%` }}
              onClick={() => onSelectVendor?.(pin.id)}
            >
              {/* Pin indicator */}
              <div className="flex items-center gap-1">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${pin.color} opacity-40`} />
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${pin.color} ring-2 ring-white shadow-xs`} />
                </span>

                {/* Badge text */}
                <div className={`px-1.5 py-0.5 rounded border text-[9px] font-bold shadow-2xs flex flex-col leading-none bg-white/95 ${pin.textColor}`}>
                  <span className="font-extrabold">{pin.name}</span>
                  <span className="text-[8px] opacity-80">{pin.score}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Metrics (3 cols) */}
        <div className="col-span-3 flex flex-col justify-between h-48 pl-2 border-l border-slate-100">
          <div>
            <span className="text-[10px] text-slate-500 font-medium block">Total Vendors</span>
            <span className="text-xl font-black text-slate-900 leading-tight">6</span>
          </div>

          <div className="space-y-2 mt-2">
            <div>
              <span className="text-[10px] text-slate-500 font-medium block">On Track</span>
              <span className="text-sm font-bold text-emerald-600">3</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-medium block">At Risk</span>
              <span className="text-sm font-bold text-amber-500">2</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-medium block">Critical</span>
              <span className="text-sm font-bold text-rose-600">1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
