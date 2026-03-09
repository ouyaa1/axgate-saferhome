import React, { useState } from 'react';
import { ScrollText, Search, Filter, ChevronDown } from 'lucide-react';

const INITIAL_LOGS = [
  { id: 1, time: '10:42:05', level: 'CRITICAL', source: '관문 방화벽', message: '외부 IP(211.x.x.x)로부터 비정상 접근 시도 차단' },
  { id: 2, time: '10:41:12', level: 'WARN', source: '단지서버', message: 'FTP 포트(21) 활성화 상태 감지 (SV-28 위반)' },
  { id: 3, time: '10:40:00', level: 'INFO', source: '시스템', message: '관리자(박신일) 로그인 완료' },
  { id: 4, time: '10:35:22', level: 'INFO', source: '백본 스위치', message: '포트 24 (Uplink) 연결 상태 정상' },
  { id: 5, time: '10:28:15', level: 'INFO', source: '단지서버', message: '데이터베이스 정기 백업 완료 (소요시간: 45초)' },
  { id: 6, time: '10:15:03', level: 'WARN', source: '방화벽', message: '비정상적인 트래픽 급증 감지 (차단 모드 자동 전환)' },
  { id: 7, time: '09:55:40', level: 'CRITICAL', source: '망분리 장비', message: '101동 101호 VPN 터널링 연결 끊김' },
  { id: 8, time: '09:30:00', level: 'INFO', source: '시스템', message: '일일 보안 점검 스케줄러 정상 구동' },
];

const LogDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');

  const filteredLogs = INITIAL_LOGS.filter(log => {
    const matchSearch = log.message.includes(searchTerm) || log.source.includes(searchTerm);
    const matchLevel = levelFilter === 'ALL' || log.level === levelFilter;
    return matchSearch && matchLevel;
  });

  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200/60 overflow-hidden flex flex-col min-h-[600px]">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <ScrollText className="w-6 h-6 text-indigo-600" /> 시스템 통합 로그
          </h3>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="메시지 또는 발생 위치 검색"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <div className="relative shrink-0">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="appearance-none w-[130px] px-4 py-2.5 pl-10 pr-8 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
              >
                <option value="ALL">전체 레벨</option>
                <option value="INFO">INFO</option>
                <option value="WARN">WARN</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
              <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider w-24 text-center">ID</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider w-36 text-center">발생 시간</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider w-32 text-center">레벨</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider w-40 text-center">발생 위치</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">메시지</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono font-bold text-slate-500 text-center">{log.id}</td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-600 text-center">{log.time}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest ${
                        log.level === 'CRITICAL' ? 'bg-rose-100 text-rose-700' :
                        log.level === 'WARN' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-700 text-center">{log.source}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{log.message}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center text-slate-400 text-sm font-medium">검색 조건에 맞는 로그가 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogDashboard;
