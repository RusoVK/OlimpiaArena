import React from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import { PanelCard } from '@/components/shared';
import type { ArenaEvent } from '@/models/arena/types';
import './ArenaEventCard.css';

interface ArenaEventCardProps {
  event: ArenaEvent;
}

export const ArenaEventCard: React.FC<ArenaEventCardProps> = ({ event }) => {
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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('es-MX', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <PanelCard>
      <div className="arena-event-header">
        <h3 className="arena-event-title">{event.title}</h3>
        <span
          className="arena-event-status"
          style={{ borderColor: statusColor(event.status), color: statusColor(event.status) }}
        >
          {event.status.toUpperCase()}
        </span>
      </div>

      <div className="arena-event-meta">
        <span>Modo: {event.mode}</span>
        <span>Inicio: {formatDate(event.startsAt)}</span>
        <span>Entrada: {event.entryCost} Ⓜ️</span>
        <span>Recompensa: {event.rewardCoins} Ⓜ️</span>
        <span>Dificultad: {event.difficulty.toUpperCase()}</span>
        <span>
          Cupo: {event.participants}/{event.maxParticipants}
        </span>
      </div>

      <div className="arena-event-footer">
        <button
          className="arena-event-button"
          disabled={event.status !== 'open'}
        >
          {event.status === 'open' ? 'Entrar al combate' : 'Proximamente'}
        </button>
      </div>
    </PanelCard>
  );
};
