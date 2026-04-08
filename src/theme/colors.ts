/**
 * IDENTIDAD VISUAL: Olimpia Arena - Neutral Core + Electric Accents
 * Paleta neutral con acentos vibrantes para foco y energia
 */

export const COLORS = {
  // ============ COLORES DE FONDO (Neutral Base) ============
  background: {
    abyss: '#101316', // Grafito oscuro - Fondo principal
    night: '#171b21', // Pizarra profunda - Paneles y tarjetas
    deep: '#1d232b', // Carbon suave - Alternativa mas suave
  },

  // ============ COLORES DE ACENTO Y ENERGIA (Electric Accents) ============
  neon: {
    cyan: '#38E8FF', // Azul hielo electrico - Color principal de marca
    teal: '#2CF3C8', // Turquesa vibrante - Acento secundario
  },

  // ============ COLORES DEL CUBO (WCA Refinados para Neutral UI) ============
  cube: {
    cyan: '#38E8FF', // Azul Cubo (mismo que neon.cyan)
    yellow: '#F6C453', // Amarillo dorado
    red: '#F05454', // Rojo coral
    orange: '#FF8A3D', // Naranja vivo
    green: '#43D18E', // Verde menta
    white: '#F4F6F8', // Blanco hielo
  },

  // ============ COLORES DE GAMIFICACION ============
  gamification: {
    gold: '#F2C14E', // Oro suave - Wallet, Rank 1, PB
    goldMetallic: '#E7B43C', // Oro metalico alternativo
    alertOrange: '#FF9A3C', // Naranja alerta
    success: '#3FC380', // Verde de exito
    warning: '#F6C453', // Amarillo de advertencia
  },

  // ============ COLORES DE TEXTO ============
  text: {
    primary: '#F4F6F8', // Blanco humo
    secondary: '#B0B7C2', // Gris frio
    tertiary: '#6E7784', // Gris grafito
    inverse: '#101316', // Inverso para texto sobre fondos claros
  },

  // ============ COLORES ESPECIALES ============
  special: {
    purpleGradient: '#6C63FF', // Indigo electrico
    pinkGradient: '#FF6B9A', // Rosa magenta
    error: '#E94B4B', // Rojo para errores
    success: '#26C281', // Verde para exito
  },

  // ============ TRANSPARENCIAS Y OVERLAYS ============
  overlay: {
    light: 'rgba(255, 255, 255, 0.05)', // Overlay blanco suave
    medium: 'rgba(255, 255, 255, 0.12)', // Overlay blanco medio
    dark: 'rgba(0, 0, 0, 0.35)', // Overlay oscuro
    glowCyan: 'rgba(56, 232, 255, 0.12)', // Glow cian suave
    glowTeal: 'rgba(44, 243, 200, 0.12)', // Glow teal suave
  },

  // ============ GRADIENTES ============
  gradients: {
    aiPowerful: 'linear-gradient(135deg, #6C63FF 0%, #FF6B9A 100%)',
    neonFlow: 'linear-gradient(90deg, #38E8FF 0%, #2CF3C8 100%)',
    goldMetal: 'linear-gradient(135deg, #F2C14E 0%, #E7B43C 100%)',
    darkVignette: 'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 100%)',
  },
};

// Tipo para acceso a colores
export type ColorKey = keyof typeof COLORS;
