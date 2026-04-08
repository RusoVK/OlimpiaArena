/**
 * OLIMPIA ARENA - Pantalla Arena
 * Zona principal donde los usuarios compiten en desafíos de Rubik
 */

import React, { useEffect, useState } from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import type { ArenaEvent } from '@/models/arena/types';
import { getArenaEvents } from '@/services/arenaService';

export const ArenaView: React.FC = () => {
  const [events, setEvents] = useState<ArenaEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const containerStyles: React.CSSProperties = {
    padding: '24px 16px 100px',
    backgroundColor: COLORS.background.abyss,
    minHeight: '100vh',
  };

  const titleStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h1,
    color: COLORS.neon.cyan,
    textShadow: `0 0 16px ${COLORS.neon.cyan}`,
    marginBottom: '24px',
  };

  const summaryStyles: React.CSSProperties = {
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
  };

  const listStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: DESIGN_CONSTANTS.spacing.md,
  };

  const cardStyles: React.CSSProperties = {
    padding: DESIGN_CONSTANTS.spacing.lg,
    borderRadius: DESIGN_CONSTANTS.borderRadius.lg,
    backgroundColor: COLORS.background.night,
    border: DESIGN_CONSTANTS.neoBorders.cyanThin,
    display: 'flex',
    flexDirection: 'column',
    gap: DESIGN_CONSTANTS.spacing.md,
  };

  const headerRowStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: DESIGN_CONSTANTS.spacing.md,
  };

  const eventTitleStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h4,
    color: COLORS.text.primary,
    margin: 0,
  };

  const tagStyles = (color: string): React.CSSProperties => ({
    ...TYPOGRAPHY.label.sm,
    color,
    border: `1px solid ${color}`,
    borderRadius: DESIGN_CONSTANTS.borderRadius.full,
    padding: '4px 10px',
  });

  const metaStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: DESIGN_CONSTANTS.spacing.sm,
    color: COLORS.text.secondary,
    ...TYPOGRAPHY.body.sm,
  };

  const buttonStyles = (disabled: boolean): React.CSSProperties => ({
    padding: '10px 16px',
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    backgroundColor: disabled ? COLORS.background.abyss : COLORS.neon.cyan,
    color: disabled ? COLORS.text.secondary : COLORS.background.abyss,
    fontWeight: 600,
    boxShadow: disabled ? 'none' : DESIGN_CONSTANTS.shadows.glowCyanSmall,
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('es-MX', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusColor = (status: ArenaEvent['status']) => {
    switch (status) {
      case 'open':
        return COLORS.neon.teal;
      case 'closed':
        return COLORS.gamification.alertOrange;
      default:
        return COLORS.text.secondary;
    }
  };

  return (
    <div style={containerStyles}>
      <h1 style={titleStyles}>ARENA DE COMBATE</h1>

      <div style={summaryStyles}>
        <div style={summaryCardStyles}>
          <div style={summaryLabelStyles}>Eventos activos</div>
          <h3 style={summaryValueStyles}>{events.filter((event) => event.status === 'open').length}</h3>
        </div>
        <div style={summaryCardStyles}>
          <div style={summaryLabelStyles}>Proximos combates</div>
          <h3 style={summaryValueStyles}>{events.filter((event) => event.status === 'upcoming').length}</h3>
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
        <div style={{ ...TYPOGRAPHY.body.md, color: COLORS.text.secondary }}>Cargando arena...</div>
      ) : error ? (
        <div style={{ ...TYPOGRAPHY.body.md, color: COLORS.gamification.alertOrange }}>{error}</div>
      ) : (
        <div style={listStyles}>
          {events.map((event) => (
            <div key={event.id} style={cardStyles}>
              <div style={headerRowStyles}>
                <h3 style={eventTitleStyles}>{event.title}</h3>
                <span style={tagStyles(statusColor(event.status))}>{event.status.toUpperCase()}</span>
              </div>

              <div style={metaStyles}>
                <span>Modo: {event.mode}</span>
                <span>Inicio: {formatDate(event.startsAt)}</span>
                <span>Entrada: {event.entryCost} Ⓜ️</span>
                <span>Recompensa: {event.rewardCoins} Ⓜ️</span>
                <span>Dificultad: {event.difficulty.toUpperCase()}</span>
                <span>
                  Cupo: {event.participants}/{event.maxParticipants}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  style={buttonStyles(event.status !== 'open')}
                  disabled={event.status !== 'open'}
                >
                  {event.status === 'open' ? 'Entrar al combate' : 'Proximamente'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
