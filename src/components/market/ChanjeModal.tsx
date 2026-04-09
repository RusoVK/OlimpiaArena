/**
 * COMPONENTE: Modal de Confirmación de Canje
 * Confirmación antes de gastar TokaCoins
 */

import React, { useState } from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import type { MarketItem } from '@/models/market/types';
import { chanjeItem } from '@/services/marketAPI';

interface ChanjeModalProps {
  item: MarketItem;
  userBalance: number;
  userId: string;
  onCancel: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const ChanjeModal: React.FC<ChanjeModalProps> = ({
  item,
  userBalance,
  userId,
  onCancel,
  onSuccess,
  onError,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const hasEnoughCoins = userBalance >= item.price;

  const handleChanjeConfirm = async () => {
    if (!hasEnoughCoins) {
      onError(`No tienes suficientes TokaCoins. Te faltan ${item.price - userBalance} coins.`);
      return;
    }

    setIsProcessing(true);
    try {
      const response = await chanjeItem(userId, item.id);
      if (response.success) {
        onSuccess(response.message);
        onCancel(); // Cerrar modal
      } else {
        onError(response.message || 'Error en el canje');
      }
    } catch (error) {
      onError('Error inesperado al procesar el canje');
    } finally {
      setIsProcessing(false);
    }
  };

  const modalOverlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: DESIGN_CONSTANTS.zIndex.modal,
    backdropFilter: 'blur(5px)',
  };

  const modalContentStyles: React.CSSProperties = {
    backgroundColor: COLORS.background.night,
    border: DESIGN_CONSTANTS.neoBorders.cyanMedium,
    borderRadius: DESIGN_CONSTANTS.borderRadius.lg,
    padding: DESIGN_CONSTANTS.spacing.lg,
    maxWidth: '400px',
    width: '90%',
    boxShadow: DESIGN_CONSTANTS.shadows.glowCyanLarge,
    display: 'flex',
    flexDirection: 'column',
    gap: DESIGN_CONSTANTS.spacing.md,
    animation: 'slideInDown 300ms ease-out',
  };

  const headerStyles: React.CSSProperties = {
    textAlign: 'center',
    borderBottom: DESIGN_CONSTANTS.neoBorders.cyanThin,
    paddingBottom: DESIGN_CONSTANTS.spacing.md,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: DESIGN_CONSTANTS.spacing.sm,
  };

  const titleStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h3,
    color: COLORS.neon.cyan,
    margin: 0,
    textShadow: `0 0 8px ${COLORS.neon.cyan}`,
  };

  const iconStyles: React.CSSProperties = {
    fontSize: '56px',
    lineHeight: 1,
  };

  const detailsStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: DESIGN_CONSTANTS.spacing.md,
  };

  const detailRowStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: DESIGN_CONSTANTS.spacing.md,
    backgroundColor: COLORS.background.abyss,
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    border: DESIGN_CONSTANTS.neoBorders.cyanThin,
  };

  const detailLabelStyles: React.CSSProperties = {
    ...TYPOGRAPHY.body.sm,
    color: COLORS.text.secondary,
  };

  const priceStyles: React.CSSProperties = {
    ...TYPOGRAPHY.mono.lg,
    color: COLORS.gamification.gold,
    textShadow: `0 0 8px ${COLORS.gamification.gold}`,
  };

  const balanceStyles = (isEnough: boolean): React.CSSProperties => ({
    ...TYPOGRAPHY.mono.md,
    color: isEnough ? COLORS.neon.cyan : COLORS.gamification.alertOrange,
  });

  const actionsStyles: React.CSSProperties = {
    display: 'flex',
    gap: DESIGN_CONSTANTS.spacing.md,
    marginTop: DESIGN_CONSTANTS.spacing.md,
    borderTop: DESIGN_CONSTANTS.neoBorders.cyanThin,
    paddingTop: DESIGN_CONSTANTS.spacing.md,
  };

  const buttonStyles = (isDisabled: boolean): React.CSSProperties => ({
    flex: 1,
    padding: `${DESIGN_CONSTANTS.spacing.md} ${DESIGN_CONSTANTS.spacing.lg}`,
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    border: 'none',
    fontSize: '14px',
    fontWeight: 600,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    transition: DESIGN_CONSTANTS.transitions.smooth,
    opacity: isDisabled ? 0.5 : 1,
  });

  const confirmButtonStyles: React.CSSProperties = {
    ...buttonStyles(!hasEnoughCoins || isProcessing),
    backgroundColor: COLORS.neon.cyan,
    color: COLORS.background.abyss,
    boxShadow: hasEnoughCoins ? DESIGN_CONSTANTS.shadows.glowCyanMedium : 'none',
  };

  const cancelButtonStyles: React.CSSProperties = {
    ...buttonStyles(isProcessing),
    backgroundColor: 'transparent',
    color: COLORS.neon.cyan,
    border: DESIGN_CONSTANTS.neoBorders.cyanMedium,
  };

  return (
    <div style={modalOverlayStyles} onClick={onCancel}>
      <div
        style={modalContentStyles}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={headerStyles}>
          <div style={iconStyles}>{item.icon}</div>
          <h3 style={titleStyles}>Confirmar Canje</h3>
        </div>

        <div style={detailsStyles}>
          <div style={detailRowStyles}>
            <span style={detailLabelStyles}>Producto:</span>
            <span style={TYPOGRAPHY.body.md}>{item.name}</span>
          </div>

          <div style={detailRowStyles}>
            <span style={detailLabelStyles}>Precio:</span>
            <div>
              <span style={priceStyles}>{item.price.toLocaleString()}</span>
              <span style={{ marginLeft: '8px', color: COLORS.text.secondary }}>Ⓜ️</span>
            </div>
          </div>

          <div style={detailRowStyles}>
            <span style={detailLabelStyles}>Tu Balance:</span>
            <span style={balanceStyles(hasEnoughCoins)}>
              {userBalance.toLocaleString()} Ⓜ️
            </span>
          </div>

          {!hasEnoughCoins && (
            <div style={{
              ...TYPOGRAPHY.body.sm,
              color: COLORS.gamification.alertOrange,
              padding: DESIGN_CONSTANTS.spacing.md,
              backgroundColor: 'rgba(255, 140, 0, 0.1)',
              borderRadius: DESIGN_CONSTANTS.borderRadius.md,
              border: `1px solid ${COLORS.gamification.alertOrange}`,
            }}>
              ⚠️ No tienes suficientes TokaCoins. Te faltan {item.price - userBalance} coins.
            </div>
          )}
        </div>

        <div style={actionsStyles}>
          <button
            style={cancelButtonStyles as any}
            onClick={onCancel}
            disabled={isProcessing}
          >
            {isProcessing ? '⏳ Procesando...' : 'Cancelar'}
          </button>
          <button
            style={confirmButtonStyles as any}
            onClick={handleChanjeConfirm}
            disabled={isProcessing || !hasEnoughCoins}
          >
            {isProcessing ? '⏳ Canjeando...' : hasEnoughCoins ? '🔓 Canjear Ahora' : '🔒 Sin Coins'}
          </button>
        </div>
      </div>
    </div>
  );
};
