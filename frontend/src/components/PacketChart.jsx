import React from 'react';

const PacketChart = ({ data }) => {
  const numericData = data.map(Number);
  const max = Math.max(...numericData, 100);
  const points = numericData.map((val, i) => `${(i / (numericData.length - 1)) * 100},${100 - (val / max) * 100}`).join(' ');
  const currentVal = numericData[numericData.length - 1].toFixed(1);

  return (
    <div className="w-full h-32 bg-slate-900 rounded-2xl p-0 relative overflow-hidden border border-slate-800 shadow-inner group">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      <div className="absolute top-3 left-4 flex items-center gap-2 z-10">
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]" />
        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest font-sans">실시간 트래픽 현황</span>
      </div>
      <div className="absolute bottom-3 right-4 z-10 text-right">
        <div className="text-2xl font-bold text-white font-mono leading-none">{currentVal} <span className="text-xs text-slate-400">Mbps</span></div>
      </div>
      <svg className="w-full h-full relative z-0 transform scale-x-105 scale-y-75 translate-y-4" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M 0 100 L ${points} L 100 100 Z`} fill="url(#gradient)" />
        <polyline fill="none" stroke="#60a5fa" strokeWidth="2" points={points} className="drop-shadow-lg" />
      </svg>
    </div>
  );
};

export default PacketChart;
