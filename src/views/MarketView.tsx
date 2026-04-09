/**
 * OLIMPIA ARENA - Pantalla Mercado de Recompensas
 * Rediseño completo según especificaciones heráldico-tecnológico
 */

import React, { useState, useEffect } from 'react';
import { COLORS, TYPOGRAPHY } from '@/theme';
import type { MarketItem, MarketUser } from '@/models/market/types';
import { getUser, getMarketItems } from '@/services/marketAPI';
import {
  MarketHeader,
  WalletPanel,
  CategorySection,
  MarketMessages,
  ChanjeModal,
  TransactionHistory,
} from '@/components/market';

export const MarketView: React.FC = () => {
  const [user, setUser] = useState<MarketUser | null>(null);
  const [items, setItems] = useState<MarketItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  // Agrupar items por categoría
  const cosmeticos = items.filter(item => item.categoryLabel === 'COSMÉTICOS DE PERFIL');
  const potenciadores = items.filter(item => item.categoryLabel === 'POTENCIADORES DE ARENA');
  const fisicas = items.filter(item => item.categoryLabel === 'RECOMPENSAS FÍSICAS');

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: COLORS.background.abyss,
    color: COLORS.text.primary,
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    padding: '24px 16px 100px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  };

  const twoColumnsStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <MarketHeader />
        <div style={{ padding: '24px', color: COLORS.text.secondary }}>
          Cargando mercado...
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <MarketMessages successMessage={successMessage} errorMessage={errorMessage} />
      <MarketHeader />

      <div style={contentStyle}>
        {user && <WalletPanel balance={user.tokaCoins} />}

        <div style={twoColumnsStyle}>
          <CategorySection
            title="🧠 Cosméticos de Perfil"
            items={cosmeticos}
            onSelectItem={setSelectedItem}
            selectedItemId={selectedItem?.id}
          />
          <CategorySection
            title="⚡ Potenciadores de Arena"
            items={potenciadores}
            onSelectItem={setSelectedItem}
            selectedItemId={selectedItem?.id}
          />
        </div>

        <CategorySection
          title="🎁 Recompensas Físicas"
          items={fisicas}
          onSelectItem={setSelectedItem}
          selectedItemId={selectedItem?.id}
          isWide
        />

        {user && <TransactionHistory userId={user.id} />}
      </div>

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
    </div>
  );
};
