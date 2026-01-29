'use client';

import { Paper } from '@/types/paper';
import { PaperCard } from './PaperCard';
import { OrgFilter } from './OrgFilter';
import { DomainBadge } from './DomainBadge';
import { useFavorites } from '@/hooks/useFavorites';

interface HomeContentProps {
  papers: Paper[];
  domains: string[];
  stats: {
    total: number;
    deepseek: number;
    deepmind: number;
  };
}

export function HomeContent({ papers, domains, stats }: HomeContentProps) {
  const { isFavorite, toggleFavorite, favorites, isLoaded } = useFavorites();

  const recentPapers = [...papers]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  const favoritePapers = papers.filter(p => favorites.has(p.id));

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">
          나만의 AI 연구 아카이브
        </h1>
        <p className="text-neutral-400 max-w-2xl mx-auto">
          DeepSeek, Google DeepMind 등 최신 AI 연구의 핵심을 정리하고
          <br />
          실무 적용 인사이트를 축적하는 개인 지식 베이스
        </p>
      </section>

      {/* By Organization */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">By Organization</h2>
          <div className="flex items-center gap-4 text-sm text-neutral-400">
            <span>Total <strong className="text-white">{stats.total}</strong></span>
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-yellow-400">
                <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
              </svg>
              <strong className="text-yellow-400">{isLoaded ? favorites.size : '-'}</strong>
            </span>
          </div>
        </div>
        <OrgFilter />
      </section>

      {/* Favorites Section */}
      {isLoaded && favoritePapers.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-yellow-400"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clipRule="evenodd"
                />
              </svg>
              즐겨찾기
            </h2>
            <a
              href="/papers"
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              View all &rarr;
            </a>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {favoritePapers.slice(0, 4).map(paper => (
              <PaperCard
                key={paper.id}
                paper={paper}
                isFavorite={true}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </section>
      )}

      {/* Domains */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Domains</h2>
        <div className="flex flex-wrap gap-2">
          {domains.map(domain => (
            <DomainBadge key={domain} domain={domain} />
          ))}
        </div>
      </section>

      {/* Recent Papers */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Papers</h2>
          <a
            href="/papers"
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            View all &rarr;
          </a>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {recentPapers.map(paper => (
            <PaperCard
              key={paper.id}
              paper={paper}
              isFavorite={isFavorite(paper.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
