import { useState } from 'react';
import {
  Settings, Check, X, ChevronRight, Award, AlertTriangle,
  TrendingUp, Scale,
} from 'lucide-react';
import { Panel, SectionLabel } from '../shared/Panel';
import { ConfidenceIndicator } from '../shared/ConfidenceIndicator';
import { OPTIMIZATION_MODEL } from '@/data/demoData';
import type { OptimizationOption } from '@/types';

const riskColor: Record<string, string> = {
  low: 'var(--z-success)',
  medium: 'var(--z-warning)',
  high: 'var(--z-danger)',
};

export function OptimizationView() {
  const [selectedOption, setSelectedOption] = useState<OptimizationOption | null>(
    OPTIMIZATION_MODEL.options.find(o => o.recommended) || null
  );
  const [emissionConstraint, setEmissionConstraint] = useState(5);

  return (
    <div className="h-full flex flex-col">
      <div className="px-5 py-3 border-b border-[var(--z-border)] flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--z-text-primary)]">Optimization</h2>
          <p className="text-[11px] z-text-muted mt-0.5">
            Find better alternatives under constraints — with tradeoffs, sensitivity, and uncertainty
          </p>
        </div>
        <span className="z-tag z-tag--demo">Simulated</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto px-6 py-5 space-y-5">
          {/* Objective & constraints */}
          <Panel title="Optimization Model">
            <div className="space-y-4">
              <div>
                <SectionLabel>Objective</SectionLabel>
                <p className="text-[13px] text-[var(--z-text-primary)] mt-1 leading-relaxed">{OPTIMIZATION_MODEL.objective}</p>
              </div>
              <div>
                <SectionLabel>Constraints</SectionLabel>
                <div className="space-y-1.5 mt-2">
                  {OPTIMIZATION_MODEL.constraints.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Scale size={12} className="z-text-dim flex-shrink-0" />
                      <span className="text-[12px] z-text-secondary">{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sensitivity slider */}
              <div className="pt-3 border-t border-[var(--z-border)]">
                <SectionLabel>Sensitivity Analysis</SectionLabel>
                <p className="text-[11px] z-text-muted mt-1 mb-3">
                  Adjust the emissions target to see how the recommendation changes
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] z-text-secondary">Emissions ceiling</span>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={emissionConstraint}
                    onChange={e => setEmissionConstraint(Number(e.target.value))}
                    className="flex-1 accent-[var(--z-accent)]"
                  />
                  <span className="text-[12px] z-mono text-[var(--z-accent)] w-12 text-right">{emissionConstraint}%</span>
                </div>
                <p className="text-[10px] z-text-dim mt-2">
                  {emissionConstraint <= 0
                    ? 'Only Option C satisfies a 0% emissions target'
                    : emissionConstraint < 5
                    ? 'Only Options B and C satisfy this target'
                    : emissionConstraint < 12
                    ? 'Options A, B, and C all satisfy this target'
                    : 'All options satisfy this target — Option A becomes viable'}
                </p>
              </div>
            </div>
          </Panel>

          {/* Options comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {OPTIMIZATION_MODEL.options.map((option, i) => {
              const selected = selectedOption?.id === option.id;
              const score = emissionConstraint < 5 && option.id === 'opt3'
                ? option.objectiveScore + 10
                : emissionConstraint < 12 && option.id === 'opt3'
                ? option.objectiveScore + 5
                : option.objectiveScore;

              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option)}
                  className={`text-left z-surface p-4 transition-all z-fade-in ${
                    selected ? 'border-[var(--z-accent)]' : 'hover:border-[var(--z-border-bright)]'
                  } ${option.recommended ? 'ring-1 ring-[var(--z-accent)]' : ''}`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-[13px] font-medium text-[var(--z-text-primary)]">{option.name}</div>
                      <div className="text-[10px] z-text-dim mt-0.5">{option.description}</div>
                    </div>
                    {option.recommended && (
                      <span className="z-tag z-tag--success flex items-center gap-1">
                        <Award size={9} /> Best
                      </span>
                    )}
                  </div>

                  {/* Score */}
                  <div className="mb-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[28px] font-bold z-mono" style={{ color: score > 70 ? 'var(--z-success)' : score > 55 ? 'var(--z-warning)' : 'var(--z-danger)' }}>
                        {score}
                      </span>
                      <span className="text-[10px] z-text-dim">objective score</span>
                    </div>
                    <div className="z-confidence-track mt-1">
                      <div
                        className="z-confidence-fill"
                        style={{
                          width: `${score}%`,
                          background: score > 70 ? 'var(--z-success)' : score > 55 ? 'var(--z-warning)' : 'var(--z-danger)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Risk & confidence */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`z-tag ${option.riskLevel === 'low' ? 'z-tag--success' : option.riskLevel === 'medium' ? 'z-tag--warning' : 'z-tag--danger'}`}>
                      {option.riskLevel} risk
                    </span>
                    <ConfidenceIndicator confidence={option.uncertainty} compact />
                  </div>

                  {/* Constraint check */}
                  <div className="space-y-1 pt-2 border-t border-[var(--z-border)]">
                    {option.constraints.map((c, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <Check size={10} className="text-[var(--z-success)] flex-shrink-0" />
                        <span className="text-[10px] z-text-muted">{c}</span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected option detail */}
          {selectedOption && (
            <Panel
              title={selectedOption.name}
              className="z-fade-in"
              headerAction={
                selectedOption.recommended
                  ? <span className="z-tag z-tag--success flex items-center gap-1"><Award size={9} /> Recommended</span>
                  : null
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <div>
                    <SectionLabel>Why This Option</SectionLabel>
                    <p className="text-[12px] z-text-secondary leading-relaxed mt-1">{selectedOption.reasoning}</p>
                  </div>
                  <div>
                    <SectionLabel>Expected Outcomes</SectionLabel>
                    <div className="space-y-1.5 mt-2">
                      {selectedOption.expectedOutcomes.map((o, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <TrendingUp size={11} className="text-[var(--z-accent)] flex-shrink-0" />
                          <span className="text-[11px] z-text-secondary">{o}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <SectionLabel>Tradeoffs</SectionLabel>
                    <div className="space-y-1.5 mt-2">
                      {selectedOption.tradeoffs.map((t, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <AlertTriangle size={11} className="text-[var(--z-warning)] mt-0.5 flex-shrink-0" />
                          <span className="text-[11px] z-text-secondary">{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <SectionLabel>Uncertainty</SectionLabel>
                    <div className="mt-2">
                      <ConfidenceIndicator confidence={selectedOption.uncertainty} />
                    </div>
                  </div>
                </div>
              </div>
            </Panel>
          )}

          {/* Sensitivity note */}
          <div className="z-surface p-4 border-l-2" style={{ borderLeftColor: 'var(--z-accent)' }}>
            <div className="flex items-start gap-3">
              <Settings size={14} className="text-[var(--z-accent)] mt-0.5 flex-shrink-0" />
              <div>
                <SectionLabel accent>Sensitivity</SectionLabel>
                <p className="text-[12px] z-text-muted leading-relaxed mt-1">
                  {OPTIMIZATION_MODEL.sensitivityNote}
                </p>
              </div>
            </div>
          </div>

          {/* Human override notice */}
          <div className="z-surface p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(74,158,255,0.08)', border: '1px solid rgba(74,158,255,0.2)' }}>
              <Scale size={16} className="text-[var(--z-accent)]" />
            </div>
            <div>
              <div className="text-[12px] font-medium text-[var(--z-text-primary)]">Human decision required</div>
              <p className="text-[11px] z-text-muted mt-0.5">
                ZORVION provides analysis and recommendations. The final decision belongs to the human.
                Adjust assumptions, constraints, or weights to explore alternatives.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
