import { papers, getAllDomains } from '@/data/papers';
import { HomeContent } from '@/components/HomeContent';

export default function Home() {
  const domains = getAllDomains();

  const stats = {
    total: papers.length,
    deepseek: papers.filter(p => p.organization === 'DeepSeek').length,
    deepmind: papers.filter(p => p.organization === 'DeepMind').length,
  };

  return (
    <HomeContent
      papers={papers}
      domains={domains}
      stats={stats}
    />
  );
}
