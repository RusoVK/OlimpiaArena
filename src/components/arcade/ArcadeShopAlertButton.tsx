/**
 * ARCADE - Shop Alert Button
 * Botón flotante vibrando para acceder a las compras
 */

import React from 'react';
import { COLORS } from '@/theme';

interface ArcadeShopAlertButtonProps {
  onClick: () => void;
  itemsCount: number;
}

export const ArcadeShopAlertButton: React.FC<ArcadeShopAlertButtonProps> = ({
  onClick,
  itemsCount,
}) => {
  const containerStyles: React.CSSProperties = {
    position: 'fixed',
    bottom: '100px',
    right: '16px',
    zIndex: 200,
  };

  const buttonStyles: React.CSSProperties = {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: COLORS.neon.cyan,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    boxShadow: `0 0 20px ${COLORS.neon.cyan}80`,
    animation: 'pulse-vibrate 1.5s ease-in-out infinite',
    fontWeight: 700,
  };

  const badgeStyles: React.CSSProperties = {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: COLORS.gamification.alertOrange,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 700,
    boxShadow: `0 0 12px ${COLORS.gamification.alertOrange}`,
  };

  const keyframesStyle = `
    @keyframes pulse-vibrate {
      0%, 100% {
        transform: scale(1) rotate(0deg);
      }
      25% {
        transform: scale(1.05) rotate(-2deg);
      }
      50% {
        transform: scale(1.1) rotate(0deg);
      }
      75% {
        transform: scale(1.05) rotate(2deg);
      }
    }
  `;

  return (
    <>
      <style>{keyframesStyle}</style>
      <div style={containerStyles}>
        <button style={buttonStyles} onClick={onClick} title="Ver ayudas">
          ⚡
          {itemsCount > 0 && <div style={badgeStyles}>{itemsCount}</div>}
        </button>
      </div>
    </>
  );
};
