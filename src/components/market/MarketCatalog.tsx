/**
 * COMPONENTE: Catálogo de Items del Mercado
 * Grid de premios disponibles para canjear
 */

import React, { useState, useEffect } from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import type { MarketItem } from '@/models/market/types';
import { getMarketItems } from '@/services/marketAPI';
import { MarketItemCard } from './MarketItemCard';

interface MarketCatalogProps {
  onItemSelect: (item: MarketItem) => void;
  selectedItem?: MarketItem;
}

type CategoryFilter = 'all' | 'badge' | 'cosmetic' | 'power-up' | 'experience' | 'exclusive';

export const MarketCatalog: React.FC<MarketCatalogProps> = ({ onItemSelect, selectedItem }) => {
  const [items, setItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');

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

  const categories: { id: CategoryFilter; label: string; icon: string }[] = [
    { id: 'all', label: 'Todo', icon: '📦' },
    { id: 'badge', label: 'Badges', icon: '🏆' },
    { id: 'cosmetic', label: 'Skins', icon: '🎨' },
    { id: 'power-up', label: 'Power-ups', icon: '⚡' },
    { id: 'experience', label: 'Experiencias', icon: '🚀' },
    { id: 'exclusive', label: 'Exclusivas', icon: '👑' },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: DESIGN_CONSTANTS.spacing.lg,
  };

  const categoryFilterStyles: React.CSSProperties = {
    display: 'flex',
    gap: DESIGN_CONSTANTS.spacing.sm,
    overflowX: 'auto',
    paddingBottom: DESIGN_CONSTANTS.spacing.sm,
    marginBottom: DESIGN_CONSTANTS.spacing.md,
  };

  const categoryButtonStyles = (isActive: boolean): React.CSSProperties => ({
    padding: `${DESIGN_CONSTANTS.spacing.sm} ${DESIGN_CONSTANTS.spacing.md}`,
    borderRadius: DESIGN_CONSTANTS.borderRadius.full,
    border: isActive
      ? DESIGN_CONSTANTS.neoBorders.cyanMedium
      : DESIGN_CONSTANTS.neoBorders.cyanThin,
    backgroundColor: isActive ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
    color: isActive ? COLORS.neon.cyan : COLORS.text.secondary,
    cursor: 'pointer',
    transition: DESIGN_CONSTANTS.transitions.smooth,
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
    boxShadow: isActive ? DESIGN_CONSTANTS.shadows.glowCyanSmall : 'none',
  });

  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: DESIGN_CONSTANTS.spacing.md,
    marginBottom: DESIGN_CONSTANTS.spacing.lg,
  };

  const emptyStateStyles: React.CSSProperties = {
    gridColumn: '1 / -1',
    padding: DESIGN_CONSTANTS.spacing.xl,
    textAlign: 'center',
    color: COLORS.text.secondary,
    ...TYPOGRAPHY.body.md,
  };

  const loadingStyles: React.CSSProperties = {
    gridColumn: '1 / -1',
    padding: DESIGN_CONSTANTS.spacing.xl,
    textAlign: 'center',
    animation: 'pulse 2s infinite',
  };

  if (loading) {
    return (
      <div style={containerStyles}>
        <div style={loadingStyles}>Cargando catálogo...</div>
      </div>
    );
  }

  return (
    <div style={containerStyles}>
      {/* Filtro por categoría */}
      <div style={categoryFilterStyles}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={categoryButtonStyles(selectedCategory === cat.id) as any}
          >
            <span>{cat.icon}</span> {cat.label}
          </button>
        ))}
      </div>

      {/* Grid de items */}
      <div style={gridStyles}>
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <MarketItemCard
              key={item.id}
              item={item}
              onSelect={onItemSelect}
              isSelected={selectedItem?.id === item.id}
            />
          ))
        ) : (
          <div style={emptyStateStyles}>
            No hay items disponibles en esta categoría
          </div>
        )}
      </div>
    </div>
  );
};
