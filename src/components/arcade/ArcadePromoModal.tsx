/**
 * ARCADE - Promo Modal
 * Modal de oferta temporal con animación
 */

import React, { useEffect, useState } from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';

interface ArcadePromoModalProps {
  onBuyPromo: () => void;
  onClose: () => void;
  isLoading?: boolean;
  timeLimit?: number; // segundos
}

export const ArcadePromoModal: React.FC<ArcadePromoModalProps> = ({
  onBuyPromo,
  onClose,
  isLoading = false,
  timeLimit = 5,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [isBuying, setIsBuying] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onClose]);

  const handleBuy = async () => {
    setIsBuying(true);
    await onBuyPromo();
    setIsBuying(false);
  };

  const modalStyles: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) scale(0.95)',
    animation: 'slideInPromo 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    backgroundColor: COLORS.background.night,
    border: `2px solid ${COLORS.neon.teal}`,
    borderRadius: DESIGN_CONSTANTS.borderRadius.lg,
    padding: DESIGN_CONSTANTS.spacing.xl,
    zIndex: 1002,
    maxWidth: '340px',
    width: '90%',
    boxShadow: `0 0 60px ${COLORS.neon.teal}80, inset 0 0 30px rgba(0, 255, 150, 0.15)`,
  };

  const badgeStyles: React.CSSProperties = {
    ...TYPOGRAPHY.label.sm,
    backgroundColor: COLORS.neon.teal,
    color: COLORS.background.abyss,
    padding: '6px 12px',
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'inline-block',
    marginBottom: DESIGN_CONSTANTS.spacing.md,
  };

  const titleStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h2,
    color: COLORS.neon.teal,
    textAlign: 'center',
    margin: '0 0 12px 0',
    textShadow: `0 0 16px ${COLORS.neon.teal}40`,
  };

  const counterStyles: React.CSSProperties = {
    position: 'absolute',
    top: DESIGN_CONSTANTS.spacing.md,
    right: DESIGN_CONSTANTS.spacing.md,
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 255, 150, 0.15)',
    border: `2px solid ${COLORS.neon.teal}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: 700,
    color: COLORS.neon.teal,
  };

  const progressBarStyles: React.CSSProperties = {
    height: '4px',
    backgroundColor: 'rgba(0, 255, 150, 0.2)',
    borderRadius: DESIGN_CONSTANTS.borderRadius.full,
    overflow: 'hidden',
    marginBottom: DESIGN_CONSTANTS.spacing.lg,
  };

  const progressFillStyles: React.CSSProperties = {
    height: '100%',
    backgroundColor: COLORS.neon.teal,
    width: `${(timeRemaining / timeLimit) * 100}%`,
    transition: 'width 1s linear',
    boxShadow: `0 0 10px ${COLORS.neon.teal}`,
  };

  const offerBoxStyles: React.CSSProperties = {
    backgroundColor: 'rgba(0, 255, 150, 0.1)',
    border: `1px solid ${COLORS.neon.teal}40`,
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    padding: DESIGN_CONSTANTS.spacing.md,
    marginBottom: DESIGN_CONSTANTS.spacing.lg,
    textAlign: 'center',
  };

  const offerTextStyles: React.CSSProperties = {
    ...TYPOGRAPHY.body.md,
    color: COLORS.text.secondary,
    margin: '0 0 8px 0',
  };

  const priceContainerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: DESIGN_CONSTANTS.spacing.md,
  };

  const originalPriceStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h4,
    color: COLORS.text.secondary,
    margin: 0,
    textDecoration: 'line-through',
    opacity: 0.6,
  };

  const discountPriceStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h2,
    color: COLORS.neon.teal,
    margin: 0,
  };

  const savingsBadgeStyles: React.CSSProperties = {
    ...TYPOGRAPHY.label.sm,
    fontSize: '12px',
    backgroundColor: COLORS.gamification.alertOrange,
    color: COLORS.background.abyss,
    padding: '4px 8px',
    borderRadius: DESIGN_CONSTANTS.borderRadius.sm,
    fontWeight: 700,
  };

  const buyButtonStyles: React.CSSProperties = {
    width: '100%',
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

  const keyframesStyle = `
    @keyframes slideInPromo {
      from {
        opacity: 0;
        transform: translate(-50%, -60%) scale(0.8);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
    }
  `;

  return (
    <>
      <style>{keyframesStyle}</style>
      <div style={modalStyles}>
        <div style={counterStyles}>{timeRemaining}s</div>

        <div style={{ textAlign: 'center', marginBottom: DESIGN_CONSTANTS.spacing.md }}>
          <span style={badgeStyles}>⏱️ OFERTA LIMITADA</span>
        </div>

        <h2 style={titleStyles}>¡CARGANDO OFERTA ESPECIAL!</h2>

        <div style={progressBarStyles}>
          <div style={progressFillStyles} />
        </div>

        <div style={offerBoxStyles}>
          <p style={offerTextStyles}>20 MOVIMIENTOS EXTRA</p>
          <div style={priceContainerStyles}>
            <span style={originalPriceStyles}>750 Ⓜ️</span>
            <span style={savingsBadgeStyles}>-40%</span>
            <span style={discountPriceStyles}>450 Ⓜ️</span>
          </div>
        </div>

        <button
          style={buyButtonStyles}
          onClick={handleBuy}
          disabled={isLoading || isBuying}
        >
          {isBuying ? '⏳ Procesando...' : '🚀 APROVECHA AHORA'}
        </button>
      </div>
    </>
  );
};
