import GraphContent from '@/components/GraphContent';

export default function GraphPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Paper Graph</h1>
        <p className="text-neutral-400 mt-1">
          논문 간의 관계를 시각화합니다. 조직별로 색상이 구분됩니다.
        </p>
      </div>
      <GraphContent />
    </div>
  );
}
