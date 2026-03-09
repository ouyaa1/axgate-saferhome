import React from 'react';

const DonutChart = ({ value, label, colorClass, strokeColor }) => {
  const radius = 15.9155;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${value} ${100 - value}`;
  return (
    <div className="flex flex-col items-center group">
      <div className="relative w-20 h-20 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
          <path d={`M18 2.0845 a ${radius} ${radius} 0 0 1 0 ${circumference} a ${radius} ${radius} 0 0 1 0 -${circumference}`} fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
          <path d={`M18 2.0845 a ${radius} ${radius} 0 0 1 0 ${circumference} a ${radius} ${radius} 0 0 1 0 -${circumference}`} fill="none" stroke={strokeColor} strokeWidth="3.5" strokeDasharray={strokeDasharray} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-xl font-black font-mono ${colorClass}`}>{value}<span className="text-[10px]">%</span></span>
        </div>
      </div>
      <span className="text-sm font-bold text-slate-600 mt-3 group-hover:text-slate-900 transition-colors">{label}</span>
    </div>
  );
};

export default DonutChart;
