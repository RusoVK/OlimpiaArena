/**
 * COMPONENTE: Card de Item del Mercado
 * Muestra un premio individual con su información
 */

import React from 'react';
import { COLORS, TYPOGRAPHY } from '@/theme';
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

  const containerStyles: React.CSSProperties = {
    minWidth: '280px',
    padding: '16px',
    borderRadius: '12px',
    border: isSelected
      ? `1px solid ${COLORS.neon.cyan}`
      : '1px solid rgba(0, 255, 255, 0.35)',
    backgroundColor: 'rgba(16, 19, 22, 0.95)',
    cursor: 'pointer',
    transition: 'all 150ms ease',
    boxShadow: isSelected
      ? `0 0 15px rgba(0, 255, 255, 0.3)`
      : '0 0 12px rgba(0, 255, 255, 0.12)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    opacity: item.active ? 1 : 0.5,
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  };

  const iconAndNameStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  };

  const iconStyles: React.CSSProperties = {
    fontSize: '36px',
    lineHeight: 1,
  };

  const titleStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h4,
    color: COLORS.text.primary,
    margin: 0,
  };

  const rarityBadgeStyles: React.CSSProperties = {
    ...TYPOGRAPHY.label.sm,
    color: rarityColors[item.rarity] || COLORS.text.secondary,
    textTransform: 'uppercase',
    fontSize: '10px',
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
    padding: '2px 8px',
    borderRadius: '999px',
    border: `1px solid ${rarityColors[item.rarity] || COLORS.text.secondary}`,
    whiteSpace: 'nowrap',
  };

  const descriptionStyles: React.CSSProperties = {
    ...TYPOGRAPHY.body.sm,
    color: COLORS.text.secondary,
    margin: 0,
  };

  const footerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    marginTop: '8px',
  };

  const priceStyles: React.CSSProperties = {
    ...TYPOGRAPHY.mono.lg,
    color: COLORS.gamification.gold,
    textShadow: `0 0 8px ${COLORS.gamification.gold}`,
  };

  const buttonStyles: React.CSSProperties = {
    backgroundColor: COLORS.neon.cyan,
    color: COLORS.background.abyss,
    border: 'none',
    borderRadius: '6px',
    padding: '10px 16px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 150ms ease',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  return (
    <div
      style={containerStyles}
      onClick={() => onSelect(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(item);
        }
      }}
      role="button"
      tabIndex={0}
    >
      {/* Header: Icon + Name + Badge */}
      <div style={headerStyles}>
        <div style={iconAndNameStyles}>
          <div style={iconStyles}>{item.icon}</div>
          <h3 style={titleStyles}>{item.name}</h3>
        </div>
        <span style={rarityBadgeStyles}>{item.rarity}</span>
      </div>

      {/* Description */}
      <p style={descriptionStyles}>{item.description}</p>

      {/* Footer: Price + Button */}
      <div style={footerStyles}>
        <span style={priceStyles}>{item.price} Ⓜ️</span>
        <button
          style={buttonStyles}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item);
          }}
        >
          Canjear
        </button>
      </div>
    </div>
  );
};
