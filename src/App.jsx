import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  LayoutDashboard, Server, Shield, Network, Activity, 
  AlertTriangle, FileText, Bell, Search, User, 
  LogOut, ShieldCheck, Terminal, AlertCircle, ChevronRight,
  Wifi, HardDrive, Cpu, Clock, Sparkles, X, Loader2,
  Box, ArrowRight, CheckCircle2, ChevronDown, BarChart3,
  Power, Wind, Thermometer, ArrowUpRight, ArrowDownRight,
  Database, Zap, Lock, Layers, GitMerge, Radio,
  Building2, Map as MapIcon, ZoomIn, ZoomOut, Maximize,
  FileSpreadsheet, FileCode, FileDown, Bot, MessageSquarePlus,
  Send, Mail, Upload, ShieldAlert, Megaphone, Siren, Filter,
  CalendarDays, Globe, MousePointer2, ChevronLeft, Printer, MessageCircle,
  ArrowLeft, ListFilter, History as HistoryIcon, Download,
  Settings, RefreshCw, Grid3X3, Home, Navigation, Trees, ChevronRight as ChevronRightIcon,
  ClipboardCheck, PenTool, Stamp, CheckSquare, Eye, MapPin, Calendar, Info,
  Trash2, Edit, Edit3, Play, Plus, ScrollText, Archive, Key, Users, UserPlus, ShieldHalf, UserCheck
} from 'lucide-react';

// --- [데이터] 메인 앱 데이터 ---
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

const INITIAL_COMPLEX_LIST = [
  { id: 'AX-PRM-01', name: '디에이치 아너힐즈', region: '서울 강남구', builder: '현대건설', homenet: '현대HT', status: '정상', address: '서울특별시 강남구 개포로 310', manager: '박신일 소장', contact: '010-1234-5678', report: '발급', regDate: '2024-01-15', registrant: '시스템', builderManager: '김현대 과장', builderContact: '010-1111-2222', homenetManager: '이현대 대리', homenetContact: '010-3333-4444', dongCount: 10, dongStartNum: 101, floorCount: 20, unitsPerFloor: 2, deviceRegistered: true },
  { id: 'AX-PRM-02', name: '래미안 원베일리', region: '서울 서초구', builder: '삼성물산', homenet: '삼성SDS', status: '정상', address: '서울특별시 서초구 반포대로 300', manager: '김철수 소장', contact: '010-2345-6789', report: '발급', regDate: '2024-01-18', registrant: '박신일', builderManager: '박삼성 책임', builderContact: '010-2222-3333', homenetManager: '최에스 프로', homenetContact: '010-4444-5555', dongCount: 8, dongStartNum: 101, floorCount: 25, unitsPerFloor: 4, deviceRegistered: true },
  { id: 'AX-PRM-03', name: '반포 자이', region: '서울 서초구', builder: 'GS건설', homenet: '이지스', status: '정상', address: '서울특별시 서초구 신반포로 270', manager: '이영희 소장', contact: '010-3456-7890', report: '발급', regDate: '2024-03-12', registrant: '장정구', builderManager: '정지에스 차장', builderContact: '010-3333-4444', homenetManager: '강이지 주임', homenetContact: '010-5555-6666', dongCount: 12, dongStartNum: 101, floorCount: 15, unitsPerFloor: 3, deviceRegistered: true },
  { id: 'AX-PRM-04', name: '올림픽파크 포레온', region: '서울 강동구', builder: '현대건설', homenet: '현대HT', status: '정상', address: '서울특별시 강동구 양재대로 1218', manager: '정민수 소장', contact: '010-4567-8901', report: '발급', regDate: '2024-05-15', registrant: '박신일', builderManager: '김현대 과장', builderContact: '010-1111-2222', homenetManager: '이현대 대리', homenetContact: '010-3333-4444', dongCount: 15, dongStartNum: 101, floorCount: 30, unitsPerFloor: 4, deviceRegistered: true },
  { id: 'AX-PRM-05', name: '마포 래미안 푸르지오', region: '서울 마포구', builder: '대우건설', homenet: '코콤', status: '오프라인', address: '서울특별시 마포구 마포대로 195', manager: '최은지 소장', contact: '010-5678-9012', report: '미발급', regDate: '2024-06-05', registrant: '장정구', builderManager: '윤대우 대리', builderContact: '010-4444-5555', homenetManager: '임코콤 과장', homenetContact: '010-6666-7777', dongCount: 6, dongStartNum: 101, floorCount: 18, unitsPerFloor: 2, deviceRegistered: true },
  { id: 'AX-PRM-06', name: '송파 헬리오시티', region: '서울 송파구', builder: 'DL이앤씨', homenet: '코맥스', status: '정상', address: '서울특별시 송파구 송파대로 345', manager: '강동훈 소장', contact: '010-6789-0123', report: '발급', regDate: '2024-07-12', registrant: '시스템', builderManager: '조디엘 차장', builderContact: '010-5555-6666', homenetManager: '송코맥 대리', homenetContact: '010-7777-8888', dongCount: 20, dongStartNum: 101, floorCount: 25, unitsPerFloor: 4, deviceRegistered: true },
  { id: 'AX-PRM-07', name: '해운대 엘시티 더샵', region: '부산 해운대구', builder: '포스코이앤씨', homenet: '포스코DX', status: '정상', address: '부산광역시 해운대구 달맞이길 30', manager: '윤서연 소장', contact: '010-7890-1234', report: '발급', regDate: '2024-08-20', registrant: '박신일', builderManager: '한포스 과장', builderContact: '010-6666-7777', homenetManager: '백디엑 사원', homenetContact: '010-8888-9999', dongCount: 5, dongStartNum: 101, floorCount: 45, unitsPerFloor: 6, deviceRegistered: true },
  { id: 'AX-PRM-08', name: '힐스테이트 송도 더스카이', region: '인천 연수구', builder: '현대건설', homenet: '현대HT', status: '점검중', address: '인천광역시 연수구 인천타워대로 396', manager: '임도현 소장', contact: '010-8901-2345', report: '미발급', regDate: '2024-09-01', registrant: '장정구', builderManager: '김현대 과장', builderContact: '010-1111-2222', homenetManager: '이현대 대리', homenetContact: '010-3333-4444', dongCount: 7, dongStartNum: 101, floorCount: 35, unitsPerFloor: 3, deviceRegistered: true },
];

const VULNERABILITY_CHECKLIST = [
  { id: 'SV-01', category: '계정 관리', item: '불필요한 계정 비활성화', result: '양호', note: '-' },
  { id: 'SV-02', category: '계정 관리', item: '사용 목적별 계정 분리', result: '양호', note: '-' },
  { id: 'SV-03', category: '계정 관리', item: 'Root 등 계정의 동일한 UID 사용금지', result: '양호', note: '-' },
  { id: 'SV-04', category: '계정 관리', item: '관리자그룹의 최소한 계정 포함', result: '수동점검', note: '확인 필요' },
  { id: 'SV-08', category: '권한 관리', item: 'Root 홈, 패스 디렉토리 권한 및 패스 설정', result: '양호', note: '-' },
  { id: 'SV-09', category: '권한 관리', item: '홈디렉토리 소유자 및 권한 설정', result: '양호', note: '-' },
  { id: 'SV-10', category: '권한 관리', item: '사용자, 시스템 환경 파일 소유자 및 권한 설정', result: '양호', note: '-' },
  { id: 'SV-11', category: '파일 관리', item: '파일 및 디렉토리 소유자 설정', result: '수동점검', note: '-' },
  { id: 'SV-16', category: '파일 관리', item: '/etc/hosts 파일 소유자 및 권한 설정', result: '취약', note: '권한 600 설정 요망' },
  { id: 'SV-17', category: '파일 관리', item: '/etc/passwd 파일 소유자 및 권한 설정', result: '양호', note: '-' },
  { id: 'SV-18', category: '파일 관리', item: '/etc/shadow 파일 소유자 및 권한 설정', result: '양호', note: '-' },
  { id: 'SV-19', category: '파일 관리', item: 'UMASK 설정 관리(UMASK0022)', result: '수동점검', note: '-' },
  { id: 'SV-21', category: '파일 관리', item: '/etc/(x)inetd.conf 파일 소유자 및 권한 설정', result: '양호', note: '-' },
  { id: 'SV-22', category: '파일 관리', item: '/etc/syslog.conf 파일 소유자 및 권한 설정', result: '취약', note: '소유자 root 변경 필요' },
  { id: 'SV-28', category: '서비스 관리', item: '불필요한 서비스 비활성화 (FTP 등)', result: '양호', note: '-' },
  { id: 'SV-31', category: '서비스 관리', item: '원격 접속 터미널 보안 설정', result: '취약', note: 'SSH Root 접속 제한 필요' },
  { id: 'SV-33', category: '서비스 관리', item: 'NFS 서비스 사용여부 및 NFS 접근통제', result: '양호', note: '-' },
  { id: 'SV-34', category: '서비스 관리', item: 'FTP 서비스 접근 권한 및 보안설정', result: '양호', note: '-' },
  { id: 'SV-36', category: '보안 관리', item: '악성코드(바이러스등) 은닉, 탐지도구 설치', result: '양호', note: '-' },
  { id: 'SV-40', category: 'DB 관리', item: '접근, 변경, 질의 등의 감사로깅 1년 이상 보관', result: '양호', note: '-' },
];

const SAFETY_INSPECTION_CHECKLIST = [
  { category: '관리용 PC', item: '계정관리 및 보안설정', cycleRec: '월간', cycleMan: '월간' },
  { category: '관리용 PC', item: '불필요한 서비스 비활성화', cycleRec: '월간', cycleMan: '월간' },
  { category: '관리용 PC', item: '운영체제 최신 보안 업데이트', cycleRec: '월간', cycleMan: '월간' },
  { category: '관리용 PC', item: '악성코드 탐지 예방 활동', cycleRec: '월간', cycleMan: '월간' },
  { category: '단지 네트워크 장비', item: '장비 온도, LED 램프 등 장비 외관을 육안 점검', cycleRec: '2주', cycleMan: '월간' },
  { category: '단지 네트워크 장비', item: '전원 상태(뒷면/전면 램프) 육안 점검', cycleRec: '2주', cycleMan: '월간' },
  { category: '단지 네트워크 장비', item: 'LED 램프의 정상 작동 등 통신상태를 육안 점검', cycleRec: '2주', cycleMan: '월간' },
  { category: '단지 네트워크 장비', item: '케이블의 외관상태, 연결부위 접촉여부를 육안 점검', cycleRec: '2주', cycleMan: '월간' },
  { category: '단지 네트워크 장비', item: '장치함/랙(rack)의 잠금장치 설치 및 시건 정상작동', cycleRec: '1주', cycleMan: '월간' },
  { category: '단지 네트워크 장비', item: 'UPS(무정전전원장치) 전원 상태 등 정상작동 점검', cycleRec: '2주', cycleMan: '월간' },
  { category: '단지서버', item: '장비 온도, LED 램프 등 장비 외관을 육안 점검', cycleRec: '2주', cycleMan: '월간' },
  { category: '단지서버', item: '전원 상태(뒷면/전면 램프) 육안 점검', cycleRec: '2주', cycleMan: '월간' },
  { category: '단지서버', item: '케이블의 외관상태, 연결부위 접촉여부를 육안 점검', cycleRec: '2주', cycleMan: '월간' },
  { category: '단지서버', item: '서버 설치공간의 잠금장치 설치 및 시건 정상작동', cycleRec: '1주', cycleMan: '월간' },
  { category: '단지서버', item: '영상정보처리기기(CCTV) 설치 및 정상작동 점검', cycleRec: '2주', cycleMan: '월간' },
  { category: '단지서버', item: '항온항습/냉방기/환풍기 설치 및 정상작동 점검', cycleRec: '2주', cycleMan: '월간' },
  { category: '단지서버', item: 'UPS(무정전전원장치) 전원 상태 등 정상작동 점검', cycleRec: '2주', cycleMan: '월간' },
  { category: '통신 배관실', item: '잠금장치 설치 및 시건 정상작동 점검', cycleRec: '1주', cycleMan: '월간' },
  { category: '통신 배관실', item: '출입통제표시 부착 여부 및 상태 육안 점검', cycleRec: '2주', cycleMan: '월간' },
  { category: '통신 배관실', item: '케이블의 외관상태, 연결부위 접촉여부를 육안 점검', cycleRec: '2주', cycleMan: '월간' },
  { category: '통신 배관실', item: '열쇠 불출 관리대장 작성 점검', cycleRec: '2주', cycleMan: '월간' },
  { category: '통신 배관실', item: '인가되지 않은 장비/설비 추가설치 여부 점검', cycleRec: '2주', cycleMan: '월간' },
  { category: '집중구내 통신실', item: '잠금장치 설치 및 시건 정상작동 점검', cycleRec: '1주', cycleMan: '월간' },
  { category: '집중구내 통신실', item: '온·습도 유지장치의 설치 및 정상작동 점검', cycleRec: '2주', cycleMan: '월간' },
  { category: '집중구내 통신실', item: '출입 관리대장 작성 점검', cycleRec: '2주', cycleMan: '월간' },
  { category: '방재실', item: '잠금장치 설치 및 시건 정상작동 점검', cycleRec: '1주', cycleMan: '월간' },
  { category: '방재실', item: '온·습도 유지장치의 설치 및 정상작동 점검', cycleRec: '2주', cycleMan: '월간' },
  { category: '기타', item: '유지관리 매뉴얼, 설계도서 비치 점검', cycleRec: '월간', cycleMan: '월간' },
  { category: '기타', item: '홈네트워크 공사 및 용역대장 작성 점검', cycleRec: '월간', cycleMan: '월간' },
];

// --- [단지별 데모 데이터 생성 함수] ---
const generateVulnerabilityDataForComplex = (complexId) => {
  let seed = 0;
  for (let i = 0; i < complexId.length; i++) seed += complexId.charCodeAt(i);
  return VULNERABILITY_CHECKLIST.map((item, idx) => {
    const v = (seed * (idx + 1) * 7 + idx * 13) % 100;
    let result;
    if (v < 60) result = '양호';
    else if (v < 80) result = '취약';
    else result = '수동점검';
    const note = result === '양호' ? '-' : result === '취약' ? '조치 필요' : '확인 필요';
    return { ...item, result, note };
  });
};

const generateSafetyDataForComplex = (complexId) => {
  let seed = 0;
  for (let i = 0; i < complexId.length; i++) seed += complexId.charCodeAt(i);
  return SAFETY_INSPECTION_CHECKLIST.map((item, idx) => {
    const v = (seed * (idx + 1) * 11 + idx * 17) % 100;
    let result;
    if (v < 75) result = '양호';
    else if (v < 90) result = '불량';
    else result = '해당없음';
    return { ...item, id: `SI-${idx}`, result };
  });
};

const generateAllVulnerabilityData = (complexList) => {
  const data = {};
  complexList.forEach(c => { data[c.id] = generateVulnerabilityDataForComplex(c.id); });
  return data;
};

const generateAllSafetyInspectionData = (complexList) => {
  const data = {};
  complexList.forEach(c => { data[c.id] = generateSafetyDataForComplex(c.id); });
  return data;
};

const COMPLEX_MANAGEMENT_CHECKLIST = [
  { id: 'CM-01', category: '장비 현황', item: '세대 단말기(월패드) 설치 현황 확인', result: '양호', note: '-' },
  { id: 'CM-02', category: '장비 현황', item: '단지서버 가동 상태 점검', result: '양호', note: '-' },
  { id: 'CM-03', category: '장비 현황', item: '네트워크 장비(스위치/라우터) 상태 확인', result: '양호', note: '-' },
  { id: 'CM-04', category: '장비 현황', item: '방화벽 장비 운영 상태 점검', result: '양호', note: '-' },
  { id: 'CM-05', category: '네트워크', item: '단지 내부망 통신 상태 점검', result: '양호', note: '-' },
  { id: 'CM-06', category: '네트워크', item: 'VPN 터널링 연결 상태 확인', result: '양호', note: '-' },
  { id: 'CM-07', category: '네트워크', item: '백본 네트워크 대역폭 점검', result: '양호', note: '-' },
  { id: 'CM-08', category: '보안 관리', item: '보안 정책(룰셋) 최신 적용 여부', result: '양호', note: '-' },
  { id: 'CM-09', category: '보안 관리', item: '비인가 접근 시도 모니터링', result: '양호', note: '-' },
  { id: 'CM-10', category: '보안 관리', item: '관리자 계정 접근 권한 검토', result: '양호', note: '-' },
  { id: 'CM-11', category: '운영 관리', item: '장애 세대 현황 파악 및 조치', result: '양호', note: '-' },
  { id: 'CM-12', category: '운영 관리', item: '정기 점검 스케줄 이행 여부', result: '양호', note: '-' },
  { id: 'CM-13', category: '운영 관리', item: '유지보수 이력 관리', result: '양호', note: '-' },
  { id: 'CM-14', category: '운영 관리', item: '비상 연락망 및 대응 체계 확인', result: '양호', note: '-' },
  { id: 'CM-15', category: '시스템', item: 'CPU/메모리 사용률 안정성 확인', result: '양호', note: '-' },
  { id: 'CM-16', category: '시스템', item: '디스크 용량 및 로그 관리 상태', result: '양호', note: '-' },
  { id: 'CM-17', category: '시스템', item: '시스템 백업 정책 이행 확인', result: '양호', note: '-' },
  { id: 'CM-18', category: '시스템', item: '소프트웨어 버전 및 패치 현황', result: '양호', note: '-' },
];

const generateComplexMgmtDataForComplex = (complexId) => {
  let seed = 0;
  for (let i = 0; i < complexId.length; i++) seed += complexId.charCodeAt(i);
  return COMPLEX_MANAGEMENT_CHECKLIST.map((item, idx) => {
    const v = (seed * (idx + 1) * 9 + idx * 19) % 100;
    let result;
    if (v < 65) result = '양호';
    else if (v < 85) result = '미흡';
    else result = '보완필요';
    const note = result === '양호' ? '-' : result === '미흡' ? '조치 필요' : '보완 조치 필요';
    return { ...item, result, note };
  });
};

const generateAllComplexMgmtData = (complexList) => {
  const data = {};
  complexList.forEach(c => { data[c.id] = generateComplexMgmtDataForComplex(c.id); });
  return data;
};

const REPORT_TYPES = ['취약점 점검 보고서', '안전 점검 보고서', '종합 점검 보고서'];
const REPORT_AUTHORS = ['박신일', '장정구', '시스템', '김철수'];

const generateReportsForComplex = (complexId, complexName) => {
  let seed = 0;
  for (let i = 0; i < complexId.length; i++) seed += complexId.charCodeAt(i);
  const count = 5 + (seed % 6);
  const reports = [];
  for (let i = 0; i < count; i++) {
    const v = (seed * (i + 1) * 7 + i * 13) % 100;
    const typeIdx = (seed + i * 3) % REPORT_TYPES.length;
    const authorIdx = (seed + i * 5) % REPORT_AUTHORS.length;
    const day = String(28 - ((seed + i * 2) % 28)).padStart(2, '0');
    const month = v < 50 ? '02' : '01';
    const statusVal = v < 70 ? '완료' : v < 85 ? '점검중' : '대기';
    reports.push({
      id: `REP-${complexId}-${String(i + 1).padStart(2, '0')}`,
      date: `2026-${month}-${day}`,
      title: `${complexName} ${REPORT_TYPES[typeIdx]} 보고서 (${i + 1}차)`,
      type: REPORT_TYPES[typeIdx],
      author: REPORT_AUTHORS[authorIdx],
      size: `${(1.0 + (v % 40) / 10).toFixed(1)} MB`,
      status: statusVal,
    });
  }
  return reports.sort((a, b) => b.date.localeCompare(a.date));
};

const generateAllReportData = (complexList) => {
  const data = {};
  complexList.forEach(c => { data[c.id] = generateReportsForComplex(c.id, c.name); });
  return data;
};

// --- [공통 컴포넌트] ---
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

const DonutChart = ({ value, label, colorClass, strokeColor }) => {
  const radius = 15.9155;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${value} ${100 - value}`;
  return (
    <div className="flex flex-col items-center group">
      <div className="relative w-20 h-20 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
          <path d={`M18 2.0845 a ${radius} ${radius} 0 0 1 0 ${circumference} a ${radius} ${radius} 0 0 1 0 -${circumference}`} fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
          <path d={`M18 2.0845 a ${radius} ${radius} 0 0 1 0 ${circumference} a ${radius} ${radius} 0 0 1 0 -${circumference}`} fill="none" stroke={strokeColor} strokeWidth="3.5" strokeDasharray={strokeDasharray} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-xl font-black font-mono ${colorClass}`}>{value}<span className="text-[10px]">%</span></span>
        </div>
      </div>
      <span className="text-sm font-bold text-slate-600 mt-3 group-hover:text-slate-900 transition-colors">{label}</span>
    </div>
  );
};

// 결재 시스템 컴포넌트
const ApprovalSystem = ({ approvals, setApprovals }) => {
  const [editingIdx, setEditingIdx] = useState(null);
  const [signName, setSignName] = useState('');
  const [stampImage, setStampImage] = useState(null);
  const fileInputRef = useRef(null);

  // 직책(Role) 텍스트 변경
  const handleRoleChange = (idx, newRole) => {
    setApprovals(prev => prev.map((app, i) => i === idx ? { ...app, role: newRole } : app));
  };

  // 결재 취소 처리
  const handleCancelSign = (idx) => {
    setApprovals(prev => prev.map((app, i) => i === idx ? { ...app, status: 'pending', name: '', date: '', stampImage: null } : app));
    setEditingIdx(null);
  };

  // 결재 팝업 열기
  const openSignModal = (idx, e) => {
    e.stopPropagation();
    const app = approvals[idx];
    setSignName(app.status === 'approved' ? app.name : '');
    setStampImage(app.status === 'approved' ? (app.stampImage || null) : null);
    setEditingIdx(idx);
  };

  // 도장 이미지 업로드
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setStampImage(event.target.result);
      reader.readAsDataURL(file);
    }
    e.target.value = ''; // 같은 파일 재업로드를 위해 초기화
  };

  // 결재 정보 저장
  const handleSignSubmit = () => {
    const today = new Date();
    const dateStr = `${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
    
    setApprovals(prev => prev.map((app, i) => {
      if (i === editingIdx) {
        return { 
          ...app, 
          status: 'approved', 
          name: signName || '결재자', 
          date: dateStr, 
          stampImage: stampImage 
        };
      }
      return app;
    }));
    setEditingIdx(null);
  };

  return (
    <>
      <div className="flex items-stretch bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden select-none">
        {/* 결재란 헤더 (정방향 세로 쓰기 적용) */}
        <div className="bg-slate-50 w-8 flex items-center justify-center border-r border-slate-200 shrink-0">
          <span 
            className="text-[12px] font-black text-slate-500 tracking-[0.2em]" 
            style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
          >
            결재
          </span>
        </div>
        
        <div className="flex">
          {approvals.map((app, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col w-20 sm:w-24 border-r border-slate-100 last:border-0 relative transition-all duration-300 group ${app.status === 'approved' ? 'bg-white' : 'bg-slate-50/50'}`}
            >
              {/* 직책 인라인 입력 필드 */}
              <div className={`h-7 flex items-center justify-center text-[11px] font-bold border-b border-slate-100 transition-colors ${app.status === 'approved' ? 'bg-slate-50' : 'bg-slate-100/50'}`}>
                <input 
                  type="text" 
                  value={app.role} 
                  onChange={(e) => handleRoleChange(idx, e.target.value)} 
                  className={`w-full text-center bg-transparent outline-none focus:bg-indigo-50 focus:text-indigo-600 transition-colors ${app.status === 'approved' ? 'text-slate-700' : 'text-slate-500'}`}
                  placeholder="직책 입력"
                />
              </div>
              
              {/* 도장/서명 영역 */}
              <div 
                className="h-16 flex flex-col items-center justify-center relative overflow-hidden bg-white cursor-pointer hover:bg-slate-50"
                onClick={(e) => openSignModal(idx, e)}
              >
                {app.status === 'approved' ? (
                  <div className="flex flex-col items-center justify-center animate-in zoom-in-75 duration-300 w-full h-full relative p-1">
                    {app.stampImage ? (
                      <img src={app.stampImage} alt="stamp" className="max-w-[44px] max-h-[44px] object-contain drop-shadow-sm opacity-90 z-10" />
                    ) : (
                      <div className="px-2.5 py-1 border-[2.5px] border-rose-600/80 rounded-lg flex items-center justify-center transform -rotate-[8deg] shadow-sm relative before:absolute before:inset-[1.5px] before:border before:border-rose-600/20 before:rounded-[4px] z-10 bg-white">
                        <span className="text-[13px] font-black font-serif tracking-[0.1em] text-rose-600/90 whitespace-nowrap">
                          {app.name}
                        </span>
                      </div>
                    )}
                    <span className="absolute bottom-1 text-[9px] font-mono font-bold text-slate-500 bg-white/90 px-1 rounded z-20">{app.date}</span>
                  </div>
                ) : (
                  <>
                    <span className="text-xs font-medium text-slate-300 group-hover:opacity-0 transition-opacity">미결재</span>
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-50/80 backdrop-blur-[1px]">
                      <span className="px-2.5 py-1 bg-indigo-600 text-white rounded text-[10px] font-bold shadow-sm flex items-center gap-1">
                        <PenTool className="w-3 h-3" /> 결재하기
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 결재 설정 모달 */}
      {editingIdx !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditingIdx(null)} />
          <div className="relative bg-white rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 w-80 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2"><PenTool size={18} className="text-indigo-600"/> 전자 결재</span>
              {approvals[editingIdx].status === 'approved' && (
                <button onClick={() => handleCancelSign(editingIdx)} className="text-[10px] text-rose-500 bg-rose-50 px-2 py-1 rounded hover:bg-rose-100 transition-colors font-bold">결재 취소</button>
              )}
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">결재자 이름</label>
                <input 
                  type="text" 
                  value={signName} 
                  onChange={(e) => setSignName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  placeholder="이름 입력 (예: 홍길동)"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center justify-between">
                  도장 이미지 (선택 사항)
                  {stampImage && (
                    <button onClick={() => setStampImage(null)} className="text-rose-500 hover:text-rose-600 text-[10px]">이미지 제거</button>
                  )}
                </label>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full h-28 bg-slate-50 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-colors overflow-hidden group ${stampImage ? 'border-indigo-200 hover:border-indigo-400' : 'border-slate-300 hover:border-indigo-400'}`}
                >
                  {stampImage ? (
                    <div className="relative w-full h-full p-2 flex items-center justify-center">
                       <img src={stampImage} alt="uploaded stamp" className="max-h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <span className="text-white text-xs font-bold flex items-center gap-1"><Upload size={14}/> 변경</span>
                       </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                      <Upload size={24} className="mb-2" />
                      <span className="text-[11px] font-bold">이미지 업로드</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingIdx(null)} className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">취소</button>
              <button onClick={handleSignSubmit} disabled={!signName.trim() && !stampImage} className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-md transition-all disabled:opacity-50">결재 적용</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// --- [개선된 문서 미리보기 모달 컴포넌트] ---
const DocumentPreviewModal = ({ onClose, title, date, approvals, checklist, type, customMeta }) => {

  const stats = useMemo(() => {
    const total = checklist.length;
    const good = checklist.filter(i => i.result === '양호').length;
    const bad = checklist.filter(i => i.result === '취약' || i.result === '불량' || i.result === '미흡').length;
    const manual = checklist.filter(i => i.result === '수동점검').length;
    const etc = total - good - bad - manual;
    return { total, good, bad, manual, etc };
  }, [checklist]);

  const docNo = useMemo(() => {
    const y = (date || new Date().toISOString().split('T')[0]).substring(0, 4);
    const typeCode = type === 'vulnerability' ? 'VUL' : type === 'unit' ? 'UNT' : type === 'complex_mgmt' ? 'MGT' : 'SAF';
    const seq = Math.floor(Math.random() * 900 + 100);
    return `AXGT-${y}-${typeCode}-${seq}`;
  }, [date, type]);

  const openPrintWindow = () => {
    const element = document.getElementById('pdf-report-content');
    if (!element) return;
    const pw = window.open('', '_blank');
    pw.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
      <title>${docNo}_${title}</title>
      <style>
        @page { margin: 0; size: A4 portrait; }
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; font-family: 'Malgun Gothic','Apple SD Gothic Neo','Noto Sans KR',sans-serif; }
        #pdf-report-content { width: 100% !important; min-height: auto !important; box-shadow: none !important; margin: 0 !important; }
        table { border-collapse: collapse; page-break-inside: auto; width: 100%; }
        thead { display: table-header-group; }
        tfoot { display: table-footer-group; }
        tr { page-break-inside: avoid; page-break-after: auto; }
      </style>
    </head><body>${element.outerHTML}</body></html>`);
    pw.document.close();
    const filename = `${docNo}_${title}`;
    pw.document.title = filename;
    pw.onload = () => {
      pw.document.title = filename;
      pw.print();
    };
  };

  const resultBadge = (result) => {
    const base = 'white-space:nowrap;display:inline-block;';
    if (result === '양호') return base + 'background:#d1fae5;color:#065f46;border:1px solid #a7f3d0';
    if (result === '취약' || result === '불량' || result === '미흡') return base + 'background:#fee2e2;color:#991b1b;border:1px solid #fca5a5';
    if (result === '수동점검') return base + 'background:#fef9c3;color:#854d0e;border:1px solid #fde047';
    return base + 'background:#f1f5f9;color:#475569;border:1px solid #cbd5e1';
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center bg-slate-900/80 backdrop-blur-md overflow-y-auto p-4 sm:p-8 custom-scrollbar">
      <div className="relative w-full max-w-[860px] shrink-0 mt-10">
        {/* 상단 툴바 */}
        <div className="sticky top-0 z-[160] flex justify-between items-center mb-6 bg-white/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-200 shadow-2xl no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-slate-900 font-black text-base">리포트 미리보기</h3>
              <p className="text-[11px] font-bold text-slate-400">문서번호: {docNo}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={openPrintWindow} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-200">
              <Printer className="w-4 h-4" /> 인쇄하기
            </button>
            <button onClick={openPrintWindow} className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-slate-300">
              <Download className="w-4 h-4" /> PDF 저장
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1 self-center"></div>
            <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── A4 문서 본체 ── */}
        <div id="pdf-report-content" style={{
          width: '210mm', minHeight: '297mm', background: '#fff',
          margin: '0 auto', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.25)',
          fontFamily: "'Malgun Gothic','Apple SD Gothic Neo','Noto Sans KR',sans-serif",
          fontSize: '10pt', color: '#1e293b', position: 'relative',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* 상단 컬러바 */}
          <div style={{ height: '4px', background: 'linear-gradient(90deg,#1B2A4A 0%,#f97316 100%)', flexShrink: 0 }} />

          {/* ── 헤더 영역 ── */}
          <div style={{ padding: '7mm 12mm 5mm', borderBottom: '2px solid #1B2A4A', flexShrink: 0, pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5mm' }}>

              {/* 로고 + 발신 정보 */}
              <div>
                <div style={{ fontSize: '20pt', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1, color: '#1e293b' }}>
                  AX<span style={{ color: '#f97316' }}>GATE</span>
                </div>
                <div style={{ fontSize: '6pt', color: '#f97316', fontWeight: 700, letterSpacing: '3px', marginTop: '2px' }}>SECURITY &amp; BEYOND</div>
                <div style={{ marginTop: '4px', fontSize: '6.5pt', color: '#64748b', lineHeight: 1.7 }}>
                  <div>㈜엑스게이트 ICT사업본부</div>
                  <div>서울특별시 금천구 가산디지털1로 168, A동 1503호</div>
                  <div>TEL: 02-1644-4306 | www.axgate.com</div>
                </div>
              </div>

              {/* 결재 테이블 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <div style={{ fontSize: '6pt', color: '#94a3b8', fontWeight: 700, letterSpacing: '2px', textAlign: 'right' }}>APPROVAL</div>
                <table style={{ borderCollapse: 'collapse', fontSize: '7pt', minWidth: '160px' }}>
                  <tbody>
                    <tr>
                      <td rowSpan={2} style={{ border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 700, color: '#475569', padding: '3px 5px', textAlign: 'center', writingMode: 'vertical-rl', textOrientation: 'upright', width: '18px' }}>결재</td>
                      {approvals.map((app, i) => (
                        <td key={i} style={{ border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 700, color: '#334155', padding: '4px 8px', textAlign: 'center', minWidth: '46px' }}>{app.role}</td>
                      ))}
                    </tr>
                    <tr>
                      {approvals.map((app, i) => (
                        <td key={i} style={{ border: '1px solid #cbd5e1', height: '38px', textAlign: 'center', verticalAlign: 'middle', padding: '3px' }}>
                          {app.status === 'approved' && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              {app.stampImage
                                ? <img src={app.stampImage} alt="stamp" style={{ maxWidth: '34px', maxHeight: '34px', opacity: 0.9 }} />
                                : <div style={{ border: '2.5px solid rgba(225,29,72,0.8)', borderRadius: '6px', padding: '2px 7px', transform: 'rotate(-8deg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(225,29,72,0.18)' }}>
                                    <span style={{ fontSize: '9pt', fontWeight: 900, color: 'rgba(225,29,72,0.9)', fontFamily: 'serif', whiteSpace: 'nowrap', letterSpacing: '0.1em' }}>{app.name}</span>
                                  </div>
                              }
                              <span style={{ fontSize: '6pt', color: '#94a3b8', fontFamily: 'monospace', marginTop: '2px' }}>{app.date}</span>
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 문서 제목 + 메타 */}
            <div style={{ borderLeft: '3px solid #f97316', paddingLeft: '10px', marginBottom: '4mm' }}>
              <div style={{ fontSize: '6.5pt', color: '#f97316', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '3px' }}>Official Inspection Report</div>
              <div style={{ fontSize: '15pt', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1.2 }}>{title}</div>
            </div>

            {/* 문서 정보 박스 */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '5px 12px', display: 'flex', flexWrap: 'wrap', gap: '0' }}>
              {(customMeta ? customMeta : [
                { label: '문서 번호', value: docNo },
                { label: '작성일', value: date || new Date().toISOString().split('T')[0] },
                { label: '보안 등급', value: '대외비 (CONFIDENTIAL)' },
                { label: '작성 부서', value: 'ICT사업본부 기술지원팀' },
              ]).map((m, i, arr) => (
                <div key={i} style={{ flex: '1 1 40%', padding: '4px 8px', borderRight: i % 2 === 0 && i < arr.length - 1 ? '1px solid #e2e8f0' : 'none', borderBottom: i < arr.length - 2 ? '1px solid #e2e8f0' : 'none' }}>
                  <div style={{ fontSize: '6pt', color: '#94a3b8', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1px' }}>{m.label}</div>
                  <div style={{ fontSize: '7.5pt', fontWeight: 700, color: '#1e293b' }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 요약 통계 ── */}
          <div style={{ padding: '4mm 12mm', borderBottom: '1px solid #e2e8f0', flexShrink: 0, background: '#fafafa', pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>
            <div style={{ fontSize: '6.5pt', fontWeight: 800, color: '#94a3b8', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>INSPECTION SUMMARY</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { label: '전체 항목', value: stats.total, bg: '#f1f5f9', border: '#e2e8f0', color: '#334155' },
                { label: '양호 / 정상', value: stats.good, bg: '#f0fdf4', border: '#bbf7d0', color: '#166534' },
                { label: '취약 / 불량', value: stats.bad, bg: '#fff1f2', border: '#fecdd3', color: '#9f1239' },
                { label: '수동 점검', value: stats.manual, bg: '#fefce8', border: '#fef08a', color: '#854d0e' },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, background: s.bg, border: `1px solid ${s.border}`, borderRadius: '6px', padding: '5px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '6pt', fontWeight: 700, color: s.color, marginBottom: '2px', whiteSpace: 'nowrap' }}>{s.label}</div>
                  <div style={{ fontSize: '14pt', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '6pt', color: s.color, opacity: 0.7, marginTop: '2px' }}>
                    {stats.total > 0 ? Math.round(s.value / stats.total * 100) : 0}%
                  </div>
                  <div style={{ marginTop: '4px', background: 'rgba(0,0,0,0.08)', borderRadius: '3px', height: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${stats.total > 0 ? Math.round(s.value / stats.total * 100) : 0}%`, height: '100%', background: s.color, opacity: 0.6 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 점검 내역 테이블 ── */}
          <div style={{ padding: '4mm 12mm', flex: 1 }}>
            <div style={{ fontSize: '6.5pt', fontWeight: 800, color: '#94a3b8', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>INSPECTION DETAILS</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '7.5pt', tableLayout: 'fixed', pageBreakInside: 'auto' }}>
              <thead style={{ display: 'table-header-group' }}>
                <tr style={{ background: '#1B2A4A', color: '#fff' }}>
                  {type === 'unit' ? (<>
                    <th style={{ padding: '5px 8px', width: '75px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>분류</th>
                    <th style={{ padding: '5px 8px', textAlign: 'left', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>점검 항목</th>
                    <th style={{ padding: '5px 8px', width: '62px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>결과</th>
                    <th style={{ padding: '5px 8px', width: '110px', textAlign: 'center', fontWeight: 700 }}>상세 내용</th>
                  </>) : type === 'vulnerability' ? (<>
                    <th style={{ padding: '5px 8px', width: '52px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>ID</th>
                    <th style={{ padding: '5px 8px', width: '80px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>분류</th>
                    <th style={{ padding: '5px 8px', textAlign: 'left', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>점검 항목</th>
                    <th style={{ padding: '5px 8px', width: '62px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>결과</th>
                    <th style={{ padding: '5px 8px', width: '90px', textAlign: 'center', fontWeight: 700 }}>비고</th>
                  </>) : type === 'complex_mgmt' ? (<>
                    <th style={{ padding: '5px 8px', width: '52px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>ID</th>
                    <th style={{ padding: '5px 8px', width: '80px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>분류</th>
                    <th style={{ padding: '5px 8px', textAlign: 'left', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>점검 항목</th>
                    <th style={{ padding: '5px 8px', width: '62px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>결과</th>
                    <th style={{ padding: '5px 8px', width: '90px', textAlign: 'center', fontWeight: 700 }}>비고</th>
                  </>) : (<>
                    <th style={{ padding: '5px 8px', width: '90px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>분류</th>
                    <th style={{ padding: '5px 8px', textAlign: 'left', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>점검 항목</th>
                    <th style={{ padding: '5px 8px', width: '62px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>점검 주기</th>
                    <th style={{ padding: '5px 8px', width: '58px', textAlign: 'center', fontWeight: 700 }}>결과</th>
                  </>)}
                </tr>
              </thead>
              <tbody>
                {checklist.map((item, idx) => (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? '#fff' : '#f8fafc', borderBottom: '1px solid #e2e8f0', pageBreakInside: 'avoid' }}>
                    {type === 'unit' ? (<>
                      <td style={{ padding: '4px 7px', textAlign: 'center', fontWeight: 700, color: '#475569', borderRight: '1px solid #e2e8f0', fontSize: '7pt' }}>{item.category}</td>
                      <td style={{ padding: '4px 7px', color: '#334155', lineHeight: 1.4, borderRight: '1px solid #e2e8f0' }}>{item.item}</td>
                      <td style={{ padding: '4px 7px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>
                        <span style={{ padding: '1px 5px', borderRadius: '3px', fontWeight: 800, fontSize: '6.5pt', ...Object.fromEntries(resultBadge(item.result).split(';').filter(Boolean).map(s => { const [k,v]=s.split(':'); return [k.trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()), v.trim()]; })) }}>{item.result}</span>
                      </td>
                      <td style={{ padding: '4px 7px', textAlign: 'center', color: '#64748b', fontSize: '6.5pt' }}>{item.note}</td>
                    </>) : type === 'vulnerability' ? (<>
                      <td style={{ padding: '4px 7px', textAlign: 'center', color: '#64748b', fontFamily: 'monospace', borderRight: '1px solid #e2e8f0', fontSize: '7pt' }}>{item.id}</td>
                      <td style={{ padding: '4px 7px', textAlign: 'center', fontWeight: 700, color: '#475569', borderRight: '1px solid #e2e8f0', fontSize: '7pt' }}>{item.category}</td>
                      <td style={{ padding: '4px 7px', color: '#334155', lineHeight: 1.4, borderRight: '1px solid #e2e8f0' }}>{item.item}</td>
                      <td style={{ padding: '4px 7px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>
                        <span style={{ padding: '1px 5px', borderRadius: '3px', fontWeight: 800, fontSize: '6.5pt', ...Object.fromEntries(resultBadge(item.result).split(';').filter(Boolean).map(s => { const [k,v]=s.split(':'); return [k.trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()), v.trim()]; })) }}>{item.result}</span>
                      </td>
                      <td style={{ padding: '4px 7px', textAlign: 'center', color: '#64748b', fontSize: '6.5pt' }}>{item.note}</td>
                    </>) : type === 'complex_mgmt' ? (<>
                      <td style={{ padding: '4px 7px', textAlign: 'center', color: '#64748b', fontFamily: 'monospace', borderRight: '1px solid #e2e8f0', fontSize: '7pt' }}>{item.id}</td>
                      <td style={{ padding: '4px 7px', textAlign: 'center', fontWeight: 700, color: '#475569', borderRight: '1px solid #e2e8f0', fontSize: '7pt' }}>{item.category}</td>
                      <td style={{ padding: '4px 7px', color: '#334155', lineHeight: 1.4, borderRight: '1px solid #e2e8f0' }}>{item.item}</td>
                      <td style={{ padding: '4px 7px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>
                        <span style={{ padding: '1px 5px', borderRadius: '3px', fontWeight: 800, fontSize: '6.5pt', ...Object.fromEntries(resultBadge(item.result).split(';').filter(Boolean).map(s => { const [k,v]=s.split(':'); return [k.trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()), v.trim()]; })) }}>{item.result}</span>
                      </td>
                      <td style={{ padding: '4px 7px', textAlign: 'center', color: '#64748b', fontSize: '6.5pt' }}>{item.note}</td>
                    </>) : (<>
                      <td style={{ padding: '4px 7px', textAlign: 'center', fontWeight: 700, color: '#475569', borderRight: '1px solid #e2e8f0', fontSize: '7pt' }}>{item.category}</td>
                      <td style={{ padding: '4px 7px', color: '#334155', lineHeight: 1.4, borderRight: '1px solid #e2e8f0' }}>{item.item}</td>
                      <td style={{ padding: '4px 7px', textAlign: 'center', color: '#64748b', fontFamily: 'monospace', borderRight: '1px solid #e2e8f0', fontSize: '7pt' }}>{item.cycleRec}</td>
                      <td style={{ padding: '4px 7px', textAlign: 'center' }}>
                        <span style={{ padding: '1px 5px', borderRadius: '3px', fontWeight: 800, fontSize: '6.5pt', ...Object.fromEntries(resultBadge(item.result).split(';').filter(Boolean).map(s => { const [k,v]=s.split(':'); return [k.trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()), v.trim()]; })) }}>{item.result}</span>
                      </td>
                    </>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── 푸터 ── */}
          <div style={{ padding: '5mm 12mm 6mm', borderTop: '2px solid #1B2A4A', background: '#f8fafc', flexShrink: 0, pageBreakInside: 'avoid', pageBreakBefore: 'avoid' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '6.5pt', color: '#94a3b8', lineHeight: 1.7 }}>
                <div style={{ fontWeight: 800, color: '#475569', marginBottom: '2px' }}>㈜엑스게이트 · ICT사업본부 기술지원팀</div>
                <div>서울특별시 금천구 가산디지털1로 168, A동 1503호</div>
                <div>TEL: 02-1644-4306 | FAX: 02-2026-4306 | www.axgate.com</div>
                <div style={{ marginTop: '3px', color: '#cbd5e1' }}>본 문서는 {docNo} 기준으로 작성되었으며, 무단 배포를 금합니다.</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16pt', fontWeight: 900, color: '#1B2A4A', letterSpacing: '-1px', lineHeight: 1 }}>AX<span style={{ color: '#f97316' }}>GATE</span></div>
                <div style={{ fontSize: '6pt', color: '#94a3b8', letterSpacing: '2px', marginTop: '2px' }}>COPYRIGHT © AXGATE CO., LTD.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 단지 추가 모달 컴포넌트
const AddComplexModal = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '', region: '', address: '',
    builder: '현대건설', homenet: '현대HT',
    manager: '', contact: '',
    builderManager: '', builderContact: '',
    homenetManager: '', homenetContact: '',
    dongCount: 10, dongStartNum: 101, floorCount: 20, unitsPerFloor: 2,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(p => ({ ...p, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-600" /> {initialData ? '단지 정보 수정' : '신규 단지 등록'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
          <form id="add-complex-form" onSubmit={handleSubmit} className="space-y-8">
            {/* 단지 기본 정보 */}
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div> 단지 기본 정보
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">단지명 *</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" placeholder="예: 디에이치 아너힐즈" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">지역</label>
                  <input type="text" name="region" value={formData.region} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" placeholder="예: 서울 강남구" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">상세 주소</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" placeholder="단지 상세 주소 입력" />
                </div>
              </div>
            </div>

            {/* 시스템 정보 */}
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div> 시스템 정보
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">건설사</label>
                  <select name="builder" value={formData.builder} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all">
                    <option value="현대건설">현대건설</option>
                    <option value="삼성물산">삼성물산</option>
                    <option value="GS건설">GS건설</option>
                    <option value="대우건설">대우건설</option>
                    <option value="DL이앤씨">DL이앤씨</option>
                    <option value="포스코이앤씨">포스코이앤씨</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">홈넷사</label>
                  <select name="homenet" value={formData.homenet} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all">
                    <option value="현대HT">현대HT</option>
                    <option value="삼성SDS">삼성SDS</option>
                    <option value="이지스">이지스</option>
                    <option value="코콤">코콤</option>
                    <option value="코맥스">코맥스</option>
                    <option value="포스코DX">포스코DX</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 단지 구성 정보 */}
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-teal-500 rounded-full"></div> 단지 구성 정보 (동호수)
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">동 수</label>
                  <input type="number" name="dongCount" min={1} max={99} value={formData.dongCount} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all" placeholder="10" />
                  <p className="text-[11px] text-slate-400 mt-1">단지 내 전체 동 수</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">시작 동번호</label>
                  <input type="number" name="dongStartNum" min={1} max={999} value={formData.dongStartNum} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all" placeholder="101" />
                  <p className="text-[11px] text-slate-400 mt-1">첫 번째 동 번호 (예: 101동)</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">층 수</label>
                  <input type="number" name="floorCount" min={1} max={99} value={formData.floorCount} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all" placeholder="20" />
                  <p className="text-[11px] text-slate-400 mt-1">각 동의 최고 층수</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">층당 호수</label>
                  <input type="number" name="unitsPerFloor" min={1} max={20} value={formData.unitsPerFloor} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all" placeholder="2" />
                  <p className="text-[11px] text-slate-400 mt-1">각 층의 세대 수</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-teal-50 border border-teal-100 rounded-xl">
                <p className="text-xs text-teal-700 font-medium">
                  <span className="font-bold">미리보기:</span> {formData.dongStartNum}동 ~ {formData.dongStartNum + formData.dongCount - 1}동 / 각 {formData.floorCount}층 / 층당 {formData.unitsPerFloor}세대 → 총 <span className="font-black">{formData.dongCount * formData.floorCount * formData.unitsPerFloor}</span>세대
                </p>
              </div>
            </div>

            {/* 담당자 정보 */}
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-orange-500 rounded-full"></div> 담당자 정보
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">관리사무소 담당자</label>
                  <input type="text" name="manager" value={formData.manager} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" placeholder="예: 김소장" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">관리사무소 연락처</label>
                  <input type="text" name="contact" value={formData.contact} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" placeholder="010-0000-0000" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">건설사 담당자</label>
                  <input type="text" name="builderManager" value={formData.builderManager} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" placeholder="이름/직급" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">건설사 연락처</label>
                  <input type="text" name="builderContact" value={formData.builderContact} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" placeholder="010-0000-0000" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">홈넷사 담당자</label>
                  <input type="text" name="homenetManager" value={formData.homenetManager} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" placeholder="이름/직급" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">홈넷사 연락처</label>
                  <input type="text" name="homenetContact" value={formData.homenetContact} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" placeholder="010-0000-0000" />
                </div>
              </div>
            </div>
          </form>
        </div>
        
        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors">
            취소
          </button>
          <button type="submit" form="add-complex-form" className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all">
            {initialData ? '수정하기' : '등록하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- [대시보드 화면 컴포넌트들] ---

const ComplexListDashboard = ({ onNavigate, onSelectComplex, complexList, setComplexList }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체상태');
  const [builderFilter, setBuilderFilter] = useState('건설사 전체');
  const [homenetFilter, setHomenetFilter] = useState('홈넷사 전체');
  const [selectedIds, setSelectedIds] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingComplex, setEditingComplex] = useState(null);

  // --- 엑셀 관련 상태 및 Ref 추가 ---
  const [toastMessage, setToastMessage] = useState('');
  const fileInputRef = useRef(null);

  const [itemsPerPage, setItemsPerPage] = useState('10');
  const [currentPage, setCurrentPage] = useState(1);

  // 필터링 로직
  const filteredList = complexList.filter(item => {
    const matchSearch = item.name.includes(searchTerm) || item.builder.includes(searchTerm) || item.homenet.includes(searchTerm);
    const matchStatus = statusFilter === '전체상태' || item.status === statusFilter;
    const matchBuilder = builderFilter === '건설사 전체' || item.builder === builderFilter;
    const matchHomenet = homenetFilter === '홈넷사 전체' || item.homenet === homenetFilter;
    return matchSearch && matchStatus && matchBuilder && matchHomenet;
  });

  // 필터나 표시 수량이 변경되면 첫 페이지로 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, builderFilter, homenetFilter, itemsPerPage]);

  // 현재 페이지에 표시할 리스트 계산
  const displayedList = useMemo(() => {
    if (itemsPerPage === 'all') return filteredList;
    const start = (currentPage - 1) * Number(itemsPerPage);
    return filteredList.slice(start, start + Number(itemsPerPage));
  }, [filteredList, currentPage, itemsPerPage]);

  const totalPages = itemsPerPage === 'all' ? 1 : Math.ceil(filteredList.length / Number(itemsPerPage));

  const handleSelectAll = () => {
    const displayedIds = displayedList.map(item => item.id);
    const allDisplayedSelected = displayedIds.length > 0 && displayedIds.every(id => selectedIds.includes(id));

    if (allDisplayedSelected) {
      setSelectedIds(selectedIds.filter(id => !displayedIds.includes(id)));
    } else {
      const newSelected = [...selectedIds];
      displayedIds.forEach(id => {
        if (!newSelected.includes(id)) newSelected.push(id);
      });
      setSelectedIds(newSelected);
    }
  };

  const handleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleEditClick = () => {
    if (selectedIds.length === 1) {
      const complexToEdit = complexList.find(c => c.id === selectedIds[0]);
      setEditingComplex(complexToEdit);
      setShowAddModal(true);
    }
  };

  const handleDeleteClick = () => {
    setComplexList(prev => prev.filter(c => !selectedIds.includes(c.id)));
    setSelectedIds([]);
    setToastMessage(`${selectedIds.length}건의 단지가 삭제되었습니다.`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSaveComplex = (formData) => {
    if (formData.id) {
      // 수정 모드
      setComplexList(prev => prev.map(c => c.id === formData.id ? { ...c, ...formData } : c));
      setToastMessage('단지 정보가 수정되었습니다.');
    } else {
      // 신규 등록 모드
      const newId = `AX-PRM-${String(complexList.length + 1).padStart(2, '0')}`;
      const today = new Date().toISOString().split('T')[0];
      
      const newComplex = {
        ...formData,
        id: newId,
        status: '정상',
        report: '미발급',
        regDate: today,
        registrant: '관리자'
      };
      setComplexList([newComplex, ...complexList]);
      setToastMessage('신규 단지가 등록되었습니다.');
    }
    
    setShowAddModal(false);
    setEditingComplex(null);
    setSelectedIds([]); // 등록/수정 완료 후 선택 해제
    setTimeout(() => setToastMessage(''), 3000);
  };

  // --- 엑셀 템플릿 다운로드 핸들러 ---
  const handleDownloadTemplate = () => {
    const headers = ['단지명(필수)', '지역', '상세주소', '건설사', '홈넷사', '관리사무소_담당자', '관리사무소_연락처', '건설사_담당자', '건설사_연락처', '홈넷사_담당자', '홈넷사_연락처'];
    const sampleData = ['테스트 래미안', '서울 마포구', '서울특별시 마포구 테스트로 123', '삼성물산', '삼성SDS', '이소장', '010-1234-5678', '김과장', '010-2222-3333', '박대리', '010-4444-5555'];
    
    // BOM을 추가하여 엑셀에서 한글 깨짐 방지
    const csvContent = "\uFEFF" + headers.join(',') + '\n' + sampleData.join(',');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "AXGATE_단지등록_양식.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- 엑셀(CSV) 업로드 핸들러 ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split('\n');
      const newComplexes = [];
      
      // 첫 번째 줄은 헤더이므로 인덱스 1부터 시작
      for (let i = 1; i < rows.length; i++) {
        if (!rows[i].trim()) continue; // 빈 줄 건너뛰기
        const cols = rows[i].split(',');
        if (cols.length < 1) continue;
        
        const newId = `AX-PRM-EX${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
        newComplexes.push({
          id: newId,
          name: cols[0] ? cols[0].trim() : '이름없음',
          region: cols[1] ? cols[1].trim() : '',
          address: cols[2] ? cols[2].trim() : '',
          builder: cols[3] ? cols[3].trim() : '기타',
          homenet: cols[4] ? cols[4].trim() : '기타',
          manager: cols[5] ? cols[5].trim() : '',
          contact: cols[6] ? cols[6].trim() : '',
          builderManager: cols[7] ? cols[7].trim() : '',
          builderContact: cols[8] ? cols[8].trim() : '',
          homenetManager: cols[9] ? cols[9].trim() : '',
          homenetContact: cols[10] ? cols[10].trim() : '',
          status: '정상',
          report: '미발급',
          regDate: new Date().toISOString().split('T')[0],
          registrant: '엑셀등록'
        });
      }
      
      if (newComplexes.length > 0) {
        setComplexList(prev => [...newComplexes, ...prev]);
        setToastMessage(`${newComplexes.length}건의 단지가 성공적으로 등록되었습니다.`);
        setTimeout(() => setToastMessage(''), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // input 초기화
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] w-full mx-auto animate-in fade-in duration-500 h-[calc(100vh-176px)] min-h-[600px] relative">
      {/* 성공 토스트 메시지 */}
      {toastMessage && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl font-bold text-sm flex items-center gap-2 animate-in slide-in-from-top-4 fade-in duration-300">
          <CheckCircle2 size={18} />
          {toastMessage}
        </div>
      )}

      {showAddModal && <AddComplexModal onClose={() => { setShowAddModal(false); setEditingComplex(null); }} onSave={handleSaveComplex} initialData={editingComplex} />}
      
      <div className="bg-gradient-to-r from-[#2563eb] to-[#4f46e5] rounded-[1.5rem] p-6 shadow-md flex flex-col gap-4 relative overflow-hidden shrink-0">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-10 -translate-y-10">
          <Building2 size={240} />
        </div>
        <div className="relative z-10 flex items-center gap-3 mb-2 text-white">
          <Grid3X3 className="w-6 h-6" />
          <h2 className="text-xl font-black tracking-tight">내 단지관리</h2>
        </div>
        <div className="relative z-10 flex flex-wrap gap-4 items-center">
          <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/20 backdrop-blur-sm">
            <span className="text-white text-xs font-bold px-3 py-1.5 opacity-90">생성일자</span>
            <input type="date" defaultValue="2024-01-01" className="bg-white text-slate-700 text-xs font-bold rounded-lg px-3 py-1.5 outline-none" />
            <span className="text-white px-2">~</span>
            <input type="date" defaultValue="2026-12-31" className="bg-white text-slate-700 text-xs font-bold rounded-lg px-3 py-1.5 outline-none" />
          </div>
          
          <select 
            className="bg-white text-slate-700 text-xs font-bold rounded-xl px-4 py-2 border border-white/20 outline-none shadow-sm cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="전체상태">전체 상태</option>
            <option value="정상">정상</option>
            <option value="오프라인">오프라인</option>
            <option value="점검중">점검중</option>
          </select>

          <select 
            className="bg-white text-slate-700 text-xs font-bold rounded-xl px-4 py-2 border border-white/20 outline-none shadow-sm cursor-pointer"
            value={builderFilter}
            onChange={(e) => setBuilderFilter(e.target.value)}
          >
            <option value="건설사 전체">건설사 전체</option>
            <option value="현대건설">현대건설</option>
            <option value="삼성물산">삼성물산</option>
            <option value="GS건설">GS건설</option>
            <option value="대우건설">대우건설</option>
            <option value="DL이앤씨">DL이앤씨</option>
            <option value="포스코이앤씨">포스코이앤씨</option>
          </select>

          <select 
            className="bg-white text-slate-700 text-xs font-bold rounded-xl px-4 py-2 border border-white/20 outline-none shadow-sm cursor-pointer"
            value={homenetFilter}
            onChange={(e) => setHomenetFilter(e.target.value)}
          >
            <option value="홈넷사 전체">홈넷사 전체</option>
            <option value="현대HT">현대HT</option>
            <option value="삼성SDS">삼성SDS</option>
            <option value="이지스">이지스</option>
            <option value="코콤">코콤</option>
            <option value="코맥스">코맥스</option>
            <option value="포스코DX">포스코DX</option>
          </select>

          <div className="relative flex-1 min-w-[200px] max-w-md ml-auto">
            <input 
              type="text" 
              placeholder="단지명, 건설사, 홈넷사 검색..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/60 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:bg-white/20 transition-all backdrop-blur-sm"
            />
            <Search className="w-4 h-4 text-white/70 absolute right-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* 리스트 영역 */}
      <div className="flex-1 bg-white rounded-[1.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-0">
        <div className="px-6 py-4 bg-[#3b82f6] text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="text-sm font-bold">
              단지내역 <span className="font-normal opacity-80">(전체: {complexList.length}건, 검색: {filteredList.length}건)</span>
            </div>
            <div className="flex items-center gap-2 border-l border-white/20 pl-4">
              <span className="text-xs font-medium opacity-90">표시 수량</span>
              <select 
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(e.target.value)}
                className="bg-white/10 text-white text-xs font-bold rounded px-2 py-1 outline-none border border-white/20 cursor-pointer [&>option]:text-slate-800"
              >
                <option value="5">5개</option>
                <option value="10">10개</option>
                <option value="20">20개</option>
                <option value="50">50개</option>
                <option value="all">전체</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowAddModal(true)} className="px-3 py-1.5 bg-white hover:bg-slate-100 text-[#3b82f6] rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm">
              <Plus className="w-3.5 h-3.5" /> 단지 등록
            </button>
            <div className="w-px h-6 bg-white/20 mx-1"></div>
            
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" /> 엑셀등록
            </button>
            <button onClick={handleDownloadTemplate} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> 양식 다운로드
            </button>

            <div className="w-px h-6 bg-white/20 mx-1"></div>
            <button onClick={handleEditClick} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50" disabled={selectedIds.length !== 1}>
              <Edit className="w-3.5 h-3.5" /> 수정
            </button>
            <button onClick={handleDeleteClick} className="px-3 py-1.5 bg-white/10 hover:bg-rose-500 border border-white/20 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50" disabled={selectedIds.length === 0}>
              <Trash2 className="w-3.5 h-3.5" /> 삭제
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-[#f8fafc] border-b border-slate-200 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={displayedList.length > 0 && displayedList.every(item => selectedIds.includes(item.id))}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-500 tracking-wider">단지명(아파트)</th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-500 tracking-wider text-center">건설사</th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-500 tracking-wider text-center">홈넷사</th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-500 tracking-wider text-center">연결상태</th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-500 tracking-wider text-center">단지주소</th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-500 tracking-wider text-center">담당자</th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-500 tracking-wider text-center">연락처</th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-500 tracking-wider text-center">리포트상태</th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-500 tracking-wider text-center">최초 등록자</th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-500 tracking-wider text-center">서비스등록일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedList.length > 0 ? displayedList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors group cursor-pointer" onClick={(e) => { if (!e.target.closest('button') && !e.target.closest('input[type="checkbox"]')) handleSelect(item.id); }}>
                  <td className="px-4 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleSelect(item.id)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => onSelectComplex ? onSelectComplex(item.id) : onNavigate('complex_detail')}
                      className="text-sm font-bold text-blue-600 hover:underline hover:text-blue-800 text-left transition-colors"
                    >
                      {item.name}
                    </button>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.region}</div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center text-xs font-bold text-slate-600 gap-1.5">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-sm"></div> {item.builder}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center text-xs font-bold text-slate-600 gap-1.5">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div> {item.homenet}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black ${
                      item.status === '정상' ? 'bg-emerald-500 text-white' : 
                      item.status === '오프라인' ? 'bg-slate-400 text-white' : 
                      'bg-orange-500 text-white'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-xs text-slate-600 truncate block max-w-[160px] mx-auto" title={item.address}>{item.address}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-xs font-bold text-slate-700">{item.manager}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-xs font-mono text-slate-500">{item.contact}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded border text-[11px] font-bold ${
                      item.report === '발급' ? 'border-blue-200 text-blue-600 bg-blue-50' : 'border-slate-200 text-slate-400 bg-slate-50'
                    }`}>
                      {item.report}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-xs font-bold text-slate-700">{item.registrant}</span>
                  </td>
                  <td className="px-4 py-4 text-center text-xs font-bold text-slate-500">
                    {item.regDate}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="11" className="px-4 py-16 text-center text-slate-400 font-medium text-sm">
                    검색 조건에 일치하는 단지가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 페이징 영역 */}
        {itemsPerPage !== 'all' && totalPages > 1 && (
          <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-center items-center gap-4 shrink-0">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-white transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-slate-600">
              <span className="text-blue-600">{currentPage}</span> / {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-white transition-colors"
            >
              <ChevronRightIcon size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

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

// --- [신규 컴포넌트: HOMES (AXGATE 전용 수집 어플라이언스) 대시보드] ---
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

const VaccineDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('home');
  const [realtimeOn, setRealtimeOn] = useState(true);
  const [phishingOn, setPhishingOn] = useState(false);

  const menuItems = [
    { id: 'home', label: '보안 홈', icon: Home },
    { id: 'scan', label: '선택 검사', icon: Search },
    { id: 'phishing', label: '안티 피싱', icon: Globe },
    { id: 'optimize', label: 'PC최적화', icon: Zap },
    { id: 'help', label: '도움말', icon: Info },
  ];

  const settings = [
    { label: '검사설정', value: '실행 파일만 검사합니다.' },
    { label: '치료설정', value: '백업 후 삭제합니다.' },
    { label: '자동치료', value: '검사 시 수동 치료합니다.' },
    { label: '업데이트', value: '부팅 시 업데이트합니다.' },
  ];

  const extras = [
    { label: '로그 보기', icon: FileText },
    { label: '검역소 보기', icon: Archive },
    { label: '오토런 방지', icon: Lock },
    { label: '폴더보호', icon: Shield },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      {/* 상단 헤더: 로고 + 업데이트/환경설정 */}
      <div className="px-8 py-5 flex items-center justify-between border-b border-slate-100" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1B2A4A, #2563EB)' }}>
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div>
            <div className="font-black text-[18px] tracking-tight leading-none text-slate-800">SAFERHOME</div>
            <div className="text-[10px] font-semibold tracking-widest uppercase leading-none mt-1 text-slate-400">Internet Security</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold text-slate-600 hover:bg-slate-100 transition-colors">
            <RefreshCw size={13} /> 업데이트
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold text-slate-600 hover:bg-slate-100 transition-colors">
            <Settings size={13} /> 환경설정
          </button>
        </div>
      </div>

      {/* 본문 3컬럼 */}
      <div className="grid grid-cols-[180px_1fr_240px]">
        {/* 좌측 메뉴 */}
        <div className="py-6 px-3 border-r border-slate-100 flex flex-col">
          <nav className="flex-1 space-y-1">
            {menuItems.map(m => {
              const Icon = m.icon;
              const isActive = activeMenu === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveMenu(m.id)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all relative"
                  style={{
                    color: isActive ? '#1B2A4A' : '#64748B',
                    backgroundColor: isActive ? '#FEF3C7' : 'transparent',
                    fontWeight: isActive ? 700 : 500,
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#F1F5F9'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <Icon size={16} />
                  <span className="text-[13px]">{m.label}</span>
                  {isActive && <span className="absolute right-3 w-1 h-5 rounded-full" style={{ backgroundColor: '#f59e0b' }} />}
                </button>
              );
            })}
          </nav>
          <p className="text-[10px] text-slate-400 px-4 mt-4 leading-tight">© AXGATE SAFERHOME<br/>ALL RIGHTS RESERVED.</p>
        </div>

        {/* 중앙 메인 */}
        <div className="p-8">
          <h2 className="text-2xl font-black text-slate-800 mb-2">보안 홈</h2>
          <p className="text-[13px] text-slate-500 leading-relaxed mb-6">
            인터넷을 통해 유입되는 각종 바이러스 및 악성코드로 인한<br/>
            시스템 상태를 SAFERHOME을 이용하여 진단하고 치료할 수 있습니다.
          </p>

          {/* 설정 상태 박스 */}
          <div className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={16} style={{ color: '#f59e0b' }} />
              <span className="text-[13px] font-black text-slate-800">설정 상태</span>
            </div>
            <ul className="space-y-2.5">
              {settings.map(s => (
                <li key={s.label} className="flex items-center text-[13px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-3"></span>
                  <span className="font-bold text-slate-700 w-20">{s.label}</span>
                  <span className="text-slate-500">{s.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-center text-[12px] text-slate-400 mb-4">상기 설정 상태로 검사하시겠습니까?</p>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-[14px] font-black text-white shadow-md hover:shadow-lg transition-all" style={{ backgroundColor: '#1B2A4A' }}>
              <Search size={16} /> 정밀 검사
            </button>
            <button className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-[14px] font-black text-white shadow-md hover:shadow-lg transition-all" style={{ backgroundColor: '#f59e0b' }}>
              <Clock size={16} /> 빠른 검사
            </button>
          </div>
        </div>

        {/* 우측 패널 */}
        <div className="p-6 border-l border-slate-100 flex flex-col gap-5" style={{ backgroundColor: '#FAFBFC' }}>
          {/* 모니터링 */}
          <div>
            <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <span className="w-1 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }}></span>
              모니터링
            </p>
            <div className="space-y-2">
              <button
                onClick={() => setRealtimeOn(v => !v)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 transition-colors"
              >
                <span className="text-[12px] font-bold text-slate-700">실시간 감시 {realtimeOn ? 'On' : 'Off'}</span>
                <span className={`inline-flex w-8 h-4 rounded-full items-center px-0.5 transition-colors ${realtimeOn ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}>
                  <span className="w-3 h-3 rounded-full bg-white shadow"></span>
                </span>
              </button>
              <button
                onClick={() => setPhishingOn(v => !v)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 transition-colors"
              >
                <span className="text-[12px] font-bold text-slate-700">피싱 감시 {phishingOn ? 'On' : 'Off'}</span>
                {phishingOn ? (
                  <span className="inline-flex w-8 h-4 rounded-full items-center px-0.5 bg-emerald-500 justify-end">
                    <span className="w-3 h-3 rounded-full bg-white shadow"></span>
                  </span>
                ) : (
                  <X size={14} className="text-rose-400" />
                )}
              </button>
            </div>
          </div>

          {/* 부가기능 */}
          <div>
            <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <span className="w-1 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }}></span>
              부가기능
            </p>
            <div className="space-y-1.5">
              {extras.map(ex => {
                const Icon = ex.icon;
                return (
                  <button
                    key={ex.label}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors group"
                  >
                    <span className="flex items-center gap-2 text-[12px] font-bold text-slate-700">
                      <Icon size={13} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                      {ex.label}
                    </span>
                    <ArrowRight size={12} className="text-slate-400" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* 운영상태 */}
          <div className="mt-auto pt-4 border-t border-slate-200">
            <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2">운영상태</p>
            <div className="text-[11px] text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>업데이트</span>
                <span className="font-mono font-bold text-slate-700">2026.04.16.0</span>
              </div>
              <div className="flex justify-between">
                <span>최종검사</span>
                <span className="font-mono font-bold text-slate-700">2026/04/03</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

  const [reportStatus, setReportStatus] = useState([
    { type: "보안 취약점 점검", interval: "주간", lastDate: "2026-02-19", nextDate: "2026-02-26", status: "발급완료" },
    { type: "안전 점검", interval: "주간", lastDate: "2026-02-15", nextDate: "2026-02-22", status: "발급완료" },
    { type: "월간 종합 점검", interval: "월간", lastDate: "2026-01-31", nextDate: "2026-02-28", status: "작성중" }
  ]);

  const handleIssueReport = (idx) => {
    setReportStatus(prev => prev.map((r, i) => {
      if (i !== idx) return r;
      const today = new Date();
      const lastDate = today.toISOString().slice(0, 10);
      const next = new Date(today);
      if (r.interval === '주간') next.setDate(next.getDate() + 7);
      else if (r.interval === '월간') next.setMonth(next.getMonth() + 1);
      else next.setDate(next.getDate() + 7);
      return { ...r, status: '발급완료', lastDate, nextDate: next.toISOString().slice(0, 10) };
    }));
  };

  const tabs = [
    { id: 'summary', label: '단지 요약', icon: LayoutDashboard },
    { id: 'vaccine', label: '백신', icon: ShieldCheck },
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
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                <Building2 size={240} className="text-slate-900" />
              </div>
              <div className="flex flex-col lg:flex-row gap-4 relative z-10">
                <div className="flex-1 flex flex-col gap-3 min-w-0">
                  {/* 시스템 헬스 스트립 */}
                  <div className="shrink-0">
                    <p className="text-[13px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-2">상태 정보</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        { id: 'server', label: '단지서버', icon: Server, online: true },
                        { id: 'log_server', label: 'AXGATE SAFERHOME', icon: Archive, online: true },
                        { id: 'firewall', label: '방화벽', icon: Shield, online: false },
                        { id: 'network', label: '백본', icon: Network, online: true },
                      ].map(item => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={item.id}
                            className="relative overflow-hidden rounded-xl px-4 pt-4 pb-3 text-left flex items-center gap-3 shadow-sm bg-white border border-slate-200"
                          >
                            <span className={`absolute left-0 right-0 top-0 h-1 ${item.online ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400' : 'bg-gradient-to-r from-red-400 via-red-500 to-red-400'}`}></span>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.online ? 'bg-blue-50' : 'bg-red-50'}`}>
                              <Icon size={18} className={item.online ? 'text-blue-600' : 'text-red-500'} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-black text-slate-800 tracking-tight truncate">{item.label}</p>
                              <span className={`inline-flex items-center gap-1.5 mt-0.5 ${item.online ? 'text-blue-600' : 'text-red-500'}`}>
                                {item.online ? (
                                  <span className="relative flex w-2 h-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex w-2 h-2 rounded-full bg-blue-500"></span>
                                  </span>
                                ) : (
                                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                )}
                                <span className="text-[11px] font-black">{item.online ? '장비 구동중' : '장비 미가동'}</span>
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 담당자 / 등록일 그리드 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 flex-1">
                    <div className="bg-[#f8fafc] p-3 rounded-lg border border-slate-100 flex flex-col justify-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">시스템 등록일</p>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400" />
                        <p className="text-sm font-black text-slate-800 font-mono">{complexInfo.regDate}</p>
                      </div>
                    </div>

                    <div className="bg-[#f8fafc] p-3 rounded-lg border border-slate-100 flex flex-col justify-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">단지 관리사무소</p>
                      <div className="flex items-end justify-between gap-2">
                        <p className="text-sm font-black text-slate-800 truncate">{complexInfo.manager}</p>
                        <p className="text-[11px] font-bold text-slate-500 font-mono shrink-0">{complexInfo.contact}</p>
                      </div>
                    </div>

                    <div className="bg-[#f8fafc] p-3 rounded-lg border border-slate-100 flex flex-col justify-center relative">
                      <div className="flex justify-between items-center mb-0.5 gap-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">건설사 담당자</p>
                        <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold shrink-0">{complexInfo.builder}</span>
                      </div>
                      <div className="flex items-end justify-between gap-2">
                        <p className="text-sm font-black text-slate-800 truncate">{complexInfo.builderManager}</p>
                        <p className="text-[11px] font-bold text-slate-500 font-mono shrink-0">{complexInfo.builderContact}</p>
                      </div>
                    </div>

                    <div className="bg-[#f8fafc] p-3 rounded-lg border border-slate-100 flex flex-col justify-center relative">
                      <div className="flex justify-between items-center mb-0.5 gap-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">홈넷사 담당자</p>
                        <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold shrink-0">{complexInfo.homenet}</span>
                      </div>
                      <div className="flex items-end justify-between gap-2">
                        <p className="text-sm font-black text-slate-800 truncate">{complexInfo.homenetManager}</p>
                        <p className="text-[11px] font-bold text-slate-500 font-mono shrink-0">{complexInfo.homenetContact}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 월간 종합 점검 원클릭 발급 CTA */}
                <div className="lg:w-56 shrink-0 rounded-2xl p-5 flex flex-col justify-between text-white shadow-lg relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 55%, #818cf8 100%)' }}>
                  <div className="absolute -top-6 -right-6 opacity-10 pointer-events-none">
                    <FileText size={120} />
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-black opacity-80 uppercase tracking-widest mb-1">One-Click Issue</p>
                    <p className="text-lg font-black leading-tight">월간 종합<br/>점검 발급</p>
                    <p className="text-[11px] font-bold opacity-80 mt-1.5">
                      {reportStatus[2]?.status === '발급완료'
                        ? `최근 발급 ${reportStatus[2]?.lastDate}`
                        : '한 번의 클릭으로 즉시 발급'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleIssueReport(2)}
                    className="relative z-10 mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-black bg-white text-indigo-600 hover:bg-indigo-50 transition-all shadow-md"
                  >
                    <FileText size={14} />
                    원클릭 발급
                  </button>
                </div>
              </div>
            </div>

            {/* 보고서 발급 상태 테이블 섹션 */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="px-10 py-7 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                  <FileSpreadsheet className="w-6 h-6 text-indigo-600" /> 단지별 보고서 발급 현황
                </h3>
                <div className="flex gap-2">
                   <button onClick={() => onNavigate && onNavigate('report')} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                     전체 이력 보기
                   </button>
                </div>
              </div>
              
              <div className="p-8">
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#f8fafc] border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">보고서 유형</th>
                        <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">점검 주기</th>
                        <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">최근 발급일</th>
                        <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">차기 발급 예정일</th>
                        <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">발급 상태</th>
                        <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">발급</th>
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
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleIssueReport(idx)}
                              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[12px] font-black bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md whitespace-nowrap"
                            >
                              <FileText size={14} />
                              발급
                            </button>
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
        {activeTab === 'vaccine' && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <VaccineDashboard />
          </div>
        )}
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

const VulnerabilityDashboard = ({ onLog, complexId, complexList, vulnerabilityData, onDataChange, onSelectComplex }) => {
  const [checklist, setChecklist] = useState(complexId ? (vulnerabilityData[complexId] || []) : []);
  const [showPreview, setShowPreview] = useState(false);
  const [inspectDate, setInspectDate] = useState("2026-02-20");
  const [landingSearch, setLandingSearch] = useState('');
  const [landingView, setLandingView] = useState('grid');
  const [checkedIds, setCheckedIds] = useState([]);

  // 결재 상태 관리
  const [approvals, setApprovals] = useState([
    { role: '담 당', name: '장정구', date: '02.20', status: 'approved' },
    { role: '주 임', name: '', date: '', status: 'pending' },
    { role: '과 장', name: '', date: '', status: 'pending' },
    { role: '소 장', name: '', date: '', status: 'pending' }
  ]);

  useEffect(() => {
    if (complexId && vulnerabilityData[complexId]) {
      setChecklist(vulnerabilityData[complexId]);
    }
  }, [complexId]);

  const groupedList = useMemo(() => {
    return checklist.reduce((acc, curr) => {
      const { category } = curr;
      if (!acc[category]) acc[category] = [];
      acc[category].push(curr);
      return acc;
    }, {});
  }, [checklist]);

  const handleResultChange = (id, newResult) => {
    const updated = checklist.map(item => item.id === id ? { ...item, result: newResult } : item);
    setChecklist(updated);
    if (complexId && onDataChange) onDataChange(complexId, updated);
  };

  const handleNoteChange = (id, newNote) => {
    const updated = checklist.map(item => item.id === id ? { ...item, note: newNote } : item);
    setChecklist(updated);
    if (complexId && onDataChange) onDataChange(complexId, updated);
  };

  // --- 랜딩 모드 (단지 미선택) ---
  if (!complexId) {
    const filtered = landingSearch.trim()
      ? complexList.filter(c =>
          c.name.toLowerCase().includes(landingSearch.toLowerCase()) ||
          c.region.toLowerCase().includes(landingSearch.toLowerCase())
        )
      : complexList;

    const toggleCheck = (id, e) => {
      e.stopPropagation();
      setCheckedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };
    const allChecked = filtered.length > 0 && filtered.every(c => checkedIds.includes(c.id));
    const toggleAll = () => {
      if (allChecked) setCheckedIds(prev => prev.filter(id => !filtered.find(c => c.id === id)));
      else setCheckedIds(prev => [...new Set([...prev, ...filtered.map(c => c.id)])]);
    };

    return (
      <div className="flex flex-col gap-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
        <div className="rounded-3xl p-8 shadow-sm border border-slate-300/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" style={{ backgroundColor: '#E2E8F0' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><AlertTriangle className="w-6 h-6" /></div>
            <div>
              <h2 className="text-lg font-black text-slate-800">취약점 분석 및 조치 — 단지 선택</h2>
              <p className="text-xs text-slate-400 mt-0.5">점검할 단지를 선택하세요</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={landingSearch}
                onChange={(e) => setLandingSearch(e.target.value)}
                placeholder="단지명 또는 지역 검색..."
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            {/* 뷰 전환 탭 */}
            <div className="flex bg-slate-100 rounded-xl p-1 gap-0.5">
              <button onClick={() => setLandingView('grid')} className={`p-2 rounded-lg transition-all ${landingView === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}><Grid3X3 className="w-4 h-4" /></button>
              <button onClick={() => setLandingView('list')} className={`p-2 rounded-lg transition-all ${landingView === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}><ListFilter className="w-4 h-4" /></button>
            </div>
            <button
              onClick={() => alert(checkedIds.length > 0 ? `선택된 ${checkedIds.length}개 단지 취약점 보고서 일괄 다운로드 (데모)` : '전체 단지 취약점 보고서 일괄 다운로드 (데모)')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 whitespace-nowrap ${checkedIds.length > 0 ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-900 text-white hover:bg-black'}`}
            >
              <Download className="w-4 h-4" /> 일괄 다운로드{checkedIds.length > 0 && ` (${checkedIds.length})`}
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400 font-medium bg-white rounded-3xl border border-slate-100 shadow-sm">
            <Search className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="text-sm">검색 결과가 없습니다</p>
          </div>
        ) : landingView === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {filtered.map(c => {
              const data = vulnerabilityData[c.id] || [];
              const good = data.filter(i => i.result === '양호').length;
              const bad = data.filter(i => i.result === '취약').length;
              const manual = data.filter(i => i.result === '수동점검').length;
              const isChecked = checkedIds.includes(c.id);
              const statusColor = c.status === '정상' ? 'emerald' : c.status === '점검중' ? 'amber' : 'rose';
              return (
                <div
                  key={c.id}
                  onClick={() => onSelectComplex(c.id)}
                  className={`bg-white rounded-3xl border shadow-sm p-6 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all group ${isChecked ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-slate-200/60 hover:border-indigo-200'}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => toggleCheck(c.id, e)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer mt-0.5 shrink-0"
                      />
                      <div>
                        <h3 className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{c.name}</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" />{c.region}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold bg-${statusColor}-50 text-${statusColor}-600 border border-${statusColor}-100`}>{c.status}</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-indigo-500" />
                      <span className="text-sm font-black text-slate-800">{data.length}</span>
                      <span className="text-[10px] font-bold text-slate-400">건</span>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="text-[9px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-100">양호 {good}</span>
                      <span className="text-[9px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-100">취약 {bad}</span>
                      <span className="text-[9px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-100">수동 {manual}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* 목록 뷰 */
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200/60 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 w-12 text-center">
                    <input type="checkbox" checked={allChecked} onChange={toggleAll} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                  </th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">단지명</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">지역</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">상태</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">총 항목</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">점검 현황</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">상세</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(c => {
                  const data = vulnerabilityData[c.id] || [];
                  const good = data.filter(i => i.result === '양호').length;
                  const bad = data.filter(i => i.result === '취약').length;
                  const manual = data.filter(i => i.result === '수동점검').length;
                  const isChecked = checkedIds.includes(c.id);
                  return (
                    <tr key={c.id} className={`transition-colors cursor-pointer ${isChecked ? 'bg-indigo-50/50' : 'hover:bg-slate-50/70'}`} onClick={() => onSelectComplex(c.id)}>
                      <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={isChecked} onChange={(e) => toggleCheck(c.id, e)} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors">{c.name}</span>
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-500">{c.region}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${c.status === '정상' ? 'bg-emerald-50 text-emerald-600' : c.status === '점검중' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>{c.status}</span>
                      </td>
                      <td className="px-4 py-4 text-center text-sm font-black text-indigo-600">{data.length}건</td>
                      <td className="px-4 py-4">
                        <div className="flex gap-1.5">
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">양호 {good}</span>
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">취약 {bad}</span>
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">수동 {manual}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => onSelectComplex(c.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"><ChevronRight className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // --- 상세 모드 (단지 선택됨) ---
  const currentComplex = complexList.find(c => c.id === complexId);
  const total = checklist.length;
  const good = checklist.filter(i => i.result === '양호').length;
  const bad = checklist.filter(i => i.result === '취약').length;
  const manual = checklist.filter(i => i.result === '수동점검').length;

  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      {showPreview && (
        <DocumentPreviewModal
          onClose={() => setShowPreview(false)}
          title="단지서버 보안 취약점 점검 보고서"
          date={inspectDate}
          approvals={approvals}
          checklist={checklist}
          type="vulnerability"
        />
      )}

      {/* 단지 정보 바 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/60 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#f97316' }}>
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{currentComplex?.name}</p>
          <div className="flex items-center gap-2.5 mt-0.5">
            <span className="flex items-center gap-1 text-[11px] text-slate-400"><MapPin className="w-3 h-3" />{currentComplex?.region}</span>
            <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: currentComplex?.status === '정상' ? '#10b981' : currentComplex?.status === '점검중' ? '#f59e0b' : '#64748b' }}><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentComplex?.status === '정상' ? '#10b981' : currentComplex?.status === '점검중' ? '#f59e0b' : '#64748b' }} />상태: {currentComplex?.status}</span>
            <span className="text-[11px] text-slate-400">총 {currentComplex?.dongCount || 0}동 / {currentComplex?.totalUnits || 0}세대</span>
          </div>
        </div>
        <button onClick={() => onSelectComplex(null)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all shrink-0">
          <ArrowLeft className="w-3.5 h-3.5" /> 목록
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold text-slate-400 uppercase">전체 항목</p><p className="text-3xl font-black text-slate-800 mt-1">{total}</p></div>
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500"><ListFilter /></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold text-emerald-600 uppercase">양호 (Good)</p><p className="text-3xl font-black text-emerald-600 mt-1">{good}</p></div>
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600"><CheckCircle2 /></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold text-rose-600 uppercase">취약 (Vulnerable)</p><p className="text-3xl font-black text-rose-600 mt-1">{bad}</p></div>
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600"><AlertTriangle /></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold text-blue-600 uppercase">수동 점검 (Manual)</p><p className="text-3xl font-black text-blue-600 mt-1">{manual}</p></div>
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><ClipboardCheck /></div>
        </div>
      </div>

      <div className="flex flex-col h-full gap-6">
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200/60 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><CalendarDays className="w-6 h-6" /></div>
              <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">점검 일자</p><input type="date" value={inspectDate} onChange={(e) => setInspectDate(e.target.value)} className="font-bold text-slate-800 bg-transparent outline-none cursor-pointer hover:text-indigo-600 transition-colors" /></div>
            </div>
            <div className="h-10 w-px bg-slate-100"></div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><User className="w-6 h-6" /></div>
              <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">점검자</p><input type="text" defaultValue="장정구" className="font-bold text-slate-800 bg-transparent outline-none w-24 hover:text-emerald-600 transition-colors" /></div>
            </div>
          </div>

          <ApprovalSystem approvals={approvals} setApprovals={setApprovals} />
        </div>

        <div className="flex-1 bg-white rounded-[2.5rem] shadow-xl border border-slate-200/60 overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-indigo-600" /> 단지서버 보안 취약점 점검 리스트
            </h3>
            <div className="flex gap-2">
              <button onClick={() => onLog && onLog('[VULNERABILITY] 점검 결과가 저장되었습니다.')} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
                <CheckSquare className="w-4 h-4" /> 결과 저장
              </button>
              <button onClick={() => setShowPreview(true)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm flex items-center gap-2">
                <Eye className="w-4 h-4" /> 미리보기
              </button>
              <button onClick={() => setShowPreview(true)} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-md flex items-center gap-2">
                <Download className="w-4 h-4" /> PDF 다운로드
              </button>
            </div>
          </div>

          <div className="flex-1 p-8">
            <div className="space-y-8">
              {Object.entries(groupedList).map(([category, items], catIdx) => (
                <div key={catIdx} className="bg-slate-50 rounded-3xl p-6 border border-slate-200/60">
                  <h4 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div> {category}
                  </h4>
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider w-24">ID</th>
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider w-1/2">점검 항목</th>
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider w-32 text-center">점검 결과</th>
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">비고</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {items.map((checkItem, idx) => (
                          <tr key={idx} className="hover:bg-indigo-50/30 transition-colors group">
                            <td className="px-6 py-4 text-xs font-mono font-bold text-slate-500">{checkItem.id}</td>
                            <td className="px-6 py-4 text-xs font-bold text-slate-700">{checkItem.item}</td>
                            <td className="px-6 py-4 text-center">
                              <select
                                value={checkItem.result}
                                onChange={(e) => handleResultChange(checkItem.id, e.target.value)}
                                className={`bg-white border border-slate-200 text-xs font-bold rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer transition-colors ${
                                  checkItem.result === '양호' ? 'text-emerald-600' :
                                  checkItem.result === '취약' ? 'text-rose-600' :
                                  'text-blue-600'
                                }`}
                              >
                                <option value="양호" className="text-emerald-600">양호</option>
                                <option value="취약" className="text-rose-600">취약</option>
                                <option value="수동점검" className="text-blue-600">수동점검</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-400">
                              <input
                                type="text"
                                value={checkItem.note === '-' ? '' : checkItem.note}
                                onChange={(e) => handleNoteChange(checkItem.id, e.target.value === '' ? '-' : e.target.value)}
                                placeholder="특이사항 입력..."
                                className="bg-transparent border-b border-transparent focus:border-indigo-300 outline-none w-full text-xs hover:border-slate-200 transition-colors placeholder:text-slate-300"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- [망분리 대시보드 전용 데이터 및 컴포넌트] ---
const generateHighRiseDevices = (config = {}) => {
  const { dongCount = 10, dongStartNum = 101, floorCount = 20, unitsPerFloor = 2 } = config;
  const dongs = Array.from({ length: dongCount }, (_, i) => `${dongStartNum + i}동`);
  const errorTypes = ['VPN 연결 오류', '보안 모듈 응답 없음', '물리적 회선 단절', '비정상 트래픽 감지', '인증 서버 타임아웃'];
  const devices = [];
  let id = 1;
  const errorDong1 = dongs[0];
  const errorDong2 = dongs.length >= 5 ? dongs[4] : dongs[dongs.length - 1];
  const errorFloors1 = [1, Math.ceil(floorCount * 0.25), Math.ceil(floorCount * 0.5), Math.ceil(floorCount * 0.75), floorCount];
  const errorFloors2 = [1, Math.ceil(floorCount * 0.3), Math.ceil(floorCount * 0.55), Math.ceil(floorCount * 0.8), Math.max(1, floorCount - 1)];
  dongs.forEach(dong => {
    for (let f = 1; f <= floorCount; f++) {
      for (let r = 1; r <= unitsPerFloor; r++) {
        const isDong1Fail = dong === errorDong1 && errorFloors1.includes(f) && r === 1;
        const isDong2Fail = dong === errorDong2 && errorFloors2.includes(f) && r === Math.min(2, unitsPerFloor);
        const isError = isDong1Fail || isDong2Fail;

        const serialNum = `AZ3N050LQ239${String(id).padStart(4, '0')}`;
        const errType = isError ? errorTypes[Math.floor(Math.random() * errorTypes.length)] : null;

        devices.push({
          id: id++,
          dong: String(dong),
          unit: `${dong} ${f}0${r}호`,
          floor: f,
          room: r,
          model: 'AXGATE-50LQ',
          serial: serialNum,
          osVersion: 'v2.4.1',
          status: isError ? 'error' : 'normal',
          errorType: errType
        });
      }
    }
  });
  return devices;
};

// 가상 장애 세대 로그 생성
const generateInitialHistory = (devices = []) => {
  const faultUnits = devices.filter(d => d.status === 'error').map(d => d.unit);
  const normalDevices = devices.filter(d => d.status === 'normal');
  const normalUnits = normalDevices.slice(0, Math.min(5, normalDevices.length)).map(d => d.unit);

  if (faultUnits.length === 0 && normalUnits.length === 0) return [];

  const infoMessages = ['시스템 초기화 및 부팅 완료', '보안 모듈 무결성 검사 통과', '하트비트 신호 정상 송수신', '보안 정책 자동 업데이트 확인', '정기 상태 체크 (이상 없음)', '단지서버 동기화 완료', 'VPN 터널링 연결 유지'];
  const errorMessages = ['게이트웨이 인증 서버 응답 지연', '경고: 비정상적인 패킷 유입 감지', '치명적 오류: 하트비트 신호 소실', '물리적 링크 단절 감지', '비정상 트래픽 감지 (차단됨)', 'VPN 터널링 연결 끊김'];
  const humanMessages = ['관리자 원격 접속 시도', '현장 점검 요청 접수', '장비 전원 리셋 명령 전송', '보안 정책 수동 오버라이드 적용', '유지보수 팀 현장 출동 지시', '담당자 유선 확인 완료'];

  let logs = [];
  let logId = 1;
  const today = new Date();

  const allUnits = [...faultUnits, ...normalUnits];

  allUnits.forEach(unit => {
    const isFault = faultUnits.includes(unit);
    const logCount = isFault ? 12 : 5; // 장애 세대는 12개, 정상 세대는 5개의 로그

    for (let i = 0; i < logCount; i++) {
      const r = Math.random();
      let category = 'system';
      let type = 'info';
      let msg = '';

      if (isFault) {
        // 장애 세대: 에러 30%, 일반 50%, 수동 조치 20%
        if (r < 0.3) { type = 'error'; msg = errorMessages[Math.floor(Math.random() * errorMessages.length)]; }
        else if (r < 0.8) { type = 'info'; msg = infoMessages[Math.floor(Math.random() * infoMessages.length)]; }
        else { category = 'human'; type = 'recovery'; msg = humanMessages[Math.floor(Math.random() * humanMessages.length)]; }
      } else {
        // 정상 세대: 에러 5%, 일반 85%, 수동 조치 10%
        if (r < 0.05) { type = 'error'; msg = errorMessages[Math.floor(Math.random() * errorMessages.length)]; }
        else if (r < 0.9) { type = 'info'; msg = infoMessages[Math.floor(Math.random() * infoMessages.length)]; }
        else { category = 'human'; type = 'recovery'; msg = humanMessages[Math.floor(Math.random() * humanMessages.length)]; }
      }

      const time = new Date(today);
      time.setMinutes(time.getMinutes() - (i * 45 + Math.floor(Math.random() * 20)));

      logs.push({
        id: logId++,
        unit: String(unit),
        type: type,
        category: category,
        message: String(msg),
        timestamp: time.toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        user: category === 'human' ? (Math.random() > 0.5 ? '김관리' : '이보안') : null,
        timestampValue: time.getTime()
      });
    }
  });
  return logs.sort((a, b) => b.timestampValue - a.timestampValue);
};

const INITIAL_NOTICES = [
  { id: 1, title: "[긴급] 외부 위협 IP 차단 업데이트", date: "2026-02-21", type: "urgent", content: "최신 위협 인텔리전스 기반 블랙리스트가 갱신되었습니다. 즉시 적용 바랍니다." },
  { id: 2, title: "정기 시스템 점검 안내 (23:00)", date: "2026-02-20", type: "notice", content: "안정성 확보를 위한 코어 서버 리부팅이 예정되어 있습니다." },
  { id: 3, title: "AXGATE-50LQ 펌웨어 v2.5.0 릴리즈", date: "2026-02-19", type: "update", content: "암호화 성능 30% 향상 및 UI 버그 수정." }
];

// 가상 문의 내역 데이터 (관리자 확인용)
const INITIAL_INQUIRIES = [
  { id: 1, user: '101동 101호 관리자', type: '장애', content: 'VPN 터널링이 간헐적으로 끊어지는 현상이 발생합니다. 로그 확인 부탁드립니다.', date: '2026-02-21 14:30', status: '대기중' },
  { id: 2, user: '단지 통합 관리소장', type: '지원', content: '월간 리포트 자동 발송 수신처를 하나 더 추가하고 싶습니다. 방법 안내 바랍니다.', date: '2026-02-20 09:15', status: '처리완료' },
  { id: 3, user: '105동 602호 관리자', type: '장애', content: '단말 오프라인 상태 지속됨. 현장 출동이 필요해 보입니다.', date: '2026-02-19 16:45', status: '처리완료' }
];

const INITIAL_ACCOUNTS = [
  { id: 'admin', name: '최고관리자', role: 'Super Admin', status: '활성', lastLogin: '2026-02-21 09:00', target: '전체 시스템 권한' },
  { id: 'jang_jg', name: '장정구', role: 'System Engineer', status: '활성', lastLogin: '2026-02-20 14:30', target: '전체 단지 유지보수' },
  { id: 'park_si', name: '박신일', role: 'Complex Manager', status: '활성', lastLogin: '2026-02-21 08:45', target: '디에이치 아너힐즈, 올림픽파크 포레온' },
  { id: 'lee_yh', name: '이영희', role: 'Viewer', status: '비활성', lastLogin: '2026-01-15 11:20', target: '반포 자이 (읽기 전용)' },
];

const PacketChart = ({ data }) => {
  const numericData = data.map(Number);
  const max = Math.max(...numericData, 100);
  const points = numericData.map((val, i) => `${(i / (numericData.length - 1)) * 100},${100 - (val / max) * 100}`).join(' ');
  const currentVal = numericData[numericData.length - 1].toFixed(1);

  return (
    <div className="w-full h-32 bg-slate-900 rounded-2xl p-0 relative overflow-hidden border border-slate-800 shadow-inner group">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      <div className="absolute top-3 left-4 flex items-center gap-2 z-10">
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]" />
        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest font-sans">실시간 트래픽 현황</span>
      </div>
      <div className="absolute bottom-3 right-4 z-10 text-right">
        <div className="text-2xl font-bold text-white font-mono leading-none">{currentVal} <span className="text-xs text-slate-400">Mbps</span></div>
      </div>
      <svg className="w-full h-full relative z-0 transform scale-x-105 scale-y-75 translate-y-4" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M 0 100 L ${points} L 100 100 Z`} fill="url(#gradient)" />
        <polyline fill="none" stroke="#60a5fa" strokeWidth="2" points={points} className="drop-shadow-lg" />
      </svg>
    </div>
  );
};

// 원형 그래프 컴포넌트
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

const SafetyInspectionDashboard = ({ onLog, complexId, complexList, safetyInspectionData, onDataChange, onSelectComplex }) => {
  // 결재 상태 관리
  const [approvals, setApprovals] = useState([
    { role: '담 당', name: '박신일', date: '02.20', status: 'approved' },
    { role: '주 임', name: '', date: '', status: 'pending' },
    { role: '과 장', name: '', date: '', status: 'pending' },
    { role: '소 장', name: '', date: '', status: 'pending' }
  ]);
  const [showPreview, setShowPreview] = useState(false);
  const [inspectDate, setInspectDate] = useState(new Date().toISOString().split('T')[0]);
  const [landingSearch, setLandingSearch] = useState('');
  const [landingView, setLandingView] = useState('grid');
  const [checkedIds, setCheckedIds] = useState([]);

  const [checklist, setChecklist] = useState(
    complexId ? (safetyInspectionData[complexId] || []) : []
  );

  useEffect(() => {
    if (complexId && safetyInspectionData[complexId]) {
      setChecklist(safetyInspectionData[complexId]);
    }
  }, [complexId]);

  const handleResultChange = (id, newResult) => {
    const updated = checklist.map(item => item.id === id ? { ...item, result: newResult } : item);
    setChecklist(updated);
    if (complexId && onDataChange) onDataChange(complexId, updated);
  };

  const groupedList = checklist.reduce((acc, curr) => {
    const { category } = curr;
    if (!acc[category]) acc[category] = [];
    acc[category].push(curr);
    return acc;
  }, {});

  // --- 랜딩 모드 (단지 미선택) ---
  if (!complexId) {
    const filtered = landingSearch.trim()
      ? complexList.filter(c =>
          c.name.toLowerCase().includes(landingSearch.toLowerCase()) ||
          c.region.toLowerCase().includes(landingSearch.toLowerCase())
        )
      : complexList;

    const toggleCheck = (id, e) => {
      e.stopPropagation();
      setCheckedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };
    const allChecked = filtered.length > 0 && filtered.every(c => checkedIds.includes(c.id));
    const toggleAll = () => {
      if (allChecked) setCheckedIds(prev => prev.filter(id => !filtered.find(c => c.id === id)));
      else setCheckedIds(prev => [...new Set([...prev, ...filtered.map(c => c.id)])]);
    };

    return (
      <div className="flex flex-col gap-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
        <div className="rounded-3xl p-8 shadow-sm border border-slate-300/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" style={{ backgroundColor: '#E2E8F0' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><ClipboardCheck className="w-6 h-6" /></div>
            <div>
              <h2 className="text-lg font-black text-slate-800">홈네트워크 안전점검 — 단지 선택</h2>
              <p className="text-xs text-slate-400 mt-0.5">점검할 단지를 선택하세요</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={landingSearch}
                onChange={(e) => setLandingSearch(e.target.value)}
                placeholder="단지명 또는 지역 검색..."
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            {/* 뷰 전환 탭 */}
            <div className="flex bg-slate-100 rounded-xl p-1 gap-0.5">
              <button onClick={() => setLandingView('grid')} className={`p-2 rounded-lg transition-all ${landingView === 'grid' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}><Grid3X3 className="w-4 h-4" /></button>
              <button onClick={() => setLandingView('list')} className={`p-2 rounded-lg transition-all ${landingView === 'list' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}><ListFilter className="w-4 h-4" /></button>
            </div>
            <button
              onClick={() => alert(checkedIds.length > 0 ? `선택된 ${checkedIds.length}개 단지 안전점검 보고서 일괄 다운로드 (데모)` : '전체 단지 안전점검 보고서 일괄 다운로드 (데모)')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 whitespace-nowrap ${checkedIds.length > 0 ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-900 text-white hover:bg-black'}`}
            >
              <Download className="w-4 h-4" /> 일괄 다운로드{checkedIds.length > 0 && ` (${checkedIds.length})`}
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400 font-medium bg-white rounded-3xl border border-slate-100 shadow-sm">
            <Search className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="text-sm">검색 결과가 없습니다</p>
          </div>
        ) : landingView === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {filtered.map(c => {
              const data = safetyInspectionData[c.id] || [];
              const good = data.filter(i => i.result === '양호').length;
              const bad = data.filter(i => i.result === '불량').length;
              const isChecked = checkedIds.includes(c.id);
              const statusColor = c.status === '정상' ? 'emerald' : c.status === '점검중' ? 'amber' : 'rose';
              return (
                <div
                  key={c.id}
                  onClick={() => onSelectComplex(c.id)}
                  className={`bg-white rounded-3xl border shadow-sm p-6 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all group ${isChecked ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200/60 hover:border-emerald-200'}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => toggleCheck(c.id, e)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer mt-0.5 shrink-0"
                      />
                      <div>
                        <h3 className="text-sm font-black text-slate-800 group-hover:text-emerald-600 transition-colors">{c.name}</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" />{c.region}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold bg-${statusColor}-50 text-${statusColor}-600 border border-${statusColor}-100`}>{c.status}</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-black text-slate-800">{data.length}</span>
                      <span className="text-[10px] font-bold text-slate-400">건</span>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="text-[9px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-100">양호 {good}</span>
                      <span className="text-[9px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-100">불량 {bad}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* 목록 뷰 */
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200/60 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 w-12 text-center">
                    <input type="checkbox" checked={allChecked} onChange={toggleAll} className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
                  </th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">단지명</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">지역</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">상태</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">총 항목</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">점검 현황</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">상세</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(c => {
                  const data = safetyInspectionData[c.id] || [];
                  const good = data.filter(i => i.result === '양호').length;
                  const bad = data.filter(i => i.result === '불량').length;
                  const isChecked = checkedIds.includes(c.id);
                  return (
                    <tr key={c.id} className={`transition-colors cursor-pointer ${isChecked ? 'bg-emerald-50/50' : 'hover:bg-slate-50/70'}`} onClick={() => onSelectComplex(c.id)}>
                      <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={isChecked} onChange={(e) => toggleCheck(c.id, e)} className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-bold text-slate-800 hover:text-emerald-600 transition-colors">{c.name}</span>
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-500">{c.region}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${c.status === '정상' ? 'bg-emerald-50 text-emerald-600' : c.status === '점검중' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>{c.status}</span>
                      </td>
                      <td className="px-4 py-4 text-center text-sm font-black text-emerald-600">{data.length}건</td>
                      <td className="px-4 py-4">
                        <div className="flex gap-1.5">
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">양호 {good}</span>
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">불량 {bad}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => onSelectComplex(c.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"><ChevronRight className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // --- 상세 모드 (단지 선택됨) ---
  const currentComplex = complexList.find(c => c.id === complexId);

  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      {showPreview && (
        <DocumentPreviewModal
          onClose={() => setShowPreview(false)}
          title="홈네트워크 안전점검표 - 일간 레포트"
          date={inspectDate}
          approvals={approvals}
          checklist={checklist}
          type="safety"
        />
      )}

      {/* 단지 정보 바 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/60 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#f97316' }}>
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{currentComplex?.name}</p>
          <div className="flex items-center gap-2.5 mt-0.5">
            <span className="flex items-center gap-1 text-[11px] text-slate-400"><MapPin className="w-3 h-3" />{currentComplex?.region}</span>
            <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: currentComplex?.status === '정상' ? '#10b981' : currentComplex?.status === '점검중' ? '#f59e0b' : '#64748b' }}><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentComplex?.status === '정상' ? '#10b981' : currentComplex?.status === '점검중' ? '#f59e0b' : '#64748b' }} />상태: {currentComplex?.status}</span>
            <span className="text-[11px] text-slate-400">총 {currentComplex?.dongCount || 0}동 / {currentComplex?.totalUnits || 0}세대</span>
          </div>
        </div>
        <button onClick={() => onSelectComplex(null)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all shrink-0">
          <ArrowLeft className="w-3.5 h-3.5" /> 목록
        </button>
      </div>

      {/* 상단 컨트롤 바 */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200/60 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">점검 일자</p>
              <input type="date" value={inspectDate} onChange={(e) => setInspectDate(e.target.value)} className="font-bold text-slate-800 bg-transparent outline-none cursor-pointer hover:text-indigo-600 transition-colors" />
            </div>
          </div>
          <div className="h-10 w-px bg-slate-100"></div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">점검자</p>
              <input type="text" defaultValue="박신일" className="font-bold text-slate-800 bg-transparent outline-none w-24 hover:text-emerald-600 transition-colors" />
            </div>
          </div>
        </div>

          <ApprovalSystem approvals={approvals} setApprovals={setApprovals} />
      </div>

      {/* 메인 점검 리스트 */}
      <div className="flex-1 bg-white rounded-[2.5rem] shadow-xl border border-slate-200/60 flex flex-col overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <ClipboardCheck className="w-6 h-6 text-indigo-600" /> 홈네트워크 안전점검표
          </h3>
          <div className="flex gap-2">
            <button onClick={() => onLog && onLog('[SAFETY] 점검 결과가 저장되었습니다.')} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
              <CheckSquare className="w-4 h-4" /> 결과 저장
            </button>
            <button onClick={() => setShowPreview(true)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm flex items-center gap-2">
              <Eye className="w-4 h-4" /> 미리보기
            </button>
            <button onClick={() => setShowPreview(true)} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-md flex items-center gap-2">
              <Download className="w-4 h-4" /> PDF 다운로드
            </button>
          </div>
        </div>

        <div className="flex-1 p-8">
          <div className="space-y-8">
            {Object.entries(groupedList).map(([category, items], catIdx) => (
              <div key={catIdx} className="bg-slate-50 rounded-3xl p-6 border border-slate-200/60">
                <h4 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div> {category}
                </h4>
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider w-1/2">점검 항목</th>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider w-1/4 text-center">점검 주기 (권고/의무)</th>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider w-1/4 text-center">점검 결과</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {items.map((checkItem, idx) => (
                        <tr key={idx} className="hover:bg-indigo-50/30 transition-colors group">
                          <td className="px-6 py-4 text-xs font-bold text-slate-700">{checkItem.item}</td>
                          <td className="px-6 py-4 text-center">
                            <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-lg">
                              <span className="text-[10px] font-bold text-slate-500">{checkItem.cycleRec}</span>
                              <span className="text-[8px] text-slate-300">/</span>
                              <span className="text-[10px] font-bold text-indigo-600">{checkItem.cycleMan}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <select
                              value={checkItem.result}
                              onChange={(e) => handleResultChange(checkItem.id, e.target.value)}
                              className={`bg-white border border-slate-200 text-xs font-bold rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-emerald-100 cursor-pointer hover:border-emerald-300 transition-colors ${
                                checkItem.result === '양호' ? 'text-emerald-600' :
                                checkItem.result === '불량' ? 'text-rose-600' :
                                'text-slate-400'
                              }`}
                            >
                              <option value="양호" className="text-emerald-600">양호</option>
                              <option value="불량" className="text-rose-600">불량</option>
                              <option value="해당없음" className="text-slate-400">해당없음</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ComplexManagementReportDashboard = ({ onLog, complexId, complexList, complexMgmtData, onDataChange, onSelectComplex }) => {
  const [checklist, setChecklist] = useState(complexId ? (complexMgmtData[complexId] || []) : []);
  const [showPreview, setShowPreview] = useState(false);
  const [inspectDate, setInspectDate] = useState("2026-02-20");
  const [landingSearch, setLandingSearch] = useState('');
  const [landingView, setLandingView] = useState('grid');
  const [checkedIds, setCheckedIds] = useState([]);

  const [approvals, setApprovals] = useState([
    { role: '담 당', name: '장정구', date: '02.20', status: 'approved' },
    { role: '주 임', name: '', date: '', status: 'pending' },
    { role: '과 장', name: '', date: '', status: 'pending' },
    { role: '소 장', name: '', date: '', status: 'pending' }
  ]);

  useEffect(() => {
    if (complexId && complexMgmtData[complexId]) {
      setChecklist(complexMgmtData[complexId]);
    }
  }, [complexId]);

  const groupedList = useMemo(() => {
    return checklist.reduce((acc, curr) => {
      const { category } = curr;
      if (!acc[category]) acc[category] = [];
      acc[category].push(curr);
      return acc;
    }, {});
  }, [checklist]);

  const handleResultChange = (id, newResult) => {
    const updated = checklist.map(item => item.id === id ? { ...item, result: newResult } : item);
    setChecklist(updated);
    if (complexId && onDataChange) onDataChange(complexId, updated);
  };

  const handleNoteChange = (id, newNote) => {
    const updated = checklist.map(item => item.id === id ? { ...item, note: newNote } : item);
    setChecklist(updated);
    if (complexId && onDataChange) onDataChange(complexId, updated);
  };

  // --- 랜딩 모드 (단지 미선택) ---
  if (!complexId) {
    const filtered = landingSearch.trim()
      ? complexList.filter(c =>
          c.name.toLowerCase().includes(landingSearch.toLowerCase()) ||
          c.region.toLowerCase().includes(landingSearch.toLowerCase())
        )
      : complexList;

    const toggleCheck = (id, e) => {
      e.stopPropagation();
      setCheckedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };
    const allChecked = filtered.length > 0 && filtered.every(c => checkedIds.includes(c.id));
    const toggleAll = () => {
      if (allChecked) setCheckedIds(prev => prev.filter(id => !filtered.find(c => c.id === id)));
      else setCheckedIds(prev => [...new Set([...prev, ...filtered.map(c => c.id)])]);
    };

    return (
      <div className="flex flex-col gap-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
        <div className="rounded-3xl p-8 shadow-sm border border-slate-300/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" style={{ backgroundColor: '#E2E8F0' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl"><Activity className="w-6 h-6" /></div>
            <div>
              <h2 className="text-lg font-black text-slate-800">단지관리 운영점검 — 단지 선택</h2>
              <p className="text-xs text-slate-400 mt-0.5">점검할 단지를 선택하세요</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={landingSearch}
                onChange={(e) => setLandingSearch(e.target.value)}
                placeholder="단지명 또는 지역 검색..."
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <div className="flex bg-slate-100 rounded-xl p-1 gap-0.5">
              <button onClick={() => setLandingView('grid')} className={`p-2 rounded-lg transition-all ${landingView === 'grid' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}><Grid3X3 className="w-4 h-4" /></button>
              <button onClick={() => setLandingView('list')} className={`p-2 rounded-lg transition-all ${landingView === 'list' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}><ListFilter className="w-4 h-4" /></button>
            </div>
            <button
              onClick={() => alert(checkedIds.length > 0 ? `선택된 ${checkedIds.length}개 단지 관리보고서 일괄 다운로드 (데모)` : '전체 단지 관리보고서 일괄 다운로드 (데모)')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 whitespace-nowrap ${checkedIds.length > 0 ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-slate-900 text-white hover:bg-black'}`}
            >
              <Download className="w-4 h-4" /> 일괄 다운로드{checkedIds.length > 0 && ` (${checkedIds.length})`}
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400 font-medium bg-white rounded-3xl border border-slate-100 shadow-sm">
            <Search className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="text-sm">검색 결과가 없습니다</p>
          </div>
        ) : landingView === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {filtered.map(c => {
              const data = complexMgmtData[c.id] || [];
              const good = data.filter(i => i.result === '양호').length;
              const bad = data.filter(i => i.result === '미흡').length;
              const supplement = data.filter(i => i.result === '보완필요').length;
              const isChecked = checkedIds.includes(c.id);
              const statusColor = c.status === '정상' ? 'emerald' : c.status === '점검중' ? 'amber' : 'rose';
              return (
                <div
                  key={c.id}
                  onClick={() => onSelectComplex(c.id)}
                  className={`bg-white rounded-3xl border shadow-sm p-6 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all group ${isChecked ? 'border-teal-300 ring-2 ring-teal-100' : 'border-slate-200/60 hover:border-teal-200'}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => toggleCheck(c.id, e)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer mt-0.5 shrink-0"
                      />
                      <div>
                        <h3 className="text-sm font-black text-slate-800 group-hover:text-teal-600 transition-colors">{c.name}</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" />{c.region}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold bg-${statusColor}-50 text-${statusColor}-600 border border-${statusColor}-100`}>{c.status}</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-teal-500" />
                      <span className="text-sm font-black text-slate-800">{data.length}</span>
                      <span className="text-[10px] font-bold text-slate-400">건</span>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="text-[9px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-100">양호 {good}</span>
                      <span className="text-[9px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-100">미흡 {bad}</span>
                      <span className="text-[9px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-100">보완 {supplement}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200/60 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 w-12 text-center">
                    <input type="checkbox" checked={allChecked} onChange={toggleAll} className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer" />
                  </th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">단지명</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">지역</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">상태</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">총 항목</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">점검 현황</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">상세</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(c => {
                  const data = complexMgmtData[c.id] || [];
                  const good = data.filter(i => i.result === '양호').length;
                  const bad = data.filter(i => i.result === '미흡').length;
                  const supplement = data.filter(i => i.result === '보완필요').length;
                  const isChecked = checkedIds.includes(c.id);
                  return (
                    <tr key={c.id} className={`transition-colors cursor-pointer ${isChecked ? 'bg-teal-50/50' : 'hover:bg-slate-50/70'}`} onClick={() => onSelectComplex(c.id)}>
                      <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={isChecked} onChange={(e) => toggleCheck(c.id, e)} className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer" />
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-bold text-slate-800 hover:text-teal-600 transition-colors">{c.name}</span>
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-500">{c.region}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${c.status === '정상' ? 'bg-emerald-50 text-emerald-600' : c.status === '점검중' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>{c.status}</span>
                      </td>
                      <td className="px-4 py-4 text-center text-sm font-black text-teal-600">{data.length}건</td>
                      <td className="px-4 py-4">
                        <div className="flex gap-1.5">
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">양호 {good}</span>
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">미흡 {bad}</span>
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">보완 {supplement}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => onSelectComplex(c.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all"><ChevronRight className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // --- 상세 모드 (단지 선택됨) ---
  const currentComplex = complexList.find(c => c.id === complexId);
  const total = checklist.length;
  const good = checklist.filter(i => i.result === '양호').length;
  const bad = checklist.filter(i => i.result === '미흡').length;
  const supplement = checklist.filter(i => i.result === '보완필요').length;

  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      {showPreview && (
        <DocumentPreviewModal
          onClose={() => setShowPreview(false)}
          title="단지관리 점검 보고서"
          date={inspectDate}
          approvals={approvals}
          checklist={checklist}
          type="complex_mgmt"
        />
      )}

      {/* 단지 정보 바 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/60 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#f97316' }}>
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{currentComplex?.name}</p>
          <div className="flex items-center gap-2.5 mt-0.5">
            <span className="flex items-center gap-1 text-[11px] text-slate-400"><MapPin className="w-3 h-3" />{currentComplex?.region}</span>
            <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: currentComplex?.status === '정상' ? '#10b981' : currentComplex?.status === '점검중' ? '#f59e0b' : '#64748b' }}><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentComplex?.status === '정상' ? '#10b981' : currentComplex?.status === '점검중' ? '#f59e0b' : '#64748b' }} />상태: {currentComplex?.status}</span>
            <span className="text-[11px] text-slate-400">총 {currentComplex?.dongCount || 0}동 / {currentComplex?.totalUnits || 0}세대</span>
          </div>
        </div>
        <button onClick={() => onSelectComplex(null)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all shrink-0">
          <ArrowLeft className="w-3.5 h-3.5" /> 목록
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold text-slate-400 uppercase">전체 항목</p><p className="text-3xl font-black text-slate-800 mt-1">{total}</p></div>
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500"><ListFilter /></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold text-emerald-600 uppercase">양호 (Good)</p><p className="text-3xl font-black text-emerald-600 mt-1">{good}</p></div>
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600"><CheckCircle2 /></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold text-rose-600 uppercase">미흡 (Insufficient)</p><p className="text-3xl font-black text-rose-600 mt-1">{bad}</p></div>
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600"><AlertTriangle /></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold text-slate-500 uppercase">보완필요 (Supplement)</p><p className="text-3xl font-black text-slate-600 mt-1">{supplement}</p></div>
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500"><ClipboardCheck /></div>
        </div>
      </div>

      <div className="flex flex-col h-full gap-6">
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200/60 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-teal-50 text-teal-600 rounded-xl"><CalendarDays className="w-6 h-6" /></div>
              <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">점검 일자</p><input type="date" value={inspectDate} onChange={(e) => setInspectDate(e.target.value)} className="font-bold text-slate-800 bg-transparent outline-none cursor-pointer hover:text-teal-600 transition-colors" /></div>
            </div>
            <div className="h-10 w-px bg-slate-100"></div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><User className="w-6 h-6" /></div>
              <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">점검자</p><input type="text" defaultValue="장정구" className="font-bold text-slate-800 bg-transparent outline-none w-24 hover:text-emerald-600 transition-colors" /></div>
            </div>
          </div>

          <ApprovalSystem approvals={approvals} setApprovals={setApprovals} />
        </div>

        <div className="flex-1 bg-white rounded-[2.5rem] shadow-xl border border-slate-200/60 overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <Activity className="w-6 h-6 text-teal-600" /> 단지관리 점검 체크리스트
            </h3>
            <div className="flex gap-2">
              <button onClick={() => onLog && onLog('[COMPLEX_MGMT] 점검 결과가 저장되었습니다.')} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
                <CheckSquare className="w-4 h-4" /> 결과 저장
              </button>
              <button onClick={() => setShowPreview(true)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-teal-600 hover:border-teal-200 transition-all shadow-sm flex items-center gap-2">
                <Eye className="w-4 h-4" /> 미리보기
              </button>
              <button onClick={() => setShowPreview(true)} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-md flex items-center gap-2">
                <Download className="w-4 h-4" /> PDF 다운로드
              </button>
            </div>
          </div>

          <div className="flex-1 p-8">
            <div className="space-y-8">
              {Object.entries(groupedList).map(([category, items], catIdx) => (
                <div key={catIdx} className="bg-slate-50 rounded-3xl p-6 border border-slate-200/60">
                  <h4 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-teal-500 rounded-full"></div> {category}
                  </h4>
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider w-24">ID</th>
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider w-1/2">점검 항목</th>
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider w-32 text-center">점검 결과</th>
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">비고</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {items.map((checkItem, idx) => (
                          <tr key={idx} className="hover:bg-teal-50/30 transition-colors group">
                            <td className="px-6 py-4 text-xs font-mono font-bold text-slate-500">{checkItem.id}</td>
                            <td className="px-6 py-4 text-xs font-bold text-slate-700">{checkItem.item}</td>
                            <td className="px-6 py-4 text-center">
                              <select
                                value={checkItem.result}
                                onChange={(e) => handleResultChange(checkItem.id, e.target.value)}
                                className={`bg-white border border-slate-200 text-xs font-bold rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-teal-100 cursor-pointer transition-colors ${
                                  checkItem.result === '양호' ? 'text-emerald-600' :
                                  checkItem.result === '미흡' ? 'text-rose-600' :
                                  'text-slate-500'
                                }`}
                              >
                                <option value="양호" className="text-emerald-600">양호</option>
                                <option value="미흡" className="text-rose-600">미흡</option>
                                <option value="보완필요" className="text-slate-500">보완필요</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-400">
                              <input
                                type="text"
                                value={checkItem.note === '-' ? '' : checkItem.note}
                                onChange={(e) => handleNoteChange(checkItem.id, e.target.value === '' ? '-' : e.target.value)}
                                placeholder="특이사항 입력..."
                                className="bg-transparent border-b border-transparent focus:border-teal-300 outline-none w-full text-xs hover:border-slate-200 transition-colors placeholder:text-slate-300"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportDashboard = ({ complexId, complexList, reportData, onSelectComplex, isAdmin, onDataChange }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('전체');
  const [landingSearch, setLandingSearch] = useState('');
  const [landingView, setLandingView] = useState('grid');
  const [checkedIds, setCheckedIds] = useState([]);
  const [statusDropdownId, setStatusDropdownId] = useState(null);
  const [previewReport, setPreviewReport] = useState(null);

  const downloadReportPdf = () => {
    const element = document.getElementById('pdf-report-preview-content');
    if (!element) return;

    const styles = Array.from(document.styleSheets).map(sheet => {
      try { return Array.from(sheet.cssRules).map(r => r.cssText).join(''); }
      catch { return ''; }
    }).join('');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
      <style>${styles}</style>
      <style>
        @page { margin: 0; size: A4 portrait; }
        body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      </style>
    </head><body>${element.outerHTML}</body></html>`);
    printWindow.document.close();
    printWindow.onload = () => { printWindow.print(); };
  };

  const reports = complexId ? (reportData[complexId] || []) : [];

  const handleStatusChange = (reportId, newStatus) => {
    if (!isAdmin || !complexId) return;
    const updated = reports.map(r => r.id === reportId ? { ...r, status: newStatus } : r);
    onDataChange(complexId, updated);
    setStatusDropdownId(null);
  };

  const normalizeType = (t) => t === '취약점 점검' ? '취약점 점검 보고서' : t === '안전 점검' ? '안전 점검 보고서' : t === '종합 보고서' ? '종합 점검 보고서' : t;
  const normalizedReports = reports.filter(r => r.type !== '단지 보고서').map(r => ({ ...r, type: normalizeType(r.type) }));
  const filteredReports = normalizedReports.filter(report => {
    const matchSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        report.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === '전체' || report.type === filterType;
    return matchSearch && matchType;
  });

  const groupedReports = filteredReports.reduce((acc, curr) => {
    if (!acc[curr.type]) acc[curr.type] = [];
    acc[curr.type].push(curr);
    return acc;
  }, {});

  const handleSelectAll = (items) => {
    const itemIds = items.map(i => i.id);
    const allSelected = itemIds.every(id => selectedIds.includes(id));
    
    if (allSelected) {
      setSelectedIds(selectedIds.filter(id => !itemIds.includes(id)));
    } else {
      const newIds = [...selectedIds];
      itemIds.forEach(id => {
        if (!newIds.includes(id)) newIds.push(id);
      });
      setSelectedIds(newIds);
    }
  };

  const handleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sId => sId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // --- 랜딩 모드 (단지 미선택) ---
  if (!complexId) {
    const filtered = landingSearch.trim()
      ? complexList.filter(c =>
          c.name.toLowerCase().includes(landingSearch.toLowerCase()) ||
          c.region.toLowerCase().includes(landingSearch.toLowerCase())
        )
      : complexList;

    const toggleCheck = (id, e) => {
      e.stopPropagation();
      setCheckedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };
    const allChecked = filtered.length > 0 && filtered.every(c => checkedIds.includes(c.id));
    const toggleAll = () => {
      if (allChecked) setCheckedIds(prev => prev.filter(id => !filtered.find(c => c.id === id)));
      else setCheckedIds(prev => [...new Set([...prev, ...filtered.map(c => c.id)])]);
    };

    return (
      <div className="flex flex-col gap-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
        <div className="rounded-3xl p-8 shadow-sm border border-slate-300/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" style={{ backgroundColor: '#E2E8F0' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><FileText className="w-6 h-6" /></div>
            <div>
              <h2 className="text-lg font-black text-slate-800">통합 보고서 센터 — 단지 선택</h2>
              <p className="text-xs text-slate-400 mt-0.5">보고서를 확인할 단지를 선택하세요</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={landingSearch}
                onChange={(e) => setLandingSearch(e.target.value)}
                placeholder="단지명 또는 지역 검색..."
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <div className="flex bg-slate-100 rounded-xl p-1 gap-0.5">
              <button onClick={() => setLandingView('grid')} className={`p-2 rounded-lg transition-all ${landingView === 'grid' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-400 hover:text-slate-600'}`}><Grid3X3 className="w-4 h-4" /></button>
              <button onClick={() => setLandingView('list')} className={`p-2 rounded-lg transition-all ${landingView === 'list' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-400 hover:text-slate-600'}`}><ListFilter className="w-4 h-4" /></button>
            </div>
            <button
              onClick={() => alert(checkedIds.length > 0 ? `선택된 ${checkedIds.length}개 보고서 일괄 다운로드 (데모)` : '전체 보고서 일괄 다운로드 (데모)')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 whitespace-nowrap ${checkedIds.length > 0 ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-slate-900 text-white hover:bg-black'}`}
            >
              <Download className="w-4 h-4" /> 일괄 다운로드{checkedIds.length > 0 && ` (${checkedIds.length})`}
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400 font-medium bg-white rounded-3xl border border-slate-100 shadow-sm">
            <Search className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="text-sm">검색 결과가 없습니다</p>
          </div>
        ) : landingView === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {filtered.map(c => {
              const data = (reportData[c.id] || []).filter(r => r.type !== '단지 보고서').map(r => ({ ...r, type: normalizeType(r.type) }));
              const typeCount = {};
              data.forEach(r => { typeCount[r.type] = (typeCount[r.type] || 0) + 1; });
              const isChecked = checkedIds.includes(c.id);
              const statusColor = c.status === '정상' ? 'emerald' : c.status === '점검중' ? 'amber' : 'rose';
              return (
                <div
                  key={c.id}
                  onClick={() => onSelectComplex(c.id)}
                  className={`bg-white rounded-3xl border shadow-sm p-6 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all group ${isChecked ? 'border-purple-300 ring-2 ring-purple-100' : 'border-slate-200/60 hover:border-purple-200'}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => toggleCheck(c.id, e)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer mt-0.5 shrink-0"
                      />
                      <div>
                        <h3 className="text-sm font-black text-slate-800 group-hover:text-purple-600 transition-colors">{c.name}</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" />{c.region}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold bg-${statusColor}-50 text-${statusColor}-600 border border-${statusColor}-100`}>{c.status}</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-black text-slate-800">{data.length}</span>
                      <span className="text-[10px] font-bold text-slate-400">건</span>
                    </div>
                    <div className="flex gap-2">
                      {Object.entries(typeCount).slice(0, 4).map(([type, cnt]) => (
                        <span key={type} className="text-[9px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-100">{type.replace(' 점검 보고서', '').replace(' 보고서', '')} {cnt}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200/60 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 w-12 text-center">
                    <input type="checkbox" checked={allChecked} onChange={toggleAll} className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer" />
                  </th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">단지명</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">지역</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">상태</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">보고서 수</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">최근 보고서</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">상세</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(c => {
                  const data = (reportData[c.id] || []).filter(r => r.type !== '단지 보고서').map(r => ({ ...r, type: normalizeType(r.type) }));
                  const latest = data[0];
                  const isChecked = checkedIds.includes(c.id);
                  return (
                    <tr key={c.id} className={`transition-colors cursor-pointer ${isChecked ? 'bg-purple-50/50' : 'hover:bg-slate-50/70'}`} onClick={() => onSelectComplex(c.id)}>
                      <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={isChecked} onChange={(e) => toggleCheck(c.id, e)} className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer" />
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-bold text-slate-800 hover:text-purple-600 transition-colors">{c.name}</span>
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-500">{c.region}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${c.status === '정상' ? 'bg-emerald-50 text-emerald-600' : c.status === '점검중' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>{c.status}</span>
                      </td>
                      <td className="px-4 py-4 text-center text-sm font-black text-sky-600">{data.length}건</td>
                      <td className="px-4 py-4 text-xs text-slate-500 truncate max-w-[200px]">{latest ? `${latest.date} — ${latest.title}` : '-'}</td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => onSelectComplex(c.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-all"><ChevronRight className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // --- 상세 모드 (단지 선택됨) ---
  const currentComplex = complexList.find(c => c.id === complexId);
  const totalReports = normalizedReports.length;
  const typeCounts = {};
  normalizedReports.forEach(r => { typeCounts[r.type] = (typeCounts[r.type] || 0) + 1; });

  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto animate-in fade-in duration-500" onClick={() => statusDropdownId && setStatusDropdownId(null)}>

      {/* 보고서 미리보기 모달 */}
      {previewReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setPreviewReport(null)} />
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            {/* 모달 헤더 */}
            <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start shrink-0">
              <div className="flex-1 mr-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{previewReport.type}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    previewReport.status === '완료' ? 'text-emerald-600 bg-emerald-50' :
                    previewReport.status === '점검중' ? 'text-amber-600 bg-amber-50' :
                    'text-slate-500 bg-slate-50'
                  }`}>{previewReport.status || '완료'}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800">{previewReport.title}</h3>
              </div>
              <button onClick={() => setPreviewReport(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors shrink-0"><X size={20} /></button>
            </div>

            {/* 문서 정보 */}
            <div className="px-8 py-4 border-b border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">문서 번호</p>
                <p className="text-sm font-mono font-bold text-slate-700">{previewReport.id}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">등록 일자</p>
                <p className="text-sm font-bold text-slate-700">{previewReport.date}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">작성자</p>
                <p className="text-sm font-bold text-slate-700">{previewReport.author}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">파일 용량</p>
                <p className="text-sm font-bold text-slate-700">{previewReport.size}</p>
              </div>
            </div>

            {/* 미리보기 본문 */}
            <div className="flex-1 overflow-y-auto p-8">
              <div id="pdf-report-preview-content" className="bg-slate-50 rounded-2xl border border-slate-200 p-8">
                {/* 문서 헤더 영역 */}
                <div className="text-center mb-8 pb-6 border-b border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">AXGATE SAFERHOME</p>
                  <h4 className="text-xl font-black text-slate-800 mb-1">{previewReport.title}</h4>
                  <p className="text-xs text-slate-500">{currentComplex?.name} · {currentComplex?.region}</p>
                </div>

                {/* 점검 개요 */}
                <div className="mb-6">
                  <h5 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-slate-400 rounded-full"></div>
                    점검 개요
                  </h5>
                  <table className="w-full text-sm border-collapse">
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="py-2.5 text-xs font-bold text-slate-500 w-28">점검 유형</td>
                        <td className="py-2.5 text-xs text-slate-700">{previewReport.type}</td>
                        <td className="py-2.5 text-xs font-bold text-slate-500 w-28">점검 일자</td>
                        <td className="py-2.5 text-xs text-slate-700">{previewReport.date}</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-2.5 text-xs font-bold text-slate-500">점검 대상</td>
                        <td className="py-2.5 text-xs text-slate-700">{currentComplex?.name}</td>
                        <td className="py-2.5 text-xs font-bold text-slate-500">담당자</td>
                        <td className="py-2.5 text-xs text-slate-700">{previewReport.author}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 text-xs font-bold text-slate-500">점검 결과</td>
                        <td colSpan={3} className="py-2.5 text-xs text-slate-700">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            previewReport.status === '완료' ? 'bg-emerald-50 text-emerald-600' :
                            previewReport.status === '점검중' ? 'bg-amber-50 text-amber-600' :
                            'bg-slate-100 text-slate-500'
                          }`}>{previewReport.status || '완료'}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 세부 내용 */}
                <div className="mb-6">
                  <h5 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-slate-400 rounded-full"></div>
                    세부 점검 내용
                  </h5>
                  <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                    <p>본 보고서는 {currentComplex?.name}에 대한 {previewReport.type} 결과를 기록한 문서입니다.</p>
                    <p>점검 항목 전반에 걸쳐 홈네트워크 시스템의 보안 상태를 평가하였으며, 취약 사항에 대한 조치 방안을 포함하고 있습니다.</p>
                    <p>세부 점검 결과 및 조치 이력은 별첨 자료를 참고하시기 바랍니다.</p>
                  </div>
                </div>

                {/* 비고 */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">비고</p>
                  <p className="text-xs text-slate-500">본 문서는 데모용 미리보기입니다. 실제 환경에서는 전체 보고서 내용이 표시됩니다.</p>
                </div>
              </div>
            </div>

            {/* 모달 하단 */}
            <div className="px-8 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setPreviewReport(null)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">닫기</button>
              <button onClick={() => downloadReportPdf(previewReport)} className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" /> PDF 다운로드
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 단지 정보 바 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/60 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#f97316' }}>
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{currentComplex?.name}</p>
          <div className="flex items-center gap-2.5 mt-0.5">
            <span className="flex items-center gap-1 text-[11px] text-slate-400"><MapPin className="w-3 h-3" />{currentComplex?.region}</span>
            <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: currentComplex?.status === '정상' ? '#10b981' : currentComplex?.status === '점검중' ? '#f59e0b' : '#64748b' }}><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentComplex?.status === '정상' ? '#10b981' : currentComplex?.status === '점검중' ? '#f59e0b' : '#64748b' }} />상태: {currentComplex?.status}</span>
            <span className="text-[11px] text-slate-400">총 {currentComplex?.dongCount || 0}동 / {currentComplex?.totalUnits || 0}세대</span>
          </div>
        </div>
        <button onClick={() => onSelectComplex(null)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all shrink-0">
          <ArrowLeft className="w-3.5 h-3.5" /> 목록
        </button>
      </div>

      {/* 통계 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div
          onClick={() => setFilterType('전체')}
          className={`bg-white p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between ${filterType === '전체' ? 'border-slate-400 ring-2 ring-slate-100 shadow-md transform scale-[1.02]' : 'border-slate-100 shadow-sm hover:border-slate-300 hover:shadow-md'}`}
        >
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">총 누적 보고서</p>
            <p className="text-3xl font-black text-slate-800 mt-1">{totalReports}<span className="text-sm font-medium text-slate-500 ml-1">건</span></p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${filterType === '전체' ? 'bg-slate-200 text-slate-700' : 'bg-slate-50 text-slate-500'}`}><FileText /></div>
        </div>

        <div
          onClick={() => setFilterType('취약점 점검 보고서')}
          className={`bg-white p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between ${filterType === '취약점 점검 보고서' ? 'border-indigo-500 ring-2 ring-indigo-100 shadow-md transform scale-[1.02]' : 'border-indigo-100 shadow-sm hover:border-indigo-300 hover:shadow-md'}`}
        >
          <div>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">취약점 점검 보고서</p>
            <p className="text-3xl font-black text-indigo-600 mt-1">{typeCounts['취약점 점검 보고서'] || 0}<span className="text-sm font-medium text-indigo-600/60 ml-1">건</span></p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${filterType === '취약점 점검 보고서' ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-50 text-indigo-600'}`}><AlertTriangle /></div>
        </div>

        <div
          onClick={() => setFilterType('안전 점검 보고서')}
          className={`bg-white p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between ${filterType === '안전 점검 보고서' ? 'border-emerald-500 ring-2 ring-emerald-100 shadow-md transform scale-[1.02]' : 'border-emerald-100 shadow-sm hover:border-emerald-300 hover:shadow-md'}`}
        >
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">안전 점검 보고서</p>
            <p className="text-3xl font-black text-emerald-600 mt-1">{typeCounts['안전 점검 보고서'] || 0}<span className="text-sm font-medium text-emerald-600/60 ml-1">건</span></p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${filterType === '안전 점검 보고서' ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-50 text-emerald-600'}`}><ShieldCheck /></div>
        </div>

        <div
          onClick={() => setFilterType('종합 점검 보고서')}
          className={`bg-white p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between ${filterType === '종합 점검 보고서' ? 'border-orange-500 ring-2 ring-orange-100 shadow-md transform scale-[1.02]' : 'border-orange-100 shadow-sm hover:border-orange-300 hover:shadow-md'}`}
        >
          <div>
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">종합 점검 보고서</p>
            <p className="text-3xl font-black text-orange-600 mt-1">{typeCounts['종합 점검 보고서'] || 0}<span className="text-sm font-medium text-orange-600/60 ml-1">건</span></p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${filterType === '종합 점검 보고서' ? 'bg-orange-100 text-orange-700' : 'bg-orange-50 text-orange-600'}`}><Layers /></div>
        </div>
      </div>

      {/* 보고서 목록 */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200/60 flex flex-col">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 rounded-t-[2.5rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <FileDown className="w-6 h-6 text-indigo-600" /> {currentComplex?.name} 점검 보고서 이력
          </h3>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="보고서 제목 또는 작성자 검색"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <div className="relative shrink-0">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none w-[130px] px-4 py-2.5 pl-10 pr-8 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
              >
                <option value="전체">모든 유형</option>
                <option value="취약점 점검 보고서">취약점 점검 보고서</option>
                <option value="안전 점검 보고서">안전 점검 보고서</option>
                <option value="종합 점검 보고서">종합 점검 보고서</option>
              </select>
              <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
            <button
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 whitespace-nowrap ${
                selectedIds.length > 0
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              disabled={selectedIds.length === 0}
            >
              <Download className="w-4 h-4" /> 선택 다운로드 {selectedIds.length > 0 && `(${selectedIds.length})`}
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-8">
            {Object.keys(groupedReports).length === 0 ? (
              <div className="text-center py-16 text-slate-400 font-medium bg-slate-50 rounded-3xl border border-slate-100">
                검색 결과가 없습니다.
              </div>
            ) : (
              Object.entries(groupedReports).map(([category, items], catIdx) => {
                const isAllSelected = items.length > 0 && items.every(item => selectedIds.includes(item.id));

                return (
                  <div key={catIdx} className="bg-slate-50 rounded-3xl p-6 border border-slate-200/60">
                    <h4 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                      <div className={`w-1.5 h-4 rounded-full ${
                        category === '취약점 점검 보고서' ? 'bg-indigo-500' :
                        category === '안전 점검 보고서' ? 'bg-emerald-500' :
                        'bg-orange-500'
                      }`}></div>
                      {category}
                      <span className="text-xs font-bold text-slate-400 ml-1">({items.length}건)</span>
                    </h4>
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-visible">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                          <tr>
                            <th className="px-6 py-4 w-12 text-center">
                              <input
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={() => handleSelectAll(items)}
                                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                              />
                            </th>
                            <th className="px-4 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider w-36">문서 번호</th>
                            <th className="px-4 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider w-36">등록 일자</th>
                            <th className="px-4 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">보고서 제목</th>
                            <th className="px-4 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider w-24">작성자</th>
                            <th className="px-4 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider w-24">용량</th>
                            <th className="px-4 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider w-28 text-center">상태</th>
                            <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider w-32 text-center">다운로드</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {items.map((report, idx) => (
                            <tr key={idx} className={`transition-colors group ${selectedIds.includes(report.id) ? 'bg-indigo-50/50' : 'hover:bg-slate-50/70'}`}>
                              <td className="px-6 py-5 text-center">
                                <input
                                  type="checkbox"
                                  checked={selectedIds.includes(report.id)}
                                  onChange={() => handleSelect(report.id)}
                                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                />
                              </td>
                              <td className="px-4 py-5 text-xs font-mono font-bold text-slate-500">{report.id}</td>
                              <td className="px-4 py-5 text-xs font-bold text-slate-600">{report.date}</td>
                              <td className="px-4 py-5 text-sm font-bold text-slate-800 cursor-pointer hover:text-indigo-600 transition-colors" onClick={(e) => { e.stopPropagation(); setPreviewReport(report); }}>
                                <div className="flex items-center gap-3">
                                  <FileText className={`w-4 h-4 transition-colors ${selectedIds.includes(report.id) ? 'text-indigo-500' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                                  {report.title}
                                </div>
                              </td>
                              <td className="px-4 py-5 text-xs font-bold text-slate-600">{report.author}</td>
                              <td className="px-4 py-5 text-xs font-mono font-medium text-slate-500">{report.size}</td>
                              <td className="px-4 py-5 text-center relative">
                                {isAdmin ? (
                                  <div className="relative inline-block">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setStatusDropdownId(statusDropdownId === report.id ? null : report.id); }}
                                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all border ${
                                        report.status === '완료' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' :
                                        report.status === '점검중' ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100' :
                                        'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                                      }`}
                                    >
                                      {report.status || '완료'} <ChevronDown className="w-3 h-3 inline-block ml-0.5 -mt-px" />
                                    </button>
                                    {statusDropdownId === report.id && (
                                      <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 min-w-[100px]">
                                        {['완료', '점검중', '대기'].map(s => (
                                          <button
                                            key={s}
                                            onClick={(e) => { e.stopPropagation(); handleStatusChange(report.id, s); }}
                                            className={`w-full px-3 py-2 text-left text-xs font-bold transition-colors flex items-center gap-2 ${
                                              report.status === s ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                          >
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                              s === '완료' ? 'bg-emerald-500' : s === '점검중' ? 'bg-amber-500' : 'bg-slate-400'
                                            }`} />
                                            {s}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                    report.status === '완료' ? 'bg-emerald-50 text-emerald-600' :
                                    report.status === '점검중' ? 'bg-amber-50 text-amber-600' :
                                    'bg-slate-50 text-slate-500'
                                  }`}>
                                    {report.status || '완료'}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-5 text-center">
                                <button onClick={() => setPreviewReport(report)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all shadow-sm">
                                  <Download className="w-3.5 h-3.5" /> PDF
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- [신규 컴포넌트: 계정 및 권한 관리 대시보드] ---
const AccountManagementDashboard = ({ onLog }) => {
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  
  const [formData, setFormData] = useState({
    id: '', name: '', password: '', role: 'Complex Manager', status: '활성', target: ''
  });

  const filteredAccounts = accounts.filter(acc => 
    acc.name.includes(searchTerm) || acc.id.includes(searchTerm) || acc.role.includes(searchTerm)
  );

  const stats = useMemo(() => {
    return {
      total: accounts.length,
      superAdmins: accounts.filter(a => a.role === 'Super Admin').length,
      activeManagers: accounts.filter(a => a.role === 'Complex Manager' && a.status === '활성').length,
      inactive: accounts.filter(a => a.status === '비활성').length
    };
  }, [accounts]);

  const handleOpenModal = (account = null) => {
    if (account) {
      setEditingAccount(account);
      setFormData({ ...account, password: '' });
    } else {
      setEditingAccount(null);
      setFormData({ id: '', name: '', password: '', role: 'Complex Manager', status: '활성', target: '' });
    }
    setShowModal(true);
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();
    if (editingAccount) {
      setAccounts(prev => prev.map(a => a.id === editingAccount.id ? { ...a, ...formData } : a));
      onLog && onLog(`[SYSTEM] 계정 권한이 수정되었습니다. (ID: ${formData.id})`);
    } else {
      const newAccount = { ...formData, lastLogin: '최초 로그인 전' };
      setAccounts([newAccount, ...accounts]);
      onLog && onLog(`[SYSTEM] 신규 계정이 생성되었습니다. (ID: ${formData.id})`);
    }
    setShowModal(false);
  };

  const handleDeleteAccount = (id) => {
    if (window.confirm('정말 해당 계정을 삭제하시겠습니까?')) {
      setAccounts(prev => prev.filter(a => a.id !== id));
      onLog && onLog(`[SYSTEM] 계정이 삭제되었습니다. (ID: ${id})`);
    }
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case 'Super Admin': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'System Engineer': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Complex Manager': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto animate-in fade-in duration-500 relative">
      
      {/* 계정 추가/수정 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-indigo-600" /> {editingAccount ? '계정 권한 수정' : '신규 계정 생성'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSaveAccount} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">사용자 이름</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" placeholder="예: 홍길동" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">로그인 ID</label>
                  <input required type="text" disabled={editingAccount} value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50" placeholder="영문, 숫자 조합" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">초기 비밀번호 {editingAccount && '(변경시에만 입력)'}</label>
                <input type="password" required={!editingAccount} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" placeholder="비밀번호를 입력하세요" />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">권한 등급 (Role)</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-sm font-bold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer">
                    <option value="Super Admin">Super Admin (최고관리자)</option>
                    <option value="System Engineer">System Engineer (엔지니어)</option>
                    <option value="Complex Manager">Complex Manager (단지관리자)</option>
                    <option value="Viewer">Viewer (단순열람)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">계정 상태</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-sm font-bold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer">
                    <option value="활성">활성 (접속 허용)</option>
                    <option value="비활성">비활성 (접속 차단)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">담당 단지 및 접속 허용 범위</label>
                <input type="text" value={formData.target} onChange={e => setFormData({...formData, target: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" placeholder="예: AX-PRM-01, AX-PRM-02 또는 전체" />
                <p className="text-[10px] text-slate-400 mt-1.5 ml-1">* 단지관리자(Complex Manager) 권한 부여 시 반드시 열람 가능한 단지를 명시해야 합니다.</p>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">취소</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all">{editingAccount ? '권한 수정' : '계정 생성'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 상단 통계 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">전체 등록 계정</p><p className="text-3xl font-black text-slate-800 mt-1">{stats.total}<span className="text-sm font-medium text-slate-500 ml-1">명</span></p></div>
          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-500"><Users /></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold text-rose-600 uppercase tracking-wider">최고 권한 (Admin)</p><p className="text-3xl font-black text-rose-600 mt-1">{stats.superAdmins}<span className="text-sm font-medium text-rose-600/60 ml-1">명</span></p></div>
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600"><ShieldHalf /></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">단지 관리자 (Active)</p><p className="text-3xl font-black text-emerald-600 mt-1">{stats.activeManagers}<span className="text-sm font-medium text-emerald-600/60 ml-1">명</span></p></div>
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600"><Building2 /></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between opacity-80">
          <div><p className="text-xs font-bold text-slate-500 uppercase tracking-wider">비활성 계정</p><p className="text-3xl font-black text-slate-600 mt-1">{stats.inactive}<span className="text-sm font-medium text-slate-400 ml-1">명</span></p></div>
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400"><LogOut /></div>
        </div>
      </div>

      {/* 메인 리스트 영역 */}
      <div className="flex-1 bg-white rounded-[2.5rem] shadow-xl border border-slate-200/60 flex flex-col overflow-hidden min-h-[500px]">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <ShieldHalf className="w-6 h-6 text-indigo-600" /> 관리자 접근 제어 리스트
          </h3>
          <div className="flex gap-3 items-center">
            <div className="relative">
              <input type="text" placeholder="이름, ID, 권한 검색..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-64 bg-white border border-slate-200 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm placeholder:text-slate-400" />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            </div>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <button onClick={() => handleOpenModal()} className="px-4 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2">
              <UserPlus className="w-4 h-4" /> 신규 계정 발급
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider w-40">이름 / ID</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider w-48 text-center">권한 그룹 (Role)</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-center w-28">상태</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">접근 허용 단지 범위</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider w-40 text-center">최근 접속일시</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider w-24 text-center">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAccounts.map(account => (
                  <tr key={account.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">{account.name}</span>
                        <span className="text-[11px] font-mono text-slate-400">{account.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded border text-[11px] font-bold ${getRoleBadge(account.role)}`}>
                        {account.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border whitespace-nowrap ${account.status === '활성' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                        {account.status === '활성' && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shrink-0"></div>}
                        {account.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600 truncate max-w-[200px]" title={account.target}>
                      {account.target}
                    </td>
                    <td className="px-6 py-4 text-center text-xs font-mono text-slate-500">
                      {account.lastLogin}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleOpenModal(account)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="수정"><Edit size={16} /></button>
                        <button onClick={() => handleDeleteAccount(account.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="삭제"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredAccounts.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center text-slate-400 font-medium bg-slate-50/50">
                      등록된 계정이 없거나 검색 결과가 없습니다.
                    </td>
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

// --- [로그인 컴포넌트] ---
const LoginPage = ({ onLogin, onLoginWithRole }) => {
  const loginRole = 'admin';
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [saveId, setSaveId] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // 가상의 로그인 처리 지연 효과
    setTimeout(() => {
      setIsLoading(false);
      onLoginWithRole(loginRole);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col lg:flex-row items-center lg:items-center" style={{
      fontFamily: "'Inter', sans-serif",
      backgroundImage: "url('/login-bg.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: '#1a9aa8',
    }}>

      {/* ── 상단 네비 (배경 위 오버레이) ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-end gap-4 sm:gap-8 px-4 sm:px-12 py-5 sm:py-7" style={{ zIndex: 10 }}>
        <div className="hidden md:flex items-center gap-8">
          {['ABOUT','COMPANY','DOWNLOAD','CONTACT'].map(item => (
            item === 'COMPANY' ? (
              <a key={item} href="https://www.axgate.com/main/company/about.php" target="_blank" rel="noopener noreferrer" className="text-[13px] font-semibold tracking-wider cursor-pointer hover:opacity-100 transition-opacity" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>{item}</a>
            ) : (
              <span key={item} className="text-[13px] font-semibold tracking-wider cursor-pointer hover:opacity-100 transition-opacity" style={{ color: 'rgba(255,255,255,0.75)' }}>{item}</span>
            )
          ))}
          <button className="px-6 py-2 rounded-full text-[13px] font-bold tracking-wider" style={{ color: 'white', border: '2px solid rgba(255,255,255,0.85)' }}>
            SIGN IN
          </button>
        </div>
        <button onClick={() => setMobileMenuOpen(prev => !prev)} className="flex flex-col gap-[5px] cursor-pointer ml-1 relative z-50">
          {[0,1,2].map(i => <div key={i} style={{ width: 22, height: 2, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 2, transition: 'all 0.2s' }} />)}
        </button>
      </div>

      {/* ── 모바일/햄버거 메뉴 패널 (화이트 테마) ── */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-30" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-0 right-0 w-72 h-full z-40 flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl" style={{ backgroundColor: '#FFFFFF' }}>
            {/* 헤더 */}
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid #E2E8F0' }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: '#1B3A6B' }}>
                  <Shield size={14} className="text-white" />
                </div>
                <div>
                  <div className="font-black text-[14px] leading-none" style={{ color: '#1B3A6B' }}>AX<span style={{ color: '#f97316' }}>GATE</span></div>
                  <div className="text-[9px] font-bold tracking-widest uppercase leading-none mt-0.5" style={{ color: '#94A3B8' }}>SaferHome</div>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg transition-colors" style={{ color: '#94A3B8' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#0F172A'; e.currentTarget.style.backgroundColor = '#F1F5F9'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <X size={18} />
              </button>
            </div>

            {/* 메뉴 항목 */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <p className="text-[10px] font-bold px-3 mb-3 tracking-widest uppercase" style={{ color: '#94A3B8' }}>MENU</p>
              <nav className="space-y-1 mb-8">
                {[
                  { label: 'ABOUT', icon: Info, desc: '서비스 소개' },
                  { label: 'COMPANY', icon: Building2, desc: '회사 소개', url: 'https://www.axgate.com/main/company/about.php' },
                  { label: 'DOWNLOAD', icon: Download, desc: '자료 다운로드' },
                  { label: 'CONTACT', icon: Mail, desc: '문의하기' },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <a key={item.label} href={item.url || '#'} target={item.url ? '_blank' : undefined} rel={item.url ? 'noopener noreferrer' : undefined} onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all"
                      style={{ color: '#334155', textDecoration: 'none' }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.color = '#1B3A6B'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#334155'; }}
                    >
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#F1F5F9' }}>
                        <Icon size={16} style={{ color: '#64748B' }} />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold">{item.label}</p>
                        <p className="text-[10px]" style={{ color: '#94A3B8' }}>{item.desc}</p>
                      </div>
                    </a>
                  );
                })}
              </nav>

              <p className="text-[10px] font-bold px-3 mb-3 tracking-widest uppercase" style={{ color: '#94A3B8' }}>PARTNER SITES</p>
              <nav className="space-y-1">
                {[
                  { name: 'AXGATE', desc: '엑스게이트 공식', url: 'https://www.axgate.com' },
                  { name: 'CVnet', desc: '홈네트워크 전문기업', url: 'https://cvnet.imweb.me/' },
                  { name: '현대HT', desc: '현대홈넷', url: 'https://hyundaiht.co.kr' },
                  { name: '삼성SDS', desc: '삼성SDS 홈IoT', url: 'https://www.samsungsds.com' },
                  { name: '코맥스', desc: '스마트홈 솔루션', url: 'https://www.commax.com' },
                  { name: '코콤', desc: '홈네트워크', url: 'https://www.kocom.co.kr' },
                ].map((site, idx) => (
                  <a key={idx} href={site.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                    style={{ color: '#334155', textDecoration: 'none' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.color = '#1B3A6B'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#334155'; }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#F1F5F9' }}>
                      <Globe size={16} style={{ color: '#64748B' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold">{site.name}</p>
                      <p className="text-[10px]" style={{ color: '#94A3B8' }}>{site.desc}</p>
                    </div>
                    <ArrowUpRight size={14} style={{ color: '#CBD5E1' }} className="shrink-0" />
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}

      {/* ── 로그인 카드 ── */}
      <div className="mx-auto lg:mx-0 lg:ml-14 my-20 sm:my-10 flex flex-col w-[90vw] sm:w-[400px]" style={{
        backgroundColor: '#ffffff',
        maxWidth: '420px',
        borderRadius: '28px',
        padding: '36px 32px 28px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
        zIndex: 10,
        flexShrink: 0,
      }}>
        {/* 로고 */}
        <div className="flex items-center gap-2.5 mb-6 sm:mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#1B3A6B' }}>
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <div className="font-black text-[15px] leading-tight" style={{ color: '#1B3A6B' }}>
              AX<span style={{ color: '#f97316' }}>GATE</span>
            </div>
            <div className="text-[9px] font-bold tracking-widest uppercase" style={{ color: '#94A3B8' }}>SaferHome</div>
          </div>
        </div>

        {/* 아바타 */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-full flex items-center justify-center" style={{ backgroundColor: '#1B3A6B' }}>
            <User size={40} className="text-white" />
          </div>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* 아이디 */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-full transition-all" style={{ border: '1.5px solid #CBD5E1' }}>
            <User size={15} style={{ color: '#94A3B8', flexShrink: 0 }} />
            <input
              type="text" required value={userId} onChange={e => setUserId(e.target.value)}
              className="flex-1 outline-none text-[13px] bg-transparent font-semibold tracking-widest"
              style={{ color: '#1B3A6B' }}
              onFocus={e => { e.currentTarget.parentElement.style.borderColor = '#1B3A6B'; }}
              onBlur={e => { e.currentTarget.parentElement.style.borderColor = '#CBD5E1'; }}
              placeholder="admin@axgate.com"
            />
          </div>

          {/* 비밀번호 */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-full transition-all" style={{ border: '1.5px solid #CBD5E1' }}>
            <Lock size={15} style={{ color: '#94A3B8', flexShrink: 0 }} />
            <input
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="flex-1 outline-none text-[14px] bg-transparent"
              style={{ color: '#1B3A6B', letterSpacing: '0.18em' }}
              onFocus={e => { e.currentTarget.parentElement.style.borderColor = '#1B3A6B'; }}
              onBlur={e => { e.currentTarget.parentElement.style.borderColor = '#CBD5E1'; }}
              placeholder="••••••••••••"
            />
          </div>


          {/* 로그인 버튼 */}
          <button
            type="submit" disabled={isLoading}
            className="w-full text-white text-[13px] font-black rounded-full py-3.5 tracking-[0.18em] uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ backgroundColor: '#1B3A6B' }}
            onMouseEnter={e => !isLoading && (e.currentTarget.style.backgroundColor = '#142d54')}
            onMouseLeave={e => !isLoading && (e.currentTarget.style.backgroundColor = '#1B3A6B')}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'LOGIN'}
          </button>
        </form>

        {/* Remember / Forgot */}
        <div className="flex justify-between items-center mt-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={saveId} onChange={e => setSaveId(e.target.checked)} className="w-3.5 h-3.5 rounded" style={{ accentColor: '#1B3A6B' }} />
            <span className="text-[11px]" style={{ color: '#94A3B8' }}>로그인 정보 저장</span>
          </label>
          <a href="#" className="text-[11px] hover:opacity-70 transition-opacity" style={{ color: '#94A3B8' }}>비밀번호를 잊으셨나요?</a>
        </div>

        {/* 하단 점 3개 */}
        <div className="flex justify-center gap-2 mt-6 sm:mt-8">
          {[0,1,2].map(i => (
            <div key={i} className="rounded-full" style={{ width: 9, height: 9, backgroundColor: '#CBD5E1' }} />
          ))}
        </div>
      </div>

      {/* ── 우측 Welcome 텍스트 ── */}
      <div className="hidden lg:flex flex-1 flex-col justify-end pb-14 px-14" style={{ zIndex: 5 }}>
        <h1 className="font-black leading-none mb-4" style={{ color: '#ffffff', fontSize: 'clamp(48px, 6vw, 88px)', letterSpacing: '-4px', textShadow: '0 2px 24px rgba(0,0,0,0.1)' }}>
          Welcome.
        </h1>
        <p className="text-[15px] font-bold tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.9)' }}>
          AXGATE SAFERHOME
        </p>
        <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '300px' }}>
          홈네트워크 안전점검부터 취약점 분석까지<br />신뢰할 수 있는 통합 보안 관제 플랫폼입니다.
        </p>
        <p className="text-[13px] mt-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
          계정이 없으신가요?{' '}
          <a href="#" style={{ color: '#ffffff', fontWeight: 700 }}>지금 가입하기</a>
        </p>
      </div>

      {/* ── 우하단 별 아이콘 ── */}
      <div className="absolute bottom-8 right-10 hidden sm:block" style={{ zIndex: 5, color: 'rgba(255,255,255,0.5)', fontSize: '28px', lineHeight: 1 }}>✦</div>
    </div>
  );
};

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
    { id: 'vaccine', label: '백신', icon: ShieldCheck },
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
        <div className="py-1.5 mb-1">
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
            {/* 선택된 단지 카드 */}
            <div className="mb-2 rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#f97316' }}>
                  <Building2 size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-bold text-white truncate leading-tight">{selectedComplexData?.name || ''}</p>
                    <button
                      onClick={() => {
                        setActiveMenu('complex_list');
                        setSelectedComplexId(null);
                        setSelectedVulnComplexId(null);
                        setSelectedSafetyComplexId(null);
                        setSelectedReportComplexId(null);
                      }}
                      className="p-0.5 rounded-full transition-all shrink-0 ml-1"
                      style={{ color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.15)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                      title="목록으로 돌아가기"
                    >
                      <X size={11} />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin size={10} style={{ color: 'rgba(255,255,255,0.4)' }} />
                    <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{selectedComplexData?.region || ''}</span>
                  </div>
                  <div className="flex items-center gap-2.5 mt-1.5">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedComplexData?.status === '정상' ? '#10b981' : selectedComplexData?.status === '점검중' ? '#f59e0b' : '#64748b' }} />
                      <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>상태: <span style={{ color: selectedComplexData?.status === '정상' ? '#6ee7b7' : selectedComplexData?.status === '점검중' ? '#fcd34d' : '#94a3b8' }}>{selectedComplexData?.status || ''}</span></span>
                    </div>
                    <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>총 {selectedComplexData?.dongCount || 0}동 / {selectedComplexData?.totalUnits || 0}세대</span>
                  </div>
                </div>
              </div>
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
          {activeMenu === 'complex_detail' && <ComplexDetailDashboard activeTab={activeDetailTab} onTabChange={setActiveDetailTab} onNavigate={(menu) => { setActiveMenu(menu); if (menu === 'complex_list') setSelectedComplexId(null); if (menu === 'report') setSelectedReportComplexId(selectedComplexId || null); if (menu === 'vulnerability') setSelectedVulnComplexId(selectedComplexId || null); if (menu === 'safety_inspection') setSelectedSafetyComplexId(selectedComplexId || null); }} complexId={selectedComplexId} complexList={complexList} setComplexList={setComplexList} isMounted={isMounted} onLog={handleLogUpdate} terminalLogs={terminalLogs} />}
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