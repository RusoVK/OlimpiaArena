/**
 * OLIMPIA ARENA - Pantalla Arena
 * Zona principal donde los usuarios compiten en desafíos de Rubik
 * Con subnav para Rubik, Learning y Ranking
 */

import React, { useEffect, useState } from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import type { ArenaEvent } from '@/models/arena/types';
import { getArenaEvents } from '@/services/arenaService';
import { ViewContainer, ViewTitle } from '@/components/shared';
import { ArenaSummaryCards, ArenaEventCard } from '@/components/arena';
import { RubikArenaView } from './RubikArenaView';
import { LearningView } from './LearningView';
import { RankingView } from './RankingView';

type ArenaSubSection = 'events' | 'rubik' | 'learning' | 'ranking';

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
    { id: 'ranking', label: 'Ranking' },
  ];

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

  const renderSubSection = () => {
    switch (activeSubSection) {
      case 'rubik':
        return <RubikArenaView />;
      case 'learning':
        return <LearningView />;
      case 'ranking':
        return <RankingView />;
      case 'events':
      default:
        return (
          <>
            <ViewTitle>ARENA DE COMBATE</ViewTitle>
            <ArenaSummaryCards events={events} />

            {loading ? (
              <div style={{ ...TYPOGRAPHY.body.md, color: COLORS.text.secondary }}>Cargando arena...</div>
            ) : error ? (
              <div style={{ ...TYPOGRAPHY.body.md, color: COLORS.gamification.alertOrange }}>{error}</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {events.map((event) => (
                  <ArenaEventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </>
        );
    }
  };

  return (
    <ViewContainer padding="lg">
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
    </ViewContainer>
  );
};
