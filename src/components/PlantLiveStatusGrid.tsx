import React from 'react';
import { Building, Factory } from 'lucide-react';
import { PLANT_STATUS_LIST } from '../data/mockData';
import { PlantStatus } from '../types';

interface PlantLiveStatusGridProps {
  onSelectPlant?: (plantId: string) => void;
}

export const PlantLiveStatusGrid: React.FC<PlantLiveStatusGridProps> = ({
  onSelectPlant,
}) => {
  const getStatusBadge = (status: PlantStatus['status'], color: PlantStatus['statusColor']) => {
    switch (color) {
      case 'green':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{status}</span>
          </span>
        );
      case 'amber':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>{status}</span>
          </span>
        );
      case 'red':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
            <span>{status}</span>
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
            <Building className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-xs font-bold text-slate-800">
            Plant Live Status (Images + Key Info)
          </h2>
        </div>
      </div>

      {/* 6 Plant Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 mt-2">
        {PLANT_STATUS_LIST.map((plant) => (
          <div
            key={plant.id}
            onClick={() => onSelectPlant?.(plant.id)}
            className="group cursor-pointer rounded-lg border border-slate-200 overflow-hidden hover:border-blue-400 hover:shadow-xs transition-all bg-white"
          >
            {/* Plant Image */}
            <div className="h-16 w-full bg-slate-100 relative overflow-hidden">
              <img
                src={plant.image}
                alt={plant.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  // Fallback container if needed
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
            </div>

            {/* Plant Info */}
            <div className="p-2">
              <h3 className="text-xs font-bold text-slate-900 truncate">
                {plant.name}
              </h3>

              <div className="mt-1 flex items-center">
                {getStatusBadge(plant.status, plant.statusColor)}
              </div>

              <div className="mt-1 text-[10px] text-slate-500 font-medium">
                {plant.lines}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
