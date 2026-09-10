import { useState } from 'react';
import { BookOpen, Search, ChevronRight, Database, Clock } from 'lucide-react';
import { Panel, SectionLabel } from '../shared/Panel';
import { ConfidenceIndicator } from '../shared/ConfidenceIndicator';
import { CategoryIcon, categoryLabel } from '../shared/CategoryIcon';
import { KNOWLEDGE_ENTRIES } from '@/data/demoData';
import type { KnowledgeEntry, DataProvenance } from '@/types';

const provenanceConfig: Record<DataProvenance, { label: string; color: string }> = {
  real: { label: 'Real Data', color: 'var(--z-success)' },
  synthetic: { label: 'Synthetic', color: 'var(--z-warning)' },
  estimated: { label: 'Estimated', color: 'var(--z-accent)' },
  'model-output': { label: 'Model Output', color: 'var(--z-violet)' },
};

export function KnowledgeView() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<KnowledgeEntry | null>(null);

  const filtered = KNOWLEDGE_ENTRIES.filter(e =>
    e.title.toLowerCase().includes(query.toLowerCase()) ||
    e.summary.toLowerCase().includes(query.toLowerCase()) ||
    e.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      <div className="px-5 py-3 border-b border-[var(--z-border)] flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--z-text-primary)]">Knowledge</h2>
          <p className="text-[11px] z-text-muted mt-0.5">
            Evidence, data provenance, and causal knowledge base
          </p>
        </div>
        <span className="z-tag z-tag--demo">Demo Knowledge Base</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1000px] mx-auto px-6 py-5 space-y-4">
          {/* Search */}
          <div className="flex items-center gap-2 z-surface px-4 py-2.5">
            <Search size={14} className="z-text-muted" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search knowledge entries..."
              className="flex-1 bg-transparent text-[13px] text-[var(--z-text-primary)] placeholder:text-[var(--z-text-dim)] outline-none"
            />
          </div>

          {/* Knowledge entries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((entry, i) => {
              const prov = provenanceConfig[entry.provenance];
              return (
                <button
                  key={entry.id}
                  onClick={() => setSelected(selected?.id === entry.id ? null : entry)}
                  className={`text-left z-surface p-4 transition-all z-fade-in hover:border-[var(--z-border-bright)] ${
                    selected?.id === entry.id ? 'border-[var(--z-accent)]' : ''
                  }`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <BookOpen size={14} className="text-[var(--z-accent)]" />
                      <span className="text-[13px] font-medium text-[var(--z-text-primary)]">{entry.title}</span>
                    </div>
                    <span className="z-tag" style={{ color: prov.color, borderColor: prov.color + '30' }}>
                      {prov.label}
                    </span>
                  </div>
                  <p className="text-[11px] z-text-muted leading-relaxed mb-3">{entry.summary}</p>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="z-text-dim">{entry.category}</span>
                    <span className="z-text-dim">·</span>
                    <ConfidenceIndicator confidence={entry.confidence} compact />
                    <span className="z-text-dim ml-auto flex items-center gap-1">
                      <Clock size={9} /> {entry.lastUpdated}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected entry detail */}
          {selected && (
            <Panel title={selected.title} className="z-fade-in" headerAction={
              <span className="z-tag" style={{ color: provenanceConfig[selected.provenance].color }}>
                {provenanceConfig[selected.provenance].label}
              </span>
            }>
              <div className="space-y-3">
                <p className="text-[13px] z-text-secondary leading-relaxed">{selected.summary}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <SectionLabel>Confidence</SectionLabel>
                    <div className="mt-1"><ConfidenceIndicator confidence={selected.confidence} /></div>
                  </div>
                  <div>
                    <SectionLabel>Last Updated</SectionLabel>
                    <div className="text-[12px] z-text-secondary mt-1">{selected.lastUpdated}</div>
                  </div>
                </div>
                <div>
                  <SectionLabel>Related Causal Nodes</SectionLabel>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selected.relatedNodes.map(node => (
                      <span key={node} className="z-tag">{node}</span>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-[var(--z-border)] flex items-center gap-2">
                  <Database size={12} className="z-text-dim" />
                  <span className="text-[10px] z-text-dim">
                    Data provenance: {provenanceConfig[selected.provenance].label}. This source was used in the causal model construction.
                  </span>
                </div>
              </div>
            </Panel>
          )}

          {/* Trust architecture */}
          <div className="z-surface p-4 border-l-2" style={{ borderLeftColor: 'var(--z-accent)' }}>
            <div className="flex items-start gap-3">
              <Database size={14} className="text-[var(--z-accent)] mt-0.5 flex-shrink-0" />
              <div>
                <SectionLabel accent>Data Provenance</SectionLabel>
                <p className="text-[12px] z-text-muted leading-relaxed mt-1">
                  ZORVION distinguishes between real data, synthetic data, estimates, and model outputs.
                  Every finding traces back to its source. If data is unavailable, the system says so.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {Object.entries(provenanceConfig).map(([key, cfg]) => (
                    <span key={key} className="z-tag" style={{ color: cfg.color, borderColor: cfg.color + '30' }}>
                      {cfg.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
