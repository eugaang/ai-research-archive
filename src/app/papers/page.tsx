import { papers, getAllDomains } from '@/data/papers';
import { PaperList } from '@/components/PaperList';

interface PageProps {
  searchParams: Promise<{ org?: string; domain?: string; tag?: string }>;
}

export default async function PapersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { org, domain, tag } = params;
  const domains = getAllDomains();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Papers</h1>
      <PaperList
        papers={papers}
        domains={domains}
        initialOrg={org}
        initialDomain={domain}
        initialTag={tag}
      />
    </div>
  );
}
