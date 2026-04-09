import React from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import { MarketItemCard } from './MarketItemCard';
import type { MarketItem } from '@/models/market/types';
import './CategorySection.css';

interface CategorySectionProps {
  title: string;
  items: MarketItem[];
  onSelectItem: (item: MarketItem) => void;
  selectedItemId?: string;
  isWide?: boolean;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  items,
  onSelectItem,
  selectedItemId,
  isWide = false,
}) => {
  const categoryTitleStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h4,
    color: COLORS.neon.cyan,
    margin: 0,
    marginBottom: DESIGN_CONSTANTS.spacing.md,
    paddingBottom: DESIGN_CONSTANTS.spacing.md,
    borderBottom: `1px solid ${COLORS.neon.cyan}`,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontSize: '12px',
  };

  return (
    <div className={`category-section ${isWide ? 'is-wide' : ''}`}>
      <h3 style={categoryTitleStyles}>{title}</h3>
      <div className="category-items">
        {items.map(item => (
          <MarketItemCard
            key={item.id}
            item={item}
            onSelect={onSelectItem}
            isSelected={selectedItemId === item.id}
          />
        ))}
      </div>
    </div>
  );
};
