import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  LayoutDashboard, Server, Shield, Network, Activity,
  AlertTriangle, FileText, ScrollText, Search, User,
  LogOut, Clock, ChevronDown, X,
  Building2, Globe, ArrowUpRight, MapPin, ArrowLeft,
  ClipboardCheck, Archive, Users
} from 'lucide-react';

// --- Data & Generators ---
import {
  INITIAL_COMPLEX_LIST,
  generateAllVulnerabilityData,
  generateAllSafetyInspectionData,
  generateAllReportData,
  generateVulnerabilityDataForComplex,
  generateSafetyDataForComplex,
  generateReportsForComplex,
} from './constants/data';

// --- Pages ---
import LoginPage from './pages/LoginPage';

// --- Dashboards ---
import ComplexListDashboard from './dashboards/ComplexListDashboard';
import ComplexDetailDashboard from './dashboards/ComplexDetailDashboard';
import VulnerabilityDashboard from './dashboards/VulnerabilityDashboard';
import SafetyInspectionDashboard from './dashboards/SafetyInspectionDashboard';
import ReportDashboard from './dashboards/ReportDashboard';
import AccountManagementDashboard from './dashboards/AccountManagementDashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState('complex_list');
  const [selectedComplexId, setSelectedComplexId] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('summary');
  const [sidebarComplexSearch, setSidebarComplexSearch] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState(['[SYSTEM] AXGATE 안전홈관리 시스템 가동 시작...', '[INFO] 보안 모듈 로드 완료.']);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [partnerDropdownOpen, setPartnerDropdownOpen] = useState(false);
  const partnerDropdownRef = useRef(null);
  const [resetKey, setResetKey] = useState(0);

  // 전체 단지 목록 상태 관리 (localStorage 영속화)
  const [complexList, setComplexListRaw] = useState(() => {
    try {
      const saved = localStorage.getItem('xg_complex_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_COMPLEX_LIST;
  });
  const setComplexList = useCallback((val) => {
    setComplexListRaw(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      try { localStorage.setItem('xg_complex_list', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  // 단지별 취약점/안전점검 데이터
  const [vulnerabilityData, setVulnerabilityData] = useState(() =>
    generateAllVulnerabilityData(INITIAL_COMPLEX_LIST)
  );
  const [safetyInspectionData, setSafetyInspectionData] = useState(() =>
    generateAllSafetyInspectionData(INITIAL_COMPLEX_LIST)
  );
  const [selectedVulnComplexId, setSelectedVulnComplexId] = useState(null);
  const [selectedSafetyComplexId, setSelectedSafetyComplexId] = useState(null);
  const [reportData, setReportData] = useState(() =>
    generateAllReportData(INITIAL_COMPLEX_LIST)
  );
  const [selectedReportComplexId, setSelectedReportComplexId] = useState(null);
  // 단지 추가 시 데이터 자동 생성
  useEffect(() => {
    setVulnerabilityData(prev => {
      const updated = { ...prev };
      complexList.forEach(c => { if (!updated[c.id]) updated[c.id] = generateVulnerabilityDataForComplex(c.id); });
      return updated;
    });
    setSafetyInspectionData(prev => {
      const updated = { ...prev };
      complexList.forEach(c => { if (!updated[c.id]) updated[c.id] = generateSafetyDataForComplex(c.id); });
      return updated;
    });
    setReportData(prev => {
      const updated = { ...prev };
      complexList.forEach(c => { if (!updated[c.id]) updated[c.id] = generateReportsForComplex(c.id, c.name); });
      return updated;
    });
  }, [complexList]);

  // 최근 확인 단지 이력 (최대 4개, { id, views: Set-like array } )
  const [recentHistory, setRecentHistory] = useState([]);

  // 이력 업데이트 헬퍼
  const pushRecent = (cId, view) => {
    if (!cId) return;
    setRecentHistory(prev => {
      const existing = prev.find(r => r.id === cId);
      if (existing) {
        const views = existing.views.includes(view) ? existing.views : [...existing.views, view];
        return [{ id: cId, views }, ...prev.filter(r => r.id !== cId)].slice(0, 4);
      }
      return [{ id: cId, views: [view] }, ...prev].slice(0, 4);
    });
  };

  useEffect(() => { if (selectedComplexId) pushRecent(selectedComplexId, 'complex_detail'); }, [selectedComplexId]);
  useEffect(() => { if (selectedVulnComplexId) pushRecent(selectedVulnComplexId, 'vulnerability'); }, [selectedVulnComplexId]);
  useEffect(() => { if (selectedSafetyComplexId) pushRecent(selectedSafetyComplexId, 'safety_inspection'); }, [selectedSafetyComplexId]);
  useEffect(() => { if (selectedReportComplexId) pushRecent(selectedReportComplexId, 'report'); }, [selectedReportComplexId]);
  // 로그아웃 — 모든 상태 초기화
  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setActiveMenu('complex_list');
    setSelectedComplexId(null);
    setActiveDetailTab('summary');
    setSidebarComplexSearch('');
    setSidebarOpen(false);
    setTerminalLogs(['[SYSTEM] AXGATE 안전홈관리 시스템 가동 시작...', '[INFO] 보안 모듈 로드 완료.']);
    try { localStorage.removeItem('xg_complex_list'); } catch {}
    setComplexListRaw(INITIAL_COMPLEX_LIST);
    setVulnerabilityData(generateAllVulnerabilityData(INITIAL_COMPLEX_LIST));
    setSafetyInspectionData(generateAllSafetyInspectionData(INITIAL_COMPLEX_LIST));
    setReportData(generateAllReportData(INITIAL_COMPLEX_LIST));
    setSelectedVulnComplexId(null);
    setSelectedSafetyComplexId(null);
    setSelectedReportComplexId(null);
    setRecentHistory([]);
  };

  // --- 브라우저 뒤로가기 히스토리 관리 ---
  const navHistoryRef = useRef([{ menu: 'complex_list', complexId: null }]);
  const isPopRef = useRef(false);

  // 화면 전환 시 히스토리 push
  useEffect(() => {
    if (isPopRef.current) { isPopRef.current = false; return; }
    const current = { menu: activeMenu, complexId: selectedComplexId };
    const stack = navHistoryRef.current;
    const last = stack[stack.length - 1];
    if (last && last.menu === current.menu && last.complexId === current.complexId) return;
    navHistoryRef.current = [...stack, current];
    window.history.pushState(null, '', '');
  }, [activeMenu, selectedComplexId]);

  // popstate (뒤로가기) 핸들러
  useEffect(() => {
    const handlePop = () => {
      const stack = navHistoryRef.current;
      if (stack.length <= 1) {
        // 더 이상 뒤로 갈 곳이 없으면 앱이 꺼지지 않도록 유지
        window.history.pushState(null, '', '');
        return;
      }
      stack.pop(); // 현재 화면 제거
      const prev = stack[stack.length - 1];
      isPopRef.current = true;
      setActiveMenu(prev.menu);
      setSelectedComplexId(prev.complexId);
      if (!prev.complexId) {
        setSelectedVulnComplexId(null);
        setSelectedSafetyComplexId(null);
        setSelectedReportComplexId(null);
      }
    };
    window.addEventListener('popstate', handlePop);
    // 초기 히스토리 엔트리 추가
    window.history.pushState(null, '', '');
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  // 로그 업데이트 헬퍼
  const handleLogUpdate = (msg) => {
    setTerminalLogs(prev => [msg, ...prev]);
  };

  const handleSelectComplex = (id) => {
    setSelectedComplexId(id);
    setActiveMenu('complex_detail');
    setActiveDetailTab('summary');
    setSidebarComplexSearch('');
  };

  useEffect(() => {
    setTimeout(() => setIsMounted(true), 100);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (partnerDropdownRef.current && !partnerDropdownRef.current.contains(e.target)) {
        setPartnerDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const detailTabs = [
    { id: 'summary', label: '단지 요약', icon: LayoutDashboard },
    { id: 'server', label: '단지서버', icon: Server },
    { id: 'log_server', label: 'AXGATE SAFERHOME', icon: Archive },
    { id: 'firewall', label: '방화벽', icon: Shield },
    { id: 'network', label: '백본', icon: Network },
    { id: 'separation', label: '단지관리', icon: Activity },
    { id: 'separation_2', label: '단지관리 ADMIN', icon: Activity },
    { id: 'logs', label: '로그', icon: ScrollText },
  ];

  const selectedComplexData = complexList.find(c => c.id === selectedComplexId);

  const getMenuTitle = () => {
    switch(activeMenu) {
      case 'complex_list': return '통합 단지 목록';
      case 'complex_detail': {
        const tabLabel = detailTabs.find(t => t.id === activeDetailTab)?.label || '단지 요약';
        const complexName = selectedComplexData?.name || '';
        return `${complexName} — ${tabLabel}`;
      }
      case 'vulnerability': {
        if (selectedVulnComplexId) {
          const name = complexList.find(c => c.id === selectedVulnComplexId)?.name || '';
          return `${name} — 취약점 분석 및 조치`;
        }
        return '취약점 분석 및 조치';
      }
      case 'safety_inspection': {
        if (selectedSafetyComplexId) {
          const name = complexList.find(c => c.id === selectedSafetyComplexId)?.name || '';
          return `${name} — 홈네트워크 안전점검`;
        }
        return '홈네트워크 안전점검';
      }
      case 'report': {
        if (selectedReportComplexId) {
          const name = complexList.find(c => c.id === selectedReportComplexId)?.name || '';
          return `${name} — 통합 보고서 센터`;
        }
        return '통합 보고서 센터';
      }
      case 'account_management': return '계정 및 권한 관리';
      default: return '보안 관제 시스템';
    }
  };

  const menuItems = [
    { id: 'complex_list', icon: Building2, label: '통합 단지 목록', color: '#3B82F6' },
  ];

  const managementItems = [
    { id: 'vulnerability', icon: AlertTriangle, label: '취약점 분석 및 조치', color: '#EF4444' },
    { id: 'safety_inspection', icon: ClipboardCheck, label: '홈네트워크 안전점검', color: '#EF4444' },
  ];

  const reportItems = [
    { id: 'report', icon: FileText, label: '통합 보고서 센터', color: '#10B981' },
  ];

  const settingsItems = [
    { id: 'account_management', icon: Users, label: '계정 및 권한 관리', color: '#8B5CF6' },
  ];

  const renderMenuItem = (menu) => {
    const Icon = menu.icon;
    const isActive = activeMenu === menu.id;
    const accent = menu.color || '#93C5FD';
    return (
      <button
        key={menu.id}
        onClick={() => {
          const currentId = selectedComplexId;
          setActiveMenu(menu.id);
          if (menu.id === 'complex_list') {
            setSelectedComplexId(null);
          }
          if (menu.id === 'vulnerability') setSelectedVulnComplexId(currentId || null);
          if (menu.id === 'safety_inspection') setSelectedSafetyComplexId(currentId || null);
          if (menu.id === 'report') setSelectedReportComplexId(currentId || null);
        }}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-150 outline-none text-left"
        style={{
          backgroundColor: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
          color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
          borderLeft: isActive ? `3px solid ${accent}` : '3px solid transparent',
          fontWeight: isActive ? 600 : 400,
        }}
        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; } }}
        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; } }}
      >
        <Icon size={16} strokeWidth={isActive ? 2 : 1.5} style={{ flexShrink: 0, color: isActive ? accent : 'inherit' }} />
        <span className="text-[13px] tracking-tight">{menu.label}</span>
      </button>
    );
  };

  const VIEW_META = {
    complex_detail: { label: '단지상세' },
    vulnerability: { label: '취약점' },
    safety_inspection: { label: '안전점검' },
    report: { label: '보고서' },
  };

  const filteredComplexes = sidebarComplexSearch.trim()
    ? complexList.filter(c =>
        c.name.toLowerCase().includes(sidebarComplexSearch.trim().toLowerCase()) ||
        c.region.toLowerCase().includes(sidebarComplexSearch.trim().toLowerCase())
      )
    : [];

  const renderDetailSubMenu = () => {
    return (
      <div className="mt-1">
        {/* 단지 검색 — 항상 표시 */}
        <div className="px-3 py-1.5 mb-1">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#64748B' }} />
            <input
              type="text"
              placeholder="단지 검색..."
              value={sidebarComplexSearch}
              onChange={e => setSidebarComplexSearch(e.target.value)}
              className="w-full pl-7 pr-7 py-1.5 rounded-md text-[12px] outline-none transition-colors"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#93C5FD'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            />
            {sidebarComplexSearch && (
              <button
                onClick={() => setSidebarComplexSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded transition-colors"
                style={{ color: '#64748B' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#E2E8F0'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; }}
              >
                <X size={11} />
              </button>
            )}
          </div>
          {/* 검색 결과 드롭다운 */}
          {sidebarComplexSearch.trim() && (
            <div className="mt-1 max-h-40 overflow-y-auto rounded-md custom-scrollbar-dark" style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
              {filteredComplexes.length > 0 ? filteredComplexes.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleSelectComplex(c.id)}
                  className="w-full flex items-center justify-between px-3 py-2 text-left transition-colors"
                  style={{ color: 'rgba(255,255,255,0.75)' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(147,197,253,0.15)'; e.currentTarget.style.color = '#FFFFFF'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
                >
                  <span className="text-[12px] font-medium truncate">{c.name}</span>
                  <span className="text-[10px] ml-2 shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }}>{c.region}</span>
                </button>
              )) : (
                <div className="px-3 py-2.5 text-[11px] text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  검색 결과가 없습니다
                </div>
              )}
            </div>
          )}
        </div>

        {/* 하위 탭 메뉴 — 단지 선택 시 항상 표시 */}
        {selectedComplexId && (
          <>
            {/* 선택된 단지명 헤더 */}
            <div className="flex items-center gap-2 px-3 py-2 mb-1">
              <MapPin size={12} style={{ color: '#f97316', flexShrink: 0 }} />
              <span className="text-[12px] font-bold truncate" style={{ color: '#FFFFFF' }}>
                {selectedComplexData?.name || ''}
              </span>
              <button
                onClick={() => {
                  setActiveMenu('complex_list');
                  setSelectedComplexId(null);
                  setSelectedVulnComplexId(null);
                  setSelectedSafetyComplexId(null);
                  setSelectedReportComplexId(null);
                }}
                className="ml-auto p-1 rounded transition-colors"
                style={{ color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                title="목록으로 돌아가기"
              >
                <ArrowLeft size={13} />
              </button>
            </div>
            {/* 하위 탭 메뉴 */}
            {detailTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeMenu === 'complex_detail' && activeDetailTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveMenu('complex_detail');
                    setActiveDetailTab(tab.id);
                  }}
                  className="w-full flex items-center gap-2.5 pl-6 pr-3 py-2 rounded-md transition-all duration-150 outline-none text-left"
                  style={{
                    backgroundColor: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                    color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
                    borderLeft: isActive ? '3px solid #f97316' : '3px solid transparent',
                    fontWeight: isActive ? 600 : 400,
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.backgroundColor = isActive ? 'rgba(255,255,255,0.12)' : 'transparent'; e.currentTarget.style.color = isActive ? '#FFFFFF' : 'rgba(255,255,255,0.55)'; } }}
                >
                  <Icon size={14} strokeWidth={isActive ? 2 : 1.5} style={{ flexShrink: 0 }} />
                  <span className="text-[12px] tracking-tight">{tab.label}</span>
                </button>
              );
            })}
          </>
        )}
      </div>
    );
  };

  // 비로그인 상태일 경우 로그인 화면 렌더링
  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} onLoginWithRole={(role) => { setIsAdmin(role === 'admin'); setIsAuthenticated(true); }} />;
  }

  return (
    <div className="min-h-screen h-screen bg-[#F8FAFC] text-slate-800 flex overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* 모바일 오버레이 */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      {/* 사이드바 */}
      <aside className={`w-[288px] flex flex-col z-40 shrink-0 fixed lg:static top-0 bottom-0 left-0 lg:h-screen transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`} style={{ backgroundColor: '#1B2A4A', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
        {/* 로고 */}
        <div className="h-16 flex items-center px-5 shrink-0" style={{ backgroundColor: '#152038', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => { setActiveMenu('complex_list'); setSelectedComplexId(null); setSelectedVulnComplexId(null); setSelectedSafetyComplexId(null); setSelectedReportComplexId(null); setResetKey(k => k + 1); }}
          >
            <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #2563EB, #1B2A4A)' }}>
              <Shield size={14} className="text-white" />
            </div>
            <div>
              <div className="font-black text-[15px] tracking-tight leading-none text-white">AX<span style={{ color: '#f97316' }}>GATE</span></div>
              <div className="text-[9px] font-semibold tracking-widest uppercase leading-none mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>SaferHome</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-5 px-3 custom-scrollbar">
          {[
            { label: 'DASHBOARDS', items: menuItems, hasSubMenu: true },
            { label: 'MANAGEMENT', items: managementItems },
            { label: 'REPORT', items: reportItems },
            { label: 'SETTINGS', items: settingsItems },
          ].map(({ label, items, hasSubMenu }) => (
            <div key={label} className="mb-6">
              <p className="text-[10px] font-bold px-3 mb-2 tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
              <nav className="space-y-0.5">
                {items.map(renderMenuItem)}
                {hasSubMenu && renderDetailSubMenu()}
              </nav>
            </div>
          ))}
          {/* 최근 확인 단지 */}
          {recentHistory.length > 0 && (
            <div className="mb-6">
              <p className="text-[10px] font-bold px-3 mb-2 tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>RECENT</p>
              <nav>
                {recentHistory.map(({ id: cId, views }) => {
                  const c = complexList.find(x => x.id === cId);
                  if (!c) return null;
                  return (
                    <div key={cId} className="px-3 py-1.5 rounded-md group/recent" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: '#f97316' }} />
                        <button
                          onClick={() => { setSelectedComplexId(cId); setActiveMenu('complex_detail'); setActiveDetailTab('summary'); }}
                          className="text-[12px] font-medium truncate text-left hover:underline transition-all"
                          style={{ color: 'rgba(255,255,255,0.7)' }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#f97316'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                        >{c.name}</button>
                        <button
                          onClick={() => {
                            setRecentHistory(prev => prev.filter(r => r.id !== cId));
                            if (selectedComplexId === cId) { setSelectedComplexId(null); setActiveMenu('complex_list'); }
                            if (selectedVulnComplexId === cId) setSelectedVulnComplexId(null);
                            if (selectedSafetyComplexId === cId) setSelectedSafetyComplexId(null);
                            if (selectedReportComplexId === cId) setSelectedReportComplexId(null);
                          }}
                          className="ml-auto p-0.5 rounded opacity-0 group-hover/recent:opacity-100 transition-all shrink-0"
                          style={{ color: '#475569' }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = '#475569'; }}
                          title="이력 삭제"
                        >
                          <X size={10} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1 pl-3.5">
                        {views.map(v => {
                          const m = VIEW_META[v];
                          if (!m) return null;
                          return (
                            <button
                              key={v}
                              onClick={() => {
                                if (v === 'complex_detail') { setSelectedComplexId(cId); setActiveMenu('complex_detail'); }
                                else if (v === 'vulnerability') { setSelectedVulnComplexId(cId); setActiveMenu('vulnerability'); }
                                else if (v === 'safety_inspection') { setSelectedSafetyComplexId(cId); setActiveMenu('safety_inspection'); }
                                else if (v === 'report') { setSelectedReportComplexId(cId); setActiveMenu('report'); }
                              }}
                              className="px-2 py-0.5 rounded text-[9px] font-bold transition-all hover:opacity-80"
                              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.65)' }}
                            >
                              {m.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* 사용자 정보 */}
        <div className="p-3 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: '#2563EB' }}>
                <User size={14} className="text-white" />
              </div>
              <div>
                <div className="text-[13px] font-semibold leading-none mb-0.5 text-white">최고관리자</div>
                <div className="text-[10px] leading-none" style={{ color: 'rgba(255,255,255,0.4)' }}>admin@axgate.com</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-md transition-all"
              style={{ color: 'rgba(255,255,255,0.4)' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#FFFFFF'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
              title="로그아웃"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 flex items-center justify-between px-4 sm:px-8 shrink-0 z-[70] sticky top-0" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-md hover:bg-gray-100" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <h2 className="text-[16px] sm:text-[18px] font-bold tracking-tight flex items-center gap-2.5" style={{ color: '#0F172A' }}>
              {getMenuTitle()}
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
          </h2>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center text-[13px] font-mono px-3.5 py-2 rounded-md" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', color: '#475569' }}>
              <Clock className="w-3.5 h-3.5 mr-2" style={{ color: '#3B82F6' }} />
              {currentTime.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })} {currentTime.toLocaleTimeString('ko-KR')}
            </div>
            <div className="relative" ref={partnerDropdownRef}>
              <button
                onClick={() => setPartnerDropdownOpen(prev => !prev)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-md text-[13px] font-bold transition-all"
                style={{ backgroundColor: partnerDropdownOpen ? '#EEF2FF' : '#F8FAFC', border: `1px solid ${partnerDropdownOpen ? '#A5B4FC' : '#E2E8F0'}`, color: partnerDropdownOpen ? '#4F46E5' : '#475569' }}
                onMouseEnter={e => { if (!partnerDropdownOpen) { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.borderColor = '#CBD5E1'; }}}
                onMouseLeave={e => { if (!partnerDropdownOpen) { e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.borderColor = '#E2E8F0'; }}}
              >
                <Globe className="w-3.5 h-3.5" />
                파트너사이트
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${partnerDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {partnerDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                  {[
                    { name: 'AXGATE', desc: '엑스게이트 공식', url: 'https://www.axgate.com' },
                    { name: 'CVnet', desc: '홈네트워크 전문기업', url: 'https://cvnet.imweb.me/' },
                    { name: '현대HT', desc: '현대홈넷', url: 'https://hyundaiht.co.kr' },
                    { name: '삼성SDS', desc: '삼성SDS 홈IoT', url: 'https://www.samsungsds.com' },
                    { name: '코맥스', desc: '스마트홈 솔루션', url: 'https://www.commax.com' },
                    { name: '코콤', desc: '홈네트워크', url: 'https://www.kocom.co.kr' },
                  ].map((site, idx) => (
                    <a
                      key={idx}
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setPartnerDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-50 flex items-center justify-center shrink-0 transition-colors">
                        <Globe className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{site.name}</p>
                        <p className="text-[10px] text-slate-400">{site.desc}</p>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-400 ml-auto shrink-0 transition-colors" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar" style={{ backgroundColor: '#F8FAFC' }}>
          {activeMenu === 'complex_list' && <ComplexListDashboard key={resetKey} onNavigate={setActiveMenu} onSelectComplex={handleSelectComplex} complexList={complexList} setComplexList={setComplexList} />}
          {activeMenu === 'complex_detail' && <ComplexDetailDashboard activeTab={activeDetailTab} onTabChange={setActiveDetailTab} onNavigate={(menu) => { setActiveMenu(menu); if (menu === 'complex_list') setSelectedComplexId(null); }} complexId={selectedComplexId} complexList={complexList} setComplexList={setComplexList} isMounted={isMounted} onLog={handleLogUpdate} terminalLogs={terminalLogs} />}
          {activeMenu === 'vulnerability' && (
            <VulnerabilityDashboard
              onLog={handleLogUpdate}
              complexId={selectedVulnComplexId}
              complexList={complexList}
              vulnerabilityData={vulnerabilityData}
              onDataChange={(cId, list) => setVulnerabilityData(prev => ({ ...prev, [cId]: list }))}
              onSelectComplex={setSelectedVulnComplexId}
            />
          )}
          {activeMenu === 'safety_inspection' && (
            <SafetyInspectionDashboard
              onLog={handleLogUpdate}
              complexId={selectedSafetyComplexId}
              complexList={complexList}
              safetyInspectionData={safetyInspectionData}
              onDataChange={(cId, list) => setSafetyInspectionData(prev => ({ ...prev, [cId]: list }))}
              onSelectComplex={setSelectedSafetyComplexId}
            />
          )}
          {activeMenu === 'report' && (
            <ReportDashboard
              complexId={selectedReportComplexId}
              complexList={complexList}
              reportData={reportData}
              onSelectComplex={setSelectedReportComplexId}
              isAdmin={isAdmin}
              onDataChange={(cId, list) => setReportData(prev => ({ ...prev, [cId]: list }))}
            />
          )}
          {activeMenu === 'account_management' && <AccountManagementDashboard onLog={handleLogUpdate} />}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        * { font-family: 'Inter', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
        .custom-scrollbar-dark::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-dark::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 10px; }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb:hover { background: #334155; }

        @keyframes traffic-flow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-traffic {
          animation: traffic-flow 4s linear infinite;
        }

        /* 인쇄 전용 스타일 - 보고서 컨텐츠만 깔끔하게 출력 */
        @media print {
          body * { visibility: hidden; }
          #pdf-report-content, #pdf-report-content * { visibility: visible; }
          #pdf-report-content { position: absolute; left: 0; top: 0; box-shadow: none !important; width: 100%; margin: 0; padding: 0; }
          #pdf-report-preview-content, #pdf-report-preview-content * { visibility: visible; }
          #pdf-report-preview-content { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 20px; background: white; }
          .no-print { display: none !important; }
        }
      `}} />
    </div>
  );
}
