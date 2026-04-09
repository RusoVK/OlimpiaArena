/**
 * ARCADE - Spin Wheel
 * Ruleta con premios que aparece al cerrar el shop
 */

import React, { useState } from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import './ArcadeSpinWheel.css';

interface Prize {
  id: string;
  label: string;
  emoji: string;
  isSpinAgain: boolean;
}

interface ArcadeSpinWheelProps {
  onPrizeWon: (prize: Prize, isSecondSpin: boolean) => void;
  isSecondSpin?: boolean;
  onClose: () => void;
}

const PRIZES: Prize[] = [
  { id: 'moves_5', label: '+5 movimientos', emoji: '🎯', isSpinAgain: false },
  { id: 'spin_again', label: 'Otra oportunidad', emoji: '🎡', isSpinAgain: true },
  { id: 'moves_3', label: '+3 movimientos', emoji: '✨', isSpinAgain: false },
  { id: 'hint', label: 'Pista gratis', emoji: '💡', isSpinAgain: false },
  { id: 'moves_2', label: '+2 movimientos', emoji: '⭐', isSpinAgain: false },
  { id: 'multiplier', label: 'Doble XP', emoji: '🚀', isSpinAgain: false },
  { id: 'moves_4', label: '+4 movimientos', emoji: '🎪', isSpinAgain: false },
  { id: 'bonus', label: 'Premio sorpresa', emoji: '🎁', isSpinAgain: false },
];

export const ArcadeSpinWheel: React.FC<ArcadeSpinWheelProps> = ({ 
  onPrizeWon, 
  isSecondSpin = false,
  onClose 
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPrizeIndex, setSelectedPrizeIndex] = useState<number | null>(null);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    const spins = 5 + Math.random() * 3; // 5-8 vueltas
    const randomIndex = Math.floor(Math.random() * PRIZES.length);
    const finalRotation = spins * 360 + (360 / PRIZES.length) * randomIndex;

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setSelectedPrizeIndex(randomIndex);
      // Llamar al callback después de que termine la animación
      setTimeout(() => {
        onPrizeWon(PRIZES[randomIndex], isSecondSpin);
      }, 500);
    }, 4000);
  };

  const containerStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: DESIGN_CONSTANTS.zIndex.modal,
    gap: '20px',
  };

  const wheelContainerStyles: React.CSSProperties = {
    position: 'relative',
    width: '300px',
    height: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const wheelStyles: React.CSSProperties = {
    width: '280px',
    height: '280px',
    borderRadius: '50%',
    border: `3px solid ${COLORS.neon.cyan}`,
    boxShadow: DESIGN_CONSTANTS.shadows.glowCyanSmall,
    position: 'relative',
    background: `conic-gradient(
      ${COLORS.gamification.gold}, 
      ${COLORS.neon.cyan}, 
      ${COLORS.gamification.alertOrange}, 
      ${COLORS.neon.teal}, 
      ${COLORS.gamification.gold}
    )`,
    transform: `rotate(${rotation}deg)`,
    transition: isSpinning ? 'transform 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
  };

  const pointerStyles: React.CSSProperties = {
    position: 'absolute',
    top: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '0',
    height: '0',
    borderLeft: '12px solid transparent',
    borderRight: '12px solid transparent',
    borderTop: `16px solid ${COLORS.neon.cyan}`,
    zIndex: 10,
  };

  const buttonContainerStyles: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const spinButtonStyles: React.CSSProperties = {
    padding: '12px 32px',
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    border: `2px solid ${COLORS.neon.cyan}`,
    backgroundColor: COLORS.neon.cyan,
    color: COLORS.background.abyss,
    fontWeight: 700,
    fontSize: '16px',
    cursor: isSpinning ? 'not-allowed' : 'pointer',
    opacity: isSpinning ? 0.6 : 1,
    boxShadow: DESIGN_CONSTANTS.shadows.glowCyanSmall,
    transition: 'all 0.2s ease',
  };

  const closeButtonStyles: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    border: `1px solid ${COLORS.text.secondary}`,
    backgroundColor: 'transparent',
    color: COLORS.text.secondary,
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const titleStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h2,
    color: COLORS.neon.cyan,
    textAlign: 'center',
    margin: 0,
  };

  const subtitleStyles: React.CSSProperties = {
    ...TYPOGRAPHY.body.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
    margin: 0,
  };

  return (
    <div style={containerStyles}>
      <div>
        <h2 style={titleStyles}>🎡 ¡A GIRAR!</h2>
        {isSecondSpin && (
          <p style={subtitleStyles}>Esta es tu segunda oportunidad - gana un premio</p>
        )}
      </div>

      <div style={wheelContainerStyles}>
        <div style={pointerStyles} />
        <div style={wheelStyles}>
          {PRIZES.map((prize, index) => {
            const angle = (360 / PRIZES.length) * index;
            return (
              <div
                key={prize.id}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  transform: `rotate(${angle}deg)`,
                }}
              >
                <span style={{ fontSize: '24px', marginTop: '12px' }}>{prize.emoji}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={buttonContainerStyles}>
        <button
          onClick={handleSpin}
          style={spinButtonStyles}
          disabled={isSpinning}
        >
          {isSpinning ? 'Girando...' : '🎯 GIRAR'}
        </button>
        {selectedPrizeIndex !== null && (
          <div style={{ ...TYPOGRAPHY.label.md, color: COLORS.neon.cyan, textAlign: 'center' }}>
            ¡Ganaste! {PRIZES[selectedPrizeIndex].emoji} {PRIZES[selectedPrizeIndex].label}
          </div>
        )}
        <button onClick={onClose} style={closeButtonStyles}>
          Cerrar
        </button>
      </div>
    </div>
  );
};
