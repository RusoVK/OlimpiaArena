/**
 * OLIMPIA ARENA - Nueva Tienda
 * Tienda con categorías en vertical y carruseles horizontales
 */

import React, { useState, useEffect } from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import type { MarketItem, MarketUser } from '@/models/market/types';
import { getUser } from '@/services/marketAPI';
import { MarketCatalog } from '@/components/market/MarketCatalog';
import { ChanjeModal } from '@/components/market/ChanjeModal';
import { BalanceHeader } from '@/components/market/BalanceHeader';

export const MarketViewNew: React.FC = () => {
  const [user, setUser] = useState<MarketUser | null>(null);
  const [selectedItem, setSelectedItem] = useState<MarketItem | undefined>();
  const [loading, setLoading] = useState(true);
  const [showChanjeModal, setShowChanjeModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleItemSelect = (item: MarketItem) => {
    setSelectedItem(item);
    setShowChanjeModal(true);
  };

  const handleChanjeSuccess = (message: string) => {
    const loadUser = async () => {
      const userData = await getUser();
      setUser(userData);
    };
    loadUser();
    setSelectedItem(undefined);
    setShowChanjeModal(false);
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleChanjeError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: COLORS.background.abyss,
    color: COLORS.text.primary,
    paddingBottom: '100px',
  };

  const headerStyles: React.CSSProperties = {
    padding: `${DESIGN_CONSTANTS.spacing.lg} ${DESIGN_CONSTANTS.spacing.md}`,
    borderBottom: `1px solid rgba(0, 255, 255, 0.2)`,
    backgroundColor: 'rgba(0, 255, 255, 0.03)',
  };

  const titleStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h2,
    color: COLORS.neon.cyan,
    margin: 0,
    marginBottom: DESIGN_CONSTANTS.spacing.sm,
    textShadow: `0 0 8px ${COLORS.neon.cyan}`,
  };

  const contentStyles: React.CSSProperties = {
    flex: 1,
    padding: `${DESIGN_CONSTANTS.spacing.lg} 0`,
  };

  if (loading) {
    return (
      <div style={containerStyles}>
        <div style={{ padding: '24px', textAlign: 'center', color: COLORS.text.secondary }}>
          Cargando tienda...
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyles}>
      {/* Header */}
      <div style={headerStyles}>
        <h1 style={titleStyles}>🏪 Tienda</h1>
        {user && (
          <BalanceHeader
            username={user.username}
            balance={user.tokaCoins}
            level={user.level}
            isLoading={loading}
          />
        )}
      </div>

      {/* Contenido - Catálogo */}
      <div style={contentStyles}>
        <MarketCatalog
          onItemSelect={handleItemSelect}
          selectedItem={selectedItem}
        />
      </div>

      {/* Modal de canje */}
      {showChanjeModal && selectedItem && user && (
        <ChanjeModal
          item={selectedItem}
          userBalance={user.tokaCoins}
          userId={user.id}
          onCancel={() => setShowChanjeModal(false)}
          onSuccess={handleChanjeSuccess}
          onError={handleChanjeError}
        />
      )}

      {/* Mensajes */}
      {successMessage && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 255, 200, 0.2)',
          border: '1px solid ' + COLORS.neon.cyan,
          color: COLORS.neon.cyan,
          padding: '12px 24px',
          borderRadius: '8px',
          zIndex: 1000,
        }}>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255, 50, 50, 0.2)',
          border: '1px solid #ff3232',
          color: '#ff3232',
          padding: '12px 24px',
          borderRadius: '8px',
          zIndex: 1000,
        }}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};
