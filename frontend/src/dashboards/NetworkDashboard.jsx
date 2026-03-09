import React from 'react';
import { Network, Thermometer, Zap, Activity, Layers, GitMerge, Radio } from 'lucide-react';

const NetworkDashboard = () => (
  <div className="flex flex-col gap-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
    <div className="bg-white rounded-3xl p-8 flex flex-col lg:flex-row justify-between items-center shadow-sm border border-slate-100 gap-8">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg border-b-4 border-slate-700 relative overflow-hidden">
          <Network className="w-10 h-10 text-[#f97316] relative z-10" />
        </div>
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            AX-CORE-SW01
            <span className="text-xs font-black text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100 uppercase tracking-widest">Backbone</span>
          </h3>
          <p className="text-sm text-slate-500 font-mono mt-2 flex items-center gap-3">
            <span className="font-bold text-slate-700">IP:</span> 192.168.10.254
            <span className="text-slate-300">|</span>
            <span className="font-bold text-slate-700">Model:</span> AX-SW-9600X
          </p>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-end">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Temperature</p>
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-[#10b981]" />
            <p className="text-xl font-bold text-slate-800 font-mono">32°C</p>
          </div>
        </div>
        <div className="h-8 w-px bg-slate-100"></div>
        <div className="flex flex-col items-end">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Power (PSU)</p>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#f97316]" />
            <p className="text-xl font-bold text-slate-800 font-mono">Dual OK</p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-slate-800 rounded-[24px] shadow-xl border border-slate-700 p-8 flex flex-col items-center relative overflow-hidden group">
      <div className="flex justify-between w-full mb-6 px-2">
        <span className="text-[#f97316] font-black tracking-widest text-lg">AX<span className="text-slate-400">GATE</span> SWITCH PANEL</span>
      </div>
      <div className="flex gap-8 items-center bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 shadow-inner">
        <div className="grid grid-cols-12 gap-x-2 gap-y-3">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className={`w-8 h-6 rounded border ${[0,2,4,23].includes(i) ? 'bg-[#10b981]/20 border-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-slate-800 border-slate-600'} flex items-center justify-center transition-all cursor-pointer hover:bg-slate-700`}>
                <span className="text-[8px] font-mono text-slate-500">{i*2 + 1}</span>
              </div>
              <div className={`w-8 h-6 rounded border ${[5,10,20].includes(i) ? 'bg-[#10b981]/20 border-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-slate-800 border-slate-600'} flex items-center justify-center transition-all cursor-pointer hover:bg-slate-700`}>
                <span className="text-[8px] font-mono text-slate-500">{i*2 + 2}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="h-16 w-px bg-slate-700"></div>
        <div className="grid grid-cols-2 gap-2">
           {[1,2,3,4].map((p) => (
             <div key={p} className={`w-10 h-7 rounded border ${p <= 2 ? 'bg-[#3b82f6]/20 border-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.3)]' : 'bg-slate-800 border-slate-600'} flex items-center justify-center relative cursor-pointer`}>
               <span className="text-[8px] font-bold text-slate-400">SFP{p}</span>
             </div>
           ))}
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2 bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col overflow-hidden min-h-[400px]">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-[17px] flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-blue-500" strokeWidth={2.5} /> 백본 스위칭 트래픽
          </h3>
          <div className="flex gap-4 text-[11px] font-bold text-slate-500">
            <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-blue-500 rounded-sm"></div> Inbound</span>
            <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-purple-500 rounded-sm"></div> Outbound</span>
          </div>
        </div>
        <div className="flex-1 p-8 relative flex flex-col justify-end">
          <div className="absolute inset-y-8 inset-x-8 flex flex-col justify-between pointer-events-none z-0">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 w-full">
                <span className="text-[9px] font-mono text-slate-300 w-6 text-right">{100 - i * 25}%</span>
                <div className="flex-1 h-px border-t border-dashed border-slate-200"></div>
              </div>
            ))}
          </div>
          <div className="relative z-10 w-full h-full flex items-end justify-between gap-1.5 pl-10">
            {Array.from({ length: 30 }).map((_, i) => {
              const inVal = Math.floor(Math.random() * 40) + 40;
              const outVal = Math.floor(Math.random() * 30) + 10;
              return (
                <div key={i} className="flex gap-[2px] w-full h-full items-end group relative cursor-crosshair">
                  <div className="w-1/2 bg-blue-500 rounded-t-sm hover:bg-blue-400 transition-colors shadow-sm" style={{ height: `${inVal}%` }}></div>
                  <div className="w-1/2 bg-purple-500 rounded-t-sm hover:bg-purple-400 transition-colors shadow-sm" style={{ height: `${outVal}%` }}></div>
                  <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-[10px] p-2 rounded shadow-xl z-50 whitespace-nowrap pointer-events-none">
                    <div className="font-bold mb-1 border-b border-slate-700 pb-1 text-slate-300">10:4{i % 10} AM</div>
                    <div className="flex gap-3">
                      <span className="text-blue-400">In: {inVal * 12} Mbps</span>
                      <span className="text-purple-400">Out: {outVal * 12} Mbps</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center">
          <h3 className="font-bold text-slate-800 text-[17px] flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#f97316]" strokeWidth={2.5} /> 네트워크 테이블 현황
          </h3>
        </div>
        <div className="flex-1 p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm text-indigo-500"><GitMerge className="w-6 h-6" /></div>
              <div><p className="text-[11px] font-bold text-slate-400 uppercase">Active VLANs</p><p className="text-xl font-black text-slate-800">12 ea</p></div>
            </div>
            <div className="h-8 w-8 rounded-full border-2 border-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-500 bg-white">OK</div>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm text-emerald-500"><Radio className="w-6 h-6" /></div>
              <div><p className="text-[11px] font-bold text-slate-400 uppercase">ARP Entries</p><p className="text-xl font-black text-slate-800">2,451 ea</p></div>
            </div>
            <div className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded">Stable</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default NetworkDashboard;
