/**
 * ARCADE - Map Component
 * Sección del mapa con niveles
 */

import React from 'react';
import { COLORS } from '@/theme';
import { ArcadeLevelCard } from './ArcadeLevelCard';
import './ArcadeMap.css';

interface ArcadeMapProps {
  levels: Array<{
    id: number;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    starsRequired: number;
    starsEarned: number;
    maxStars: number;
    unlocked: boolean;
    goal: string;
  }>;
  onLevelStart: (level: any) => void;
  getDifficultyColor: (difficulty: string) => string;
}

export const ArcadeMap: React.FC<ArcadeMapProps> = ({ levels, onLevelStart, getDifficultyColor }) => {
  return (
    <section className="arcade-map">
      {levels.map((level, index) => (
        <div key={level.id} className="arcade-map__row">
          <div className="arcade-map__node-column">
            {index !== 0 && <div className="arcade-map__node-line" />}
            <div
              className={`arcade-map__node-circle ${level.unlocked ? 'is-unlocked' : 'is-locked'}`}
              style={{
                borderColor: level.unlocked ? COLORS.neon.cyan : COLORS.text.secondary,
                backgroundColor: level.unlocked ? 'rgba(0, 255, 255, 0.15)' : 'transparent',
                boxShadow: level.unlocked ? `0 0 8px rgba(0, 255, 255, 0.4)` : 'none',
              }}
            />
            {index !== levels.length - 1 && <div className="arcade-map__node-line" />}
          </div>

          <ArcadeLevelCard
            level={level}
            badgeColor={getDifficultyColor(level.difficulty)}
            onStart={() => onLevelStart(level)}
          />
        </div>
      ))}
    </section>
  );
};
