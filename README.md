# AXGATE SaferHome

아파트 단지 홈네트워크 보안 관리 시스템

## 프로젝트 구조

```
axgate-saferhome/
├── frontend/          ← React 프론트엔드
├── backend/           ← Spring Boot 백엔드
├── AXGATE_SaferHome_개발가이드.md
└── AXGATE_SaferHome_프론트엔드_구조설명서.md
```

## 기술 스택

| 구분 | 기술 |
|---|---|
| 프론트엔드 | React 19, Vite 7, Tailwind CSS 4 |
| 백엔드 | Spring Boot 3.2, JPA, JWT |
| 데이터베이스 | MariaDB |

## 빠른 시작

### 프론트엔드
```bash
cd frontend
npm install
npm run dev        # → http://localhost:5173
```

### 백엔드
```bash
# 1. MariaDB에서 schema.sql 실행
cd backend
gradle wrapper
./gradlew bootRun  # → http://localhost:8080
```

### 기본 로그인
- ID: `admin` / PW: `admin123`

## 문서
- [개발 가이드](./AXGATE_SaferHome_개발가이드.md)
- [프론트엔드 구조 설명서](./AXGATE_SaferHome_프론트엔드_구조설명서.md)
- [API 명세서](./backend/API_SPEC.md)
