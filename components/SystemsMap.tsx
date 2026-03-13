'use client';

import { useMemo, useState, useEffect } from 'react';
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

function ProjectNode({ data }: { data: { label: string; status: string; category: Project['category']; onClick: () => void; narrow: boolean } }) {
  const color = categoryColor[data.category];
  return (
    <button
      onClick={data.onClick}
      className="px-2.5 py-2 rounded-lg text-left font-mono text-xs transition-all hover:scale-105 focus:scale-105 w-full"
      style={{
        backgroundColor: `${color}12`,
        border: `1px solid ${color}55`,
        color: '#e2e8f0',
        boxShadow: `0 0 12px ${color}15`,
        minWidth: data.narrow ? '120px' : '160px',
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

// Layout constants
const NODE_W = 160;
const NODE_W_NARROW = 130;
const COL_GAP = 200;
const COL_GAP_NARROW = 160;
const ROW_H = 130;

export default function SystemsMap({ onProjectClick }: SystemsMapProps) {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handler = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // On small screens use 2 columns, otherwise single row
  const narrow = windowWidth < 640;
  const cols = narrow ? 2 : projects.length;
  const colGap = narrow ? COL_GAP_NARROW : COL_GAP;
  const nodeW = narrow ? NODE_W_NARROW : NODE_W;
  const totalRows = Math.ceil(projects.length / cols);
  const totalGridW = Math.min(cols, projects.length) * colGap;

  const initialNodes: Node[] = useMemo(() => {
    const root: Node = {
      id: 'root',
      type: 'root',
      position: { x: totalGridW / 2 - nodeW / 2, y: 0 },
      data: { label: 'MARCO FERNSTAEDT' },
    };

    const projectNodes: Node[] = projects.map((p, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      return {
        id: p.id,
        type: 'project',
        position: { x: col * colGap, y: ROW_H + row * (ROW_H - 10) },
        data: {
          label: p.name.split(' ').slice(0, 3).join(' '),
          status: p.status,
          category: p.category,
          onClick: () => onProjectClick(p),
          narrow,
        },
      };
    });

    return [root, ...projectNodes];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onProjectClick, cols, colGap, nodeW, totalGridW, narrow]);

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

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  // Re-sync nodes when layout changes (window resize crosses breakpoint)
  useEffect(() => {
    setNodes(initialNodes);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [narrow]);

  // Height: base 48px header + 130px per row + padding
  const sectionHeight = 48 + totalRows * 130 + 60;

  return (
    <section
      aria-labelledby="systems-map-heading"
      className="rounded-lg overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-panel)',
        border: '1px solid var(--border-color)',
        height: `${sectionHeight}px`,
        minHeight: '240px',
        maxHeight: '420px',
      }}
    >
      <div
        className="flex items-center justify-between px-4 sm:px-5 py-3"
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
          <span className="hidden sm:inline">Click</span>
          <span className="sm:hidden">Tap</span>
          {' '}nodes to inspect
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
