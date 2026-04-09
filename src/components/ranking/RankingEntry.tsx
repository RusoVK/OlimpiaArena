import React from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import type { RankingEntry as RankingEntryType } from '@/models/ranking/types';
import './RankingEntry.css';

interface RankingEntryProps {
  entry: RankingEntryType;
}

export const RankingEntry: React.FC<RankingEntryProps> = ({ entry }) => {
  const rankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return COLORS.gamification.gold;
      case 2:
        return COLORS.neon.teal;
      case 3:
        return COLORS.neon.cyan;
      default:
        return COLORS.text.secondary;
    }
  };

  return (
    <div className={`ranking-entry ${entry.rank <= 3 ? 'is-top' : ''}`}>
      <div className="ranking-position" style={{ color: rankBadgeColor(entry.rank) }}>
        {entry.rank}
      </div>
      <div className="ranking-user">
        <img
          src={entry.avatarUrl || 'https://i.pravatar.cc/60?img=5'}
          alt={entry.username}
          className="ranking-avatar"
        />
        <div className="ranking-user-info">
          <div className="ranking-username">{entry.username}</div>
          <div className="ranking-country">
            {entry.country ? `País: ${entry.country}` : 'Competidor'}
          </div>
        </div>
      </div>
      <div className="ranking-score">{entry.score}</div>
      <div className="ranking-streak">🔥 {entry.streak}</div>
    </div>
  );
};
