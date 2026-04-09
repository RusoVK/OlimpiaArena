import React from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import './MarketHeader.css';

export const MarketHeader: React.FC = () => {
  const titleMainStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h1,
    color: COLORS.text.primary,
    margin: 0,
    marginBottom: DESIGN_CONSTANTS.spacing.xs,
    letterSpacing: '2px',
    textShadow: `0 0 10px ${COLORS.neon.cyan}`,
  };

  const titleSubStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h4,
    color: COLORS.neon.cyan,
    margin: 0,
    letterSpacing: '1px',
    fontWeight: 600,
  };

  return (
    <div className="market-header">
      <h1 style={titleMainStyles}>OLIMPIAARENA</h1>
      <p style={titleSubStyles}>MERCADO DE RECOMPENSAS</p>
    </div>
  );
};
