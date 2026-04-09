/**
 * OLIMPIA ARENA - Pantalla Rankings
 * Leaderboards y posicionamiento de usuarios
 */

import React, { useEffect, useState } from 'react';
import { COLORS, TYPOGRAPHY } from '@/theme';
import type { RankingBoard } from '@/models/ranking/types';
import { getRankingBoard } from '@/services/rankingService';
import { ViewContainer, ViewTitle } from '@/components/shared';
import { RankingBoard as RankingBoardComponent } from '@/components/ranking';

export const RankingView: React.FC = () => {
  const [ranking, setRanking] = useState<RankingBoard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRanking = async () => {
      try {
        const data = await getRankingBoard();
        setRanking(data);
      } finally {
        setLoading(false);
      }
    };

    loadRanking();
  }, []);

  return (
    <ViewContainer>
      <ViewTitle>RANKINGS</ViewTitle>

      {loading ? (
        <div style={{ ...TYPOGRAPHY.body.md, color: COLORS.text.secondary }}>
          Cargando ranking...
        </div>
      ) : ranking ? (
        <RankingBoardComponent board={ranking} />
      ) : (
        <div style={{ ...TYPOGRAPHY.body.md, color: COLORS.text.secondary }}>
          Ranking no disponible.
        </div>
      )}
    </ViewContainer>
  );
};
