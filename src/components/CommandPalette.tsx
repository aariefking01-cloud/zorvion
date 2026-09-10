import { useEffect, useState, useRef } from 'react';
import {
  Search, FolderOpen, GitBranch, Network, Shield, FlaskConical,
  TrendingUp, Settings, FileText, MapPin, Zap, HelpCircle, ArrowRight,
} from 'lucide-react';
import type { ViewId } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  onNavigate: (view: ViewId) => void;
  onStartAnalysis: () => void;
}

interface Command {
  id: string;
  label: string;
  description: string;
  icon: typeof Search;
  action: () => void;
  category: string;
}

export function CommandPalette({ open, onClose, onNavigate, onStartAnalysis }: Props) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    { id: 'new-analysis', label: 'Start New Analysis', description: 'Begin a new decision intelligence analysis', icon: Zap, action: () => { onStartAnalysis(); }, category: 'Action' },
    { id: 'nav-home', label: 'Intelligence Center', description: 'Go to the ZORVION Intelligence Center', icon: Search, action: () => onNavigate('home'), category: 'Navigate' },
    { id: 'nav-decisions', label: 'Open Decisions', description: 'View decision history and projects', icon: FolderOpen, action: () => onNavigate('decisions'), category: 'Navigate' },
    { id: 'nav-causal', label: 'Open Causal Map', description: 'Explore the causal relationship graph', icon: Network, action: () => onNavigate('causal-map'), category: 'Navigate' },
    { id: 'nav-consequences', label: 'Find Consequences', description: 'Explore cascade effects and unknown consequences', icon: GitBranch, action: () => onNavigate('consequences'), category: 'Navigate' },
    { id: 'nav-scenarios', label: 'Open Scenario Lab', description: 'Create and compare scenarios', icon: FlaskConical, action: () => onNavigate('scenarios'), category: 'Navigate' },
    { id: 'nav-simulations', label: 'Run Simulation', description: 'Open the simulation environment', icon: TrendingUp, action: () => onNavigate('simulations'), category: 'Navigate' },
    { id: 'nav-risk', label: 'Risk Intelligence', description: 'View the risk intelligence center', icon: Shield, action: () => onNavigate('risk'), category: 'Navigate' },
    { id: 'nav-optimization', label: 'Optimization', description: 'Compare alternatives and find optimal options', icon: Settings, action: () => onNavigate('optimization'), category: 'Navigate' },
    { id: 'nav-location', label: 'Jump to Location', description: 'Open location intelligence map', icon: MapPin, action: () => onNavigate('home'), category: 'Navigate' },
    { id: 'nav-report', label: 'Generate Report', description: 'Create a decision intelligence report', icon: FileText, action: () => onNavigate('decisions'), category: 'Action' },
    { id: 'nav-settings', label: 'Open Settings', description: 'Configure ZORVION system settings', icon: Settings, action: () => onNavigate('settings'), category: 'Navigate' },
  ];

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); }
      if (e.key === 'Enter' && filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, filtered, selectedIndex, onClose]);

  if (!open) return null;

  const categories = [...new Set(filtered.map(c => c.category))];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 z-fade-in-fast"
      style={{ background: 'rgba(10, 11, 15, 0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[560px] z-surface-raised overflow-hidden flex flex-col"
        style={{ boxShadow: 'var(--z-shadow-lg)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--z-border)]">
          <Search size={16} className="z-text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search decisions, scenarios, consequences, or type a command..."
            className="flex-1 bg-transparent text-[14px] text-[var(--z-text-primary)] placeholder:text-[var(--z-text-dim)] outline-none"
          />
          <span className="text-[10px] z-text-dim z-mono px-1.5 py-0.5 rounded border border-[var(--z-border)]">ESC</span>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto py-1">
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center">
              <HelpCircle size={24} className="mx-auto z-text-dim mb-2" />
              <p className="text-[13px] z-text-muted">No commands found for "{query}"</p>
            </div>
          )}
          {categories.map(cat => (
            <div key={cat}>
              <div className="px-4 pt-2 pb-1 z-label">{cat}</div>
              {filtered.filter(c => c.category === cat).map(cmd => {
                const idx = filtered.indexOf(cmd);
                const Icon = cmd.icon;
                const selected = idx === selectedIndex;
                return (
                  <button
                    key={cmd.id}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    onClick={() => { cmd.action(); onClose(); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${selected ? 'bg-[var(--z-elevated-2)]' : ''}`}
                  >
                    <Icon size={15} strokeWidth={1.8} className={selected ? 'text-[var(--z-accent)]' : 'z-text-muted'} />
                    <div className="flex-1 min-w-0">
                      <div className={`text-[13px] ${selected ? 'text-[var(--z-text-primary)]' : 'z-text-secondary'}`}>{cmd.label}</div>
                      <div className="text-[11px] z-text-dim truncate">{cmd.description}</div>
                    </div>
                    {selected && <ArrowRight size={13} className="text-[var(--z-accent)]" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--z-border)] text-[10px] z-text-dim">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><kbd className="z-mono">↑↓</kbd> Navigate</span>
            <span className="flex items-center gap-1"><kbd className="z-mono">↵</kbd> Select</span>
            <span className="flex items-center gap-1"><kbd className="z-mono">ESC</kbd> Close</span>
          </div>
          <span className="z-text-accent">ZORVION Command</span>
        </div>
      </div>
    </div>
  );
}
