import React from 'react';

const AxgateLogo = ({ onClick }) => (
  <div
    className={`flex flex-col select-none ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : 'cursor-default'}`}
    onClick={onClick}
  >
    <div className="flex items-center text-[38px] leading-none font-black tracking-tight text-slate-900" style={{ fontFamily: 'sans-serif' }}>
      AX<span className="text-[#f97316]">GATE</span>
    </div>
    <span className="text-[#f97316] text-[11px] font-bold tracking-[0.2em] mt-1 text-right w-full pr-1 opacity-90">
      SECURITY & BEYOND
    </span>
  </div>
);

export default AxgateLogo;
