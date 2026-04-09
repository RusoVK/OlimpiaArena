/**
 * COMPONENTE: ArcadeTokaShop
 * Panel compacto de compra de TokaCoins para Arcade
 */

import React from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import type { TokaPackage } from '@/models/market/tokaPay-types';
import { DEFAULT_TOKA_PACKAGES } from '@/models/market/tokaPay-types';
import type { AlipaySession } from '@/services/alipayAuth';

interface ArcadeTokaShopProps {
  session: AlipaySession | null;
  tokaBalance: number;
  onPurchaseStart?: (pkg: TokaPackage) => void;
  onClose: () => void;
}

export const ArcadeTokaShop: React.FC<ArcadeTokaShopProps> = ({
  session,
  tokaBalance,
  onPurchaseStart,
  onClose,
}) => {
  const containerStyles: React.CSSProperties = {
    position: 'fixed',
    bottom: 80,
    right: DESIGN_CONSTANTS.spacing.lg,
    backgroundColor: COLORS.background.night,
    border: `2px solid ${COLORS.gamification.alertOrange}`,
    borderRadius: DESIGN_CONSTANTS.borderRadius.lg,
    padding: DESIGN_CONSTANTS.spacing.md,
    maxWidth: '280px',
    zIndex: 50,
    boxShadow: `0 0 20px rgba(255, 0, 255, 0.3)`,
    display: 'flex',
    flexDirection: 'column',
    gap: DESIGN_CONSTANTS.spacing.md,
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: DESIGN_CONSTANTS.spacing.sm,
    borderBottom: `1px solid ${COLORS.gamification.alertOrange}`,
  };

  const titleStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h4,
    color: COLORS.gamification.alertOrange,
    margin: 0,
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const closeButtonStyles: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: COLORS.gamification.alertOrange,
    cursor: 'pointer',
    fontSize: '20px',
    padding: 0,
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const balanceStyles: React.CSSProperties = {
    backgroundColor: `rgba(255, 154, 60, 0.1)`,
    border: `1px solid ${COLORS.gamification.alertOrange}`,
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    padding: DESIGN_CONSTANTS.spacing.sm,
    textAlign: 'center',
    ...TYPOGRAPHY.mono.md,
    color: COLORS.gamification.alertOrange,
    fontWeight: 700,
  };

  const packagesGridStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: DESIGN_CONSTANTS.spacing.sm,
    maxHeight: '240px',
    overflowY: 'auto',
  };

  const packageCardStyles = (isPopular: boolean): React.CSSProperties => ({
    backgroundColor: isPopular
      ? `rgba(255, 154, 60, 0.15)`
      : `rgba(255, 154, 60, 0.05)`,
    border: `1px solid ${
      isPopular ? COLORS.gamification.alertOrange : `rgba(255, 154, 60, 0.5)`
    }`,
    borderRadius: DESIGN_CONSTANTS.borderRadius.sm,
    padding: DESIGN_CONSTANTS.spacing.sm,
    cursor: session ? 'pointer' : 'not-allowed',
    opacity: session ? 1 : 0.5,
    transition: 'all 0.2s ease',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  });

  const packageInfoStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  };

  const packageNameStyles: React.CSSProperties = {
    ...TYPOGRAPHY.body.sm,
    color: COLORS.text.primary,
    fontWeight: 600,
  };

  const packageCoinsStyles: React.CSSProperties = {
    ...TYPOGRAPHY.label.sm,
    color: COLORS.gamification.alertOrange,
  };

  const packagePriceStyles: React.CSSProperties = {
    ...TYPOGRAPHY.label.sm,
    color: COLORS.gamification.gold,
    fontWeight: 700,
  };

  const buyButtonStyles: React.CSSProperties = {
    backgroundColor: COLORS.gamification.alertOrange,
    color: COLORS.background.abyss,
    border: 'none',
    borderRadius: DESIGN_CONSTANTS.borderRadius.sm,
    padding: '4px 8px',
    cursor: session ? 'pointer' : 'not-allowed',
    ...TYPOGRAPHY.body.sm,
    fontWeight: 700,
    opacity: session ? 1 : 0.5,
    transition: 'all 0.2s ease',
  };

  const notAuthenticatedStyles: React.CSSProperties = {
    textAlign: 'center',
    padding: DESIGN_CONSTANTS.spacing.md,
    color: COLORS.text.secondary,
    ...TYPOGRAPHY.body.xs,
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h3 style={titleStyles}>💎 TokaCoins</h3>
        <button style={closeButtonStyles} onClick={onClose}>
          ✕
        </button>
      </div>

      {session ? (
        <>
          <div style={balanceStyles}>{tokaBalance} 💎</div>

          <div style={packagesGridStyles}>
            {DEFAULT_TOKA_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                style={packageCardStyles(!!pkg.popular)}
                onClick={() => onPurchaseStart?.(pkg)}
              >
                <div style={packageInfoStyles}>
                  <div style={packageNameStyles}>{pkg.name}</div>
                  <div style={packageCoinsStyles}>+{pkg.coins}</div>
                  {pkg.bonus && (
                    <div style={{ ...TYPOGRAPHY.body.sm, color: COLORS.cube.green }}>
                      +{pkg.bonus} bonus
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <div style={packagePriceStyles}>${pkg.price.value}</div>
                  <button
                    style={buyButtonStyles}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPurchaseStart?.(pkg);
                    }}
                  >
                    Comprar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={notAuthenticatedStyles}>
          Inicia sesión con Alipay para comprar
        </div>
      )}
    </div>
  );
};
