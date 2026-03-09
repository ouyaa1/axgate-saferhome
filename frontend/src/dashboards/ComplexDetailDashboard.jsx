import React, { useState } from 'react';
import {
  LayoutDashboard, Server, Archive, Shield, Network, Activity, ScrollText,
  Building2, MapPin, Edit3, ArrowLeft, Calendar, Info, FileSpreadsheet,
  FileText, CheckCircle2, Clock
} from 'lucide-react';
import ServerDashboard from './ServerDashboard';
import LogServerDashboard from './LogServerDashboard';
import FirewallDashboard from './FirewallDashboard';
import NetworkDashboard from './NetworkDashboard';
import LogDashboard from './LogDashboard';
import SeparationDashboard from './SeparationDashboard';
import AddComplexModal from '../components/AddComplexModal';

const ComplexDetailDashboard = ({ activeTab, onTabChange, onNavigate, complexId, complexList, setComplexList, isMounted, onLog, terminalLogs }) => {
  const selectedData = complexList.find(item => item.id === complexId) || complexList[0];
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditSave = (formData) => {
    setComplexList(prev => prev.map(c => c.id === formData.id ? { ...c, ...formData } : c));
    setShowEditModal(false);
  };

  const complexInfo = {
    name: `${selectedData.name} (${selectedData.id})`,
    address: selectedData.address,
    regDate: selectedData.regDate,
    manager: selectedData.manager,
    contact: selectedData.contact,
    status: selectedData.status === '정상' ? '정상 운영중' : selectedData.status,
    builder: selectedData.builder,
    builderManager: selectedData.builderManager,
    builderContact: selectedData.builderContact,
    homenet: selectedData.homenet,
    homenetManager: selectedData.homenetManager,
    homenetContact: selectedData.homenetContact
  };

  const reportStatus = [
    { type: "보안 취약점 점검", interval: "주간", lastDate: "2026-02-19", nextDate: "2026-02-26", status: "발급완료" },
    { type: "안전 점검", interval: "주간", lastDate: "2026-02-15", nextDate: "2026-02-22", status: "발급완료" },
    { type: "월간 종합 점검", interval: "월간", lastDate: "2026-01-31", nextDate: "2026-02-28", status: "작성중" }
  ];

  const tabs = [
    { id: 'summary', label: '단지 요약', icon: LayoutDashboard },
    { id: 'server', label: '단지서버', icon: Server },
    { id: 'log_server', label: 'AXGATE SAFERHOME', icon: Archive },
    { id: 'firewall', label: '방화벽', icon: Shield },
    { id: 'network', label: '백본', icon: Network },
    { id: 'separation', label: '단지관리', icon: Activity },
    { id: 'separation_2', label: '단지관리 ADMIN', icon: Activity },
    { id: 'logs', label: '로그', icon: ScrollText },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">

      {/* 단지 정보 헤더 + 탭 바 */}
      <div className="rounded-3xl p-8 shadow-sm sticky top-0 z-[60] border border-slate-300/60" style={{ backgroundColor: '#E2E8F0' }}>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg border-b-4 border-slate-700">
            <Building2 className="w-10 h-10 text-[#f97316]" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800 leading-tight flex items-center gap-3">
              {selectedData.name}
              <span className={`text-[10px] px-2 py-1 rounded-md text-white font-bold tracking-widest ${selectedData.status === '정상' ? 'bg-emerald-500' : selectedData.status === '오프라인' ? 'bg-slate-400' : 'bg-orange-500'}`}>
                {selectedData.status}
              </span>
            </h3>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-1">
              <MapPin size={12} className="text-slate-400" /> {complexInfo.address}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <button onClick={() => setShowEditModal(true)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer">
              <Edit3 size={14} /> 단지 정보 수정
            </button>
            <button onClick={() => onNavigate('complex_list')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-orange-600 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 transition-all">
              <ArrowLeft className="w-4 h-4" /> 단지 목록으로
            </button>
          </div>
        </div>
        {/* 콘텐츠 탭 바 */}
        <div className="flex gap-1 bg-white/60 p-1.5 rounded-[1.5rem] mt-3 overflow-x-auto">
          {tabs.map(tab => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[1.2rem] text-[12px] font-bold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                }`}
              >
                <TabIcon size={14} strokeWidth={isActive ? 2 : 1.5} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 탭별 콘텐츠 렌더링 */}
      <div className="mt-2 relative">
        {activeTab === 'summary' && (
          <div className="flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-300">
            {/* 상단 단지 정보 카드 */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                <Building2 size={240} className="text-slate-900" />
              </div>
              <div className="flex flex-col lg:flex-row justify-between gap-10 relative z-10">
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <div className="bg-[#f8fafc] p-5 rounded-2xl border border-slate-100 flex flex-col justify-center">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">시스템 등록일</p>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-slate-400" />
                        <p className="text-lg font-black text-slate-800 font-mono">{complexInfo.regDate}</p>
                      </div>
                    </div>

                    <div className="bg-[#f8fafc] p-5 rounded-2xl border border-slate-100 flex flex-col justify-center">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">단지 관리사무소</p>
                      <div className="flex items-end justify-between">
                        <p className="text-base font-black text-slate-800">{complexInfo.manager}</p>
                        <p className="text-xs font-bold text-slate-500 font-mono">{complexInfo.contact}</p>
                      </div>
                    </div>

                    <div className="bg-[#f8fafc] p-5 rounded-2xl border border-slate-100 flex flex-col justify-center relative">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">건설사 담당자</p>
                        <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold">{complexInfo.builder}</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <p className="text-base font-black text-slate-800">{complexInfo.builderManager}</p>
                        <p className="text-xs font-bold text-slate-500 font-mono">{complexInfo.builderContact}</p>
                      </div>
                    </div>

                    <div className="bg-[#f8fafc] p-5 rounded-2xl border border-slate-100 flex flex-col justify-center relative">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">홈넷사 담당자</p>
                        <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold">{complexInfo.homenet}</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <p className="text-base font-black text-slate-800">{complexInfo.homenetManager}</p>
                        <p className="text-xs font-bold text-slate-500 font-mono">{complexInfo.homenetContact}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-80 space-y-4">
                  <div className="bg-[#fff7ed] border border-[#ffedd5] p-6 rounded-3xl h-full flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-black text-[#ea580c]">오늘의 관제 요약</h4>
                      <Info size={16} className="text-[#fb923c]" />
                    </div>
                    <ul className="space-y-4 flex-1 justify-center flex flex-col">
                      <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#f97316]"></div>
                        단지서버 보안 위협 2건 탐지 (조치완료)
                      </li>
                      <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#f97316]"></div>
                        정기 안전점검표 100% 작성 완료
                      </li>
                      <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                        네트워크 장비 정기 재부팅 예정 (D-2)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 보고서 발급 상태 테이블 섹션 */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="px-10 py-7 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                  <FileSpreadsheet className="w-6 h-6 text-indigo-600" /> 단지별 보고서 발급 현황
                </h3>
                <div className="flex gap-2">
                   <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                     전체 이력 보기
                   </button>
                </div>
              </div>

              <div className="p-8">
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#f8fafc] border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">보고서 유형</th>
                        <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">점검 주기</th>
                        <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">최근 발급일</th>
                        <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">차기 발급 예정일</th>
                        <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">발급 상태</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reportStatus.map((report, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg shrink-0 ${
                                report.status === '발급완료' ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-100 text-slate-400'
                              }`}>
                                <FileText size={16} />
                              </div>
                              <span className="text-[14px] font-bold text-slate-800 whitespace-nowrap">{report.type}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[11px] font-black rounded-full uppercase tracking-tighter whitespace-nowrap">
                              {report.interval}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-600 font-mono whitespace-nowrap">{report.lastDate}</td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-400 font-mono whitespace-nowrap">{report.nextDate}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-black ${
                              report.status === '발급완료' ? 'bg-emerald-50 text-emerald-600' :
                              report.status === '작성중' ? 'bg-orange-50 text-orange-600 animate-pulse' :
                              'bg-slate-100 text-slate-400'
                            }`}>
                              {report.status === '발급완료' && <CheckCircle2 size={14} />}
                              {report.status === '작성중' && <Clock size={14} />}
                              {report.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 선택된 탭의 대시보드 렌더링 영역 */}
        {activeTab === 'server' && <div className="animate-in fade-in zoom-in-95 duration-300"><ServerDashboard isMounted={isMounted} /></div>}
        {/* 신규 HOMES 대시보드 */}
        {activeTab === 'log_server' && <div className="animate-in fade-in zoom-in-95 duration-300"><LogServerDashboard isMounted={isMounted} /></div>}
        {activeTab === 'firewall' && <div className="animate-in fade-in zoom-in-95 duration-300"><FirewallDashboard /></div>}
        {activeTab === 'network' && <div className="animate-in fade-in zoom-in-95 duration-300"><NetworkDashboard /></div>}
        {/* 일반 관리자 뷰: 제어 권한 없음 (isAdmin=false) */}
        {activeTab === 'separation' && <div className="animate-in fade-in zoom-in-95 duration-300"><SeparationDashboard key={`sep-${selectedData.id}-${selectedData.dongCount}-${selectedData.dongStartNum}-${selectedData.floorCount}-${selectedData.unitsPerFloor}-${selectedData.deviceRegistered}`} onLog={onLog} terminalLogs={terminalLogs} isAdmin={false} complexConfig={selectedData} onRegisterDevice={() => setComplexList(prev => prev.map(c => c.id === selectedData.id ? { ...c, deviceRegistered: true } : c))} /></div>}
        {/* 시스템 엔지니어 뷰: 전체 제어 권한 부여 (isAdmin=true) */}
        {activeTab === 'separation_2' && <div className="animate-in fade-in zoom-in-95 duration-300"><SeparationDashboard key={`sep2-${selectedData.id}-${selectedData.dongCount}-${selectedData.dongStartNum}-${selectedData.floorCount}-${selectedData.unitsPerFloor}-${selectedData.deviceRegistered}`} onLog={onLog} terminalLogs={terminalLogs} isAdmin={true} complexConfig={selectedData} onRegisterDevice={() => setComplexList(prev => prev.map(c => c.id === selectedData.id ? { ...c, deviceRegistered: true } : c))} /></div>}
        {/* 로그 뷰 추가 */}
        {activeTab === 'logs' && <div className="animate-in fade-in zoom-in-95 duration-300"><LogDashboard /></div>}
      </div>

      {showEditModal && (
        <AddComplexModal
          onClose={() => setShowEditModal(false)}
          onSave={handleEditSave}
          initialData={selectedData}
        />
      )}
    </div>
  );
};

export default ComplexDetailDashboard;
