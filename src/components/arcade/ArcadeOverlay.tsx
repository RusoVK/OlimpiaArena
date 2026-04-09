/**
 * ARCADE - Overlay Component
 * Fondo oscuro con blur cuando hay modales activos
 */

import React from 'react';
import { DESIGN_CONSTANTS } from '@/theme';

interface ArcadeOverlayProps {
  isVisible: boolean;
  onClick?: () => void;
}

export const ArcadeOverlay: React.FC<ArcadeOverlayProps> = ({ isVisible, onClick }) => {
  if (!isVisible) return null;

  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    backdropFilter: 'none',
    WebkitBackdropFilter: 'none',
    zIndex: DESIGN_CONSTANTS.zIndex.dropdown,
    cursor: 'pointer',
    animation: 'fadeIn 0.3s ease-in-out',
    pointerEvents: 'auto',
  };

  const keyframesStyle = `
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `;

  return (
    <>
      <style>{keyframesStyle}</style>
      <div style={overlayStyles} onClick={onClick} />
    </>
  );
};
