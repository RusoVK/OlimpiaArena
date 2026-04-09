/**
 * ARCADE - Map Component
 * Sección del mapa con niveles
 */

import React from 'react';
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
      {levels.map((level) => (
        <div key={level.id} className="arcade-map__row">
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
