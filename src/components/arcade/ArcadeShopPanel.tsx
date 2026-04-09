/**
 * ARCADE - Shop Panel Component
 * Panel de compra de ayudas durante gameplay
 */

import React from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import type { MarketItem } from '@/models/market/types';
import './ArcadeShopPanel.css';

interface ArcadeShopPanelProps {
  items: MarketItem[];
  onPurchase: (itemId: string) => void;
  isLoading?: boolean;
  onSpinClick?: () => void;
}

export const ArcadeShopPanel: React.FC<ArcadeShopPanelProps> = ({ 
  items, 
  onPurchase, 
  isLoading = false, 
  onSpinClick 
}) => {
  const shopButtonStyles: React.CSSProperties = {
    marginTop: DESIGN_CONSTANTS.spacing.xs,
    padding: '10px 14px',
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    border: 'none',
    backgroundColor: COLORS.neon.cyan,
    color: COLORS.background.abyss,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: DESIGN_CONSTANTS.shadows.glowCyanSmall,
  };

  const closeButtonStyles: React.CSSProperties = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: `2px solid ${COLORS.neon.cyan}`,
    backgroundColor: 'transparent',
    color: COLORS.neon.cyan,
    fontSize: '20px',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  };

  return (
    <section className="arcade-shop-panel">
      <button
        style={closeButtonStyles}
        onClick={onSpinClick}
        title="Probar suerte con la ruleta"
      >
        ✕
      </button>
      <div className="arcade-shop-panel__header">
        <div style={{ ...TYPOGRAPHY.label.sm, color: COLORS.text.secondary }}>Atascado?</div>
        <div style={{ ...TYPOGRAPHY.heading.h3, color: COLORS.neon.cyan, margin: 0 }}>
          Compra ayudas en vivo
        </div>
      </div>
      <div className="arcade-shop-panel__grid">
        {items.map((item) => (
          <div key={item.id} className="arcade-shop-panel__card">
            <div style={{ ...TYPOGRAPHY.heading.h4, color: COLORS.text.primary, margin: 0 }}>
              {item.icon} {item.name}
            </div>
            <div style={{ ...TYPOGRAPHY.body.sm, color: COLORS.text.secondary }}>{item.description}</div>
            <div style={{ ...TYPOGRAPHY.mono.md, color: COLORS.gamification.gold }}>
              {item.price.toLocaleString()} Ⓜ️
            </div>
            <button
              style={shopButtonStyles}
              onClick={() => onPurchase(item.id)}
              disabled={isLoading}
            >
              Comprar ahora
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
