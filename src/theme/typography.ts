/**
 * IDENTIDAD VISUAL: Olimpia Arena - Tipografía
 * Inter (UI) + JetBrains Mono (Datos competitivos)
 */

export const TYPOGRAPHY = {
  // ============ FAMILIA DE FUENTES ============
  families: {
    ui: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Courier New', monospace",
  },

  // ============ ESTILOS DE TÍTULOS (Inter - Black / ExtraBold) ============
  heading: {
    h1: {
      fontSize: '32px',
      fontWeight: 800,
      fontFamily: "'Inter', sans-serif",
      lineHeight: '1.2',
      letterSpacing: '-0.5px',
    },
    h2: {
      fontSize: '28px',
      fontWeight: 800,
      fontFamily: "'Inter', sans-serif",
      lineHeight: '1.3',
      letterSpacing: '-0.3px',
    },
    h3: {
      fontSize: '24px',
      fontWeight: 700,
      fontFamily: "'Inter', sans-serif",
      lineHeight: '1.4',
      letterSpacing: '-0.2px',
    },
    h4: {
      fontSize: '20px',
      fontWeight: 700,
      fontFamily: "'Inter', sans-serif",
      lineHeight: '1.5',
    },
    h5: {
      fontSize: '18px',
      fontWeight: 600,
      fontFamily: "'Inter', sans-serif",
      lineHeight: '1.5',
    },
  },

  // ============ ESTILOS DE CUERPO (Inter - Semibold / Medium) ============
  body: {
    lg: {
      fontSize: '16px',
      fontWeight: 500,
      fontFamily: "'Inter', sans-serif",
      lineHeight: '1.6',
    },
    md: {
      fontSize: '14px',
      fontWeight: 500,
      fontFamily: "'Inter', sans-serif",
      lineHeight: '1.6',
    },
    sm: {
      fontSize: '12px',
      fontWeight: 500,
      fontFamily: "'Inter', sans-serif",
      lineHeight: '1.5',
    },
    xs: {
      fontSize: '11px',
      fontWeight: 500,
      fontFamily: "'Inter', sans-serif",
      lineHeight: '1.4',
    },
  },

  // ============ ESTILOS DE DATOS COMPETITIVOS (JetBrains Mono) ============
  mono: {
    lg: {
      fontSize: '16px',
      fontWeight: 600,
      fontFamily: "'JetBrains Mono', monospace",
      lineHeight: '1.6',
      letterSpacing: '0.5px',
    },
    md: {
      fontSize: '14px',
      fontWeight: 600,
      fontFamily: "'JetBrains Mono', monospace",
      lineHeight: '1.6',
      letterSpacing: '0.3px',
    },
    sm: {
      fontSize: '12px',
      fontWeight: 600,
      fontFamily: "'JetBrains Mono', monospace",
      lineHeight: '1.5',
      letterSpacing: '0.2px',
    },
    xs: {
      fontSize: '10px',
      fontWeight: 600,
      fontFamily: "'JetBrains Mono', monospace",
      lineHeight: '1.4',
      letterSpacing: '0.1px',
    },
  },

  // ============ ESTILOS DE ETIQUETAS Y BADGES ============
  label: {
    lg: {
      fontSize: '14px',
      fontWeight: 600,
      fontFamily: "'Inter', sans-serif",
      lineHeight: '1.4',
      textTransform: 'uppercase' as const,
      letterSpacing: '1px',
    },
    md: {
      fontSize: '12px',
      fontWeight: 600,
      fontFamily: "'Inter', sans-serif",
      lineHeight: '1.4',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.8px',
    },
    sm: {
      fontSize: '10px',
      fontWeight: 700,
      fontFamily: "'Inter', sans-serif",
      lineHeight: '1.3',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.6px',
    },
  },

  // ============ CRONÓMETRO PRINCIPAL (JetBrains Mono Giant) ============
  timer: {
    main: {
      fontSize: '48px',
      fontWeight: 700,
      fontFamily: "'JetBrains Mono', monospace",
      lineHeight: '1.2',
      letterSpacing: '2px',
    },
    secondary: {
      fontSize: '32px',
      fontWeight: 700,
      fontFamily: "'JetBrains Mono', monospace",
      lineHeight: '1.2',
      letterSpacing: '1px',
    },
  },

  // ============ SLOGAN TÉCNICO ============
  tagline: {
    fontSize: '11px',
    fontWeight: 500,
    fontFamily: "'JetBrains Mono', monospace",
    lineHeight: '1.4',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  },
};

export type TypographyStyle = Record<string, any>;
