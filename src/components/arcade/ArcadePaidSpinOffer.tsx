/**
 * ARCADE - Time-Limited Spin Offer
 * Modal con contador de tiempo para aceptar/rechazar 10 movimientos por tokacoins
 */

import React, { useState, useEffect } from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';

interface ArcadeTimedSpinOfferProps {
  onAccept: () => void;
  onReject: () => void;
  isLoading?: boolean;
}

export const ArcadeTimedSpinOffer: React.FC<ArcadeTimedSpinOfferProps> = ({
  onAccept,
  onReject,
  isLoading = false,
}) => {
  const [timeLeft, setTimeLeft] = useState(10);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setTimedOut(true);
      const timer = setTimeout(onReject, 1000);
      return () => clearTimeout(timer);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onReject]);

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
    zIndex: DESIGN_CONSTANTS.zIndex.modal,
  };

  const cardStyles: React.CSSProperties = {
    borderRadius: '20px',
    border: `3px solid ${timeLeft <= 3 ? COLORS.gamification.alertOrange : COLORS.neon.cyan}`,
    padding: '32px 24px',
    backgroundColor: COLORS.background.night,
    boxShadow: `0 0 30px rgba(${timeLeft <= 3 ? '255, 100, 0' : '0, 255, 255'}, 0.4)`,
    maxWidth: '350px',
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    textAlign: 'center',
    animation: timeLeft <= 3 ? 'pulse-border 0.5s ease-in-out infinite' : 'none',
  };

  const titleStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h2,
    color: COLORS.neon.cyan,
    margin: 0,
  };

  const prizeStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h1,
    color: COLORS.gamification.gold,
    margin: 0,
    fontSize: '48px',
  };

  const descriptionStyles: React.CSSProperties = {
    ...TYPOGRAPHY.body.md,
    color: COLORS.text.secondary,
    margin: 0,
  };

  const timerContainerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '16px',
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    backgroundColor: timeLeft <= 3 ? 'rgba(255, 100, 0, 0.1)' : 'rgba(0, 255, 255, 0.1)',
    border: `2px solid ${timeLeft <= 3 ? COLORS.gamification.alertOrange : COLORS.neon.cyan}`,
  };

  const timerStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h1,
    color: timeLeft <= 3 ? COLORS.gamification.alertOrange : COLORS.neon.cyan,
    margin: 0,
    fontSize: '32px',
    minWidth: '50px',
  };

  const timerLabelStyles: React.CSSProperties = {
    ...TYPOGRAPHY.body.lg,
    color: COLORS.text.secondary,
    margin: 0,
  };

  const costStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h3,
    color: COLORS.gamification.gold,
    margin: 0,
  };

  const buttonContainerStyles: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    flexDirection: 'column',
  };

  const acceptButtonStyles: React.CSSProperties = {
    padding: '12px 24px',
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    border: 'none',
    backgroundColor: COLORS.neon.cyan,
    color: COLORS.background.abyss,
    fontWeight: 700,
    fontSize: '16px',
    cursor: timedOut || isLoading ? 'not-allowed' : 'pointer',
    opacity: timedOut || isLoading ? 0.6 : 1,
    transition: 'all 0.2s ease',
  };

  const rejectButtonStyles: React.CSSProperties = {
    padding: '12px 24px',
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    border: `1px solid ${COLORS.text.secondary}`,
    backgroundColor: 'transparent',
    color: COLORS.text.secondary,
    fontWeight: 600,
    fontSize: '16px',
    cursor: timedOut || isLoading ? 'not-allowed' : 'pointer',
    opacity: timedOut || isLoading ? 0.6 : 1,
    transition: 'all 0.2s ease',
  };

  return (
    <div style={containerStyles}>
      <style>{`
        @keyframes pulse-border {
          0%, 100% { 
            box-shadow: 0 0 30px rgba(255, 100, 0, 0.4);
          }
          50% { 
            box-shadow: 0 0 50px rgba(255, 100, 0, 0.8);
          }
        }
      `}</style>

      <div style={cardStyles}>
        <h2 style={titleStyles}>¡GANASTE!</h2>

        <div style={prizeStyles}>🎁</div>

        <p style={descriptionStyles}>
          +10 movimientos adicionales
        </p>

        <div style={costStyles}>100 Ⓜ️</div>

        <div style={timerContainerStyles}>
          <div style={timerStyles}>{timeLeft}</div>
          <div style={timerLabelStyles}>segundos</div>
        </div>

        {timedOut && (
          <div style={{ ...TYPOGRAPHY.body.md, color: COLORS.gamification.alertOrange, margin: 0 }}>
            ⏰ ¡Se acabó el tiempo!
          </div>
        )}

        <div style={buttonContainerStyles}>
          <button
            onClick={onAccept}
            style={acceptButtonStyles}
            disabled={timedOut || isLoading}
          >
            {isLoading ? '⏳ Procesando...' : '✅ ACEPTAR'}
          </button>
          <button
            onClick={onReject}
            style={rejectButtonStyles}
            disabled={timedOut || isLoading}
          >
            ✕ Rechazar
          </button>
        </div>
      </div>
    </div>
  );
};
