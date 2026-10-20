import React, { useState } from 'react';
import { Search, Maximize2, Minimize2, Check, ChevronDown } from 'lucide-react';

interface BottomStatusBarProps {
  onFixZoom?: () => void;
}

export const BottomStatusBar: React.FC<BottomStatusBarProps> = ({ onFixZoom }) => {
  const [zoomLevel, setZoomLevel] = useState('100%');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-8 bg-[#0b1426] text-slate-300 text-[11px] px-4 flex items-center justify-between border-t border-slate-800/80 z-30 select-none">
      {/* Left items */}
      <div className="flex items-center gap-4">
        <span className="font-bold text-white tracking-wide">VOMS v9.0</span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-300 font-medium hidden sm:inline">
          Executive Control Tower
        </span>
        <span className="text-slate-600 hidden sm:inline">|</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-200 font-medium">Connected to GMES</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        <button className="text-slate-400 hover:text-white p-0.5">
          <Search className="w-3.5 h-3.5" />
        </button>

        {/* Zoom Level Select */}
        <div className="flex items-center gap-1 text-slate-400 hover:text-slate-200 cursor-pointer">
          <span>{zoomLevel}</span>
          <ChevronDown className="w-3 h-3" />
        </div>

        {/* FIX 100% Button */}
        <button
          onClick={() => {
            setZoomLevel('100%');
            onFixZoom?.();
          }}
          className="px-2 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold tracking-wide transition-colors cursor-pointer"
        >
          FIX 100%
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="text-slate-400 hover:text-white p-0.5 transition-colors"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? (
            <Minimize2 className="w-3.5 h-3.5" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5" />
          )}
        </button>

        <span className="text-slate-600 hidden md:inline">|</span>

        {/* Tagline */}
        <span className="text-slate-400 font-medium tracking-tight hidden md:inline">
          HSTEC – Together for a Smarter Future
        </span>
      </div>
    </footer>
  );
};
