import React, { useState } from 'react';
import {
  Server, Activity, Cpu, HardDrive, Network, ShieldCheck, Sparkles,
  CheckCircle2, Box, Search, X, ListFilter, RefreshCw, ArrowRight
} from 'lucide-react';

const ServerDashboard = ({ isMounted }) => {
  const [showSoftwareModal, setShowSoftwareModal] = useState(false);
  const [softwareSearchTerm, setSoftwareSearchTerm] = useState('');

  // 진단 항목 데이터 정의 및 이슈(isGood: false) 항목만 필터링
  const svCheckItems = [
    { id: 'SV-01', name: '불필요한 계정 비활성화', status: '양호', isGood: true },
    { id: 'SV-17', name: '/etc/passwd 파일 권한 검사', status: '양호', isGood: true },
    { id: 'SV-28', name: '불필요한 서비스 비활성화', status: '취약 (FTP)', isGood: false },
    { id: 'SV-31', name: '원격 접속 터미널 보안 설정', status: '취약 (SSH Root)', isGood: false },
    { id: 'SV-36', name: '악성코드 탐지(백신) 점검', status: '양호', isGood: true },
    { id: 'SV-40', name: '데이터베이스 백업 상태', status: '양호', isGood: true },
  ];
  const issueItems = svCheckItems.filter(item => !item.isGood);

  const installedSoftwareList = [
    { no: 1, name: 'eXgate-agent-v2.4.1', date: '2026-02-18', vendor: 'AXGATE', status: 'Running' },
    { no: 2, name: 'nginx-1.24.0-core', date: '2026-02-15', vendor: 'Nginx, Inc.', status: 'Running' },
    { no: 3, name: 'mariadb-server-10.6', date: '2026-02-10', vendor: 'MariaDB', status: 'Running' },
    { no: 4, name: 'openssh-server-8.0p1', date: '2026-02-05', vendor: 'OpenBSD', status: 'Running' },
    { no: 5, name: 'python3-3.8.10', date: '2026-01-20', vendor: 'Python Foundation', status: 'Installed' },
    { no: 6, name: 'docker-ce-24.0.5', date: '2026-01-15', vendor: 'Docker, Inc.', status: 'Running' },
    { no: 7, name: 'ufw-0.36', date: '2026-01-10', vendor: 'Canonical', status: 'Running' },
    { no: 8, name: 'fail2ban-0.11.2', date: '2026-01-08', vendor: 'Fail2Ban', status: 'Installed' },
    { no: 9, name: 'curl-7.81.0', date: '2025-12-20', vendor: 'Daniel Stenberg', status: 'Installed' },
    { no: 10, name: 'htop-0.9.3', date: '2025-12-10', vendor: 'Hisham Muhammad', status: 'Installed' },
  ];

  const filteredSoftwareList = installedSoftwareList.filter(sw =>
    sw.name.toLowerCase().includes(softwareSearchTerm.toLowerCase()) ||
    sw.vendor.toLowerCase().includes(softwareSearchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto animate-in fade-in duration-500 relative">
      {/* 전체 설치 소프트웨어 모달 */}
      {showSoftwareModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowSoftwareModal(false)} />
          <div className="relative w-full max-w-3xl bg-white rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-slate-100 flex flex-col max-h-[80vh]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-slate-100 shrink-0 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600"><Box size={24} /></div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">전체 설치 소프트웨어 목록</h2>
                  <p className="text-xs text-slate-400 font-medium">서버에 설치된 패키지 및 프로그램 내역</p>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <input
                    type="text"
                    placeholder="소프트웨어명, 제조사 검색..."
                    value={softwareSearchTerm}
                    onChange={(e) => setSoftwareSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-sm text-slate-700 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all placeholder:text-slate-400"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                </div>
                <button onClick={() => setShowSoftwareModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors shrink-0"><X size={20} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-4 py-3 text-[11px] font-black text-slate-400 uppercase tracking-wider w-16 text-center rounded-tl-xl">No.</th>
                    <th className="px-4 py-3 text-[11px] font-black text-slate-400 uppercase tracking-wider">소프트웨어명 / 버전</th>
                    <th className="px-4 py-3 text-[11px] font-black text-slate-400 uppercase tracking-wider">제조사</th>
                    <th className="px-4 py-3 text-[11px] font-black text-slate-400 uppercase tracking-wider text-center">설치일자</th>
                    <th className="px-4 py-3 text-[11px] font-black text-slate-400 uppercase tracking-wider text-center rounded-tr-xl">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSoftwareList.length > 0 ? (
                    filteredSoftwareList.map((sw, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 text-center text-xs font-mono font-bold text-slate-400">{sw.no}</td>
                        <td className="px-4 py-3 text-sm font-bold text-slate-700">{sw.name}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{sw.vendor}</td>
                        <td className="px-4 py-3 text-center text-xs font-mono text-slate-500">{sw.date}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold ${sw.status === 'Running' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                            {sw.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-16 text-center text-slate-400 font-medium text-sm">
                        검색 결과가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl p-8 flex flex-col lg:flex-row justify-between items-center shadow-sm border border-slate-100 gap-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg border-b-4 border-slate-700">
            <Server className="w-10 h-10 text-[#f97316]" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              HN-SVR-01
              <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 uppercase tracking-widest">Master</span>
            </h3>
            <p className="text-sm text-slate-500 font-mono mt-2 flex items-center gap-3">
              <span className="font-bold text-slate-700">IP:</span> 192.168.10.2
              <span className="text-slate-300">|</span>
              <span className="font-bold text-slate-700">Agent:</span> v2.4.1 (Stable)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-10">
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Health Status</p>
            <div className="flex items-center gap-2 justify-end">
              <div className="w-2.5 h-2.5 bg-[#10b981] rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              <p className="text-2xl font-black text-[#10b981]">안전</p>
            </div>
          </div>
          <div className="h-12 w-px bg-slate-100"></div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Uptime</p>
            <p className="text-2xl font-bold text-slate-800 font-mono tracking-tight">45d 12h 30m</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* 리소스 현황 */}
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 flex items-center bg-white">
            <h3 className="font-bold text-slate-800 text-[17px] flex items-center gap-2.5">
              <Activity className="w-5 h-5 text-blue-500" strokeWidth={2.5} /> 리소스 실시간 모니터링
            </h3>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-2 gap-5">
              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-[#eff6ff] text-[#3b82f6] rounded-xl"><Cpu className="w-5 h-5" /></div>
                  <span className="text-2xl font-black text-slate-800">24%</span>
                </div>
                <div className="w-full bg-[#f1f5f9] rounded-full h-1.5 mb-2 overflow-hidden">
                  <div className="bg-[#3b82f6] h-full rounded-full transition-all duration-1000 ease-out" style={{ width: isMounted ? '24%' : '0%' }}></div>
                </div>
                <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wide">CPU</p>
              </div>
              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-[#faf5ff] text-[#a855f7] rounded-xl"><Server className="w-5 h-5" /></div>
                  <span className="text-2xl font-black text-slate-800">52%</span>
                </div>
                <div className="w-full bg-[#f1f5f9] rounded-full h-1.5 mb-2 overflow-hidden">
                  <div className="bg-[#a855f7] h-full rounded-full transition-all duration-1000 ease-out" style={{ width: isMounted ? '52%' : '0%' }}></div>
                </div>
                <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wide">RAM</p>
              </div>
              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-[#fff7ed] text-[#f97316] rounded-xl"><HardDrive className="w-5 h-5" /></div>
                  <span className="text-2xl font-black text-slate-800">85%</span>
                </div>
                <div className="w-full bg-[#f1f5f9] rounded-full h-1.5 mb-2 overflow-hidden">
                  <div className="bg-[#f97316] h-full rounded-full transition-all duration-1000 ease-out" style={{ width: isMounted ? '85%' : '0%' }}></div>
                </div>
                <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wide">DISK</p>
              </div>
              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-[#ecfdf5] text-[#10b981] rounded-xl"><Network className="w-5 h-5" /></div>
                  <span className="text-xl font-black text-[#10b981]">정상</span>
                </div>
                <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wide mt-auto">NW</p>
              </div>
            </div>

            <div className="pt-10">
              <h4 className="text-[13px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#f97316]"></div> 서버 저장 공간 상태
              </h4>
              <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-medium text-[#64748b]">전체 공간 대비 사용량 (90% 이상 주의)</span>
                  <span className="text-xs font-bold text-[#ea580c]">85% 사용 중 / 1.2TB 점유</span>
                </div>
                <div className="w-full bg-[#f1f5f9] rounded-full h-2 overflow-hidden">
                  <div className="bg-[#f97316] h-full rounded-full transition-all duration-1000 ease-out" style={{ width: isMounted ? '85%' : '0%' }}></div>
                </div>
              </div>
            </div>

            <div className="pt-10">
              <h4 className="text-[13px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> 네트워크 트래픽 (Rx/Tx)
              </h4>
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-1">Inbound (Rx)</p>
                      <p className="text-xl font-black text-[#10b981] font-mono">1.24 <span className="text-xs text-[#94a3b8] font-medium">Gbps</span></p>
                    </div>
                    <div className="w-px h-8 bg-slate-100"></div>
                    <div>
                      <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-1">Outbound (Tx)</p>
                      <p className="text-xl font-black text-[#3b82f6] font-mono">845 <span className="text-xs text-[#94a3b8] font-medium">Mbps</span></p>
                    </div>
                  </div>
                  <div className="flex gap-3 text-[10px] font-bold text-slate-500">
                    <span className="flex items-center gap-1.5"><div className="w-2.5 h-1 bg-[#10b981] rounded-full"></div> Rx</span>
                    <span className="flex items-center gap-1.5"><div className="w-2.5 h-1 bg-[#3b82f6] rounded-full"></div> Tx</span>
                  </div>
                </div>
                <div className="w-full h-20 relative border-b border-l border-slate-100 pl-1 pb-1 overflow-hidden flex items-end">
                  <svg viewBox="0 0 200 24" className="w-[200%] h-full preserve-3d animate-traffic" preserveAspectRatio="none">
                    <polyline points="0,20 10,18 20,22 30,15 40,19 50,12 60,16 70,8 80,14 90,6 100,20 110,18 120,22 130,15 140,19 150,12 160,16 170,8 180,14 190,6 200,20" fill="none" stroke="#10b981" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="0,22 10,21 20,23 30,19 40,21 50,18 60,20 70,16 80,19 90,14 100,22 110,21 120,23 130,19 140,21 150,18 160,20 170,16 180,19 190,14 200,22" fill="none" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 보안 및 진단 */}
        <div className="bg-[#f9fafb] rounded-[24px] shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-8 flex-1 space-y-10">
            {/* 보안 취약점 자동 진단 섹션 */}
            <div>
              <h4 className="text-[15px] font-bold text-slate-700 mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                보안 취약점 자동 진단 <span className="text-[11px] font-normal text-slate-400">(SV-Check)</span>
              </h4>
              <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                {issueItems.length > 0 ? (
                  issueItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center px-6 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-5">
                        <span className="text-[10px] font-mono px-2.5 py-1 bg-[#f3f4f6] text-slate-500 font-bold rounded-md border border-slate-200">{item.id}</span>
                        <span className="text-[13px] font-bold text-slate-700">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[11px] font-bold px-3 py-1 rounded-md ${item.isGood ? 'bg-[#f0fdf4] text-emerald-600 border border-emerald-100' : 'bg-[#fff1f2] text-rose-600 border border-rose-100'}`}>
                          {item.status}
                        </span>
                        {!item.isGood && (
                          <button className="bg-[#f97316] hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-md">
                            <Sparkles className="w-3.5 h-3.5" /> AI 조치
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-3" />
                    <p className="text-sm font-bold text-slate-600">탐지된 보안 취약점이 없습니다.</p>
                    <p className="text-xs mt-1">모든 항목이 안전하게 보호되고 있습니다.</p>
                  </div>
                )}
              </div>
            </div>

            {/* 최신 설치 소프트웨어 현황 섹션 */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-[15px] font-bold text-slate-700 flex items-center gap-2">
                  <Box className="w-5 h-5 text-indigo-500" />
                  최신 설치 소프트웨어 현황
                </h4>
                <button onClick={() => setShowSoftwareModal(true)} className="text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-3 py-1.5 rounded-lg transition-colors shadow-sm flex items-center gap-1">
                  <ListFilter className="w-3.5 h-3.5" /> 전체보기
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {installedSoftwareList.slice(0, 4).map((sw, idx) => (
                  <div key={idx} className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex items-center gap-4">
                    <span className="w-6 h-6 bg-slate-100 text-slate-400 text-[10px] font-black rounded-md flex items-center justify-center border border-slate-200">{sw.no}</span>
                    <span className="text-[12px] font-mono font-bold text-slate-600 truncate" title={sw.name}>{sw.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 최근 업데이트 소프트웨어 현황 섹션 */}
            <div>
              <h4 className="text-[15px] font-bold text-slate-700 mb-6 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-emerald-500" />
                최근 업데이트 소프트웨어 현황
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { no: 1, name: 'eXgate-agent-v2.4.2', date: '2026-02-18' },
                  { no: 2, name: 'kernel-5.15.0-82', date: '2026-02-15' },
                  { no: 3, name: 'openssl-1.1.1f-up1', date: '2026-02-10' },
                  { no: 4, name: 'python3-3.8.10', date: '2026-02-05' },
                ].map((sw, idx) => (
                  <div key={idx} className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="w-6 h-6 bg-slate-100 text-slate-400 text-[10px] font-black rounded-md flex items-center justify-center border border-slate-200">{sw.no}</span>
                      <span className="text-[12px] font-mono font-bold text-slate-600 truncate">{sw.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 shrink-0">{sw.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 하단 푸터 버튼 */}
          <div className="bg-[#fff7ed] py-4 border-t border-[#ffedd5]">
            <button onClick={() => onNavigate && onNavigate('vulnerability')} className="w-full flex items-center justify-center gap-2 text-[13px] font-bold text-[#f97316] hover:underline">
              보안 및 침해대응 세부내용 전체보기 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerDashboard;
