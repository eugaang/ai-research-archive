#!/usr/bin/env python3
"""
AI Research Paper Auto-Fetcher
arXiv에서 주요 AI 연구 기관의 최신 논문을 수집하여 papers.ts에 추가
"""

import arxiv
import json
import re
import os
import time
from datetime import datetime, timedelta
from pathlib import Path
from deep_translator import GoogleTranslator

# 설정
CATEGORIES = ['cs.LG', 'cs.CL', 'cs.AI', 'cs.CV', 'cs.MA']  # ML, NLP, AI, Vision, MultiAgent
MAX_RESULTS = 200
DAYS_BACK = 2  # 최근 N일 논문

# 주요 연구 기관 키워드 (저자 소속/이름에서 탐지)
AFFILIATIONS = {
    'DeepMind': ['deepmind', 'google deepmind'],
    'DeepSeek': ['deepseek'],
    'OpenAI': ['openai'],
    'Anthropic': ['anthropic'],
    'Meta': ['meta ai', 'fair', 'facebook ai'],
    'Alibaba': ['alibaba', 'damo academy', 'qwen'],
    'Google': ['google research', 'google brain'],
    'Microsoft': ['microsoft research', 'microsoft'],
    # 대학
    'Stanford': ['stanford'],
    'MIT': ['mit ', 'massachusetts institute'],
    'Berkeley': ['berkeley', 'uc berkeley'],
    'CMU': ['carnegie mellon', 'cmu'],
    'Princeton': ['princeton'],
    'Tsinghua': ['tsinghua'],
    'Peking': ['peking university'],
}

# 핫 키워드 (제목/초록에서 탐지)
HOT_KEYWORDS = [
    'reasoning', 'agent', 'rlhf', 'grpo', 'moe', 'mixture of experts',
    'long-context', 'rag', 'retrieval', 'chain-of-thought', 'cot',
    'instruction tuning', 'alignment', 'safety', 'multimodal',
    'vision-language', 'code generation', 'math', 'benchmark',
    'scaling law', 'efficient', 'sparse attention', 'distillation',
    'world model', 'embodied', 'robotics', 'video generation',
    # VLM 관련
    'vlm', 'vision language', 'visual instruction', 'image understanding',
    'visual reasoning', 'visual question', 'image-text', 'text-to-image',
    'llava', 'qwen-vl', 'internvl', 'cogvlm', 'visual encoder',
    'image generation', 'diffusion model', 'stable diffusion'
]

# 도메인 매핑
DOMAIN_MAPPING = {
    'cs.CL': ['LLM'],
    'cs.LG': ['LLM', 'Efficiency'],
    'cs.CV': ['Vision'],
    'cs.AI': ['Agent', 'Reasoning'],
    'cs.MA': ['Agent'],
    'cs.RO': ['Robotics'],
}

# 제외 키워드 (AI/ML과 관련 없는 논문 필터링)
EXCLUDE_KEYWORDS = [
    'dark matter', 'particle physics', 'quantum field', 'cosmology',
    'astrophysics', 'condensed matter', 'superconductor', 'gravitational',
    'black hole', 'neutrino', 'hadron', 'quark', 'thermodynamic'
]

KEYWORD_TO_DOMAIN = {
    'reasoning': 'Reasoning',
    'agent': 'Agent',
    'rag': 'RAG',
    'retrieval': 'RAG',
    'multimodal': 'Multimodal',
    'vision': 'Vision',
    'video': 'Vision',
    'robotics': 'Robotics',
    'embodied': 'Robotics',
    'medical': 'Healthcare',
    'health': 'Healthcare',
    'protein': 'Science',
    'molecule': 'Science',
    'efficient': 'Efficiency',
    'sparse': 'Efficiency',
    # VLM
    'vlm': 'Multimodal',
    'vision language': 'Multimodal',
    'visual instruction': 'Multimodal',
    'image-text': 'Multimodal',
    'image generation': 'Vision',
    'diffusion': 'Vision',
}


def translate_to_korean(text: str) -> str:
    """영어 텍스트를 한글로 번역 (Google Translate 사용)"""
    try:
        translator = GoogleTranslator(source='en', target='ko')
        # 긴 텍스트는 분할 처리 (Google Translate 제한)
        if len(text) > 4500:
            text = text[:4500]
        translated = translator.translate(text)
        time.sleep(0.5)  # Rate limit 방지
        return translated or text
    except Exception as e:
        print(f"    Translation error: {e}")
        return text


def detect_organization(authors_text: str, abstract: str) -> str | None:
    """저자 정보와 초록에서 소속 기관 탐지"""
    text = (authors_text + ' ' + abstract).lower()

    for org, keywords in AFFILIATIONS.items():
        for kw in keywords:
            if kw in text:
                return org
    return None


def calculate_score(title: str, abstract: str, authors_text: str) -> int:
    """논문 중요도 점수 계산"""
    score = 0
    text = (title + ' ' + abstract).lower()

    # 주요 기관 논문
    org = detect_organization(authors_text, abstract)
    if org:
        score += 15

    # 핫 키워드 포함
    for kw in HOT_KEYWORDS:
        if kw in text:
            score += 3

    return score


def detect_domains(title: str, abstract: str, categories: list) -> list:
    """논문의 도메인 자동 분류"""
    domains = set()
    text = (title + ' ' + abstract).lower()

    # 카테고리 기반
    for cat in categories:
        if cat in DOMAIN_MAPPING:
            domains.update(DOMAIN_MAPPING[cat])

    # 키워드 기반
    for kw, domain in KEYWORD_TO_DOMAIN.items():
        if kw in text:
            domains.add(domain)

    # 기본값
    if not domains:
        domains.add('LLM')

    return list(domains)[:3]  # 최대 3개


def extract_tags(title: str, abstract: str) -> list:
    """논문에서 태그 추출"""
    tags = []
    text = (title + ' ' + abstract).lower()

    for kw in HOT_KEYWORDS:
        if kw in text:
            # 태그 형식으로 변환 (공백 -> 하이픈)
            tag = kw.replace(' ', '-').replace('_', '-')
            tags.append(tag)

    return tags[:5]  # 최대 5개


def generate_id(title: str) -> str:
    """제목에서 ID 생성"""
    # 알파벳과 숫자만 추출, 소문자로
    clean = re.sub(r'[^a-zA-Z0-9\s]', '', title.lower())
    words = clean.split()[:4]  # 처음 4단어
    return '-'.join(words)


def fetch_papers() -> list:
    """arXiv에서 논문 수집"""
    client = arxiv.Client()

    # 쿼리 구성
    cat_query = ' OR '.join([f'cat:{cat}' for cat in CATEGORIES])

    search = arxiv.Search(
        query=cat_query,
        max_results=MAX_RESULTS,
        sort_by=arxiv.SortCriterion.SubmittedDate,
        sort_order=arxiv.SortOrder.Descending
    )

    cutoff_date = datetime.now() - timedelta(days=DAYS_BACK)
    papers = []

    print(f"Fetching papers from arXiv (last {DAYS_BACK} days)...")

    for result in client.results(search):
        # 날짜 필터
        if result.published.replace(tzinfo=None) < cutoff_date:
            continue

        authors_text = ', '.join([a.name for a in result.authors])

        # 점수 계산
        score = calculate_score(result.title, result.summary, authors_text)

        # 점수가 낮은 논문은 스킵 (노이즈 필터링)
        if score < 10:
            continue

        org = detect_organization(authors_text, result.summary)
        if not org:
            continue  # 주요 기관 논문만

        # 제외 키워드 체크 (물리학 등 비관련 논문 제외)
        text_lower = (result.title + ' ' + result.summary).lower()
        if any(kw in text_lower for kw in EXCLUDE_KEYWORDS):
            print(f"    Skipped (non-AI): {result.title[:40]}...")
            continue

        # 제목과 요약 한글 번역
        title_en = result.title.replace('\n', ' ').strip()
        summary_en = result.summary[:300].replace('\n', ' ').strip()

        print(f"  [{org}] {title_en[:50]}... (score: {score})")
        print(f"    Translating...")

        title_ko = translate_to_korean(title_en)
        summary_ko = translate_to_korean(summary_en)

        paper = {
            'id': generate_id(result.title),
            'title': title_en,
            'titleKo': title_ko,
            'organization': org,
            'date': result.published.strftime('%Y-%m'),
            'arxivUrl': result.entry_id,
            'summary': summary_ko,
            'keyInnovation': '',
            'practicalInsight': '',
            'domains': detect_domains(result.title, result.summary, result.categories),
            'tags': extract_tags(result.title, result.summary),
            '_score': score,
            '_authors': authors_text[:200],
        }

        papers.append(paper)

    # 점수순 정렬
    papers.sort(key=lambda x: x['_score'], reverse=True)

    return papers


def load_existing_papers() -> set:
    """기존 papers.ts에서 ID 목록 로드"""
    papers_path = Path(__file__).parent.parent / 'src' / 'data' / 'papers.ts'

    if not papers_path.exists():
        return set()

    content = papers_path.read_text()

    # 기존 ID 추출 (정규식으로)
    ids = re.findall(r"id:\s*['\"]([^'\"]+)['\"]", content)
    return set(ids)


def generate_paper_entry(paper: dict) -> str:
    """논문을 TypeScript 객체 문자열로 변환"""
    domains = json.dumps(paper['domains'])
    tags = json.dumps(paper['tags'])

    # 특수문자 이스케이프
    title = paper['title'].replace("'", "\\'").replace('\n', ' ')
    title_ko = paper.get('titleKo', '').replace("'", "\\'").replace('\n', ' ')
    summary = paper['summary'].replace("'", "\\'").replace('\n', ' ')

    entry = f"""  {{
    id: '{paper['id']}',
    title: '{title}',
    titleKo: '{title_ko}',
    organization: '{paper['organization']}',
    date: '{paper['date']}',
    arxivUrl: '{paper['arxivUrl']}',
    summary: '{summary}',
    keyInnovation: '',
    practicalInsight: '',
    domains: {domains},
    tags: {tags},
  }}"""

    return entry


def update_papers_file(new_papers: list):
    """papers.ts 파일에 새 논문 추가"""
    papers_path = Path(__file__).parent.parent / 'src' / 'data' / 'papers.ts'

    if not papers_path.exists():
        print("Error: papers.ts not found")
        return

    content = papers_path.read_text()

    # 기존 ID 확인
    existing_ids = load_existing_papers()

    # 새 논문만 필터링
    truly_new = [p for p in new_papers if p['id'] not in existing_ids]

    if not truly_new:
        print("No new papers to add.")
        return

    print(f"\nAdding {len(truly_new)} new papers...")

    # 새 논문 엔트리 생성
    new_entries = '\n\n  // Auto-added: ' + datetime.now().strftime('%Y-%m-%d') + '\n'
    for paper in truly_new[:10]:  # 최대 10개만 추가
        new_entries += generate_paper_entry(paper) + ',\n'

    # papers 배열 끝에 삽입 (마지막 ]; 앞에)
    # 패턴: 마지막 객체 } 다음, ]; 앞
    insertion_point = content.rfind('},')
    if insertion_point == -1:
        print("Error: Could not find insertion point")
        return

    # }, 다음 위치에 삽입
    new_content = content[:insertion_point+2] + new_entries + content[insertion_point+2:]

    papers_path.write_text(new_content)
    print(f"Updated {papers_path}")

    # 추가된 논문 목록 출력
    for paper in truly_new[:10]:
        print(f"  + [{paper['organization']}] {paper['title'][:50]}...")


def main():
    print("=" * 60)
    print("AI Research Paper Auto-Fetcher")
    print("=" * 60)

    papers = fetch_papers()
    print(f"\nFound {len(papers)} relevant papers")

    if papers:
        update_papers_file(papers)

    print("\nDone!")


if __name__ == '__main__':
    main()
