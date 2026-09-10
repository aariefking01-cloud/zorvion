import { useState, useRef, useCallback, useEffect } from 'react';
import type { CausalGraph as CausalGraphType, CausalNode, CausalEdge } from '@/types';
import { categoryColor, categoryLabel } from './shared/CategoryIcon';
import { ConfidenceLabel } from './shared/ConfidenceIndicator';

interface Props {
  graph: CausalGraphType;
  selectedNodeId?: string;
  onSelectNode?: (node: CausalNode | null) => void;
  height?: number;
  showFilters?: boolean;
  showLegend?: boolean;
}

type LayerFilter = 'all' | 1 | 2 | 3 | 4;

export function CausalGraph({ graph, selectedNodeId, onSelectNode, height = 500, showFilters = true, showLegend = true }: Props) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [layerFilter, setLayerFilter] = useState<LayerFilter>('all');
  const [showRisk, setShowRisk] = useState(true);
  const [showUncertainty, setShowUncertainty] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const selectedNode = graph.nodes.find(n => n.id === selectedNodeId);

  const getConnectedEdges = useCallback((nodeId: string): Set<string> => {
    const connected = new Set<string>();
    graph.edges.forEach(e => {
      if (e.from === nodeId) connected.add(e.to);
      if (e.to === nodeId) connected.add(e.from);
    });
    return connected;
  }, [graph.edges]);

  const connectedNodes = selectedNodeId ? getConnectedEdges(selectedNodeId) : null;
  const hoveredConnected = hoveredNode ? getConnectedEdges(hoveredNode) : null;

  const isEdgeVisible = (edge: CausalEdge) => {
    if (layerFilter !== 'all' && edge.order !== layerFilter) return false;
    return true;
  };

  const isNodeDimmed = (node: CausalNode): boolean => {
    if (!selectedNodeId && !hoveredNode) return false;
    const focus = selectedNodeId || hoveredNode;
    if (!focus) return false;
    if (node.id === focus) return false;
    if (connectedNodes && connectedNodes.has(node.id)) return false;
    if (hoveredConnected && hoveredConnected.has(node.id)) return false;
    return true;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(z => Math.max(0.4, Math.min(2.5, z * delta)));
  };

  // Auto-center on first render
  useEffect(() => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  return (
    <div className="relative flex flex-col h-full">
      {/* Filters bar */}
      {showFilters && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--z-border)] flex-wrap">
          <span className="z-label">Cascade</span>
          <div className="flex gap-1">
            {(['all', 1, 2, 3, 4] as LayerFilter[]).map(l => (
              <button
                key={l}
                onClick={() => setLayerFilter(l)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  layerFilter === l
                    ? 'bg-[var(--z-accent-dim)] text-[var(--z-accent-bright)] border border-[var(--z-accent)]'
                    : 'bg-[var(--z-elevated)] text-[var(--z-text-muted)] border border-[var(--z-border)] hover:border-[var(--z-border-bright)]'
                }`}
              >
                {l === 'all' ? 'All' : `${l}°`}
              </button>
            ))}
          </div>
          <div className="h-3 w-px bg-[var(--z-border)]" />
          <button
            onClick={() => setShowRisk(!showRisk)}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors border ${
              showRisk
                ? 'bg-[rgba(248,113,113,0.08)] text-[var(--z-danger)] border-[rgba(248,113,113,0.2)]'
                : 'bg-[var(--z-elevated)] text-[var(--z-text-muted)] border-[var(--z-border)]'
            }`}
          >
            Risk
          </button>
          <button
            onClick={() => setShowUncertainty(!showUncertainty)}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors border ${
              showUncertainty
                ? 'bg-[rgba(251,191,36,0.08)] text-[var(--z-warning)] border-[rgba(251,191,36,0.2)]'
                : 'bg-[var(--z-elevated)] text-[var(--z-text-muted)] border-[var(--z-border)]'
            }`}
          >
            Uncertainty
          </button>
          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={() => setZoom(z => Math.max(0.4, z * 0.9))}
              className="w-6 h-6 flex items-center justify-center rounded bg-[var(--z-elevated)] border border-[var(--z-border)] text-[var(--z-text-muted)] hover:text-[var(--z-text-secondary)] transition-colors text-[14px]"
            >−</button>
            <span className="text-[10px] z-text-dim z-mono w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(z => Math.min(2.5, z * 1.1))}
              className="w-6 h-6 flex items-center justify-center rounded bg-[var(--z-elevated)] border border-[var(--z-border)] text-[var(--z-text-muted)] hover:text-[var(--z-text-secondary)] transition-colors text-[14px]"
            >+</button>
            <button
              onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
              className="px-2 h-6 flex items-center justify-center rounded bg-[var(--z-elevated)] border border-[var(--z-border)] text-[10px] z-text-muted hover:text-[var(--z-text-secondary)] transition-colors"
            >Reset</button>
          </div>
        </div>
      )}

      {/* Graph canvas */}
      <div className="relative flex-1 overflow-hidden z-grid-bg-fine" style={{ minHeight: height, cursor: isPanning ? 'grabbing' : 'default' }}>
        <svg
          ref={svgRef}
          className="w-full h-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onClick={e => { if (e.target === svgRef.current) onSelectNode?.(null); }}
        >
          <defs>
            {graph.edges.map(edge => {
              const fromNode = graph.nodes.find(n => n.id === edge.from);
              const color = fromNode ? categoryColor(fromNode.category) : 'var(--z-accent)';
              return (
                <marker
                  key={`arrow-${edge.id}`}
                  id={`arrow-${edge.id}`}
                  markerWidth="8"
                  markerHeight="8"
                  refX="7"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0,0 L7,3 L0,6 Z" fill={color} opacity={0.5} />
                </marker>
              );
            })}
          </defs>

          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Edges */}
            {graph.edges.filter(isEdgeVisible).map(edge => {
              const from = graph.nodes.find(n => n.id === edge.from);
              const to = graph.nodes.find(n => n.id === edge.to);
              if (!from || !to) return null;

              const color = from ? categoryColor(from.category) : 'var(--z-accent)';
              const isHighlighted = (selectedNodeId && (edge.from === selectedNodeId || edge.to === selectedNodeId)) ||
                                   (hoveredNode && (edge.from === hoveredNode || edge.to === hoveredNode));
              const isDimmed = (selectedNodeId || hoveredNode) && !isHighlighted;
              const strokeWidth = edge.strength === 'strong' ? 1.5 : edge.strength === 'moderate' ? 1 : 0.75;
              const dashArray = edge.uncertainty === 'moderate' || edge.uncertainty === 'low' ? '4 3' : undefined;

              // Curved path
              const dx = to.x - from.x;
              const dy = to.y - from.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const offset = 20;
              const midX = (from.x + to.x) / 2;
              const midY = (from.y + to.y) / 2;
              const nx = -dy / dist * offset;
              const ny = dx / dist * offset;

              return (
                <g key={edge.id} style={{ opacity: isDimmed ? 0.15 : 1, transition: 'opacity 200ms' }}>
                  <path
                    d={`M ${from.x} ${from.y} Q ${midX + nx} ${midY + ny} ${to.x} ${to.y}`}
                    fill="none"
                    stroke={color}
                    strokeWidth={isHighlighted ? strokeWidth + 0.5 : strokeWidth}
                    strokeDasharray={dashArray}
                    opacity={isHighlighted ? 0.8 : 0.35}
                    markerEnd={`url(#arrow-${edge.id})`}
                  />
                  {isHighlighted && (
                    <text
                      x={midX + nx * 1.5}
                      y={midY + ny * 1.5}
                      fill={color}
                      fontSize="9"
                      textAnchor="middle"
                      className="z-mono"
                      style={{ opacity: 0.9 }}
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {graph.nodes.map(node => {
              const color = categoryColor(node.category);
              const isSelected = node.id === selectedNodeId;
              const isHovered = node.id === hoveredNode;
              const isDimmed = isNodeDimmed(node);
              const isRoot = node.isRoot;
              const isDiscovered = node.isDiscovered;
              const radius = isRoot ? 22 : 16;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  style={{
                    opacity: isDimmed ? 0.25 : 1,
                    transition: 'opacity 200ms',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={e => { e.stopPropagation(); onSelectNode?.(node); }}
                >
                  {/* Risk ring */}
                  {showRisk && node.riskLevel && (
                    <circle r={radius + 5} fill="none" stroke="var(--z-danger)" strokeWidth="1" opacity={0.4} strokeDasharray="3 2" />
                  )}
                  {/* Uncertainty ring */}
                  {showUncertainty && node.uncertainty && (
                    <circle r={radius + 3} fill="none" stroke="var(--z-warning)" strokeWidth="0.8" opacity={0.3} strokeDasharray="2 2" />
                  )}
                  {/* Discovery ring */}
                  {isDiscovered && (
                    <circle r={radius + 7} fill="none" stroke="var(--z-warning)" strokeWidth="0.5" opacity={0.3} className="z-pulse" />
                  )}
                  {/* Main node */}
                  <circle
                    r={radius}
                    fill={isRoot ? color : 'var(--z-elevated-2)'}
                    fillOpacity={isRoot ? 0.15 : 1}
                    stroke={color}
                    strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1.2}
                    style={{ transition: 'stroke-width 150ms' }}
                  />
                  {/* Center dot for root */}
                  {isRoot && <circle r="3" fill={color} />}
                  {/* Label */}
                  <text
                    y={radius + 12}
                    textAnchor="middle"
                    fill={isSelected ? 'var(--z-text-primary)' : 'var(--z-text-secondary)'}
                    fontSize="10"
                    fontWeight={isSelected ? 600 : 400}
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Legend */}
        {showLegend && (
          <div className="absolute bottom-3 left-3 z-surface px-3 py-2 space-y-1 max-w-[200px]">
            <div className="z-label mb-1">Legend</div>
            {[
              { color: 'var(--z-danger)', label: 'Risk', dash: true },
              { color: 'var(--z-warning)', label: 'Uncertainty', dash: true },
              { color: 'var(--z-warning)', label: 'Discovered', dash: false, solid: false },
              { color: 'var(--z-accent)', label: 'Root cause', dash: false, solid: true },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                {item.dash ? (
                  <div className="w-4 h-0 border-t" style={{ borderColor: item.color, borderStyle: 'dashed' }} />
                ) : item.solid ? (
                  <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                ) : (
                  <div className="w-3 h-3 rounded-full border" style={{ borderColor: item.color }} />
                )}
                <span className="text-[10px] z-text-muted">{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Node detail panel */}
        {selectedNode && (
          <div className="absolute top-3 right-3 w-[240px] z-surface-raised z-slide-in-right overflow-hidden">
            <div className="px-3 py-2.5 border-b border-[var(--z-border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: categoryColor(selectedNode.category) }} />
                <span className="text-[12px] font-semibold text-[var(--z-text-primary)]">{selectedNode.label}</span>
              </div>
              <button
                onClick={() => onSelectNode?.(null)}
                className="text-[var(--z-text-dim)] hover:text-[var(--z-text-secondary)] text-[14px]"
              >×</button>
            </div>
            <div className="px-3 py-3 space-y-2.5">
              <div>
                <div className="z-label mb-1">Category</div>
                <div className="text-[11px] z-text-secondary">{categoryLabel(selectedNode.category)}</div>
              </div>
              <div>
                <div className="z-label mb-1">Description</div>
                <div className="text-[11px] z-text-secondary leading-relaxed">{selectedNode.description}</div>
              </div>
              {selectedNode.uncertainty && (
                <div>
                  <div className="z-label mb-1">Uncertainty</div>
                  <span className="text-[11px] text-[var(--z-warning)] capitalize">{selectedNode.uncertainty.replace('-', ' ')}</span>
                </div>
              )}
              {selectedNode.riskLevel && (
                <div>
                  <div className="z-label mb-1">Risk Level</div>
                  <span className="text-[11px] text-[var(--z-danger)] capitalize">{selectedNode.riskLevel}</span>
                </div>
              )}
              {selectedNode.isDiscovered && (
                <div className="z-tag z-tag--warning w-full justify-center py-1">Discovered Consequence</div>
              )}
              <div>
                <div className="z-label mb-1">Connections</div>
                <div className="text-[11px] z-text-secondary">
                  {graph.edges.filter(e => e.from === selectedNode.id || e.to === selectedNode.id).length} relationships
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
