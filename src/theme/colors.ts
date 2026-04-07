/**
 * IDENTIDAD VISUAL: Olimpia Arena - Retro-Futurismo Cognitivo
 * Paleta de Colores Dark UI + Neon-Neuron
 */

export const COLORS = {
  // ============ COLORES DE FONDO (Dark UI Base) ============
  background: {
    abyss: '#0f172a', // Azul Abismo - Fondo principal (Slate 950)
    night: '#1e293b', // Azul Noche - Paneles y tarjetas (Slate 900)
    deep: '#1a202c', // Azul Profundo - Alternativa más suave (Slate 800)
  },

  // ============ COLORES DE ACENTO Y ENERGÍA (Neon-Neuron) ============
  neon: {
    cyan: '#00FFFF', // Cian Neón - Color principal de marca, wireframe del cubo
    teal: '#00DACA', // Teal Aqua - Flujo de energía Toka, acentos secundarios
  },

  // ============ COLORES DEL CUBO (WCA Refinados para Dark UI) ============
  cube: {
    cyan: '#00FFFF', // Azul Cubo (mismo que neon.cyan)
    yellow: '#FBBF24', // Amarillo Sol
    red: '#EF4444', // Rojo Pasión
    orange: '#F97316', // Naranja Fuego
    green: '#10B981', // Verde Esmeralda
    white: '#F8FAF8', // Blanco Glaciar
  },

  // ============ COLORES DE GAMIFICACIÓN ============
  gamification: {
    gold: '#FFD700', // Oro Toka - Wallet, Rank 1, PB
    goldMetallic: '#FDB913', // Oro metálico alternativo
    alertOrange: '#FF8C00', // Naranja Alerta - Penalizaciones, racha
    success: '#10B981', // Verde de éxito
    warning: '#FBBF24', // Amarillo de advertencia
  },

  // ============ COLORES DE TEXTO ============
  text: {
    primary: '#F8FAF8', // Blanco principal para texto
    secondary: '#B4B4BA', // Gris para texto secundario
    tertiary: '#717177', // Gris más oscuro para deshabilitados
    inverse: '#0f172a', // Inverso para texto sobre fondos claros
  },

  // ============ COLORES ESPECIALES ============
  special: {
    purpleGradient: '#7C3AED', // Morado para gradientes IA
    pinkGradient: '#EC4899', // Rosa para gradientes IA
    error: '#DC2626', // Rojo para errores
    success: '#059669', // Verde para éxito
  },

  // ============ TRANSPARENCIAS Y OVERLAYS ============
  overlay: {
    light: 'rgba(255, 255, 255, 0.05)', // Overlay blanco muy suave
    medium: 'rgba(255, 255, 255, 0.1)', // Overlay blanco medio
    dark: 'rgba(0, 0, 0, 0.3)', // Overlay oscuro
    glowCyan: 'rgba(0, 255, 255, 0.1)', // Glow cian suave
    glowTeal: 'rgba(0, 218, 202, 0.1)', // Glow teal suave
  },

  // ============ GRADIENTES ============
  gradients: {
    aiPowerful: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)', // Purple to Pink
    neonFlow: 'linear-gradient(90deg, #00FFFF 0%, #00DACA 100%)', // Cyan to Teal
    goldMetal: 'linear-gradient(135deg, #FFD700 0%, #FDB913 100%)', // Oro metálico
    darkVignette: 'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)',
  },
};

// Tipo para acceso a colores
export type ColorKey = keyof typeof COLORS;
