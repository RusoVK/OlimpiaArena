/**
 * ARCADE - Play Header Component
 * Header cuando estás jugando un nivel
 */

import React, { useState, useEffect } from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import './ArcadePlayHeader.css';

interface ArcadePlayHeaderProps {
  levelTitle: string;
  onExit: () => void;
  onRestart: () => void;
  isExitBlocked?: boolean;
}

export const ArcadePlayHeader: React.FC<ArcadePlayHeaderProps> = ({
  levelTitle,
  onExit,
  onRestart,
  isExitBlocked = false,
}) => {
  const [exitBlockTime, setExitBlockTime] = useState(0);

  useEffect(() => {
    if (!isExitBlocked) {
      setExitBlockTime(0);
      return;
    }

    setExitBlockTime(10);
    const timer = setInterval(() => {
      setExitBlockTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExitBlocked]);

  const titleStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h1,
    color: COLORS.neon.cyan,
    textShadow: `0 0 16px ${COLORS.neon.cyan}`,
    margin: 0,
  };

  const subtitleStyles: React.CSSProperties = {
    ...TYPOGRAPHY.body.md,
    color: COLORS.text.secondary,
    margin: 0,
  };

  const buttonStyles = (disabled: boolean): React.CSSProperties => ({
    padding: '10px 16px',
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    border: DESIGN_CONSTANTS.neoBorders.cyanThin,
    backgroundColor: 'transparent',
    color: disabled ? COLORS.text.secondary : COLORS.neon.cyan,
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    position: 'relative',
    transition: DESIGN_CONSTANTS.transitions.smooth,
  });

  const blockIndicatorStyles: React.CSSProperties = {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: COLORS.gamification.alertOrange,
    color: COLORS.background.abyss,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 700,
  };

  return (
    <header className="arcade-play-header">
      <div className="arcade-play-header__title-section">
        <h1 style={titleStyles}>ARCADE</h1>
        <p style={subtitleStyles}>{levelTitle}</p>
      </div>
      <div className="arcade-play-header__actions">
        <button
          style={buttonStyles(isExitBlocked)}
          onClick={onExit}
          disabled={isExitBlocked}
          title={isExitBlocked ? `Botón bloqueado por ${exitBlockTime}s` : undefined}
        >
          Volver al mapa
          {isExitBlocked && exitBlockTime > 0 && (
            <div style={blockIndicatorStyles}>
              {exitBlockTime}
            </div>
          )}
        </button>
        <button style={buttonStyles(false)} onClick={onRestart}>
          Reiniciar nivel
        </button>
      </div>
    </header>
  );
};
