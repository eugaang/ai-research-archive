'use client';

import { Paper } from '@/types/paper';
import { DomainBadge } from './DomainBadge';
import { PaperCard } from './PaperCard';
import { useFavorites } from '@/hooks/useFavorites';

const orgColors: Record<string, string> = {
  DeepSeek: 'text-blue-400',
  DeepMind: 'text-emerald-400',
  Alibaba: 'text-orange-400',
  OpenAI: 'text-violet-400',
  Anthropic: 'text-pink-400',
  Meta: 'text-cyan-400',
};

interface PaperDetailProps {
  paper: Paper;
  relatedPapers: Paper[];
  buildUponPapers: Paper[];
}

export function PaperDetail({ paper, relatedPapers, buildUponPapers }: PaperDetailProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const orgColor = orgColors[paper.organization] || 'text-neutral-400';
  const starred = isFavorite(paper.id);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Back */}
      <a
        href="/papers"
        className="text-sm text-neutral-400 hover:text-white transition-colors"
      >
        &larr; Back to Papers
      </a>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${orgColor}`}>
            {paper.organization}
          </span>
          <span className="text-neutral-600">|</span>
          <span className="text-sm text-neutral-500">{paper.date}</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{paper.title}</h1>
            {paper.titleKo && (
              <p className="text-lg text-neutral-400 mt-1">{paper.titleKo}</p>
            )}
          </div>
          <button
            onClick={() => toggleFavorite(paper.id)}
            className={`p-2 rounded-lg border transition-colors shrink-0 ${
              starred
                ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-700'
            }`}
            title={starred ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={starred ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={2}
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Domains & Tags */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {paper.domains.map(domain => (
            <DomainBadge key={domain} domain={domain} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {paper.tags.map(tag => (
            <a
              key={tag}
              href={`/papers?tag=${tag}`}
              className="text-sm px-2 py-1 bg-neutral-800 text-neutral-400 rounded hover:bg-neutral-700 transition-colors"
            >
              #{tag}
            </a>
          ))}
        </div>
      </div>

      {/* Summary */}
      <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
        <p className="text-lg text-neutral-300 leading-relaxed">
          {paper.summary}
        </p>
      </section>

      {/* Key Innovation */}
      {paper.keyInnovation && (
        <section className="space-y-2">
          <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
            Key Innovation
          </h2>
          <p className="text-neutral-300 leading-relaxed">
            {paper.keyInnovation}
          </p>
        </section>
      )}

      {/* Practical Insight */}
      {paper.practicalInsight && (
        <section className="space-y-2">
          <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
            Practical Insight
          </h2>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
            <p className="text-emerald-300 leading-relaxed">
              {paper.practicalInsight}
            </p>
          </div>
        </section>
      )}

      {/* Links */}
      {(paper.arxivUrl || paper.githubUrl) && (
        <section className="flex gap-4">
          {paper.arxivUrl && (
            <a
              href={paper.arxivUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 transition-colors"
            >
              arXiv &rarr;
            </a>
          )}
          {paper.githubUrl && (
            <a
              href={paper.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 transition-colors"
            >
              GitHub &rarr;
            </a>
          )}
        </section>
      )}

      {/* Build Upon */}
      {buildUponPapers.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
            Built Upon
          </h2>
          <div className="grid gap-3">
            {buildUponPapers.map(p => (
              <PaperCard
                key={p.id}
                paper={p}
                isFavorite={isFavorite(p.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </section>
      )}

      {/* Related Papers */}
      {relatedPapers.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
            Related Papers
          </h2>
          <div className="grid gap-3">
            {relatedPapers.map(p => (
              <PaperCard
                key={p.id}
                paper={p}
                isFavorite={isFavorite(p.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
