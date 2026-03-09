import React from 'react';
import {
  Shield, Activity, BarChart3, Power, Wind, Box, Database, Network, Layers, GitMerge, Radio
} from 'lucide-react';
import DonutChart from '../components/DonutChart';

const FirewallDashboard = () => (
  <div className="flex flex-col gap-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
    {/* 상단 헤더 카드 (단지서버, 백본망과 통일) */}
    <div className="bg-white rounded-3xl p-8 flex flex-col lg:flex-row justify-between items-center shadow-sm border border-slate-100 gap-8">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg border-b-4 border-slate-700">
          <Shield className="w-10 h-10 text-[#f97316]" />
        </div>
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            AXGATE-GW-01
            <span className="text-xs font-black text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 uppercase tracking-widest">Gateway</span>
          </h3>
          <p className="text-sm text-slate-500 font-mono mt-2 flex items-center gap-3">
            <span className="font-bold text-slate-700">IP:</span> 192.168.10.1
            <span className="text-slate-300">|</span>
            <span className="font-bold text-slate-700">OS:</span> v3.0.1.2-GA
          </p>
        </div>
      </div>
      <div className="flex items-center gap-10">
        <div className="text-right">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Health Status</p>
          <div className="flex items-center gap-2 justify-end">
            <div className="w-2.5 h-2.5 bg-[#10b981] rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            <p className="text-2xl font-black text-[#10b981]">Active</p>
          </div>
        </div>
        <div className="h-12 w-px bg-slate-100"></div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Uptime</p>
          <p className="text-2xl font-bold text-slate-800 font-mono tracking-tight">38d 02h 26m</p>
        </div>
      </div>
    </div>

    {/* 시스템 물리 상태 (하드웨어 이미지 복구) */}
    <div className="bg-slate-800 rounded-[24px] shadow-xl border border-slate-700 p-8 flex flex-col items-center relative overflow-hidden group">
      <div className="flex justify-between w-full mb-6 px-2">
        <span className="text-[#f97316] font-black tracking-widest text-lg">AX<span className="text-slate-400">GATE</span> NGFW PANEL</span>
        <div className="flex gap-2">
          <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20 uppercase">
            <Power className="w-3.5 h-3.5" /> Active
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20 uppercase">
            <Wind className="w-3.5 h-3.5" /> Fan OK
          </span>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-slate-900 rounded-xl shadow-2xl p-6 border-b-8 border-black relative">
        <div className="flex justify-between items-start mb-10">
          <div className="flex flex-col">
            <span className="text-[#f97316] font-black tracking-tighter text-2xl">AX<span className="text-slate-100">GATE</span></span>
            <span className="text-[9px] text-slate-400 font-black tracking-widest uppercase">NGFW Series</span>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono font-bold text-slate-500">NF-400-GVX</p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="w-44 h-16 bg-blue-900 rounded border-2 border-blue-800 p-2 flex flex-col justify-between shadow-inner">
            <div className="flex justify-between text-blue-300 text-[9px] font-mono">
              <span>AXGATE OS 3.0</span>
              <span className="animate-pulse">●</span>
            </div>
            <div className="text-white text-[10px] font-mono font-bold">UP: 38d 02h 26m</div>
          </div>
          <div className="flex-1 bg-slate-800 p-4 rounded-lg flex justify-center gap-6 border border-slate-700">
            <div className="grid grid-cols-4 gap-2">
              {[1,2,3,4,5,6,7,8].map(p => (
                <div key={p} className="w-6 h-6 bg-slate-900 rounded-sm border border-slate-700 flex flex-col items-center justify-between p-0.5">
                  <div className="w-full h-1 bg-black/50 rounded-sm"></div>
                  <div className={`w-full h-1 rounded-sm ${p <= 3 ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : 'bg-slate-700'}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* 메인 리소스 및 트래픽 영역 */}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* 리소스 사용률 */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col overflow-hidden h-[340px]">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center">
          <h3 className="font-bold text-slate-800 text-[17px] flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-blue-500" strokeWidth={2.5} /> 방화벽 시스템 리소스
          </h3>
        </div>
        <div className="flex-1 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          <DonutChart value={42} label="CPU" colorClass="text-blue-600" strokeColor="#3b82f6" />
          <DonutChart value={64} label="MEMORY" colorClass="text-emerald-600" strokeColor="#10b981" />
          <DonutChart value={55} label="FLASH" colorClass="text-yellow-500" strokeColor="#eab308" />
          <DonutChart value={28} label="HDD" colorClass="text-red-500" strokeColor="#ef4444" />
        </div>
      </div>

      {/* 실시간 방화벽 트래픽 */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col overflow-hidden h-[340px]">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-[17px] flex items-center gap-2.5">
            <BarChart3 className="w-5 h-5 text-indigo-500" strokeWidth={2.5} /> 방화벽 통과 트래픽
          </h3>
          <div className="flex gap-4 text-[10px] font-bold text-slate-500">
            <span className="flex items-center gap-1.5"><div className="w-2.5 h-1 bg-[#10b981] rounded-full"></div> Pass (Rx)</span>
            <span className="flex items-center gap-1.5"><div className="w-2.5 h-1 bg-[#f97316] rounded-full"></div> Block (Tx)</span>
          </div>
        </div>
        <div className="flex-1 p-8 flex flex-col justify-end">
          <div className="flex justify-between items-end mb-6 pl-2">
            <div>
              <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-1">Peak Throughput</p>
              <p className="text-3xl font-black text-indigo-600 font-mono">842.5 <span className="text-sm text-slate-400 font-medium">Mbps</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-500 mb-1">차단 트래픽 비율</p>
              <span className="px-2.5 py-1 bg-rose-50 text-rose-600 rounded-md text-xs font-bold border border-rose-100">15.4%</span>
            </div>
          </div>
          <div className="w-full h-32 relative border-b border-l border-slate-100 pl-1 pb-1 overflow-hidden flex items-end">
            <svg viewBox="0 0 200 40" className="w-[200%] h-full preserve-3d animate-traffic" preserveAspectRatio="none">
              <polyline points="0,35 10,30 20,38 30,25 40,32 50,20 60,28 70,15 80,24 90,10 100,35 110,30 120,38 130,25 140,32 150,20 160,28 170,15 180,24 190,10 200,35" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="0,38 10,35 20,39 30,32 40,36 50,30 60,34 70,28 80,32 90,25 100,38 110,35 120,39 130,32 140,36 150,30 160,34 170,28 180,32 190,25 200,38" fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    {/* 하단 3단 상세 정보 */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 1. 상세 정보 */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col overflow-hidden h-[380px]">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center">
          <h3 className="font-bold text-slate-800 text-[17px] flex items-center gap-2.5">
            <Box className="w-5 h-5 text-slate-500" strokeWidth={2.5} /> 하드웨어 제원
          </h3>
        </div>
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-5">
          {[
            { label: '제품 모델', value: 'AXGATE-NF-400' },
            { label: '시리얼', value: 'GVXN004002530002' },
            { label: 'OS 버전', value: '3.0.1.2-GA' },
            { label: '호스트명', value: 'AXGATE_GW_01' },
            { label: 'CPU', value: 'Intel(R) N97' },
            { label: '부팅 일시', value: '2026-01-05 09:53' },
            { label: 'FAN 상태', value: 'Normal (2300 RPM)' }
          ].map((info, i) => (
            <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-2 last:border-0 last:pb-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{info.label}</span>
              <span className="text-[13px] font-black text-slate-700 font-mono">{info.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 데몬 상태 */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col overflow-hidden h-[380px]">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center">
          <h3 className="font-bold text-slate-800 text-[17px] flex items-center gap-2.5">
            <Database className="w-5 h-5 text-emerald-500" strokeWidth={2.5} /> 코어 데몬 상태
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          <table className="w-full text-left">
            <thead className="bg-white sticky top-0">
              <tr>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Daemon</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {['ospfd', 'ospf6d', 'pimd', 'pim6d', 'sslvpnd', 'https-proxyd', 'ntpd', 'snmpd'].map((d, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-3.5 text-[13px] font-bold text-slate-700 font-mono">{d}</td>
                  <td className="px-6 py-3.5 text-right">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> RUNNING
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. 인터페이스 상태 (신규 추가) */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col overflow-hidden h-[380px]">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center">
          <h3 className="font-bold text-slate-800 text-[17px] flex items-center gap-2.5">
            <Network className="w-5 h-5 text-purple-500" strokeWidth={2.5} /> 포트 인터페이스
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          <table className="w-full text-left">
            <thead className="bg-white sticky top-0">
              <tr>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Port</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { name: 'eth0', type: 'WAN', up: true },
                { name: 'eth1', type: 'LAN', up: true },
                { name: 'eth2', type: 'DMZ', up: true },
                { name: 'eth3', type: 'HA', up: false },
                { name: 'mgmt', type: 'MGMT', up: true }
              ].map((iface, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 text-[13px] font-bold text-slate-700 font-mono">{iface.name}</td>
                  <td className="px-6 py-4 text-[11px] font-bold text-slate-500">{iface.type}</td>
                  <td className="px-6 py-4 text-right">
                    {iface.up ? (
                      <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">UP</span>
                    ) : (
                      <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">DOWN</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default FirewallDashboard;
