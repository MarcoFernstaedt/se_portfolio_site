import { Project } from '@/types';

const statusConfig: Record<
  Project['status'],
  { color: string; bg: string; pulse: boolean; label: string }
> = {
  Active: {
    color: '#00ff88',
    bg: 'rgba(0,255,136,0.1)',
    pulse: true,
    label: 'Active',
  },
  Deployed: {
    color: '#00d4ff',
    bg: 'rgba(0,212,255,0.1)',
    pulse: false,
    label: 'Deployed',
  },
  'In Development': {
    color: '#ffaa00',
    bg: 'rgba(255,170,0,0.1)',
    pulse: true,
    label: 'In Development',
  },
  Archived: {
    color: '#4a5568',
    bg: 'rgba(74,85,104,0.1)',
    pulse: false,
    label: 'Archived',
  },
};

export default function StatusBadge({ status }: { status: Project['status'] }) {
  const cfg = statusConfig[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-mono"
      style={{
        color: cfg.color,
        backgroundColor: cfg.bg,
        border: `1px solid ${cfg.color}33`,
      }}
      aria-label={`Status: ${cfg.label}`}
    >
      <span
        className={cfg.pulse ? 'pulse-dot' : ''}
        style={{
          display: 'inline-block',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: cfg.color,
        }}
        aria-hidden="true"
      />
      {cfg.label}
    </span>
  );
}
