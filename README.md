# AI Research Archive

나만의 AI 연구 논문 아카이브 - DeepSeek, Google DeepMind, OpenAI, Meta 등 주요 AI 연구 기관의 최신 논문을 자동으로 수집하고 관리합니다.

## Features

- **자동 논문 수집**: GitHub Actions를 통해 매일 arXiv에서 최신 논문 자동 수집
- **한글 번역**: Google Translate를 활용한 제목/요약 자동 번역
- **조직별 필터**: DeepSeek, DeepMind, OpenAI, Meta, Alibaba, MIT 등
- **도메인별 분류**: LLM, Reasoning, Agent, RAG, Vision, Robotics 등
- **즐겨찾기**: 관심 논문 별표 기능 (localStorage 저장)
- **타임라인**: 월별 논문 흐름 파악
- **외부 링크**: arXiv, GitHub 링크 바로가기

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Data**: Static TypeScript file (papers.ts)
- **Deployment**: Vercel
- **Automation**: GitHub Actions + Python (arXiv API)

## Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # 홈페이지
│   │   ├── papers/             # 논문 목록 & 상세
│   │   └── timeline/           # 타임라인
│   ├── components/             # React 컴포넌트
│   ├── data/
│   │   └── papers.ts           # 논문 데이터
│   ├── hooks/
│   │   └── useFavorites.ts     # 즐겨찾기 훅
│   └── types/
│       └── paper.ts            # TypeScript 타입
├── scripts/
│   ├── fetch_papers.py         # 논문 자동 수집 스크립트
│   └── requirements.txt        # Python 의존성
└── .github/
    └── workflows/
        └── fetch-papers.yml    # GitHub Actions 워크플로우
```

## Getting Started

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## Auto-fetch Papers (Manual)

```bash
# Python 가상환경 설정
python3 -m venv .venv
source .venv/bin/activate
pip install -r scripts/requirements.txt

# 논문 수집 실행
python scripts/fetch_papers.py
```

## Data Schema

```typescript
interface Paper {
  id: string;
  title: string;
  titleKo?: string;           // 한글 제목
  organization: string;       // DeepSeek, DeepMind, etc.
  date: string;               // YYYY-MM
  arxivUrl?: string;
  githubUrl?: string;
  summary: string;            // 한글 요약
  keyInnovation: string;      // 핵심 혁신
  practicalInsight: string;   // 실무 인사이트
  domains: string[];          // LLM, Agent, etc.
  tags: string[];
}
```

## License

MIT
