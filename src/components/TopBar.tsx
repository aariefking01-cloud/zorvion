import { Search, Bell, Maximize2, Mic, Command, AlertTriangle } from 'lucide-react';
import { StatusDot } from './shared/StatusDot';

interface Props {
  onOpenCommand: () => void;
  onToggleVoice: () => void;
  onToggleFocus: () => void;
  focusMode: boolean;
  voiceActive: boolean;
  coreStateLabel: string;
}

export function TopBar({ onOpenCommand, onToggleVoice, onToggleFocus, focusMode, voiceActive, coreStateLabel }: Props) {
  return (
    <header
      className="flex items-center justify-between px-4 border-b border-[var(--z-border)] bg-[var(--z-surface)] z-20"
      style={{ height: 48, flexShrink: 0 }}
    >
      {/* Left: System state */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <StatusDot status="active" size={5} pulse />
          <span className="text-[11px] z-text-muted tracking-wider uppercase">Core</span>
          <span className="text-[11px] text-[var(--z-accent)] font-medium">{coreStateLabel}</span>
        </div>
        <div className="h-3 w-px bg-[var(--z-border)]" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] z-text-muted tracking-wider uppercase">Data</span>
          <span className="text-[11px] z-text-secondary">Synced</span>
        </div>
        <div className="h-3 w-px bg-[var(--z-border)] hidden lg:block" />
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-[11px] z-text-muted tracking-wider uppercase">Demo</span>
          <span className="z-tag z-tag--demo">Simulated Data</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5">
        {/* Command palette trigger */}
        <button
          onClick={onOpenCommand}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[var(--z-elevated)] border border-[var(--z-border)] hover:border-[var(--z-border-bright)] transition-colors group"
        >
          <Search size={13} className="z-text-muted group-hover:text-[var(--z-text-secondary)]" />
          <span className="text-[11px] z-text-muted hidden md:inline">Search & command</span>
          <span className="flex items-center gap-0.5 text-[9px] z-text-dim z-mono px-1 py-0.5 rounded border border-[var(--z-border)] hidden md:flex">
            <Command size={8} />K
          </span>
        </button>

        {/* Voice */}
        <button
          onClick={onToggleVoice}
          className={`p-1.5 rounded-md border transition-all ${voiceActive
            ? 'bg-[var(--z-accent-dim)] border-[var(--z-accent)] text-[var(--z-accent-bright)]'
            : 'bg-[var(--z-elevated)] border-[var(--z-border)] text-[var(--z-text-muted)] hover:border-[var(--z-border-bright)] hover:text-[var(--z-text-secondary)]'
          }`}
          title="Voice input"
        >
          <Mic size={14} />
        </button>

        {/* Notifications */}
        <button className="relative p-1.5 rounded-md bg-[var(--z-elevated)] border border-[var(--z-border)] text-[var(--z-text-muted)] hover:border-[var(--z-border-bright)] hover:text-[var(--z-text-secondary)] transition-colors">
          <Bell size={14} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[var(--z-warning)]" />
        </button>

        {/* Focus mode */}
        <button
          onClick={onToggleFocus}
          className={`p-1.5 rounded-md border transition-all ${focusMode
            ? 'bg-[var(--z-accent-dim)] border-[var(--z-accent)] text-[var(--z-accent-bright)]'
            : 'bg-[var(--z-elevated)] border-[var(--z-border)] text-[var(--z-text-muted)] hover:border-[var(--z-border-bright)] hover:text-[var(--z-text-secondary)]'
          }`}
          title="Focus mode (F)"
        >
          <Maximize2 size={14} />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2 ml-1.5 pl-2.5 border-l border-[var(--z-border)]">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--z-accent-dim)] to-[var(--z-violet-dim)] flex items-center justify-center text-[11px] font-semibold text-white">
            AK
          </div>
          <div className="hidden lg:block">
            <div className="text-[11px] text-[var(--z-text-primary)] font-medium leading-none">A. Kovač</div>
            <div className="text-[9px] z-text-dim mt-0.5">Lead Analyst</div>
          </div>
        </div>
      </div>
    </header>
  );
}
