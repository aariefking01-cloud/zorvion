import { useState } from 'react';
import {
  GitBranch, AlertTriangle, ChevronRight, HelpCircle, Lightbulb,
  ArrowDown, Shield,
} from 'lucide-react';
import { Panel, SectionLabel } from '../shared/Panel';
import { CategoryIcon, categoryColor, categoryLabel } from '../shared/CategoryIcon';
import { ConfidenceIndicator, ConfidenceLabel } from '../shared/ConfidenceIndicator';
import {
  CASCADE_EFFECTS, UNKNOWN_CONSEQUENCES, DISCOVERED_QUESTIONS,
} from '@/data/demoData';
import type { CascadeEffect, UnknownConsequence } from '@/types';

type Tab = 'cascade' | 'unknown' | 'questions';

export function ConsequencesView() {
  const [tab, setTab] = useState<Tab>('unknown');
  const [selectedConsequence, setSelectedConsequence] = useState<UnknownConsequence | null>(null);
  const [cascadeOrder, setCascadeOrder] = useState<number | 'all'>('all');

  const filteredCascades = cascadeOrder === 'all'
    ? CASCADE_EFFECTS
    : CASCADE_EFFECTS.filter(c => c.order === cascadeOrder);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-5 py-3 border-b border-[var(--z-border)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-semibold text-[var(--z-text-primary)]">Consequences</h2>
            <p className="text-[11px] z-text-muted mt-0.5">
              Cascade effects, overlooked consequences, and questions you didn't ask
            </p>
          </div>
          <span className="z-tag z-tag--demo">Simulated Analysis</span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mt-3">
          {[
            { id: 'unknown' as Tab, label: 'What You Didn\'t Ask', icon: AlertTriangle },
            { id: 'cascade' as Tab, label: 'Cascade Explorer', icon: GitBranch },
            { id: 'questions' as Tab, label: 'Question Discovery', icon: HelpCircle },
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                  tab === t.id
                    ? 'bg-[var(--z-elevated-2)] text-[var(--z-text-primary)] border border-[var(--z-border-light)]'
                    : 'text-[var(--z-text-muted)] hover:text-[var(--z-text-secondary)] border border-transparent'
                }`}
              >
                <Icon size={13} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* UNKNOWN CONSEQUENCE ENGINE */}
        {tab === 'unknown' && (
          <div className="max-w-[900px] mx-auto px-6 py-6 space-y-4">
            {/* Signature header */}
            <div className="z-surface p-5 border-l-2" style={{ borderLeftColor: 'var(--z-warning)' }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className="text-[var(--z-warning)]" />
                <span className="z-label" style={{ color: 'var(--z-warning)' }}>What You May Not Have Asked</span>
              </div>
              <p className="text-[13px] z-text-secondary leading-relaxed">
                ZORVION traced causal chains beyond the immediate question and discovered
                {UNKNOWN_CONSEQUENCES.length} potential consequences that were not part of the original analysis.
              </p>
            </div>

            {/* Consequence cards */}
            {UNKNOWN_CONSEQUENCES.map((uc, i) => (
              <div
                key={uc.id}
                className="z-surface overflow-hidden z-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Question header */}
                <div className="px-5 py-4 border-b border-[var(--z-border)]">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
                      <AlertTriangle size={14} className="text-[var(--z-warning)]" />
                    </div>
                    <div className="flex-1">
                      <div className="z-label mb-1">Overlooked Question</div>
                      <p className="text-[14px] font-medium text-[var(--z-text-primary)] leading-snug">{uc.question}</p>
                    </div>
                    <span className={`z-tag ${uc.potentialImpact === 'high' ? 'z-tag--danger' : uc.potentialImpact === 'medium' ? 'z-tag--warning' : 'z-tag--success'}`}>
                      {uc.potentialImpact} impact
                    </span>
                  </div>
                </div>

                {/* Consequence body */}
                <div className="px-5 py-4 space-y-3">
                  <div>
                    <div className="z-label mb-1">Consequence Discovered</div>
                    <p className="text-[13px] z-text-secondary leading-relaxed">{uc.consequence}</p>
                  </div>
                  <div>
                    <div className="z-label mb-1">Why It Matters</div>
                    <p className="text-[12px] z-text-muted leading-relaxed">{uc.whyItMatters}</p>
                  </div>

                  {/* Causal path */}
                  <div>
                    <div className="z-label mb-2">Causal Path</div>
                    <div className="flex items-center gap-1 flex-wrap">
                      {uc.causalPath.map((step, idx) => (
                        <span key={idx} className="flex items-center gap-1">
                          {idx > 0 && <ChevronRight size={11} className="z-text-dim" />}
                          <span className={`text-[11px] px-2 py-1 rounded ${
                            idx === 0
                              ? 'bg-[var(--z-accent-dim)] text-[var(--z-accent-bright)]'
                              : idx === uc.causalPath.length - 1
                              ? 'bg-[rgba(251,191,36,0.08)] text-[var(--z-warning)]'
                              : 'bg-[var(--z-elevated)] z-text-secondary'
                          }`}>
                            {step}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--z-border)]">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="z-label">Confidence</span>
                        <ConfidenceIndicator confidence={uc.confidence} compact />
                        <ConfidenceLabel confidence={uc.confidence} />
                      </div>
                      <div className="flex items-center gap-2">
                        <CategoryIcon category={uc.category} size={12} />
                        <span className="text-[10px] z-text-muted">{categoryLabel(uc.category)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedConsequence(selectedConsequence?.id === uc.id ? null : uc)}
                      className="text-[11px] text-[var(--z-accent)] hover:text-[var(--z-accent-bright)] flex items-center gap-1 transition-colors"
                    >
                      {selectedConsequence?.id === uc.id ? 'Hide' : 'Explore'} <ChevronRight size={11} />
                    </button>
                  </div>

                  {/* Expanded detail */}
                  {selectedConsequence?.id === uc.id && (
                    <div className="z-fade-in pt-2 mt-2 border-t border-[var(--z-border)] space-y-2">
                      <div>
                        <div className="z-label mb-1">Evidence</div>
                        <p className="text-[11px] z-text-muted leading-relaxed">
                          This consequence was identified by tracing {uc.causalPath.length - 1} causal hops from the root decision.
                          The confidence level reflects data availability and model certainty at each step in the chain.
                        </p>
                      </div>
                      <div>
                        <div className="z-label mb-1">Assumptions</div>
                        <ul className="text-[11px] z-text-muted leading-relaxed space-y-1 list-disc list-inside">
                          <li>Current population growth projections hold within the time horizon</li>
                          <li>No major policy interventions alter the causal chain</li>
                          <li>Infrastructure capacity remains at current levels</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CASCADE EXPLORER */}
        {tab === 'cascade' && (
          <div className="max-w-[900px] mx-auto px-6 py-6">
            {/* Order filter */}
            <div className="flex items-center gap-2 mb-5">
              <span className="z-label">Cascade Order</span>
              <div className="flex gap-1">
                {['all', 1, 2, 3, 4].map(o => (
                  <button
                    key={o}
                    onClick={() => setCascadeOrder(o === 'all' ? 'all' : Number(o))}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                      cascadeOrder === (o === 'all' ? 'all' : Number(o))
                        ? 'bg-[var(--z-accent-dim)] text-[var(--z-accent-bright)] border border-[var(--z-accent)]'
                        : 'bg-[var(--z-elevated)] text-[var(--z-text-muted)] border border-[var(--z-border)] hover:border-[var(--z-border-bright)]'
                    }`}
                  >
                    {o === 'all' ? 'All' : `${o}°`}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[19px] top-0 bottom-0 w-px bg-[var(--z-border)]" />

              <div className="space-y-4">
                {filteredCascades.map((effect: CascadeEffect, i) => (
                  <div key={effect.id} className="relative flex gap-4 z-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                    {/* Order indicator */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-mono text-[12px] font-semibold"
                      style={{
                        background: 'var(--z-elevated-2)',
                        border: `1.5px solid ${categoryColor(effect.category)}`,
                        color: categoryColor(effect.category),
                        zIndex: 1,
                      }}
                    >
                      {effect.order}°
                    </div>

                    {/* Content */}
                    <div className="flex-1 z-surface p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CategoryIcon category={effect.category} size={13} />
                          <span className="text-[13px] font-medium text-[var(--z-text-primary)]">{effect.label}</span>
                        </div>
                        <span className="text-[10px] z-text-dim z-mono">{effect.timeHorizon}</span>
                      </div>
                      <p className="text-[12px] z-text-muted leading-relaxed mb-3">{effect.description}</p>

                      {/* Cause → Effect */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] px-2 py-1 rounded bg-[var(--z-elevated)] z-text-secondary">{effect.cause}</span>
                        <ArrowDown size={11} className="z-text-dim" />
                        <span className="text-[10px] px-2 py-1 rounded bg-[var(--z-elevated)] z-text-secondary">{effect.effect}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <ConfidenceIndicator confidence={effect.confidence} compact />
                        <ConfidenceLabel confidence={effect.confidence} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* QUESTION DISCOVERY */}
        {tab === 'questions' && (
          <div className="max-w-[900px] mx-auto px-6 py-6 space-y-4">
            <div className="z-surface p-4 border-l-2" style={{ borderLeftColor: 'var(--z-accent)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={16} className="text-[var(--z-accent)]" />
                <span className="z-label-accent">Questions You Didn't Ask</span>
              </div>
              <p className="text-[13px] z-text-secondary leading-relaxed">
                ZORVION raised {DISCOVERED_QUESTIONS.length} questions that the original decision did not address.
                Each question is categorized by its strategic importance and the reasoning behind why it was raised.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DISCOVERED_QUESTIONS.map((q, i) => (
                <div
                  key={q.id}
                  className="z-surface p-4 z-fade-in hover:border-[var(--z-border-bright)] transition-colors"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <HelpCircle size={14} className="text-[var(--z-accent)] mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-[13px] font-medium text-[var(--z-text-primary)] leading-snug">{q.question}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`z-tag ${
                      q.category === 'critical' ? 'z-tag--danger' :
                      q.category === 'high-impact' ? 'z-tag--warning' :
                      q.category === 'strategic' ? 'z-tag--simulated' :
                      q.category === 'environmental' ? 'z-tag--success' :
                      q.category === 'low-confidence' ? 'z-tag--warning' :
                      ''
                    }`}>
                      {q.category.replace('-', ' ')}
                    </span>
                    <ConfidenceIndicator confidence={q.confidence} compact />
                  </div>
                  <div className="pt-2 border-t border-[var(--z-border)]">
                    <div className="z-label mb-1">Why ZORVION Raised This</div>
                    <p className="text-[11px] z-text-muted leading-relaxed">{q.whyRaised}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
