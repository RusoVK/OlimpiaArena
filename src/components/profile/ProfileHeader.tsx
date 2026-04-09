import React from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import { PanelCard, StatsGrid } from '@/components/shared';
import type { UserProfile } from '@/models/profile/types';
import './ProfileHeader.css';

interface ProfileHeaderProps {
  profile: UserProfile;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const stats = [
    { label: 'Nivel', value: profile.level },
    { label: 'Experiencia', value: `${profile.exp} XP` },
    { label: 'TokaCoins', value: `${profile.tokaCoins.toLocaleString()} Ⓜ️` },
    { label: 'Racha Actual', value: profile.stats.currentStreak },
  ];

  return (
    <PanelCard>
      <div className="profile-header">
        <img src={profile.avatarUrl} alt={profile.displayName} className="profile-avatar" />
        <div className="profile-info">
          <h2 style={{ ...TYPOGRAPHY.heading.h3, margin: 0 }}>{profile.displayName}</h2>
          <p style={{ ...TYPOGRAPHY.body.md, color: COLORS.text.secondary, margin: 0 }}>
            @{profile.username}
          </p>
        </div>
      </div>
      <div style={{ marginTop: DESIGN_CONSTANTS.spacing.lg }}>
        <StatsGrid stats={stats} columns={4} />
      </div>
    </PanelCard>
  );
};
