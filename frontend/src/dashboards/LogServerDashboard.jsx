import React from 'react';
import {
  Archive, Key, HardDrive, Activity, Server, BarChart3, Network, Cpu, Database
} from 'lucide-react';

const LogServerDashboard = ({ isMounted }) => (
  <div className="flex flex-col gap-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
    {/* 상단 장비 및 라이선스 정보 카드 */}
    <div className="bg-white rounded-3xl p-8 flex flex-col lg:flex-row justify-between items-center shadow-sm border border-slate-200/60 gap-8 relative overflow-hidden group">
      <div className="absolute right-0 top-0 opacity-[0.03] pointer-events-none transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-700 text-slate-400">
        <Archive size={300} />
      </div>

      <div className="flex items-center gap-6 relative z-10">
        <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg border-b-4 border-slate-700">
          <Archive className="w-10 h-10 text-[#f97316]" />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">AXGATE-TMS-8000</h3>
            <span className="text-[10px] font-black text-[#f97316] bg-orange-50 px-2 py-1 rounded border border-orange-200 uppercase tracking-widest">Appliance</span>
          </div>
          <p className="text-sm text-slate-400 mt-1 flex items-center gap-3">
            <span className="font-bold text-slate-600">Role:</span> 통합 보안 로그 서버 (Threat Management System)
            <span className="text-slate-300">|</span>
            <span className="font-bold text-slate-600">IP:</span> 192.168.10.250
          </p>
        </div>
      </div>

      <div className="flex items-center gap-8 relative z-10">
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-4">
          <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-600">
            <Key size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-0.5">Software License</p>
            <p className="text-lg font-black text-emerald-600 leading-none">HW 인증 완료</p>
          </div>
        </div>
        <div className="h-12 w-px bg-slate-200"></div>
        <div className="text-right pr-4">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">System Status</p>
          <div className="flex items-center gap-2 justify-end">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
            <p className="text-2xl font-black text-slate-800">Active</p>
          </div>
        </div>
      </div>
    </div>

    {/* 로그 스토리지 상세 현황 */}
    <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white">
        <h3 className="font-bold text-slate-800 text-[17px] flex items-center gap-2.5">
          <HardDrive className="w-5 h-5 text-indigo-500" strokeWidth={2.5} /> 로그 스토리지 관리 (RAID 5)
        </h3>
        <span className="text-xs font-bold text-slate-400">총 가용 용량: <span className="text-slate-700 font-black">24 TB</span></span>
      </div>
      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Active Log Storage */}
        <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl shadow-inner">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Logs</p>
              <h4 className="text-2xl font-black text-slate-800">8.4 <span className="text-sm text-slate-500">TB</span></h4>
            </div>
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl"><Activity size={20}/></div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-indigo-600">70% 사용중</span>
              <span className="text-slate-400">12 TB 할당</span>
            </div>
            <div className="w-full bg-[#e2e8f0] rounded-full h-2 overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: isMounted ? '70%' : '0%' }}></div>
            </div>
            <p className="text-[10px] text-slate-400 text-right mt-1">최근 3개월 데이터 보관</p>
          </div>
        </div>

        {/* Archive Storage */}
        <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl shadow-inner">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">Archive</p>
              <h4 className="text-2xl font-black text-slate-800">4.2 <span className="text-sm text-slate-500">TB</span></h4>
            </div>
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl"><Archive size={20}/></div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-emerald-600">42% 사용중</span>
              <span className="text-slate-400">10 TB 할당</span>
            </div>
            <div className="w-full bg-[#e2e8f0] rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: isMounted ? '42%' : '0%' }}></div>
            </div>
            <p className="text-[10px] text-slate-400 text-right mt-1">자동 압축 및 암호화 보관중</p>
          </div>
        </div>

        {/* System Storage */}
        <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl shadow-inner">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">System OS</p>
              <h4 className="text-2xl font-black text-slate-800">320 <span className="text-sm text-slate-500">GB</span></h4>
            </div>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><Server size={20}/></div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-blue-600">16% 사용중</span>
              <span className="text-slate-400">2 TB 할당</span>
            </div>
            <div className="w-full bg-[#e2e8f0] rounded-full h-2 overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: isMounted ? '16%' : '0%' }}></div>
            </div>
            <p className="text-[10px] text-slate-400 text-right mt-1">TMS 엔진 및 OS 영역</p>
          </div>
        </div>

      </div>
    </div>

    {/* 하단 지표: 실시간 로그 수집량 및 리소스 */}
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* EPS (Events Per Second) */}
      <div className="xl:col-span-2 bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col overflow-hidden min-h-[340px]">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-[17px] flex items-center gap-2.5">
            <BarChart3 className="w-5 h-5 text-[#f97316]" strokeWidth={2.5} /> 실시간 로그 수집량 (EPS)
          </h3>
          <span className="px-3 py-1 bg-orange-50 text-[#f97316] text-[11px] font-black rounded-lg border border-orange-100">
            Average: 2,540 EPS
          </span>
        </div>
        <div className="flex-1 p-8 flex flex-col justify-end relative">
          <div className="absolute inset-y-8 inset-x-8 flex flex-col justify-between pointer-events-none z-0">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 w-full">
                <span className="text-[10px] font-mono text-slate-300 w-8 text-right">{4000 - i * 1000}</span>
                <div className="flex-1 h-px border-t border-dashed border-slate-200"></div>
              </div>
            ))}
          </div>
          <div className="relative z-10 w-full h-full flex items-end justify-between gap-2 pl-12 pt-4">
            {Array.from({ length: 40 }).map((_, i) => {
              const val = Math.floor(Math.random() * 40) + 30; // 30~70%
              return (
                <div key={i} className="w-full bg-gradient-to-t from-orange-500 to-orange-300 rounded-t-sm hover:from-orange-400 hover:to-orange-200 transition-colors shadow-sm relative group cursor-crosshair" style={{ height: `${val}%` }}>
                  <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-[10px] p-2 rounded shadow-xl z-50 whitespace-nowrap pointer-events-none font-mono">
                    {(val * 40).toFixed(0)} EPS
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 수집 노드 분포 및 리소스 */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center">
          <h3 className="font-bold text-slate-800 text-[17px] flex items-center gap-2.5">
            <Network className="w-5 h-5 text-blue-500" strokeWidth={2.5} /> 소스별 수집 분포
          </h3>
        </div>
        <div className="flex-1 p-8 flex flex-col gap-5">
          {[
            { label: '게이트웨이 방화벽', percent: 45, count: '1.2k EPS', color: 'bg-blue-500' },
            { label: '망분리 단말 (VPN)', percent: 35, count: '850 EPS', color: 'bg-indigo-500' },
            { label: '단지 시스템 서버', percent: 15, count: '380 EPS', color: 'bg-emerald-500' },
            { label: '기타 네트워크 장비', percent: 5, count: '110 EPS', color: 'bg-slate-400' },
          ].map((src, i) => (
            <div key={i}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-slate-600">{src.label}</span>
                <span className="text-[10px] font-mono text-slate-400 font-bold">{src.count}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className={`${src.color} h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: isMounted ? `${src.percent}%` : '0%' }}></div>
              </div>
            </div>
          ))}

          <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cpu className="w-4 h-4 text-slate-400" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400">CPU Usage</span>
                <span className="text-sm font-black text-slate-700">18%</span>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-100"></div>
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4 text-slate-400" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400">RAM Usage</span>
                <span className="text-sm font-black text-slate-700">42%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default LogServerDashboard;
