'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { papers } from '@/data/papers';
import { Paper, Organization, Domain } from '@/types/paper';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
});

interface GraphNode {
  id: string;
  name: string;
  organization: Organization;
  domains: Domain[];
  date: string;
  val: number;
}

interface GraphLink {
  source: string;
  target: string;
  type: 'buildUpon' | 'sameOrg' | 'sameDomain';
}

const ORG_COLORS: Record<string, string> = {
  DeepSeek: '#3b82f6',    // blue
  DeepMind: '#22c55e',    // green
  OpenAI: '#a855f7',      // purple
  Anthropic: '#f97316',   // orange
  Meta: '#ef4444',        // red
  Google: '#eab308',      // yellow
  Microsoft: '#06b6d4',   // cyan
  Alibaba: '#ec4899',     // pink
  MIT: '#8b5cf6',         // violet
  Stanford: '#14b8a6',    // teal
  Berkeley: '#f59e0b',    // amber
  CMU: '#6366f1',         // indigo
  Princeton: '#84cc16',   // lime
  Tsinghua: '#d946ef',    // fuchsia
  Peking: '#64748b',      // slate
};

function buildGraphData() {
  const nodes: GraphNode[] = papers.map((p) => ({
    id: p.id,
    name: p.title.length > 40 ? p.title.slice(0, 40) + '...' : p.title,
    organization: p.organization,
    domains: p.domains,
    date: p.date,
    val: 5 + (p.buildUpon?.length || 0) * 2,
  }));

  const links: GraphLink[] = [];
  const paperIds = new Set(papers.map((p) => p.id));

  // buildUpon relationships
  papers.forEach((paper) => {
    if (paper.buildUpon) {
      paper.buildUpon.forEach((parentId) => {
        if (paperIds.has(parentId)) {
          links.push({
            source: parentId,
            target: paper.id,
            type: 'buildUpon',
          });
        }
      });
    }
  });

  return { nodes, links };
}

export default function GraphContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [graphData] = useState(buildGraphData);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: Math.max(500, window.innerHeight - 250),
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node);
  }, []);

  const handleNodeHover = useCallback((node: GraphNode | null) => {
    setHoveredNode(node);
  }, []);

  const nodeCanvasObject = useCallback(
    (node: GraphNode & { x?: number; y?: number }, ctx: CanvasRenderingContext2D, globalScale: number) => {
      if (!node.x || !node.y) return;

      const label = node.name;
      const fontSize = 12 / globalScale;
      const nodeSize = node.val;
      const isHovered = hoveredNode?.id === node.id;
      const isSelected = selectedNode?.id === node.id;

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI);
      ctx.fillStyle = ORG_COLORS[node.organization] || '#666';
      ctx.fill();

      // Highlight ring
      if (isHovered || isSelected) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2 / globalScale;
        ctx.stroke();
      }

      // Label (only show when zoomed in enough)
      if (globalScale > 0.7 || isHovered || isSelected) {
        ctx.font = `${fontSize}px Sans-Serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillText(label, node.x, node.y + nodeSize + fontSize);
      }
    },
    [hoveredNode, selectedNode]
  );

  const linkColor = useCallback((link: GraphLink) => {
    switch (link.type) {
      case 'buildUpon':
        return 'rgba(255, 255, 255, 0.6)';
      case 'sameOrg':
        return 'rgba(100, 100, 100, 0.2)';
      case 'sameDomain':
        return 'rgba(100, 100, 100, 0.1)';
      default:
        return 'rgba(100, 100, 100, 0.3)';
    }
  }, []);

  const linkWidth = useCallback((link: GraphLink) => {
    return link.type === 'buildUpon' ? 2 : 0.5;
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 text-xs">
        {Object.entries(ORG_COLORS).map(([org, color]) => (
          <div key={org} className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-neutral-400">{org}</span>
          </div>
        ))}
      </div>

      <div
        ref={containerRef}
        className="border border-neutral-700 rounded-lg overflow-hidden bg-neutral-900"
      >
        <ForceGraph2D
          graphData={graphData}
          width={dimensions.width}
          height={dimensions.height}
          nodeCanvasObject={nodeCanvasObject as any}
          nodePointerAreaPaint={((node: GraphNode & { x?: number; y?: number }, color: string, ctx: CanvasRenderingContext2D) => {
            if (!node.x || !node.y) return;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI);
            ctx.fill();
          }) as any}
          linkColor={linkColor as any}
          linkWidth={linkWidth as any}
          linkDirectionalArrowLength={4}
          linkDirectionalArrowRelPos={1}
          onNodeClick={handleNodeClick as any}
          onNodeHover={handleNodeHover as any}
          backgroundColor="#171717"
          cooldownTicks={100}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
        />
      </div>

      {(selectedNode || hoveredNode) && (
        <div className="p-4 bg-neutral-800 rounded-lg border border-neutral-700">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-white">
                {(selectedNode || hoveredNode)?.name}
              </h3>
              <p className="text-sm text-neutral-400 mt-1">
                {(selectedNode || hoveredNode)?.organization} &middot;{' '}
                {(selectedNode || hoveredNode)?.date}
              </p>
              <div className="flex gap-2 mt-2">
                {(selectedNode || hoveredNode)?.domains.map((domain) => (
                  <span
                    key={domain}
                    className="text-xs px-2 py-0.5 bg-neutral-700 rounded"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            </div>
            <a
              href={`/papers/${(selectedNode || hoveredNode)?.id}`}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              View Details
            </a>
          </div>
        </div>
      )}

      <p className="text-xs text-neutral-500">
        Click and drag to pan. Scroll to zoom. Click on a node to see details.
        Arrows show &quot;built upon&quot; relationships.
      </p>
    </div>
  );
}
