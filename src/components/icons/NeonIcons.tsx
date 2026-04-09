/**
 * OLIMPIA ARENA - Iconos Neón (Wireframe Style)
 * Iconografía de la barra de navegación con estética de líneas de neón
 */

import React from 'react';
import { COLORS } from '@/theme';

interface IconProps {
  size?: number;
  color?: string;
  active?: boolean;
}

/**
 * Icono Arena - Cubo Isométrico Wireframe
 */
export const ArenaIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = COLORS.neon.cyan,
  active = false 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? color : COLORS.text.secondary}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: 'all 150ms ease-in-out',
        filter: active ? `drop-shadow(0 0 8px ${color})` : 'none',
      }}
    >
      {/* Cubo Isométrico - Outline */}
      <path d="M12 2 L22 7 L22 17 L12 22 L2 17 L2 7 Z" />
      {/* Líneas internas */}
      <path d="M12 2 L12 22" />
      <path d="M2 7 L12 12 L22 7" />
      <path d="M2 17 L12 12 L22 17" />
    </svg>
  );
};

/**
 * Icono Perfil - Cerebro Neural
 */
export const ProfileIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = COLORS.neon.cyan,
  active = false 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? color : COLORS.text.secondary}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: 'all 150ms ease-in-out',
        filter: active ? `drop-shadow(0 0 8px ${color})` : 'none',
      }}
    >
      {/* Cabeza */}
      <circle cx="12" cy="7" r="5" />
      {/* Cuello */}
      <path d="M12 12 L10 14 L14 14 Z" />
      {/* Ondas cerebrales - Líneas curvas simplificadas */}
      <path d="M8 6 Q6 6 6 8" />
      <path d="M16 6 Q18 6 18 8" />
      <path d="M7 5 Q5 5 5 7" />
      <path d="M17 5 Q19 5 19 7" />
      {/* Centro neural */}
      <circle cx="12" cy="7" r="1.5" fill={active ? color : COLORS.text.secondary} />
    </svg>
  );
};

/**
 * Icono Mercado - Bolsa de Compra con Sparkle
 */
export const MarketIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = COLORS.neon.cyan,
  active = false 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? color : COLORS.text.secondary}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: 'all 150ms ease-in-out',
        filter: active ? `drop-shadow(0 0 8px ${color})` : 'none',
      }}
    >
      {/* Bolsa */}
      <path d="M7 9 L6 14 C6 15 7 16 8 16 L16 16 C17 16 18 15 18 14 L17 9" />
      {/* Asas */}
      <path d="M7 9 L8 5 C8 4 9 3 10 3 L14 3 C15 3 16 4 16 5 L17 9" />
      {/* Brillo neón lateral */}
      <path d="M9 9 L9 14" strokeWidth="1" opacity="0.6" />
      {/* Sparkles */}
      <circle cx="20" cy="5" r="1" fill={active ? color : COLORS.text.secondary} />
      <circle cx="4" cy="6" r="0.8" fill={active ? color : COLORS.text.secondary} />
    </svg>
  );
};

/**
 * Icono Ranking - Podio con Cubos
 */
export const RankingIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = COLORS.neon.cyan,
  active = false 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? color : COLORS.text.secondary}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: 'all 150ms ease-in-out',
        filter: active ? `drop-shadow(0 0 8px ${color})` : 'none',
      }}
    >
      {/* Podio - Cubo central (1er lugar) - más alto */}
      <rect x="10" y="8" width="4" height="8" />
      {/* Cubo izquierdo (2do lugar) - más bajo */}
      <rect x="5" y="12" width="3" height="4" />
      {/* Cubo derecho (3er lugar) - más bajo */}
      <rect x="16" y="12" width="3" height="4" />
      {/* Líneas de perspectiva */}
      <path d="M10 8 L9 6" strokeWidth="1" />
      <path d="M14 8 L15 6" strokeWidth="1" />
    </svg>
  );
};

/**
 * Icono Rubik - Cubo con divisiones
 */
export const RubikIcon: React.FC<IconProps> = ({
  size = 24,
  color = COLORS.neon.cyan,
  active = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? color : COLORS.text.secondary}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: 'all 150ms ease-in-out',
        filter: active ? `drop-shadow(0 0 8px ${color})` : 'none',
      }}
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M4 9 H20" />
      <path d="M4 15 H20" />
      <path d="M9 4 V20" />
      <path d="M15 4 V20" />
    </svg>
  );
};

/**
 * Icono Aprendizaje - Libro abierto con lineas neón
 */
export const LearningIcon: React.FC<IconProps> = ({
  size = 24,
  color = COLORS.neon.cyan,
  active = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? color : COLORS.text.secondary}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: 'all 150ms ease-in-out',
        filter: active ? `drop-shadow(0 0 8px ${color})` : 'none',
      }}
    >
      <path d="M4 5.5 C4 4.1 5.1 3 6.5 3 H12 V20 H6.5 C5.1 20 4 18.9 4 17.5 Z" />
      <path d="M20 5.5 C20 4.1 18.9 3 17.5 3 H12 V20 H17.5 C18.9 20 20 18.9 20 17.5 Z" />
      <path d="M8 7 H10" />
      <path d="M14 7 H16" />
      <path d="M8 10 H10" />
      <path d="M14 10 H16" />
    </svg>
  );
};

/**
 * Icono Arcade - Control retro
 */
export const ArcadeIcon: React.FC<IconProps> = ({
  size = 24,
  color = COLORS.neon.cyan,
  active = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? color : COLORS.text.secondary}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: 'all 150ms ease-in-out',
        filter: active ? `drop-shadow(0 0 8px ${color})` : 'none',
      }}
    >
      <rect x="4" y="8" width="16" height="8" rx="4" />
      <path d="M8 12 H11" />
      <path d="M9.5 10.5 V13.5" />
      <circle cx="16" cy="11" r="0.9" fill={active ? color : COLORS.text.secondary} />
      <circle cx="18" cy="13" r="0.9" fill={active ? color : COLORS.text.secondary} />
    </svg>
  );
};

/**
 * Icono Home - Insignia de Olimpia Arena
 */
export const HomeIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = COLORS.neon.cyan,
  active = false 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? color : COLORS.text.secondary}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: 'all 150ms ease-in-out',
        filter: active ? `drop-shadow(0 0 8px ${color})` : 'none',
      }}
    >
      {/* Casa simplificada */}
      <path d="M3 10 L12 3 L21 10" />
      <rect x="4" y="10" width="16" height="10" />
      {/* Ventana */}
      <rect x="8" y="13" width="3" height="3" />
      <rect x="13" y="13" width="3" height="3" />
      {/* Puerta */}
      <path d="M11 20 L11 16 L13 16 L13 20" />
    </svg>
  );
};
