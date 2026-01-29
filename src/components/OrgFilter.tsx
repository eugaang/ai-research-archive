import { papers } from '@/data/papers';

const orgs = [
  { name: 'DeepSeek', color: 'bg-blue-500' },
  { name: 'DeepMind', color: 'bg-emerald-500' },
  { name: 'OpenAI', color: 'bg-violet-500' },
  { name: 'Anthropic', color: 'bg-pink-500' },
  { name: 'Meta', color: 'bg-cyan-500' },
  { name: 'Alibaba', color: 'bg-orange-500' },
  { name: 'MIT', color: 'bg-red-500' },
  { name: 'Google', color: 'bg-yellow-500' },
  { name: 'Microsoft', color: 'bg-sky-500' },
  { name: 'Stanford', color: 'bg-rose-500' },
  { name: 'Berkeley', color: 'bg-indigo-500' },
];

export function OrgFilter() {
  return (
    <div className="flex flex-wrap gap-3">
      {orgs.map(org => {
        const count = papers.filter(p => p.organization === org.name).length;
        if (count === 0) return null;

        return (
          <a
            key={org.name}
            href={`/papers?org=${org.name}`}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors"
          >
            <span className={`w-2 h-2 rounded-full ${org.color}`} />
            <span className="text-sm font-medium">{org.name}</span>
            <span className="text-xs text-neutral-500">{count}</span>
          </a>
        );
      })}
    </div>
  );
}
