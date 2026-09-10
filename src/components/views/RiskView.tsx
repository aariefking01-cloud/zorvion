import { useState } from 'react';
import {
  Shield, AlertTriangle, ChevronRight, Clock, GitBranch,
  Eye, EyeOff, Layers, AlertCircle,
} from 'lucide-react';
import { Panel, SectionLabel } from '../shared/Panel';
import { ConfidenceIndicator } from '../shared/ConfidenceIndicator';
import { RISKS } from '@/data/demoData';
import type { RiskItem, RiskSeverity, RiskLikelihood } from '@/types';

const severityColor: Record<RiskSeverity, string> = {
  critical: 'var(--z-danger)',
  high: 'var(--z-danger)',
  medium: 'var(--z-warning)',
  low: 'var(--z-success)',
};

const likelihoodColor: Record<RiskLikelihood, string> = {
  likely: 'var(--z-danger)',
  possible: 'var(--z-warning)',
  unlikely: 'var(--z-text-muted)',
};

const typeLabels: Record<RiskItem['type'], string> = {
  top: 'Top Risk',
  emerging: 'Emerging Risk',
  hidden: 'Hidden Risk',
  systemic: 'Systemic Risk',
  'low-confidence': 'Low-Confidence Risk',
};

export function RiskView() {
  const [selectedRisk, setSelectedRisk] = useState<RiskItem | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = filterType === 'all' ? RISKS : RISKS.filter(r => r.type === filterType);

  // Risk matrix data
  const matrix: Record<string, RiskItem[]> = {};
  RISKS.forEach(r => {
    const key = `${r.severity}-${r.likelihood}`;
    if (!matrix[key]) matrix[key] = [];
    matrix[key].push(r);
  });

  return (
    <div className="h-full flex flex-col">
      <div className="px-5 py-3 border-b border-[var(--z-border)] flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--z-text-primary)]">Risk Intelligence</h2>
          <p className="text-[11px] z-text-muted mt-0.5">
            Severity, likelihood, uncertainty, and cascade for each identified risk
          </p>
        </div>
        <span className="z-tag z-tag--demo">Simulated Assessment</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto px-6 py-5 space-y-5">
          {/* Risk matrix */}
          <Panel title="Risk Matrix" subtitle="Severity vs likelihood — click a cell to see risks">
            <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-1">
              {/* Header row */}
              <div />
              <div className="text-center py-1.5 z-label">Low Likelihood</div>
              <div className="text-center py-1.5 z-label">Possible</div>
              <div className="text-center py-1.5 z-label">Likely</div>

              {/* Critical row */}
              <div className="flex items-center justify-end pr-2 py-3 z-label" style={{ color: 'var(--z-danger)' }}>Critical</div>
              {['unlikely', 'possible', 'likely'].map(likelihood => {
                const cell = matrix[`critical-${likelihood}`] || [];
                return (
                  <button
                    key={likelihood}
                    onClick={() => cell.length > 0 && setSelectedRisk(cell[0])}
                    className="h-16 rounded-md border transition-all flex items-center justify-center"
                    style={{
                      background: cell.length > 0 ? 'rgba(248,113,113,0.08)' : 'var(--z-elevated)',
                      borderColor: cell.length > 0 ? 'rgba(248,113,113,0.2)' : 'var(--z-border)',
                    }}
                  >
                    {cell.length > 0 && (
                      <span className="text-[20px] font-bold z-mono" style={{ color: 'var(--z-danger)' }}>{cell.length}</span>
                    )}
                  </button>
                );
              })}

              {/* High row */}
              <div className="flex items-center justify-end pr-2 py-3 z-label" style={{ color: 'var(--z-danger)' }}>High</div>
              {['unlikely', 'possible', 'likely'].map(likelihood => {
                const cell = matrix[`high-${likelihood}`] || [];
                return (
                  <button
                    key={likelihood}
                    onClick={() => cell.length > 0 && setSelectedRisk(cell[0])}
                    className="h-16 rounded-md border transition-all flex items-center justify-center"
                    style={{
                      background: cell.length > 0 ? 'rgba(248,113,113,0.06)' : 'var(--z-elevated)',
                      borderColor: cell.length > 0 ? 'rgba(248,113,113,0.15)' : 'var(--z-border)',
                    }}
                  >
                    {cell.length > 0 && (
                      <span className="text-[20px] font-bold z-mono" style={{ color: 'var(--z-danger)' }}>{cell.length}</span>
                    )}
                  </button>
                );
              })}

              {/* Medium row */}
              <div className="flex items-center justify-end pr-2 py-3 z-label" style={{ color: 'var(--z-warning)' }}>Medium</div>
              {['unlikely', 'possible', 'likely'].map(likelihood => {
                const cell = matrix[`medium-${likelihood}`] || [];
                return (
                  <button
                    key={likelihood}
                    onClick={() => cell.length > 0 && setSelectedRisk(cell[0])}
                    className="h-16 rounded-md border transition-all flex items-center justify-center"
                    style={{
                      background: cell.length > 0 ? 'rgba(251,191,36,0.06)' : 'var(--z-elevated)',
                      borderColor: cell.length > 0 ? 'rgba(251,191,36,0.15)' : 'var(--z-border)',
                    }}
                  >
                    {cell.length > 0 && (
                      <span className="text-[20px] font-bold z-mono" style={{ color: 'var(--z-warning)' }}>{cell.length}</span>
                    )}
                  </button>
                );
              })}

              {/* Low row */}
              <div className="flex items-center justify-end pr-2 py-3 z-label" style={{ color: 'var(--z-success)' }}>Low</div>
              {['unlikely', 'possible', 'likely'].map(likelihood => {
                const cell = matrix[`low-${likelihood}`] || [];
                return (
                  <button
                    key={likelihood}
                    onClick={() => cell.length > 0 && setSelectedRisk(cell[0])}
                    className="h-16 rounded-md border transition-all flex items-center justify-center"
                    style={{
                      background: cell.length > 0 ? 'rgba(52,211,153,0.06)' : 'var(--z-elevated)',
                      borderColor: cell.length > 0 ? 'rgba(52,211,153,0.15)' : 'var(--z-border)',
                    }}
                  >
                    {cell.length > 0 && (
                      <span className="text-[20px] font-bold z-mono" style={{ color: 'var(--z-success)' }}>{cell.length}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </Panel>

          {/* Risk type filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="z-label">Filter</span>
            {['all', 'top', 'emerging', 'hidden', 'systemic', 'low-confidence'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 rounded text-[10px] font-medium transition-colors border ${
                  filterType === t
                    ? 'bg-[var(--z-accent-dim)] text-[var(--z-accent-bright)] border-[var(--z-accent)]'
                    : 'bg-[var(--z-elevated)] text-[var(--z-text-muted)] border-[var(--z-border)] hover:border-[var(--z-border-bright)]'
                }`}
              >
                {t === 'all' ? 'All Risks' : typeLabels[t as RiskItem['type']]}
              </button>
            ))}
          </div>

          {/* Risk list */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filtered.map((risk, i) => (
              <button
                key={risk.id}
                onClick={() => setSelectedRisk(selectedRisk?.id === risk.id ? null : risk)}
                className={`text-left z-surface p-4 transition-all z-fade-in hover:border-[var(--z-border-bright)] ${
                  selectedRisk?.id === risk.id ? 'border-[var(--z-accent)]' : ''
                }`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Shield size={14} style={{ color: severityColor[risk.severity] }} />
                    <span className="text-[13px] font-medium text-[var(--z-text-primary)]">{risk.title}</span>
                  </div>
                  <span className={`z-tag ${risk.severity === 'critical' || risk.severity === 'high' ? 'z-tag--danger' : risk.severity === 'medium' ? 'z-tag--warning' : 'z-tag--success'}`}>
                    {risk.severity}
                  </span>
                </div>
                <p className="text-[11px] z-text-muted leading-relaxed mb-3">{risk.description}</p>
                <div className="flex items-center gap-3 text-[10px] flex-wrap">
                  <span className="z-text-dim">{typeLabels[risk.type]}</span>
                  <span className="z-text-dim">·</span>
                  <span style={{ color: likelihoodColor[risk.likelihood] }} className="capitalize">{risk.likelihood}</span>
                  <span className="z-text-dim">·</span>
                  <span className="z-text-dim">{risk.timeHorizon}</span>
                </div>
                <div className="flex items-center gap-1 flex-wrap mt-2 pt-2 border-t border-[var(--z-border)]">
                  {risk.cascade.map((step, idx) => (
                    <span key={idx} className="flex items-center gap-1">
                      {idx > 0 && <ChevronRight size={9} className="z-text-dim" />}
                      <span className={`text-[9px] ${idx === risk.cascade.length - 1 ? 'text-[var(--z-danger)]' : 'z-text-dim'}`}>
                        {step}
                      </span>
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {/* Selected risk detail */}
          {selectedRisk && (
            <Panel title={selectedRisk.title} className="z-fade-in" headerAction={
              <span className={`z-tag ${selectedRisk.severity === 'critical' || selectedRisk.severity === 'high' ? 'z-tag--danger' : 'z-tag--warning'}`}>
                {selectedRisk.severity} severity
              </span>
            }>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <div>
                    <SectionLabel>Description</SectionLabel>
                    <p className="text-[12px] z-text-secondary leading-relaxed mt-1">{selectedRisk.description}</p>
                  </div>
                  <div>
                    <SectionLabel>Root Cause</SectionLabel>
                    <p className="text-[12px] z-text-secondary leading-relaxed mt-1">{selectedRisk.cause}</p>
                  </div>
                  <div>
                    <SectionLabel>Affected Systems</SectionLabel>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {selectedRisk.affectedSystems.map(sys => (
                        <span key={sys} className="z-tag">{sys}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="z-surface-elevated p-3">
                      <div className="z-label mb-1">Severity</div>
                      <div className="text-[14px] font-semibold capitalize" style={{ color: severityColor[selectedRisk.severity] }}>
                        {selectedRisk.severity}
                      </div>
                    </div>
                    <div className="z-surface-elevated p-3">
                      <div className="z-label mb-1">Likelihood</div>
                      <div className="text-[14px] font-semibold capitalize" style={{ color: likelihoodColor[selectedRisk.likelihood] }}>
                        {selectedRisk.likelihood}
                      </div>
                    </div>
                    <div className="z-surface-elevated p-3">
                      <div className="z-label mb-1">Time Horizon</div>
                      <div className="text-[14px] font-semibold text-[var(--z-text-primary)]">{selectedRisk.timeHorizon}</div>
                    </div>
                    <div className="z-surface-elevated p-3">
                      <div className="z-label mb-1">Uncertainty</div>
                      <div className="text-[14px] font-semibold capitalize" style={{ color: selectedRisk.uncertainty === 'low' ? 'var(--z-success)' : selectedRisk.uncertainty === 'moderate' ? 'var(--z-warning)' : 'var(--z-danger)' }}>
                        {selectedRisk.uncertainty.replace('-', ' ')}
                      </div>
                    </div>
                  </div>
                  <div>
                    <SectionLabel>Causal Cascade</SectionLabel>
                    <div className="flex items-center gap-1 flex-wrap mt-2">
                      {selectedRisk.cascade.map((step, idx) => (
                        <span key={idx} className="flex items-center gap-1">
                          {idx > 0 && <ChevronRight size={10} className="z-text-dim" />}
                          <span className={`text-[11px] px-2 py-1 rounded ${
                            idx === 0 ? 'bg-[var(--z-accent-dim)] text-[var(--z-accent-bright)]' :
                            idx === selectedRisk.cascade.length - 1 ? 'bg-[rgba(248,113,113,0.08)] text-[var(--z-danger)]' :
                            'bg-[var(--z-elevated)] z-text-secondary'
                          }`}>{step}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
