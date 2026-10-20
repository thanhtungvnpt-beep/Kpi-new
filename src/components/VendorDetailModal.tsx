import React from 'react';
import { X, Building2, MapPin, CheckCircle, AlertTriangle, Cpu } from 'lucide-react';
import { VENDOR_METRICS, PLANT_STATUS_LIST } from '../data/mockData';
import { VendorMetric } from '../types';

interface VendorDetailModalProps {
  vendorId: string | null;
  onClose: () => void;
}

export const VendorDetailModal: React.FC<VendorDetailModalProps> = ({
  vendorId,
  onClose,
}) => {
  if (!vendorId) return null;

  const vendor = VENDOR_METRICS.find((v) => v.id.toLowerCase() === vendorId.toLowerCase());
  const plant = PLANT_STATUS_LIST.find((p) => p.name.toLowerCase().includes(vendorId.toLowerCase()) || p.id === vendorId);

  if (!vendor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-5 py-4 bg-[#0c1527] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base tracking-tight">{vendor.vendor}</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    vendor.status === 'On Track'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                      : vendor.status === 'At Risk'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                  }`}
                >
                  {vendor.status}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{vendor.location}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 text-xs space-y-4">
          {/* Plant Photo if available */}
          {plant?.image && (
            <div className="relative h-32 rounded-lg overflow-hidden border border-slate-200">
              <img
                src={plant.image}
                alt={vendor.vendor}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-white text-xs font-semibold">
                  Tình trạng dây chuyền: {plant.lines} ({plant.status})
                </span>
              </div>
            </div>
          )}

          {/* Metric Grid */}
          <div>
            <h4 className="font-bold text-slate-800 mb-2">Chỉ số vận hành cốt lõi</h4>
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-[10px] text-slate-500 font-medium block">Production %</span>
                <span className="text-lg font-bold text-slate-900 tabular-nums">
                  {vendor.production}%
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-[10px] text-slate-500 font-medium block">On-Time %</span>
                <span className="text-lg font-bold text-slate-900 tabular-nums">
                  {vendor.onTime}%
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-[10px] text-slate-500 font-medium block">Quality %</span>
                <span className="text-lg font-bold text-emerald-600 tabular-nums">
                  {vendor.quality}%
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-[10px] text-slate-500 font-medium block">Equipment %</span>
                <span className="text-lg font-bold text-slate-900 tabular-nums">
                  {vendor.equipment}%
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-[10px] text-slate-500 font-medium block">Manpower %</span>
                <span className="text-lg font-bold text-slate-900 tabular-nums">
                  {vendor.manpower}%
                </span>
              </div>
              <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-200/80">
                <span className="text-[10px] text-blue-600 font-medium block">Overall Score</span>
                <span className="text-lg font-black text-blue-700 tabular-nums">
                  {vendor.score}/100
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
