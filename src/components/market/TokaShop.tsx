/**
 * COMPONENTE: TokaShop
 * Panel para compra de TokaCoins usando Alipay
 */

import React, { useState } from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import type { TokaPackage } from '@/models/market/tokaPay-types';
import type { AlipaySession } from '@/services/alipayAuth';
import { DEFAULT_TOKA_PACKAGES } from '@/models/market/tokaPay-types';

interface TokaShopProps {
  session: AlipaySession | null;
  onPurchaseStart?: (pkg: TokaPackage) => void;
  onPurchaseSuccess?: (coinsAmount: number) => void;
  onPurchaseError?: (error: string) => void;
}

export const TokaShop: React.FC<TokaShopProps> = ({
  session,
  onPurchaseStart,
  onPurchaseError,
}) => {
  const [selectedPackage, setSelectedPackage] = useState<TokaPackage | null>(null);

  const handlePackageSelect = async (pkg: TokaPackage) => {
    if (!session) {
      onPurchaseError?.('Debes autenticarte primero');
      return;
    }

    setSelectedPackage(pkg);
    onPurchaseStart?.(pkg);
  };

  const containerStyles: React.CSSProperties = {
    backgroundColor: COLORS.background.night,
    border: `2px solid ${COLORS.gamification.alertOrange}`,
    borderRadius: DESIGN_CONSTANTS.borderRadius.lg,
    padding: DESIGN_CONSTANTS.spacing.lg,
    display: 'flex',
    flexDirection: 'column',
    gap: DESIGN_CONSTANTS.spacing.md,
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: DESIGN_CONSTANTS.spacing.md,
    paddingBottom: DESIGN_CONSTANTS.spacing.md,
    borderBottom: `1px solid ${COLORS.gamification.alertOrange}`,
  };

  const titleStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h4,
    color: COLORS.gamification.alertOrange,
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontSize: '12px',
  };

  const packagesGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: DESIGN_CONSTANTS.spacing.md,
  };

  const packageCardStyles = (isSelected: boolean, isPopular: boolean): React.CSSProperties => ({
    backgroundColor: isSelected
      ? `rgba(255, 154, 60, 0.2)`
      : isPopular
        ? `rgba(255, 154, 60, 0.1)`
        : COLORS.background.abyss,
    border: isSelected
      ? `2px solid ${COLORS.gamification.alertOrange}`
      : `1px solid ${isPopular ? COLORS.gamification.alertOrange : COLORS.neon.cyan}`,
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    padding: DESIGN_CONSTANTS.spacing.md,
    cursor: session ? 'pointer' : 'not-allowed',
    display: 'flex',
    flexDirection: 'column',
    gap: DESIGN_CONSTANTS.spacing.sm,
    alignItems: 'center',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    opacity: session ? 1 : 0.5,
  });

  const packageNameStyles: React.CSSProperties = {
    ...TYPOGRAPHY.body.md,
    color: COLORS.text.primary,
    margin: 0,
    fontWeight: 600,
  };

  const packageCoinsStyles: React.CSSProperties = {
    ...TYPOGRAPHY.mono.lg,
    color: COLORS.gamification.alertOrange,
    textShadow: `0 0 8px ${COLORS.gamification.alertOrange}`,
    margin: 0,
    fontWeight: 700,
  };

  const packagePriceStyles: React.CSSProperties = {
    ...TYPOGRAPHY.label.sm,
    color: COLORS.gamification.gold,
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const badgeStyles: React.CSSProperties = {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: COLORS.gamification.gold,
    color: COLORS.background.abyss,
    padding: '2px 6px',
    borderRadius: DESIGN_CONSTANTS.borderRadius.sm,
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
  };

  const notAuthenticatedStyles: React.CSSProperties = {
    textAlign: 'center',
    padding: DESIGN_CONSTANTS.spacing.lg,
    color: COLORS.text.secondary,
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <span style={{ fontSize: '24px' }}>💎</span>
        <h3 style={titleStyles}>Sistema de TokaCoins</h3>
      </div>

      {session ? (
        <div style={packagesGridStyles}>
          {DEFAULT_TOKA_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              style={{
                ...packageCardStyles(selectedPackage?.id === pkg.id, !!pkg.popular),
                position: 'relative',
              }}
              onClick={() => handlePackageSelect(pkg)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handlePackageSelect(pkg);
                }
              }}
              role="button"
              tabIndex={session ? 0 : -1}
            >
              {pkg.badge && <div style={badgeStyles}>{pkg.badge}</div>}

              <p style={packageNameStyles}>{pkg.name}</p>
              <p style={packageCoinsStyles}>{pkg.coins}</p>
              {pkg.bonus && <p style={{ ...TYPOGRAPHY.body.xs, color: COLORS.cube.green }}>+{pkg.bonus} bonus</p>}
              <p style={packagePriceStyles}>${pkg.price.value}</p>
            </div>
          ))}
        </div>
      ) : (
        <div style={notAuthenticatedStyles}>
          <p>Debes autenticarte con Alipay para comprar TokaCoins</p>
        </div>
      )}
    </div>
  );
};
