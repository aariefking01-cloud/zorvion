import type { Confidence, ConfidenceLevel } from '@/types';

const levelConfig: Record<ConfidenceLevel, { color: string; label: string }> = {
  high: { color: 'var(--z-success)', label: 'High' },
  moderate: { color: 'var(--z-accent)', label: 'Moderate' },
  low: { color: 'var(--z-warning)', label: 'Low' },
  'very-low': { color: 'var(--z-danger)', label: 'Very Low' },
};

interface Props {
  confidence: Confidence;
  compact?: boolean;
}

export function ConfidenceIndicator({ confidence, compact = false }: Props) {
  const config = levelConfig[confidence.level];
  return (
    <div className="flex items-center gap-2">
      <div className="z-confidence-track" style={{ width: compact ? 32 : 48 }}>
        <div
          className="z-confidence-fill"
          style={{ width: `${confidence.percentage}%`, background: config.color }}
        />
      </div>
      {!compact && (
        <span className="text-[11px] z-text-secondary" style={{ color: config.color }}>
          {config.label} · {confidence.percentage}%
        </span>
      )}
    </div>
  );
}

export function ConfidenceLabel({ confidence }: { confidence: Confidence }) {
  const config = levelConfig[confidence.level];
  return (
    <span className="text-[11px] font-medium" style={{ color: config.color }}>
      {config.label}
    </span>
  );
}
