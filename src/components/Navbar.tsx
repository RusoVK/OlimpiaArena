/**
 * OLIMPIA ARENA - Navigation Bar (Navbar)
 * Barra de navegación móvil con 4 botones principales
 */

import React from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import { ArenaIcon, ProfileIcon, MarketIcon, RankingIcon } from './icons/NeonIcons';

export type NavSection = 'arena' | 'profile' | 'market' | 'ranking';

interface NavbarProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const navItems: Array<{ id: NavSection; label: string; icon: React.ComponentType<any> }> = [
    { id: 'arena', label: 'Arena', icon: ArenaIcon },
    { id: 'profile', label: 'Perfil', icon: ProfileIcon },
    { id: 'market', label: 'Mercado', icon: MarketIcon },
    { id: 'ranking', label: 'Ranking', icon: RankingIcon },
  ];

  const navbarStyles: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '80px',
    backgroundColor: COLORS.background.night,
    borderTop: DESIGN_CONSTANTS.neoBorders.cyanThin,
    boxShadow: DESIGN_CONSTANTS.shadows.glowCyanSmall,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: DESIGN_CONSTANTS.zIndex.sticky,
    backdropFilter: 'blur(10px)',
    background: `linear-gradient(180deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)`,
  };

  const navItemStyles = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: DESIGN_CONSTANTS.spacing.xs,
    padding: `${DESIGN_CONSTANTS.spacing.sm} ${DESIGN_CONSTANTS.spacing.md}`,
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    transition: DESIGN_CONSTANTS.transitions.smooth,
    position: 'relative',
    ...(isActive && {
      filter: `drop-shadow(0 0 12px ${COLORS.neon.cyan})`,
    }),
  });

  const labelStyles = (isActive: boolean): React.CSSProperties => ({
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: isActive ? COLORS.neon.cyan : COLORS.text.secondary,
    transition: DESIGN_CONSTANTS.transitions.smooth,
    fontFamily: TYPOGRAPHY.label.sm.fontFamily,
  });

  const activeIndicatorStyles: React.CSSProperties = {
    position: 'absolute',
    bottom: '-8px',
    height: '3px',
    width: '16px',
    backgroundColor: COLORS.neon.cyan,
    borderRadius: DESIGN_CONSTANTS.borderRadius.full,
    boxShadow: `0 0 8px ${COLORS.neon.cyan}`,
  };

  return (
    <nav style={navbarStyles}>
      {navItems.map((item) => {
        const isActive = activeSection === item.id;
        const IconComponent = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={navItemStyles(isActive)}
            aria-label={item.label}
            title={item.label}
          >
            <IconComponent size={28} active={isActive} />
            <span style={labelStyles(isActive)}>{item.label}</span>
            {isActive && <div style={activeIndicatorStyles} />}
          </button>
        );
      })}
    </nav>
  );
};
