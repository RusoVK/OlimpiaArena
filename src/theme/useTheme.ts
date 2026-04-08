/**
 * OLIMPIA ARENA - Hook para Acceso al Tema
 * Facilita el uso de la identidad visual en componentes React
 */

import { useMemo } from 'react';
import { OLIMPIA_THEME, COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from './index';

/**
 * Hook useTheme - Acceso centralizado a la identidad visual
 * @returns {Object} Objeto con theme, colors, typography, design
 */
export function useTheme() {
  return useMemo(() => ({
    theme: OLIMPIA_THEME,
    colors: COLORS,
    typography: TYPOGRAPHY,
    design: DESIGN_CONSTANTS,
  }), []);
}

/**
 * Helper para obtener estilos inline de la tipografía
 * @param style - Estilo de tipografía (ej: 'h1', 'body.md', 'mono.lg', 'timer.main')
 * @returns {React.CSSProperties} Objeto de estilos CSS
 */
export function getTypographyStyle(style: string): React.CSSProperties {
  const [group, subStyle] = style.split('.');

  if (subStyle) {
    const typographyGroup = TYPOGRAPHY[group as keyof typeof TYPOGRAPHY] as any;
    return typographyGroup?.[subStyle] || {};
  }

  return (TYPOGRAPHY[group as keyof typeof TYPOGRAPHY] as any) || {};
}

/**
 * Helper para obtener color con opacidad
 * @param colorValue - Valor hex del color
 * @param opacity - Opacidad de 0-1
 * @returns {string} Color rgba
 */
export function getColorWithOpacity(colorValue: string, opacity: number): string {
  const hex = colorValue.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${Math.min(Math.max(opacity, 0), 1)})`;
}

/**
 * Helper para obtener estilos de botón predefinido
 * @param variant - 'primary' | 'secondary'
 * @returns {React.CSSProperties} Estilos del botón
 */
export function getButtonStyle(variant: 'primary' | 'secondary'): React.CSSProperties {
  return variant === 'primary'
    ? OLIMPIA_THEME.components.buttonPrimary
    : OLIMPIA_THEME.components.buttonSecondary;
}

/**
 * Helper para obtener estilos de panel
 * @returns {React.CSSProperties} Estilos del panel
 */
export function getPanelStyle(): React.CSSProperties {
  return OLIMPIA_THEME.components.panel;
}

/**
 * Helper para generar animación de glow
 * @param color - Nombre del color ('cyan', 'teal', 'gold')
 * @param intensity - 'small', 'medium', 'large'
 */
export function getGlowShadow(color: 'cyan' | 'teal' | 'gold', intensity: 'small' | 'medium' | 'large'): string {
  const glows = {
    cyan: {
      small: DESIGN_CONSTANTS.shadows.glowCyanSmall,
      medium: DESIGN_CONSTANTS.shadows.glowCyanMedium,
      large: DESIGN_CONSTANTS.shadows.glowCyanLarge,
    },
    teal: {
      small: DESIGN_CONSTANTS.shadows.glowTealSmall,
      medium: DESIGN_CONSTANTS.shadows.glowTealMedium,
      large: DESIGN_CONSTANTS.shadows.glowTealMedium,
    },
    gold: {
      small: DESIGN_CONSTANTS.shadows.glowGoldSmall,
      medium: DESIGN_CONSTANTS.shadows.glowGoldMedium,
      large: DESIGN_CONSTANTS.shadows.glowGoldMedium,
    },
  };

  return glows[color][intensity];
}

/**
 * Helper para obtener variable CSS por nombre
 * @param variableName - Nombre de la variable (sin --)
 * @returns {string} Valor de la variable CSS
 */
export function getCSSVariable(variableName: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(`--${variableName}`).trim();
}

export { OLIMPIA_THEME, COLORS, TYPOGRAPHY, DESIGN_CONSTANTS };
