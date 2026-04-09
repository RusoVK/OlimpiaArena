import React from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import { PanelCard, StatsGrid } from '@/components/shared';
import type { UserProfile } from '@/models/profile/types';
import './ProfileStatsSection.css';

interface ProfileStatsSectionProps {
  profile: UserProfile;
}

export const ProfileStatsSection: React.FC<ProfileStatsSectionProps> = ({ profile }) => {
  const stats = [
    { label: 'Victorias', value: profile.stats.wins },
    { label: 'Derrotas', value: profile.stats.losses },
    { label: 'Mejor Tiempo', value: `${profile.stats.bestTimeSeconds}s` },
  ];

  return (
    <PanelCard title="Estadísticas de Arena">
      <StatsGrid stats={stats} columns={3} />
    </PanelCard>
  );
};
