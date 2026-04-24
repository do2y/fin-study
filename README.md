# FinWord

금융 뉴스를 읽으며 모르는 용어를 즉시 학습하고, 개인 단어장으로 축적해 관리하는 금융 학습 웹 서비스.

---

## 프로젝트 소개

뉴스 본문에서 금융 용어를 클릭하면 정의와 예시문을 확인할 수 있고, 단어장에 저장해 학습 상태를 관리할 수 있다. 단순 조회에 그치지 않고 사용자별 학습 이력을 축적하는 것이 핵심 목표다.

**주요 흐름**

1. 회원가입 / 로그인 (JWT 인증)
2. 금융 뉴스 목록 조회
3. 뉴스 본문 내 하이라이트된 금융 용어 클릭 → 정의 모달 확인
4. 단어장에 저장 → 학습 상태(모름 / 학습중 / 이해완료) 및 카테고리 관리
5. 뉴스 하단 퀴즈로 학습 강화

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | Next.js 15 (App Router), Tailwind CSS |
| 서버 상태 관리 | TanStack React Query (Optimistic UI) |
| 클라이언트 상태 | Zustand |
| 백엔드 | Next.js Route Handlers / Node.js Express |
| 데이터베이스 | MariaDB |
| 인증 | JWT |

---

## 디렉토리 구조

```
fin-study/
├── client/                  # Next.js 앱 (프론트엔드 + API Routes)
│   ├── app/
│   │   ├── (auth)/          # 로그인, 회원가입 페이지
│   │   ├── (protected)/     # 뉴스, 단어장 페이지 (인증 필요)
│   │   └── api/             # Route Handlers (인증, 뉴스, 단어장)
│   ├── components/          # 공통 컴포넌트
│   ├── data/                # 뉴스·용어 더미 데이터
│   ├── lib/                 # DB 연결, API 유틸
│   └── store/               # Zustand 스토어
└── server/                  # Express 백엔드 (선택적 사용)
    ├── data/                # 뉴스·용어 더미 데이터
    └── server.js
```

---

## 실행 방법

**사전 준비**: MariaDB에 `finword` 데이터베이스 생성 (테이블은 앱 첫 실행 시 자동 생성)

```sql
CREATE DATABASE finword;
```

**Next.js 앱 실행**

```bash
cd client
npm install
# .env.local 파일에 DB 접속 정보 및 JWT_SECRET 설정
npm run dev
```

`.env.local` 예시:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=finword
JWT_SECRET=your_secret_key
```

---

## 설계 의도

- **학습 상태 기반 UPDATE**: 단순 텍스트 수정이 아닌 `unknown → learning → mastered` 흐름으로 학습 진척을 추적한다.
- **Optimistic UI**: 단어 저장·삭제·상태 변경 시 서버 응답을 기다리지 않고 UI를 즉시 반영하며, 실패 시 이전 상태로 롤백한다.
- **뉴스와 학습 데이터의 결합**: 뉴스는 읽기 전용 콘텐츠이고, 실제 CRUD 대상은 사용자의 단어장이다. 뉴스를 학습의 출발점으로 삼아 개인화된 금융 지식 관리 경험을 제공한다.
