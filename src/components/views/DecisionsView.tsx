import { useState } from 'react';
import {
  FolderOpen, ChevronRight, MapPin, FileText, Download,
  AlertTriangle, CheckCircle2, Clock, Shield, Award, TrendingUp,
} from 'lucide-react';
import { Panel, SectionLabel } from '../shared/Panel';
import { ConfidenceIndicator } from '../shared/ConfidenceIndicator';
import { DECISION_HISTORY, DECISION_REPORT } from '@/data/demoData';
import type { DecisionProject } from '@/types';

const statusConfig: Record<DecisionProject['status'], { label: string; color: string; icon: typeof CheckCircle2 }> = {
  complete: { label: 'Complete', color: 'var(--z-success)', icon: CheckCircle2 },
  analyzing: { label: 'Analyzing', color: 'var(--z-accent)', icon: Clock },
  draft: { label: 'Draft', color: 'var(--z-text-muted)', icon: FileText },
  reviewing: { label: 'Reviewing', color: 'var(--z-warning)', icon: AlertTriangle },
};

const riskColor: Record<string, string> = {
  critical: 'var(--z-danger)',
  high: 'var(--z-danger)',
  medium: 'var(--z-warning)',
  low: 'var(--z-success)',
};

export function DecisionsView() {
  const [selectedDecision, setSelectedDecision] = useState<DecisionProject>(DECISION_HISTORY[0]);
  const [showReport, setShowReport] = useState(false);

  if (showReport) {
    return <DecisionReportView onBack={() => setShowReport(false)} />;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-5 py-3 border-b border-[var(--z-border)] flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--z-text-primary)]">Decisions</h2>
          <p className="text-[11px] z-text-muted mt-0.5">
            Decision history, analysis status, and intelligence reports
          </p>
        </div>
        <button onClick={() => setShowReport(true)} className="z-btn z-btn--primary">
          <FileText size={13} /> View Report
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto px-6 py-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Decision list */}
          <div className="lg:col-span-1 space-y-2.5">
            {DECISION_HISTORY.map(decision => {
              const selected = selectedDecision.id === decision.id;
              const status = statusConfig[decision.status];
              const StatusIcon = status.icon;
              return (
                <button
                  key={decision.id}
                  onClick={() => setSelectedDecision(decision)}
                  className={`w-full text-left z-surface p-4 transition-all ${
                    selected ? 'border-[var(--z-accent)]' : 'hover:border-[var(--z-border-bright)]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <StatusIcon size={13} style={{ color: status.color }} />
                      <span className="text-[13px] font-medium text-[var(--z-text-primary)]">{decision.title}</span>
                    </div>
                    <span className="z-tag" style={{ color: riskColor[decision.riskLevel], borderColor: riskColor[decision.riskLevel] + '40' }}>
                      {decision.riskLevel}
                    </span>
                  </div>
                  <p className="text-[11px] z-text-muted leading-relaxed mb-2 line-clamp-2">{decision.description}</p>
                  <div className="flex items-center gap-3 text-[10px] z-text-dim">
                    <span className="flex items-center gap-1"><MapPin size={10} /> {decision.location}</span>
                    <span>·</span>
                    <span>v{decision.version}</span>
                    <span>·</span>
                    <span>{decision.lastUpdated}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Decision detail */}
          <div className="lg:col-span-2 space-y-4">
            <Panel title={selectedDecision.title} headerAction={
              <span className="z-tag" style={{ color: statusConfig[selectedDecision.status].color, borderColor: statusConfig[selectedDecision.status].color + '40' }}>
                {statusConfig[selectedDecision.status].label}
              </span>
            }>
              <div className="space-y-4">
                <p className="text-[13px] z-text-secondary leading-relaxed">{selectedDecision.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Location', value: selectedDecision.location, icon: MapPin },
                    { label: 'Version', value: `v${selectedDecision.version}`, icon: FileText },
                    { label: 'Scenarios', value: String(selectedDecision.scenarioCount), icon: Shield },
                    { label: 'Updated', value: selectedDecision.lastUpdated, icon: Clock },
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="z-surface-elevated p-3">
                        <Icon size={12} className="z-text-dim mb-1" />
                        <div className="text-[12px] text-[var(--z-text-primary)] font-medium truncate">{item.value}</div>
                        <div className="text-[9px] z-text-dim mt-0.5">{item.label}</div>
                      </div>
                    );
                  })}
                </div>

                <div>
                  <SectionLabel>Analysis Confidence</SectionLabel>
                  <div className="mt-2">
                    <ConfidenceIndicator confidence={selectedDecision.confidence} />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[var(--z-border)]">
                  <button onClick={() => setShowReport(true)} className="z-btn z-btn--primary">
                    <FileText size={13} /> Open Report
                  </button>
                  <button className="z-btn"><Download size={13} /> Export</button>
                </div>
              </div>
            </Panel>

            {/* Quick summary */}
            <Panel title="Executive Summary">
              <p className="text-[13px] z-text-secondary leading-relaxed">{DECISION_REPORT.executiveSummary}</p>
              <div className="mt-4 pt-3 border-t border-[var(--z-border)]">
                <SectionLabel>Key Findings</SectionLabel>
                <div className="space-y-2 mt-2">
                  {DECISION_REPORT.keyFindings.slice(0, 3).map((finding, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <ChevronRight size={12} className="text-[var(--z-accent)] mt-0.5 flex-shrink-0" />
                      <span className="text-[12px] z-text-secondary leading-relaxed">{finding}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}

function DecisionReportView({ onBack }: { onBack: () => void }) {
  const sections = [
    { label: 'Decision', content: DECISION_REPORT.decision, icon: FileText },
    { label: 'Executive Summary', content: DECISION_REPORT.executiveSummary, icon: FileText },
    { label: 'Key Findings', content: DECISION_REPORT.keyFindings, icon: CheckCircle2, list: true },
    { label: 'Important Consequences', content: DECISION_REPORT.importantConsequences, icon: AlertTriangle, list: true },
    { label: 'Questions You Didn\'t Ask', content: DECISION_REPORT.questionsNotAsked, icon: AlertTriangle, list: true },
    { label: 'Risks', content: DECISION_REPORT.risks, icon: Shield, list: true },
    { label: 'Alternatives', content: DECISION_REPORT.alternatives, icon: FolderOpen, list: true },
    { label: 'Simulation Results', content: DECISION_REPORT.simulationResults, icon: TrendingUp, list: true },
    { label: 'Optimal Option', content: DECISION_REPORT.optimalOption, icon: Award },
    { label: 'Assumptions', content: DECISION_REPORT.assumptions, icon: FileText, list: true },
    { label: 'Uncertainties', content: DECISION_REPORT.uncertainties, icon: AlertTriangle, list: true },
    { label: 'Data Sources', content: DECISION_REPORT.dataSources, icon: FileText, list: true },
    { label: 'Next Actions', content: DECISION_REPORT.nextActions, icon: CheckCircle2, list: true },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="px-5 py-3 border-b border-[var(--z-border)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="z-btn z-btn--ghost"><ChevronRight size={13} className="rotate-180" /> Back</button>
          <div>
            <h2 className="text-[16px] font-semibold text-[var(--z-text-primary)]">Decision Intelligence Report</h2>
            <p className="text-[11px] z-text-muted mt-0.5">Highway Corridor Analysis — v3</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="z-tag z-tag--demo">Simulated</span>
          <button className="z-btn"><Download size={13} /> Export PDF</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[800px] mx-auto px-6 py-6 space-y-5">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <div key={i} className="z-surface p-5 z-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={14} className="text-[var(--z-accent)]" />
                  <h3 className="text-[13px] font-semibold text-[var(--z-text-primary)] tracking-wide">{section.label}</h3>
                </div>
                {section.list ? (
                  <div className="space-y-2">
                    {(section.content as string[]).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-[var(--z-accent)] mt-0.5 flex-shrink-0">•</span>
                        <span className="text-[12px] z-text-secondary leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] z-text-secondary leading-relaxed">{section.content as string}</p>
                )}
              </div>
            );
          })}

          <div className="z-surface p-4 border-l-2" style={{ borderLeftColor: 'var(--z-accent)' }}>
            <div className="flex items-start gap-3">
              <Award size={14} className="text-[var(--z-accent)] mt-0.5 flex-shrink-0" />
              <div>
                <SectionLabel accent>Recommendation</SectionLabel>
                <p className="text-[13px] z-text-secondary leading-relaxed mt-1">
                  {DECISION_REPORT.optimalOption}
                </p>
                <p className="text-[11px] z-text-dim mt-2">
                  This recommendation is based on current assumptions and constraints.
                  The final decision belongs to the human. Review all uncertainties before proceeding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
