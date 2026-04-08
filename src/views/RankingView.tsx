/**
 * OLIMPIA ARENA - Pantalla Rankings
 * Leaderboards y posicionamiento de usuarios
 */

import React, { useEffect, useState } from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import type { RankingBoard, RankingEntry } from '@/models/ranking/types';
import { getRankingBoard } from '@/services/rankingService';

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

  const boardStyles: React.CSSProperties = {
    backgroundColor: COLORS.background.night,
    borderRadius: DESIGN_CONSTANTS.borderRadius.lg,
    border: DESIGN_CONSTANTS.neoBorders.cyanThin,
    padding: DESIGN_CONSTANTS.spacing.lg,
    display: 'flex',
    flexDirection: 'column',
    gap: DESIGN_CONSTANTS.spacing.md,
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: DESIGN_CONSTANTS.spacing.md,
  };

  const pillStyles: React.CSSProperties = {
    ...TYPOGRAPHY.label.sm,
    color: COLORS.neon.cyan,
    border: `1px solid ${COLORS.neon.cyan}`,
    borderRadius: DESIGN_CONSTANTS.borderRadius.full,
    padding: '4px 10px',
  };

  const entryStyles = (isTop: boolean): React.CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: '40px 1fr 80px 60px',
    alignItems: 'center',
    gap: DESIGN_CONSTANTS.spacing.md,
    padding: DESIGN_CONSTANTS.spacing.md,
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    backgroundColor: isTop ? 'rgba(0, 255, 255, 0.08)' : COLORS.background.abyss,
    border: DESIGN_CONSTANTS.neoBorders.cyanThin,
  });

  const rankBadgeStyles = (rank: number): React.CSSProperties => {
    const color = rank === 1
      ? COLORS.gamification.gold
      : rank === 2
      ? COLORS.neon.teal
      : rank === 3
      ? COLORS.neon.cyan
      : COLORS.text.secondary;

    return {
      ...TYPOGRAPHY.mono.md,
      color,
      textAlign: 'center',
    };
  };

  const scoreStyles: React.CSSProperties = {
    ...TYPOGRAPHY.mono.md,
    color: COLORS.neon.cyan,
    textAlign: 'right',
  };

  const streakStyles: React.CSSProperties = {
    ...TYPOGRAPHY.body.sm,
    color: COLORS.text.secondary,
    textAlign: 'right',
  };

  const renderEntry = (entry: RankingEntry) => {
    return (
      <div key={entry.userId} style={entryStyles(entry.rank <= 3)}>
        <div style={rankBadgeStyles(entry.rank)}>{entry.rank}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: DESIGN_CONSTANTS.spacing.sm }}>
          <img
            src={entry.avatarUrl || 'https://i.pravatar.cc/60?img=5'}
            alt={entry.username}
            style={{ width: '36px', height: '36px', borderRadius: '50%' }}
          />
          <div>
            <div style={{ ...TYPOGRAPHY.body.md, fontWeight: 600 }}>{entry.username}</div>
            <div style={{ ...TYPOGRAPHY.body.xs, color: COLORS.text.secondary }}>
              {entry.country ? `Pais ${entry.country}` : 'Competidor'}
            </div>
          </div>
        </div>
        <div style={scoreStyles}>{entry.score}</div>
        <div style={streakStyles}>🔥 {entry.streak}</div>
      </div>
    );
  };

  return (
    <div style={containerStyles}>
      <h1 style={titleStyles}>RANKINGS</h1>

      {loading ? (
        <div style={{ ...TYPOGRAPHY.body.md, color: COLORS.text.secondary }}>Cargando ranking...</div>
      ) : ranking ? (
        <div style={boardStyles}>
          <div style={headerStyles}>
            <h3 style={{ ...TYPOGRAPHY.heading.h4, margin: 0 }}>{ranking.season.name}</h3>
            <span style={pillStyles}>Top {ranking.entries.length}</span>
          </div>
          {ranking.entries.map(renderEntry)}
        </div>
      ) : (
        <div style={{ ...TYPOGRAPHY.body.md, color: COLORS.text.secondary }}>Ranking no disponible.</div>
      )}
    </div>
  );
};
