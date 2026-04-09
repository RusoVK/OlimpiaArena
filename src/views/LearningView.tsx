/**
 * OLIMPIA ARENA - Pantalla Aprendizaje
 * Guias y rutas para mejorar habilidades
 * Con tutorial de Rubik Speed 3x3
 */

import React, { useState } from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '../theme';
import { ViewContainer, ViewTitle } from '../components/shared';
import { LearningCard } from '../components/learning';

export const LearningView: React.FC = () => {
  const [expandedTutorial, setExpandedTutorial] = useState<string | null>(null);

  const rubikSpeedTutorial = {
    id: 'speed-3x3',
    title: 'Speed Run 3x3 - Tutorial Completo',
    sections: [
      {
        id: 'basico',
        title: '1. Conceptos Básicos',
        content: `El cubo Rubik 3x3 tiene 6 caras: Blanca, Amarilla, Roja, Naranja, Azul y Verde.
        
Cada face tiene 9 piezas (9 squares) - 1 center, 4 edges y 4 corners.

NOTACIÓN ESTÁNDAR:
• R - Right (Derecha clockwise)
• L - Left (Izquierda clockwise)
• U - Up (Arriba clockwise)
• D - Down (Abajo clockwise)
• F - Front (Frente clockwise)
• B - Back (Atrás clockwise)
• El apóstrofe (') indica rotación counter-clockwise
• El 2 indica doble rotación (180°)`,
      },
      {
        id: 'metodo',
        title: '2. Método Layer-by-Layer (Principiante)',
        content: `Este es el método más común para comenzar:

PASO 1: CRUZ BLANCA
- Coloca la cara blanca arriba
- Busca los 4 edges blancos
- Alinea cada edge blanco con su center respectivo
- Mueve hacia arriba para formar la cruz

PASO 2: ESQUINAS BLANCAS
- Usa el algoritmo R U R' U' repetidamente
- Posiciona cada esquina blanca en su lugar
- La cruz blanca debe quedar en la capa inferior

PASO 3: CAPA INTERMEDIA
- Ubica los 4 edges de en medio
- Usa el algoritmo: U R U' R' U' F' U F
- Repite para cada edge

PASO 4: CRUZ AMARILLA
- Forma una cruz amarilla en la cara superior
- Usa el algoritmo: F R U' R' U' R U R' F'

PASO 5: PERMUTA ESQUINAS
- Posiciona las esquinas amarillas correctamente
- Algoritmo: R U R' U R U2 R'

PASO 6: ORIENTAR ESQUINAS
- Gira las esquinas para completar el cubo
- Algoritmo: R U R' U' (repetir según sea necesario)`,
      },
      {
        id: 'mejora',
        title: '3. Técnicas para Mejorar tu Velocidad',
        content: `FINGER Tricks:
- Practica rotaciones suaves sin levantar mucho las manos
- Usa los dedos para hacer rotaciones rápidas
- Entrena la memoria muscular

LOOKAHEAD:
- Mientras resuelves un algoritmo, busca el siguiente movimiento
- Esto reduce el tiempo de pausa entre algoritmos

TECHNIQUES:
- Usa corner cutting (permitir ligeras rotaciones sin ser exacto)
- Practica en cubos fast-cubes con buen moibility
- Mantén un buen grip sin tensión excesiva

METAS POR NIVEL:
- Principiante: 2-3 minutos
- Intermedio: 1-2 minutos
- Avanzado: 30-60 segundos
- Elite: <30 segundos`,
      },
      {
        id: 'cfop',
        title: '4. Método CFOP (Avanzado)',
        content: `El método CFOP es el usado por los speedcubers profesionales:

CFOP = Fridrich Method

CROSS (8 segundos):
- Construye 4 edges alrededor de un center (blanco)
- Cero rotaciones del cubo

F2L (first 2 layers - 25 segundos):
- Emparea edges con sus esquinas
- Inserta 4 pares simultáneamente
- 41 casos posibles

OLL (orientación última capa - 15 segundos):
- Orienta todos los cubies de la última capa
- 57 algoritmos posibles
- La capa no queda permutada aún

PLL (permutación última capa - 12 segundos):
- Permuta los cubies para terminar el cubo
- 21 algoritmos posibles

VENTAJAS CFOP:
✓ Rápido de ejecutar
✓ Muchos cubos resueltos con este método
✓ Comunidad grande de speedcubers
✓ Muchos recursos y tutoriales disponibles`,
      },
      {
        id: 'practica',
        title: '5. Plan de Práctica Diaria',
        content: `SEMANA 1-2: FUNDAMENTALS
- 30 min: Aprende el método layer-by-layer
- 30 min: Resuelve el cubo 5 veces
- Objetivo: Resolver sin ayuda

SEMANA 3-4: VELOCIDAD
- 20 min: Practica finger tricks
- 20 min: Resuelve 10 cubos cronometrando
- 20 min: Analiza tus tiempos
- Objetivo: <2 minutos consistentemente

SEMANA 5-8: OPTIMIZACIÓN
- 15 min: Practica algoritmos
- 20 min: Resuelve 10+ cubos
- 15 min: Lookahead drills
- 10 min: Análisis y mejora
- Objetivo: <1 minuto

MENSUAL: COMPETENCIA
- Usa la Arena de OlimpiaArena
- Compite con otros jugadores
- Analiza estrategias ganadoras
- Identifica áreas de mejora`,
      },
      {
        id: 'tips',
        title: '6. Tips Finales',
        content: `⚡ RENDIMIENTO:
1. Mantén tu cubo limpio y lubricado
2. Usa cubos de calidad (no los baratos)
3. Practica con el mismo cubo para acostumbrarte
4. Toma descansos para evitar lesiones

🧠 MENTALIDAD:
1. La consistencia es más importante que la velocidad
2. Celebra pequeñas mejoras
3. Aprende de los errores
4. Mira tutoriales de speedcubers profesionales

📊 SEGUIMIENTO:
1. Mantén un diario de tus tiempos
2. Identifica tu bottleneck (qué fase es más lenta)
3. Practica más esa fase específicamente
4. Revisa tu progreso mensualmente

🎯 OBJETIVOS REALISTAS:
Mes 1: Aprender a resolver
Mes 2-3: Reducir tiempo bajo 2 minutos
Mes 4-6: Sub 1 minuto
Mes 7-12: Sub 30 segundos
+12 meses: Sub 20 segundos (elite)`,
      },
    ],
  };

  const tutorialContent = expandedTutorial === 'speed-3x3' ? rubikSpeedTutorial : null;

  if (tutorialContent) {
    return (
      <ViewContainer padding="lg">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: DESIGN_CONSTANTS.spacing.lg, gap: DESIGN_CONSTANTS.spacing.md }}>
          <button
            onClick={() => setExpandedTutorial(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: COLORS.neon.cyan,
              fontSize: '20px',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            ← VOLVER
          </button>
          <h1 style={{ ...TYPOGRAPHY.heading.h2, margin: 0 }}>
            {tutorialContent.title}
          </h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: DESIGN_CONSTANTS.spacing.lg, paddingBottom: '100px' }}>
          {tutorialContent.sections.map((section) => (
            <div
              key={section.id}
              style={{
                backgroundColor: '#1c222f',
                border: DESIGN_CONSTANTS.neoBorders.cyanThin,
                borderRadius: DESIGN_CONSTANTS.borderRadius.lg,
                padding: DESIGN_CONSTANTS.spacing.lg,
                boxShadow: DESIGN_CONSTANTS.shadows.innerDepth,
              }}
            >
              <h3
                style={{
                  ...TYPOGRAPHY.heading.h3,
                  margin: 0,
                  marginBottom: DESIGN_CONSTANTS.spacing.md,
                  color: COLORS.neon.cyan,
                }}
              >
                {section.title}
              </h3>
              <p
                style={{
                  ...TYPOGRAPHY.body.md,
                  color: COLORS.text.secondary,
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6',
                }}
              >
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </ViewContainer>
    );
  }

  return (
    <ViewContainer padding="lg">
      <ViewTitle>APRENDIZAJE</ViewTitle>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '100px' }}>
        <LearningCard
          badge="Ruta Rápida"
          badgeColor={COLORS.neon.teal}
          title="Speed Run 3x3"
          description="Domina los algoritmos base y baja tu tiempo por debajo de 45s. Incluye tutorial completo desde cero."
          onClick={() => setExpandedTutorial('speed-3x3')}
        />
        <LearningCard
          badge="Práctica"
          badgeColor={COLORS.neon.teal}
          title="Focus Mode"
          description="Ejercicios cortos de precisión y reconocimiento de patrones."
        />
        <LearningCard
          badge="Tips"
          badgeColor={COLORS.neon.teal}
          title="Preparación para Arena"
          description="Recomendaciones para competir con ventaja y ahorrar energía."
        />
      </div>
    </ViewContainer>
  );
};
