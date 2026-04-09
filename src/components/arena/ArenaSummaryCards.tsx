import React from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import type { ArenaEvent } from '@/models/arena/types';
import './ArenaSummaryCards.css';

interface ArenaSummaryCardsProps {
  events: ArenaEvent[];
}

export const ArenaSummaryCards: React.FC<ArenaSummaryCardsProps> = ({ events }) => {
  const activeCount = events.filter((event) => event.status === 'open').length;
  const upcomingCount = events.filter((event) => event.status === 'upcoming').length;
  const avgReward =
    events.length === 0
      ? 0
      : Math.round(
          events.reduce((sum, event) => sum + event.rewardCoins, 0) / events.length
        );

  const stats = [
    { label: 'Eventos activos', value: activeCount },
    { label: 'Próximos combates', value: upcomingCount },
    { label: 'Recompensa promedio', value: avgReward },
  ];

  return (
    <div className="arena-summary-cards">
      {stats.map((stat, idx) => (
        <div key={idx} className="arena-summary-card">
          <div className="arena-summary-label">{stat.label}</div>
          <div className="arena-summary-value">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};
