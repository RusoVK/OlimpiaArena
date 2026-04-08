/**
 * COMPONENTE: Balance Header
 * Muestra el balance de TokaCoins del usuario
 */

import React from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';

interface BalanceHeaderProps {
  username: string;
  balance: number;
  level: number;
  isLoading?: boolean;
}

export const BalanceHeader: React.FC<BalanceHeaderProps> = ({ 
  username, 
  balance, 
  level, 
  isLoading = false 
}) => {
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: DESIGN_CONSTANTS.spacing.lg,
    backgroundColor: COLORS.background.night,
    borderRadius: DESIGN_CONSTANTS.borderRadius.lg,
    border: DESIGN_CONSTANTS.neoBorders.cyanMedium,
    boxShadow: DESIGN_CONSTANTS.shadows.glowCyanMedium,
    marginBottom: DESIGN_CONSTANTS.spacing.lg,
    gap: DESIGN_CONSTANTS.spacing.md,
  };

  const leftSectionStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: DESIGN_CONSTANTS.spacing.sm,
  };

  const usernameStyles: React.CSSProperties = {
    ...TYPOGRAPHY.body.md,
    color: COLORS.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const levelStyles: React.CSSProperties = {
    ...TYPOGRAPHY.label.sm,
    color: COLORS.neon.teal,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  };

  const rightSectionStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: DESIGN_CONSTANTS.spacing.xs,
  };

  const balanceContainerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: DESIGN_CONSTANTS.spacing.sm,
  };

  const balanceLabelStyles: React.CSSProperties = {
    ...TYPOGRAPHY.body.xs,
    color: COLORS.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  };

  const balanceValueStyles: React.CSSProperties = {
    ...TYPOGRAPHY.mono.lg,
    color: COLORS.gamification.gold,
    textShadow: `0 0 12px ${COLORS.gamification.gold}`,
    fontSize: '24px',
    fontWeight: 700,
  };

  const coinIconStyles: React.CSSProperties = {
    fontSize: '24px',
    lineHeight: 1,
    filter: `drop-shadow(0 0 8px ${COLORS.gamification.gold})`,
  };

  const pulseAnimationStyles: React.CSSProperties = isLoading ? {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  } : {};

  return (
    <div style={{ ...containerStyles, ...pulseAnimationStyles }}>
      <div style={leftSectionStyles}>
        <span style={usernameStyles}>👤 {username}</span>
        <span style={levelStyles}>
          ⭐ Nivel {level}
        </span>
      </div>

      <div style={rightSectionStyles}>
        <span style={balanceLabelStyles}>TuS TokaCoins</span>
        <div style={balanceContainerStyles}>
          <span style={balanceValueStyles}>
            {isLoading ? '...' : balance.toLocaleString()}
          </span>
          <span style={coinIconStyles}>Ⓜ️</span>
        </div>
      </div>
    </div>
  );
};
