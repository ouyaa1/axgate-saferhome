import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Shield, ShieldCheck, ShieldAlert, Building2, Lock, AlertCircle,
  ChevronRight, ChevronLeft, ChevronRight as ChevronRightIcon,
  Send, Mail, Upload, Megaphone, Siren, Filter, Globe, MousePointer2,
  Terminal, Printer, FileText, FileSpreadsheet, FileCode, FileDown,
  Bot, MessageSquarePlus, MessageCircle, ArrowLeft, ListFilter,
  History as HistoryIcon, Download, RefreshCw, Power, Zap,
  Map as MapIcon, User, X, Cpu, HardDrive, Plus, Edit, Trash2,
  CheckCircle2, Search
} from 'lucide-react';
import PacketChart from '../components/PacketChart';
import CircularProgress from '../components/CircularProgress';
import DocumentPreviewModal from '../components/DocumentPreviewModal';
import { INITIAL_NOTICES, INITIAL_INQUIRIES } from '../constants/data';

// --- 장비/이력 생성 유틸리티 ---
const DEVICE_MODELS = ['AXGATE-WP100', 'AXGATE-WP200', 'AXGATE-WP300'];
const ERROR_TYPES = ['통신 장애', '전원 이상', 'VPN 터널 끊김', '펌웨어 오류', '센서 이상', '네트워크 단절'];

const generateHighRiseDevices = (cfg) => {
  const dongCount = cfg.dongCount || 10;
  const dongStart = cfg.dongStartNum || 101;
  const floorCount = cfg.floorCount || 20;
  const unitsPerFloor = cfg.unitsPerFloor || 2;
  const devices = [];
  let idx = 0;
  for (let d = 0; d < dongCount; d++) {
    const dongNum = dongStart + d;
    const dong = `${dongNum}동`;
    for (let f = 1; f <= floorCount; f++) {
      for (let u = 1; u <= unitsPerFloor; u++) {
        const unit = `${dongNum}동 ${f * 100 + u}호`;
        const seed = (dongNum * 1000 + f * 10 + u + idx) % 100;
        const isError = seed < 5;
        devices.push({
          id: `DEV-${String(idx + 1).padStart(4, '0')}`,
          unit,
          dong,
          floor: f,
          room: f * 100 + u,
          serial: `AXG${String(dongNum).slice(-2)}${String(f).padStart(2, '0')}${String(u).padStart(2, '0')}${String(Math.floor(Math.random() * 9000 + 1000))}`,
          model: DEVICE_MODELS[idx % DEVICE_MODELS.length],
          status: isError ? 'error' : 'normal',
          errorType: isError ? ERROR_TYPES[idx % ERROR_TYPES.length] : null,
          osVersion: `v2.4.${1 + (idx % 3)}`,
        });
        idx++;
      }
    }
  }
  return devices;
};

const generateInitialHistory = (devices) => {
  const history = [];
  const now = Date.now();
  const errorDevices = devices.filter(d => d.status === 'error');
  const normalSample = devices.filter(d => d.status === 'normal').slice(0, 5);

  errorDevices.forEach((d, i) => {
    history.push({
      id: now - i * 60000,
      unit: d.unit,
      type: 'error',
      category: 'error',
      message: `${d.errorType} 감지 - 장비 시리얼: ${d.serial}`,
      timestamp: new Date(now - i * 60000 * 5).toLocaleTimeString('ko-KR'),
      user: '시스템',
      timestampValue: now - i * 60000 * 5,
    });
  });

  normalSample.forEach((d, i) => {
    history.push({
      id: now - (errorDevices.length + i) * 60000,
      unit: d.unit,
      type: 'info',
      category: 'info',
      message: `정기 점검 완료 - 상태 정상`,
      timestamp: new Date(now - (errorDevices.length + i) * 60000 * 10).toLocaleTimeString('ko-KR'),
      user: '관리자',
      timestampValue: now - (errorDevices.length + i) * 60000 * 10,
    });
  });

  return history.sort((a, b) => b.timestampValue - a.timestampValue);
};

// isAdmin 프롭스를 추가로 받아 화면의 권한을 제어합니다.
const SeparationDashboard = ({ onLog, terminalLogs: mainTerminalLogs, isAdmin, complexConfig, onRegisterDevice }) => {
  const [isDeviceRegistered, setIsDeviceRegistered] = useState(complexConfig?.deviceRegistered === true);
  const [devices, setDevices] = useState(() => {
    if (!complexConfig?.deviceRegistered) return [];
    return generateHighRiseDevices(complexConfig || {});
  });
  const [history, setHistory] = useState(() => {
    if (!complexConfig?.deviceRegistered) return [];
    const d = generateHighRiseDevices(complexConfig || {});
    return generateInitialHistory(d);
  });
  const [viewMode, setViewMode] = useState('complex');
  const [selectedDong, setSelectedDong] = useState(null);
  const [activeTab, setActiveTab] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [terminalLogs, setTerminalLogs] = useState(['[SYSTEM] AXGATE 안전홈관리 시스템 가동 시작...', '[INFO] 보안 모듈 로드 완료.']);
  const [command, setCommand] = useState('');

  const firstDong = `${(complexConfig?.dongStartNum || 101)}동`;
  const firstUnit = `${firstDong} 101호`;

  const [batchScopeType, setBatchScopeType] = useState('all');
  const [batchScopeDong, setBatchScopeDong] = useState(firstDong);
  const [batchScopeUnit, setBatchScopeUnit] = useState(firstUnit);

  const [reportType, setReportType] = useState('complex');
  const [reportTargetDong, setReportTargetDong] = useState(firstDong);
  const [reportTargetUnit, setReportTargetUnit] = useState(firstUnit);
  const [scheduleType, setScheduleType] = useState('none');
  const [showUnitReportModal, setShowUnitReportModal] = useState(false);
  const [showFailureListModal, setShowFailureListModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const [emailConfig, setEmailConfig] = useState({ enabled: true, address: 'admin@axgate.com' });
  const [manualNote, setManualNote] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const [historyPage, setHistoryPage] = useState(1);
  const [logFilter, setLogFilter] = useState('all'); // 로그 필터 상태 추가

  // 공지사항 상태 관리 추가
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [noticeForm, setNoticeForm] = useState({ title: '', type: 'notice', content: '' });

  // 문의내역 상태 관리 (관리자용)
  const [inquiries, setInquiries] = useState(INITIAL_INQUIRIES);

  // 퀵 컨트롤 확인 모달 상태
  const [quickControlAction, setQuickControlAction] = useState(null); // 'start' | 'stop' | null

  // 세대 보고서 렌더링용 상태 및 헬퍼 함수
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [unitApprovals, setUnitApprovals] = useState([
    { role: '담 당', name: '박신일', date: new Date().toISOString().split('T')[0].substring(5).replace('-', '.'), status: 'approved' },
    { role: '관리소장', name: '', date: '', status: 'pending' },
    { role: '엔지니어', name: '', date: '', status: 'pending' }
  ]);

  const getUnitChecklist = (device) => {
    if (!device) return [];
    const isErr = device.status === 'error';
    return [
      { id: 'U-01', category: '시스템', item: '장비 전원 및 시스템 부팅 상태', result: isErr ? '불량' : '양호', note: isErr ? device.errorType : '정상 가동중' },
      { id: 'U-02', category: '시스템', item: 'CPU 및 메모리 점유율 안정성', result: '양호', note: '평균 30% 미만 점유' },
      { id: 'U-03', category: '네트워크', item: '내부망(LAN) 통신 상태', result: '양호', note: '1Gbps Link UP' },
      { id: 'U-04', category: '네트워크', item: 'VPN 터널링 연결 상태 (WAN)', result: isErr ? '불량' : '양호', note: isErr ? '터널링 단절 감지' : '터널 수립 완료' },
      { id: 'U-05', category: '보안', item: '최신 보안 정책(룰셋) 적용 여부', result: '양호', note: 'v2.4.1 동기화 완료' },
      { id: 'U-06', category: '보안', item: '비정상 트래픽 및 침해 시도 유무', result: '양호', note: '최근 7일 특이사항 없음' },
    ];
  };

  const itemsPerPage = 10;

  // Visualization States
  const [resourceData, setResourceData] = useState({ cpu: 15, memory: 30 });

  const [packetData, setPacketData] = useState(new Array(20).fill(0).map(() => (Math.random() * 50 + 20).toFixed(1)));
  const bgKey = `xg_bg_image_${complexConfig?.id || 'default'}`;
  const [bgImage, setBgImage] = useState(() => {
    try { return localStorage.getItem(bgKey) || null; } catch { return null; }
  });
  const buildDongPositions = (cfg) => {
    const cnt = cfg.dongCount || 10;
    const start = cfg.dongStartNum || 101;
    const pos = {};
    for (let i = 0; i < cnt; i++) {
      const cols = Math.ceil(Math.sqrt(cnt));
      const row = Math.floor(i / cols);
      const col = i % cols;
      const totalRows = Math.ceil(cnt / cols);
      pos[`${start + i}동`] = {
        top: 15 + (row / Math.max(totalRows - 1, 1)) * 65,
        left: 10 + (col / Math.max(cols - 1, 1)) * 80,
      };
    }
    return pos;
  };
  const [dongPositions, setDongPositions] = useState(() => {
    const cfg = complexConfig || {};
    const cnt = cfg.dongCount || 10;
    const start = cfg.dongStartNum || 101;
    const expectedDongs = Array.from({ length: cnt }, (_, i) => `${start + i}동`).sort();
    const cKey = `xg_dong_positions_${cfg.id || 'default'}`;
    try {
      const saved = localStorage.getItem(cKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        const savedDongs = Object.keys(parsed).sort();
        if (savedDongs.length === expectedDongs.length && savedDongs.every((d, i) => d === expectedDongs[i])) {
          return parsed;
        }
      }
    } catch {}
    const pos = buildDongPositions(cfg);
    try { localStorage.setItem(cKey, JSON.stringify(pos)); } catch {}
    return pos;
  });

  const [draggingDong, setDraggingDong] = useState(null);
  const [isMoved, setIsMoved] = useState(false);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPacketData(prev => [...prev.slice(1), (Math.random() * 60 + 20).toFixed(1)]);
      setResourceData(prev => ({
        cpu: Math.min(100, Math.max(5, prev.cpu + Math.floor(Math.random() * 15) - 7)),
        memory: Math.min(100, Math.max(10, prev.memory + Math.floor(Math.random() * 10) - 5))
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedDeviceId) {
      setHistoryPage(1);
      setLogFilter('all'); // 세대를 변경하면 로그 필터 초기화
    }
  }, [selectedDeviceId]);

  useEffect(() => {
    if (selectedDeviceId) {
      const device = devices.find(d => d.id === selectedDeviceId);
      if (device) {
        setBatchScopeType('unit');
        setBatchScopeDong(device.dong);
        setBatchScopeUnit(device.unit);
      }
    } else if (selectedDong) {
      setBatchScopeType('dong');
      setBatchScopeDong(selectedDong);
      setBatchScopeUnit('');
    } else {
      setBatchScopeType('all');
      setBatchScopeDong(firstDong);
      setBatchScopeUnit('');
    }
  }, [selectedDeviceId, selectedDong, devices]);

  const stats = useMemo(() => {
    const normal = devices.filter(d => d.status === 'normal').length;
    const error = devices.filter(d => d.status === 'error').length;
    return { normal, error, total: devices.length };
  }, [devices]);

  const failedDevices = useMemo(() => devices.filter(d => d.status === 'error'), [devices]);
  const uniqueDongs = useMemo(() => [...new Set(devices.map(d => d.dong))].sort(), [devices]);
  const getUnitsByDong = (dong) => devices.filter(d => d.dong === dong).map(d => d.unit).sort();
  const selectedDevice = useMemo(() => devices.find(d => d.id === selectedDeviceId), [devices, selectedDeviceId]);

  const buildingData = useMemo(() => {
    if (!selectedDong) return [];
    return [...new Set(devices.filter(d => d.dong === selectedDong).map(d => d.floor))]
      .sort((a, b) => b - a)
      .map(f => ({
        floor: f,
        units: devices.filter(d => d.dong === selectedDong && d.floor === f).sort((a, b) => a.room - b.room)
      }));
  }, [devices, selectedDong]);

  const nodeHistory = useMemo(() => {
    if (!selectedDevice) return [];
    let filtered = history.filter(h => String(h.unit) === String(selectedDevice.unit));

    // 필터 탭 논리 적용
    if (logFilter === 'error') {
      filtered = filtered.filter(h => h.type === 'error');
    } else if (logFilter === 'info') {
      filtered = filtered.filter(h => h.type === 'info');
    } else if (logFilter === 'human') {
      filtered = filtered.filter(h => h.category === 'human');
    }

    return filtered;
  }, [history, selectedDevice, logFilter]);

  const paginatedHistory = useMemo(() => {
    const startIndex = (historyPage - 1) * itemsPerPage;
    return nodeHistory.slice(startIndex, startIndex + itemsPerPage);
  }, [nodeHistory, historyPage]);

  const totalHistoryPages = Math.ceil(nodeHistory.length / itemsPerPage);

  const getTimestamp = () => new Date().toLocaleString();

  const handleDongMouseDown = (dong, e) => {
    if (viewMode !== 'complex') return;
    e.stopPropagation();
    setDraggingDong(dong);
    setIsMoved(false);
  };

  const handleContainerMouseMove = (e) => {
    if (!draggingDong || !mapContainerRef.current) return;
    setIsMoved(true);
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setDongPositions(prev => {
      const next = { ...prev, [draggingDong]: { top: y, left: x } };
      const cKey = `xg_dong_positions_${complexConfig?.id || 'default'}`;
      localStorage.setItem(cKey, JSON.stringify(next));
      return next;
    });
  };

  const handleContainerMouseUp = () => setDraggingDong(null);

  const handleDongClick = (dong) => {
    if (!isMoved) {
      enterBuilding(dong);
    }
  };

  // 공지사항 핸들러
  const handleOpenNoticeModal = (notice = null) => {
    if (notice) {
      setEditingNotice(notice);
      setNoticeForm({ title: notice.title, type: notice.type, content: notice.content });
    } else {
      setEditingNotice(null);
      setNoticeForm({ title: '', type: 'notice', content: '' });
    }
    setShowNoticeModal(true);
  };

  const handleSaveNotice = () => {
    const today = new Date().toISOString().split('T')[0];
    if (editingNotice) {
      setNotices(p => p.map(n => n.id === editingNotice.id ? { ...n, ...noticeForm } : n));
    } else {
      setNotices(p => [{ id: Date.now(), date: today, ...noticeForm }, ...p]);
    }
    setShowNoticeModal(false);
    setTerminalLogs(p => [...p, `> [ADMIN] 공지사항이 ${editingNotice ? '수정' : '등록'}되었습니다.`]);
  };

  const handleDeleteNotice = (id, e) => {
    e.stopPropagation();
    setNotices(p => p.filter(n => n.id !== id));
    setTerminalLogs(p => [...p, `> [ADMIN] 공지사항이 삭제되었습니다.`]);
  };

  const returnToComplex = () => {
    setViewMode('complex');
    setSelectedDong(null);
    setSelectedDeviceId(null);
    setActiveTab('grid');
    setTerminalLogs(prev => [...prev, `[NAV] 단지 전체 배치도로 복귀.`]);
  };

  const enterBuilding = (dongName) => {
    setSelectedDong(String(dongName));
    setViewMode('building');
    setSelectedDeviceId(null);
    setTerminalLogs(prev => [...prev, `[NAV] Entering Building ${dongName}...`]);
  };

  const togglePower = (id) => {
    const manualErrorTypes = ['강제 재부팅 중 응답없음', '시스템 초기화 실패', '네트워크 재설정 오류'];
    setDevices(prev => prev.map(d => {
      if (d.id === id) {
        const newStatus = d.status === 'normal' ? 'error' : 'normal';
        return {
          ...d,
          status: newStatus,
          errorType: newStatus === 'error' ? manualErrorTypes[Math.floor(Math.random() * manualErrorTypes.length)] : null
        };
      }
      return d;
    }));
    setTerminalLogs(prev => [...prev, `[CMD] Power toggle signal sent.`]);
  };

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    if (!command.trim()) return;
    let target = '전체 단지';
    if (batchScopeType === 'dong') target = `${batchScopeDong}`;
    if (batchScopeType === 'unit') target = `${batchScopeDong} ${batchScopeUnit}호`;
    setTerminalLogs(prev => [...prev, `> [통합 명령] 대상: ${target} / 명령: ${command}`, '[SYS] 명령어가 대기열에 추가되었습니다.']);
    setCommand('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setBgImage(dataUrl);
        try { localStorage.setItem(bgKey, dataUrl); } catch {}
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHistoryClick = (unit) => {
    const device = devices.find(d => d.unit === unit);
    if (device) {
      if (viewMode === 'complex') {
        enterBuilding(device.dong);
      }
      setSelectedDeviceId(device.id);
    }
  };

  const executeQuickControl = () => {
    if (quickControlAction === 'start') {
      setDevices(p => p.map(d => ({...d, status: 'normal', errorType: null})));
      setTerminalLogs(p => [...p, '> [ADMIN] 전체 시스템 일괄 기동 명령이 정상적으로 실행되었습니다.']);
    } else if (quickControlAction === 'stop') {
      setDevices(p => p.map(d => ({...d, status: 'error', errorType: '시스템 일괄 중단'})));
      setTerminalLogs(p => [...p, '> [ADMIN] 주의: 전체 시스템 일괄 중단 명령이 실행되었습니다.']);
    }
    setQuickControlAction(null);
  };

  const handleDeviceRegister = () => {
    const cfg = complexConfig || {};
    const newDevices = generateHighRiseDevices(cfg);
    setDevices(newDevices);
    setHistory(generateInitialHistory(newDevices));
    const pos = buildDongPositions(cfg);
    setDongPositions(pos);
    try { localStorage.setItem(`xg_dong_positions_${cfg.id || 'default'}`, JSON.stringify(pos)); } catch {}
    setIsDeviceRegistered(true);
    if (onRegisterDevice) onRegisterDevice();
  };

  if (!isDeviceRegistered) {
    return (
      <div className="bg-slate-50 text-slate-800 rounded-[2.5rem] p-6 md:p-10 font-sans select-none relative overflow-hidden flex flex-col items-center justify-center shadow-sm border border-slate-200/60 animate-in fade-in duration-500 min-h-[500px]">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/15 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center mb-6 shadow-sm border border-indigo-200/50">
            <Shield className="w-10 h-10 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3">장비 등록이 필요합니다</h2>
          <p className="text-sm text-slate-500 mb-2 leading-relaxed">
            <span className="font-bold text-slate-700">{complexConfig?.name || '선택된 단지'}</span>의 단지관리 시스템을 사용하려면 먼저 장비 등록을 완료해야 합니다.
          </p>
          <div className="w-full bg-white rounded-2xl border border-slate-200 p-5 mb-6 text-left">
            <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">등록 예정 구성 정보</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-[11px] text-slate-400 mb-0.5">동 수</div>
                <div className="text-lg font-black text-slate-800">{complexConfig?.dongCount || 10}<span className="text-xs font-normal text-slate-400 ml-1">개동</span></div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-[11px] text-slate-400 mb-0.5">시작 동번호</div>
                <div className="text-lg font-black text-slate-800">{complexConfig?.dongStartNum || 101}<span className="text-xs font-normal text-slate-400 ml-1">동</span></div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-[11px] text-slate-400 mb-0.5">층 수</div>
                <div className="text-lg font-black text-slate-800">{complexConfig?.floorCount || 20}<span className="text-xs font-normal text-slate-400 ml-1">층</span></div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-[11px] text-slate-400 mb-0.5">층당 호수</div>
                <div className="text-lg font-black text-slate-800">{complexConfig?.unitsPerFloor || 2}<span className="text-xs font-normal text-slate-400 ml-1">세대</span></div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs text-slate-400">총 세대 수</span>
              <span className="text-sm font-black text-indigo-600">{(complexConfig?.dongCount || 10) * (complexConfig?.floorCount || 20) * (complexConfig?.unitsPerFloor || 2)}세대</span>
            </div>
          </div>
          {isAdmin ? (
            <button onClick={handleDeviceRegister} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> 장비 등록 및 시스템 활성화
            </button>
          ) : (
            <div className="px-6 py-3 bg-slate-100 text-slate-500 rounded-2xl text-sm font-bold border border-slate-200 flex items-center gap-2">
              <Lock className="w-4 h-4" /> 관리자(ADMIN)만 등록할 수 있습니다
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-800 rounded-[2.5rem] p-4 md:p-6 font-sans select-none relative overflow-hidden flex flex-col shadow-sm border border-slate-200/60 animate-in fade-in duration-500">

      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-[120px]" />
      </div>

      {/* --- Modals --- */}
      {/* 세대 전용 보고서 미리보기 모달 */}
      {showReportPreview && selectedDevice && (
        <DocumentPreviewModal
          onClose={() => setShowReportPreview(false)}
          title={`${selectedDevice.unit} 보안 인프라 점검 보고서`}
          date={new Date().toISOString().split('T')[0]}
          approvals={unitApprovals}
          checklist={getUnitChecklist(selectedDevice)}
          type="unit"
          customMeta={[
            { label: '대상 단지', value: '디에이치 아너힐즈' },
            { label: '대상 세대', value: selectedDevice.unit },
            { label: '장비 시리얼', value: selectedDevice.serial },
            { label: '펌웨어 버전', value: selectedDevice.osVersion }
          ]}
        />
      )}

      {/* 퀵 컨트롤 확인 모달 */}
      {quickControlAction && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setQuickControlAction(null)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-slate-100 flex flex-col">
            <div className="flex flex-col items-center text-center mb-8 mt-2">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-inner ${quickControlAction === 'start' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {quickControlAction === 'start' ? <Zap size={32} /> : <ShieldAlert size={32} />}
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                {quickControlAction === 'start' ? '전체 단말 일괄 기동' : '전체 단말 강제 중단'}
              </h2>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                {quickControlAction === 'start'
                  ? '단지 내 전체 망분리 세대 장비를 일괄적으로 정상 가동 상태로 전환하시겠습니까?'
                  : <span className="text-rose-600 font-bold">주의: 단지 내 전체 망분리 세대 장비의 통신을 강제로 중단합니다.<br/>이 작업은 세대 내 서비스 장애를 유발할 수 있습니다.</span>}
              </p>
            </div>
            <div className="flex gap-3 w-full">
              <button onClick={() => setQuickControlAction(null)} className="flex-1 py-3.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">취소</button>
              <button onClick={executeQuickControl} className={`flex-1 py-3.5 rounded-xl text-sm font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 ${quickControlAction === 'start' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'}`}>
                {quickControlAction === 'start' ? <><Zap size={16}/> 기동 실행</> : <><ShieldAlert size={16}/> 중단 실행</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 공지사항 등록/수정 모달 */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowNoticeModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-slate-100">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Megaphone className="text-indigo-600" size={20}/>
                {editingNotice ? '공지사항 수정' : '새 공지사항 등록'}
              </h2>
              <button onClick={() => setShowNoticeModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">분류</label>
                <select
                  value={noticeForm.type}
                  onChange={(e) => setNoticeForm({...noticeForm, type: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                >
                  <option value="urgent">긴급 (Urgent)</option>
                  <option value="notice">일반 (Notice)</option>
                  <option value="update">업데이트 (Update)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">제목</label>
                <input
                  type="text"
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({...noticeForm, title: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  placeholder="제목을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">내용</label>
                <textarea
                  value={noticeForm.content}
                  onChange={(e) => setNoticeForm({...noticeForm, content: e.target.value})}
                  className="w-full h-32 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none custom-scrollbar"
                  placeholder="공지 내용을 입력하세요"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowNoticeModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">취소</button>
              <button onClick={handleSaveNotice} disabled={!noticeForm.title || !noticeForm.content} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-md">저장하기</button>
            </div>
          </div>
        </div>
      )}

      {/* 문의 접수/확인 모달 (권한별 분기) */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowFeedbackModal(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-slate-100 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${isAdmin ? 'bg-slate-800' : 'bg-indigo-600'}`}>
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{isAdmin ? '접수된 문의 내역 관리' : '문의 사항 접수'}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isAdmin ? '고객 및 하위 관리자가 남긴 시스템 관련 문의 목록입니다.' : '시스템 관련 문의나 기술 지원 요청을 남겨주세요.'}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowFeedbackModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
            </div>

            {isAdmin ? (
              // 관리자 모드: 문의 내역 리스트 렌더링
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                {inquiries.map(inq => (
                  <div key={inq.id} className={`p-5 rounded-2xl border transition-all ${inq.status === '대기중' ? 'bg-white border-indigo-100 shadow-md' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide ${inq.status === '대기중' ? 'bg-rose-100 text-rose-600' : 'bg-slate-200 text-slate-600'}`}>
                          {inq.status}
                        </span>
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${inq.type === '장애' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                          {inq.type}
                        </span>
                        <span className="text-sm font-bold text-slate-800 ml-1">{inq.user}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono bg-white px-2 py-1 rounded-lg border border-slate-100">{inq.date}</span>
                    </div>
                    <p className={`text-sm leading-relaxed ${inq.status === '대기중' ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                      {inq.content}
                    </p>
                    {inq.status === '대기중' && (
                      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={() => {
                            setInquiries(prev => prev.map(item => item.id === inq.id ? { ...item, status: '처리완료' } : item));
                            setTerminalLogs(p => [...p, `> [ADMIN] ${inq.user}의 문의가 처리 완료 상태로 변경되었습니다.`]);
                          }}
                          className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                        >
                          <CheckCircle2 size={14} /> 처리 완료로 변경
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // 사용자 모드: 문의 작성 폼 렌더링
              <div className="flex flex-col flex-1">
                <textarea
                  className="flex-1 min-h-[200px] p-5 bg-slate-50 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none mb-6 text-slate-700 leading-relaxed custom-scrollbar placeholder:text-slate-400"
                  placeholder="시스템 장애, 기능 요청 등 관리자에게 전달할 내용을 자세히 적어주세요..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                />
                <div className="flex justify-end gap-3 shrink-0">
                  <button onClick={() => setShowFeedbackModal(false)} className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">취소</button>
                  <button
                    onClick={() => {
                      setTerminalLogs(p => [...p, '[SUPPORT] 고객 센터로 문의사항이 성공적으로 전송되었습니다.']);
                      setShowFeedbackModal(false);
                      setFeedbackText('');
                    }}
                    disabled={!feedbackText.trim()}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-md shadow-indigo-200 flex items-center gap-2"
                  >
                    <Send size={16} /> 문의 접수하기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 장애 세대 목록 모달 */}
      {showFailureListModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowFailureListModal(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[80vh] border border-slate-100">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
               <div className="flex items-center gap-3">
                 <div className="p-2.5 bg-rose-50 rounded-xl"><ShieldAlert className="text-rose-600" size={24} /></div>
                 <div>
                   <h2 className="text-xl font-bold text-slate-800">장애 세대 목록</h2>
                   <p className="text-xs text-slate-400 font-medium">Critical Failure Nodes</p>
                 </div>
               </div>
               <button onClick={() => setShowFailureListModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-slate-200">
               {failedDevices.map(d => (
                 <div key={d.id} className="p-4 bg-rose-50/30 rounded-2xl border border-rose-100 flex items-center justify-between hover:bg-rose-50 transition-colors cursor-pointer group" onClick={() => { enterBuilding(d.dong); setSelectedDeviceId(d.id); setShowFailureListModal(false); }}>
                    <div className="flex items-center gap-4">
                       <Siren size={20} className="text-rose-500 animate-pulse" />
                       <span className="text-base font-bold text-rose-800">{String(d.unit)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-mono text-rose-400 bg-white px-2 py-1 rounded-lg border border-rose-100">{String(d.serial)}</span>
                       <ChevronRight className="text-rose-300 group-hover:translate-x-1 transition-transform" size={18} />
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}

      {/* 세대 리포트 모달 */}
      {showUnitReportModal && selectedDevice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowUnitReportModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setShowUnitReportModal(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 border border-indigo-100 shadow-sm">
                <FileCode size={28} className="text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">세대 보고서 출력</h2>
              <p className="text-xs text-slate-400 font-medium mt-1">Target: <span className="font-bold text-slate-600">{String(selectedDevice.unit)}</span></p>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700 mb-1">자동 발송 대상</span>
                  <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit">{String(emailConfig.address)}</span>
                </div>
                <button onClick={() => { setTerminalLogs(p => [...p, `[REPORT] Sent to ${emailConfig.address}`]); setShowUnitReportModal(false); }} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 flex items-center gap-2">
                  <Send size={14} /> 즉시 발송
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['PDF', 'Excel', 'Word'].map((fmt, i) => (
                  <button key={fmt} onClick={() => { if(fmt === 'PDF') { setShowUnitReportModal(false); setShowReportPreview(true); } }} className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-500 hover:shadow-lg transition-all group">
                     {i === 0 ? <FileDown size={24} className="text-slate-400 group-hover:text-red-500"/> : i === 1 ? <FileSpreadsheet size={24} className="text-slate-400 group-hover:text-emerald-500"/> : <FileText size={24} className="text-slate-400 group-hover:text-blue-600"/>}
                     <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-800">{fmt === 'PDF' ? 'PDF 미리보기' : fmt}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col w-full space-y-6 relative z-10 overflow-hidden">

        {/* --- Header --- */}
        <header className="bg-white/90 backdrop-blur-xl p-5 rounded-[2rem] shadow-md border border-white/50 flex flex-col lg:flex-row justify-between items-center gap-6 shrink-0">
          <div className="flex items-center gap-5 cursor-pointer" onClick={returnToComplex}>
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl shadow-lg flex items-center justify-center text-white">
              <ShieldCheck size={30} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight hover:text-indigo-600 transition-colors">엑스게이트 홈안전관리솔루션</h1>
                {selectedDong && (
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100 flex items-center gap-1">
                    <Building2 size={12} /> {String(selectedDong)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-xs font-medium text-slate-500">System Operational</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 overflow-x-auto custom-scrollbar">
            <div className="flex gap-4 shrink-0">
              <div className="flex flex-col items-end px-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Normal</span>
                <span className="text-3xl font-black text-emerald-600 tabular-nums leading-none drop-shadow-sm">{String(stats.normal)}</span>
              </div>
              <div className="w-[2px] h-10 bg-slate-100"></div>
              <div className="flex flex-col items-start px-2 cursor-pointer group" onClick={() => setShowFailureListModal(true)}>
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider group-hover:text-rose-600">Failure</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-3xl font-black text-rose-600 tabular-nums leading-none drop-shadow-sm">{String(stats.error)}</span>
                  {stats.error > 0 && <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span></span>}
                </div>
              </div>
            </div>

            <nav className="flex items-center bg-slate-100 p-1.5 rounded-2xl shadow-inner shrink-0">
              {[
                { id: 'grid', icon: MapIcon, label: '실시간 관제' },
                { id: 'history', icon: HistoryIcon, label: '장애 이력' },
                { id: 'report', icon: FileText, label: '보고서 센터' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); if(tab.id === 'grid') returnToComplex(); }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-md transform scale-105' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <tab.icon size={16} /> {tab.label}
                </button>
              ))}
              <div className="w-[1px] h-6 bg-slate-300 mx-1"></div>
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-slate-500 hover:text-indigo-600 transition-all hover:bg-white hover:shadow-sm"
              >
                {isAdmin ? <MessageSquarePlus size={16} /> : <MessageCircle size={16} />}
                {isAdmin ? '문의내용 확인' : '문의 접수'}
              </button>
            </nav>
          </div>
        </header>

        {/* --- Main Grid --- */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1 min-h-[900px]">

          {/* Left Panel: Map & Console */}
          <div className="xl:col-span-8 flex flex-col gap-6 h-full">

            {/* Visualizer Container */}
            <div className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden flex flex-col relative group min-h-[600px]">

              {/* Toolbar */}
              <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-3">
                  {viewMode === 'building' && (
                    <button onClick={returnToComplex} className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-slate-100 hover:bg-slate-50 transition-all text-slate-600 group">
                      <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/>
                    </button>
                  )}
                  <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-slate-100 text-sm font-bold text-slate-600 flex items-center gap-2">
                    <Globe size={16} className="text-indigo-500"/>
                    {viewMode === 'complex' ? '단지 전체 배치도' : `${selectedDong} 상세 관제`}
                    {!isAdmin && <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-400 text-[10px] rounded">읽기 전용</span>}
                    {isAdmin && <span className="ml-2 px-2 py-0.5 bg-rose-100 text-rose-600 text-[10px] rounded">최고 권한</span>}
                  </div>
                </div>

                {/* 관리자에게만 퀵 컨트롤(전체 기동/중단) 버튼 노출 */}
                {isAdmin && (
                  <div className="pointer-events-auto bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-slate-100 items-center gap-2 hidden md:flex">
                    <span className="text-[10px] font-bold text-slate-400 uppercase px-2">Quick Control</span>
                    <button onClick={() => setQuickControlAction('start')} className="px-3 py-1.5 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold" title="전체 기동">
                      <Zap size={14}/> 기동
                    </button>
                    <button onClick={() => setQuickControlAction('stop')} className="px-3 py-1.5 hover:bg-rose-50 text-rose-600 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold" title="전체 중단">
                      <ShieldAlert size={14}/> 중단
                    </button>
                  </div>
                )}
              </div>

              {/* Map Content */}
              <div
                className="flex-1 bg-slate-50/50 relative overflow-hidden min-h-[400px]"
                onMouseMove={handleContainerMouseMove}
                onMouseUp={handleContainerMouseUp}
              >
                {activeTab === 'grid' && (
                  viewMode === 'complex' ? (
                    <div ref={mapContainerRef} className="absolute inset-0 flex items-center justify-center p-8">
                        <div className="relative w-full h-full max-w-5xl bg-white rounded-[3rem] shadow-xl overflow-hidden border border-slate-200">
                          {/* Background Image */}
                          <div className="absolute inset-0 bg-slate-100 pointer-events-none">
                             {bgImage ? (
                               <>
                                 <img src={bgImage} alt="Map" className="w-full h-full object-cover" />
                                 <div className="absolute bottom-4 right-4 flex items-center gap-2 pointer-events-auto z-20">
                                   <label className="px-4 py-2 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl text-xs font-bold text-slate-600 cursor-pointer hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-lg flex items-center gap-2">
                                     <Upload size={14}/> 배치도 변경
                                     <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                   </label>
                                   <button onClick={() => { setBgImage(null); try { localStorage.removeItem(bgKey); } catch {} }} className="px-4 py-2 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl text-xs font-bold text-rose-500 hover:border-rose-300 hover:bg-rose-50 transition-all shadow-lg flex items-center gap-2">
                                     <Trash2 size={14}/> 삭제
                                   </button>
                                 </div>
                               </>
                             ) : (
                               <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-slate-300">
                                  <MapIcon size={64} strokeWidth={1} />
                                  <label className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-500 cursor-pointer hover:border-indigo-300 hover:text-indigo-600 transition-all pointer-events-auto shadow-sm flex items-center gap-2">
                                    <Upload size={16}/> 배치도 이미지 업로드
                                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                  </label>
                                  <p className="text-xs">이미지를 업로드하면 배경으로 설정됩니다.</p>
                               </div>
                             )}
                          </div>

                          {/* Dong Icons */}
                          {Object.entries(dongPositions).map(([dong, pos]) => {
                             const errors = devices.filter(d => d.dong === dong && d.status === 'error').length;
                             return (
                              <div
                                key={dong}
                                style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
                                className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-move ${draggingDong === dong ? 'z-50 scale-110' : 'hover:scale-105'} transition-transform`}
                                onMouseDown={(e) => handleDongMouseDown(dong, e)}
                              >
                                <button
                                  onClick={() => handleDongClick(dong)}
                                  className={`relative flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border shadow-lg transition-colors min-w-[80px] ${errors > 0 ? 'bg-white border-rose-500 shadow-rose-100' : 'bg-white border-indigo-600 shadow-indigo-100'}`}
                                >
                                   {errors > 0 ? <Siren size={24} className="text-rose-500 animate-pulse" /> : <Building2 size={24} className="text-indigo-600" />}
                                   <span className={`text-xs font-black leading-none ${errors > 0 ? 'text-rose-600' : 'text-slate-700'}`}>{String(dong)}</span>
                                   {errors > 0 && <div className="absolute -top-2 -right-2 bg-rose-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold border-2 border-white">{errors}</div>}
                                </button>
                              </div>
                             );
                          })}
                        </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 overflow-y-auto p-12 scrollbar-thin scrollbar-thumb-slate-200">
                      <div className="max-w-4xl mx-auto space-y-8 pb-12">
                        {buildingData.map(floor => (
                          <div key={floor.floor} className="flex items-center gap-4 sm:gap-8">
                            <div className="w-12 sm:w-16 text-right font-mono font-bold text-slate-300 text-sm">{String(floor.floor)}F</div>
                            <div className="flex-1 grid grid-cols-2 gap-4 sm:gap-6">
                              {floor.units.map(unit => (
                                <button
                                  key={unit.id}
                                  onClick={() => setSelectedDeviceId(unit.id)}
                                  className={`
                                    relative p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col group
                                    ${selectedDeviceId === unit.id
                                      ? 'border-indigo-600 bg-indigo-50 shadow-md ring-2 ring-indigo-100'
                                      : unit.status === 'error'
                                        ? 'border-rose-200 bg-white hover:border-rose-400 hover:bg-rose-50'
                                        : 'border-slate-100 bg-white hover:border-emerald-400 hover:shadow-sm'}
                                  `}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                      <div className={`w-3 h-3 rounded-full ${unit.status === 'normal' ? 'bg-emerald-400' : 'bg-rose-500 animate-pulse'}`} />
                                      <span className="text-xs sm:text-sm font-bold text-slate-700 font-mono">{String(unit.unit).split(' ')[1]}</span>
                                    </div>
                                    {unit.status === 'normal'
                                      ? <Lock size={16} className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                      : <ShieldAlert size={16} className="text-rose-500" />
                                    }
                                  </div>
                                  {unit.status === 'error' && (
                                    <div className="mt-3 text-[10px] sm:text-xs text-rose-600 font-bold bg-rose-50 px-2 py-1.5 rounded-lg w-full text-left flex items-center gap-1.5 border border-rose-100/50">
                                      <AlertCircle size={14} className="shrink-0" />
                                      <span className="truncate">{unit.errorType}</span>
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}

                {/* History View */}
                {activeTab === 'history' && (
                  <div className="absolute inset-0 overflow-y-auto p-4 sm:p-12 scrollbar-thin scrollbar-thumb-slate-200">
                    <div className="max-w-4xl mx-auto space-y-4">
                      {history.map(h => (
                        <div
                          key={h.id}
                          className="p-5 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors flex items-start gap-5 shadow-sm cursor-pointer group"
                          onClick={() => handleHistoryClick(h.unit)}
                        >
                           <div className={`mt-1 p-3 rounded-xl ${h.type === 'error' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                             {h.category === 'human' ? <User size={20} /> : <Bot size={20} />}
                           </div>
                           <div className="flex-1">
                             <div className="flex items-center justify-between mb-1.5">
                               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                 <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{String(h.unit)}</span>
                                 <span className={`text-[10px] px-2 py-0.5 rounded w-fit ${h.category === 'human' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                                   {h.category === 'human' ? '관리자 조치' : '시스템 로그'}
                                 </span>
                               </div>
                               <span className="text-xs text-slate-400 font-mono">{String(h.timestamp)}</span>
                             </div>
                             <p className="text-sm text-slate-600 leading-relaxed font-medium">{String(h.message)}</p>
                             {h.user && <p className="text-xs text-indigo-500 mt-1 font-bold">담당자: {String(h.user)}</p>}
                           </div>
                           <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-400 mt-4 hidden sm:block" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Report Center with Select Inputs */}
                {activeTab === 'report' && (
                  <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-12 bg-slate-50/50 overflow-y-auto">
                     <div className="bg-white p-6 sm:p-12 rounded-[2.5rem] shadow-xl border border-slate-100 text-center max-w-4xl w-full">
                        <FileText size={64} className="text-indigo-200 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-slate-800">통합 보고서 센터</h3>
                        <p className="text-sm text-slate-400 mb-10 mt-2">장애 리포트 발송 (즉시/예약) 및 수동 내보내기</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                           {/* 자동 발송 섹션 */}
                           <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100 space-y-6">
                              <h4 className="text-sm font-bold text-indigo-600 flex items-center gap-2"><Mail size={16}/> 장애 리포트 발송</h4>

                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <label className="text-xs font-bold text-slate-500">발송 범위</label>
                                  <div className="grid grid-cols-3 gap-2">
                                    {['complex', 'dong', 'unit'].map(type => (
                                      <button key={type} onClick={() => setReportType(type)} className={`py-2 rounded-xl text-xs font-bold transition-all ${reportType === type ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500'}`}>
                                        {type === 'complex' ? '단지전체' : type === 'dong' ? '동별' : '세대별'}
                                      </button>
                                    ))}
                                  </div>

                                  {/* Select for Dong/Unit */}
                                  <div className="flex gap-2 mt-2">
                                    {reportType !== 'complex' && (
                                      <select
                                        className="w-full bg-white border border-slate-200 text-xs text-slate-600 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                                        value={reportTargetDong}
                                        onChange={(e) => setReportTargetDong(e.target.value)}
                                      >
                                        {uniqueDongs.map(d => <option key={d} value={d}>{d}</option>)}
                                      </select>
                                    )}
                                    {reportType === 'unit' && (
                                      <select
                                        className="w-full bg-white border border-slate-200 text-xs text-slate-600 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                                        value={reportTargetUnit}
                                        onChange={(e) => setReportTargetUnit(e.target.value)}
                                      >
                                        <option value="">호수 선택</option>
                                        {getUnitsByDong(reportTargetDong).map(u => (
                                          <option key={u} value={u}>{u.split(' ')[1]}</option>
                                        ))}
                                      </select>
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <label className="text-xs font-bold text-slate-500">예약 발송 주기</label>
                                  <div className="grid grid-cols-4 gap-2">
                                    {[{id: 'none', lbl: '안함'}, {id: 'daily', lbl: '매일'}, {id: 'weekly', lbl: '매주'}, {id: 'monthly', lbl: '매월'}].map(s => (
                                      <button key={s.id} onClick={() => setScheduleType(s.id)} className={`py-2 rounded-xl text-xs font-bold transition-all ${scheduleType === s.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500'}`}>
                                        {s.lbl}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <label className="text-xs font-bold text-slate-500 block mb-2">수신 이메일</label>
                                  <input type="email" value={emailConfig.address} onChange={(e) => setEmailConfig({...emailConfig, address: e.target.value})} className="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-indigo-200 outline-none" />
                                </div>

                                <div className="pt-2">
                                  <button onClick={() => { setTerminalLogs(p => [...p, `[REPORT] 장애 리포트가 ${emailConfig.address}로 즉시 발송되었습니다.`]); }} className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all flex items-center justify-center gap-2">
                                    <Send size={14}/> 이메일 즉시 발송
                                  </button>
                                </div>
                              </div>
                           </div>

                           {/* 수동 내보내기 섹션 */}
                           <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100 space-y-6">
                              <h4 className="text-sm font-bold text-emerald-600 flex items-center gap-2"><Download size={16}/> 리포트 수동 다운로드</h4>
                              <div className="space-y-3">
                                <button className="w-full flex items-center justify-between px-6 py-4 bg-white rounded-2xl border border-slate-200 text-xs font-bold hover:border-emerald-500 hover:shadow-md transition-all group">
                                  <span>Excel 형식 다운로드</span> <FileSpreadsheet size={20} className="text-slate-400 group-hover:text-emerald-500"/>
                                </button>
                                <button className="w-full flex items-center justify-between px-6 py-4 bg-white rounded-2xl border border-slate-200 text-xs font-bold hover:border-red-500 hover:shadow-md transition-all group">
                                  <span>PDF 형식 다운로드</span> <FileDown size={20} className="text-slate-400 group-hover:text-red-500"/>
                                </button>
                                <button className="w-full flex items-center justify-between px-6 py-4 bg-white rounded-2xl border border-slate-200 text-xs font-bold hover:border-blue-600 hover:shadow-md transition-all group">
                                  <span>Word 형식 다운로드</span> <FileText size={20} className="text-slate-400 group-hover:text-blue-600"/>
                                </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                )}
              </div>
            </div>

            {/* Console - Dropdown Inputs : 관리자(Admin)에게만 터미널 노출 */}
            {isAdmin && (
              <div className="h-[22rem] bg-[#0f172a] rounded-[2rem] p-5 flex flex-col shadow-2xl border border-slate-700/60 shrink-0 relative overflow-hidden group">
                {/* 상단 앰비언트 라이트 라인 효과 */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

                {/* Header */}
                <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-4 px-2 relative z-10">
                   <div className="flex items-center gap-3">
                     <div className="p-2 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-indigo-400 shadow-inner">
                       <Terminal size={16}/>
                     </div>
                     <div>
                       <span className="text-sm font-black text-slate-200 tracking-wide block">
                         AXGATE COMMAND CLI
                       </span>
                       <span className="text-[10px] text-slate-500 font-mono">Secure Root Access Session</span>
                     </div>
                   </div>
                   <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                     <span className="flex h-1.5 w-1.5 relative">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                     </span>
                     <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">System Online</span>
                   </div>
                </div>

                {/* Filters & Scopes (다크 테마에 맞게 톤다운 및 항상 노출 연동) */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 px-2 relative z-10">
                    <div className={`flex items-center gap-2 bg-slate-800/80 border rounded-xl px-3 py-2 shadow-inner transition-colors cursor-pointer ${batchScopeType === 'all' ? 'border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.15)]' : 'border-slate-700 hover:border-slate-500'}`}>
                      <Filter size={14} className={batchScopeType === 'all' ? "text-indigo-400" : "text-slate-500"}/>
                      <select
                        value={batchScopeType}
                        onChange={(e) => {
                          setBatchScopeType(e.target.value);
                          if (e.target.value === 'all') setBatchScopeUnit('');
                        }}
                        className={`bg-transparent border-none text-xs font-bold focus:ring-0 outline-none cursor-pointer ${batchScopeType === 'all' ? 'text-indigo-300' : 'text-slate-400'}`}
                      >
                        <option value="all">전체 단지</option>
                        <option value="dong">동별 선택</option>
                        <option value="unit">세대별 선택</option>
                      </select>
                    </div>

                    <div className={`flex items-center gap-2 bg-slate-800/80 border rounded-xl px-3 py-2 shadow-inner transition-colors cursor-pointer ${batchScopeType === 'dong' ? 'border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.15)]' : 'border-slate-700 hover:border-slate-500'}`}>
                      <select
                        value={batchScopeDong}
                        onChange={(e) => {
                          setBatchScopeDong(e.target.value);
                          setBatchScopeType('dong');
                          setBatchScopeUnit('');
                        }}
                        className={`bg-transparent border-none text-xs font-bold focus:ring-0 outline-none cursor-pointer ${batchScopeType === 'dong' ? 'text-indigo-300' : 'text-slate-400'}`}
                      >
                        {uniqueDongs.map(d => <option key={d} value={d} className="text-slate-800">{d}</option>)}
                      </select>
                    </div>

                    <div className={`flex items-center gap-2 bg-slate-800/80 border rounded-xl px-3 py-2 shadow-inner transition-colors cursor-pointer ${batchScopeType === 'unit' ? 'border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.15)]' : 'border-slate-700 hover:border-slate-500'}`}>
                      <select
                        value={batchScopeUnit}
                        onChange={(e) => {
                          setBatchScopeUnit(e.target.value);
                          if(e.target.value !== '') setBatchScopeType('unit');
                        }}
                        className={`bg-transparent border-none text-xs font-bold focus:ring-0 outline-none cursor-pointer ${batchScopeType === 'unit' ? 'text-indigo-300' : 'text-slate-400'}`}
                      >
                        <option value="" className="text-slate-500">호수 선택</option>
                        {getUnitsByDong(batchScopeDong).map(u => (
                          <option key={u} value={u} className="text-slate-800">{u.split(' ')[1]}</option>
                        ))}
                      </select>
                    </div>
                </div>

                {/* Log Output Area */}
                <div className="flex-1 overflow-y-auto font-mono text-xs space-y-2.5 px-3 mb-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent relative z-10">
                    {terminalLogs.slice().reverse().map((l, i) => (
                      <div key={i} className={`${String(l).startsWith('>') ? 'text-indigo-300 font-bold' : String(l).includes('ERROR') || String(l).includes('실패') || String(l).includes('차단') ? 'text-rose-400' : 'text-slate-300'} flex items-start gap-3`}>
                         <span className="text-slate-500 min-w-[65px] text-[10px] mt-0.5 shrink-0">[{new Date().toLocaleTimeString('en-US', {hour12:false})}]</span>
                         <span className="leading-relaxed break-all">{String(l)}</span>
                      </div>
                    ))}
                </div>

                {/* Input Area (모던 프롬프트 입력창) */}
                <div className="flex items-center gap-3 bg-black/40 px-4 py-3 rounded-xl border border-slate-700 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shrink-0 relative z-10 shadow-inner">
                   <span className="font-mono text-sm font-bold flex items-center gap-1.5">
                     <span className="text-emerald-400">admin</span>
                     <span className="text-slate-500">@</span>
                     <span className="text-indigo-400">axgate</span>
                     <span className="text-slate-500">~#</span>
                   </span>
                   <input
                     type="text"
                     value={command}
                     onChange={e => setCommand(e.target.value)}
                     onKeyDown={e => e.key === 'Enter' && handleCommandSubmit(e)}
                     className="bg-transparent border-none text-sm text-slate-200 w-full focus:ring-0 outline-none font-mono placeholder:text-slate-600"
                     placeholder="명령어 입력 (ex: reboot -f all)..."
                   />
                   <button onClick={handleCommandSubmit} className="p-1.5 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors">
                     <Send size={16}/>
                   </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Detail & Board */}
          <div className="xl:col-span-4 h-full">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200/60 h-full flex flex-col relative min-h-[900px]">
              {selectedDeviceId ? (
                <div className="flex-1 flex flex-col">
                   <div className="p-8 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur z-10">
                      <div className="flex items-center gap-4">
                         <div className={`w-4 h-4 rounded-full ${selectedDevice.status === 'normal' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                         <div>
                            <h2 className="text-2xl font-bold text-slate-800 leading-none">{String(selectedDevice.unit)}</h2>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-mono text-slate-400">{String(selectedDevice.serial)}</span>
                              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">{selectedDevice.model}</span>
                            </div>
                         </div>
                      </div>
                      <button onClick={() => setShowUnitReportModal(true)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors"><FileText size={18}/></button>
                   </div>

                   <div className="flex-1 overflow-y-auto scrollbar-thin p-8 space-y-8">
                      {/* --- CPU/Memory Usage Display --- */}
                      <div className="grid grid-cols-2 gap-4">
                        <CircularProgress
                          value={resourceData.cpu}
                          label="CPU Load"
                          icon={Cpu}
                          colorClass="text-blue-500"
                          strokeColor="#3b82f6"
                        />
                        <CircularProgress
                          value={resourceData.memory}
                          label="Memory"
                          icon={HardDrive}
                          colorClass="text-indigo-500"
                          strokeColor="#6366f1"
                        />
                      </div>

                      {/* 권한(isAdmin)에 따른 하단 제어부 렌더링 분기 */}
                      {isAdmin ? (
                        <>
                          {/* 제어 버튼 그룹 (관리자용) */}
                          <div className="grid grid-cols-3 gap-3">
                             <button onClick={() => togglePower(selectedDeviceId)} className="py-4 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-bold text-slate-600 hover:border-rose-200 hover:text-rose-600 hover:bg-rose-50 transition-all flex flex-col items-center gap-2 shadow-sm">
                                <Power size={18} /> 재부팅
                             </button>
                             <button onClick={() => { setIsUpgrading(true); setTimeout(() => setIsUpgrading(false), 2000); }} className="py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-bold hover:bg-black transition-all flex flex-col items-center gap-2 shadow-lg">
                                <RefreshCw size={18} className={isUpgrading ? 'animate-spin' : ''} /> 펌웨어
                             </button>
                             <button onClick={() => setShowUnitReportModal(true)} className="py-4 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-bold text-slate-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex flex-col items-center gap-2 shadow-sm">
                                <Printer size={18} /> 리포팅
                             </button>
                          </div>

                          {/* 관리자 메모 (관리자 전용) */}
                          <div className="relative">
                             <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500">
                               <MessageSquarePlus size={14}/> 관리 이력 직접 입력
                             </div>
                             <div className="relative">
                               <input
                                 value={manualNote}
                                 onChange={e => setManualNote(e.target.value)}
                                 type="text"
                                 placeholder="조치 내역을 입력하세요..."
                                 className="w-full pl-5 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                               />
                               <button
                                 onClick={() => {
                                   if(manualNote) {
                                     setHistory(p => [{id: Date.now(), unit: selectedDevice.unit, type: 'recovery', category: 'human', message: manualNote, timestamp: getTimestamp(), user: 'Admin_Lead', timestampValue: Date.now()}, ...p]);
                                     setManualNote('');
                                     setLogFilter('human'); // 수동 입력 시 '관리자 조치' 탭으로 즉시 전환
                                     setHistoryPage(1);
                                   }
                                 }}
                                 className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                               >
                                 <Send size={16} />
                               </button>
                             </div>
                          </div>
                        </>
                      ) : (
                        /* 제어 버튼 그룹 (일반 뷰어용 - 리포트 발행만 허용) */
                        <div className="grid grid-cols-1 gap-3">
                           <button onClick={() => setShowUnitReportModal(true)} className="py-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition-all flex flex-col items-center gap-2 shadow-sm">
                              <Printer size={20} /> 세대별 점검 리포트 발행
                           </button>
                        </div>
                      )}

                      {/* 세대별 로그 리스트 (스크롤 및 페이징 적용) */}
                      <div className="space-y-4">
                         <div className="flex flex-col xl:flex-row xl:items-center justify-between border-b border-slate-100 pb-2 gap-2">
                           <div className="flex items-center gap-3">
                             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 shrink-0">
                               <ListFilter size={14}/> Recent Logs
                             </h4>
                             <div className="flex gap-1">
                               <button onClick={() => {setLogFilter('all'); setHistoryPage(1);}} className={`text-[10px] px-2.5 py-1 rounded-lg font-bold transition-colors ${logFilter === 'all' ? 'bg-slate-200 text-slate-700' : 'text-slate-400 hover:bg-slate-100'}`}>전체</button>
                               <button onClick={() => {setLogFilter('error'); setHistoryPage(1);}} className={`text-[10px] px-2.5 py-1 rounded-lg font-bold transition-colors ${logFilter === 'error' ? 'bg-rose-100 text-rose-700' : 'text-slate-400 hover:bg-slate-100'}`}>장애</button>
                               <button onClick={() => {setLogFilter('info'); setHistoryPage(1);}} className={`text-[10px] px-2.5 py-1 rounded-lg font-bold transition-colors ${logFilter === 'info' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400 hover:bg-slate-100'}`}>일반</button>
                               <button onClick={() => {setLogFilter('human'); setHistoryPage(1);}} className={`text-[10px] px-2.5 py-1 rounded-lg font-bold transition-colors ${logFilter === 'human' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 hover:bg-slate-100'}`}>관리자 조치</button>
                             </div>
                           </div>
                           <div className="flex gap-2 shrink-0 self-end">
                             <button disabled={historyPage===1} onClick={()=>setHistoryPage(p=>p-1)} className="p-1 hover:bg-slate-100 rounded disabled:opacity-30"><ChevronLeft size={14}/></button>
                             <span className="text-[10px] mt-1 font-mono">{historyPage} / {totalHistoryPages || 1}</span>
                             <button disabled={historyPage>=totalHistoryPages} onClick={()=>setHistoryPage(p=>p+1)} className="p-1 hover:bg-slate-100 rounded disabled:opacity-30"><ChevronRightIcon size={14}/></button>
                           </div>
                         </div>

                         {/* 세로 스크롤 영역 제한 해제 */}
                         <div className="pr-1 space-y-3">
                           {paginatedHistory.map(item => (
                             <div key={item.id} className="flex gap-4 items-start p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors">
                                <div
                                  className={`mt-1 min-w-[8px] h-2 rounded-full ${item.type === 'error' ? 'bg-rose-500' : item.category === 'human' ? 'bg-indigo-500' : 'bg-emerald-400'}`}
                                  title={item.category === 'human' ? "수동 입력" : item.type === 'error' ? "시스템 에러" : "시스템 정보"}
                                />
                                <div>
                                   <p className="text-xs font-medium text-slate-700 leading-snug">{String(item.message)}</p>
                                   <div className="flex items-center gap-2 mt-1.5">
                                     <span className="text-[10px] text-slate-400 font-mono">{String(item.timestamp)}</span>
                                     {item.user && <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-bold">{item.user}</span>}
                                   </div>
                                </div>
                             </div>
                           ))}
                           {paginatedHistory.length === 0 && (
                              <div className="text-center py-12 text-slate-400 text-sm font-medium bg-slate-50 rounded-2xl border border-slate-100">
                                선택한 조건에 해당하는 로그가 없습니다.
                              </div>
                           )}
                         </div>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                   <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Megaphone size={20} className="text-indigo-500" />
                        <span className="text-base font-bold text-slate-800">엑스게이트 보안 공지 게시판</span>
                      </div>
                      {isAdmin && (
                        <button onClick={() => handleOpenNoticeModal()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md">
                          <Plus size={14} /> 공지 등록
                        </button>
                      )}
                   </div>
                   <div className="flex-1 overflow-y-auto p-8 space-y-4 scrollbar-thin">
                      {notices.map(notice => (
                        <div key={notice.id} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group relative">
                           <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-3">
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${notice.type === 'urgent' ? 'bg-rose-50 text-rose-600' : notice.type === 'update' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                  {notice.type === 'urgent' ? '긴급' : notice.type === 'update' ? '업데이트' : '일반공지'}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">{String(notice.date)}</span>
                              </div>
                              {isAdmin && (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white shadow-sm border border-slate-100 rounded-lg p-1 absolute top-5 right-5">
                                  <button onClick={(e) => { e.stopPropagation(); handleOpenNoticeModal(notice); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"><Edit size={14}/></button>
                                  <button onClick={(e) => handleDeleteNotice(notice.id, e)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"><Trash2 size={14}/></button>
                                </div>
                              )}
                           </div>
                           <h4 className="text-sm font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors pr-12">{String(notice.title)}</h4>
                           <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-line">{String(notice.content)}</p>
                        </div>
                      ))}
                      {notices.length === 0 && (
                        <div className="text-center py-16 text-slate-400 font-medium bg-slate-50 rounded-3xl border border-slate-100">등록된 공지사항이 없습니다.</div>
                      )}
                   </div>
                   <div className="p-8 bg-slate-50/50 flex flex-col items-center justify-center text-center gap-3 border-t border-slate-100 shrink-0">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400">
                         <MousePointer2 size={24} />
                      </div>
                      <p className="text-xs font-medium text-slate-500">세대를 선택하여 상세 제어를 시작하세요.</p>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeparationDashboard;
