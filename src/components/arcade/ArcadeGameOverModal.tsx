/**
 * ARCADE - Game Over Modal
 * Modal cuando se acaban los movimientos
 */

import React, { useState } from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';

interface ArcadeGameOverModalProps {
  levelTitle: string;
  movesUsed: number;
  onBuyMoves: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  tokaCoinsPrice?: number;
}

export const ArcadeGameOverModal: React.FC<ArcadeGameOverModalProps> = ({
  levelTitle,
  movesUsed,
  onBuyMoves,
  onCancel,
  isLoading = false,
  tokaCoinsPrice = 500,
}) => {
  const [isBuying, setIsBuying] = useState(false);

  const handleBuy = async () => {
    setIsBuying(true);
    await onBuyMoves();
    setIsBuying(false);
  };

  const modalStyles: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: COLORS.background.night,
    border: DESIGN_CONSTANTS.neoBorders.cyanThin,
    borderRadius: DESIGN_CONSTANTS.borderRadius.lg,
    padding: DESIGN_CONSTANTS.spacing.xl,
    zIndex: DESIGN_CONSTANTS.zIndex.modal,
    maxWidth: '360px',
    width: '90%',
    boxShadow: `0 0 40px ${COLORS.neon.cyan}80, inset 0 0 20px rgba(0, 255, 255, 0.1)`,
  };

  const titleStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h2,
    color: COLORS.gamification.alertOrange,
    textAlign: 'center',
    margin: '0 0 12px 0',
  };

  const messageStyles: React.CSSProperties = {
    ...TYPOGRAPHY.body.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
    margin: '0 0 24px 0',
  };

  const statsBoxStyles: React.CSSProperties = {
    backgroundColor: 'rgba(0, 255, 255, 0.08)',
    border: `1px solid ${COLORS.neon.cyan}40`,
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    padding: DESIGN_CONSTANTS.spacing.md,
    marginBottom: DESIGN_CONSTANTS.spacing.lg,
    textAlign: 'center',
  };

  const offerBoxStyles: React.CSSProperties = {
    backgroundColor: 'rgba(0, 255, 150, 0.1)',
    border: `2px solid ${COLORS.neon.teal}`,
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    padding: DESIGN_CONSTANTS.spacing.md,
    marginBottom: DESIGN_CONSTANTS.spacing.lg,
  };

  const offerTitleStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h4,
    color: COLORS.neon.teal,
    margin: '0 0 8px 0',
  };

  const offerDescStyles: React.CSSProperties = {
    ...TYPOGRAPHY.body.md,
    color: COLORS.text.secondary,
    margin: '0 0 8px 0',
  };

  const priceStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h3,
    color: COLORS.gamification.gold,
    margin: 0,
  };

  const buttonContainerStyles: React.CSSProperties = {
    display: 'flex',
    gap: DESIGN_CONSTANTS.spacing.md,
    flexDirection: 'column',
  };

  const buyButtonStyles: React.CSSProperties = {
    padding: '14px 20px',
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    border: 'none',
    backgroundColor: COLORS.neon.teal,
    color: COLORS.background.abyss,
    fontWeight: 700,
    fontSize: '16px',
    cursor: 'pointer',
    boxShadow: `0 0 20px ${COLORS.neon.teal}60`,
    transition: DESIGN_CONSTANTS.transitions.smooth,
    opacity: isLoading || isBuying ? 0.6 : 1,
    pointerEvents: isLoading || isBuying ? 'none' : 'auto',
  };

  const cancelButtonStyles: React.CSSProperties = {
    padding: '12px 20px',
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    border: `1px solid ${COLORS.text.secondary}`,
    backgroundColor: 'transparent',
    color: COLORS.text.secondary,
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    transition: DESIGN_CONSTANTS.transitions.smooth,
  };

  return (
    <div style={modalStyles}>
      <h2 style={titleStyles}>⚡ GAME OVER</h2>
      <p style={messageStyles}>Se te acabaron los movimientos en "{levelTitle}"</p>

      <div style={statsBoxStyles}>
        <div style={{ ...TYPOGRAPHY.label.sm, color: COLORS.text.secondary }}>
          Movimientos usados
        </div>
        <div style={{ ...TYPOGRAPHY.heading.h2, color: COLORS.neon.cyan, margin: '8px 0 0 0' }}>
          {movesUsed}
        </div>
      </div>

      <div style={offerBoxStyles}>
        <h4 style={offerTitleStyles}>🎁 COMPRA 10 MOVIMIENTOS MÁS</h4>
        <p style={offerDescStyles}>Continúa jugando y sigue intentando resolver el nivel</p>
        <div style={priceStyles}>{tokaCoinsPrice.toLocaleString()} Ⓜ️</div>
      </div>

      <div style={buttonContainerStyles}>
        <button
          style={buyButtonStyles}
          onClick={handleBuy}
          disabled={isLoading || isBuying}
        >
          {isBuying ? 'Comprando...' : 'Comprar ahora'}
        </button>
        <button
          style={cancelButtonStyles}
          onClick={onCancel}
          disabled={isLoading}
        >
          Salir sin comprar
        </button>
      </div>
    </div>
  );
};
