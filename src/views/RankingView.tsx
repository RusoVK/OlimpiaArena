/**
 * OLIMPIA ARENA - Pantalla Rankings
 * Leaderboards y posicionamiento de usuarios
 */

import React from 'react';
import { COLORS, TYPOGRAPHY } from '@/theme';

export const RankingView: React.FC = () => {
  const containerStyles: React.CSSProperties = {
    padding: '24px 16px 100px',
    backgroundColor: COLORS.background.abyss,
    minHeight: '100vh',
  };

  const titleStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h1,
    color: COLORS.neon.cyan,
    textShadow: `0 0 16px ${COLORS.neon.cyan}`,
    marginBottom: '24px',
  };

  const placeholderStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '500px',
    backgroundColor: COLORS.background.night,
    borderRadius: '12px',
    border: `1px solid rgba(0, 255, 255, 0.3)`,
    color: COLORS.text.secondary,
    fontSize: '16px',
  };

  return (
    <div style={containerStyles}>
      <h1 style={titleStyles}>RANKINGS</h1>
      <div style={placeholderStyles}>
        Ranking View - (En desarrollo)
      </div>
    </div>
  );
};
