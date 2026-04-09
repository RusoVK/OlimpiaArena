/**
 * ARCADE - Win Congratulations
 * Card de felicitaciones cuando gana movimientos
 */

import React, { useEffect } from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';

interface ArcadeWinCongratsProps {
  totalMoves: number;
  bonusMoves: number;
  onClose: () => void;
}

export const ArcadeWinCongrats: React.FC<ArcadeWinCongratsProps> = ({
  totalMoves,
  bonusMoves,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const containerStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: DESIGN_CONSTANTS.zIndex.modal + 1,
    animation: 'fadeIn 0.3s ease-in-out',
  };

  const cardStyles: React.CSSProperties = {
    borderRadius: '20px',
    border: `3px solid ${COLORS.gamification.gold}`,
    padding: '40px 32px',
    backgroundColor: COLORS.background.night,
    boxShadow: `0 0 40px rgba(255, 215, 0, 0.4), inset 0 0 20px rgba(0, 255, 255, 0.1)`,
    maxWidth: '380px',
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    textAlign: 'center',
    animation: 'slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
  };

  const emojiStyles: React.CSSProperties = {
    fontSize: '72px',
    animation: 'bounce 1s ease-in-out infinite',
  };

  const titleStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h1,
    color: COLORS.gamification.gold,
    margin: 0,
  };

  const subtitleStyles: React.CSSProperties = {
    ...TYPOGRAPHY.body.lg,
    color: COLORS.text.secondary,
    margin: 0,
  };

  const movesContainerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
    border: `1px solid ${COLORS.neon.cyan}`,
  };

  const movesItemStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...TYPOGRAPHY.mono.md,
  };

  const totalMovesStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h2,
    color: COLORS.neon.cyan,
    margin: '12px 0 0 0',
    padding: '12px',
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
  };

  const buttonStyles: React.CSSProperties = {
    padding: '12px 32px',
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    border: 'none',
    backgroundColor: COLORS.neon.cyan,
    color: COLORS.background.abyss,
    fontWeight: 700,
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  return (
    <div style={containerStyles}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>

      <div style={cardStyles}>
        <div style={emojiStyles}>🎉</div>

        <h1 style={titleStyles}>¡FELICITACIONES!</h1>

        <p style={subtitleStyles}>¡Has ganado movimientos extra para tu cubo!</p>

        <div style={movesContainerStyles}>
          <div style={movesItemStyles}>
            <span style={{ color: COLORS.text.secondary }}>Del premio:</span>
            <span style={{ color: COLORS.gamification.gold }}>+{bonusMoves} movimientos</span>
          </div>
          <div style={movesItemStyles}>
            <span style={{ color: COLORS.text.secondary }}>Bonus especial:</span>
            <span style={{ color: COLORS.neon.teal }}>+10 movimientos</span>
          </div>
        </div>

        <div style={totalMovesStyles}>
          Total: {totalMoves} movimientos 🚀
        </div>

        <button onClick={onClose} style={buttonStyles}>
          ¡A JUGAR!
        </button>
      </div>
    </div>
  );
};
