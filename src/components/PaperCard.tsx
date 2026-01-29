'use client';

import { Paper } from '@/types/paper';
import { StarButton } from './StarButton';

const orgColors: Record<string, string> = {
  DeepSeek: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  DeepMind: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Alibaba: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  OpenAI: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  Anthropic: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Meta: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

interface PaperCardProps {
  paper: Paper;
  showDetails?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function PaperCard({
  paper,
  showDetails = false,
  isFavorite = false,
  onToggleFavorite,
}: PaperCardProps) {
  const orgStyle = orgColors[paper.organization] || 'bg-neutral-500/10 text-neutral-400';

  return (
    <div className="relative bg-neutral-900 rounded-lg p-5 border border-neutral-800 hover:border-neutral-700 transition-colors">
      {/* Star Button */}
      {onToggleFavorite && (
        <div className="absolute top-3 right-3 z-10">
          <StarButton
            paperId={paper.id}
            isFavorite={isFavorite}
            onToggle={onToggleFavorite}
          />
        </div>
      )}

      {/* Header with Link */}
      <div className="flex items-start justify-between gap-4 mb-3 pr-8">
        <div className="flex-1">
          <a href={`/papers/${paper.id}`} className="block group">
            <h3 className="font-semibold text-white leading-tight group-hover:text-blue-400 transition-colors">
              {paper.title}
            </h3>
          </a>
          {paper.titleKo && (
            <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{paper.titleKo}</p>
          )}
        </div>
        <span className={`text-xs px-2 py-1 rounded border shrink-0 ${orgStyle}`}>
          {paper.organization}
        </span>
      </div>

      {/* Summary */}
      <a href={`/papers/${paper.id}`} className="block">
        <p className="text-sm text-neutral-400 mb-3 line-clamp-2 hover:text-neutral-300 transition-colors">
          {paper.summary}
        </p>
      </a>

      {showDetails && (
        <div className="space-y-3 mb-4">
          <div>
            <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Key Innovation
            </h4>
            <p className="text-sm text-neutral-300">{paper.keyInnovation}</p>
          </div>
          <div>
            <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Practical Insight
            </h4>
            <p className="text-sm text-neutral-300">{paper.practicalInsight}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {paper.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 bg-neutral-800 text-neutral-400 rounded"
            >
              #{tag}
            </span>
          ))}
          {paper.tags.length > 3 && (
            <span className="text-xs text-neutral-500">
              +{paper.tags.length - 3}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* External Links */}
          {paper.arxivUrl && (
            <a
              href={paper.arxivUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-neutral-300 transition-colors"
              title="arXiv / Paper"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
                <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
              </svg>
            </a>
          )}
          {paper.githubUrl && (
            <a
              href={paper.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-neutral-300 transition-colors"
              title="GitHub"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
            </a>
          )}
          <span className="text-xs text-neutral-500">{paper.date}</span>
        </div>
      </div>
    </div>
  );
}
