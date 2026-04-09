/**
 * OLIMPIA ARENA - Pantalla Arena
 * Zona principal donde los usuarios compiten en desafíos de Rubik
 * Con subnav para Rubik, Learning
 */

import React, { useEffect, useState } from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import type { ArenaEvent } from '@/models/arena/types';
import { getArenaEvents } from '@/services/arenaService';
import { RubikArenaView } from './RubikArenaView';
import { LearningView } from './LearningView';

type ArenaSubSection = 'events' | 'rubik' | 'learning';

export const ArenaView: React.FC = () => {
  const [events, setEvents] = useState<ArenaEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSubSection, setActiveSubSection] = useState<ArenaSubSection>('events');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getArenaEvents();
        setEvents(data);
      } catch (err) {
        setError('No se pudo cargar la arena');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const subNavItems: Array<{ id: ArenaSubSection; label: string }> = [
    { id: 'events', label: 'Eventos' },
    { id: 'rubik', label: 'Cubo' },
    { id: 'learning', label: 'Aprende' },
  ];

  const containerStyles: React.CSSProperties = {
    padding: '24px 16px 120px',
    backgroundColor: COLORS.background.abyss,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  };

  const subNavStyles: React.CSSProperties = {
    display: 'flex',
    gap: DESIGN_CONSTANTS.spacing.md,
    marginBottom: DESIGN_CONSTANTS.spacing.lg,
    paddingBottom: DESIGN_CONSTANTS.spacing.md,
    borderBottom: DESIGN_CONSTANTS.neoBorders.cyanThin,
    overflowX: 'auto',
  };

  const subNavItemStyles = (isActive: boolean): React.CSSProperties => ({
    padding: `${DESIGN_CONSTANTS.spacing.sm} ${DESIGN_CONSTANTS.spacing.md}`,
    fontSize: '14px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    border: 'none',
    background: 'transparent',
    color: isActive ? COLORS.neon.cyan : COLORS.text.secondary,
    cursor: 'pointer',
    transition: DESIGN_CONSTANTS.transitions.smooth,
    whiteSpace: 'nowrap',
    boxShadow: isActive ? `inset 0 -3px 0 ${COLORS.neon.cyan}` : 'none',
  });

  const titleStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h1,
    color: COLORS.neon.cyan,
    textShadow: `0 0 16px ${COLORS.neon.cyan}`,
    marginBottom: '24px',
    margin: 0,
  };

  const summaryGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: DESIGN_CONSTANTS.spacing.md,
    marginBottom: DESIGN_CONSTANTS.spacing.lg,
  };

  const summaryCardStyles: React.CSSProperties = {
    padding: DESIGN_CONSTANTS.spacing.md,
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    backgroundColor: COLORS.background.night,
    border: DESIGN_CONSTANTS.neoBorders.cyanThin,
    boxShadow: DESIGN_CONSTANTS.shadows.innerDepth,
  };

  const summaryLabelStyles: React.CSSProperties = {
    ...TYPOGRAPHY.label.sm,
    color: COLORS.text.secondary,
  };

  const summaryValueStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h3,
    color: COLORS.neon.cyan,
    margin: 0,
    marginTop: '8px',
  };

  const eventListStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: DESIGN_CONSTANTS.spacing.md,
  };

  const eventCardStyles: React.CSSProperties = {
    padding: DESIGN_CONSTANTS.spacing.lg,
    borderRadius: DESIGN_CONSTANTS.borderRadius.lg,
    backgroundColor: COLORS.background.night,
    border: DESIGN_CONSTANTS.neoBorders.cyanThin,
    display: 'flex',
    flexDirection: 'column',
    gap: DESIGN_CONSTANTS.spacing.md,
  };

  const renderSubSection = () => {
    switch (activeSubSection) {
      case 'rubik':
        return <RubikArenaView />;
      case 'learning':
        return <LearningView />;
      case 'events':
      default:
        return (
          <>
            <h1 style={titleStyles}>ARENA DE COMBATE</h1>

            <div style={summaryGridStyles}>
              <div style={summaryCardStyles}>
                <div style={summaryLabelStyles}>Eventos activos</div>
                <h3 style={summaryValueStyles}>
                  {events.filter((event) => event.status === 'open').length}
                </h3>
              </div>
              <div style={summaryCardStyles}>
                <div style={summaryLabelStyles}>Próximos combates</div>
                <h3 style={summaryValueStyles}>
                  {events.filter((event) => event.status === 'upcoming').length}
                </h3>
              </div>
              <div style={summaryCardStyles}>
                <div style={summaryLabelStyles}>Recompensa promedio</div>
                <h3 style={summaryValueStyles}>
                  {events.length === 0
                    ? '0'
                    : Math.round(
                        events.reduce((sum, event) => sum + event.rewardCoins, 0) / events.length
                      )}
                </h3>
              </div>
            </div>

            {loading ? (
              <div style={{ ...TYPOGRAPHY.body.md, color: COLORS.text.secondary }}>
                Cargando arena...
              </div>
            ) : error ? (
              <div style={{ ...TYPOGRAPHY.body.md, color: COLORS.gamification.alertOrange }}>
                {error}
              </div>
            ) : (
              <div style={eventListStyles}>
                {events.map((event) => (
                  <div key={event.id} style={eventCardStyles}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: DESIGN_CONSTANTS.spacing.md,
                      }}
                    >
                      <h3 style={{ ...TYPOGRAPHY.heading.h4, color: COLORS.text.primary, margin: 0 }}>
                        {event.title}
                      </h3>
                      <span
                        style={{
                          ...TYPOGRAPHY.label.sm,
                          color:
                            event.status === 'open'
                              ? COLORS.neon.teal
                              : COLORS.gamification.alertOrange,
                          border: `1px solid ${
                            event.status === 'open'
                              ? COLORS.neon.teal
                              : COLORS.gamification.alertOrange
                          }`,
                          borderRadius: DESIGN_CONSTANTS.borderRadius.full,
                          padding: '4px 10px',
                        }}
                      >
                        {event.status.toUpperCase()}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                        gap: DESIGN_CONSTANTS.spacing.sm,
                        color: COLORS.text.secondary,
                        ...TYPOGRAPHY.body.sm,
                      }}
                    >
                      <span>Modo: {event.mode}</span>
                      <span>
                        Inicio:{' '}
                        {new Date(event.startsAt).toLocaleString('es-MX', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span>Entrada: {event.entryCost} Ⓜ️</span>
                      <span>Recompensa: {event.rewardCoins} Ⓜ️</span>
                      <span>Dificultad: {event.difficulty.toUpperCase()}</span>
                      <span>
                        Cupo: {event.participants}/{event.maxParticipants}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        style={{
                          padding: '10px 16px',
                          borderRadius: DESIGN_CONSTANTS.borderRadius.md,
                          border: 'none',
                          cursor:
                            event.status !== 'open'
                              ? 'not-allowed'
                              : 'pointer',
                          backgroundColor:
                            event.status !== 'open'
                              ? COLORS.background.abyss
                              : COLORS.neon.cyan,
                          color:
                            event.status !== 'open'
                              ? COLORS.text.secondary
                              : COLORS.background.abyss,
                          fontWeight: 600,
                          boxShadow:
                            event.status !== 'open'
                              ? 'none'
                              : DESIGN_CONSTANTS.shadows.glowCyanSmall,
                        }}
                        disabled={event.status !== 'open'}
                      >
                        {event.status === 'open' ? 'Entrar al combate' : 'Proximamente'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div style={containerStyles}>
      <div style={subNavStyles}>
        {subNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSubSection(item.id)}
            style={subNavItemStyles(activeSubSection === item.id)}
            aria-label={item.label}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ paddingBottom: '100px' }}>
        {renderSubSection()}
      </div>
    </div>
  );
};
