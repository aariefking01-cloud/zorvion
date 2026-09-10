interface Props {
  status: 'online' | 'active' | 'warning' | 'danger' | 'idle' | 'ready';
  size?: number;
  pulse?: boolean;
}

const colorMap: Record<Props['status'], string> = {
  online: 'var(--z-success)',
  active: 'var(--z-accent)',
  warning: 'var(--z-warning)',
  danger: 'var(--z-danger)',
  idle: 'var(--z-text-dim)',
  ready: 'var(--z-cyan)',
};

export function StatusDot({ status, size = 6, pulse = false }: Props) {
  const color = colorMap[status];
  return (
    <span
      className={pulse ? 'z-pulse' : ''}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'inline-block',
        background: color,
        boxShadow: `0 0 ${size}px ${color}`,
        flexShrink: 0,
      }}
    />
  );
}
