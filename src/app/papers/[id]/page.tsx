import { papers, getPaperById } from '@/data/papers';
import { notFound } from 'next/navigation';
import { PaperDetail } from '@/components/PaperDetail';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PaperDetailPage({ params }: PageProps) {
  const { id } = await params;
  const paper = getPaperById(id);

  if (!paper) {
    notFound();
  }

  const relatedPapers = (paper.relatedPapers || [])
    .map(id => getPaperById(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  const buildUponPapers = (paper.buildUpon || [])
    .map(id => getPaperById(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <PaperDetail
      paper={paper}
      relatedPapers={relatedPapers}
      buildUponPapers={buildUponPapers}
    />
  );
}

export function generateStaticParams() {
  return papers.map(paper => ({
    id: paper.id,
  }));
}
