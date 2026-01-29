'use client';

import { Paper } from '@/types/paper';
import { PaperCard } from './PaperCard';
import { useFavorites } from '@/hooks/useFavorites';

interface TimelineContentProps {
  papers: Paper[];
}

export function TimelineContent({ papers }: TimelineContentProps) {
  const { isFavorite, toggleFavorite } = useFavorites();

  // Group papers by date (YYYY-MM)
  const papersByDate = papers.reduce((acc, paper) => {
    if (!acc[paper.date]) {
      acc[paper.date] = [];
    }
    acc[paper.date].push(paper);
    return acc;
  }, {} as Record<string, Paper[]>);

  // Sort dates descending
  const sortedDates = Object.keys(papersByDate).sort((a, b) =>
    b.localeCompare(a)
  );

  return (
    <div className="space-y-12">
      {sortedDates.map(date => {
        const [year, month] = date.split('-');
        const monthName = new Date(`${date}-01`).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
        });

        return (
          <section key={date} className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-10 bottom-0 w-px bg-neutral-800" />

            {/* Date header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-8 rounded-full bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center">
                <span className="text-xs font-bold text-neutral-400">
                  {month}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-neutral-300">
                {monthName}
              </h2>
              <span className="text-sm text-neutral-500">
                {papersByDate[date].length} papers
              </span>
            </div>

            {/* Papers */}
            <div className="ml-12 grid gap-4 md:grid-cols-2">
              {papersByDate[date].map(paper => (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                  isFavorite={isFavorite(paper.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
