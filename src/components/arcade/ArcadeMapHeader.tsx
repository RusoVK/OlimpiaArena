/**
 * ARCADE - Map Header Component
 * Header cuando estás viendo el mapa de niveles
 */

import React from 'react';
import { COLORS, TYPOGRAPHY } from '@/theme';
import './ArcadeMapHeader.css';

interface ArcadeMapHeaderProps {
  totalStars: number;
  maxStars: number;
}

export const ArcadeMapHeader: React.FC<ArcadeMapHeaderProps> = ({ totalStars, maxStars }) => {
  const titleStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h1,
    color: COLORS.neon.cyan,
    textShadow: `0 0 16px ${COLORS.neon.cyan}`,
    margin: 0,
  };

  const subtitleStyles: React.CSSProperties = {
    ...TYPOGRAPHY.body.md,
    color: COLORS.text.secondary,
    margin: 0,
  };

  return (
    <header className="arcade-map-header">
      <h1 style={titleStyles}>ARCADE</h1>
      <p style={subtitleStyles}>Mapa de niveles con rutas y recompensas. Desbloquea nodos con estrellas.</p>
      <div className="arcade-map-header__stats">
        <div className="arcade-map-header__stat">
          <div style={{ ...TYPOGRAPHY.label.sm, color: COLORS.text.secondary }}>Estrellas totales</div>
          <div style={{ ...TYPOGRAPHY.heading.h3, color: COLORS.neon.cyan, margin: 0 }}>
            {totalStars} / {maxStars}
          </div>
        </div>
        <div className="arcade-map-header__stat">
          <div style={{ ...TYPOGRAPHY.label.sm, color: COLORS.text.secondary }}>Temporada</div>
          <div style={{ ...TYPOGRAPHY.heading.h4, color: COLORS.text.primary, margin: 0 }}>
            Rubik Rush I
          </div>
        </div>
      </div>
    </header>
  );
};
