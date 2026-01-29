import { papers } from '@/data/papers';
import { TimelineContent } from '@/components/TimelineContent';

export default function TimelinePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Timeline</h1>
      <TimelineContent papers={papers} />
    </div>
  );
}
