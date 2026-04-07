/**
 * IDENTIDAD VISUAL: Olimpia Arena - Constantes de Diseño
 * Espacios, bordes, sombras, efectos de glow y transiciones
 */

export const DESIGN_CONSTANTS = {
  // ============ ESPACIOS (Escala 4px) ============
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },

  // ============ RADIO DE BORDES ============
  borderRadius: {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  // ============ ANCHO DE BORDES ============
  borderWidth: {
    thin: '1px',
    medium: '2px',
    thick: '3px',
  },

  // ============ BORDES NEÓN (Neon-Neuron Style) ============
  neoBorders: {
    // Bordes con glow suave
    cyanThin: '1px solid rgba(0, 255, 255, 0.8)',
    cyanMedium: '2px solid rgba(0, 255, 255, 1)',
    tealThin: '1px solid rgba(0, 218, 202, 0.8)',
    tealMedium: '2px solid rgba(0, 218, 202, 1)',

    // Bordes facetados (simula bordes de diamante/cubo)
    faceted:
      'border-image: linear-gradient(135deg, #00FFFF 0%, #00DACA 100%) 1',
  },

  // ============ SOMBRAS NEÓN (Box-shadow con glow) ============
  shadows: {
    // Glows sutiles
    glowCyanSmall: '0 0 8px rgba(0, 255, 255, 0.3), inset 0 0 8px rgba(0, 255, 255, 0.1)',
    glowCyanMedium: '0 0 16px rgba(0, 255, 255, 0.5), inset 0 0 16px rgba(0, 255, 255, 0.15)',
    glowCyanLarge: '0 0 32px rgba(0, 255, 255, 0.7), inset 0 0 32px rgba(0, 255, 255, 0.2)',

    glowTealSmall: '0 0 8px rgba(0, 218, 202, 0.3), inset 0 0 8px rgba(0, 218, 202, 0.1)',
    glowTealMedium: '0 0 16px rgba(0, 218, 202, 0.5), inset 0 0 16px rgba(0, 218, 202, 0.15)',

    glowGoldSmall: '0 0 8px rgba(255, 215, 0, 0.3), inset 0 0 8px rgba(255, 215, 0, 0.1)',
    glowGoldMedium: '0 0 16px rgba(255, 215, 0, 0.5), inset 0 0 16px rgba(255, 215, 0, 0.15)',

    // Sombras de elevación para componentes
    elevationSmall: '0 4px 12px rgba(0, 0, 0, 0.4)',
    elevationMedium: '0 8px 24px rgba(0, 0, 0, 0.5)',
    elevationLarge: '0 12px 32px rgba(0, 0, 0, 0.6)',

    // Sombra interior para paneles (efecto de profundidad)
    innerDepth: 'inset 0 1px 3px rgba(0, 255, 255, 0.05)',
  },

  // ============ TRANSICIONES ============
  transitions: {
    fast: '150ms ease-in-out',
    smooth: '250ms ease-in-out',
    slow: '400ms ease-in-out',
    slowest: '600ms ease-in-out',

    // Transiciones específicas
    glow: '200ms ease-out',
    pulse: '2000ms ease-in-out',
    hover: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // ============ ANIMACIONES KEYFRAME ============
  animations: {
    // Efecto de pulso para el cronómetro READY
    pulse: `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
    `,

    // Efecto de destello de neón
    neonFlash: `
      @keyframes neonFlash {
        0%, 100% { 
          box-shadow: 0 0 8px rgba(0, 255, 255, 0.3), 
                      inset 0 0 8px rgba(0, 255, 255, 0.1);
        }
        50% { 
          box-shadow: 0 0 32px rgba(0, 255, 255, 0.9), 
                      inset 0 0 32px rgba(0, 255, 255, 0.4);
        }
      }
    `,

    // Efecto de glow gradient
    glowShift: `
      @keyframes glowShift {
        0% { 
          box-shadow: 0 0 16px rgba(0, 255, 255, 0.5);
        }
        50% { 
          box-shadow: 0 0 16px rgba(0, 218, 202, 0.5);
        }
        100% { 
          box-shadow: 0 0 16px rgba(0, 255, 255, 0.5);
        }
      }
    `,

    // Efecto de subida de XP
    xpFill: `
      @keyframes xpFill {
        0% { width: 0%; opacity: 0; }
        50% { opacity: 1; }
        100% { width: 100%; opacity: 1; }
      }
    `,

    // Efecto de slide in desde arriba
    slideInDown: `
      @keyframes slideInDown {
        from {
          transform: translateY(-20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `,

    // Efecto de fade in
    fadeIn: `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `,
  },

  // ============ Z-INDEX (Stacking Context) ============
  zIndex: {
    base: 0,
    below: -1,
    dropdown: 100,
    sticky: 200,
    modal: 300,
    tooltip: 400,
    notification: 500,
    overlay: 600,
  },

  // ============ BREAKPOINTS (Mobile First) ============
  breakpoints: {
    xs: '320px',
    sm: '480px',
    md: '640px',
    lg: '768px',
    xl: '1024px',
    xxl: '1280px',
  },

  // ============ TAMAÑOS COMUNES ============
  sizes: {
    // Iconos
    iconXs: '16px',
    iconSm: '20px',
    iconMd: '24px',
    iconLg: '32px',
    iconXl: '48px',

    // Componentes
    buttonSmall: '32px',
    buttonMedium: '40px',
    buttonLarge: '48px',

    // Inputs
    inputHeight: '40px',
    inputHeightLarge: '48px',
  },

  // ============ OPACIDADES ============
  opacity: {
    disabled: 0.4,
    hover: 0.8,
    subtle: 0.05,
    secondary: 0.7,
    full: 1,
  },
};

export type DesignConstant = keyof typeof DESIGN_CONSTANTS;
