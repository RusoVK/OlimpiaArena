/**
 * OLIMPIA ARENA - Pantalla Mercado de Recompensas
 * Rediseño completo según especificaciones heráldico-tecnológico
 */

import React, { useState, useEffect } from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import type { MarketItem, MarketUser } from '@/models/market/types';
import { getUser, getMarketItems } from '@/services/marketAPI';
import { MarketItemCard } from '@/components/market/MarketItemCard';
import { ChanjeModal } from '@/components/market/ChanjeModal';
import { TransactionHistory } from '@/components/market/TransactionHistory';
import { TokaShop } from '@/components/market/TokaShop';
import { TokaPaymentModal } from '@/components/market/TokaPaymentModal';
import { useAlipayAuth } from '@/controllers/useAlipayAuth';
import type { TokaPackage } from '@/models/market/tokaPay-types';

export const MarketView: React.FC = () => {
  const [user, setUser] = useState<MarketUser | null>(null);
  const [items, setItems] = useState<MarketItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
  const [selectedTokaPackage, setSelectedTokaPackage] = useState<TokaPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const alipayAuth = useAlipayAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userData, itemsData] = await Promise.all([
          getUser(),
          getMarketItems(),
        ]);
        setUser(userData);
        setItems(itemsData);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleChanjeSuccess = () => {
    const loadUser = async () => {
      const userData = await getUser();
      setUser(userData);
    };
    loadUser();
    setSelectedItem(null);
  };

  const handleTokaPackageSelect = (pkg: TokaPackage) => {
    setSelectedTokaPackage(pkg);
  };

  const handleTokaPaymentSuccess = (coinsReceived: number) => {
    if (user) {
      setUser({
        ...user,
        tokaCoins: user.tokaCoins + coinsReceived,
      });
      setSuccessMessage(`¡Has recibido ${coinsReceived} TokaCoins!`);
    }
    setSelectedTokaPackage(null);
  };

  // Agrupar items por categoría
  const cosmeticos = items.filter(item => item.categoryLabel === 'COSMÉTICOS DE PERFIL');
  const potenciadores = items.filter(item => item.categoryLabel === 'POTENCIADORES DE ARENA');
  const fisicas = items.filter(item => item.categoryLabel === 'RECOMPENSAS FÍSICAS');

  // Estilos
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: COLORS.background.abyss,
    color: COLORS.text.primary,
  };

  const headerStyles: React.CSSProperties = {
    textAlign: 'center',
    padding: `${DESIGN_CONSTANTS.spacing.xl} ${DESIGN_CONSTANTS.spacing.md}`,
    borderBottom: `2px solid ${COLORS.neon.cyan}`,
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
    boxShadow: `0 4px 20px rgba(0, 255, 255, 0.2)`,
  };

  const titleMainStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h1,
    color: COLORS.text.primary,
    margin: 0,
    marginBottom: DESIGN_CONSTANTS.spacing.xs,
    letterSpacing: '2px',
    textShadow: `0 0 10px ${COLORS.neon.cyan}`,
  };

  const titleSubStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h4,
    color: COLORS.neon.cyan,
    margin: 0,
    letterSpacing: '1px',
    fontWeight: 600,
  };

  const contentStyles: React.CSSProperties = {
    flex: 1,
    padding: DESIGN_CONSTANTS.spacing.lg,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: DESIGN_CONSTANTS.spacing.xl,
  };

  const walletPanelStyles: React.CSSProperties = {
    backgroundColor: COLORS.background.night,
    border: `2px solid ${COLORS.neon.cyan}`,
    borderRadius: DESIGN_CONSTANTS.borderRadius.lg,
    padding: DESIGN_CONSTANTS.spacing.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: `0 0 20px rgba(0, 255, 255, 0.3), inset 0 0 20px rgba(0, 255, 255, 0.1)`,
    animation: 'glowShift 3s ease-in-out infinite',
  };

  const walletIconStyles: React.CSSProperties = {
    fontSize: '48px',
    marginRight: DESIGN_CONSTANTS.spacing.md,
  };

  const walletInfoStyles: React.CSSProperties = {
    flex: 1,
  };

  const walletLabelStyles: React.CSSProperties = {
    ...TYPOGRAPHY.label.sm,
    color: COLORS.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: DESIGN_CONSTANTS.spacing.xs,
  };

  const walletBalanceStyles: React.CSSProperties = {
    ...TYPOGRAPHY.mono.lg,
    color: COLORS.neon.cyan,
    textShadow: `0 0 10px ${COLORS.neon.cyan}`,
    fontWeight: 700,
  };

  const twoColumnsStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: DESIGN_CONSTANTS.spacing.lg,
  };

  const categoryPanelStyles: React.CSSProperties = {
    backgroundColor: COLORS.background.night,
    border: `2px solid ${COLORS.neon.cyan}`,
    borderRadius: DESIGN_CONSTANTS.borderRadius.lg,
    padding: DESIGN_CONSTANTS.spacing.lg,
    display: 'flex',
    flexDirection: 'column',
    gap: DESIGN_CONSTANTS.spacing.md,
  };

  const categoryTitleStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h4,
    color: COLORS.neon.cyan,
    margin: 0,
    marginBottom: DESIGN_CONSTANTS.spacing.md,
    paddingBottom: DESIGN_CONSTANTS.spacing.md,
    borderBottom: `1px solid ${COLORS.neon.cyan}`,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontSize: '12px',
  };

  const itemsGridStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: DESIGN_CONSTANTS.spacing.md,
  };

  const fisicasContainerStyles: React.CSSProperties = {
    backgroundColor: COLORS.background.night,
    border: `2px solid ${COLORS.neon.cyan}`,
    borderRadius: DESIGN_CONSTANTS.borderRadius.lg,
    padding: DESIGN_CONSTANTS.spacing.lg,
    display: 'flex',
    flexDirection: 'column',
    gap: DESIGN_CONSTANTS.spacing.md,
  };

  const fisicasTitleStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h4,
    color: COLORS.neon.cyan,
    margin: 0,
    marginBottom: DESIGN_CONSTANTS.spacing.md,
    paddingBottom: DESIGN_CONSTANTS.spacing.md,
    borderBottom: `1px solid ${COLORS.neon.cyan}`,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontSize: '12px',
  };

  const fisicasGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: DESIGN_CONSTANTS.spacing.md,
  };

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

  if (loading) {
    return (
      <div style={containerStyles}>
        <div style={headerStyles}>
          <h1 style={titleMainStyles}>OLIMPIAARENA</h1>
          <p style={titleSubStyles}>Cargando mercado...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyles}>
      {/* Mensajes */}
      {successMessage && (
        <div style={messageStyles('success')}>
          ✅ {successMessage}
        </div>
      )}
      {errorMessage && (
        <div style={messageStyles('error')}>
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Cabecera */}
      <div style={headerStyles}>
        <h1 style={titleMainStyles}>OLIMPIAARENA</h1>
        <p style={titleSubStyles}>MERCADO DE RECOMPENSAS</p>
      </div>

      {/* Contenido Principal */}
      <div style={contentStyles}>
        {/* Panel de Saldo */}
        {user && (
          <div style={walletPanelStyles}>
            <div style={walletIconStyles}>💰</div>
            <div style={walletInfoStyles}>
              <div style={walletLabelStyles}>Saldo Disponible</div>
              <div style={walletBalanceStyles}>
                {user.tokaCoins.toLocaleString()} TC
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '24px' }}>Ⓜ️</div>
          </div>
        )}

        {/* Sistema de TokaCoins */}
        <TokaShop
          session={alipayAuth.session}
          onPurchaseStart={(pkg) => {
            if (!alipayAuth.session) {
              alipayAuth.login().then((success) => {
                if (success) {
                  setSelectedTokaPackage(pkg);
                }
              }).catch(() => {
                setErrorMessage('Error iniciando sesión con Alipay');
              });
            } else {
              handleTokaPackageSelect(pkg);
            }
          }}
          onPurchaseSuccess={handleTokaPaymentSuccess}
          onPurchaseError={setErrorMessage}
        />

        {/* Dos Columnas: Cosméticos + Potenciadores */}
        <div style={twoColumnsStyles}>
          {/* Cosméticos */}
          <div style={categoryPanelStyles}>
            <h3 style={categoryTitleStyles}>🧠 Cosméticos de Perfil</h3>
            <div style={itemsGridStyles}>
              {cosmeticos.map(item => (
                <MarketItemCard
                  key={item.id}
                  item={item}
                  onSelect={setSelectedItem}
                  isSelected={selectedItem?.id === item.id}
                />
              ))}
            </div>
          </div>

          {/* Potenciadores */}
          <div style={categoryPanelStyles}>
            <h3 style={categoryTitleStyles}>⚡ Potenciadores de Arena</h3>
            <div style={itemsGridStyles}>
              {potenciadores.map(item => (
                <MarketItemCard
                  key={item.id}
                  item={item}
                  onSelect={setSelectedItem}
                  isSelected={selectedItem?.id === item.id}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Recompensas Físicas */}
        <div style={fisicasContainerStyles}>
          <h3 style={fisicasTitleStyles}>🎁 Recompensas Físicas</h3>
          <div style={fisicasGridStyles}>
            {fisicas.map(item => (
              <MarketItemCard
                key={item.id}
                item={item}
                onSelect={setSelectedItem}
                isSelected={selectedItem?.id === item.id}
              />
            ))}
          </div>
        </div>

        {/* Historial de Transacciones */}
        {user && <TransactionHistory userId={user.id} />}
      </div>

      {/* Modal de Canje */}
      {selectedItem && user && (
        <ChanjeModal
          item={selectedItem}
          userBalance={user.tokaCoins}
          userId={user.id}
          onCancel={() => setSelectedItem(null)}
          onSuccess={(msg) => {
            setSuccessMessage(msg);
            handleChanjeSuccess();
          }}
          onError={setErrorMessage}
        />
      )}

      {/* Modal de Pago de TokaCoins */}
      {selectedTokaPackage && alipayAuth.session && (
        <TokaPaymentModal
          package={selectedTokaPackage}
          session={alipayAuth.session}
          onSuccess={handleTokaPaymentSuccess}
          onError={setErrorMessage}
          onCancel={() => setSelectedTokaPackage(null)}
        />
      )}
    </div>
  );
};
