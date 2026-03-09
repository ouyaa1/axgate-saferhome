import React from 'react';

const CircularProgress = ({ value, label, icon: Icon, colorClass, strokeColor }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-5 relative overflow-hidden shadow-sm flex flex-col items-center justify-center">
      <div className="flex items-center gap-2 w-full mb-2">
        <Icon size={16} className={colorClass} />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-slate-200"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={strokeColor}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-slate-800">{value}</span>
          <span className="text-[10px] font-bold text-slate-400">%</span>
        </div>
      </div>
    </div>
  );
};

export default CircularProgress;
