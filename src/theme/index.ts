/**
 * IDENTIDAD VISUAL: Olimpia Arena - Configuración del Tema
 * Exporta la configuración completa de la identidad visual
 */

import { COLORS } from './colors';
import { TYPOGRAPHY } from './typography';
import { DESIGN_CONSTANTS } from './constants';

/**
 * TEMA GLOBAL
 * Combina colores, tipografía y constantes de diseño en una única configuración
 */
export const OLIMPIA_THEME = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  design: DESIGN_CONSTANTS,

  // ============ PRESETS DE COMPONENTES ============
  components: {
    // Botón Primario (CTA principal)
    buttonPrimary: {
      bg: COLORS.neon.cyan,
      color: COLORS.background.abyss,
      border: 'none',
      padding: `${DESIGN_CONSTANTS.spacing.sm} ${DESIGN_CONSTANTS.spacing.lg}`,
      borderRadius: DESIGN_CONSTANTS.borderRadius.md,
      fontSize: TYPOGRAPHY.body.md.fontSize,
      fontWeight: 600,
      cursor: 'pointer',
      transition: DESIGN_CONSTANTS.transitions.hover,
      '&:hover': {
        boxShadow: DESIGN_CONSTANTS.shadows.glowCyanMedium,
      },
    },

    // Botón Secundario (Alternativa)
    buttonSecondary: {
      bg: 'transparent',
      color: COLORS.neon.cyan,
      border: DESIGN_CONSTANTS.neoBorders.cyanThin,
      padding: `${DESIGN_CONSTANTS.spacing.sm} ${DESIGN_CONSTANTS.spacing.lg}`,
      borderRadius: DESIGN_CONSTANTS.borderRadius.md,
      fontSize: TYPOGRAPHY.body.md.fontSize,
      fontWeight: 600,
      cursor: 'pointer',
      transition: DESIGN_CONSTANTS.transitions.hover,
      '&:hover': {
        boxShadow: DESIGN_CONSTANTS.shadows.glowCyanSmall,
        backgroundColor: COLORS.overlay.glowCyan,
      },
    },

    // Panel de Contenido (Tarjeta)
    panel: {
      bg: COLORS.background.night,
      border: DESIGN_CONSTANTS.neoBorders.cyanThin,
      borderRadius: DESIGN_CONSTANTS.borderRadius.lg,
      padding: DESIGN_CONSTANTS.spacing.lg,
      boxShadow: DESIGN_CONSTANTS.shadows.innerDepth,
      transition: DESIGN_CONSTANTS.transitions.smooth,
      '&:hover': {
        boxShadow: DESIGN_CONSTANTS.shadows.glowCyanSmall,
      },
    },

    // Input de formulario
    input: {
      bg: COLORS.background.deep,
      color: COLORS.text.primary,
      border: DESIGN_CONSTANTS.neoBorders.tealThin,
      borderRadius: DESIGN_CONSTANTS.borderRadius.md,
      padding: `${DESIGN_CONSTANTS.spacing.sm} ${DESIGN_CONSTANTS.spacing.md}`,
      fontSize: TYPOGRAPHY.body.md.fontSize,
      height: DESIGN_CONSTANTS.sizes.inputHeight,
      transition: DESIGN_CONSTANTS.transitions.smooth,
      '&:focus': {
        outline: 'none',
        border: DESIGN_CONSTANTS.neoBorders.cyanMedium,
        boxShadow: DESIGN_CONSTANTS.shadows.glowCyanSmall,
      },
    },

    // Badge de gamificación
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: `${DESIGN_CONSTANTS.spacing.xs} ${DESIGN_CONSTANTS.spacing.sm}`,
      borderRadius: DESIGN_CONSTANTS.borderRadius.full,
      fontSize: TYPOGRAPHY.label.sm.fontSize,
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      backgroundColor: COLORS.neon.cyan,
      color: COLORS.background.abyss,
    },

    // Cronómetro principal
    timer: {
      fontSize: TYPOGRAPHY.timer.main.fontSize,
      fontFamily: TYPOGRAPHY.timer.main.fontFamily,
      fontWeight: 700,
      color: COLORS.neon.cyan,
      letterSpacing: '2px',
      textShadow: `0 0 16px ${COLORS.neon.cyan}`,
    },

    // Card de Arena Activa
    arenaCard: {
      bg: COLORS.background.night,
      border: DESIGN_CONSTANTS.neoBorders.cyanThin,
      borderRadius: DESIGN_CONSTANTS.borderRadius.lg,
      padding: DESIGN_CONSTANTS.spacing.lg,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: DESIGN_CONSTANTS.spacing.md,
      boxShadow: DESIGN_CONSTANTS.shadows.glowCyanSmall,
    },
  },
};

export type OlimpiaTheme = typeof OLIMPIA_THEME;

// Exportar también los módulos individuales para uso directo
export { COLORS };
export { TYPOGRAPHY };
export { DESIGN_CONSTANTS };
