import { useState } from 'react';
import {
  Settings, Monitor, Moon, Sun, Keyboard, Bell, Database,
  Mic, Eye, Sliders,
} from 'lucide-react';
import { Panel, SectionLabel } from '../shared/Panel';
import { StatusDot } from '../shared/StatusDot';

export function SettingsView() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mode, setMode] = useState<'executive' | 'analyst'>('analyst');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="h-full flex flex-col">
      <div className="px-5 py-3 border-b border-[var(--z-border)]">
        <h2 className="text-[16px] font-semibold text-[var(--z-text-primary)]">Settings</h2>
        <p className="text-[11px] z-text-muted mt-0.5">Configure ZORVION system preferences</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[700px] mx-auto px-6 py-5 space-y-4">
          {/* Appearance */}
          <Panel title="Appearance">
            <div className="space-y-4">
              <div>
                <SectionLabel>Theme</SectionLabel>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    onClick={() => setTheme('dark')}
                    className={`z-surface-elevated p-3 flex items-center gap-3 transition-all ${theme === 'dark' ? 'border-[var(--z-accent)]' : ''}`}
                  >
                    <Moon size={16} className={theme === 'dark' ? 'text-[var(--z-accent)]' : 'z-text-muted'} />
                    <div className="text-left">
                      <div className="text-[12px] font-medium text-[var(--z-text-primary)]">Dark</div>
                      <div className="text-[10px] z-text-dim">Primary environment</div>
                    </div>
                    {theme === 'dark' && <StatusDot status="active" size={5} />}
                  </button>
                  <button
                    onClick={() => setTheme('light')}
                    className={`z-surface-elevated p-3 flex items-center gap-3 transition-all opacity-50 ${theme === 'light' ? 'border-[var(--z-accent)]' : ''}`}
                  >
                    <Sun size={16} className="z-text-muted" />
                    <div className="text-left">
                      <div className="text-[12px] font-medium text-[var(--z-text-primary)]">Light</div>
                      <div className="text-[10px] z-text-dim">Coming soon</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <Eye size={14} className="z-text-muted" />
                  <span className="text-[12px] z-text-secondary">Reduced motion</span>
                </div>
                <Toggle on={reducedMotion} onChange={setReducedMotion} />
              </div>
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <Sliders size={14} className="z-text-muted" />
                  <span className="text-[12px] z-text-secondary">High contrast</span>
                </div>
                <Toggle on={highContrast} onChange={setHighContrast} />
              </div>
            </div>
          </Panel>

          {/* Interface mode */}
          <Panel title="Interface Mode">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode('executive')}
                className={`z-surface-elevated p-3 text-left transition-all ${mode === 'executive' ? 'border-[var(--z-accent)]' : ''}`}
              >
                <div className="text-[12px] font-medium text-[var(--z-text-primary)] mb-1">Executive</div>
                <div className="text-[10px] z-text-muted leading-relaxed">
                  Key findings, top risks, recommendation. Streamlined for quick review.
                </div>
              </button>
              <button
                onClick={() => setMode('analyst')}
                className={`z-surface-elevated p-3 text-left transition-all ${mode === 'analyst' ? 'border-[var(--z-accent)]' : ''}`}
              >
                <div className="text-[12px] font-medium text-[var(--z-text-primary)] mb-1">Analyst</div>
                <div className="text-[10px] z-text-muted leading-relaxed">
                  Full causal graph, variables, assumptions, simulation, deep investigation.
                </div>
              </button>
            </div>
          </Panel>

          {/* System */}
          <Panel title="System">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic size={14} className="z-text-muted" />
                  <span className="text-[12px] z-text-secondary">Voice interface</span>
                </div>
                <Toggle on={voiceEnabled} onChange={setVoiceEnabled} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={14} className="z-text-muted" />
                  <span className="text-[12px] z-text-secondary">Notifications</span>
                </div>
                <Toggle on={notifications} onChange={setNotifications} />
              </div>
            </div>
          </Panel>

          {/* Keyboard shortcuts */}
          <Panel title="Keyboard Shortcuts">
            <div className="space-y-2">
              {[
                { keys: ['⌘', 'K'], action: 'Open command palette' },
                { keys: ['F'], action: 'Toggle focus mode' },
                { keys: ['ESC'], action: 'Exit focus / close panel' },
                { keys: ['↑', '↓'], action: 'Navigate command list' },
                { keys: ['↵'], action: 'Select command' },
                { keys: ['Tab'], action: 'Navigate interface' },
              ].map(shortcut => (
                <div key={shortcut.action} className="flex items-center justify-between py-1">
                  <span className="text-[12px] z-text-secondary">{shortcut.action}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, i) => (
                      <kbd key={i} className="z-mono text-[10px] px-1.5 py-0.5 rounded border border-[var(--z-border)] bg-[var(--z-elevated)] z-text-muted">
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Data */}
          <Panel title="Data & Demo">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Database size={14} className="z-text-muted mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[12px] z-text-secondary">Demo Environment</div>
                  <p className="text-[11px] z-text-dim mt-0.5 leading-relaxed">
                    ZORVION is currently running with simulated data. All analysis, consequences,
                    risks, and recommendations are illustrative. No real-time data is being used.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-[var(--z-border)]">
                <span className="z-tag z-tag--demo">Simulated Data</span>
                <span className="z-tag z-tag--simulated">Demo Mode</span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="relative w-9 h-5 rounded-full transition-colors"
      style={{ background: on ? 'var(--z-accent-dim)' : 'var(--z-elevated)', border: `1px solid ${on ? 'var(--z-accent)' : 'var(--z-border)'}` }}
    >
      <div
        className="absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all"
        style={{
          left: on ? '18px' : '2px',
          background: on ? 'var(--z-accent-bright)' : 'var(--z-text-dim)',
          boxShadow: on ? '0 0 6px var(--z-accent-glow)' : 'none',
        }}
      />
    </button>
  );
}
