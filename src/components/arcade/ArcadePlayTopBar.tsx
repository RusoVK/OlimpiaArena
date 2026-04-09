/**
 * ARCADE - Play Top Bar
 * Barra superior compacta con iconos de control
 */

import React from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';

interface ArcadePlayTopBarProps {
  onExit: () => void;
  onRestart: () => void;
  isExitBlocked: boolean;
  movesRemaining: number;
  difficulty: string;
}

const difficultyEmoji = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return '🟢';
    case 'medium':
      return '🟡';
    case 'hard':
      return '🔴';
    default:
      return '⚪';
  }
};

export const ArcadePlayTopBar: React.FC<ArcadePlayTopBarProps> = ({
  onExit,
  onRestart,
  isExitBlocked,
  movesRemaining,
  difficulty,
}) => {
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: COLORS.background.night,
    border: DESIGN_CONSTANTS.neoBorders.cyanThin,
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    gap: DESIGN_CONSTANTS.spacing.md,
  };

  const statsStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  };

  const moveCountStyles: React.CSSProperties = {
    ...TYPOGRAPHY.mono.lg,
    color: movesRemaining <= 3 ? COLORS.gamification.alertOrange : COLORS.neon.cyan,
    fontWeight: 700,
    fontSize: '18px',
  };

  const difficultyBadgeStyles: React.CSSProperties = {
    fontSize: '16px',
  };

  const controlsStyles: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
  };

  const buttonStyles = (isDisabled: boolean): React.CSSProperties => ({
    padding: '8px 12px',
    borderRadius: DESIGN_CONSTANTS.borderRadius.sm,
    border: `1px solid ${COLORS.neon.cyan}`,
    backgroundColor: 'transparent',
    color: isDisabled ? COLORS.text.secondary : COLORS.neon.cyan,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    opacity: isDisabled ? 0.5 : 1,
  });

  return (
    <div style={containerStyles}>
      <div style={statsStyles}>
        <div style={difficultyBadgeStyles}>{difficultyEmoji(difficulty)}</div>
        <div style={moveCountStyles}>{movesRemaining}</div>
        <div style={{ ...TYPOGRAPHY.label.sm, color: COLORS.text.secondary }}>movimientos</div>
      </div>

      <div style={controlsStyles}>
        <button
          onClick={onRestart}
          style={buttonStyles(false)}
          title="Reiniciar nivel"
        >
          🔄
        </button>
        <button
          onClick={onExit}
          style={buttonStyles(isExitBlocked)}
          title={isExitBlocked ? 'Bloqueado' : 'Volver al mapa'}
        >
          🚪
        </button>
      </div>
    </div>
  );
};
