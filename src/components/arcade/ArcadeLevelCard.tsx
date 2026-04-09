/**
 * OLIMPIA ARENA - Arcade Level Card
 * Card reutilizable para niveles del mapa
 */

import React from 'react';
import { TYPOGRAPHY, COLORS, DESIGN_CONSTANTS } from '@/theme';
import './ArcadeLevelCard.css';

export type ArcadeLevelCardData = {
  id: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  starsRequired: number;
  starsEarned: number;
  maxStars: number;
  unlocked: boolean;
  goal: string;
};

interface ArcadeLevelCardProps {
  level: ArcadeLevelCardData;
  badgeColor: string;
  onStart: () => void;
}

export const ArcadeLevelCard: React.FC<ArcadeLevelCardProps> = ({ level, badgeColor, onStart }) => {
  const starsText = `${'★'.repeat(level.starsEarned)}${'☆'.repeat(level.maxStars - level.starsEarned)}`;

  return (
    <div className={`arcade-level-card ${level.unlocked ? '' : 'is-locked'}`}>
      <div className="arcade-level-card__header">
        <h3
          className="arcade-level-card__title"
          style={{ ...TYPOGRAPHY.heading.h4, color: COLORS.text.primary }}
        >
          {level.id}. {level.title}
        </h3>
        <span
          className="arcade-level-card__badge"
          style={{ color: badgeColor, borderColor: badgeColor }}
        >
          {level.difficulty}
        </span>
      </div>

      <div className="arcade-level-card__goal" style={{ ...TYPOGRAPHY.body.sm, color: COLORS.text.secondary }}>
        {level.goal}
      </div>

      <div className="arcade-level-card__stars">
        <span
          className="arcade-level-card__stars-text"
          style={{ ...TYPOGRAPHY.mono.sm, color: COLORS.gamification.gold, textShadow: `0 0 8px ${COLORS.gamification.gold}` }}
        >
          {starsText}
        </span>
        <span className="arcade-level-card__stars-required" style={{ ...TYPOGRAPHY.body.xs, color: COLORS.text.secondary }}>
          Requiere {level.starsRequired} estrellas
        </span>
      </div>

      <div className="arcade-level-card__actions">
        <button
          className={`arcade-level-card__button ${level.unlocked ? '' : 'is-locked'}`}
          onClick={onStart}
          disabled={!level.unlocked}
          style={{
            backgroundColor: COLORS.neon.cyan,
            color: COLORS.background.abyss,
            borderRadius: DESIGN_CONSTANTS.borderRadius.md,
            boxShadow: DESIGN_CONSTANTS.shadows.glowCyanSmall,
          }}
        >
          {level.unlocked ? 'Entrar al nivel' : 'Bloqueado'}
        </button>
      </div>
    </div>
  );
};
