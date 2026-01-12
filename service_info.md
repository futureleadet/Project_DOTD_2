✦ DOTD (Outfit of the Day) 프로젝트는 사용자의 스타일을 분석하고 AI 이미지를 생성하며, 맞춤형 패션 브랜드를 제안하는 AI
  기반 패션 플랫폼입니다.

  이 서비스는 Frontend(React), Backend(FastAPI), Database(PostgreSQL), 그리고 AI Engine(n8n Webhook)으로 구성된
  현대적인 웹 애플리케이션 구조를 가지고 있습니다.

  전반적인 아키텍처를 4가지 핵심 레이어로 나누어 설명해 드리겠습니다.

  ---

  1. 기술 스택 (Tech Stack)

   * Frontend: React (Vite, TypeScript), Tailwind CSS
       * 사용자 인터페이스 및 상태 관리 담당.
   * Backend: Python FastAPI
       * REST API 서버, 비즈니스 로직, 정적 파일 서빙, 데이터베이스 통신 담당.
   * Database: PostgreSQL
       * 사용자 정보, 생성된 이미지, 좋아요, 스타일 분석 데이터 저장.
       * asyncpg를 사용한 비동기 처리가 특징입니다.
   * AI & Automation: n8n Webhook
       * 무거운 AI 연산(이미지 생성, 스타일 분석, 쇼핑 추천 등)을 담당하는 외부 워크플로우 엔진입니다.

  ---

  2. 시스템 아키텍처 다이어그램 (논리적 구조)

    1 [User Client (Browser)]
    2        │
    3        ▼
    4 [ FastAPI Server (Backend) ]
    5 │  1. API 요청 처리 (/api/*)
    6 │  2. 정적 파일 서빙 (React Build Files)
    7 │  3. 인증 및 권한 관리 (JWT)
    8 │
    9 ├─── [ PostgreSQL (DB) ]
   10 │      (유저, 생성 내역, 좋아요 데이터)
   11 │
   12 └─── [ n8n Workflow (AI Engine) ]
   13        (외부 URL: http://n8n.nemone.store/...)
   14        │  1. 이미지 생성 (Stable Diffusion 등)
   15        │  2. 스타일 분석 (Gemini 등 LLM)
   16        │  3. 쇼핑/브랜드 추천

  ---

  3. 주요 폴더 및 역할 설명

  현재 작업 중인 디렉토리 구조에 기반한 역할 분담입니다.

  A. Frontend (/react)
  사용자가 경험하는 화면입니다. 빌드(npm run build) 후 Backend의 /static 폴더 등으로 이동되어 서빙됩니다.
   * `components/`: UI 조각들입니다.
       * Generate.tsx: 스타일 생성 입력 폼.
       * MyPage.tsx: 마이페이지 (생성 내역, 좋아요, 프로필 관리).
       * `components/mypage/brand_archive/`: (최근 추가) 사용자의 스타일 히스토리를 기반으로 브랜드를 추천해주는 컨설팅
         기능.
   * `services/apiService.ts`: Backend API와 통신하는 함수들이 모여 있습니다. (인증 토큰 자동 처리 등)

  B. Backend (/app)
  시스템의 중추입니다. run.py를 통해 실행됩니다.
   * `routers/`: URL 엔드포인트 정의.
       * creation_router.py: 이미지 생성 요청을 받고, 백그라운드 태스크로 n8n에 작업을 넘깁니다.
       * analysis_router.py: Brand Archive 등 분석 데이터를 처리합니다.
       * shopping_router.py: 쇼핑 추천 관련 웹훅을 호출합니다.
   * `services/`: 비즈니스 로직.
       * task_manager.py: 오래 걸리는 AI 작업을 비동기로 처리하고 상태를 관리합니다.
   * `repositories/`: DB에 직접 쿼리를 날리는 계층 (SQL 로직 분리).
   * `static/`: 업로드된 이미지나 React 빌드 파일이 위치합니다.

  C. AI 처리 흐름 (n8n Webhook)
  이 프로젝트의 가장 큰 특징은 AI 로직을 코드 내부에 두지 않고 n8n 웹훅으로 위임했다는 점입니다.
   1. 요청: 사용자가 스타일 생성을 요청하면 FastAPI는 데이터를 정리하여 http://n8n.nemone.store/webhook/...으로 POST
      요청을 보냅니다.
   2. 처리: n8n 내부에서 AI 모델이 돌아가고 결과(이미지 URL, 분석 텍스트 JSON)를 반환합니다.
   3. 저장: FastAPI가 응답을 받아 DB에 저장하고, Frontend는 폴링(Polling) 등을 통해 결과를 확인합니다.

  ---

  4. 핵심 데이터 흐름 예시

  예시 1: 스타일 생성 (Create Task)
   1. React: 사용자가 성별, 스타일 등을 입력 -> POST /api/create_task
   2. FastAPI: 요청 접수 -> TaskManager로 작업 등록(Pending) -> Task ID 즉시 반환 -> 백그라운드에서 n8n 웹훅 호출.
   3. n8n: 이미지 생성 후 결과(Base64/URL, 분석 텍스트) 반환.
   4. FastAPI (Background): 결과를 받아 로컬 스토리지에 이미지 저장 -> DB에 메타데이터(creations 테이블) 저장 -> Task
      상태를 Completed로 변경.
   5. React: Task ID로 상태를 주기적으로 확인하다가 완료되면 이미지 표시.

  예시 2: 브랜드 아카이브 (Brand Archive) - 방금 작업한 내용
   1. React: 마이페이지 > 브랜드 찾기 클릭 -> GET /api/analysis/brand-archive
   2. FastAPI: CreationsRepository를 통해 해당 유저의 총 생성 횟수와 최근 5개 스타일 분석 텍스트를 DB에서 조회.
   3. FastAPI: 조회된 데이터를 합쳐서 n8n 컨설팅 웹훅(.../dotd-consulting)으로 전송.
   4. n8n: 유저 데이터를 분석하여 JSON 형태(Locked/Unlocked 리포트)로 응답.
   5. React: 응답받은 JSON을 파싱하여 UI(UnlockedView 등)에 렌더링.

  ---

  요약
  이 서비스는 Python 백엔드의 안정성과 React 프론트엔드의 반응성, 그리고 n8n의 유연한 AI 확장성을 결합한 하이브리드
  구조입니다. 특히 AI 모델 변경이나 로직 수정이 필요할 때 코드를 고치지 않고 n8n 워크플로우만 수정하면 되는 장점이
  있습니다.