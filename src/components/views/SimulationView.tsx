import { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, RotateCcw, TrendingUp, Clock, GitBranch,
  ChevronRight,
} from 'lucide-react';
import { Panel, SectionLabel } from '../shared/Panel';
import { CategoryIcon, categoryColor } from '../shared/CategoryIcon';
import { ConfidenceIndicator } from '../shared/ConfidenceIndicator';
import { SCENARIOS } from '@/data/demoData';
import type { Scenario } from '@/types';

const TIME_STEPS = [
  { label: 'Now', year: 0 },
  { label: '6 Months', year: 0.5 },
  { label: '1 Year', year: 1 },
  { label: '3 Years', year: 3 },
  { label: '5 Years', year: 5 },
  { label: '10 Years', year: 10 },
];

export function SimulationView() {
  const [playing, setPlaying] = useState(false);
  const [timeIndex, setTimeIndex] = useState(0);
  const [selectedScenarioId, setSelectedScenarioId] = useState('s2');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scenario = SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[1];

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setTimeIndex(i => {
          if (i >= TIME_STEPS.length - 1) {
            setPlaying(false);
            return i;
          }
          return i + 1;
        });
      }, 800);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing]);

  const reset = () => {
    setPlaying(false);
    setTimeIndex(0);
  };

  // Generate trajectory data for chart
  const getTrajectory = (scenarioId: string, outcomeIdx: number) => {
    const s = SCENARIOS.find(x => x.id === scenarioId);
    if (!s || !s.outcomes[outcomeIdx]) return [];
    const baseDelta = s.outcomes[outcomeIdx].delta;
    return TIME_STEPS.map((_, i) => {
      const progress = i / (TIME_STEPS.length - 1);
      const easing = 1 - Math.pow(1 - progress, 2);
      return baseDelta * easing * (0.8 + Math.random() * 0.4);
    });
  };

  const trajectories = [
    { label: 'Congestion', idx: 0, color: '#4a9eff' },
    { label: 'GDP Impact', idx: 1, color: '#34d399' },
    { label: 'Emissions', idx: 2, color: '#fbbf24' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="px-5 py-3 border-b border-[var(--z-border)] flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--z-text-primary)]">Simulation</h2>
          <p className="text-[11px] z-text-muted mt-0.5">
            Project how the system evolves over time under each scenario
          </p>
        </div>
        <span className="z-tag z-tag--demo">Simulated Projection</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto px-6 py-5 space-y-5">
          {/* Controls */}
          <div className="z-surface p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <SectionLabel>Scenario</SectionLabel>
                <select
                  value={selectedScenarioId}
                  onChange={e => { setSelectedScenarioId(e.target.value); reset(); }}
                  className="bg-[var(--z-elevated)] border border-[var(--z-border)] rounded-md px-2.5 py-1.5 text-[12px] text-[var(--z-text-primary)] outline-none focus:border-[var(--z-accent)]"
                >
                  {SCENARIOS.filter(s => s.id !== 's0').map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPlaying(p => !p)}
                  className="z-btn z-btn--primary"
                >
                  {playing ? <Pause size={13} /> : <Play size={13} />}
                  {playing ? 'Pause' : timeIndex >= TIME_STEPS.length - 1 ? 'Replay' : 'Play'}
                </button>
                <button onClick={reset} className="z-btn"><RotateCcw size={13} /> Reset</button>
              </div>
            </div>

            {/* Timeline */}
            <div className="flex items-center gap-1 mt-3">
              {TIME_STEPS.map((step, i) => (
                <button
                  key={i}
                  onClick={() => setTimeIndex(i)}
                  className={`flex-1 py-2 px-2 rounded-md text-center transition-all ${
                    i === timeIndex
                      ? 'bg-[var(--z-accent-dim)] border border-[var(--z-accent)]'
                      : i < timeIndex
                      ? 'bg-[var(--z-elevated)] border border-[var(--z-border)] opacity-60'
                      : 'bg-[var(--z-elevated)] border border-[var(--z-border)] opacity-30'
                  }`}
                >
                  <div className={`text-[10px] font-medium ${i === timeIndex ? 'text-[var(--z-accent-bright)]' : 'z-text-muted'}`}>
                    {step.label}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 mt-1.5">
              {TIME_STEPS.map((_, i) => (
                <div key={i} className="flex-1 h-0.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: i <= timeIndex ? '100%' : '0%',
                      background: i === timeIndex ? 'var(--z-accent)' : 'var(--z-border-bright)',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Trajectory chart */}
          <Panel title="System Trajectory" subtitle={`${scenario.name} — projected outcomes over time`}>
            <div className="relative h-[240px] z-grid-bg-fine rounded-md overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 800 240" preserveAspectRatio="none">
                {/* Grid lines */}
                {[60, 120, 180].map(y => (
                  <line key={y} x1="40" y1={y} x2="780" y2={y} stroke="var(--z-border)" strokeWidth="0.5" strokeDasharray="2 4" />
                ))}
                {/* Y axis labels */}
                <text x="8" y="30" fill="var(--z-text-dim)" fontSize="9" className="z-mono">+40%</text>
                <text x="8" y="125" fill="var(--z-text-dim)" fontSize="9" className="z-mono">0%</text>
                <text x="8" y="220" fill="var(--z-text-dim)" fontSize="9" className="z-mono">-40%</text>
                {/* Center line */}
                <line x1="40" y1="120" x2="780" y2="120" stroke="var(--z-border-bright)" strokeWidth="0.5" />

                {/* Trajectories */}
                {trajectories.map(traj => {
                  const data = getTrajectory(selectedScenarioId, traj.idx);
                  const points = data.slice(0, timeIndex + 1).map((v, i) => {
                    const x = 40 + (i / (TIME_STEPS.length - 1)) * 740;
                    const y = 120 - (v * 2.5);
                    return `${x},${y}`;
                  }).join(' ');

                  return (
                    <g key={traj.label}>
                      <polyline
                        points={points}
                        fill="none"
                        stroke={traj.color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.8"
                      />
                      {/* End point */}
                      {timeIndex >= 0 && data[timeIndex] !== undefined && (
                        <circle
                          cx={40 + (timeIndex / (TIME_STEPS.length - 1)) * 740}
                          cy={120 - (data[timeIndex] * 2.5)}
                          r="3"
                          fill={traj.color}
                        >
                          <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                      )}
                    </g>
                  );
                })}

                {/* Time marker */}
                <line
                  x1={40 + (timeIndex / (TIME_STEPS.length - 1)) * 740}
                  y1="10" x2={40 + (timeIndex / (TIME_STEPS.length - 1)) * 740}
                  y2="230"
                  stroke="var(--z-accent)"
                  strokeWidth="0.5"
                  strokeDasharray="3 3"
                  opacity="0.5"
                />
              </svg>

              {/* Legend */}
              <div className="absolute top-3 right-3 z-surface px-3 py-2 space-y-1">
                {trajectories.map(t => (
                  <div key={t.label} className="flex items-center gap-2">
                    <div className="w-3 h-0.5 rounded-full" style={{ background: t.color }} />
                    <span className="text-[10px] z-text-secondary">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          {/* Current state at time step */}
          <Panel title={`State at ${TIME_STEPS[timeIndex].label}`} subtitle="System indicators at this point in the timeline">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scenario.outcomes.slice(0, 3).map((outcome, i) => {
                const traj = getTrajectory(selectedScenarioId, i);
                const currentValue = traj[timeIndex] || outcome.delta;
                return (
                  <div key={outcome.id} className="z-surface-elevated p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CategoryIcon category={outcome.category} size={13} />
                      <span className="text-[12px] font-medium text-[var(--z-text-primary)]">{outcome.label}</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-[22px] font-bold z-mono" style={{ color: currentValue > 0 ? 'var(--z-danger)' : 'var(--z-success)' }}>
                        {currentValue > 0 ? '+' : ''}{currentValue.toFixed(1)}%
                      </span>
                      <span className="text-[10px] z-text-dim">vs baseline</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ConfidenceIndicator confidence={outcome.confidence} compact />
                      <span className="text-[10px] z-text-dim ml-auto z-mono">{TIME_STEPS[timeIndex].label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          {/* Uncertainty note */}
          <div className="z-surface p-4 border-l-2" style={{ borderLeftColor: 'var(--z-warning)' }}>
            <div className="flex items-start gap-3">
              <Clock size={14} className="text-[var(--z-warning)] mt-0.5 flex-shrink-0" />
              <div>
                <SectionLabel style={{ color: 'var(--z-warning)' } as any}>Uncertainty Increases Over Time</SectionLabel>
                <p className="text-[12px] z-text-muted leading-relaxed mt-1">
                  Projections beyond 3 years carry increasing uncertainty. The simulation uses
                  estimated parameters and does not account for unforeseen events. Confidence
                  intervals widen with each time step. Treat long-term projections as directional,
                  not predictive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
