import { useState } from 'react';
import {
  MapPin, Search, Crosshair, Maximize, Layers, Eye,
  Radio, Database, AlertTriangle,
} from 'lucide-react';
import { Panel, SectionLabel } from '../shared/Panel';
import { StatusDot } from '../shared/StatusDot';
import { LOCATIONS, DATA_SOURCES } from '@/data/demoData';
import type { LocationData, DataSourceStatus } from '@/types';

const statusConfig: Record<DataSourceStatus, { color: string; label: string }> = {
  live: { color: 'var(--z-success)', label: 'Live' },
  updated: { color: 'var(--z-accent)', label: 'Updated' },
  stale: { color: 'var(--z-warning)', label: 'Stale' },
  unavailable: { color: 'var(--z-danger)', label: 'Unavailable' },
};

const riskColor: Record<string, string> = {
  critical: 'var(--z-danger)',
  high: 'var(--z-danger)',
  medium: 'var(--z-warning)',
  low: 'var(--z-success)',
};

export function LocationView() {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(LOCATIONS[0]);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  return (
    <div className="h-full flex flex-col">
      <div className="px-5 py-3 border-b border-[var(--z-border)] flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--z-text-primary)]">Location Intelligence</h2>
          <p className="text-[11px] z-text-muted mt-0.5">
            Spatial analysis integrated with the causal intelligence system
          </p>
        </div>
        <span className="z-tag z-tag--demo">Simulated Map</span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Map area */}
        <div className="flex-1 relative z-grid-bg overflow-hidden">
          {/* Map overlay */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 900 600" preserveAspectRatio="xMidYMid meet">
            {/* Region zones */}
            <rect x="200" y="250" width="200" height="150" fill="rgba(74,158,255,0.04)" stroke="var(--z-border)" strokeWidth="0.5" strokeDasharray="4 4" />
            <rect x="600" y="200" width="250" height="200" fill="rgba(74,158,255,0.04)" stroke="var(--z-border)" strokeWidth="0.5" strokeDasharray="4 4" />
            <rect x="350" y="120" width="150" height="100" fill="rgba(251,191,36,0.03)" stroke="var(--z-border)" strokeWidth="0.5" strokeDasharray="4 4" />
            <rect x="500" y="380" width="150" height="100" fill="rgba(248,113,113,0.04)" stroke="var(--z-border)" strokeWidth="0.5" strokeDasharray="4 4" />

            {/* Highway corridor line */}
            <line x1="280" y1="320" x2="720" y2="280" stroke="var(--z-accent)" strokeWidth="2" strokeDasharray="6 4" opacity="0.4" />
            <text x="500" y="290" fill="var(--z-accent)" fontSize="9" textAnchor="middle" className="z-mono" opacity="0.6">Proposed Highway</text>

            {/* Location markers */}
            {LOCATIONS.map(loc => {
              const isSelected = selectedLocation?.id === loc.id;
              const isHovered = hoveredLocation === loc.id;
              const color = riskColor[loc.risk];
              const radius = isSelected ? 14 : isHovered ? 11 : 8;

              return (
                <g
                  key={loc.id}
                  transform={`translate(${loc.coordinates.x}, ${loc.coordinates.y})`}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredLocation(loc.id)}
                  onMouseLeave={() => setHoveredLocation(null)}
                  onClick={() => setSelectedLocation(loc)}
                >
                  {/* Pulse ring for selected */}
                  {isSelected && (
                    <circle r={radius + 6} fill="none" stroke={color} strokeWidth="1" opacity="0.3" className="z-pulse" />
                  )}
                  {/* Risk ring */}
                  <circle r={radius + 3} fill="none" stroke={color} strokeWidth="1" opacity="0.4" strokeDasharray="2 2" />
                  {/* Main marker */}
                  <circle r={radius} fill={color} fillOpacity={isSelected ? 0.3 : 0.15} stroke={color} strokeWidth={isSelected ? 2 : 1.2} />
                  {/* Center dot */}
                  <circle r="2" fill={color} />
                  {/* Label */}
                  <text
                    y={radius + 14}
                    textAnchor="middle"
                    fill={isSelected ? 'var(--z-text-primary)' : 'var(--z-text-secondary)'}
                    fontSize="10"
                    fontWeight={isSelected ? 600 : 400}
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {loc.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Map controls */}
          <div className="absolute top-3 left-3 z-surface px-3 py-2 flex items-center gap-2">
            <Search size={13} className="z-text-muted" />
            <input
              placeholder="Search location..."
              className="bg-transparent text-[12px] text-[var(--z-text-primary)] placeholder:text-[var(--z-text-dim)] outline-none w-32"
            />
          </div>

          <div className="absolute top-3 right-3 flex flex-col gap-1">
            <button className="w-8 h-8 z-surface flex items-center justify-center z-text-muted hover:text-[var(--z-text-secondary)] transition-colors"><Crosshair size={14} /></button>
            <button className="w-8 h-8 z-surface flex items-center justify-center z-text-muted hover:text-[var(--z-text-secondary)] transition-colors"><Maximize size={14} /></button>
            <button className="w-8 h-8 z-surface flex items-center justify-center z-text-muted hover:text-[var(--z-text-secondary)] transition-colors"><Layers size={14} /></button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-3 left-3 z-surface px-3 py-2 space-y-1">
            <div className="z-label mb-1">Risk Level</div>
            {[
              { color: 'var(--z-danger)', label: 'Critical / High' },
              { color: 'var(--z-warning)', label: 'Medium' },
              { color: 'var(--z-success)', label: 'Low' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                <span className="text-[10px] z-text-muted">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Location detail panel */}
        <div className="w-[300px] border-l border-[var(--z-border)] overflow-y-auto flex-shrink-0">
          {selectedLocation ? (
            <div className="p-4 space-y-4 z-fade-in">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={14} style={{ color: riskColor[selectedLocation.risk] }} />
                  <h3 className="text-[14px] font-semibold text-[var(--z-text-primary)]">{selectedLocation.name}</h3>
                </div>
                <span className="text-[10px] z-text-dim">{selectedLocation.region}</span>
              </div>

              <div className={`z-tag ${selectedLocation.risk === 'critical' || selectedLocation.risk === 'high' ? 'z-tag--danger' : selectedLocation.risk === 'medium' ? 'z-tag--warning' : 'z-tag--success'}`}>
                {selectedLocation.risk} risk zone
              </div>

              <hr className="z-divider" />

              <div className="space-y-2.5">
                <div>
                  <SectionLabel>Population</SectionLabel>
                  <div className="text-[12px] z-text-secondary mt-0.5">{selectedLocation.population}</div>
                </div>
                <div>
                  <SectionLabel>Infrastructure</SectionLabel>
                  <div className="text-[12px] z-text-secondary mt-0.5">{selectedLocation.infrastructure}</div>
                </div>
                <div>
                  <SectionLabel>Accessibility</SectionLabel>
                  <div className="text-[12px] z-text-secondary mt-0.5">{selectedLocation.accessibility}</div>
                </div>
                <div>
                  <SectionLabel>Environment</SectionLabel>
                  <div className="text-[12px] z-text-secondary mt-0.5">{selectedLocation.environment}</div>
                </div>
              </div>

              <hr className="z-divider" />

              <div>
                <SectionLabel>Constraints</SectionLabel>
                <div className="space-y-1.5 mt-2">
                  {selectedLocation.constraints.map((c, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <AlertTriangle size={11} className="text-[var(--z-warning)] mt-0.5 flex-shrink-0" />
                      <span className="text-[11px] z-text-secondary">{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="z-divider" />

              <div>
                <SectionLabel>Available Data</SectionLabel>
                <div className="space-y-2 mt-2">
                  {selectedLocation.availableData.map(d => {
                    const cfg = statusConfig[d.status];
                    return (
                      <div key={d.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <StatusDot status={d.status === 'live' ? 'online' : d.status === 'updated' ? 'active' : d.status === 'stale' ? 'warning' : 'danger'} size={5} pulse={d.status === 'live'} />
                          <span className="text-[11px] z-text-secondary">{d.label}</span>
                        </div>
                        <span className="text-[9px]" style={{ color: cfg.color }}>{cfg.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <hr className="z-divider" />

              <div className="flex items-center gap-2 text-[10px] z-text-dim">
                <Database size={11} />
                <span>Data provenance labeled per source</span>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center">
              <MapPin size={24} className="mx-auto z-text-dim mb-2" />
              <p className="text-[12px] z-text-muted">Select a location on the map</p>
            </div>
          )}
        </div>
      </div>

      {/* Data sources bar */}
      <div className="border-t border-[var(--z-border)] px-5 py-3">
        <div className="flex items-center gap-3 flex-wrap">
          <SectionLabel>Data Sources</SectionLabel>
          {DATA_SOURCES.map(ds => {
            const cfg = statusConfig[ds.status];
            return (
              <div key={ds.id} className="flex items-center gap-1.5 px-2 py-1 rounded border border-[var(--z-border)] bg-[var(--z-elevated)]">
                <StatusDot status={ds.status === 'live' ? 'online' : ds.status === 'updated' ? 'active' : ds.status === 'stale' ? 'warning' : 'danger'} size={4} pulse={ds.status === 'live'} />
                <span className="text-[10px] z-text-secondary">{ds.label}</span>
                <span className="text-[9px] z-text-dim">{ds.lastUpdated}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
