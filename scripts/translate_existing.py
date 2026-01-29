#!/usr/bin/env python3
"""
기존 영어 논문들을 한글로 번역하는 스크립트
"""

import re
import time
from pathlib import Path
from deep_translator import GoogleTranslator


def translate_to_korean(text: str) -> str:
    """영어 텍스트를 한글로 번역"""
    try:
        # 이미 한글이 포함되어 있으면 스킵
        if any('\uac00' <= c <= '\ud7a3' for c in text):
            return text

        translator = GoogleTranslator(source='en', target='ko')
        if len(text) > 4500:
            text = text[:4500]
        translated = translator.translate(text)
        time.sleep(0.5)
        return translated or text
    except Exception as e:
        print(f"  Translation error: {e}")
        return text


def main():
    papers_path = Path(__file__).parent.parent / 'src' / 'data' / 'papers.ts'
    content = papers_path.read_text()

    # 영어 summary 찾기 (한글이 없는 summary)
    # 패턴: summary: '...' (한글 없음)
    pattern = r"(summary:\s*')([^']*[a-zA-Z][^']*)(')"

    def replace_summary(match):
        prefix = match.group(1)
        text = match.group(2)
        suffix = match.group(3)

        # 이미 한글이면 스킵
        if any('\uac00' <= c <= '\ud7a3' for c in text):
            return match.group(0)

        print(f"  Translating: {text[:50]}...")
        translated = translate_to_korean(text)
        # 따옴표 이스케이프
        translated = translated.replace("'", "\\'")
        return f"{prefix}{translated}{suffix}"

    print("Translating summaries...")
    new_content = re.sub(pattern, replace_summary, content)

    # 영어 title 중 titleKo가 없는 것 찾아서 추가
    # title만 있고 titleKo가 없는 경우 찾기
    title_pattern = r"(title:\s*')([^']+)(',\s*\n\s*)(organization:)"

    def add_title_ko(match):
        prefix = match.group(1)
        title = match.group(2)
        middle = match.group(3)
        next_field = match.group(4)

        # 이미 titleKo가 있으면 스킵 (다음 필드가 titleKo인지 확인)
        if 'titleKo' in middle:
            return match.group(0)

        # 이미 한글이면 스킵
        if any('\uac00' <= c <= '\ud7a3' for c in title):
            return match.group(0)

        print(f"  Adding titleKo for: {title[:40]}...")
        title_ko = translate_to_korean(title)
        title_ko = title_ko.replace("'", "\\'")

        return f"{prefix}{title}{middle.rstrip()}titleKo: '{title_ko}',\n    {next_field}"

    print("\nAdding titleKo for papers without Korean titles...")
    new_content = re.sub(title_pattern, add_title_ko, new_content)

    papers_path.write_text(new_content)
    print(f"\nUpdated {papers_path}")


if __name__ == '__main__':
    main()
