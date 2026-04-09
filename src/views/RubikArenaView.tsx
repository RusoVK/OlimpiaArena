/**
 * OLIMPIA ARENA - Pantalla Rubik
 * Entrenamiento con cubo 3D
 */

import React from 'react';
import { TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import { useRubikController } from '@/controllers/useRubikController';
import { ViewContainer } from '@/components/shared';
import RubikView from './RubikView';

export const RubikArenaView: React.FC = () => {
  const rubikController = useRubikController();

  return (
    <ViewContainer padding="lg">
      <div style={{ marginBottom: DESIGN_CONSTANTS.spacing.lg }}>
        <h1 style={{ ...TYPOGRAPHY.heading.h1, margin: 0, marginBottom: DESIGN_CONSTANTS.spacing.sm }}>
          CUBO RUBIK
        </h1>
        <p style={{ ...TYPOGRAPHY.body.md, color: '#96a0b3', margin: 0 }}>
          Arrastra/desliza para orbitar, scroll/tipina para zoom, botones para girar capas.
        </p>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: '460px',
          borderRadius: DESIGN_CONSTANTS.borderRadius.lg,
          overflow: 'hidden',
          border: DESIGN_CONSTANTS.neoBorders.cyanThin,
          backgroundColor: '#1c222f',
          boxShadow: DESIGN_CONSTANTS.shadows.innerDepth,
        }}
      >
        <RubikView {...rubikController} />
      </div>
    </ViewContainer>
  );
};
