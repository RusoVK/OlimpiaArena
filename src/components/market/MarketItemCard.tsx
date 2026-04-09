/**
 * COMPONENTE: Card de Item del Mercado
 * Muestra un premio individual con su información
 */

import React from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import type { MarketItem } from '@/models/market/types';

interface MarketItemCardProps {
  item: MarketItem;
  onSelect: (item: MarketItem) => void;
  isSelected?: boolean;
}

export const MarketItemCard: React.FC<MarketItemCardProps> = ({ item, onSelect, isSelected }) => {
  const rarityColors: Record<string, string> = {
    common: COLORS.text.secondary,
    rare: COLORS.neon.teal,
    epic: '#A78BFA',
    legendary: COLORS.gamification.gold,
  };

  const cardStyles: React.CSSProperties = {
    padding: DESIGN_CONSTANTS.spacing.md,
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    border: isSelected
      ? `2px solid ${COLORS.neon.cyan}`
      : DESIGN_CONSTANTS.neoBorders.cyanThin,
    backgroundColor: COLORS.background.night,
    cursor: 'pointer',
    transition: DESIGN_CONSTANTS.transitions.smooth,
    boxShadow: isSelected
      ? `0 0 15px rgba(0, 255, 255, 0.5)`
      : DESIGN_CONSTANTS.shadows.glowCyanSmall,
    display: 'flex',
    flexDirection: 'column',
    gap: DESIGN_CONSTANTS.spacing.xs,
    opacity: item.active ? 1 : 0.5,
  };

  const iconStyles: React.CSSProperties = {
    fontSize: '40px',
    lineHeight: 1,
    marginBottom: DESIGN_CONSTANTS.spacing.xs,
  };

  const titleStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h5,
    color: COLORS.text.primary,
    margin: 0,
  };

  const descriptionStyles: React.CSSProperties = {
    ...TYPOGRAPHY.body.sm,
    color: COLORS.text.secondary,
    minHeight: '40px',
  };

  const priceContainerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: DESIGN_CONSTANTS.spacing.sm,
  };

  const priceStyles: React.CSSProperties = {
    ...TYPOGRAPHY.mono.lg,
    color: COLORS.gamification.gold,
    textShadow: `0 0 8px ${COLORS.gamification.gold}`,
  };

  const rarityBadgeStyles: React.CSSProperties = {
    ...TYPOGRAPHY.label.sm,
    color: rarityColors[item.rarity] || COLORS.text.secondary,
    textTransform: 'uppercase',
    fontSize: '10px',
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
    padding: `${DESIGN_CONSTANTS.spacing.xs} ${DESIGN_CONSTANTS.spacing.sm}`,
    borderRadius: DESIGN_CONSTANTS.borderRadius.full,
    border: `1px solid ${rarityColors[item.rarity] || COLORS.text.secondary}`,
  };

  return (
    <div
      style={cardStyles}
      onClick={() => onSelect(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(item);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div style={iconStyles}>{item.icon}</div>
      <h6 style={titleStyles}>{item.name}</h6>
      <p style={descriptionStyles}>{item.description}</p>

      <div style={priceContainerStyles}>
        <div>
          <span style={priceStyles}>{item.price.toLocaleString()}</span>
          <span style={{ ...TYPOGRAPHY.label.sm, color: COLORS.text.secondary, marginLeft: '4px' }}>
            Ⓜ️
          </span>
        </div>
        <div style={rarityBadgeStyles}>{item.rarity}</div>
      </div>

      {item.quantity && (
        <div style={{ ...TYPOGRAPHY.body.xs, color: COLORS.neon.teal, marginTop: DESIGN_CONSTANTS.spacing.xs }}>
          Limitados: {item.quantity}
        </div>
      )}
    </div>
  );
};
