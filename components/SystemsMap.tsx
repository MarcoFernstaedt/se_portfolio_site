'use client';

import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { projects } from '@/lib/data';
import { Project } from '@/types';

interface SystemsMapProps {
  onProjectClick: (project: Project) => void;
}

function RootNode({ data }: { data: { label: string } }) {
  return (
    <div
      className="px-4 py-3 rounded-lg text-center font-mono font-bold text-sm"
      style={{
        backgroundColor: 'rgba(0,212,255,0.15)',
        border: '2px solid #00d4ff',
        color: '#00d4ff',
        textShadow: '0 0 10px rgba(0,212,255,0.5)',
        boxShadow: '0 0 20px rgba(0,212,255,0.2)',
        minWidth: '160px',
      }}
    >
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      {data.label}
    </div>
  );
}

const categoryColor: Record<Project['category'], string> = {
  accessibility: '#00ff88',
  platform: '#00d4ff',
  tooling: '#ffaa00',
  infrastructure: '#0080ff',
};

function ProjectNode({ data }: { data: { label: string; status: string; category: Project['category']; onClick: () => void } }) {
  const color = categoryColor[data.category];
  return (
    <button
      onClick={data.onClick}
      className="px-3 py-2.5 rounded-lg text-left font-mono text-xs transition-all hover:scale-105 focus:scale-105 w-full"
      style={{
        backgroundColor: `${color}12`,
        border: `1px solid ${color}55`,
        color: '#e2e8f0',
        boxShadow: `0 0 12px ${color}15`,
        minWidth: '160px',
        cursor: 'pointer',
      }}
      aria-label={`Open project: ${data.label}`}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <div className="font-bold mb-1" style={{ color }}>
        {data.label}
      </div>
      <div className="text-xs" style={{ color: '#4a5568' }}>
        {data.status}
      </div>
    </button>
  );
}

const nodeTypes = { root: RootNode, project: ProjectNode };

export default function SystemsMap({ onProjectClick }: SystemsMapProps) {
  const initialNodes: Node[] = useMemo(() => {
    const root: Node = {
      id: 'root',
      type: 'root',
      position: { x: 250, y: 0 },
      data: { label: 'MARCO FERNSTAEDT' },
    };

    const projectNodes: Node[] = projects.map((p, i) => ({
      id: p.id,
      type: 'project',
      position: { x: i * 200, y: 130 },
      data: {
        label: p.name.split(' ').slice(0, 3).join(' '),
        status: p.status,
        category: p.category,
        onClick: () => onProjectClick(p),
      },
    }));

    return [root, ...projectNodes];
  }, [onProjectClick]);

  const initialEdges: Edge[] = useMemo(
    () =>
      projects.map((p) => ({
        id: `root-${p.id}`,
        source: 'root',
        target: p.id,
        style: { stroke: '#1e3a5f', strokeWidth: 1.5 },
        animated: p.status === 'Active' || p.status === 'In Development',
      })),
    []
  );

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <section
      aria-labelledby="systems-map-heading"
      className="rounded-lg overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-panel)',
        border: '1px solid var(--border-color)',
        height: 'clamp(240px, 40vw, 340px)',
      }}
    >
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: '1px solid var(--border-color)' }}
      >
        <h2
          id="systems-map-heading"
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: '#00d4ff' }}
        >
          ◈ Systems Map
        </h2>
        <span className="text-xs" style={{ color: '#4a5568' }}>
          Click nodes to inspect
        </span>
      </div>

      <div style={{ height: 'calc(100% - 48px)' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          zoomOnScroll={false}
          panOnDrag={false}
          style={{ background: 'transparent' }}
          aria-label="Systems map showing project relationships"
        >
          <Background
            color="#1e3a5f"
            gap={24}
            size={1}
            style={{ opacity: 0.4 }}
          />
        </ReactFlow>
      </div>
    </section>
  );
}
