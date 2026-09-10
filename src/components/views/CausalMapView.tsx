import { useState } from 'react';
import { CausalGraph } from '../CausalGraph';
import { Panel, SectionLabel } from '../shared/Panel';
import { CategoryIcon, categoryColor, categoryLabel } from '../shared/CategoryIcon';
import { CAUSAL_GRAPH } from '@/data/demoData';
import type { CausalNode, CausalNodeCategory, CausalEdge } from '@/types';

export function CausalMapView() {
  const [selectedNode, setSelectedNode] = useState<CausalNode | null>(null);

  const categories: CausalNodeCategory[] = [...new Set(CAUSAL_GRAPH.nodes.map((n: CausalNode) => n.category))];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-5 py-3 border-b border-[var(--z-border)] flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--z-text-primary)]">Causal Map</h2>
          <p className="text-[11px] z-text-muted mt-0.5">
            Interactive graph of causes, effects, and relationships across {CAUSAL_GRAPH.nodes.length} variables
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="z-tag z-tag--demo">Simulated Model</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Graph */}
        <div className="flex-1 flex flex-col">
          <CausalGraph
            graph={CAUSAL_GRAPH}
            selectedNodeId={selectedNode?.id}
            onSelectNode={setSelectedNode}
            height={600}
          />
        </div>

        {/* Right sidebar — context */}
        <div className="w-[260px] border-l border-[var(--z-border)] overflow-y-auto p-4 space-y-4 flex-shrink-0">
          {/* Categories */}
          <div>
            <SectionLabel>System Domains</SectionLabel>
            <div className="space-y-1.5 mt-2">
              {categories.map((cat: CausalNodeCategory) => {
                const count = CAUSAL_GRAPH.nodes.filter((n: CausalNode) => n.category === cat).length;
                return (
                  <div key={cat} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <CategoryIcon category={cat} size={12} />
                      <span className="text-[11px] z-text-secondary">{categoryLabel(cat)}</span>
                    </div>
                    <span className="text-[10px] z-text-dim z-mono">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <hr className="z-divider" />

          {/* Stats */}
          <div>
            <SectionLabel>Graph Statistics</SectionLabel>
            <div className="space-y-2 mt-2">
              {[
                { label: 'Nodes', value: CAUSAL_GRAPH.nodes.length },
                { label: 'Edges', value: CAUSAL_GRAPH.edges.length },
                { label: 'Max Cascade Depth', value: '4 orders' },
                { label: 'Root Causes', value: CAUSAL_GRAPH.nodes.filter((n: CausalNode) => n.isRoot).length },
                { label: 'Discovered', value: CAUSAL_GRAPH.nodes.filter((n: CausalNode) => n.isDiscovered).length },
                { label: 'Risk Nodes', value: CAUSAL_GRAPH.nodes.filter((n: CausalNode) => n.riskLevel).length },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-[11px] z-text-muted">{s.label}</span>
                  <span className="text-[12px] z-text-secondary font-medium z-mono">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          <hr className="z-divider" />

          {/* Selected node detail */}
          {selectedNode ? (
            <div className="z-fade-in">
              <SectionLabel accent>Selected Node</SectionLabel>
              <div className="mt-2 space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: categoryColor(selectedNode.category) }} />
                  <span className="text-[13px] font-medium text-[var(--z-text-primary)]">{selectedNode.label}</span>
                </div>
                <p className="text-[11px] z-text-muted leading-relaxed">{selectedNode.description}</p>
                <div>
                  <span className="z-label">Category</span>
                  <div className="text-[11px] z-text-secondary mt-0.5">{categoryLabel(selectedNode.category)}</div>
                </div>
                {selectedNode.uncertainty && (
                  <div>
                    <span className="z-label">Uncertainty</span>
                    <div className="text-[11px] text-[var(--z-warning)] mt-0.5 capitalize">{selectedNode.uncertainty.replace('-', ' ')}</div>
                  </div>
                )}
                {selectedNode.riskLevel && (
                  <div>
                    <span className="z-label">Risk Level</span>
                    <div className="text-[11px] text-[var(--z-danger)] mt-0.5 capitalize">{selectedNode.riskLevel}</div>
                  </div>
                )}
                {selectedNode.isDiscovered && (
                  <span className="z-tag z-tag--warning w-full justify-center py-1">Discovered by ZORVION</span>
                )}
                {selectedNode.isRoot && (
                  <span className="z-tag w-full justify-center py-1" style={{ background: 'rgba(74,158,255,0.08)', borderColor: 'rgba(74,158,255,0.2)', color: 'var(--z-accent)' }}>Root Cause</span>
                )}
                <div>
                  <span className="z-label">Relationships</span>
                  <div className="text-[11px] z-text-secondary mt-0.5">
                    {CAUSAL_GRAPH.edges.filter((e: CausalEdge) => e.from === selectedNode.id || e.to === selectedNode.id).length} connections
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <SectionLabel>Instructions</SectionLabel>
              <div className="text-[11px] z-text-muted leading-relaxed mt-2 space-y-1.5">
                <p>Click a node to inspect its relationships and properties.</p>
                <p>Drag to pan. Scroll to zoom.</p>
                <p>Use cascade filters to show specific effect orders.</p>
                <p>Dashed lines indicate uncertainty.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
