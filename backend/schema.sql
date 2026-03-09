-- ============================================================
-- AXGATE SaferHome 데이터베이스 스키마
-- 데이터베이스: axgate_saferhome
-- 문자셋: UTF8MB4 (한국어 지원)
-- 대상 DBMS: MariaDB
-- ============================================================

CREATE DATABASE IF NOT EXISTS axgate_saferhome
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE axgate_saferhome;

-- ============================================================
-- 1. 단지 (complex) 테이블
-- ============================================================
CREATE TABLE IF NOT EXISTS complex (
  id                VARCHAR(20)   PRIMARY KEY              COMMENT '단지 ID (예: AX-PRM-01)',
  name              VARCHAR(100)  NOT NULL                 COMMENT '단지명',
  region            VARCHAR(50)                            COMMENT '지역',
  builder           VARCHAR(50)                            COMMENT '시공사',
  homenet           VARCHAR(50)                            COMMENT '홈네트워크 업체',
  status            VARCHAR(20)   DEFAULT '정상'           COMMENT '상태 (정상/오프라인/점검중)',
  address           VARCHAR(200)                           COMMENT '주소',
  manager           VARCHAR(50)                            COMMENT '관리소장',
  contact           VARCHAR(20)                            COMMENT '연락처',
  report            VARCHAR(20)   DEFAULT '미발급'         COMMENT '보고서 발급 상태',
  reg_date          DATE                                   COMMENT '등록일',
  registrant        VARCHAR(50)                            COMMENT '등록자',
  builder_manager   VARCHAR(50)                            COMMENT '시공사 담당자',
  builder_contact   VARCHAR(20)                            COMMENT '시공사 연락처',
  homenet_manager   VARCHAR(50)                            COMMENT '홈네트워크 담당자',
  homenet_contact   VARCHAR(20)                            COMMENT '홈네트워크 연락처',
  dong_count        INT           DEFAULT 10               COMMENT '동 수',
  dong_start_num    INT           DEFAULT 101              COMMENT '시작 동 번호',
  floor_count       INT           DEFAULT 20               COMMENT '층 수',
  units_per_floor   INT           DEFAULT 2                COMMENT '층당 세대 수',
  device_registered BOOLEAN       DEFAULT FALSE            COMMENT '장비 등록 여부',
  created_at        DATETIME      DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  updated_at        DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='단지 정보';

-- ============================================================
-- 2. 취약점 점검 (vulnerability_check) 테이블
-- ============================================================
CREATE TABLE IF NOT EXISTS vulnerability_check (
  id          BIGINT        AUTO_INCREMENT PRIMARY KEY     COMMENT '고유 ID',
  complex_id  VARCHAR(20)   NOT NULL                       COMMENT '단지 ID (FK)',
  check_id    VARCHAR(10)                                  COMMENT '점검 항목 ID (예: SV-01)',
  category    VARCHAR(50)                                  COMMENT '카테고리',
  item        VARCHAR(200)                                 COMMENT '점검 항목',
  result      VARCHAR(20)                                  COMMENT '결과 (양호/취약/수동점검)',
  note        VARCHAR(200)                                 COMMENT '비고',

  INDEX idx_vuln_complex_id (complex_id),
  INDEX idx_vuln_check_id (check_id),
  CONSTRAINT fk_vuln_complex FOREIGN KEY (complex_id) REFERENCES complex(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='취약점 점검 항목';

-- ============================================================
-- 3. 안전점검 (safety_inspection) 테이블
-- ============================================================
CREATE TABLE IF NOT EXISTS safety_inspection (
  id          BIGINT        AUTO_INCREMENT PRIMARY KEY     COMMENT '고유 ID',
  complex_id  VARCHAR(20)   NOT NULL                       COMMENT '단지 ID (FK)',
  check_id    VARCHAR(10)                                  COMMENT '점검 항목 ID (예: SI-0)',
  category    VARCHAR(50)                                  COMMENT '카테고리',
  item        VARCHAR(200)                                 COMMENT '점검 항목',
  cycle_rec   VARCHAR(20)                                  COMMENT '권장 점검 주기',
  cycle_man   VARCHAR(20)                                  COMMENT '관리 점검 주기',
  result      VARCHAR(20)                                  COMMENT '결과 (양호/불량/해당없음)',

  INDEX idx_safety_complex_id (complex_id),
  CONSTRAINT fk_safety_complex FOREIGN KEY (complex_id) REFERENCES complex(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='안전점검 항목';

-- ============================================================
-- 4. 단지관리 운영점검 (complex_management) 테이블
-- ============================================================
CREATE TABLE IF NOT EXISTS complex_management (
  id          BIGINT        AUTO_INCREMENT PRIMARY KEY     COMMENT '고유 ID',
  complex_id  VARCHAR(20)   NOT NULL                       COMMENT '단지 ID (FK)',
  check_id    VARCHAR(10)                                  COMMENT '점검 항목 ID (예: CM-01)',
  category    VARCHAR(50)                                  COMMENT '카테고리',
  item        VARCHAR(200)                                 COMMENT '점검 항목',
  result      VARCHAR(20)                                  COMMENT '결과 (양호/미흡/보완필요)',
  note        VARCHAR(200)                                 COMMENT '비고',

  INDEX idx_cmgmt_complex_id (complex_id),
  CONSTRAINT fk_cmgmt_complex FOREIGN KEY (complex_id) REFERENCES complex(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='단지관리 운영점검 항목';

-- ============================================================
-- 5. 보고서 (report) 테이블
-- ============================================================
CREATE TABLE IF NOT EXISTS report (
  id          VARCHAR(30)   PRIMARY KEY                    COMMENT '보고서 ID (예: REP-AX-PRM-01-01)',
  complex_id  VARCHAR(20)   NOT NULL                       COMMENT '단지 ID (FK)',
  date        DATE                                         COMMENT '보고서 일자',
  title       VARCHAR(200)                                 COMMENT '보고서 제목',
  type        VARCHAR(50)                                  COMMENT '유형 (취약점 점검/안전 점검/단지 보고서/종합 보고서)',
  author      VARCHAR(50)                                  COMMENT '작성자',
  size        VARCHAR(20)                                  COMMENT '파일 크기',
  status      VARCHAR(20)                                  COMMENT '상태 (완료/점검중/대기)',
  created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP     COMMENT '생성일시',

  INDEX idx_report_complex_id (complex_id),
  INDEX idx_report_date (date),
  CONSTRAINT fk_report_complex FOREIGN KEY (complex_id) REFERENCES complex(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='보고서';

-- ============================================================
-- 6. 계정 (account) 테이블
-- ============================================================
CREATE TABLE IF NOT EXISTS account (
  id          BIGINT        AUTO_INCREMENT PRIMARY KEY     COMMENT '고유 ID',
  username    VARCHAR(50)   NOT NULL UNIQUE                COMMENT '로그인 ID',
  password    VARCHAR(255)  NOT NULL                       COMMENT '비밀번호 (BCrypt 해시)',
  name        VARCHAR(50)                                  COMMENT '이름',
  role        VARCHAR(30)                                  COMMENT '역할 (최고관리자/System Engineer/Complex Manager/Viewer)',
  complex     VARCHAR(100)                                 COMMENT '담당 단지',
  status      VARCHAR(20)   DEFAULT '활성'                 COMMENT '상태 (활성/비활성)',
  email       VARCHAR(100)                                 COMMENT '이메일',
  last_login  DATETIME                                     COMMENT '마지막 로그인',
  created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP     COMMENT '생성일시',

  INDEX idx_account_username (username),
  INDEX idx_account_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='계정 관리';

-- ============================================================
-- 7. 공지사항 (notice) 테이블
-- ============================================================
CREATE TABLE IF NOT EXISTS notice (
  id          BIGINT        AUTO_INCREMENT PRIMARY KEY     COMMENT '고유 ID',
  title       VARCHAR(200)                                 COMMENT '제목',
  content     TEXT                                         COMMENT '내용',
  type        VARCHAR(20)                                  COMMENT '유형 (urgent/notice/update)',
  author      VARCHAR(50)                                  COMMENT '작성자',
  created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP     COMMENT '생성일시',

  INDEX idx_notice_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='공지사항';

-- ============================================================
-- 8. 문의 (inquiry) 테이블
-- ============================================================
CREATE TABLE IF NOT EXISTS inquiry (
  id          BIGINT        AUTO_INCREMENT PRIMARY KEY     COMMENT '고유 ID',
  title       VARCHAR(200)                                 COMMENT '제목',
  content     TEXT                                         COMMENT '내용',
  author      VARCHAR(50)                                  COMMENT '작성자',
  status      VARCHAR(20)   DEFAULT '대기'                 COMMENT '상태 (대기/대기중/처리완료)',
  answer      TEXT                                         COMMENT '답변',
  created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP     COMMENT '생성일시',

  INDEX idx_inquiry_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='문의';

-- ============================================================
-- 9. 시스템 로그 (system_log) 테이블
-- ============================================================
CREATE TABLE IF NOT EXISTS system_log (
  id          BIGINT        AUTO_INCREMENT PRIMARY KEY     COMMENT '고유 ID',
  time        VARCHAR(20)                                  COMMENT '시간',
  level       VARCHAR(20)                                  COMMENT '로그 레벨 (CRITICAL/WARN/INFO)',
  source      VARCHAR(50)                                  COMMENT '출처',
  message     VARCHAR(500)                                 COMMENT '메시지',
  created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP     COMMENT '생성일시',

  INDEX idx_log_level (level),
  INDEX idx_log_time (time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='시스템 로그';


-- ============================================================
-- 시드 데이터 (Seed Data)
-- ============================================================

-- ------------------------------------------------------------
-- 단지 데이터 (8개 단지)
-- ------------------------------------------------------------
INSERT INTO complex (id, name, region, builder, homenet, status, address, manager, contact, report, reg_date, registrant, builder_manager, builder_contact, homenet_manager, homenet_contact, dong_count, dong_start_num, floor_count, units_per_floor, device_registered) VALUES
('AX-PRM-01', '디에이치 아너힐즈', '서울 강남구', '현대건설', '현대HT', '정상', '서울특별시 강남구 개포로 310', '박신일 소장', '010-1234-5678', '발급', '2024-01-15', '시스템', '김현대 과장', '010-1111-2222', '이현대 대리', '010-3333-4444', 10, 101, 20, 2, TRUE),
('AX-PRM-02', '래미안 원베일리', '서울 서초구', '삼성물산', '삼성SDS', '정상', '서울특별시 서초구 반포대로 300', '김철수 소장', '010-2345-6789', '발급', '2024-01-18', '박신일', '박삼성 책임', '010-2222-3333', '최에스 프로', '010-4444-5555', 8, 101, 25, 4, TRUE),
('AX-PRM-03', '반포 자이', '서울 서초구', 'GS건설', '이지스', '정상', '서울특별시 서초구 신반포로 270', '이영희 소장', '010-3456-7890', '발급', '2024-03-12', '장정구', '정지에스 차장', '010-3333-4444', '강이지 주임', '010-5555-6666', 12, 101, 15, 3, TRUE),
('AX-PRM-04', '올림픽파크 포레온', '서울 강동구', '현대건설', '현대HT', '정상', '서울특별시 강동구 양재대로 1218', '정민수 소장', '010-4567-8901', '발급', '2024-05-15', '박신일', '김현대 과장', '010-1111-2222', '이현대 대리', '010-3333-4444', 15, 101, 30, 4, TRUE),
('AX-PRM-05', '마포 래미안 푸르지오', '서울 마포구', '대우건설', '코콤', '오프라인', '서울특별시 마포구 마포대로 195', '최은지 소장', '010-5678-9012', '미발급', '2024-06-05', '장정구', '윤대우 대리', '010-4444-5555', '임코콤 과장', '010-6666-7777', 6, 101, 18, 2, TRUE),
('AX-PRM-06', '송파 헬리오시티', '서울 송파구', 'DL이앤씨', '코맥스', '정상', '서울특별시 송파구 송파대로 345', '강동훈 소장', '010-6789-0123', '발급', '2024-07-12', '시스템', '조디엘 차장', '010-5555-6666', '송코맥 대리', '010-7777-8888', 20, 101, 25, 4, TRUE),
('AX-PRM-07', '해운대 엘시티 더샵', '부산 해운대구', '포스코이앤씨', '포스코DX', '정상', '부산광역시 해운대구 달맞이길 30', '윤서연 소장', '010-7890-1234', '발급', '2024-08-20', '박신일', '한포스 과장', '010-6666-7777', '백디엑 사원', '010-8888-9999', 5, 101, 45, 6, TRUE),
('AX-PRM-08', '힐스테이트 송도 더스카이', '인천 연수구', '현대건설', '현대HT', '점검중', '인천광역시 연수구 인천타워대로 396', '임도현 소장', '010-8901-2345', '미발급', '2024-09-01', '장정구', '김현대 과장', '010-1111-2222', '이현대 대리', '010-3333-4444', 7, 101, 35, 3, TRUE);

-- ------------------------------------------------------------
-- 취약점 점검 데이터 (AX-PRM-01 - 20개 항목)
-- ------------------------------------------------------------
INSERT INTO vulnerability_check (complex_id, check_id, category, item, result, note) VALUES
('AX-PRM-01', 'SV-01', '계정 관리', '불필요한 계정 비활성화', '양호', '-'),
('AX-PRM-01', 'SV-02', '계정 관리', '사용 목적별 계정 분리', '양호', '-'),
('AX-PRM-01', 'SV-03', '계정 관리', 'Root 등 계정의 동일한 UID 사용금지', '양호', '-'),
('AX-PRM-01', 'SV-04', '계정 관리', '관리자그룹의 최소한 계정 포함', '수동점검', '확인 필요'),
('AX-PRM-01', 'SV-08', '권한 관리', 'Root 홈, 패스 디렉토리 권한 및 패스 설정', '양호', '-'),
('AX-PRM-01', 'SV-09', '권한 관리', '홈디렉토리 소유자 및 권한 설정', '양호', '-'),
('AX-PRM-01', 'SV-10', '권한 관리', '사용자, 시스템 환경 파일 소유자 및 권한 설정', '양호', '-'),
('AX-PRM-01', 'SV-11', '파일 관리', '파일 및 디렉토리 소유자 설정', '수동점검', '-'),
('AX-PRM-01', 'SV-16', '파일 관리', '/etc/hosts 파일 소유자 및 권한 설정', '취약', '권한 600 설정 요망'),
('AX-PRM-01', 'SV-17', '파일 관리', '/etc/passwd 파일 소유자 및 권한 설정', '양호', '-'),
('AX-PRM-01', 'SV-18', '파일 관리', '/etc/shadow 파일 소유자 및 권한 설정', '양호', '-'),
('AX-PRM-01', 'SV-19', '파일 관리', 'UMASK 설정 관리(UMASK0022)', '수동점검', '-'),
('AX-PRM-01', 'SV-21', '파일 관리', '/etc/(x)inetd.conf 파일 소유자 및 권한 설정', '양호', '-'),
('AX-PRM-01', 'SV-22', '파일 관리', '/etc/syslog.conf 파일 소유자 및 권한 설정', '취약', '소유자 root 변경 필요'),
('AX-PRM-01', 'SV-28', '서비스 관리', '불필요한 서비스 비활성화 (FTP 등)', '양호', '-'),
('AX-PRM-01', 'SV-31', '서비스 관리', '원격 접속 터미널 보안 설정', '취약', 'SSH Root 접속 제한 필요'),
('AX-PRM-01', 'SV-33', '서비스 관리', 'NFS 서비스 사용여부 및 NFS 접근통제', '양호', '-'),
('AX-PRM-01', 'SV-34', '서비스 관리', 'FTP 서비스 접근 권한 및 보안설정', '양호', '-'),
('AX-PRM-01', 'SV-36', '보안 관리', '악성코드(바이러스등) 은닉, 탐지도구 설치', '양호', '-'),
('AX-PRM-01', 'SV-40', 'DB 관리', '접근, 변경, 질의 등의 감사로깅 1년 이상 보관', '양호', '-');

-- ------------------------------------------------------------
-- 안전점검 데이터 (AX-PRM-01 - 28개 항목)
-- ------------------------------------------------------------
INSERT INTO safety_inspection (complex_id, check_id, category, item, cycle_rec, cycle_man, result) VALUES
('AX-PRM-01', 'SI-0',  '관리용 PC', '계정관리 및 보안설정', '월간', '월간', '양호'),
('AX-PRM-01', 'SI-1',  '관리용 PC', '불필요한 서비스 비활성화', '월간', '월간', '양호'),
('AX-PRM-01', 'SI-2',  '관리용 PC', '운영체제 최신 보안 업데이트', '월간', '월간', '양호'),
('AX-PRM-01', 'SI-3',  '관리용 PC', '악성코드 탐지 예방 활동', '월간', '월간', '양호'),
('AX-PRM-01', 'SI-4',  '단지 네트워크 장비', '장비 온도, LED 램프 등 장비 외관을 육안 점검', '2주', '월간', '양호'),
('AX-PRM-01', 'SI-5',  '단지 네트워크 장비', '전원 상태(뒷면/전면 램프) 육안 점검', '2주', '월간', '양호'),
('AX-PRM-01', 'SI-6',  '단지 네트워크 장비', 'LED 램프의 정상 작동 등 통신상태를 육안 점검', '2주', '월간', '양호'),
('AX-PRM-01', 'SI-7',  '단지 네트워크 장비', '케이블의 외관상태, 연결부위 접촉여부를 육안 점검', '2주', '월간', '양호'),
('AX-PRM-01', 'SI-8',  '단지 네트워크 장비', '장치함/랙(rack)의 잠금장치 설치 및 시건 정상작동', '1주', '월간', '불량'),
('AX-PRM-01', 'SI-9',  '단지 네트워크 장비', 'UPS(무정전전원장치) 전원 상태 등 정상작동 점검', '2주', '월간', '양호'),
('AX-PRM-01', 'SI-10', '단지서버', '장비 온도, LED 램프 등 장비 외관을 육안 점검', '2주', '월간', '양호'),
('AX-PRM-01', 'SI-11', '단지서버', '전원 상태(뒷면/전면 램프) 육안 점검', '2주', '월간', '양호'),
('AX-PRM-01', 'SI-12', '단지서버', '케이블의 외관상태, 연결부위 접촉여부를 육안 점검', '2주', '월간', '양호'),
('AX-PRM-01', 'SI-13', '단지서버', '서버 설치공간의 잠금장치 설치 및 시건 정상작동', '1주', '월간', '양호'),
('AX-PRM-01', 'SI-14', '단지서버', '영상정보처리기기(CCTV) 설치 및 정상작동 점검', '2주', '월간', '양호'),
('AX-PRM-01', 'SI-15', '단지서버', '항온항습/냉방기/환풍기 설치 및 정상작동 점검', '2주', '월간', '양호'),
('AX-PRM-01', 'SI-16', '단지서버', 'UPS(무정전전원장치) 전원 상태 등 정상작동 점검', '2주', '월간', '해당없음'),
('AX-PRM-01', 'SI-17', '통신 배관실', '잠금장치 설치 및 시건 정상작동 점검', '1주', '월간', '양호'),
('AX-PRM-01', 'SI-18', '통신 배관실', '출입통제표시 부착 여부 및 상태 육안 점검', '2주', '월간', '양호'),
('AX-PRM-01', 'SI-19', '통신 배관실', '케이블의 외관상태, 연결부위 접촉여부를 육안 점검', '2주', '월간', '양호'),
('AX-PRM-01', 'SI-20', '통신 배관실', '열쇠 불출 관리대장 작성 점검', '2주', '월간', '양호'),
('AX-PRM-01', 'SI-21', '통신 배관실', '인가되지 않은 장비/설비 추가설치 여부 점검', '2주', '월간', '양호'),
('AX-PRM-01', 'SI-22', '집중구내 통신실', '잠금장치 설치 및 시건 정상작동 점검', '1주', '월간', '양호'),
('AX-PRM-01', 'SI-23', '집중구내 통신실', '온·습도 유지장치의 설치 및 정상작동 점검', '2주', '월간', '불량'),
('AX-PRM-01', 'SI-24', '집중구내 통신실', '출입 관리대장 작성 점검', '2주', '월간', '양호'),
('AX-PRM-01', 'SI-25', '방재실', '잠금장치 설치 및 시건 정상작동 점검', '1주', '월간', '양호'),
('AX-PRM-01', 'SI-26', '방재실', '온·습도 유지장치의 설치 및 정상작동 점검', '2주', '월간', '양호'),
('AX-PRM-01', 'SI-27', '기타', '유지관리 매뉴얼, 설계도서 비치 점검', '월간', '월간', '양호');

-- 참고: SI-27은 28번째 항목(인덱스 27). 프론트엔드 데이터에 28개 항목이 정의되어 있으나
-- 마지막 항목 '홈네트워크 공사 및 용역대장 작성 점검'도 포함합니다.
INSERT INTO safety_inspection (complex_id, check_id, category, item, cycle_rec, cycle_man, result) VALUES
('AX-PRM-01', 'SI-28', '기타', '홈네트워크 공사 및 용역대장 작성 점검', '월간', '월간', '양호');

-- ------------------------------------------------------------
-- 단지관리 운영점검 데이터 (AX-PRM-01 - 18개 항목 CM-01 ~ CM-18)
-- ------------------------------------------------------------
INSERT INTO complex_management (complex_id, check_id, category, item, result, note) VALUES
('AX-PRM-01', 'CM-01', '장비 현황', '세대 단말기(월패드) 설치 현황 확인', '양호', '-'),
('AX-PRM-01', 'CM-02', '장비 현황', '단지서버 가동 상태 점검', '양호', '-'),
('AX-PRM-01', 'CM-03', '장비 현황', '네트워크 장비(스위치/라우터) 상태 확인', '양호', '-'),
('AX-PRM-01', 'CM-04', '장비 현황', '방화벽 장비 운영 상태 점검', '양호', '-'),
('AX-PRM-01', 'CM-05', '네트워크', '단지 내부망 통신 상태 점검', '양호', '-'),
('AX-PRM-01', 'CM-06', '네트워크', 'VPN 터널링 연결 상태 확인', '양호', '-'),
('AX-PRM-01', 'CM-07', '네트워크', '백본 네트워크 대역폭 점검', '양호', '-'),
('AX-PRM-01', 'CM-08', '보안 관리', '보안 정책(룰셋) 최신 적용 여부', '양호', '-'),
('AX-PRM-01', 'CM-09', '보안 관리', '비인가 접근 시도 모니터링', '양호', '-'),
('AX-PRM-01', 'CM-10', '보안 관리', '관리자 계정 접근 권한 검토', '양호', '-'),
('AX-PRM-01', 'CM-11', '운영 관리', '장애 세대 현황 파악 및 조치', '양호', '-'),
('AX-PRM-01', 'CM-12', '운영 관리', '정기 점검 스케줄 이행 여부', '양호', '-'),
('AX-PRM-01', 'CM-13', '운영 관리', '유지보수 이력 관리', '양호', '-'),
('AX-PRM-01', 'CM-14', '운영 관리', '비상 연락망 및 대응 체계 확인', '양호', '-'),
('AX-PRM-01', 'CM-15', '시스템', 'CPU/메모리 사용률 안정성 확인', '양호', '-'),
('AX-PRM-01', 'CM-16', '시스템', '디스크 용량 및 로그 관리 상태', '양호', '-'),
('AX-PRM-01', 'CM-17', '시스템', '시스템 백업 정책 이행 확인', '양호', '-'),
('AX-PRM-01', 'CM-18', '시스템', '소프트웨어 버전 및 패치 현황', '양호', '-');

-- ------------------------------------------------------------
-- 계정 데이터 (기본 관리자 + 추가 계정)
-- BCrypt 해시: 'admin123' → $2a$10$...
-- ------------------------------------------------------------
INSERT INTO account (username, password, name, role, complex, status, email, last_login) VALUES
('admin',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '최고관리자', '최고관리자', '전체', '활성', 'admin@axgate.com', '2026-02-21 09:00:00'),
('jang_jg', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '장정구', 'System Engineer', '전체 단지 유지보수', '활성', 'jang@axgate.com', '2026-02-20 14:30:00'),
('park_si', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '박신일', 'Complex Manager', '디에이치 아너힐즈, 올림픽파크 포레온', '활성', 'park@axgate.com', '2026-02-21 08:45:00'),
('lee_yh',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '이영희', 'Viewer', '반포 자이 (읽기 전용)', '비활성', 'lee@axgate.com', '2026-01-15 11:20:00');

-- ------------------------------------------------------------
-- 공지사항 데이터 (3건)
-- ------------------------------------------------------------
INSERT INTO notice (title, content, type, author, created_at) VALUES
('[긴급] 외부 위협 IP 차단 업데이트', '최신 위협 인텔리전스 기반 블랙리스트가 갱신되었습니다. 즉시 적용 바랍니다.', 'urgent', '시스템', '2026-02-21 00:00:00'),
('정기 시스템 점검 안내 (23:00)', '안정성 확보를 위한 코어 서버 리부팅이 예정되어 있습니다.', 'notice', '시스템', '2026-02-20 00:00:00'),
('AXGATE-50LQ 펌웨어 v2.5.0 릴리즈', '암호화 성능 30% 향상 및 UI 버그 수정.', 'update', '시스템', '2026-02-19 00:00:00');

-- ------------------------------------------------------------
-- 문의 데이터 (3건)
-- ------------------------------------------------------------
INSERT INTO inquiry (title, content, author, status, answer, created_at) VALUES
('VPN 터널링 간헐적 끊김 현상', 'VPN 터널링이 간헐적으로 끊어지는 현상이 발생합니다. 로그 확인 부탁드립니다.', '101동 101호 관리자', '대기중', NULL, '2026-02-21 14:30:00'),
('월간 리포트 수신처 추가 요청', '월간 리포트 자동 발송 수신처를 하나 더 추가하고 싶습니다. 방법 안내 바랍니다.', '단지 통합 관리소장', '처리완료', '관리자 설정 > 리포트 > 수신처 관리에서 추가 가능합니다.', '2026-02-20 09:15:00'),
('단말 오프라인 상태 지속', '단말 오프라인 상태 지속됨. 현장 출동이 필요해 보입니다.', '105동 602호 관리자', '처리완료', '현장 점검 완료. 전원 케이블 접촉 불량으로 교체 조치하였습니다.', '2026-02-19 16:45:00');

-- ------------------------------------------------------------
-- 시스템 로그 데이터 (8건)
-- ------------------------------------------------------------
INSERT INTO system_log (time, level, source, message) VALUES
('10:42:05', 'CRITICAL', '관문 방화벽', '외부 IP(211.x.x.x)로부터 비정상 접근 시도 차단'),
('10:41:12', 'WARN', '단지서버', 'FTP 포트(21) 활성화 상태 감지 (SV-28 위반)'),
('10:40:00', 'INFO', '시스템', '관리자(박신일) 로그인 완료'),
('10:35:22', 'INFO', '백본 스위치', '포트 24 (Uplink) 연결 상태 정상'),
('10:28:15', 'INFO', '단지서버', '데이터베이스 정기 백업 완료 (소요시간: 45초)'),
('10:15:03', 'WARN', '방화벽', '비정상적인 트래픽 급증 감지 (차단 모드 자동 전환)'),
('09:55:40', 'CRITICAL', '망분리 장비', '101동 101호 VPN 터널링 연결 끊김'),
('09:30:00', 'INFO', '시스템', '일일 보안 점검 스케줄러 정상 구동');

-- ============================================================
-- 스키마 생성 완료
-- ============================================================
