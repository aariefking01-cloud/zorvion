import { useState } from 'react';
import {
  FlaskConical, Plus, Copy, Play, Save, ChevronRight, TrendingUp,
  TrendingDown, Minus, GitCompare,
} from 'lucide-react';
import { Panel, SectionLabel } from '../shared/Panel';
import { CategoryIcon, categoryColor, categoryLabel } from '../shared/CategoryIcon';
import { ConfidenceIndicator } from '../shared/ConfidenceIndicator';
import { SCENARIOS } from '@/data/demoData';
import type { Scenario } from '@/types';

export function ScenarioView() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['s1', 's2', 's3']);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(SCENARIOS[1]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectedScenarios = SCENARIOS.filter(s => selectedIds.includes(s.id));

  return (
    <div className="h-full flex flex-col">
      <div className="px-5 py-3 border-b border-[var(--z-border)] flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--z-text-primary)]">Scenario Lab</h2>
          <p className="text-[11px] z-text-muted mt-0.5">
            Create, modify, and compare scenarios under different assumptions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="z-tag z-tag--demo">Simulated</span>
          <button className="z-btn"><Plus size={13} /> New Scenario</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto px-6 py-5 space-y-5">
          {/* Scenario selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {SCENARIOS.map(scenario => {
              const selected = selectedIds.includes(scenario.id);
              return (
                <button
                  key={scenario.id}
                  onClick={() => toggleSelect(scenario.id)}
                  className={`text-left p-4 rounded-[var(--z-radius)] border transition-all ${
                    selected
                      ? 'bg-[var(--z-elevated-2)] border-[var(--z-border-bright)]'
                      : 'bg-[var(--z-surface)] border-[var(--z-border)] opacity-60 hover:opacity-100'
                  }`}
                  style={selected ? { borderColor: scenario.color, boxShadow: `0 0 0 1px ${scenario.color}40` } : {}}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: scenario.color }} />
                      <span className="text-[12px] font-medium text-[var(--z-text-primary)]">{scenario.name}</span>
                    </div>
                    {selected && <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: scenario.color }}>
                      <Minus size={10} className="text-white" />
                    </div>}
                  </div>
                  <p className="text-[10px] z-text-muted leading-relaxed mb-2">{scenario.description}</p>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="z-text-dim">{scenario.estimatedCost || '—'}</span>
                    <span className={`z-tag ${scenario.riskLevel === 'low' ? 'z-tag--success' : scenario.riskLevel === 'medium' ? 'z-tag--warning' : 'z-tag--danger'}`}>
                      {scenario.riskLevel}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Comparison table */}
          <Panel title="Outcome Comparison" subtitle="Projected outcomes across selected scenarios">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--z-border)]">
                    <th className="text-left py-2 px-3 z-label">Outcome</th>
                    {selectedScenarios.map(s => (
                      <th key={s.id} className="text-left py-2 px-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                          <span className="text-[11px] font-medium text-[var(--z-text-primary)]">{s.name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Outcomes by category */}
                  {['transport', 'economy', 'environment', 'health'].map(cat => {
                    const outcomesByScenario = selectedScenarios.map(s =>
                      s.outcomes.find(o => o.category === cat)
                    );
                    if (outcomesByScenario.every(o => !o)) return null;
                    return (
                      <tr key={cat} className="border-b border-[var(--z-border)]">
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <CategoryIcon category={cat as any} size={12} />
                            <span className="text-[11px] z-text-secondary">{categoryLabel(cat as any)}</span>
                          </div>
                        </td>
                        {outcomesByScenario.map((o, i) => (
                          <td key={i} className="py-2.5 px-3">
                            {o ? (
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[11px] text-[var(--z-text-primary)]">{o.value}</span>
                                  {o.delta !== 0 && (
                                    <span className={`flex items-center text-[10px] ${o.delta > 0 ? 'text-[var(--z-danger)]' : 'text-[var(--z-success)]'}`}>
                                      {o.delta > 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                                      {Math.abs(o.delta)}%
                                    </span>
                                  )}
                                </div>
                                <div className="mt-1">
                                  <ConfidenceIndicator confidence={o.confidence} compact />
                                </div>
                              </div>
                            ) : (
                              <span className="text-[10px] z-text-dim">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                  {/* Risk row */}
                  <tr className="border-b border-[var(--z-border)]">
                    <td className="py-2.5 px-3 z-label">Risk Level</td>
                    {selectedScenarios.map(s => (
                      <td key={s.id} className="py-2.5 px-3">
                        <span className={`z-tag ${s.riskLevel === 'low' ? 'z-tag--success' : s.riskLevel === 'medium' ? 'z-tag--warning' : 'z-tag--danger'}`}>
                          {s.riskLevel}
                        </span>
                      </td>
                    ))}
                  </tr>
                  {/* Confidence row */}
                  <tr>
                    <td className="py-2.5 px-3 z-label">Confidence</td>
                    {selectedScenarios.map(s => (
                      <td key={s.id} className="py-2.5 px-3">
                        <ConfidenceIndicator confidence={s.confidence} compact />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Panel>

          {/* Scenario detail cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {selectedScenarios.filter(s => s.id !== 's0').map(scenario => (
              <Panel key={scenario.id} title={scenario.name} className={scenario.recommended ? 'border-[var(--z-accent)]' : ''}>
                <div className="space-y-3">
                  <p className="text-[11px] z-text-muted leading-relaxed">{scenario.description}</p>

                  <div>
                    <SectionLabel>Assumptions</SectionLabel>
                    <div className="space-y-1.5 mt-2">
                      {scenario.assumptions.map(a => (
                        <div key={a.id} className="flex items-center justify-between text-[11px]">
                          <span className="z-text-secondary">{a.label}</span>
                          <span className="z-mono z-text-primary">{a.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <SectionLabel>Outcomes</SectionLabel>
                    <div className="space-y-1.5 mt-2">
                      {scenario.outcomes.map(o => (
                        <div key={o.id} className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <CategoryIcon category={o.category} size={11} />
                            <span className="z-text-secondary">{o.label}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="z-text-primary z-mono">{o.value}</span>
                            {o.delta !== 0 && (
                              <span className={`text-[10px] ${o.delta > 0 ? 'text-[var(--z-danger)]' : 'text-[var(--z-success)]'}`}>
                                {o.delta > 0 ? '+' : ''}{o.delta}%
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[var(--z-border)]">
                    <span className="text-[10px] z-text-dim">{scenario.estimatedCost}</span>
                    <span className="text-[10px] z-text-dim">{scenario.estimatedTimeline}</span>
                    {scenario.recommended && <span className="z-tag z-tag--success ml-auto">Recommended</span>}
                  </div>
                </div>
              </Panel>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pb-4">
            <button className="z-btn"><Copy size={13} /> Duplicate</button>
            <button className="z-btn"><Play size={13} /> Run Simulation</button>
            <button className="z-btn"><Save size={13} /> Save Result</button>
            <button className="z-btn"><GitCompare size={13} /> Compare</button>
          </div>
        </div>
      </div>
    </div>
  );
}
