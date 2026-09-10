import { useEffect, useState } from 'react';
import type { CoreState } from '@/types';

interface Props {
  state: CoreState;
  size?: number;
}

const stateConfig: Record<CoreState, { color: string; label: string; speed: number }> = {
  IDLE: { color: 'var(--z-accent)', label: 'IDLE', speed: 20 },
  ANALYZING: { color: 'var(--z-accent)', label: 'ANALYZING', speed: 8 },
  MAPPING: { color: 'var(--z-cyan)', label: 'MAPPING', speed: 6 },
  SIMULATING: { color: 'var(--z-violet)', label: 'SIMULATING', speed: 5 },
  DISCOVERING: { color: 'var(--z-warning)', label: 'DISCOVERING', speed: 7 },
  OPTIMIZING: { color: 'var(--z-success)', label: 'OPTIMIZING', speed: 6 },
  COMPLETE: { color: 'var(--z-success)', label: 'COMPLETE', speed: 15 },
  WARNING: { color: 'var(--z-danger)', label: 'WARNING', speed: 10 },
};

export function ZorvionCore({ state, size = 120 }: Props) {
  const [tick, setTick] = useState(0);
  const config = stateConfig[state];

  useEffect(() => {
    if (state === 'IDLE') return;
    const interval = setInterval(() => setTick(t => t + 1), 100);
    return () => clearInterval(interval);
  }, [state]);

  const half = size / 2;
  const ringRadius = half * 0.72;
  const innerRadius = half * 0.45;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`ZORVION Core — ${config.label}`}
    >
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full z-radial-glow"
        style={{ opacity: state === 'IDLE' ? 0.3 : 0.6 }}
      />

      {/* Rotating outer ring with nodes */}
      <svg
        className="absolute inset-0 z-core-rotate"
        style={{ animationDuration: `${config.speed}s` }}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={half} cy={half} r={ringRadius}
          fill="none"
          stroke={config.color}
          strokeWidth="0.5"
          strokeDasharray="2 6"
          opacity="0.4"
        />
        {/* Orbital nodes */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x = half + ringRadius * Math.cos(rad);
          const y = half + ringRadius * Math.sin(rad);
          return (
            <circle
              key={i}
              cx={x} cy={y} r="1.5"
              fill={config.color}
              opacity={0.5 + (tick % 6 === i ? 0.5 : 0)}
            />
          );
        })}
      </svg>

      {/* Counter-rotating inner ring */}
      <svg
        className="absolute inset-0"
        style={{
          animation: `z-core-rotate ${config.speed * 1.5}s linear infinite reverse`,
          animationPlayState: state === 'IDLE' ? 'paused' : 'running',
        }}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={half} cy={half} r={innerRadius}
          fill="none"
          stroke={config.color}
          strokeWidth="0.8"
          strokeDasharray="3 4"
          opacity="0.5"
        />
        {/* Arc segments */}
        {[0, 90, 180, 270].map((start, i) => {
          const r = innerRadius - 4;
          const s = (start * Math.PI) / 180;
          const e = ((start + 60) * Math.PI) / 180;
          return (
            <path
              key={i}
              d={`M ${half + r * Math.cos(s)} ${half + r * Math.sin(s)} A ${r} ${r} 0 0 1 ${half + r * Math.cos(e)} ${half + r * Math.sin(e)}`}
              fill="none"
              stroke={config.color}
              strokeWidth="1.5"
              opacity="0.6"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Central core sphere */}
      <div
        className="z-core-pulse rounded-full"
        style={{
          width: size * 0.35,
          height: size * 0.35,
          background: `radial-gradient(circle at 35% 35%, ${config.color}, transparent 70%)`,
          opacity: 0.7,
          animationPlayState: state === 'IDLE' ? 'paused' : 'running',
        }}
      />

      {/* Center dot */}
      <div
        className="absolute rounded-full"
        style={{
          width: 4, height: 4,
          background: config.color,
          boxShadow: `0 0 12px ${config.color}`,
        }}
      />
    </div>
  );
}

export function ZorvionCoreSmall({ state = 'IDLE' }: { state?: CoreState }) {
  return (
    <div className="flex items-center gap-2.5">
      <ZorvionCore state={state} size={32} />
      <div>
        <div className="text-[15px] font-bold tracking-[0.15em] text-[var(--z-text-primary)]">ZORVION</div>
        <div className="text-[9px] tracking-[0.1em] z-text-dim">CONSEQUENCE INTELLIGENCE</div>
      </div>
    </div>
  );
}
