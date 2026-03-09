// --- [데이터] 메인 앱 데이터 ---
export const INITIAL_LOGS = [
  { id: 1, time: '10:42:05', level: 'CRITICAL', source: '관문 방화벽', message: '외부 IP(211.x.x.x)로부터 비정상 접근 시도 차단' },
  { id: 2, time: '10:41:12', level: 'WARN', source: '단지서버', message: 'FTP 포트(21) 활성화 상태 감지 (SV-28 위반)' },
  { id: 3, time: '10:40:00', level: 'INFO', source: '시스템', message: '관리자(박신일) 로그인 완료' },
  { id: 4, time: '10:35:22', level: 'INFO', source: '백본 스위치', message: '포트 24 (Uplink) 연결 상태 정상' },
  { id: 5, time: '10:28:15', level: 'INFO', source: '단지서버', message: '데이터베이스 정기 백업 완료 (소요시간: 45초)' },
  { id: 6, time: '10:15:03', level: 'WARN', source: '방화벽', message: '비정상적인 트래픽 급증 감지 (차단 모드 자동 전환)' },
  { id: 7, time: '09:55:40', level: 'CRITICAL', source: '망분리 장비', message: '101동 101호 VPN 터널링 연결 끊김' },
  { id: 8, time: '09:30:00', level: 'INFO', source: '시스템', message: '일일 보안 점검 스케줄러 정상 구동' },
];

export const INITIAL_COMPLEX_LIST = [
  { id: 'AX-PRM-01', name: '디에이치 아너힐즈', region: '서울 강남구', builder: '현대건설', homenet: '현대HT', status: '정상', address: '서울특별시 강남구 개포로 310', manager: '박신일 소장', contact: '010-1234-5678', report: '발급', regDate: '2024-01-15', registrant: '시스템', builderManager: '김현대 과장', builderContact: '010-1111-2222', homenetManager: '이현대 대리', homenetContact: '010-3333-4444', dongCount: 10, dongStartNum: 101, floorCount: 20, unitsPerFloor: 2, deviceRegistered: true },
  { id: 'AX-PRM-02', name: '래미안 원베일리', region: '서울 서초구', builder: '삼성물산', homenet: '삼성SDS', status: '정상', address: '서울특별시 서초구 반포대로 300', manager: '김철수 소장', contact: '010-2345-6789', report: '발급', regDate: '2024-01-18', registrant: '박신일', builderManager: '박삼성 책임', builderContact: '010-2222-3333', homenetManager: '최에스 프로', homenetContact: '010-4444-5555', dongCount: 8, dongStartNum: 101, floorCount: 25, unitsPerFloor: 4, deviceRegistered: true },
  { id: 'AX-PRM-03', name: '반포 자이', region: '서울 서초구', builder: 'GS건설', homenet: '이지스', status: '정상', address: '서울특별시 서초구 신반포로 270', manager: '이영희 소장', contact: '010-3456-7890', report: '발급', regDate: '2024-03-12', registrant: '장정구', builderManager: '정지에스 차장', builderContact: '010-3333-4444', homenetManager: '강이지 주임', homenetContact: '010-5555-6666', dongCount: 12, dongStartNum: 101, floorCount: 15, unitsPerFloor: 3, deviceRegistered: true },
  { id: 'AX-PRM-04', name: '올림픽파크 포레온', region: '서울 강동구', builder: '현대건설', homenet: '현대HT', status: '정상', address: '서울특별시 강동구 양재대로 1218', manager: '정민수 소장', contact: '010-4567-8901', report: '발급', regDate: '2024-05-15', registrant: '박신일', builderManager: '김현대 과장', builderContact: '010-1111-2222', homenetManager: '이현대 대리', homenetContact: '010-3333-4444', dongCount: 15, dongStartNum: 101, floorCount: 30, unitsPerFloor: 4, deviceRegistered: true },
  { id: 'AX-PRM-05', name: '마포 래미안 푸르지오', region: '서울 마포구', builder: '대우건설', homenet: '코콤', status: '오프라인', address: '서울특별시 마포구 마포대로 195', manager: '최은지 소장', contact: '010-5678-9012', report: '미발급', regDate: '2024-06-05', registrant: '장정구', builderManager: '윤대우 대리', builderContact: '010-4444-5555', homenetManager: '임코콤 과장', homenetContact: '010-6666-7777', dongCount: 6, dongStartNum: 101, floorCount: 18, unitsPerFloor: 2, deviceRegistered: true },
  { id: 'AX-PRM-06', name: '송파 헬리오시티', region: '서울 송파구', builder: 'DL이앤씨', homenet: '코맥스', status: '정상', address: '서울특별시 송파구 송파대로 345', manager: '강동훈 소장', contact: '010-6789-0123', report: '발급', regDate: '2024-07-12', registrant: '시스템', builderManager: '조디엘 차장', builderContact: '010-5555-6666', homenetManager: '송코맥 대리', homenetContact: '010-7777-8888', dongCount: 20, dongStartNum: 101, floorCount: 25, unitsPerFloor: 4, deviceRegistered: true },
  { id: 'AX-PRM-07', name: '해운대 엘시티 더샵', region: '부산 해운대구', builder: '포스코이앤씨', homenet: '포스코DX', status: '정상', address: '부산광역시 해운대구 달맞이길 30', manager: '윤서연 소장', contact: '010-7890-1234', report: '발급', regDate: '2024-08-20', registrant: '박신일', builderManager: '한포스 과장', builderContact: '010-6666-7777', homenetManager: '백디엑 사원', homenetContact: '010-8888-9999', dongCount: 5, dongStartNum: 101, floorCount: 45, unitsPerFloor: 6, deviceRegistered: true },
  { id: 'AX-PRM-08', name: '힐스테이트 송도 더스카이', region: '인천 연수구', builder: '현대건설', homenet: '현대HT', status: '점검중', address: '인천광역시 연수구 인천타워대로 396', manager: '임도현 소장', contact: '010-8901-2345', report: '미발급', regDate: '2024-09-01', registrant: '장정구', builderManager: '김현대 과장', builderContact: '010-1111-2222', homenetManager: '이현대 대리', homenetContact: '010-3333-4444', dongCount: 7, dongStartNum: 101, floorCount: 35, unitsPerFloor: 3, deviceRegistered: true },
];

export const VULNERABILITY_CHECKLIST = [
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

export const SAFETY_INSPECTION_CHECKLIST = [
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
export const generateVulnerabilityDataForComplex = (complexId) => {
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

export const generateSafetyDataForComplex = (complexId) => {
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

export const generateAllVulnerabilityData = (complexList) => {
  const data = {};
  complexList.forEach(c => { data[c.id] = generateVulnerabilityDataForComplex(c.id); });
  return data;
};

export const generateAllSafetyInspectionData = (complexList) => {
  const data = {};
  complexList.forEach(c => { data[c.id] = generateSafetyDataForComplex(c.id); });
  return data;
};

export const COMPLEX_MANAGEMENT_CHECKLIST = [
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

export const generateComplexMgmtDataForComplex = (complexId) => {
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

export const generateAllComplexMgmtData = (complexList) => {
  const data = {};
  complexList.forEach(c => { data[c.id] = generateComplexMgmtDataForComplex(c.id); });
  return data;
};

export const REPORT_TYPES = ['취약점 점검', '안전 점검', '단지 보고서', '종합 보고서'];
export const REPORT_AUTHORS = ['박신일', '장정구', '시스템', '김철수'];

export const generateReportsForComplex = (complexId, complexName) => {
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

export const generateAllReportData = (complexList) => {
  const data = {};
  complexList.forEach(c => { data[c.id] = generateReportsForComplex(c.id, c.name); });
  return data;
};

export const INITIAL_NOTICES = [
  { id: 1, title: "[긴급] 외부 위협 IP 차단 업데이트", date: "2026-02-21", type: "urgent", content: "최신 위협 인텔리전스 기반 블랙리스트가 갱신되었습니다. 즉시 적용 바랍니다." },
  { id: 2, title: "정기 시스템 점검 안내 (23:00)", date: "2026-02-20", type: "notice", content: "안정성 확보를 위한 코어 서버 리부팅이 예정되어 있습니다." },
  { id: 3, title: "AXGATE-50LQ 펌웨어 v2.5.0 릴리즈", date: "2026-02-19", type: "update", content: "암호화 성능 30% 향상 및 UI 버그 수정." }
];

// 가상 문의 내역 데이터 (관리자 확인용)
export const INITIAL_INQUIRIES = [
  { id: 1, user: '101동 101호 관리자', type: '장애', content: 'VPN 터널링이 간헐적으로 끊어지는 현상이 발생합니다. 로그 확인 부탁드립니다.', date: '2026-02-21 14:30', status: '대기중' },
  { id: 2, user: '단지 통합 관리소장', type: '지원', content: '월간 리포트 자동 발송 수신처를 하나 더 추가하고 싶습니다. 방법 안내 바랍니다.', date: '2026-02-20 09:15', status: '처리완료' },
  { id: 3, user: '105동 602호 관리자', type: '장애', content: '단말 오프라인 상태 지속됨. 현장 출동이 필요해 보입니다.', date: '2026-02-19 16:45', status: '처리완료' }
];

export const INITIAL_ACCOUNTS = [
  { id: 'admin', name: '최고관리자', role: 'Super Admin', status: '활성', lastLogin: '2026-02-21 09:00', target: '전체 시스템 권한' },
  { id: 'jang_jg', name: '장정구', role: 'System Engineer', status: '활성', lastLogin: '2026-02-20 14:30', target: '전체 단지 유지보수' },
  { id: 'park_si', name: '박신일', role: 'Complex Manager', status: '활성', lastLogin: '2026-02-21 08:45', target: '디에이치 아너힐즈, 올림픽파크 포레온' },
  { id: 'lee_yh', name: '이영희', role: 'Viewer', status: '비활성', lastLogin: '2026-01-15 11:20', target: '반포 자이 (읽기 전용)' },
];
