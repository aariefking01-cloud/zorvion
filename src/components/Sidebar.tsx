import {
  LayoutDashboard, FolderOpen, GitBranch, Network, AlertTriangle,
  FlaskConical, TrendingUp, Shield, BookOpen, Activity, Settings, MapPin,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import type { ViewId } from '@/types';
import { ZorvionLogo } from './ZorvionLogo';
import { StatusDot } from './shared/StatusDot';
import { SYSTEM_STATUS } from '@/data/demoData';

interface Props {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems: { id: ViewId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'home', label: 'Intelligence Center', icon: LayoutDashboard },
  { id: 'decisions', label: 'Decisions', icon: FolderOpen },
  { id: 'scenarios', label: 'Scenario Lab', icon: FlaskConical },
  { id: 'causal-map', label: 'Causal Map', icon: Network },
  { id: 'consequences', label: 'Consequences', icon: GitBranch },
  { id: 'simulations', label: 'Simulations', icon: TrendingUp },
  { id: 'optimization', label: 'Optimization', icon: Settings },
  { id: 'risk', label: 'Risk Intelligence', icon: Shield },
  { id: 'location', label: 'Location', icon: MapPin },
  { id: 'knowledge', label: 'Knowledge', icon: BookOpen },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeView, onNavigate, collapsed, onToggleCollapse }: Props) {
  return (
    <aside
      className="flex flex-col border-r border-[var(--z-border)] bg-[var(--z-surface)] transition-all duration-300 z-30"
      style={{ width: collapsed ? 56 : 220, flexShrink: 0 }}
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-2.5 px-3.5 h-14 border-b border-[var(--z-border)]" style={{ height: 56 }}>
        <ZorvionLogo size={22} />
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-bold tracking-[0.12em] text-[var(--z-text-primary)] leading-none">ZORVION</div>
            <div className="text-[8px] tracking-[0.1em] z-text-dim mt-0.5">CONSEQUENCE INTELLIGENCE</div>
          </div>
        )}
      </div>

      {/* Workspace selector */}
      {!collapsed && (
        <div className="px-3 py-2.5 border-b border-[var(--z-border)]">
          <button className="w-full flex items-center justify-between px-2.5 py-2 rounded-md bg-[var(--z-elevated)] border border-[var(--z-border)] hover:border-[var(--z-border-bright)] transition-colors text-left">
            <div className="min-w-0">
              <div className="text-[9px] z-text-dim tracking-wider uppercase">Workspace</div>
              <div className="text-[12px] text-[var(--z-text-primary)] truncate">Highway Corridor</div>
            </div>
            <ChevronRight size={14} className="z-text-dim flex-shrink-0" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        <div className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const active = activeView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] transition-all
                  ${active
                    ? 'bg-[var(--z-elevated-2)] text-[var(--z-text-primary)] border border-[var(--z-border-light)]'
                    : 'text-[var(--z-text-secondary)] hover:text-[var(--z-text-primary)] hover:bg-[var(--z-elevated)] border border-transparent'
                  }
                `}
                style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  size={16}
                  strokeWidth={1.8}
                  style={{ color: active ? 'var(--z-accent)' : undefined, flexShrink: 0 }}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {active && !collapsed && (
                  <span className="ml-auto w-1 h-1 rounded-full bg-[var(--z-accent)]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* System status */}
      {!collapsed && (
        <div className="px-3 py-2.5 border-t border-[var(--z-border)] space-y-1.5">
          {SYSTEM_STATUS.slice(0, 4).map((s) => (
            <div key={s.label} className="flex items-center justify-between text-[10px]">
              <span className="z-text-muted tracking-wide">{s.label}</span>
              <div className="flex items-center gap-1.5">
                <StatusDot status={s.status === 'online' ? 'online' : s.status === 'active' ? 'active' : 'ready'} size={5} pulse={s.status === 'active'} />
                <span className="z-text-dim">{s.detail}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={onToggleCollapse}
        className="flex items-center justify-center h-9 border-t border-[var(--z-border)] text-[var(--z-text-dim)] hover:text-[var(--z-text-secondary)] hover:bg-[var(--z-elevated)] transition-colors"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
