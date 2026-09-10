import {
  Activity, GitBranch, AlertTriangle, TrendingUp, Shield,
  Settings, FileText, User, Cpu,
} from 'lucide-react';
import { Panel, SectionLabel } from '../shared/Panel';
import { ACTIVITY_LOG } from '@/data/demoData';
import type { ActivityEntry, ViewId } from '@/types';

const typeConfig: Record<ActivityEntry['type'], { icon: typeof Activity; color: string; label: string }> = {
  analysis: { icon: GitBranch, color: 'var(--z-accent)', label: 'Analysis' },
  discovery: { icon: AlertTriangle, color: 'var(--z-warning)', label: 'Discovery' },
  simulation: { icon: TrendingUp, color: 'var(--z-violet)', label: 'Simulation' },
  optimization: { icon: Settings, color: 'var(--z-success)', label: 'Optimization' },
  risk: { icon: Shield, color: 'var(--z-danger)', label: 'Risk' },
  report: { icon: FileText, color: 'var(--z-accent)', label: 'Report' },
  manual: { icon: User, color: 'var(--z-text-muted)', label: 'Manual' },
};

interface Props {
  onNavigate: (view: ViewId) => void;
}

export function ActivityView({ onNavigate }: Props) {
  return (
    <div className="h-full flex flex-col">
      <div className="px-5 py-3 border-b border-[var(--z-border)] flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--z-text-primary)]">Activity</h2>
          <p className="text-[11px] z-text-muted mt-0.5">
            System and user activity log — analysis, discoveries, and modifications
          </p>
        </div>
        <span className="z-tag z-tag--demo">Demo Log</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[800px] mx-auto px-6 py-5">
          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-[var(--z-border)]" />
            <div className="space-y-3">
              {ACTIVITY_LOG.map((entry, i) => {
                const config = typeConfig[entry.type];
                const Icon = config.icon;
                return (
                  <button
                    key={entry.id}
                    onClick={() => entry.view && onNavigate(entry.view)}
                    className="relative flex gap-4 w-full text-left z-fade-in"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                      style={{
                        background: 'var(--z-elevated-2)',
                        border: `1.5px solid ${config.color}`,
                      }}
                    >
                      <Icon size={14} style={{ color: config.color }} />
                    </div>
                    <div className="flex-1 z-surface p-3.5 hover:border-[var(--z-border-bright)] transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-medium" style={{ color: config.color }}>{config.label}</span>
                          <span className="text-[10px] z-text-dim">·</span>
                          <span className="text-[10px] z-text-dim flex items-center gap-1">
                            {entry.actor === 'system' ? <Cpu size={9} /> : <User size={9} />}
                            {entry.actor}
                          </span>
                        </div>
                        <span className="text-[10px] z-text-dim z-mono">{entry.timestamp}</span>
                      </div>
                      <p className="text-[12px] z-text-secondary leading-relaxed">{entry.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
