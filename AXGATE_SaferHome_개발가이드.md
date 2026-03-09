# AXGATE SaferHome 개발 가이드

> **작성일**: 2026-03-09
> **대상**: 프로젝트 인수인계 Java 개발팀
> **버전**: 1.0

---

## 1. 프로젝트 개요

**AXGATE SaferHome**은 아파트 단지 홈네트워크 보안 관리 시스템입니다.

단지별 취약점 점검, 안전점검, 운영점검을 수행하고, 보고서를 생성하며, 계정/공지/문의를 관리하는 통합 플랫폼입니다.

| 구분 | 기술 스택 |
|---|---|
| **프론트엔드** | React 19 + Vite 7 + Tailwind CSS 4 + Lucide React (아이콘) |
| **백엔드** | Spring Boot 3.2 + MariaDB + JPA + JWT 인증 |
| **아키텍처** | 프론트/백엔드 완전 분리 (SPA + REST API) |

---

## 2. 시스템 아키텍처

```
┌─────────────────────┐
│   사용자 브라우저     │
└─────────┬───────────┘
          │ HTTP (localhost:5173)
┌─────────▼───────────┐
│  React 프론트엔드    │  ← axgate-frontend.zip
│  (Vite Dev Server)   │
└─────────┬───────────┘
          │ REST API (localhost:8080/api)
┌─────────▼───────────┐
│  Spring Boot 백엔드  │  ← axgate-saferhome-backend.zip
│  (JWT 인증)          │
└─────────┬───────────┘
          │ JDBC
┌─────────▼───────────┐
│  MariaDB             │
│  (axgate_saferhome)  │
└─────────────────────┘
```

- **프론트엔드**는 Vite 개발 서버(포트 5173)에서 동작하며, 모든 API 호출은 백엔드(포트 8080)로 전달됩니다.
- **백엔드**는 Spring Boot로 REST API를 제공하며, JWT 토큰 기반 인증을 사용합니다.
- **데이터베이스**는 MariaDB의 `axgate_saferhome` 스키마를 사용합니다.

---

## 3. 전달 파일 구성

| 파일 | 내용 |
|---|---|
| `axgate-frontend.zip` | React 프론트엔드 소스코드 (node_modules 미포함) |
| `axgate-saferhome-backend.zip` | Spring Boot 백엔드 + schema.sql + API_SPEC.md |

---

## 4. 프론트엔드 설치 및 실행

### 사전 요구사항

- **Node.js 18 이상** (https://nodejs.org)
- npm은 Node.js 설치 시 자동 포함

### 설치 및 실행

```bash
# 1. ZIP 압축 해제

# 2. 터미널에서 해당 폴더로 이동
cd axgate-saferhome-master

# 3. 의존성 설치 (node_modules 자동 생성, 최초 1회)
npm install

# 4. 개발 서버 실행
npm run dev
# → http://localhost:5173 에서 확인

# 5. 배포용 빌드
npm run build
# → dist/ 폴더에 정적 파일 생성
```

### 주요 디렉토리 구조 (프론트엔드)

```
axgate-saferhome-master/
├── public/                  # 정적 리소스
├── src/
│   ├── components/          # React 컴포넌트
│   ├── constants/
│   │   └── data.js          # 더미 데이터 (API 연동 시 대체 대상)
│   ├── pages/               # 페이지 컴포넌트
│   ├── App.jsx              # 메인 앱 컴포넌트
│   └── main.jsx             # 엔트리 포인트
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 5. 백엔드 설치 및 실행

### 사전 요구사항

- **JDK 17 이상** (https://adoptium.net)
- **MariaDB 10.6 이상** (https://mariadb.org)
- **Gradle** (또는 프로젝트 내 Gradle Wrapper 사용)

### DB 설정

```bash
# 1. MariaDB 접속
mysql -u root -p

# 2. 스키마 실행 (DB 생성 + 테이블 + 초기 데이터)
source schema.sql
```

> `schema.sql` 파일에는 데이터베이스 생성, 테이블 생성, 초기 관리자 계정 INSERT가 모두 포함되어 있습니다.

### 백엔드 실행

```bash
# 1. ZIP 압축 해제
cd axgate-saferhome-backend

# 2. application.yml에서 DB 접속 정보 확인
#    기본값: localhost:3306, root/root

# 3. Gradle Wrapper 생성 (최초 1회)
gradle wrapper

# 4. 실행
./gradlew bootRun
# → http://localhost:8080 에서 API 서버 시작

# 5. 배포용 빌드
./gradlew bootJar
# → build/libs/saferhome-0.0.1.jar 생성
# → java -jar saferhome-0.0.1.jar 로 실행
```

### 기본 로그인 계정

| 아이디 | 비밀번호 | 권한 |
|---|---|---|
| `admin` | `admin123` | 최고관리자 |

> 비밀번호는 BCrypt로 암호화되어 DB에 저장됩니다.

### 주요 디렉토리 구조 (백엔드)

```
axgate-saferhome-backend/
├── src/main/java/com/axgate/saferhome/
│   ├── config/              # 설정 (WebConfig, SecurityConfig 등)
│   ├── controller/          # REST 컨트롤러
│   ├── dto/                 # 요청/응답 DTO
│   ├── entity/              # JPA 엔티티
│   ├── repository/          # JPA 레포지토리
│   ├── service/             # 비즈니스 로직
│   └── security/            # JWT 관련 클래스
├── src/main/resources/
│   ├── application.yml      # 설정 파일 (DB, JWT 등)
│   └── static/              # 정적 파일 (배포 시 프론트엔드 빌드 결과물)
├── schema.sql               # DB 스키마 + 초기 데이터
├── API_SPEC.md              # API 명세서
├── build.gradle
└── settings.gradle
```

---

## 6. 데이터베이스 구조

### ERD (텍스트)

```
complex (단지) ─┬── vulnerability_check (취약점 점검)
                ├── safety_inspection (안전점검)
                ├── complex_management (운영점검)
                └── report (보고서)

account (계정)        ← 독립 테이블
notice (공지사항)     ← 독립 테이블
inquiry (문의)        ← 독립 테이블
system_log (로그)     ← 독립 테이블
```

### 테이블 상세

#### 1) `complex` (단지)

단지(아파트 단지) 기본 정보를 관리합니다.

| 컬럼명 | 타입 | 설명 |
|---|---|---|
| `id` | BIGINT (PK) | 단지 고유 ID (AUTO_INCREMENT) |
| `name` | VARCHAR(100) | 단지명 |
| `address` | VARCHAR(255) | 단지 주소 |
| `total_units` | INT | 총 세대수 |
| `network_type` | VARCHAR(50) | 네트워크 유형 |
| `manager_name` | VARCHAR(50) | 관리자 이름 |
| `manager_phone` | VARCHAR(20) | 관리자 연락처 |
| `status` | VARCHAR(20) | 상태 (활성/비활성) |
| `created_at` | DATETIME | 등록일시 |
| `updated_at` | DATETIME | 수정일시 |

- **PK**: `id`
- **FK**: 없음 (최상위 테이블)

---

#### 2) `vulnerability_check` (취약점 점검)

단지별 홈네트워크 취약점 점검 결과를 저장합니다.

| 컬럼명 | 타입 | 설명 |
|---|---|---|
| `id` | BIGINT (PK) | 점검 고유 ID (AUTO_INCREMENT) |
| `complex_id` | BIGINT (FK) | 연결된 단지 ID |
| `check_item` | VARCHAR(200) | 점검 항목명 |
| `category` | VARCHAR(50) | 점검 분류 |
| `result` | VARCHAR(20) | 점검 결과 (양호/취약/해당없음) |
| `description` | TEXT | 점검 상세 설명 |
| `checked_at` | DATETIME | 점검 일시 |
| `created_at` | DATETIME | 등록일시 |
| `updated_at` | DATETIME | 수정일시 |

- **PK**: `id`
- **FK**: `complex_id` -> `complex(id)`

---

#### 3) `safety_inspection` (안전점검)

단지별 안전점검 항목 및 결과를 관리합니다.

| 컬럼명 | 타입 | 설명 |
|---|---|---|
| `id` | BIGINT (PK) | 안전점검 고유 ID (AUTO_INCREMENT) |
| `complex_id` | BIGINT (FK) | 연결된 단지 ID |
| `inspection_item` | VARCHAR(200) | 점검 항목명 |
| `category` | VARCHAR(50) | 점검 분류 |
| `result` | VARCHAR(20) | 점검 결과 (양호/취약/해당없음) |
| `description` | TEXT | 점검 상세 설명 |
| `inspected_at` | DATETIME | 점검 일시 |
| `created_at` | DATETIME | 등록일시 |
| `updated_at` | DATETIME | 수정일시 |

- **PK**: `id`
- **FK**: `complex_id` -> `complex(id)`

---

#### 4) `complex_management` (운영점검)

단지별 운영 관리 점검 항목을 관리합니다.

| 컬럼명 | 타입 | 설명 |
|---|---|---|
| `id` | BIGINT (PK) | 운영점검 고유 ID (AUTO_INCREMENT) |
| `complex_id` | BIGINT (FK) | 연결된 단지 ID |
| `management_item` | VARCHAR(200) | 관리 항목명 |
| `category` | VARCHAR(50) | 관리 분류 |
| `result` | VARCHAR(20) | 점검 결과 (양호/미흡/해당없음) |
| `description` | TEXT | 점검 상세 설명 |
| `managed_at` | DATETIME | 점검 일시 |
| `created_at` | DATETIME | 등록일시 |
| `updated_at` | DATETIME | 수정일시 |

- **PK**: `id`
- **FK**: `complex_id` -> `complex(id)`

---

#### 5) `report` (보고서)

단지별 생성된 보고서를 관리합니다.

| 컬럼명 | 타입 | 설명 |
|---|---|---|
| `id` | BIGINT (PK) | 보고서 고유 ID (AUTO_INCREMENT) |
| `complex_id` | BIGINT (FK) | 연결된 단지 ID |
| `title` | VARCHAR(200) | 보고서 제목 |
| `content` | TEXT | 보고서 내용 |
| `report_type` | VARCHAR(50) | 보고서 유형 |
| `author` | VARCHAR(50) | 작성자 |
| `created_at` | DATETIME | 등록일시 |
| `updated_at` | DATETIME | 수정일시 |

- **PK**: `id`
- **FK**: `complex_id` -> `complex(id)`

---

#### 6) `account` (계정)

시스템 사용자 계정을 관리합니다.

| 컬럼명 | 타입 | 설명 |
|---|---|---|
| `id` | BIGINT (PK) | 계정 고유 ID (AUTO_INCREMENT) |
| `username` | VARCHAR(50) | 로그인 아이디 (UNIQUE) |
| `password` | VARCHAR(255) | 비밀번호 (BCrypt 암호화) |
| `name` | VARCHAR(50) | 사용자 이름 |
| `role` | VARCHAR(20) | 권한 (ADMIN/USER) |
| `email` | VARCHAR(100) | 이메일 |
| `phone` | VARCHAR(20) | 연락처 |
| `status` | VARCHAR(20) | 상태 (활성/비활성) |
| `created_at` | DATETIME | 등록일시 |
| `updated_at` | DATETIME | 수정일시 |

- **PK**: `id`
- **FK**: 없음 (독립 테이블)

---

#### 7) `notice` (공지사항)

시스템 공지사항을 관리합니다.

| 컬럼명 | 타입 | 설명 |
|---|---|---|
| `id` | BIGINT (PK) | 공지 고유 ID (AUTO_INCREMENT) |
| `title` | VARCHAR(200) | 공지 제목 |
| `content` | TEXT | 공지 내용 |
| `author` | VARCHAR(50) | 작성자 |
| `view_count` | INT | 조회수 |
| `created_at` | DATETIME | 등록일시 |
| `updated_at` | DATETIME | 수정일시 |

- **PK**: `id`
- **FK**: 없음 (독립 테이블)

---

#### 8) `inquiry` (문의)

사용자 문의 및 답변을 관리합니다.

| 컬럼명 | 타입 | 설명 |
|---|---|---|
| `id` | BIGINT (PK) | 문의 고유 ID (AUTO_INCREMENT) |
| `title` | VARCHAR(200) | 문의 제목 |
| `content` | TEXT | 문의 내용 |
| `author` | VARCHAR(50) | 작성자 |
| `answer` | TEXT | 답변 내용 |
| `status` | VARCHAR(20) | 상태 (대기/완료) |
| `created_at` | DATETIME | 등록일시 |
| `updated_at` | DATETIME | 수정일시 |

- **PK**: `id`
- **FK**: 없음 (독립 테이블)

---

#### 9) `system_log` (시스템 로그)

시스템 사용 이력을 기록합니다.

| 컬럼명 | 타입 | 설명 |
|---|---|---|
| `id` | BIGINT (PK) | 로그 고유 ID (AUTO_INCREMENT) |
| `action` | VARCHAR(100) | 수행 동작 |
| `detail` | TEXT | 상세 내용 |
| `username` | VARCHAR(50) | 수행 사용자 |
| `ip_address` | VARCHAR(45) | 접속 IP |
| `created_at` | DATETIME | 발생일시 |

- **PK**: `id`
- **FK**: 없음 (독립 테이블)

---

## 7. API 엔드포인트 요약

### 전체 API 목록

| # | Method | URL | 설명 | 인증 |
|---|---|---|---|---|
| 1 | POST | `/api/auth/login` | 로그인 | 불필요 |
| 2 | POST | `/api/auth/logout` | 로그아웃 | 필요 |
| 3 | GET | `/api/complexes` | 전체 단지 목록 조회 | 필요 |
| 4 | POST | `/api/complexes` | 신규 단지 등록 | 필요 |
| 5 | GET | `/api/complexes/{id}` | 단지 상세 조회 | 필요 |
| 6 | PUT | `/api/complexes/{id}` | 단지 정보 수정 | 필요 |
| 7 | DELETE | `/api/complexes/{id}` | 단지 삭제 | 필요 |
| 8 | GET | `/api/complexes/{id}/vulnerability-checks` | 취약점 점검 조회 | 필요 |
| 9 | PUT | `/api/complexes/{id}/vulnerability-checks` | 점검 결과 수정 | 필요 |
| 10 | GET | `/api/complexes/{id}/safety-inspections` | 안전점검 조회 | 필요 |
| 11 | PUT | `/api/complexes/{id}/safety-inspections` | 안전점검 수정 | 필요 |
| 12 | GET | `/api/complexes/{id}/complex-managements` | 운영점검 조회 | 필요 |
| 13 | PUT | `/api/complexes/{id}/complex-managements` | 운영점검 수정 | 필요 |
| 14 | GET | `/api/complexes/{id}/reports` | 보고서 목록 | 필요 |
| 15 | POST | `/api/complexes/{id}/reports` | 보고서 등록 | 필요 |
| 16 | DELETE | `/api/complexes/{id}/reports/{reportId}` | 보고서 삭제 | 필요 |
| 17 | GET | `/api/accounts` | 계정 목록 | 필요 |
| 18 | POST | `/api/accounts` | 계정 생성 | 필요 |
| 19 | PUT | `/api/accounts/{id}` | 계정 수정 | 필요 |
| 20 | DELETE | `/api/accounts/{id}` | 계정 삭제 | 필요 |
| 21 | GET | `/api/notices` | 공지 목록 | 필요 |
| 22 | POST | `/api/notices` | 공지 등록 | 필요 |
| 23 | GET | `/api/inquiries` | 문의 목록 | 필요 |
| 24 | POST | `/api/inquiries` | 문의 등록 | 필요 |
| 25 | PUT | `/api/inquiries/{id}` | 문의 답변 | 필요 |
| 26 | GET | `/api/logs` | 시스템 로그 | 필요 |

### JWT 인증 방식

```
1. POST /api/auth/login 호출하여 토큰 발급
   요청: { "username": "admin", "password": "admin123" }
   응답: { "token": "eyJhbG..." }

2. 이후 모든 API 호출 시 HTTP Header에 토큰 포함:
   Authorization: Bearer eyJhbG...

3. 토큰 만료 시 다시 로그인하여 새 토큰 발급
```

### 인증 흐름 다이어그램

```
클라이언트                          서버
   │                                 │
   │  POST /api/auth/login           │
   │  { username, password }         │
   │ ──────────────────────────────> │
   │                                 │  비밀번호 BCrypt 검증
   │  200 OK { token: "eyJ..." }     │  JWT 토큰 생성
   │ <────────────────────────────── │
   │                                 │
   │  GET /api/complexes             │
   │  Authorization: Bearer eyJ...   │
   │ ──────────────────────────────> │
   │                                 │  JWT 토큰 검증
   │  200 OK [ { ... }, { ... } ]    │  데이터 반환
   │ <────────────────────────────── │
```

---

## 8. 프론트엔드-백엔드 연동 방법

### 현재 상태

현재 프론트엔드는 `src/constants/data.js`에서 **더미 데이터**를 사용하여 화면을 렌더링합니다. 실제 백엔드 API와 연동하려면 해당 더미 데이터를 API 호출로 대체해야 합니다.

### 연동 예시 1: 단지 목록 조회

```javascript
// === 변경 전 (현재: 더미 데이터) ===
import { INITIAL_COMPLEX_LIST } from './constants/data';
const [complexList, setComplexList] = useState(INITIAL_COMPLEX_LIST);

// === 변경 후 (API 연동) ===
const [complexList, setComplexList] = useState([]);
const token = localStorage.getItem('token');

useEffect(() => {
  fetch('http://localhost:8080/api/complexes', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => setComplexList(data))
  .catch(err => console.error(err));
}, []);
```

### 연동 예시 2: 로그인

```javascript
const handleLogin = async (username, password) => {
  const res = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  localStorage.setItem('token', data.token);
};
```

### 연동 예시 3: 단지 등록

```javascript
const handleCreateComplex = async (complexData) => {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:8080/api/complexes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(complexData)
  });
  if (res.ok) {
    const newComplex = await res.json();
    setComplexList(prev => [...prev, newComplex]);
  }
};
```

### CORS 설정

CORS는 백엔드 `WebConfig.java`에서 `localhost:5173` 허용 설정이 완료되어 있습니다. 배포 환경에서 도메인이 변경되면 해당 설정도 함께 수정해야 합니다.

---

## 9. 배포 가이드

### 방법 1: 각각 배포 (권장)

프론트엔드와 백엔드를 별도 서버에서 운영합니다.

**프론트엔드 (Nginx)**

```bash
# 1. 빌드
npm run build

# 2. dist/ 폴더를 Nginx 웹 루트에 복사
cp -r dist/* /usr/share/nginx/html/

# 3. Nginx 설정 예시 (/etc/nginx/conf.d/saferhome.conf)
server {
    listen 80;
    server_name your-domain.com;

    root /usr/share/nginx/html;
    index index.html;

    # SPA 라우팅 지원
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 프록시
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**백엔드 (Spring Boot)**

```bash
# 1. 빌드
./gradlew bootJar

# 2. JAR 파일 실행
java -jar build/libs/saferhome-0.0.1.jar

# 또는 백그라운드 실행
nohup java -jar build/libs/saferhome-0.0.1.jar > app.log 2>&1 &
```

### 방법 2: Spring Boot에서 함께 서빙

프론트엔드 빌드 결과물을 Spring Boot에 포함하여 서버 하나로 운영합니다.

```bash
# 1. 프론트엔드 빌드
cd axgate-saferhome-master
npm run build

# 2. 빌드 결과물을 백엔드 static 폴더에 복사
cp -r dist/* ../axgate-saferhome-backend/src/main/resources/static/

# 3. 백엔드 빌드 및 실행
cd ../axgate-saferhome-backend
./gradlew bootJar
java -jar build/libs/saferhome-0.0.1.jar

# → http://localhost:8080 에서 프론트엔드 + API 모두 서빙
```

---

## 10. 주의사항

### 필수 확인 사항

1. **node_modules 폴더**는 ZIP에 포함되지 않습니다. 반드시 `npm install`로 생성해야 합니다.
2. **schema.sql을 먼저 실행**한 후 백엔드를 시작해야 합니다. 테이블이 없으면 서버 기동 시 오류가 발생합니다.
3. **JWT 토큰 만료시간**은 `application.yml`에서 설정합니다 (기본값: 24시간).
4. **비밀번호**는 BCrypt로 암호화 저장됩니다. DB에서 직접 계정을 추가할 경우 BCrypt 해시 값을 사용해야 합니다.
5. **프론트엔드 빌드 시 API 주소**를 환경변수로 변경할 수 있습니다 (Vite의 `.env` 파일 활용).

### application.yml 주요 설정

```yaml
spring:
  datasource:
    url: jdbc:mariadb://localhost:3306/axgate_saferhome
    username: root
    password: root
  jpa:
    hibernate:
      ddl-auto: validate   # 운영 시 validate 권장
    show-sql: true

jwt:
  secret: your-secret-key   # 운영 환경에서 반드시 변경
  expiration: 86400000       # 24시간 (밀리초)

server:
  port: 8080
```

### 환경별 설정 변경 포인트

| 항목 | 파일 | 설명 |
|---|---|---|
| DB 접속 정보 | `application.yml` | url, username, password 변경 |
| JWT 시크릿 키 | `application.yml` | 운영 환경에서 반드시 변경 필요 |
| CORS 허용 도메인 | `WebConfig.java` | 프론트엔드 도메인에 맞게 변경 |
| API 서버 주소 | 프론트엔드 `.env` | `VITE_API_URL` 환경변수 설정 |
| 서버 포트 | `application.yml` | `server.port` 변경 |

---

## 부록: 자주 묻는 질문 (FAQ)

**Q1. npm install 시 오류가 발생합니다.**
A1. Node.js 버전이 18 이상인지 확인하세요. `node -v`로 확인 가능합니다.

**Q2. 백엔드 실행 시 DB 연결 오류가 발생합니다.**
A2. MariaDB가 실행 중인지, `application.yml`의 접속 정보가 올바른지, `schema.sql`이 실행되었는지 확인하세요.

**Q3. 로그인이 되지 않습니다.**
A3. `schema.sql`에 포함된 초기 데이터에 admin 계정이 있습니다. schema.sql을 다시 실행해 보세요.

**Q4. 프론트엔드에서 API 호출 시 CORS 오류가 발생합니다.**
A4. 백엔드 `WebConfig.java`에서 프론트엔드 도메인이 허용되어 있는지 확인하세요.

**Q5. 배포 환경에서 API 주소를 변경하려면 어떻게 하나요?**
A5. 프론트엔드 루트에 `.env.production` 파일을 생성하고 `VITE_API_URL=https://your-api-domain.com`을 설정한 후 빌드하세요. 코드에서는 `import.meta.env.VITE_API_URL`로 사용합니다.

---

> **문서 끝** | AXGATE SaferHome 개발 가이드 v1.0
