/**
 * OLIMPIA ARENA - Pantalla Perfil
 * Datos del usuario, estadísticas personales y logros
 * Con subnav para Mercado
 */

import React, { useEffect, useState } from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import type { UserProfile } from '@/models/profile/types';
import { getUserProfile } from '@/services/profileService';
import { ViewContainer, ViewTitle } from '@/components/shared';
import {
  ProfileHeader,
  ProfileStatsSection,
  AchievementGrid,
  AlipayConnectPanel,
} from '@/components/profile';
import { MarketView } from './MarketView';

type ProfileSubSection = 'profile' | 'market';

export const ProfileView: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSubSection, setActiveSubSection] = useState<ProfileSubSection>('profile');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const subNavItems: Array<{ id: ProfileSubSection; label: string }> = [
    { id: 'profile', label: 'Perfil' },
    { id: 'market', label: 'Mercado' },
  ];

  const subNavStyles: React.CSSProperties = {
    display: 'flex',
    gap: DESIGN_CONSTANTS.spacing.md,
    marginBottom: DESIGN_CONSTANTS.spacing.lg,
    paddingBottom: DESIGN_CONSTANTS.spacing.md,
    borderBottom: DESIGN_CONSTANTS.neoBorders.cyanThin,
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
    if (activeSubSection === 'market') {
      return <MarketView />;
    }

    return (
      <>
        <ViewTitle>MI PERFIL</ViewTitle>

        {loading ? (
          <div style={{ ...TYPOGRAPHY.body.md, color: COLORS.text.secondary }}>Cargando perfil...</div>
        ) : profile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: DESIGN_CONSTANTS.spacing.lg }}>
            <ProfileHeader profile={profile} />
            <ProfileStatsSection profile={profile} />
            <AchievementGrid profile={profile} />
            <AlipayConnectPanel />
          </div>
        ) : (
          <div style={{ ...TYPOGRAPHY.body.md, color: COLORS.text.secondary }}>Perfil no disponible.</div>
        )}
      </>
    );
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
