/**
 * ARCADE - Play Stats Component
 * Muestra stats durante el gameplay
 */

import React from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import './ArcadePlayStats.css';

interface ArcadePlayStatsProps {
  movesRemaining: number;
  difficulty: string;
  goal: string;
}

export const ArcadePlayStats: React.FC<ArcadePlayStatsProps> = ({ movesRemaining, difficulty, goal }) => {
  return (
    <section className="arcade-play-stats">
      <div className="arcade-play-stats__stat">
        <div style={{ ...TYPOGRAPHY.label.sm, color: COLORS.text.secondary }}>Movimientos restantes</div>
        <div style={{ ...TYPOGRAPHY.heading.h3, color: COLORS.neon.cyan, margin: 0 }}>
          {movesRemaining}
        </div>
      </div>
      <div className="arcade-play-stats__stat">
        <div style={{ ...TYPOGRAPHY.label.sm, color: COLORS.text.secondary }}>Dificultad</div>
        <div style={{ ...TYPOGRAPHY.heading.h4, color: COLORS.text.primary, margin: 0 }}>
          {difficulty.toUpperCase()}
        </div>
      </div>
      <div className="arcade-play-stats__stat">
        <div style={{ ...TYPOGRAPHY.label.sm, color: COLORS.text.secondary }}>Objetivo</div>
        <div style={{ ...TYPOGRAPHY.body.sm, color: COLORS.text.primary }}>{goal}</div>
      </div>
    </section>
  );
};
