# AXGATE SaferHome 프론트엔드 구조 설명서

---

## 1. 리팩토링 개요

| 항목 | 내용 |
|------|------|
| **기존 구조** | `App.jsx` 단일 파일 (6,882줄, 427KB) — 모든 컴포넌트와 데이터가 하나의 파일에 존재 |
| **변경 후 구조** | **24개 파일**로 분리 — 역할별 폴더 구조 |
| **목적** | 개발 생산성 향상, 컴포넌트 단위 유지보수, 팀 협업 용이 |

단일 파일에 모든 코드가 집중되어 있던 구조를 역할과 책임에 따라 분리하였습니다. 이를 통해 각 컴포넌트를 독립적으로 개발·테스트·수정할 수 있으며, 코드 충돌 없이 여러 개발자가 동시에 작업할 수 있습니다.

---

## 2. 디렉토리 구조

```
src/
├── App.jsx                           ← 메인 앱 (라우팅, 사이드바, 전역 상태관리)
├── main.jsx                          ← 엔트리 포인트 (ReactDOM 렌더링)
├── App.css                           ← 글로벌 스타일
├── index.css                         ← Tailwind CSS 설정
│
├── constants/                        ← 데이터 상수
│   └── data.js                       ← 초기 데이터 + 생성 함수 (18개 export)
│
├── components/                       ← 공통 UI 컴포넌트 (7개)
│   ├── AxgateLogo.jsx                ← AXGATE 브랜드 로고
│   ├── DonutChart.jsx                ← SVG 도넛 차트
│   ├── PacketChart.jsx               ← 실시간 패킷 트래픽 차트
│   ├── CircularProgress.jsx          ← 원형 프로그레스 인디케이터
│   ├── ApprovalSystem.jsx            ← 전자 결재 시스템
│   ├── DocumentPreviewModal.jsx      ← A4 문서 미리보기/인쇄/PDF
│   └── AddComplexModal.jsx           ← 단지 등록/수정 모달 폼
│
├── dashboards/                       ← 대시보드 화면 (13개)
│   ├── ComplexListDashboard.jsx      ← 통합 단지 목록
│   ├── ComplexDetailDashboard.jsx    ← 단지 상세 (탭 컨테이너)
│   ├── ServerDashboard.jsx           ← 단지서버 모니터링
│   ├── LogServerDashboard.jsx        ← AXGATE SAFERHOME 로그서버
│   ├── FirewallDashboard.jsx         ← 방화벽 대시보드
│   ├── NetworkDashboard.jsx          ← 백본 네트워크
│   ├── LogDashboard.jsx              ← 시스템 로그 뷰어
│   ├── SeparationDashboard.jsx       ← 단지관리 (장비등록/제어/모니터링)
│   ├── VulnerabilityDashboard.jsx    ← 취약점 분석 및 조치
│   ├── SafetyInspectionDashboard.jsx ← 홈네트워크 안전점검
│   ├── ComplexManagementReportDashboard.jsx ← 단지관리 운영점검
│   ├── ReportDashboard.jsx           ← 통합 보고서 센터
│   └── AccountManagementDashboard.jsx ← 계정 및 권한 관리
│
└── pages/                            ← 페이지 컴포넌트
    └── LoginPage.jsx                 ← 로그인 페이지
```

---

## 3. 파일별 상세 설명

### 3.1 App.jsx (메인 앱)

- **역할**: 전체 앱의 중심. 사이드바, 헤더, 라우팅, 전역 상태 관리
- **주요 기능**:
  - 로그인/로그아웃 상태 관리
  - `activeMenu`에 따라 대시보드 컴포넌트 전환
  - 사이드바 네비게이션 (메뉴, 단지 검색, 최근 이력)
  - 상단 헤더 (페이지 제목, 시계, 파트너사이트)
  - `localStorage`로 단지 목록 영속화
  - 브라우저 뒤로가기 히스토리 관리
- **전역 상태**:
  - `complexList` — 단지 목록 데이터
  - `vulnerabilityData` — 취약점 분석 데이터
  - `safetyInspectionData` — 안전점검 데이터
  - `reportData` — 보고서 데이터
  - `complexMgmtData` — 운영점검 데이터

> App.jsx는 모든 하위 컴포넌트의 **상태 허브** 역할을 합니다. 새로운 전역 상태가 필요할 경우 이 파일에 `useState`를 추가하고, 해당 대시보드에 props로 전달합니다.

---

### 3.2 constants/data.js (데이터 상수)

- **역할**: 모든 초기 데이터와 데이터 생성 함수를 모아놓은 파일

#### export 목록 (18개)

| export 이름 | 유형 | 설명 |
|---|---|---|
| `INITIAL_COMPLEX_LIST` | 배열 | 8개 단지 초기 데이터 |
| `VULNERABILITY_CHECKLIST` | 배열 | 20개 취약점 점검 항목 (SV-01~SV-40) |
| `SAFETY_INSPECTION_CHECKLIST` | 배열 | 28개 안전점검 항목 |
| `COMPLEX_MANAGEMENT_CHECKLIST` | 배열 | 18개 운영점검 항목 (CM-01~CM-18) |
| `REPORT_TYPES` | 배열 | 보고서 유형 4가지 |
| `REPORT_AUTHORS` | 배열 | 보고서 작성자 4명 |
| `INITIAL_NOTICES` | 배열 | 공지사항 3건 |
| `INITIAL_INQUIRIES` | 배열 | 문의 3건 |
| `INITIAL_ACCOUNTS` | 배열 | 계정 4건 |
| `generateVulnerabilityDataForComplex` | 함수 | 단지별 취약점 데이터 생성 |
| `generateSafetyDataForComplex` | 함수 | 단지별 안전점검 데이터 생성 |
| `generateAllVulnerabilityData` | 함수 | 전체 단지 취약점 데이터 일괄 생성 |
| `generateAllSafetyInspectionData` | 함수 | 전체 단지 안전점검 데이터 일괄 생성 |
| `generateComplexMgmtDataForComplex` | 함수 | 단지별 운영점검 데이터 생성 |
| `generateAllComplexMgmtData` | 함수 | 전체 운영점검 데이터 일괄 생성 |
| `generateReportsForComplex` | 함수 | 단지별 보고서 데이터 생성 |
| `generateAllReportData` | 함수 | 전체 보고서 데이터 일괄 생성 |

> **참고**: 백엔드 API 연동 시 이 파일의 데이터를 API 호출로 대체하면 됩니다. 데이터 구조(스키마)는 동일하게 유지하되, 정적 배열 대신 `fetch`/`axios` 호출로 교체하는 방식입니다.

---

### 3.3 components/ (공통 UI 컴포넌트 7개)

#### AxgateLogo.jsx

| 항목 | 내용 |
|------|------|
| **역할** | AXGATE 브랜드 로고 렌더링 |
| **Props** | `onClick` (클릭 핸들러) |
| **사용처** | 사이드바, 문서 미리보기 |

#### DonutChart.jsx

| 항목 | 내용 |
|------|------|
| **역할** | SVG 기반 도넛(원형) 차트 |
| **Props** | `value` (퍼센트), `label`, `colorClass`, `strokeColor` |
| **사용처** | FirewallDashboard (트래픽 통계) |

#### PacketChart.jsx

| 항목 | 내용 |
|------|------|
| **역할** | 실시간 패킷 트래픽 시각화 (SVG 라인 그래프) |
| **Props** | `data` (배열), `currentValue` |
| **사용처** | SeparationDashboard |

#### CircularProgress.jsx

| 항목 | 내용 |
|------|------|
| **역할** | 원형 프로그레스 인디케이터 |
| **Props** | `value`, `label`, `icon`, `color` |
| **사용처** | SeparationDashboard (CPU/메모리 사용률) |

#### ApprovalSystem.jsx

| 항목 | 내용 |
|------|------|
| **역할** | 전자 결재 워크플로우 (도장/서명 업로드, 결재선) |
| **Props** | `approvals` (결재 목록), `setApprovals` (상태 변경) |
| **사용처** | VulnerabilityDashboard, SafetyInspectionDashboard, ComplexManagementReportDashboard |

#### DocumentPreviewModal.jsx

| 항목 | 내용 |
|------|------|
| **역할** | A4 규격 문서 미리보기, 인쇄, PDF 저장 |
| **Props** | `onClose`, `title`, `date`, `approvals`, `checklist`, `type`, `customMeta` |
| **사용처** | 취약점/안전점검/운영점검/단지관리 대시보드 |

#### AddComplexModal.jsx

| 항목 | 내용 |
|------|------|
| **역할** | 신규 단지 등록 및 기존 단지 정보 수정 폼 |
| **Props** | `onClose`, `onSave`, `initialData` |
| **사용처** | ComplexListDashboard, ComplexDetailDashboard |

---

### 3.4 dashboards/ (대시보드 13개)

#### ComplexListDashboard.jsx — 통합 단지 목록

- **역할**: 전체 단지 목록 조회, 검색, 필터링, 페이징
- **주요 기능**: 단지 추가/수정/삭제, 엑셀 템플릿 다운로드/업로드
- **Props**: `onNavigate`, `onSelectComplex`, `complexList`, `setComplexList`
- **사용 컴포넌트**: AddComplexModal
- **메뉴**: 통합 단지 목록

#### ComplexDetailDashboard.jsx — 단지 상세 (탭 컨테이너)

- **역할**: 선택된 단지의 상세 정보를 탭으로 표시
- **주요 기능**: 8개 탭 전환, 단지 기본정보 헤더, 보고서 발급현황
- **Props**: `activeTab`, `onTabChange`, `onNavigate`, `complexId`, `complexList`, `setComplexList`, `isMounted`, `onLog`, `terminalLogs`
- **하위 컴포넌트**: ServerDashboard, LogServerDashboard, FirewallDashboard, NetworkDashboard, LogDashboard, SeparationDashboard
- **메뉴**: 단지 선택 후 모든 하위 탭

#### ServerDashboard.jsx — 단지서버

- **역할**: 단지서버(HN-SVR-01) 상태 모니터링
- **주요 기능**: CPU/RAM/Disk/Network 리소스, 보안 취약점 자동진단, 설치 소프트웨어 목록
- **메뉴**: 단지 상세 > 단지서버 탭

#### LogServerDashboard.jsx — AXGATE SAFERHOME 로그서버

- **역할**: AXGATE-TMS-8000 로그 서버 어플라이언스 정보
- **주요 기능**: 로그 저장소 현황(RAID 5, 24TB), EPS 차트, 소스 분석
- **메뉴**: 단지 상세 > AXGATE SAFERHOME 탭

#### FirewallDashboard.jsx — 방화벽

- **역할**: 방화벽 장비 정보 및 트래픽 현황
- **주요 기능**: Inbound/Outbound 트래픽, 네트워크 구성(VLAN, ARP)
- **사용 컴포넌트**: DonutChart
- **메뉴**: 단지 상세 > 방화벽 탭

#### NetworkDashboard.jsx — 백본 네트워크

- **역할**: AXGATE 백본 스위치 패널 시각화
- **주요 기능**: 포트 상태, 트래픽 바 차트, VLAN/ARP 테이블
- **메뉴**: 단지 상세 > 백본 탭

#### LogDashboard.jsx — 시스템 로그

- **역할**: 시스템 로그 조회
- **주요 기능**: 로그 레벨별 필터링(CRITICAL/WARN/INFO), 검색
- **메뉴**: 단지 상세 > 로그 탭

#### SeparationDashboard.jsx — 단지관리

- **역할**: 세대 장비 등록, 모니터링, 제어 (가장 큰 컴포넌트)
- **주요 기능**:
  - 장비 등록/활성화
  - 동/호 시각화 (단지 배치도)
  - 장비 상태 그리드 뷰
  - 이벤트 이력 조회
  - 일괄 제어 (기동/중단)
  - 터미널 콘솔
  - 이메일 설정
  - 공지사항/문의 관리
  - 장애 세대 목록
  - 세대별 보고서
- **Props**: `onLog`, `terminalLogs`, `isAdmin`, `complexConfig`, `onRegisterDevice`
- **사용 컴포넌트**: PacketChart, CircularProgress, DocumentPreviewModal
- **메뉴**: 단지 상세 > 단지관리 / 단지관리 ADMIN

#### VulnerabilityDashboard.jsx — 취약점 분석

- **역할**: 단지별 보안 취약점 점검 및 조치
- **주요 기능**: 단지 선택(그리드/리스트 뷰), 카테고리별 체크리스트, 결과 변경, 결재, 문서 미리보기
- **Props**: `onLog`, `complexId`, `complexList`, `vulnerabilityData`, `onDataChange`, `onSelectComplex`
- **사용 컴포넌트**: ApprovalSystem, DocumentPreviewModal
- **메뉴**: 취약점 분석 및 조치

#### SafetyInspectionDashboard.jsx — 안전점검

- **역할**: 홈네트워크 안전점검 수행
- **주요 기능**: 단지 선택, 점검 체크리스트, 결과 기록, 결재, 문서 출력
- **Props**: `onLog`, `complexId`, `complexList`, `safetyInspectionData`, `onDataChange`, `onSelectComplex`
- **사용 컴포넌트**: ApprovalSystem, DocumentPreviewModal
- **메뉴**: 홈네트워크 안전점검

#### ComplexManagementReportDashboard.jsx — 단지관리 운영점검

- **역할**: 단지관리 장비/네트워크/보안/시스템 운영점검
- **Props**: `onLog`, `complexId`, `complexList`, `complexMgmtData`, `onDataChange`, `onSelectComplex`
- **사용 컴포넌트**: ApprovalSystem, DocumentPreviewModal
- **메뉴**: 단지관리 운영점검

#### ReportDashboard.jsx — 통합 보고서 센터

- **역할**: 보고서 관리 및 다운로드
- **주요 기능**: 단지 선택, 보고서 목록, 상태 필터링, 보고서 생성, 미리보기
- **Props**: `complexId`, `complexList`, `reportData`, `onSelectComplex`, `isAdmin`, `onDataChange`
- **메뉴**: 통합 보고서 센터

#### AccountManagementDashboard.jsx — 계정 관리

- **역할**: 사용자 계정 및 권한 관리
- **주요 기능**: 계정 목록, 추가/수정/삭제, 역할 설정
- **Props**: `onLog`
- **메뉴**: 계정 및 권한 관리

---

### 3.5 pages/LoginPage.jsx — 로그인 페이지

- **역할**: 이메일/비밀번호 로그인 폼
- **주요 기능**: 로그인 인증, 로그인 기억, 파트너사이트 메뉴
- **Props**: `onLogin`, `onLoginWithRole`

---

## 4. 컴포넌트 의존 관계도

```
App.jsx
├── LoginPage
├── ComplexListDashboard
│   └── AddComplexModal
├── ComplexDetailDashboard
│   ├── AddComplexModal
│   ├── ServerDashboard
│   ├── LogServerDashboard
│   ├── FirewallDashboard
│   │   └── DonutChart
│   ├── NetworkDashboard
│   ├── LogDashboard
│   └── SeparationDashboard
│       ├── PacketChart
│       ├── CircularProgress
│       └── DocumentPreviewModal
├── VulnerabilityDashboard
│   ├── ApprovalSystem
│   └── DocumentPreviewModal
├── SafetyInspectionDashboard
│   ├── ApprovalSystem
│   └── DocumentPreviewModal
├── ComplexManagementReportDashboard
│   ├── ApprovalSystem
│   └── DocumentPreviewModal
├── ReportDashboard
└── AccountManagementDashboard
```

---

## 5. 메뉴 구조와 컴포넌트 매핑

| 사이드바 메뉴 | activeMenu 값 | 렌더링 컴포넌트 |
|---|---|---|
| 통합 단지 목록 | `complex_list` | `ComplexListDashboard` |
| (단지 선택 후) 단지 요약 | `complex_detail` (tab: `summary`) | `ComplexDetailDashboard` |
| (단지 선택 후) 단지서버 | `complex_detail` (tab: `server`) | `ServerDashboard` |
| (단지 선택 후) AXGATE SAFERHOME | `complex_detail` (tab: `log_server`) | `LogServerDashboard` |
| (단지 선택 후) 방화벽 | `complex_detail` (tab: `firewall`) | `FirewallDashboard` |
| (단지 선택 후) 백본 | `complex_detail` (tab: `network`) | `NetworkDashboard` |
| (단지 선택 후) 단지관리 | `complex_detail` (tab: `separation`) | `SeparationDashboard` |
| (단지 선택 후) 단지관리 ADMIN | `complex_detail` (tab: `separation_2`) | `SeparationDashboard` (isAdmin=true) |
| (단지 선택 후) 로그 | `complex_detail` (tab: `logs`) | `LogDashboard` |
| 취약점 분석 및 조치 | `vulnerability` | `VulnerabilityDashboard` |
| 홈네트워크 안전점검 | `safety_inspection` | `SafetyInspectionDashboard` |
| 단지관리 운영점검 | `complex_mgmt_report` | `ComplexManagementReportDashboard` |
| 통합 보고서 센터 | `report` | `ReportDashboard` |
| 계정 및 권한 관리 | `account_management` | `AccountManagementDashboard` |

---

## 6. 데이터 흐름

```
App.jsx (전역 상태)
  │
  ├── complexList ────────→ ComplexListDashboard (목록 표시)
  │                          └→ setComplexList (추가/수정/삭제)
  │
  ├── complexList ────────→ ComplexDetailDashboard (단지 상세)
  │   selectedComplexId       └→ 하위 탭 컴포넌트들
  │
  ├── vulnerabilityData ──→ VulnerabilityDashboard
  │                          └→ onDataChange (결과 변경)
  │
  ├── safetyInspectionData → SafetyInspectionDashboard
  │                          └→ onDataChange
  │
  ├── complexMgmtData ───→ ComplexManagementReportDashboard
  │                          └→ onDataChange
  │
  └── reportData ─────────→ ReportDashboard
                             └→ onDataChange
```

### 데이터 흐름 요약

- **App.jsx**에서 전역 상태를 관리하고, 하위 컴포넌트에 **props**로 전달합니다.
- 데이터 변경 시 콜백 함수(`onDataChange`, `setComplexList` 등)로 **App.jsx 상태를 업데이트**합니다.
- `localStorage`를 사용하여 브라우저 새로고침 시에도 **데이터를 유지**합니다.
- 단방향 데이터 흐름(React의 기본 패턴)을 따르므로, 상태 추적이 용이합니다.

---

## 7. 수정 시 참고사항

### 새 대시보드 추가

1. `dashboards/` 폴더에 새 컴포넌트 파일 생성
2. `App.jsx`에서 해당 컴포넌트를 `import`
3. `App.jsx`의 사이드바 메뉴 배열에 메뉴 항목 등록
4. `App.jsx`의 렌더링 분기(`activeMenu` 조건)에 컴포넌트 추가

### 새 공통 컴포넌트 추가

1. `components/` 폴더에 컴포넌트 파일 생성
2. 필요한 대시보드에서 `import`하여 사용

### 데이터 항목 추가

1. `constants/data.js`에 상수 또는 생성 함수 추가
2. 필요한 컴포넌트에서 `import`하여 사용
3. 백엔드 연동 후에는 해당 데이터를 API 호출로 대체

### 스타일 변경

- **Tailwind CSS** 클래스를 직접 수정합니다 (별도 CSS 파일 불필요).
- 글로벌 스타일이 필요한 경우 `App.css` 또는 `index.css`에 추가합니다.

---

> 본 문서는 AXGATE SaferHome 프론트엔드의 파일 분리 구조를 설명하기 위해 작성되었습니다. 코드 변경 시 본 문서도 함께 업데이트해 주시기 바랍니다.
