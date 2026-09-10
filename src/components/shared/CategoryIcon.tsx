import {
  Building2, Users, DollarSign, Leaf, Heart, Truck, Zap, Droplets,
  Scale, Cpu, Network, type LucideIcon,
} from 'lucide-react';
import type { CausalNodeCategory } from '@/types';

const categoryConfig: Record<CausalNodeCategory, { icon: LucideIcon; color: string; label: string }> = {
  infrastructure: { icon: Building2, color: '#4a9eff', label: 'Infrastructure' },
  population: { icon: Users, color: '#a78bfa', label: 'Population' },
  economy: { icon: DollarSign, color: '#34d399', label: 'Economy' },
  environment: { icon: Leaf, color: '#34d399', label: 'Environment' },
  health: { icon: Heart, color: '#f87171', label: 'Health' },
  transport: { icon: Truck, color: '#4a9eff', label: 'Transport' },
  energy: { icon: Zap, color: '#fbbf24', label: 'Energy' },
  water: { icon: Droplets, color: '#2dd4cf', label: 'Water' },
  policy: { icon: Scale, color: '#a78bfa', label: 'Policy' },
  technology: { icon: Cpu, color: '#2dd4cf', label: 'Technology' },
  social: { icon: Network, color: '#a78bfa', label: 'Social' },
};

interface Props {
  category: CausalNodeCategory;
  size?: number;
  showLabel?: boolean;
}

export function CategoryIcon({ category, size = 14, showLabel = false }: Props) {
  const config = categoryConfig[category];
  const Icon = config.icon;
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon size={size} style={{ color: config.color }} strokeWidth={1.8} />
      {showLabel && <span className="text-[11px] z-text-secondary">{config.label}</span>}
    </span>
  );
}

export function categoryColor(category: CausalNodeCategory): string {
  return categoryConfig[category].color;
}

export function categoryLabel(category: CausalNodeCategory): string {
  return categoryConfig[category].label;
}
