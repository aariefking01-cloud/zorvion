import { useState, useEffect } from 'react';
import {
  Check, Loader2, ArrowRight, MapPin, Mic, FileText,
  Zap, GitBranch, Network, AlertTriangle, TrendingUp, Shield, Settings,
} from 'lucide-react';
import { ZorvionCore } from '../ZorvionCore';
import { SectionLabel } from '../shared/Panel';
import { StatusDot } from '../shared/StatusDot';
import type { ViewId, CoreState } from '@/types';
import { ANALYSIS_STAGES, DEMO_DECISION } from '@/data/demoData';

interface Props {
  onNavigate: (view: ViewId) => void;
  onSetCoreState: (state: CoreState) => void;
}

const stageIcons = [Zap, Network, GitBranch, TrendingUp, AlertTriangle, TrendingUp, Shield, Settings];
const stageCoreStates: CoreState[] = ['ANALYZING', 'MAPPING', 'MAPPING', 'DISCOVERING', 'DISCOVERING', 'SIMULATING', 'WARNING', 'OPTIMIZING'];

export function DecisionWorkspace({ onNavigate, onSetCoreState }: Props) {
  const [phase, setPhase] = useState<'input' | 'processing' | 'complete'>('input');
  const [decisionText, setDecisionText] = useState('');
  const [activeStage, setActiveStage] = useState(-1);

  const startAnalysis = () => {
    setPhase('processing');
    setActiveStage(0);
  };

  useEffect(() => {
    if (phase !== 'processing') return;

    if (activeStage >= ANALYSIS_STAGES.length) {
      setPhase('complete');
      onSetCoreState('COMPLETE');
      return;
    }

    if (activeStage >= 0 && activeStage < ANALYSIS_STAGES.length) {
      onSetCoreState(stageCoreStates[activeStage]);
    }

    const timer = setTimeout(() => {
      setActiveStage(s => s + 1);
    }, 700);
    return () => clearTimeout(timer);
  }, [phase, activeStage, onSetCoreState]);

  // Input phase
  if (phase === 'input') {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-[800px] mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <ZorvionCore state="IDLE" size={80} />
            <h1 className="text-[32px] font-bold tracking-tight text-[var(--z-text-primary)] mt-6 mb-2">
              What are you deciding?
            </h1>
            <p className="text-[14px] z-text-secondary max-w-[440px] mx-auto leading-relaxed">
              Describe a decision, problem, or situation. ZORVION will trace causes,
              cascades, and consequences you may not have considered.
            </p>
          </div>

          <div className="z-surface p-6 mb-5">
            <textarea
              value={decisionText}
              onChange={e => setDecisionText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) startAnalysis();
              }}
              placeholder="Describe a decision, problem, or situation..."
              className="w-full bg-transparent text-[16px] text-[var(--z-text-primary)] placeholder:text-[var(--z-text-dim)] outline-none resize-none leading-relaxed"
              rows={4}
              autoFocus
            />
            <div className="flex items-center justify-between pt-3 border-t border-[var(--z-border)]">
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] z-text-muted hover:text-[var(--z-text-secondary)] hover:bg-[var(--z-elevated)] transition-colors">
                  <MapPin size={13} /> Location
                </button>
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] z-text-muted hover:text-[var(--z-text-secondary)] hover:bg-[var(--z-elevated)] transition-colors">
                  <Mic size={13} /> Voice
                </button>
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] z-text-muted hover:text-[var(--z-text-secondary)] hover:bg-[var(--z-elevated)] transition-colors">
                  <FileText size={13} /> Data / File
                </button>
              </div>
              <button
                onClick={startAnalysis}
                disabled={!decisionText.trim() && true}
                className="z-btn z-btn--primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {decisionText.trim() ? 'Analyze' : 'Use Demo Decision'} <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Example decisions */}
          <div>
            <SectionLabel>Example Decisions</SectionLabel>
            <div className="space-y-2 mt-3">
              {[
                'Should we build a hospital here?',
                'Should this city build a new highway?',
                'Where should we locate a new data center?',
                'What happens if we change this policy?',
                'How can we reduce traffic without increasing emissions?',
              ].map(ex => (
                <button
                  key={ex}
                  onClick={() => setDecisionText(ex)}
                  className="w-full text-left z-surface-elevated px-4 py-3 hover:border-[var(--z-border-bright)] hover:bg-[var(--z-elevated-2)] transition-all group flex items-center justify-between"
                >
                  <span className="text-[13px] z-text-secondary group-hover:text-[var(--z-text-primary)] transition-colors">{ex}</span>
                  <ArrowRight size={13} className="z-text-dim group-hover:text-[var(--z-accent)] transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-8">
            <span className="z-tag z-tag--demo">Demo Environment</span>
            <span className="text-[10px] z-text-dim">Analysis uses simulated data for demonstration</span>
          </div>
        </div>
      </div>
    );
  }

  // Processing phase
  if (phase === 'processing') {
    const currentStage = activeStage < ANALYSIS_STAGES.length ? activeStage : ANALYSIS_STAGES.length - 1;
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-full max-w-[600px] px-6">
          <div className="flex flex-col items-center mb-8">
            <ZorvionCore state={stageCoreStates[Math.min(activeStage, 7)]} size={120} />
            <h2 className="text-[20px] font-semibold text-[var(--z-text-primary)] mt-6 mb-1">
              {activeStage < ANALYSIS_STAGES.length ? ANALYSIS_STAGES[Math.min(activeStage, 7)].label : 'Complete'}
            </h2>
            <p className="text-[12px] z-text-muted">
              {activeStage < ANALYSIS_STAGES.length ? ANALYSIS_STAGES[Math.min(activeStage, 7)].description : 'Analysis complete'}
            </p>
          </div>

          {/* Progress stages */}
          <div className="z-surface p-5">
            <div className="space-y-1">
              {ANALYSIS_STAGES.map((stage, i) => {
                const isComplete = i < activeStage;
                const isActive = i === activeStage;
                const isPending = i > activeStage;
                const Icon = stageIcons[i];
                return (
                  <div
                    key={stage.id}
                    className="flex items-center gap-3 py-1.5"
                    style={{ opacity: isPending ? 0.4 : 1, transition: 'opacity 200ms' }}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: isComplete ? 'var(--z-success-dim)' : isActive ? 'var(--z-accent-dim)' : 'var(--z-elevated)',
                        border: `1px solid ${isComplete ? 'var(--z-success)' : isActive ? 'var(--z-accent)' : 'var(--z-border)'}`,
                      }}
                    >
                      {isComplete ? (
                        <Check size={12} className="text-[var(--z-success)]" />
                      ) : isActive ? (
                        <Loader2 size={12} className="text-[var(--z-accent)] animate-spin" />
                      ) : (
                        <Icon size={11} className="z-text-dim" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`text-[12px] ${isActive ? 'text-[var(--z-text-primary)] font-medium' : isComplete ? 'z-text-secondary' : 'z-text-dim'}`}>
                        {stage.label}
                      </div>
                      {isActive && <div className="text-[10px] z-text-dim mt-0.5">{stage.description}</div>}
                    </div>
                    {isComplete && <span className="text-[9px] z-text-dim z-mono">✓</span>}
                    {isActive && <StatusDot status="active" size={4} pulse />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Decision text */}
          <div className="mt-4 z-surface-elevated px-4 py-3">
            <SectionLabel>Decision</SectionLabel>
            <p className="text-[12px] z-text-secondary mt-1 leading-relaxed">{decisionText || DEMO_DECISION}</p>
          </div>
        </div>
      </div>
    );
  }

  // Complete phase
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[900px] mx-auto px-6 py-10">
        <div className="flex flex-col items-center mb-8">
          <ZorvionCore state="COMPLETE" size={80} />
          <div className="flex items-center gap-2 mt-4">
            <StatusDot status="online" size={5} />
            <span className="z-label-accent">Analysis Complete</span>
          </div>
          <h2 className="text-[24px] font-bold text-[var(--z-text-primary)] mt-3 mb-2 text-center max-w-[600px]">
            Intelligence generated for your decision.
          </h2>
          <p className="text-[13px] z-text-secondary max-w-[440px] text-center leading-relaxed">
            ZORVION has built a causal model, traced cascades, discovered overlooked consequences,
            generated scenarios, and identified risks. Explore the results.
          </p>
        </div>

        {/* Results overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Causal Variables', value: '15', icon: Network, view: 'causal-map' as ViewId },
            { label: 'Cascade Effects', value: '8', icon: GitBranch, view: 'consequences' as ViewId },
            { label: 'Discovered Questions', value: '8', icon: AlertTriangle, view: 'consequences' as ViewId },
            { label: 'Risks Identified', value: '6', icon: Shield, view: 'risk' as ViewId },
          ].map(r => {
            const Icon = r.icon;
            return (
              <button
                key={r.label}
                onClick={() => onNavigate(r.view)}
                className="z-surface-elevated p-4 text-left hover:border-[var(--z-border-bright)] hover:bg-[var(--z-elevated-2)] transition-all group"
              >
                <Icon size={16} className="z-text-muted group-hover:text-[var(--z-accent)] transition-colors mb-2" />
                <div className="text-[24px] font-bold text-[var(--z-text-primary)] leading-none">{r.value}</div>
                <div className="text-[10px] z-text-dim mt-1 tracking-wide">{r.label}</div>
              </button>
            );
          })}
        </div>

        {/* Navigation to full workspace */}
        <div className="space-y-2.5">
          {[
            { view: 'causal-map' as ViewId, label: 'Explore Causal Map', desc: 'Interactive graph of causes and effects across systems', icon: Network },
            { view: 'consequences' as ViewId, label: 'View Unknown Consequences', desc: 'What you may not have asked — and why it matters', icon: AlertTriangle },
            { view: 'scenarios' as ViewId, label: 'Compare Scenarios', desc: 'Three options with different tradeoffs and risk profiles', icon: TrendingUp },
            { view: 'risk' as ViewId, label: 'Review Risk Intelligence', desc: 'Severity, likelihood, and cascade for each identified risk', icon: Shield },
            { view: 'optimization' as ViewId, label: 'See Optimization Results', desc: 'Recommended option with reasoning and tradeoffs', icon: Settings },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className="w-full z-surface-elevated px-4 py-3.5 flex items-center gap-3 hover:border-[var(--z-border-bright)] hover:bg-[var(--z-elevated-2)] transition-all group text-left"
              >
                <Icon size={18} strokeWidth={1.6} className="z-text-muted group-hover:text-[var(--z-accent)] transition-colors flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-[var(--z-text-primary)]">{item.label}</div>
                  <div className="text-[11px] z-text-muted mt-0.5">{item.desc}</div>
                </div>
                <ArrowRight size={14} className="z-text-dim group-hover:text-[var(--z-accent)] transition-colors" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
