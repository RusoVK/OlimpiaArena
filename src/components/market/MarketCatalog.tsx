/**
 * COMPONENTE: Catálogo de Items del Mercado
 * Categorías verticales con carrusel horizontal de items
 */

import React, { useState, useEffect } from 'react';
import { COLORS, TYPOGRAPHY } from '@/theme';
import type { MarketItem } from '@/models/market/types';
import { getMarketItems } from '@/services/marketAPI';
import { MarketItemCard } from './MarketItemCard';

interface MarketCatalogProps {
  onItemSelect: (item: MarketItem) => void;
  selectedItem?: MarketItem;
}

export const MarketCatalog: React.FC<MarketCatalogProps> = ({ onItemSelect, selectedItem }) => {
  const [items, setItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const marketItems = await getMarketItems();
      setItems(marketItems.filter(item => item.active));
    } catch (error) {
      console.error('Error loading market items:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'badge', label: 'Badges', icon: '🏆' },
    { id: 'cosmetic', label: 'Skins', icon: '🎨' },
    { id: 'power-up', label: 'Power-ups', icon: '⚡' },
    { id: 'experience', label: 'Experiencias', icon: '🚀' },
    { id: 'exclusive', label: 'Exclusivas', icon: '👑' },
  ];

  const getCategoryItems = (categoryId: string) => {
    return items.filter(item => item.category === categoryId);
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: COLORS.text.secondary }}>
        Cargando mercado...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: COLORS.text.secondary }}>
        No hay items disponibles
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '20px' }}>
      {categories.map(category => {
        const categoryItems = getCategoryItems(category.id);

        if (categoryItems.length === 0) return null;

        return (
          <div key={category.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Título de categoría */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '16px' }}>
              <span style={{ fontSize: '24px' }}>{category.icon}</span>
              <h3
                style={{
                  ...TYPOGRAPHY.heading.h4,
                  color: COLORS.neon.cyan,
                  margin: 0,
                  textShadow: `0 0 8px ${COLORS.neon.cyan}`,
                }}
              >
                {category.label}
              </h3>
            </div>

            {/* Carrusel de items */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                overflowX: 'auto',
                paddingLeft: '16px',
                paddingRight: '16px',
                paddingBottom: '12px',
              }}
            >
              {categoryItems.map(item => (
                <MarketItemCard
                  key={item.id}
                  item={item}
                  onSelect={onItemSelect}
                  isSelected={selectedItem?.id === item.id}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
