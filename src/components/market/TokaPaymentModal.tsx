/**
 * COMPONENTE: TokaPaymentModal
 * Modal para confirmar y procesar pago de TokaCoins
 */

import React, { useState } from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import type { TokaPackage } from '@/models/market/tokaPay-types';
import type { AlipaySession } from '@/services/alipayAuth';
import {
  initiatePurchase,
  executePurchasePayment,
  updateTransactionStatus,
} from '@/services/tokaPaymentService';

interface TokaPaymentModalProps {
  package: TokaPackage;
  session: AlipaySession;
  onSuccess: (coinsReceived: number) => void;
  onError: (message: string) => void;
  onCancel: () => void;
}

export const TokaPaymentModal: React.FC<TokaPaymentModalProps> = ({
  package: pkg,
  session,
  onSuccess,
  onError,
  onCancel,
}) => {
  const [step, setStep] = useState<'confirm' | 'processing' | 'result'>('confirm');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirmPurchase = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Crear orden en Toka API
      const result = await initiatePurchase(session, pkg);

      if (!result) {
        throw new Error('No se pudo crear la orden de pago');
      }

      // Executeprotocolo de pago
      setStep('processing');
      const paymentSuccess = await executePurchasePayment(result.paymentUrl);

      if (paymentSuccess) {
        // Verificar status del pago
        const updated = await updateTransactionStatus(result.transaction, session.accessToken);

        if (updated?.status === 'completed') {
          setStep('result');
          onSuccess(pkg.coins + (pkg.bonus || 0));
        } else {
          throw new Error('Pago no confirmado');
        }
      } else {
        throw new Error('El usuario canceló el pago');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      setErrorMessage(message);
      onError(message);
      setStep('confirm');
    } finally {
      setIsLoading(false);
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
    border: `2px solid ${COLORS.gamification.alertOrange}`,
    borderRadius: DESIGN_CONSTANTS.borderRadius.lg,
    padding: DESIGN_CONSTANTS.spacing.lg,
    maxWidth: '420px',
    width: '90%',
    boxShadow: `0 0 30px rgba(255, 154, 60, 0.4), inset 0 0 20px rgba(255, 154, 60, 0.1)`,
    display: 'flex',
    flexDirection: 'column',
    gap: DESIGN_CONSTANTS.spacing.md,
    animation: 'slideInDown 300ms ease-out',
  };

  const headerStyles: React.CSSProperties = {
    textAlign: 'center',
    borderBottom: `1px solid ${COLORS.gamification.alertOrange}`,
    paddingBottom: DESIGN_CONSTANTS.spacing.md,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: DESIGN_CONSTANTS.spacing.sm,
  };

  const titleStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h3,
    color: COLORS.gamification.alertOrange,
    margin: 0,
    textShadow: `0 0 12px ${COLORS.gamification.alertOrange}`,
  };

  const iconStyles: React.CSSProperties = {
    fontSize: '56px',
    lineHeight: 1,
  };

  const contentStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: DESIGN_CONSTANTS.spacing.md,
    alignItems: 'center',
  };

  const packageInfoStyles: React.CSSProperties = {
    backgroundColor: `rgba(255, 154, 60, 0.1)`,
    border: `1px solid ${COLORS.gamification.alertOrange}`,
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    padding: DESIGN_CONSTANTS.spacing.md,
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: DESIGN_CONSTANTS.spacing.sm,
  };

  const infoRowStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...TYPOGRAPHY.body.md,
    color: COLORS.text.primary,
  };

  const infoLabelStyles: React.CSSProperties = {
    color: COLORS.text.secondary,
    fontSize: '12px',
    textTransform: 'uppercase',
  };

  const infoValueStyles: React.CSSProperties = {
    color: COLORS.gamification.alertOrange,
    fontWeight: 700,
    fontSize: '18px',
  };

  const priceStyles: React.CSSProperties = {
    ...TYPOGRAPHY.mono.lg,
    color: COLORS.gamification.gold,
    textShadow: `0 0 8px ${COLORS.gamification.gold}`,
    fontWeight: 700,
  };

  const buttonsRowStyles: React.CSSProperties = {
    display: 'flex',
    gap: DESIGN_CONSTANTS.spacing.md,
    width: '100%',
  };

  const buttonStyles = (primary: boolean): React.CSSProperties => ({
    flex: 1,
    padding: `${DESIGN_CONSTANTS.spacing.sm} ${DESIGN_CONSTANTS.spacing.md}`,
    border: `2px solid ${primary ? COLORS.gamification.alertOrange : COLORS.text.secondary}`,
    backgroundColor: primary ? COLORS.gamification.alertOrange : 'transparent',
    color: primary ? COLORS.background.abyss : COLORS.text.primary,
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    cursor: isLoading ? 'not-allowed' : 'pointer',
    ...TYPOGRAPHY.label.md,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    opacity: isLoading && !primary ? 0.5 : 1,
    transition: 'all 0.3s ease',
    textShadow: primary ? 'none' : `0 0 6px ${COLORS.gamification.alertOrange}`,
  });

  const loadingStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: DESIGN_CONSTANTS.spacing.sm,
    ...TYPOGRAPHY.body.md,
    color: COLORS.gamification.alertOrange,
  };

  const spinnerStyles: React.CSSProperties = {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: `2px solid ${COLORS.gamification.alertOrange}`,
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  const errorStyles: React.CSSProperties = {
    backgroundColor: `rgba(240, 84, 84, 0.1)`,
    border: `1px solid ${COLORS.cube.red}`,
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    padding: DESIGN_CONSTANTS.spacing.md,
    color: COLORS.cube.red,
    ...TYPOGRAPHY.body.sm,
    textAlign: 'center',
  };

  const successMessageStyles: React.CSSProperties = {
    backgroundColor: `rgba(67, 209, 142, 0.1)`,
    border: `1px solid ${COLORS.cube.green}`,
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    padding: DESIGN_CONSTANTS.spacing.md,
    color: COLORS.cube.green,
    ...TYPOGRAPHY.body.sm,
    textAlign: 'center',
    fontWeight: 700,
  };

  return (
    <div style={modalOverlayStyles} onClick={onCancel}>
      <div
        style={modalContentStyles}
        onClick={(e) => e.stopPropagation()}
      >
        {step === 'confirm' && (
          <>
            <div style={headerStyles}>
              <div style={iconStyles}>💎</div>
              <h3 style={titleStyles}>Compra de TokaCoins</h3>
            </div>

            <div style={contentStyles}>
              <div style={packageInfoStyles}>
                <div style={infoRowStyles}>
                  <span style={infoLabelStyles}>Paquete</span>
                  <span style={infoValueStyles}>{pkg.name}</span>
                </div>
                <div style={infoRowStyles}>
                  <span style={infoLabelStyles}>Monedas</span>
                  <span style={infoValueStyles}>
                    {pkg.coins}
                    {pkg.bonus && <span style={{ fontSize: '12px' }}>+{pkg.bonus}</span>}
                  </span>
                </div>
                <div
                  style={{
                    borderTop: `1px solid ${COLORS.gamification.alertOrange}`,
                    paddingTop: DESIGN_CONSTANTS.spacing.sm,
                    marginTop: DESIGN_CONSTANTS.spacing.sm,
                  }}
                >
                  <div style={infoRowStyles}>
                    <span style={infoLabelStyles}>Precio</span>
                    <span style={priceStyles}>${pkg.price.value} {pkg.price.currency}</span>
                  </div>
                </div>
              </div>

              {errorMessage && <div style={errorStyles}>{errorMessage}</div>}
            </div>

            <div style={buttonsRowStyles}>
              <button
                style={buttonStyles(false)}
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                style={buttonStyles(true)}
                onClick={handleConfirmPurchase}
                disabled={isLoading}
              >
                {isLoading ? 'Procesando...' : 'Comprar'}
              </button>
            </div>
          </>
        )}

        {step === 'processing' && (
          <div style={contentStyles}>
            <div style={iconStyles}>🔄</div>
            <div style={loadingStyles}>
              <div style={spinnerStyles} />
              Procesando pago...
            </div>
          </div>
        )}

        {step === 'result' && (
          <>
            <div style={headerStyles}>
              <div style={{ fontSize: '56px' }}>✅</div>
              <h3 style={titleStyles}>¡Compra Exitosa!</h3>
            </div>

            <div style={contentStyles}>
              <div style={successMessageStyles}>
                Has recibido {pkg.coins + (pkg.bonus || 0)} TokaCoins
              </div>
            </div>

            <button
              style={{
                ...buttonStyles(true),
                width: '100%',
              }}
              onClick={onCancel}
            >
              Continuar
            </button>
          </>
        )}
      </div>
    </div>
  );
};
