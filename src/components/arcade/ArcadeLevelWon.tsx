/**
 * ARCADE - Level Won Card
 * Card de felicitaciones cuando se completa un nivel
 */

import React from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';

interface ArcadeLevelWonProps {
  levelTitle: string;
  tokaCoinsEarned: number;
  onRetry: () => void;
  onNext: () => void;
}

export const ArcadeLevelWon: React.FC<ArcadeLevelWonProps> = ({
  levelTitle,
  tokaCoinsEarned,
  onRetry,
  onNext,
}) => {
  const containerStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: DESIGN_CONSTANTS.zIndex.modal + 100,
    animation: 'fadeIn 0.3s ease-in-out',
  };

  const cardStyles: React.CSSProperties = {
    borderRadius: '20px',
    border: `3px solid ${COLORS.gamification.gold}`,
    padding: '40px 32px',
    backgroundColor: COLORS.background.night,
    boxShadow: `0 0 50px rgba(255, 215, 0, 0.5), inset 0 0 20px rgba(0, 255, 255, 0.15)`,
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
    animation: 'bounce 0.6s ease-in-out infinite',
  };

  const titleStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h1,
    color: COLORS.gamification.gold,
    margin: 0,
  };

  const levelNameStyles: React.CSSProperties = {
    ...TYPOGRAPHY.body.lg,
    color: COLORS.neon.cyan,
    margin: 0,
  };

  const rewardContainerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '16px',
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    border: `2px solid ${COLORS.gamification.gold}`,
  };

  const rewardStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h2,
    color: COLORS.gamification.gold,
    margin: 0,
    fontSize: '28px',
  };

  const rewardLabelStyles: React.CSSProperties = {
    ...TYPOGRAPHY.label.md,
    color: COLORS.text.secondary,
  };

  const buttonContainerStyles: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    flexDirection: 'column',
  };

  const primaryButtonStyles: React.CSSProperties = {
    padding: '12px 24px',
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    border: 'none',
    backgroundColor: COLORS.neon.cyan,
    color: COLORS.background.abyss,
    fontWeight: 700,
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const secondaryButtonStyles: React.CSSProperties = {
    padding: '12px 24px',
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    border: `2px solid ${COLORS.neon.cyan}`,
    backgroundColor: 'transparent',
    color: COLORS.neon.cyan,
    fontWeight: 600,
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
          50% { transform: translateY(-30px); }
        }
      `}</style>

      <div style={cardStyles}>
        <div style={emojiStyles}>🏆</div>

        <h1 style={titleStyles}>¡NIVEL COMPLETADO!</h1>

        <p style={levelNameStyles}>{levelTitle}</p>

        <div style={rewardContainerStyles}>
          <span style={{ fontSize: '24px' }}>💰</span>
          <div style={rewardStyles}>+{tokaCoinsEarned}</div>
          <div style={rewardLabelStyles}>Ⓜ️</div>
        </div>

        <div style={buttonContainerStyles}>
          <button onClick={onNext} style={primaryButtonStyles}>
            ➤ Siguiente nivel
          </button>
          <button onClick={onRetry} style={secondaryButtonStyles}>
            🔄 Reintentar
          </button>
        </div>
      </div>
    </div>
  );
};
