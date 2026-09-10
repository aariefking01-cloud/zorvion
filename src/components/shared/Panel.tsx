import type { ReactNode } from 'react';

interface PanelProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
  elevated?: boolean;
  noPadding?: boolean;
}

export function Panel({ title, subtitle, children, className = '', headerAction, elevated = false, noPadding = false }: PanelProps) {
  return (
    <div
      className={`${elevated ? 'z-surface-raised' : 'z-surface'} flex flex-col ${className}`}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--z-border)]">
          <div>
            {title && <h3 className="text-[13px] font-semibold text-[var(--z-text-primary)]">{title}</h3>}
            {subtitle && <p className="text-[11px] z-text-muted mt-0.5">{subtitle}</p>}
          </div>
          {headerAction}
        </div>
      )}
      <div className={noPadding ? '' : 'p-4'} style={{ flex: 1, minHeight: 0 }}>
        {children}
      </div>
    </div>
  );
}

interface SectionLabelProps {
  children: ReactNode;
  accent?: boolean;
  style?: React.CSSProperties;
}

export function SectionLabel({ children, accent = false, style }: SectionLabelProps) {
  return (
    <span className={accent ? 'z-label-accent' : 'z-label'} style={style}>{children}</span>
  );
}
