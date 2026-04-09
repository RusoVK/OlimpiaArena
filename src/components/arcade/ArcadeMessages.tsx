/**
 * ARCADE - Messages Component
 * Toast de notificaciones
 */

import React from 'react';
import { COLORS, DESIGN_CONSTANTS } from '@/theme';
import './ArcadeMessages.css';

interface ArcadeMessagesProps {
  successMessage?: string | null;
  errorMessage?: string | null;
}

export const ArcadeMessages: React.FC<ArcadeMessagesProps> = ({ successMessage, errorMessage }) => {
  const messageStyles = (type: 'success' | 'error'): React.CSSProperties => ({
    position: 'fixed',
    top: DESIGN_CONSTANTS.spacing.lg,
    right: DESIGN_CONSTANTS.spacing.lg,
    backgroundColor: type === 'success' ? COLORS.neon.cyan : COLORS.gamification.alertOrange,
    color: type === 'success' ? COLORS.background.abyss : COLORS.text.primary,
    padding: `${DESIGN_CONSTANTS.spacing.md} ${DESIGN_CONSTANTS.spacing.lg}`,
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    zIndex: 1000,
    animation: 'slideInDown 300ms ease-out',
    boxShadow: `0 4px 12px rgba(0, 0, 0, 0.3)`,
  });

  return (
    <>
      {successMessage && (
        <div style={messageStyles('success')} className="arcade-message">
          ✅ {successMessage}
        </div>
      )}
      {errorMessage && (
        <div style={messageStyles('error')} className="arcade-message">
          ⚠️ {errorMessage}
        </div>
      )}
    </>
  );
};
