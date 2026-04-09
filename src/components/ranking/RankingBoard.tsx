import React from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import { PanelCard } from '@/components/shared';
import { RankingEntry } from './RankingEntry';
import type { RankingBoard as RankingBoardType } from '@/models/ranking/types';
import './RankingBoard.css';

interface RankingBoardProps {
  board: RankingBoardType;
}

export const RankingBoard: React.FC<RankingBoardProps> = ({ board }) => {
  return (
    <PanelCard>
      <div className="ranking-board-header">
        <h3 style={{ ...TYPOGRAPHY.heading.h4, margin: 0 }}>
          {board.season.name}
        </h3>
        <span className="ranking-board-badge">
          Top {board.entries.length}
        </span>
      </div>
      <div className="ranking-board-entries">
        {board.entries.map((entry) => (
          <RankingEntry key={entry.userId} entry={entry} />
        ))}
      </div>
    </PanelCard>
  );
};
