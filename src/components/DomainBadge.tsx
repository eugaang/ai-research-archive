interface DomainBadgeProps {
  domain: string;
  active?: boolean;
}

const domainColors: Record<string, string> = {
  LLM: 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20',
  Reasoning: 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20',
  Vision: 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20',
  Multimodal: 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20',
  Robotics: 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20',
  Agent: 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20',
  RAG: 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20',
  Science: 'bg-teal-500/10 text-teal-400 hover:bg-teal-500/20',
  Healthcare: 'bg-red-500/10 text-red-400 hover:bg-red-500/20',
  Efficiency: 'bg-lime-500/10 text-lime-400 hover:bg-lime-500/20',
};

export function DomainBadge({ domain, active = false }: DomainBadgeProps) {
  const colorClass = domainColors[domain] || 'bg-neutral-500/10 text-neutral-400 hover:bg-neutral-500/20';

  return (
    <a
      href={`/papers?domain=${domain}`}
      className={`text-sm px-3 py-1.5 rounded-full transition-colors ${colorClass} ${
        active ? 'ring-1 ring-current' : ''
      }`}
    >
      {domain}
    </a>
  );
}
