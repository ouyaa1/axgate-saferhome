# AXGATE SaferHome API 명세서

> **버전**: v1.0.0
> **최종 수정일**: 2026-03-09
> **작성 대상**: 백엔드/프론트엔드 개발팀

---

## 목차

1. [개요](#1-개요)
2. [공통 규약](#2-공통-규약)
3. [인증 API](#3-인증-api)
4. [단지 관리 API](#4-단지-관리-api)
5. [취약점 점검 API](#5-취약점-점검-api)
6. [안전점검 API](#6-안전점검-api)
7. [단지관리 운영점검 API](#7-단지관리-운영점검-api)
8. [보고서 API](#8-보고서-api)
9. [계정 관리 API](#9-계정-관리-api)
10. [공지사항 API](#10-공지사항-api)
11. [문의 API](#11-문의-api)
12. [시스템 로그 API](#12-시스템-로그-api)

---

## 1. 개요

| 항목 | 값 |
|------|-----|
| **Base URL** | `http://localhost:8080/api` |
| **인증 방식** | JWT Bearer Token |
| **Content-Type** | `application/json; charset=UTF-8` |
| **문자 인코딩** | UTF-8 |
| **날짜 형식** | `yyyy-MM-dd` (날짜), `yyyy-MM-dd HH:mm:ss` (일시) |
| **페이징 기본값** | `page=0`, `size=20` |

---

## 2. 공통 규약

### 2.1 인증 헤더

인증이 필요한 모든 요청에는 아래 헤더를 포함해야 합니다.

```
Authorization: Bearer {JWT_TOKEN}
```

### 2.2 공통 응답 형식

#### 성공 응답

```json
{
  "success": true,
  "data": { ... },
  "message": "요청이 성공적으로 처리되었습니다."
}
```

#### 에러 응답

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "사용자에게 표시할 에러 메시지",
    "details": "개발자용 상세 에러 정보 (선택)"
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

### 2.3 공통 에러 코드

| HTTP 상태 코드 | 에러 코드 | 설명 |
|---------------|-----------|------|
| `400` | `BAD_REQUEST` | 요청 파라미터가 유효하지 않음 |
| `401` | `UNAUTHORIZED` | 인증 토큰이 없거나 만료됨 |
| `403` | `FORBIDDEN` | 해당 리소스에 대한 권한 없음 |
| `404` | `NOT_FOUND` | 요청한 리소스를 찾을 수 없음 |
| `409` | `CONFLICT` | 리소스 충돌 (중복 등록 등) |
| `500` | `INTERNAL_SERVER_ERROR` | 서버 내부 오류 |

### 2.4 페이징 응답 형식

목록 조회 API에서 페이징이 적용되는 경우 아래 형식을 따릅니다.

```json
{
  "success": true,
  "data": {
    "content": [ ... ],
    "page": 0,
    "size": 20,
    "totalElements": 150,
    "totalPages": 8
  }
}
```

### 2.5 권한 등급 (Role)

| Role | 설명 | 접근 범위 |
|------|------|----------|
| `Super Admin` | 최고관리자 | 전체 시스템 (모든 API 접근 가능) |
| `System Engineer` | 시스템 엔지니어 | 전체 단지 유지보수 (계정 관리 제외) |
| `Complex Manager` | 단지 관리자 | 담당 단지만 접근 가능 |
| `Viewer` | 단순 열람자 | 담당 단지 읽기 전용 |

---

## 3. 인증 API

### 3.1 로그인

사용자 인증 후 JWT 토큰을 발급합니다.

- **URL**: `POST /api/auth/login`
- **인증 필요**: 아니오

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Content-Type` | `application/json` |

#### Request Body

```json
{
  "username": "admin@axgate.com",
  "password": "axgate1234!"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `username` | `String` | O | 로그인 ID (이메일 형식 또는 사용자 ID) |
| `password` | `String` | O | 비밀번호 |

#### Response Body (성공)

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "name": "최고관리자",
    "role": "Super Admin",
    "expiresIn": 3600
  },
  "message": "로그인에 성공하였습니다."
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `token` | `String` | JWT 인증 토큰 |
| `name` | `String` | 사용자 표시 이름 |
| `role` | `String` | 권한 등급 (`Super Admin`, `System Engineer`, `Complex Manager`, `Viewer`) |
| `expiresIn` | `Integer` | 토큰 만료 시간 (초 단위) |

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `200 OK` | 로그인 성공 |
| `401 Unauthorized` | 아이디 또는 비밀번호 불일치 |
| `423 Locked` | 계정 비활성 상태 (접속 차단됨) |

#### Response Body (실패)

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "아이디 또는 비밀번호가 일치하지 않습니다."
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

---

### 3.2 로그아웃

현재 세션의 JWT 토큰을 무효화합니다.

- **URL**: `POST /api/auth/logout`
- **인증 필요**: 예

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |

#### Response Body (성공)

```json
{
  "success": true,
  "data": null,
  "message": "로그아웃 되었습니다."
}
```

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `200 OK` | 로그아웃 성공 |
| `401 Unauthorized` | 유효하지 않은 토큰 |

---

## 4. 단지 관리 API

### 4.1 전체 단지 목록 조회

등록된 전체 단지 목록을 조회합니다. 검색, 필터링, 페이징을 지원합니다.

- **URL**: `GET /api/complexes`
- **인증 필요**: 예
- **권한**: 모든 역할 (단, `Complex Manager`/`Viewer`는 담당 단지만 반환)

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |

#### Query Parameters

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|--------|------|
| `search` | `String` | X | - | 단지명, 건설사, 홈넷사 통합 검색 |
| `status` | `String` | X | - | 연결 상태 필터 (`정상`, `오프라인`, `점검중`) |
| `builder` | `String` | X | - | 건설사 필터 |
| `homenet` | `String` | X | - | 홈넷사 필터 |
| `startDate` | `String` | X | - | 등록일 검색 시작 (`yyyy-MM-dd`) |
| `endDate` | `String` | X | - | 등록일 검색 종료 (`yyyy-MM-dd`) |
| `page` | `Integer` | X | `0` | 페이지 번호 (0부터 시작) |
| `size` | `Integer` | X | `20` | 페이지당 항목 수 |

#### Response Body (성공)

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "AX-PRM-01",
        "name": "디에이치 아너힐즈",
        "region": "서울 강남구",
        "address": "서울특별시 강남구 개포로 310",
        "builder": "현대건설",
        "homenet": "현대HT",
        "status": "정상",
        "manager": "박신일 소장",
        "contact": "010-1234-5678",
        "builderManager": "김현대 과장",
        "builderContact": "010-1111-2222",
        "homenetManager": "이현대 대리",
        "homenetContact": "010-3333-4444",
        "dongCount": 10,
        "dongStartNum": 101,
        "floorCount": 20,
        "unitsPerFloor": 2,
        "deviceRegistered": true,
        "report": "발급",
        "regDate": "2024-01-15",
        "registrant": "시스템"
      }
    ],
    "page": 0,
    "size": 20,
    "totalElements": 8,
    "totalPages": 1
  }
}
```

#### Complex 객체 필드 상세

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | `String` | 단지 고유 ID (예: `AX-PRM-01`) |
| `name` | `String` | 단지명 (아파트 이름) |
| `region` | `String` | 지역 (예: `서울 강남구`) |
| `address` | `String` | 상세 주소 |
| `builder` | `String` | 건설사 |
| `homenet` | `String` | 홈네트워크 사업자 |
| `status` | `String` | 연결 상태 (`정상`, `오프라인`, `점검중`) |
| `manager` | `String` | 관리사무소 담당자 |
| `contact` | `String` | 관리사무소 연락처 |
| `builderManager` | `String` | 건설사 담당자 |
| `builderContact` | `String` | 건설사 연락처 |
| `homenetManager` | `String` | 홈넷사 담당자 |
| `homenetContact` | `String` | 홈넷사 연락처 |
| `dongCount` | `Integer` | 동 수 |
| `dongStartNum` | `Integer` | 동 시작 번호 |
| `floorCount` | `Integer` | 층 수 |
| `unitsPerFloor` | `Integer` | 층당 세대 수 |
| `deviceRegistered` | `Boolean` | 장비 등록 여부 |
| `report` | `String` | 리포트 발급 상태 (`발급`, `미발급`) |
| `regDate` | `String` | 서비스 등록일 (`yyyy-MM-dd`) |
| `registrant` | `String` | 최초 등록자 |

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `200 OK` | 조회 성공 |
| `401 Unauthorized` | 인증 실패 |

---

### 4.2 단지 상세 조회

특정 단지의 상세 정보를 조회합니다.

- **URL**: `GET /api/complexes/{id}`
- **인증 필요**: 예
- **권한**: 해당 단지 접근 권한 보유자

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `id` | `String` | O | 단지 고유 ID (예: `AX-PRM-01`) |

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |

#### Response Body (성공)

```json
{
  "success": true,
  "data": {
    "id": "AX-PRM-01",
    "name": "디에이치 아너힐즈",
    "region": "서울 강남구",
    "address": "서울특별시 강남구 개포로 310",
    "builder": "현대건설",
    "homenet": "현대HT",
    "status": "정상",
    "manager": "박신일 소장",
    "contact": "010-1234-5678",
    "builderManager": "김현대 과장",
    "builderContact": "010-1111-2222",
    "homenetManager": "이현대 대리",
    "homenetContact": "010-3333-4444",
    "dongCount": 10,
    "dongStartNum": 101,
    "floorCount": 20,
    "unitsPerFloor": 2,
    "deviceRegistered": true,
    "report": "발급",
    "regDate": "2024-01-15",
    "registrant": "시스템"
  }
}
```

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `200 OK` | 조회 성공 |
| `401 Unauthorized` | 인증 실패 |
| `403 Forbidden` | 해당 단지에 대한 접근 권한 없음 |
| `404 Not Found` | 해당 ID의 단지가 존재하지 않음 |

---

### 4.3 신규 단지 등록

새로운 단지를 시스템에 등록합니다.

- **URL**: `POST /api/complexes`
- **인증 필요**: 예
- **권한**: `Super Admin`, `System Engineer`

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |
| `Content-Type` | `application/json` |

#### Request Body

```json
{
  "name": "테스트 래미안",
  "region": "서울 마포구",
  "address": "서울특별시 마포구 테스트로 123",
  "builder": "삼성물산",
  "homenet": "삼성SDS",
  "manager": "이소장",
  "contact": "010-1234-5678",
  "builderManager": "김과장",
  "builderContact": "010-2222-3333",
  "homenetManager": "박대리",
  "homenetContact": "010-4444-5555",
  "dongCount": 5,
  "dongStartNum": 101,
  "floorCount": 20,
  "unitsPerFloor": 4
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `name` | `String` | O | 단지명 |
| `region` | `String` | X | 지역 |
| `address` | `String` | X | 상세 주소 |
| `builder` | `String` | X | 건설사 |
| `homenet` | `String` | X | 홈넷사 |
| `manager` | `String` | X | 관리사무소 담당자 |
| `contact` | `String` | X | 관리사무소 연락처 |
| `builderManager` | `String` | X | 건설사 담당자 |
| `builderContact` | `String` | X | 건설사 연락처 |
| `homenetManager` | `String` | X | 홈넷사 담당자 |
| `homenetContact` | `String` | X | 홈넷사 연락처 |
| `dongCount` | `Integer` | X | 동 수 |
| `dongStartNum` | `Integer` | X | 동 시작 번호 |
| `floorCount` | `Integer` | X | 층 수 |
| `unitsPerFloor` | `Integer` | X | 층당 세대 수 |

#### Response Body (성공)

```json
{
  "success": true,
  "data": {
    "id": "AX-PRM-09",
    "name": "테스트 래미안",
    "region": "서울 마포구",
    "address": "서울특별시 마포구 테스트로 123",
    "builder": "삼성물산",
    "homenet": "삼성SDS",
    "status": "정상",
    "manager": "이소장",
    "contact": "010-1234-5678",
    "builderManager": "김과장",
    "builderContact": "010-2222-3333",
    "homenetManager": "박대리",
    "homenetContact": "010-4444-5555",
    "dongCount": 5,
    "dongStartNum": 101,
    "floorCount": 20,
    "unitsPerFloor": 4,
    "deviceRegistered": false,
    "report": "미발급",
    "regDate": "2026-03-09",
    "registrant": "관리자"
  },
  "message": "신규 단지가 등록되었습니다."
}
```

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `201 Created` | 단지 등록 성공 |
| `400 Bad Request` | 필수 필드 누락 또는 유효하지 않은 값 |
| `401 Unauthorized` | 인증 실패 |
| `403 Forbidden` | 단지 등록 권한 없음 |
| `409 Conflict` | 동일한 단지명이 이미 존재함 |

---

### 4.4 단지 정보 수정

기존 단지의 정보를 수정합니다.

- **URL**: `PUT /api/complexes/{id}`
- **인증 필요**: 예
- **권한**: `Super Admin`, `System Engineer`

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `id` | `String` | O | 단지 고유 ID |

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |
| `Content-Type` | `application/json` |

#### Request Body

변경할 필드만 포함하여 전송합니다. (부분 수정 지원)

```json
{
  "name": "디에이치 아너힐즈 (수정)",
  "manager": "김영수 소장",
  "contact": "010-9999-0000",
  "status": "점검중"
}
```

#### Response Body (성공)

```json
{
  "success": true,
  "data": {
    "id": "AX-PRM-01",
    "name": "디에이치 아너힐즈 (수정)",
    "region": "서울 강남구",
    "address": "서울특별시 강남구 개포로 310",
    "builder": "현대건설",
    "homenet": "현대HT",
    "status": "점검중",
    "manager": "김영수 소장",
    "contact": "010-9999-0000",
    "builderManager": "김현대 과장",
    "builderContact": "010-1111-2222",
    "homenetManager": "이현대 대리",
    "homenetContact": "010-3333-4444",
    "dongCount": 10,
    "dongStartNum": 101,
    "floorCount": 20,
    "unitsPerFloor": 2,
    "deviceRegistered": true,
    "report": "발급",
    "regDate": "2024-01-15",
    "registrant": "시스템"
  },
  "message": "단지 정보가 수정되었습니다."
}
```

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `200 OK` | 수정 성공 |
| `400 Bad Request` | 유효하지 않은 필드 값 |
| `401 Unauthorized` | 인증 실패 |
| `403 Forbidden` | 수정 권한 없음 |
| `404 Not Found` | 해당 단지가 존재하지 않음 |

---

### 4.5 단지 삭제

단지를 시스템에서 삭제합니다. 복수 삭제를 지원합니다.

- **URL**: `DELETE /api/complexes/{id}`
- **인증 필요**: 예
- **권한**: `Super Admin`

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `id` | `String` | O | 단지 고유 ID |

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |

#### Response Body (성공)

```json
{
  "success": true,
  "data": null,
  "message": "1건의 단지가 삭제되었습니다."
}
```

#### 복수 삭제 (Batch Delete)

- **URL**: `DELETE /api/complexes`
- **인증 필요**: 예
- **권한**: `Super Admin`

#### Request Body (복수 삭제)

```json
{
  "ids": ["AX-PRM-01", "AX-PRM-02", "AX-PRM-03"]
}
```

#### Response Body (복수 삭제 성공)

```json
{
  "success": true,
  "data": {
    "deletedCount": 3
  },
  "message": "3건의 단지가 삭제되었습니다."
}
```

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `200 OK` | 삭제 성공 |
| `401 Unauthorized` | 인증 실패 |
| `403 Forbidden` | 삭제 권한 없음 |
| `404 Not Found` | 해당 단지가 존재하지 않음 |

---

### 4.6 단지 엑셀(CSV) 일괄 등록

CSV 파일을 업로드하여 단지를 일괄 등록합니다.

- **URL**: `POST /api/complexes/bulk-upload`
- **인증 필요**: 예
- **권한**: `Super Admin`, `System Engineer`

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |
| `Content-Type` | `multipart/form-data` |

#### Request Body (multipart)

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `file` | `File` | O | CSV 파일 (UTF-8 BOM 인코딩 권장) |

#### CSV 파일 컬럼 구조

```
단지명(필수),지역,상세주소,건설사,홈넷사,관리사무소_담당자,관리사무소_연락처,건설사_담당자,건설사_연락처,홈넷사_담당자,홈넷사_연락처
```

#### Response Body (성공)

```json
{
  "success": true,
  "data": {
    "registeredCount": 5,
    "failedCount": 0,
    "errors": []
  },
  "message": "5건의 단지가 성공적으로 등록되었습니다."
}
```

#### Response Body (부분 실패)

```json
{
  "success": true,
  "data": {
    "registeredCount": 3,
    "failedCount": 2,
    "errors": [
      { "row": 4, "reason": "단지명이 비어 있습니다." },
      { "row": 7, "reason": "중복된 단지명입니다." }
    ]
  },
  "message": "3건 등록 완료, 2건 실패."
}
```

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `200 OK` | 업로드 처리 완료 (부분 실패 포함) |
| `400 Bad Request` | 파일 형식 오류 또는 빈 파일 |
| `401 Unauthorized` | 인증 실패 |
| `403 Forbidden` | 등록 권한 없음 |

---

## 5. 취약점 점검 API

### 5.1 취약점 점검 목록 조회

특정 단지의 취약점 점검 항목 및 결과를 조회합니다.

- **URL**: `GET /api/complexes/{id}/vulnerability-checks`
- **인증 필요**: 예
- **권한**: 해당 단지 접근 권한 보유자

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `id` | `String` | O | 단지 고유 ID |

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |

#### Response Body (성공)

```json
{
  "success": true,
  "data": [
    {
      "id": "SV-01",
      "category": "계정 관리",
      "item": "불필요한 계정 비활성화",
      "result": "양호",
      "note": "-"
    },
    {
      "id": "SV-04",
      "category": "계정 관리",
      "item": "관리자그룹의 최소한 계정 포함",
      "result": "수동점검",
      "note": "확인 필요"
    },
    {
      "id": "SV-16",
      "category": "파일 관리",
      "item": "/etc/hosts 파일 소유자 및 권한 설정",
      "result": "취약",
      "note": "권한 600 설정 요망"
    },
    {
      "id": "SV-31",
      "category": "서비스 관리",
      "item": "원격 접속 터미널 보안 설정",
      "result": "취약",
      "note": "SSH Root 접속 제한 필요"
    }
  ]
}
```

#### VulnerabilityCheck 객체 필드 상세

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | `String` | 점검 항목 ID (예: `SV-01`) |
| `category` | `String` | 점검 분류 (`계정 관리`, `권한 관리`, `파일 관리`, `서비스 관리`, `보안 관리`, `DB 관리`) |
| `item` | `String` | 점검 항목명 |
| `result` | `String` | 점검 결과 (`양호`, `취약`, `수동점검`) |
| `note` | `String` | 비고 (조치사항, 참고사항 등) |

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `200 OK` | 조회 성공 |
| `401 Unauthorized` | 인증 실패 |
| `403 Forbidden` | 해당 단지에 대한 접근 권한 없음 |
| `404 Not Found` | 해당 단지가 존재하지 않음 |

---

### 5.2 취약점 점검 결과 일괄 수정

특정 단지의 취약점 점검 결과를 일괄 수정합니다.

- **URL**: `PUT /api/complexes/{id}/vulnerability-checks`
- **인증 필요**: 예
- **권한**: `Super Admin`, `System Engineer`, `Complex Manager`

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `id` | `String` | O | 단지 고유 ID |

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |
| `Content-Type` | `application/json` |

#### Request Body

```json
{
  "items": [
    {
      "id": "SV-16",
      "result": "양호",
      "note": "권한 600 설정 완료"
    },
    {
      "id": "SV-31",
      "result": "양호",
      "note": "SSH Root 접속 제한 적용 완료"
    }
  ]
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `items` | `Array` | O | 수정할 점검 항목 배열 |
| `items[].id` | `String` | O | 점검 항목 ID |
| `items[].result` | `String` | O | 변경할 점검 결과 (`양호`, `취약`, `수동점검`) |
| `items[].note` | `String` | X | 비고 |

#### Response Body (성공)

```json
{
  "success": true,
  "data": {
    "updatedCount": 2
  },
  "message": "2건의 점검 결과가 수정되었습니다."
}
```

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `200 OK` | 수정 성공 |
| `400 Bad Request` | 유효하지 않은 점검 항목 ID 또는 결과 값 |
| `401 Unauthorized` | 인증 실패 |
| `403 Forbidden` | 수정 권한 없음 |
| `404 Not Found` | 해당 단지가 존재하지 않음 |

---

## 6. 안전점검 API

### 6.1 안전점검 목록 조회

특정 단지의 안전점검 항목 및 결과를 조회합니다.

- **URL**: `GET /api/complexes/{id}/safety-inspections`
- **인증 필요**: 예
- **권한**: 해당 단지 접근 권한 보유자

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `id` | `String` | O | 단지 고유 ID |

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |

#### Response Body (성공)

```json
{
  "success": true,
  "data": [
    {
      "id": "SI-0",
      "category": "관리용 PC",
      "item": "계정관리 및 보안설정",
      "cycleRec": "월간",
      "cycleMan": "월간",
      "result": "양호"
    },
    {
      "id": "SI-4",
      "category": "단지 네트워크 장비",
      "item": "장비 온도, LED 램프 등 장비 외관을 육안 점검",
      "cycleRec": "2주",
      "cycleMan": "월간",
      "result": "불량"
    },
    {
      "id": "SI-10",
      "category": "단지서버",
      "item": "장비 온도, LED 램프 등 장비 외관을 육안 점검",
      "cycleRec": "2주",
      "cycleMan": "월간",
      "result": "해당없음"
    }
  ]
}
```

#### SafetyInspection 객체 필드 상세

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | `String` | 점검 항목 ID (예: `SI-0`) |
| `category` | `String` | 점검 분류 (`관리용 PC`, `단지 네트워크 장비`, `단지서버`, `통신 배관실`, `집중구내 통신실`, `방재실`, `기타`) |
| `item` | `String` | 점검 항목명 |
| `cycleRec` | `String` | 권장 점검 주기 (`1주`, `2주`, `월간`) |
| `cycleMan` | `String` | 관리 점검 주기 |
| `result` | `String` | 점검 결과 (`양호`, `불량`, `해당없음`) |

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `200 OK` | 조회 성공 |
| `401 Unauthorized` | 인증 실패 |
| `403 Forbidden` | 접근 권한 없음 |
| `404 Not Found` | 해당 단지가 존재하지 않음 |

---

### 6.2 안전점검 결과 일괄 수정

특정 단지의 안전점검 결과를 일괄 수정합니다.

- **URL**: `PUT /api/complexes/{id}/safety-inspections`
- **인증 필요**: 예
- **권한**: `Super Admin`, `System Engineer`, `Complex Manager`

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `id` | `String` | O | 단지 고유 ID |

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |
| `Content-Type` | `application/json` |

#### Request Body

```json
{
  "items": [
    {
      "id": "SI-4",
      "result": "양호"
    },
    {
      "id": "SI-10",
      "result": "불량"
    }
  ]
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `items` | `Array` | O | 수정할 점검 항목 배열 |
| `items[].id` | `String` | O | 점검 항목 ID |
| `items[].result` | `String` | O | 변경할 점검 결과 (`양호`, `불량`, `해당없음`) |

#### Response Body (성공)

```json
{
  "success": true,
  "data": {
    "updatedCount": 2
  },
  "message": "2건의 안전점검 결과가 수정되었습니다."
}
```

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `200 OK` | 수정 성공 |
| `400 Bad Request` | 유효하지 않은 항목 ID 또는 결과 값 |
| `401 Unauthorized` | 인증 실패 |
| `403 Forbidden` | 수정 권한 없음 |
| `404 Not Found` | 해당 단지가 존재하지 않음 |

---

## 7. 단지관리 운영점검 API

### 7.1 단지관리 운영점검 목록 조회

특정 단지의 단지관리 운영점검 항목 및 결과를 조회합니다.

- **URL**: `GET /api/complexes/{id}/complex-managements`
- **인증 필요**: 예
- **권한**: 해당 단지 접근 권한 보유자

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `id` | `String` | O | 단지 고유 ID |

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |

#### Response Body (성공)

```json
{
  "success": true,
  "data": [
    {
      "id": "CM-01",
      "category": "장비 현황",
      "item": "세대 단말기(월패드) 설치 현황 확인",
      "result": "양호",
      "note": "-"
    },
    {
      "id": "CM-05",
      "category": "네트워크",
      "item": "단지 내부망 통신 상태 점검",
      "result": "미흡",
      "note": "조치 필요"
    },
    {
      "id": "CM-08",
      "category": "보안 관리",
      "item": "보안 정책(룰셋) 최신 적용 여부",
      "result": "보완필요",
      "note": "보완 조치 필요"
    }
  ]
}
```

#### ComplexManagement 객체 필드 상세

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | `String` | 점검 항목 ID (예: `CM-01`) |
| `category` | `String` | 점검 분류 (`장비 현황`, `네트워크`, `보안 관리`, `운영 관리`, `시스템`) |
| `item` | `String` | 점검 항목명 |
| `result` | `String` | 점검 결과 (`양호`, `미흡`, `보완필요`) |
| `note` | `String` | 비고 |

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `200 OK` | 조회 성공 |
| `401 Unauthorized` | 인증 실패 |
| `403 Forbidden` | 접근 권한 없음 |
| `404 Not Found` | 해당 단지가 존재하지 않음 |

---

### 7.2 단지관리 운영점검 결과 일괄 수정

특정 단지의 단지관리 운영점검 결과를 일괄 수정합니다.

- **URL**: `PUT /api/complexes/{id}/complex-managements`
- **인증 필요**: 예
- **권한**: `Super Admin`, `System Engineer`, `Complex Manager`

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `id` | `String` | O | 단지 고유 ID |

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |
| `Content-Type` | `application/json` |

#### Request Body

```json
{
  "items": [
    {
      "id": "CM-05",
      "result": "양호",
      "note": "내부망 통신 정상 확인"
    },
    {
      "id": "CM-08",
      "result": "양호",
      "note": "최신 룰셋 적용 완료"
    }
  ]
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `items` | `Array` | O | 수정할 점검 항목 배열 |
| `items[].id` | `String` | O | 점검 항목 ID |
| `items[].result` | `String` | O | 변경할 점검 결과 (`양호`, `미흡`, `보완필요`) |
| `items[].note` | `String` | X | 비고 |

#### Response Body (성공)

```json
{
  "success": true,
  "data": {
    "updatedCount": 2
  },
  "message": "2건의 운영점검 결과가 수정되었습니다."
}
```

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `200 OK` | 수정 성공 |
| `400 Bad Request` | 유효하지 않은 항목 ID 또는 결과 값 |
| `401 Unauthorized` | 인증 실패 |
| `403 Forbidden` | 수정 권한 없음 |
| `404 Not Found` | 해당 단지가 존재하지 않음 |

---

## 8. 보고서 API

### 8.1 보고서 목록 조회

특정 단지의 보고서 목록을 조회합니다.

- **URL**: `GET /api/complexes/{id}/reports`
- **인증 필요**: 예
- **권한**: 해당 단지 접근 권한 보유자

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `id` | `String` | O | 단지 고유 ID |

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |

#### Query Parameters

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|--------|------|
| `search` | `String` | X | - | 보고서 제목 또는 작성자 검색 |
| `type` | `String` | X | - | 보고서 유형 필터 (`취약점 점검`, `안전 점검`, `단지 보고서`, `종합 보고서`) |
| `status` | `String` | X | - | 보고서 상태 필터 (`완료`, `점검중`, `대기`) |

#### Response Body (성공)

```json
{
  "success": true,
  "data": [
    {
      "id": "REP-AX-PRM-01-01",
      "date": "2026-02-28",
      "title": "디에이치 아너힐즈 취약점 점검 보고서 (1차)",
      "type": "취약점 점검",
      "author": "박신일",
      "size": "2.5 MB",
      "status": "완료"
    },
    {
      "id": "REP-AX-PRM-01-02",
      "date": "2026-02-15",
      "title": "디에이치 아너힐즈 안전 점검 보고서 (2차)",
      "type": "안전 점검",
      "author": "장정구",
      "size": "1.8 MB",
      "status": "점검중"
    }
  ]
}
```

#### Report 객체 필드 상세

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | `String` | 보고서 고유 ID (예: `REP-AX-PRM-01-01`) |
| `date` | `String` | 보고서 작성일 (`yyyy-MM-dd`) |
| `title` | `String` | 보고서 제목 |
| `type` | `String` | 보고서 유형 (`취약점 점검`, `안전 점검`, `단지 보고서`, `종합 보고서`) |
| `author` | `String` | 작성자 |
| `size` | `String` | 파일 크기 |
| `status` | `String` | 상태 (`완료`, `점검중`, `대기`) |

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `200 OK` | 조회 성공 |
| `401 Unauthorized` | 인증 실패 |
| `403 Forbidden` | 접근 권한 없음 |
| `404 Not Found` | 해당 단지가 존재하지 않음 |

---

### 8.2 보고서 생성

특정 단지에 대한 신규 보고서를 생성합니다.

- **URL**: `POST /api/complexes/{id}/reports`
- **인증 필요**: 예
- **권한**: `Super Admin`, `System Engineer`, `Complex Manager`

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `id` | `String` | O | 단지 고유 ID |

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |
| `Content-Type` | `application/json` |

#### Request Body

```json
{
  "title": "디에이치 아너힐즈 종합 보고서 (3차)",
  "type": "종합 보고서",
  "author": "박신일"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `title` | `String` | O | 보고서 제목 |
| `type` | `String` | O | 보고서 유형 (`취약점 점검`, `안전 점검`, `단지 보고서`, `종합 보고서`) |
| `author` | `String` | X | 작성자 (미입력 시 현재 로그인 사용자) |

#### Response Body (성공)

```json
{
  "success": true,
  "data": {
    "id": "REP-AX-PRM-01-03",
    "date": "2026-03-09",
    "title": "디에이치 아너힐즈 종합 보고서 (3차)",
    "type": "종합 보고서",
    "author": "박신일",
    "size": "0.0 MB",
    "status": "대기"
  },
  "message": "보고서가 생성되었습니다."
}
```

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `201 Created` | 보고서 생성 성공 |
| `400 Bad Request` | 필수 필드 누락 |
| `401 Unauthorized` | 인증 실패 |
| `403 Forbidden` | 생성 권한 없음 |
| `404 Not Found` | 해당 단지가 존재하지 않음 |

---

### 8.3 보고서 상태 변경

보고서의 상태를 변경합니다.

- **URL**: `PATCH /api/complexes/{id}/reports/{reportId}`
- **인증 필요**: 예
- **권한**: `Super Admin`, `System Engineer`

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `id` | `String` | O | 단지 고유 ID |
| `reportId` | `String` | O | 보고서 고유 ID |

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |
| `Content-Type` | `application/json` |

#### Request Body

```json
{
  "status": "완료"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `status` | `String` | O | 변경할 상태 (`완료`, `점검중`, `대기`) |

#### Response Body (성공)

```json
{
  "success": true,
  "data": {
    "id": "REP-AX-PRM-01-02",
    "status": "완료"
  },
  "message": "보고서 상태가 변경되었습니다."
}
```

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `200 OK` | 상태 변경 성공 |
| `400 Bad Request` | 유효하지 않은 상태 값 |
| `401 Unauthorized` | 인증 실패 |
| `403 Forbidden` | 변경 권한 없음 |
| `404 Not Found` | 해당 보고서가 존재하지 않음 |

---

### 8.4 보고서 삭제

보고서를 삭제합니다.

- **URL**: `DELETE /api/complexes/{id}/reports/{reportId}`
- **인증 필요**: 예
- **권한**: `Super Admin`

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `id` | `String` | O | 단지 고유 ID |
| `reportId` | `String` | O | 보고서 고유 ID |

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |

#### Response Body (성공)

```json
{
  "success": true,
  "data": null,
  "message": "보고서가 삭제되었습니다."
}
```

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `200 OK` | 삭제 성공 |
| `401 Unauthorized` | 인증 실패 |
| `403 Forbidden` | 삭제 권한 없음 |
| `404 Not Found` | 해당 보고서가 존재하지 않음 |

---

### 8.5 보고서 PDF 다운로드

보고서를 PDF 형식으로 다운로드합니다.

- **URL**: `GET /api/complexes/{id}/reports/{reportId}/download`
- **인증 필요**: 예
- **권한**: 해당 단지 접근 권한 보유자

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `id` | `String` | O | 단지 고유 ID |
| `reportId` | `String` | O | 보고서 고유 ID |

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |

#### Response

- **Content-Type**: `application/pdf`
- **Content-Disposition**: `attachment; filename="보고서명.pdf"`
- **Body**: PDF 바이너리 데이터

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `200 OK` | 다운로드 성공 |
| `401 Unauthorized` | 인증 실패 |
| `403 Forbidden` | 접근 권한 없음 |
| `404 Not Found` | 해당 보고서가 존재하지 않음 |

---

## 9. 계정 관리 API

### 9.1 계정 목록 조회

등록된 전체 계정 목록을 조회합니다.

- **URL**: `GET /api/accounts`
- **인증 필요**: 예
- **권한**: `Super Admin`

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |

#### Query Parameters

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|--------|------|
| `search` | `String` | X | - | 이름, ID, 권한 통합 검색 |

#### Response Body (성공)

```json
{
  "success": true,
  "data": [
    {
      "id": "admin",
      "name": "최고관리자",
      "role": "Super Admin",
      "status": "활성",
      "lastLogin": "2026-02-21 09:00",
      "target": "전체 시스템 권한"
    },
    {
      "id": "jang_jg",
      "name": "장정구",
      "role": "System Engineer",
      "status": "활성",
      "lastLogin": "2026-02-20 14:30",
      "target": "전체 단지 유지보수"
    },
    {
      "id": "park_si",
      "name": "박신일",
      "role": "Complex Manager",
      "status": "활성",
      "lastLogin": "2026-02-21 08:45",
      "target": "디에이치 아너힐즈, 올림픽파크 포레온"
    },
    {
      "id": "lee_yh",
      "name": "이영희",
      "role": "Viewer",
      "status": "비활성",
      "lastLogin": "2026-01-15 11:20",
      "target": "반포 자이 (읽기 전용)"
    }
  ]
}
```

#### Account 객체 필드 상세

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | `String` | 로그인 ID |
| `name` | `String` | 사용자 이름 |
| `role` | `String` | 권한 등급 (`Super Admin`, `System Engineer`, `Complex Manager`, `Viewer`) |
| `status` | `String` | 계정 상태 (`활성`, `비활성`) |
| `lastLogin` | `String` | 최근 접속 일시 (`yyyy-MM-dd HH:mm` 또는 `최초 로그인 전`) |
| `target` | `String` | 담당 단지 및 접근 허용 범위 |

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `200 OK` | 조회 성공 |
| `401 Unauthorized` | 인증 실패 |
| `403 Forbidden` | 관리자 권한 없음 |

---

### 9.2 신규 계정 생성

신규 계정을 생성합니다.

- **URL**: `POST /api/accounts`
- **인증 필요**: 예
- **권한**: `Super Admin`

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |
| `Content-Type` | `application/json` |

#### Request Body

```json
{
  "id": "hong_gd",
  "name": "홍길동",
  "password": "Axgate2026!",
  "role": "Complex Manager",
  "status": "활성",
  "target": "AX-PRM-01, AX-PRM-02"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | `String` | O | 로그인 ID (영문, 숫자, 언더스코어 조합) |
| `name` | `String` | O | 사용자 이름 |
| `password` | `String` | O | 초기 비밀번호 |
| `role` | `String` | O | 권한 등급 |
| `status` | `String` | X | 계정 상태 (기본값: `활성`) |
| `target` | `String` | X | 담당 단지 범위 (Complex Manager 시 필수) |

#### Response Body (성공)

```json
{
  "success": true,
  "data": {
    "id": "hong_gd",
    "name": "홍길동",
    "role": "Complex Manager",
    "status": "활성",
    "lastLogin": "최초 로그인 전",
    "target": "AX-PRM-01, AX-PRM-02"
  },
  "message": "신규 계정이 생성되었습니다."
}
```

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `201 Created` | 계정 생성 성공 |
| `400 Bad Request` | 필수 필드 누락 또는 비밀번호 정책 불충족 |
| `401 Unauthorized` | 인증 실패 |
| `403 Forbidden` | 관리자 권한 없음 |
| `409 Conflict` | 동일한 ID가 이미 존재함 |

---

### 9.3 계정 정보 수정

기존 계정의 정보를 수정합니다.

- **URL**: `PUT /api/accounts/{id}`
- **인증 필요**: 예
- **권한**: `Super Admin`

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `id` | `String` | O | 수정 대상 계정 ID |

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |
| `Content-Type` | `application/json` |

#### Request Body

변경할 필드만 포함하여 전송합니다. `password`는 변경 시에만 포함합니다.

```json
{
  "name": "홍길동",
  "password": "NewPassword2026!",
  "role": "System Engineer",
  "status": "활성",
  "target": "전체 단지 유지보수"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `name` | `String` | X | 사용자 이름 |
| `password` | `String` | X | 새 비밀번호 (변경 시에만 입력) |
| `role` | `String` | X | 권한 등급 |
| `status` | `String` | X | 계정 상태 |
| `target` | `String` | X | 담당 단지 범위 |

#### Response Body (성공)

```json
{
  "success": true,
  "data": {
    "id": "hong_gd",
    "name": "홍길동",
    "role": "System Engineer",
    "status": "활성",
    "lastLogin": "최초 로그인 전",
    "target": "전체 단지 유지보수"
  },
  "message": "계정 권한이 수정되었습니다."
}
```

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `200 OK` | 수정 성공 |
| `400 Bad Request` | 유효하지 않은 필드 값 |
| `401 Unauthorized` | 인증 실패 |
| `403 Forbidden` | 관리자 권한 없음 |
| `404 Not Found` | 해당 계정이 존재하지 않음 |

---

### 9.4 계정 삭제

계정을 삭제합니다.

- **URL**: `DELETE /api/accounts/{id}`
- **인증 필요**: 예
- **권한**: `Super Admin`

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `id` | `String` | O | 삭제 대상 계정 ID |

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |

#### Response Body (성공)

```json
{
  "success": true,
  "data": null,
  "message": "계정이 삭제되었습니다."
}
```

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `200 OK` | 삭제 성공 |
| `401 Unauthorized` | 인증 실패 |
| `403 Forbidden` | 관리자 권한 없음 |
| `404 Not Found` | 해당 계정이 존재하지 않음 |
| `409 Conflict` | 자기 자신의 계정은 삭제 불가 |

---

## 10. 공지사항 API

### 10.1 공지사항 목록 조회

시스템 공지사항 목록을 조회합니다.

- **URL**: `GET /api/notices`
- **인증 필요**: 예
- **권한**: 모든 역할

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |

#### Query Parameters

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|--------|------|
| `page` | `Integer` | X | `0` | 페이지 번호 |
| `size` | `Integer` | X | `20` | 페이지당 항목 수 |

#### Response Body (성공)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "[긴급] 외부 위협 IP 차단 업데이트",
      "date": "2026-02-21",
      "type": "urgent",
      "content": "최신 위협 인텔리전스 기반 블랙리스트가 갱신되었습니다. 즉시 적용 바랍니다."
    },
    {
      "id": 2,
      "title": "정기 시스템 점검 안내 (23:00)",
      "date": "2026-02-20",
      "type": "notice",
      "content": "안정성 확보를 위한 코어 서버 리부팅이 예정되어 있습니다."
    },
    {
      "id": 3,
      "title": "AXGATE-50LQ 펌웨어 v2.5.0 릴리즈",
      "date": "2026-02-19",
      "type": "update",
      "content": "암호화 성능 30% 향상 및 UI 버그 수정."
    }
  ]
}
```

#### Notice 객체 필드 상세

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | `Integer` | 공지사항 고유 ID |
| `title` | `String` | 공지 제목 |
| `date` | `String` | 작성일 (`yyyy-MM-dd`) |
| `type` | `String` | 유형 (`urgent`: 긴급, `notice`: 일반 공지, `update`: 업데이트) |
| `content` | `String` | 공지 내용 |

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `200 OK` | 조회 성공 |
| `401 Unauthorized` | 인증 실패 |

---

### 10.2 공지사항 등록

새로운 공지사항을 등록합니다.

- **URL**: `POST /api/notices`
- **인증 필요**: 예
- **권한**: `Super Admin`

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |
| `Content-Type` | `application/json` |

#### Request Body

```json
{
  "title": "[공지] 3월 정기 점검 안내",
  "type": "notice",
  "content": "2026년 3월 15일 23:00 ~ 03:00 시스템 정기 점검이 예정되어 있습니다."
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `title` | `String` | O | 공지 제목 |
| `type` | `String` | O | 유형 (`urgent`, `notice`, `update`) |
| `content` | `String` | O | 공지 내용 |

#### Response Body (성공)

```json
{
  "success": true,
  "data": {
    "id": 4,
    "title": "[공지] 3월 정기 점검 안내",
    "date": "2026-03-09",
    "type": "notice",
    "content": "2026년 3월 15일 23:00 ~ 03:00 시스템 정기 점검이 예정되어 있습니다."
  },
  "message": "공지사항이 등록되었습니다."
}
```

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `201 Created` | 등록 성공 |
| `400 Bad Request` | 필수 필드 누락 |
| `401 Unauthorized` | 인증 실패 |
| `403 Forbidden` | 관리자 권한 없음 |

---

## 11. 문의 API

### 11.1 문의 목록 조회

문의 내역 목록을 조회합니다.

- **URL**: `GET /api/inquiries`
- **인증 필요**: 예
- **권한**: 모든 역할 (일반 사용자는 본인 문의만 조회, 관리자는 전체 조회)

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |

#### Query Parameters

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|--------|------|
| `status` | `String` | X | - | 상태 필터 (`대기중`, `처리완료`) |
| `type` | `String` | X | - | 문의 유형 필터 (`장애`, `지원`) |
| `page` | `Integer` | X | `0` | 페이지 번호 |
| `size` | `Integer` | X | `20` | 페이지당 항목 수 |

#### Response Body (성공)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user": "101동 101호 관리자",
      "type": "장애",
      "content": "VPN 터널링이 간헐적으로 끊어지는 현상이 발생합니다. 로그 확인 부탁드립니다.",
      "date": "2026-02-21 14:30",
      "status": "대기중",
      "answer": null,
      "answeredAt": null
    },
    {
      "id": 2,
      "user": "단지 통합 관리소장",
      "type": "지원",
      "content": "월간 리포트 자동 발송 수신처를 하나 더 추가하고 싶습니다. 방법 안내 바랍니다.",
      "date": "2026-02-20 09:15",
      "status": "처리완료",
      "answer": "관리자 설정 > 리포트 발송 메뉴에서 수신처 추가가 가능합니다.",
      "answeredAt": "2026-02-20 11:30"
    }
  ]
}
```

#### Inquiry 객체 필드 상세

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | `Integer` | 문의 고유 ID |
| `user` | `String` | 문의자 (사용자명 또는 위치 정보) |
| `type` | `String` | 문의 유형 (`장애`, `지원`) |
| `content` | `String` | 문의 내용 |
| `date` | `String` | 문의 등록 일시 (`yyyy-MM-dd HH:mm`) |
| `status` | `String` | 처리 상태 (`대기중`, `처리완료`) |
| `answer` | `String` | 답변 내용 (미답변 시 `null`) |
| `answeredAt` | `String` | 답변 일시 (미답변 시 `null`) |

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `200 OK` | 조회 성공 |
| `401 Unauthorized` | 인증 실패 |

---

### 11.2 문의 등록

새로운 문의를 등록합니다.

- **URL**: `POST /api/inquiries`
- **인증 필요**: 예
- **권한**: 모든 역할

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |
| `Content-Type` | `application/json` |

#### Request Body

```json
{
  "type": "장애",
  "content": "102동 네트워크 장비 LED 점멸 현상이 발생합니다. 확인 바랍니다."
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `type` | `String` | O | 문의 유형 (`장애`, `지원`) |
| `content` | `String` | O | 문의 내용 |

#### Response Body (성공)

```json
{
  "success": true,
  "data": {
    "id": 4,
    "user": "박신일",
    "type": "장애",
    "content": "102동 네트워크 장비 LED 점멸 현상이 발생합니다. 확인 바랍니다.",
    "date": "2026-03-09 10:30",
    "status": "대기중",
    "answer": null,
    "answeredAt": null
  },
  "message": "문의가 등록되었습니다."
}
```

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `201 Created` | 등록 성공 |
| `400 Bad Request` | 필수 필드 누락 |
| `401 Unauthorized` | 인증 실패 |

---

### 11.3 문의 답변 (상태 변경)

문의에 대한 답변을 등록하고 상태를 변경합니다.

- **URL**: `PUT /api/inquiries/{id}`
- **인증 필요**: 예
- **권한**: `Super Admin`, `System Engineer`

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `id` | `Integer` | O | 문의 고유 ID |

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |
| `Content-Type` | `application/json` |

#### Request Body

```json
{
  "answer": "해당 장비 현장 점검 결과, 포트 접촉 불량으로 확인되어 조치 완료하였습니다.",
  "status": "처리완료"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `answer` | `String` | O | 답변 내용 |
| `status` | `String` | O | 변경할 상태 (`처리완료`) |

#### Response Body (성공)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "user": "101동 101호 관리자",
    "type": "장애",
    "content": "VPN 터널링이 간헐적으로 끊어지는 현상이 발생합니다. 로그 확인 부탁드립니다.",
    "date": "2026-02-21 14:30",
    "status": "처리완료",
    "answer": "해당 장비 현장 점검 결과, 포트 접촉 불량으로 확인되어 조치 완료하였습니다.",
    "answeredAt": "2026-03-09 10:35"
  },
  "message": "답변이 등록되었습니다."
}
```

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `200 OK` | 답변 등록 성공 |
| `400 Bad Request` | 필수 필드 누락 |
| `401 Unauthorized` | 인증 실패 |
| `403 Forbidden` | 답변 권한 없음 |
| `404 Not Found` | 해당 문의가 존재하지 않음 |

---

## 12. 시스템 로그 API

### 12.1 시스템 로그 조회

시스템 통합 로그를 조회합니다.

- **URL**: `GET /api/logs`
- **인증 필요**: 예
- **권한**: `Super Admin`, `System Engineer`

#### Request Headers

| 헤더 | 값 |
|------|-----|
| `Authorization` | `Bearer {token}` |

#### Query Parameters

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|--------|------|
| `level` | `String` | X | `ALL` | 로그 레벨 필터 (`ALL`, `INFO`, `WARN`, `CRITICAL`) |
| `source` | `String` | X | - | 발생 위치 필터 (`관문 방화벽`, `단지서버`, `시스템`, `백본 스위치`, `방화벽`, `망분리 장비`) |
| `search` | `String` | X | - | 메시지 또는 발생 위치 검색 |
| `startDate` | `String` | X | - | 검색 시작일 (`yyyy-MM-dd`) |
| `endDate` | `String` | X | - | 검색 종료일 (`yyyy-MM-dd`) |
| `page` | `Integer` | X | `0` | 페이지 번호 |
| `size` | `Integer` | X | `50` | 페이지당 항목 수 |

#### Response Body (성공)

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "time": "10:42:05",
        "level": "CRITICAL",
        "source": "관문 방화벽",
        "message": "외부 IP(211.x.x.x)로부터 비정상 접근 시도 차단"
      },
      {
        "id": 2,
        "time": "10:41:12",
        "level": "WARN",
        "source": "단지서버",
        "message": "FTP 포트(21) 활성화 상태 감지 (SV-28 위반)"
      },
      {
        "id": 3,
        "time": "10:40:00",
        "level": "INFO",
        "source": "시스템",
        "message": "관리자(박신일) 로그인 완료"
      },
      {
        "id": 4,
        "time": "10:35:22",
        "level": "INFO",
        "source": "백본 스위치",
        "message": "포트 24 (Uplink) 연결 상태 정상"
      }
    ],
    "page": 0,
    "size": 50,
    "totalElements": 8,
    "totalPages": 1
  }
}
```

#### Log 객체 필드 상세

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | `Integer` | 로그 고유 ID |
| `time` | `String` | 발생 시각 (`HH:mm:ss`) |
| `level` | `String` | 로그 레벨 (`INFO`, `WARN`, `CRITICAL`) |
| `source` | `String` | 발생 위치 (장비/시스템명) |
| `message` | `String` | 로그 메시지 |

#### 응답 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| `200 OK` | 조회 성공 |
| `401 Unauthorized` | 인증 실패 |
| `403 Forbidden` | 로그 조회 권한 없음 |

---

## 부록

### A. 전체 API 엔드포인트 요약

| 메서드 | URL | 설명 | 권한 |
|--------|-----|------|------|
| `POST` | `/api/auth/login` | 로그인 | 전체 |
| `POST` | `/api/auth/logout` | 로그아웃 | 인증 필요 |
| `GET` | `/api/complexes` | 단지 목록 조회 | 모든 역할 |
| `GET` | `/api/complexes/{id}` | 단지 상세 조회 | 단지 접근 권한 |
| `POST` | `/api/complexes` | 단지 등록 | Admin, Engineer |
| `PUT` | `/api/complexes/{id}` | 단지 수정 | Admin, Engineer |
| `DELETE` | `/api/complexes/{id}` | 단지 삭제 | Admin |
| `DELETE` | `/api/complexes` | 단지 복수 삭제 | Admin |
| `POST` | `/api/complexes/bulk-upload` | 단지 CSV 일괄 등록 | Admin, Engineer |
| `GET` | `/api/complexes/{id}/vulnerability-checks` | 취약점 점검 조회 | 단지 접근 권한 |
| `PUT` | `/api/complexes/{id}/vulnerability-checks` | 취약점 점검 수정 | Admin, Engineer, Manager |
| `GET` | `/api/complexes/{id}/safety-inspections` | 안전점검 조회 | 단지 접근 권한 |
| `PUT` | `/api/complexes/{id}/safety-inspections` | 안전점검 수정 | Admin, Engineer, Manager |
| `GET` | `/api/complexes/{id}/complex-managements` | 운영점검 조회 | 단지 접근 권한 |
| `PUT` | `/api/complexes/{id}/complex-managements` | 운영점검 수정 | Admin, Engineer, Manager |
| `GET` | `/api/complexes/{id}/reports` | 보고서 조회 | 단지 접근 권한 |
| `POST` | `/api/complexes/{id}/reports` | 보고서 생성 | Admin, Engineer, Manager |
| `PATCH` | `/api/complexes/{id}/reports/{reportId}` | 보고서 상태 변경 | Admin, Engineer |
| `DELETE` | `/api/complexes/{id}/reports/{reportId}` | 보고서 삭제 | Admin |
| `GET` | `/api/complexes/{id}/reports/{reportId}/download` | 보고서 다운로드 | 단지 접근 권한 |
| `GET` | `/api/accounts` | 계정 목록 조회 | Admin |
| `POST` | `/api/accounts` | 계정 생성 | Admin |
| `PUT` | `/api/accounts/{id}` | 계정 수정 | Admin |
| `DELETE` | `/api/accounts/{id}` | 계정 삭제 | Admin |
| `GET` | `/api/notices` | 공지사항 조회 | 모든 역할 |
| `POST` | `/api/notices` | 공지사항 등록 | Admin |
| `GET` | `/api/inquiries` | 문의 목록 조회 | 모든 역할 |
| `POST` | `/api/inquiries` | 문의 등록 | 모든 역할 |
| `PUT` | `/api/inquiries/{id}` | 문의 답변 | Admin, Engineer |
| `GET` | `/api/logs` | 시스템 로그 조회 | Admin, Engineer |

### B. 점검 결과 값 참조

| 점검 유형 | 가능한 결과 값 |
|----------|--------------|
| 취약점 점검 (Vulnerability) | `양호`, `취약`, `수동점검` |
| 안전점검 (Safety Inspection) | `양호`, `불량`, `해당없음` |
| 운영점검 (Complex Management) | `양호`, `미흡`, `보완필요` |

### C. 보고서 유형 참조

| 유형 | 설명 |
|------|------|
| `취약점 점검` | 서버/네트워크 취약점 점검 보고서 |
| `안전 점검` | 물리적 안전점검 보고서 |
| `단지 보고서` | 단지 운영 현황 보고서 |
| `종합 보고서` | 전체 종합 보고서 |

---

> **문서 끝**
> 본 API 명세서에 대한 문의 사항은 개발팀 Slack 채널 또는 내부 이슈 트래커를 통해 접수해 주시기 바랍니다.
