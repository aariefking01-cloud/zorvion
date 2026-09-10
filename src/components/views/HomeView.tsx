import { useState } from 'react';
import {
  ArrowRight, AlertTriangle, GitBranch, TrendingUp, Shield,
  Activity, Zap, FileText, ChevronRight, MapPin,
} from 'lucide-react';
import { ZorvionCore } from '../ZorvionCore';
import { Panel, SectionLabel } from '../shared/Panel';
import { StatusDot } from '../shared/StatusDot';
import { ConfidenceIndicator } from '../shared/ConfidenceIndicator';
import { CategoryIcon, categoryColor } from '../shared/CategoryIcon';
import type { ViewId, CoreState } from '@/types';
import {
  DEMO_DECISION, UNKNOWN_CONSEQUENCES, RISKS, SCENARIOS,
  DECISION_HISTORY, SYSTEM_STATUS,
} from '@/data/demoData';

interface Props {
  onNavigate: (view: ViewId) => void;
  onStartAnalysis: () => void;
  coreState: CoreState;
}

export function HomeView({ onNavigate, onStartAnalysis, coreState }: Props) {
  const [decisionText, setDecisionText] = useState('');
  const activeDecision = DECISION_HISTORY[0];
  const topConsequence = UNKNOWN_CONSEQUENCES[0];
  const topRisk = RISKS[0];
  const recommendedScenario = SCENARIOS.find(s => s.id === 's2');

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-5">
        {/* Hero region */}
        <div className="flex items-start justify-between gap-6 pb-5 border-b border-[var(--z-border)]">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <StatusDot status="active" size={5} pulse />
              <span className="z-label-accent">Intelligence Center</span>
            </div>
            <h1 className="text-[28px] font-bold tracking-tight text-[var(--z-text-primary)] leading-tight mb-1.5">
              Discover what happens before you decide.
            </h1>
            <p className="text-[14px] z-text-secondary max-w-[520px] leading-relaxed">
              ZORVION traces causes, cascades, and overlooked consequences across systems —
              so you understand the full impact of a decision before you act.
            </p>
          </div>
          <ZorvionCore state={coreState} size={100} />
        </div>

        {/* Decision input */}
        <div className="z-surface p-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} className="text-[var(--z-accent)]" />
            <SectionLabel accent>Start a Decision</SectionLabel>
          </div>
          <div className="flex flex-col gap-3">
            <input
              value={decisionText}
              onChange={e => setDecisionText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (decisionText.trim() || DEMO_DECISION) && onStartAnalysis()}
              placeholder="Describe a decision, problem, or situation..."
              className="w-full bg-[var(--z-elevated)] border border-[var(--z-border)] rounded-lg px-4 py-3.5 text-[15px] text-[var(--z-text-primary)] placeholder:text-[var(--z-text-dim)] outline-none focus:border-[var(--z-accent)] transition-colors"
            />
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Should we build a hospital here?',
                  'Should this city build a new highway?',
                  'Where should we locate a new data center?',
                  'What happens if we change this policy?',
                ].map(ex => (
                  <button
                    key={ex}
                    onClick={() => setDecisionText(ex)}
                    className="text-[10px] px-2.5 py-1 rounded-full border border-[var(--z-border)] text-[var(--z-text-muted)] hover:border-[var(--z-border-bright)] hover:text-[var(--z-text-secondary)] transition-colors"
                  >
                    {ex}
                  </button>
                ))}
              </div>
              <button
                onClick={() => { if (!decisionText.trim()) setDecisionText(DEMO_DECISION); onStartAnalysis(); }}
                className="z-btn z-btn--primary"
              >
                Analyze Decision <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Active decision summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Active decision */}
          <Panel
            title="Active Decision"
            headerAction={<span className="z-tag z-tag--success">Complete</span>}
            className="lg:col-span-2"
          >
            <div className="space-y-4">
              <div>
                <div className="text-[15px] font-medium text-[var(--z-text-primary)] mb-1">{activeDecision.title}</div>
                <div className="text-[12px] z-text-muted leading-relaxed">{activeDecision.description}</div>
              </div>
              <div className="flex items-center gap-4 flex-wrap text-[11px]">
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} className="z-text-dim" />
                  <span className="z-text-secondary">{activeDecision.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="z-text-dim">v{activeDecision.version}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="z-text-dim">{activeDecision.scenarioCount} scenarios</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="z-text-dim">Updated {activeDecision.lastUpdated}</span>
                </div>
              </div>

              {/* Mini stats */}
              <div className="grid grid-cols-4 gap-3 pt-1">
                {[
                  { label: 'Variables', value: '15', icon: GitBranch },
                  { label: 'Cascade Depth', value: '4 orders', icon: Activity },
                  { label: 'Risks Found', value: '6', icon: Shield },
                  { label: 'Questions', value: '8', icon: AlertTriangle },
                ].map(stat => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="z-surface-elevated px-3 py-2.5">
                      <Icon size={12} className="z-text-dim mb-1" />
                      <div className="text-[16px] font-semibold text-[var(--z-text-primary)] leading-none">{stat.value}</div>
                      <div className="text-[9px] z-text-dim mt-0.5 tracking-wide">{stat.label}</div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => onNavigate('decisions')}
                className="flex items-center gap-1 text-[12px] text-[var(--z-accent)] hover:text-[var(--z-accent-bright)] transition-colors"
              >
                Open full analysis <ChevronRight size={12} />
              </button>
            </div>
          </Panel>

          {/* System status */}
          <Panel title="System Status">
            <div className="space-y-2.5">
              {SYSTEM_STATUS.map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-[11px] z-text-secondary">{s.label}</span>
                  <div className="flex items-center gap-1.5">
                    <StatusDot
                      status={s.status === 'online' ? 'online' : s.status === 'active' ? 'active' : s.status === 'warning' ? 'warning' : 'ready'}
                      size={5}
                      pulse={s.status === 'active'}
                    />
                    <span className="text-[10px] z-text-dim">{s.detail}</span>
                  </div>
                </div>
              ))}
              <hr className="z-divider" />
              <div className="flex items-center gap-2 pt-1">
                <span className="z-tag z-tag--demo">Demo Environment</span>
                <span className="text-[10px] z-text-dim">Simulated data</span>
              </div>
            </div>
          </Panel>
        </div>

        {/* Key findings row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Top discovery */}
          <Panel
            title="Key Discovery"
            subtitle="What you may not have asked"
            headerAction={
              <button onClick={() => onNavigate('consequences')} className="text-[11px] text-[var(--z-accent)] hover:text-[var(--z-accent-bright)] flex items-center gap-1">
                Explore <ChevronRight size={11} />
              </button>
            }
          >
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <AlertTriangle size={14} className="text-[var(--z-warning)] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[13px] font-medium text-[var(--z-text-primary)] leading-snug mb-1">
                    {topConsequence.question}
                  </div>
                  <div className="text-[11px] z-text-muted leading-relaxed">{topConsequence.consequence}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="z-label">Confidence</span>
                <ConfidenceIndicator confidence={topConsequence.confidence} compact />
                <span className="z-tag z-tag--warning ml-auto">{topConsequence.potentialImpact} impact</span>
              </div>
              {/* Mini causal path */}
              <div className="flex items-center gap-1 flex-wrap pt-1">
                {topConsequence.causalPath.map((step, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <ChevronRight size={10} className="z-text-dim" />}
                    <span className={`text-[10px] ${i === topConsequence.causalPath.length - 1 ? 'text-[var(--z-warning)]' : 'z-text-dim'}`}>
                      {step}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </Panel>

          {/* Top risk */}
          <Panel
            title="Top Risk"
            headerAction={
              <button onClick={() => onNavigate('risk')} className="text-[11px] text-[var(--z-accent)] hover:text-[var(--z-accent-bright)] flex items-center gap-1">
                All risks <ChevronRight size={11} />
              </button>
            }
          >
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Shield size={14} className="text-[var(--z-danger)] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[13px] font-medium text-[var(--z-text-primary)] leading-snug mb-1">
                    {topRisk.title}
                  </div>
                  <div className="text-[11px] z-text-muted leading-relaxed">{topRisk.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[10px] pt-1">
                <span className="z-tag z-tag--danger">{topRisk.severity}</span>
                <span className="z-text-muted">Likelihood: <span className="z-text-secondary capitalize">{topRisk.likelihood}</span></span>
                <span className="z-text-muted">Horizon: <span className="z-text-secondary">{topRisk.timeHorizon}</span></span>
              </div>
              <div className="flex items-center gap-1 flex-wrap pt-1">
                {topRisk.cascade.map((step, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <ChevronRight size={10} className="z-text-dim" />}
                    <span className={`text-[10px] ${i === topRisk.cascade.length - 1 ? 'text-[var(--z-danger)]' : 'z-text-dim'}`}>
                      {step}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </Panel>
        </div>

        {/* Scenarios preview */}
        <Panel
          title="Scenario Comparison"
          subtitle="Options under evaluation"
          headerAction={
            <button onClick={() => onNavigate('scenarios')} className="text-[11px] text-[var(--z-accent)] hover:text-[var(--z-accent-bright)] flex items-center gap-1">
              Scenario Lab <ChevronRight size={11} />
            </button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SCENARIOS.filter(s => s.id !== 's0').map(scenario => (
              <button
                key={scenario.id}
                onClick={() => onNavigate('scenarios')}
                className="text-left z-surface-elevated p-3.5 hover:border-[var(--z-border-bright)] transition-colors group"
              style={{ borderColor: scenario.recommended ? 'var(--z-accent)' : undefined }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: scenario.color }} />
                    <span className="text-[12px] font-medium text-[var(--z-text-primary)]">{scenario.name}</span>
                  </div>
                  {scenario.recommended && <span className="z-tag z-tag--success">Recommended</span>}
                </div>
                <div className="text-[11px] z-text-muted leading-relaxed mb-3">{scenario.description}</div>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="z-text-dim">{scenario.estimatedCost}</span>
                  <span className="z-text-dim">{scenario.estimatedTimeline}</span>
                  <span className={`z-tag ${scenario.riskLevel === 'low' ? 'z-tag--success' : scenario.riskLevel === 'medium' ? 'z-tag--warning' : 'z-tag--danger'}`}>
                    {scenario.riskLevel} risk
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Panel>

        {/* Quick navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 pb-6">
          {[
            { view: 'causal-map' as ViewId, label: 'Causal Map', icon: GitBranch },
            { view: 'consequences' as ViewId, label: 'Consequences', icon: Activity },
            { view: 'simulations' as ViewId, label: 'Simulations', icon: TrendingUp },
            { view: 'risk' as ViewId, label: 'Risk Intelligence', icon: Shield },
            { view: 'optimization' as ViewId, label: 'Optimization', icon: Zap },
            { view: 'decisions' as ViewId, label: 'Decision Report', icon: FileText },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className="z-surface-elevated p-3 flex flex-col items-center gap-2 hover:border-[var(--z-border-bright)] hover:bg-[var(--z-elevated-2)] transition-all group"
              >
                <Icon size={18} strokeWidth={1.6} className="z-text-muted group-hover:text-[var(--z-accent)] transition-colors" />
                <span className="text-[11px] z-text-secondary group-hover:text-[var(--z-text-primary)] transition-colors">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
