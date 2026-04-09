import React from 'react';
import { COLORS, TYPOGRAPHY } from '@/theme';
import { PanelCard } from '@/components/shared';
import type { UserProfile } from '@/models/profile/types';
import './AchievementGrid.css';

interface AchievementGridProps {
  profile: UserProfile;
}

export const AchievementGrid: React.FC<AchievementGridProps> = ({ profile }) => {
  return (
    <PanelCard title="Logros">
      <div className="achievement-grid">
        {profile.achievements.map((achievement) => (
          <div key={achievement.id} className="achievement-card">
            <div style={{ ...TYPOGRAPHY.body.md, fontWeight: 600 }}>{achievement.title}</div>
            <div style={{ ...TYPOGRAPHY.body.sm, color: COLORS.text.secondary }}>
              {achievement.description}
            </div>
          </div>
        ))}
      </div>
    </PanelCard>
  );
};
