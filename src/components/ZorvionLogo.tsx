interface Props {
  size?: number;
  color?: string;
}

export function ZorvionLogo({ size = 24, color = 'var(--z-accent)' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-label="ZORVION logo">
      {/* Converging lines — causal convergence */}
      <path d="M 4 4 L 16 16 M 28 4 L 16 16 M 4 28 L 16 16 M 28 28 L 16 16" stroke={color} strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />
      {/* Outer hexagon ring */}
      <path
        d="M 16 3 L 27 9.5 L 27 22.5 L 16 29 L 5 22.5 L 5 9.5 Z"
        stroke={color} strokeWidth="1.5" fill="none" opacity="0.4"
      />
      {/* Inner diamond */}
      <path
        d="M 16 8 L 23 16 L 16 24 L 9 16 Z"
        stroke={color} strokeWidth="1.8" fill="none"
      />
      {/* Center node */}
      <circle cx="16" cy="16" r="2.5" fill={color} />
      {/* Branch points */}
      <circle cx="4" cy="4" r="1.5" fill={color} opacity="0.7" />
      <circle cx="28" cy="4" r="1.5" fill={color} opacity="0.7" />
      <circle cx="4" cy="28" r="1.5" fill={color} opacity="0.7" />
      <circle cx="28" cy="28" r="1.5" fill={color} opacity="0.7" />
    </svg>
  );
}
