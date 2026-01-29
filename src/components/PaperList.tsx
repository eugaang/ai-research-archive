'use client';

import { useState } from 'react';
import { Paper } from '@/types/paper';
import { PaperCard } from './PaperCard';
import { useFavorites } from '@/hooks/useFavorites';

interface PaperListProps {
  papers: Paper[];
  domains: string[];
  initialOrg?: string;
  initialDomain?: string;
  initialTag?: string;
}

export function PaperList({
  papers,
  domains,
  initialOrg,
  initialDomain,
  initialTag,
}: PaperListProps) {
  const { isFavorite, toggleFavorite, favorites, isLoaded } = useFavorites();
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // 필터링
  let filteredPapers = [...papers];

  if (initialOrg) {
    filteredPapers = filteredPapers.filter(p => p.organization === initialOrg);
  }
  if (initialDomain) {
    filteredPapers = filteredPapers.filter(p =>
      p.domains.includes(initialDomain as any)
    );
  }
  if (initialTag) {
    filteredPapers = filteredPapers.filter(p => p.tags.includes(initialTag));
  }
  if (showFavoritesOnly) {
    filteredPapers = filteredPapers.filter(p => favorites.has(p.id));
  }

  // 날짜순 정렬
  filteredPapers.sort((a, b) => b.date.localeCompare(a.date));

  const activeFilter = initialOrg || initialDomain || initialTag || showFavoritesOnly;
  const favoriteCount = papers.filter(p => favorites.has(p.id)).length;

  return (
    <div className="space-y-6">
      {/* Favorites Filter */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            showFavoritesOnly
              ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={showFavoritesOnly ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
          <span className="text-sm font-medium">즐겨찾기</span>
          {isLoaded && (
            <span className="text-xs bg-neutral-800 px-1.5 py-0.5 rounded">
              {favoriteCount}
            </span>
          )}
        </button>

        {activeFilter && (
          <a
            href="/papers"
            onClick={() => setShowFavoritesOnly(false)}
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            필터 초기화 &times;
          </a>
        )}
      </div>

      {/* Domain Filters */}
      <div className="flex flex-wrap gap-2">
        {domains.map(d => (
          <a
            key={d}
            href={`/papers?domain=${d}`}
            className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
              initialDomain === d
                ? 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/50'
                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
            }`}
          >
            {d}
          </a>
        ))}
      </div>

      {/* Active Filter Info */}
      {activeFilter && (
        <div className="text-sm text-neutral-400">
          {filteredPapers.length}개의 논문
          {initialOrg && <span> - <strong className="text-white">{initialOrg}</strong></span>}
          {initialDomain && <span> - <strong className="text-white">{initialDomain}</strong></span>}
          {initialTag && <span> - <strong className="text-white">#{initialTag}</strong></span>}
          {showFavoritesOnly && <span> - <strong className="text-yellow-400">즐겨찾기</strong></span>}
        </div>
      )}

      {/* Papers Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredPapers.map(paper => (
          <PaperCard
            key={paper.id}
            paper={paper}
            isFavorite={isFavorite(paper.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {filteredPapers.length === 0 && (
        <div className="text-center py-12 text-neutral-500">
          {showFavoritesOnly
            ? '즐겨찾기한 논문이 없습니다.'
            : '검색 결과가 없습니다.'}
        </div>
      )}
    </div>
  );
}
