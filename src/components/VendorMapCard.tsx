import React, { useState } from 'react';
import { Network, ArrowRight } from 'lucide-react';
import { VENDOR_METRICS } from '../data/mockData';
import { VendorMetric } from '../types';

interface VendorMapCardProps {
  onSelectVendor?: (vendorId: string) => void;
}

export const VendorMapCard: React.FC<VendorMapCardProps> = ({ onSelectVendor }) => {
  const [hoveredVendor, setHoveredVendor] = useState<string | null>(null);

  // Vendor pins positioned accurately on Vietnam's geography
  // viewBox: 420 x 260
  const vendorPins = [
    {
      id: 'khv',
      name: 'KHV',
      score: '92%',
      color: '#10b981', // green (92% - on track / high)
      ringColor: '#d1fae5',
      labelColor: '#047857',
      cx: 142,
      cy: 48,
      labelX: 156,
      labelY: 40,
      labelWidth: 54,
      labelHeight: 22,
    },
    {
      id: 'dreamtech',
      name: 'DREAM TECH',
      score: '88%',
      color: '#f59e0b', // amber (88%)
      ringColor: '#fef3c7',
      labelColor: '#b45309',
      cx: 174,
      cy: 62,
      labelX: 188,
      labelY: 52,
      labelWidth: 72,
      labelHeight: 22,
    },
    {
      id: 'hstec',
      name: 'HSTEC',
      score: '96%',
      color: '#10b981', // green (96%)
      ringColor: '#d1fae5',
      labelColor: '#047857',
      cx: 128,
      cy: 76,
      labelX: 142,
      labelY: 66,
      labelWidth: 58,
      labelHeight: 22,
    },
    {
      id: 'ktech',
      name: 'KTECH',
      score: '85%',
      color: '#eab308', // yellow/amber (85%)
      ringColor: '#fef9c3',
      labelColor: '#a16207',
      cx: 184,
      cy: 126,
      labelX: 198,
      labelY: 116,
      labelWidth: 56,
      labelHeight: 22,
    },
    {
      id: 'hojeong_vina',
      name: 'HOJEONG VINA',
      score: '87%',
      color: '#f59e0b', // amber (87%)
      ringColor: '#fef3c7',
      labelColor: '#b45309',
      cx: 146,
      cy: 194,
      labelX: 158,
      labelY: 184,
      labelWidth: 78,
      labelHeight: 22,
    },
    {
      id: 'hojeongb',
      name: 'HOJEONGB',
      score: '90%',
      color: '#10b981', // green (90%)
      ringColor: '#d1fae5',
      labelColor: '#047857',
      cx: 202,
      cy: 182,
      labelX: 214,
      labelY: 172,
      labelWidth: 68,
      labelHeight: 22,
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
          onClick={() => onSelectVendor?.('all')}
          className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Main Map + Summary Row */}
      <div className="grid grid-cols-12 gap-2 mt-2 items-center flex-1">
        {/* Map area (9 cols on desktop) */}
        <div className="col-span-12 sm:col-span-9 relative bg-gradient-to-br from-[#edf4fa] via-[#f1f6fb] to-[#e8f1f9] rounded-lg p-0.5 border border-slate-200/80 h-52 overflow-hidden select-none shadow-2xs">
          {/* Authentic Geographic Vietnam Map SVG */}
          <svg
            viewBox="0 0 420 260"
            className="w-full h-full object-contain"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Subtle map ocean grid */}
              <pattern id="seaGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#dbe7f2" strokeWidth="0.6" />
              </pattern>

              {/* Vietnam territory drop shadow */}
              <filter id="mapShadow" x="-5%" y="-5%" width="115%" height="115%">
                <feDropShadow dx="1.5" dy="2" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.12" />
              </filter>
            </defs>

            {/* Sea Grid Background */}
            <rect width="420" height="260" fill="url(#seaGrid)" />

            {/* Neighboring Landmass (Laos, Cambodia, southern China) */}
            <path
              d="M 20,5 Q 60,8 100,6 L 140,8 L 135,26 L 102,28 L 78,56 L 68,90 L 80,126 L 98,154 L 118,172 L 110,198 L 88,212 L 60,205 L 42,168 L 32,120 L 22,60 Z"
              fill="#e2e8f0"
              stroke="#cbd5e1"
              strokeWidth="0.8"
              opacity="0.85"
            />

            {/* Vietnam National Boundary (Authentic S-Shape Geography) */}
            {/* Starts from North-West (Lai Chau/Lao Cai), North (Ha Giang), North-East (Lang Son, Quang Ninh), down Central Coast, Mekong Delta, and Western Borders */}
            <path
              filter="url(#mapShadow)"
              d="M 68,34 
                 C 82,22 108,12 128,14 
                 C 142,15 156,22 170,24 
                 C 184,26 195,36 196,48 
                 C 192,56 182,58 174,62 
                 C 166,66 160,74 158,84 
                 C 156,96 164,106 172,116 
                 C 180,126 192,132 196,142 
                 C 202,154 198,168 186,180 
                 C 176,190 162,198 152,208 
                 C 144,216 136,228 126,236 
                 C 118,242 106,244 100,238 
                 C 94,232 98,222 104,214 
                 C 110,206 116,196 122,188 
                 C 126,182 120,174 116,168 
                 C 112,162 108,154 106,144 
                 C 104,134 94,124 90,114 
                 C 86,104 80,94 76,82 
                 C 72,70 66,56 64,44 Z"
              fill="#ffffff"
              stroke="#475569"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />

            {/* Gulf of Tonkin Watermark */}
            <text x="194" y="80" fill="#94a3b8" fontSize="7.5" fontWeight="600" opacity="0.6" letterSpacing="0.8">
              VỊNH BẮC BỘ
            </text>

            {/* East Sea / Biển Đông Watermark */}
            <text x="210" y="145" fill="#64748b" fontSize="8.5" fontWeight="700" opacity="0.5" letterSpacing="1.2">
              EAST SEA (BIỂN ĐÔNG)
            </text>

            {/* Gulf of Thailand Watermark */}
            <text x="44" y="235" fill="#94a3b8" fontSize="7" fontWeight="600" opacity="0.55" letterSpacing="0.5">
              VỊNH THÁI LAN
            </text>

            {/* Islands: Phu Quoc & Con Dao */}
            <ellipse cx="86" cy="224" rx="4" ry="7" fill="#ffffff" stroke="#475569" strokeWidth="1" />
            <ellipse cx="140" cy="242" rx="3" ry="2" fill="#ffffff" stroke="#475569" strokeWidth="0.8" />

            {/* Paracel Islands (Quần đảo Hoàng Sa) representation */}
            <g opacity="0.65">
              <circle cx="280" cy="112" r="1.5" fill="#64748b" />
              <circle cx="288" cy="118" r="1.5" fill="#64748b" />
              <circle cx="276" cy="122" r="1.5" fill="#64748b" />
              <text x="264" y="132" fill="#94a3b8" fontSize="6.5" fontWeight="600">Q.Đ Hoàng Sa</text>
            </g>

            {/* Spratly Islands (Quần đảo Trường Sa) representation */}
            <g opacity="0.65">
              <circle cx="272" cy="198" r="1.5" fill="#64748b" />
              <circle cx="282" cy="204" r="1.5" fill="#64748b" />
              <circle cx="290" cy="216" r="1.5" fill="#64748b" />
              <text x="268" y="226" fill="#94a3b8" fontSize="6.5" fontWeight="600">Q.Đ Trường Sa</text>
            </g>

            {/* Legend (Top-Right of Map) matching original design */}
            <g transform="translate(295, 12)">
              <rect
                x="0"
                y="0"
                width="112"
                height="62"
                rx="6"
                fill="#ffffff"
                fillOpacity="0.94"
                stroke="#cbd5e1"
                strokeWidth="1"
              />
              {/* Legend Items */}
              <circle cx="16" cy="14" r="4.5" fill="#10b981" />
              <text x="28" y="17" fill="#334155" fontSize="9.5" fontWeight="600">≥ 95%</text>

              <circle cx="16" cy="28" r="4.5" fill="#84cc16" />
              <text x="28" y="31" fill="#334155" fontSize="9.5" fontWeight="600">90 – 95%</text>

              <circle cx="16" cy="42" r="4.5" fill="#f59e0b" />
              <text x="28" y="45" fill="#334155" fontSize="9.5" fontWeight="600">85 – 90%</text>

              <circle cx="16" cy="54" r="4.5" fill="#ef4444" />
              <text x="28" y="57" fill="#334155" fontSize="9.5" fontWeight="600">&lt; 85%</text>
            </g>

            {/* Vendor Pins & Labels (Rendered inside SVG for 100% stable positioning across all viewports) */}
            {vendorPins.map((pin) => {
              const isHovered = hoveredVendor === pin.id;

              return (
                <g
                  key={pin.id}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredVendor(pin.id)}
                  onMouseLeave={() => setHoveredVendor(null)}
                  onClick={() => onSelectVendor?.(pin.id)}
                >
                  {/* Outer pulse wave */}
                  <circle
                    cx={pin.cx}
                    cy={pin.cy}
                    r={isHovered ? 11 : 7}
                    fill={pin.ringColor}
                    opacity="0.85"
                  />

                  {/* Pin Circle */}
                  <circle
                    cx={pin.cx}
                    cy={pin.cy}
                    r={isHovered ? 5.5 : 4.5}
                    fill={pin.color}
                    stroke="#ffffff"
                    strokeWidth="1.8"
                  />

                  {/* Connecting indicator line to label */}
                  <line
                    x1={pin.cx}
                    y1={pin.cy}
                    x2={pin.labelX}
                    y2={pin.labelY + pin.labelHeight / 2}
                    stroke={pin.color}
                    strokeWidth="1.2"
                    strokeDasharray="1.5 1.5"
                    opacity="0.75"
                  />

                  {/* Vendor Label Card */}
                  <g transform={`translate(${pin.labelX}, ${pin.labelY})`}>
                    {/* Badge Background */}
                    <rect
                      x="0"
                      y="0"
                      width={pin.labelWidth}
                      height={pin.labelHeight}
                      rx="4"
                      fill="#ffffff"
                      fillOpacity="0.96"
                      stroke={pin.color}
                      strokeWidth={isHovered ? 1.6 : 1}
                      filter="drop-shadow(0 1px 2px rgba(0,0,0,0.08))"
                    />

                    {/* Vendor Name */}
                    <text
                      x="6"
                      y="11"
                      fill="#0f172a"
                      fontSize="8"
                      fontWeight="800"
                      letterSpacing="0.2"
                    >
                      {pin.name}
                    </text>

                    {/* Score Value */}
                    <text
                      x="6"
                      y="19"
                      fill={pin.labelColor}
                      fontSize="7.5"
                      fontWeight="700"
                    >
                      {pin.score}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Summary Metrics (3 cols on desktop) */}
        <div className="col-span-12 sm:col-span-3 flex sm:flex-col justify-between h-auto sm:h-52 pl-0 sm:pl-3 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-100">
          <div>
            <span className="text-[10px] text-slate-500 font-medium block">Total Vendors</span>
            <span className="text-2xl font-black text-slate-900 leading-tight">6</span>
          </div>

          <div className="flex sm:flex-col gap-4 sm:gap-2.5">
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
