/**
 * OLIMPIA ARENA - Pantalla Perfil
 * Datos del usuario, estadísticas personales y logros
 */

import React, { useEffect, useState } from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import type { UserProfile } from '@/models/profile/types';
import { getUserProfile } from '@/services/profileService';
import { authenticateUser } from '@/services/tokaApi';
import { loadAlipayBridge, requestAuthCode } from '@/services/alipayBridge';

export const ProfileView: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

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

  const cardStyles: React.CSSProperties = {
    padding: DESIGN_CONSTANTS.spacing.lg,
    backgroundColor: COLORS.background.night,
    borderRadius: DESIGN_CONSTANTS.borderRadius.lg,
    border: DESIGN_CONSTANTS.neoBorders.cyanThin,
    boxShadow: DESIGN_CONSTANTS.shadows.innerDepth,
  };

  const rowStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: DESIGN_CONSTANTS.spacing.lg,
    flexWrap: 'wrap',
  };

  const avatarStyles: React.CSSProperties = {
    width: '96px',
    height: '96px',
    borderRadius: DESIGN_CONSTANTS.borderRadius.full,
    border: `2px solid ${COLORS.neon.cyan}`,
    objectFit: 'cover',
  };

  const labelStyles: React.CSSProperties = {
    ...TYPOGRAPHY.label.sm,
    color: COLORS.text.secondary,
  };

  const valueStyles: React.CSSProperties = {
    ...TYPOGRAPHY.mono.lg,
    color: COLORS.neon.cyan,
  };

  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: DESIGN_CONSTANTS.spacing.md,
    marginTop: DESIGN_CONSTANTS.spacing.md,
  };

  const achievementStyles: React.CSSProperties = {
    padding: DESIGN_CONSTANTS.spacing.md,
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    backgroundColor: COLORS.background.abyss,
    border: DESIGN_CONSTANTS.neoBorders.cyanThin,
  };

  const buttonStyles: React.CSSProperties = {
    padding: '10px 16px',
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    border: 'none',
    backgroundColor: COLORS.neon.cyan,
    color: COLORS.background.abyss,
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: DESIGN_CONSTANTS.shadows.glowCyanSmall,
  };

  const handleConnect = async () => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      await loadAlipayBridge();
      const result = await requestAuthCode(
        'DigitalIdentity',
        ['USER_ID', 'USER_AVATAR', 'USER_NICKNAME'],
        'Usaremos esta informacion para tu perfil dentro de Olimpia Arena.'
      );

      if (!result.success || !result.authCode) {
        setAuthError(result.error || 'No se pudo obtener authCode');
        return;
      }

      setAuthCode(result.authCode);
      const tokenResponse = await authenticateUser(result.authCode);
      if (tokenResponse.success) {
        setAuthToken(tokenResponse.data.accessToken);
      } else {
        setAuthError(tokenResponse.message || 'No se pudo autenticar');
      }
    } catch (error) {
      setAuthError(String(error));
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div style={containerStyles}>
      <h1 style={titleStyles}>MI PERFIL</h1>

      {loading ? (
        <div style={{ ...TYPOGRAPHY.body.md, color: COLORS.text.secondary }}>Cargando perfil...</div>
      ) : profile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: DESIGN_CONSTANTS.spacing.lg }}>
          <div style={cardStyles}>
            <div style={rowStyles}>
              <img src={profile.avatarUrl} alt={profile.displayName} style={avatarStyles} />
              <div>
                <h2 style={{ ...TYPOGRAPHY.heading.h3, margin: 0 }}>{profile.displayName}</h2>
                <p style={{ ...TYPOGRAPHY.body.md, color: COLORS.text.secondary, margin: 0 }}>
                  @{profile.username}
                </p>
              </div>
            </div>

            <div style={gridStyles}>
              <div>
                <div style={labelStyles}>Nivel</div>
                <div style={valueStyles}>{profile.level}</div>
              </div>
              <div>
                <div style={labelStyles}>Experiencia</div>
                <div style={valueStyles}>{profile.exp} XP</div>
              </div>
              <div>
                <div style={labelStyles}>TokaCoins</div>
                <div style={valueStyles}>{profile.tokaCoins.toLocaleString()} Ⓜ️</div>
              </div>
              <div>
                <div style={labelStyles}>Racha actual</div>
                <div style={valueStyles}>{profile.stats.currentStreak}</div>
              </div>
            </div>
          </div>

          <div style={cardStyles}>
            <h3 style={{ ...TYPOGRAPHY.heading.h4, margin: 0 }}>Estadisticas de Arena</h3>
            <div style={gridStyles}>
              <div>
                <div style={labelStyles}>Victorias</div>
                <div style={valueStyles}>{profile.stats.wins}</div>
              </div>
              <div>
                <div style={labelStyles}>Derrotas</div>
                <div style={valueStyles}>{profile.stats.losses}</div>
              </div>
              <div>
                <div style={labelStyles}>Mejor tiempo</div>
                <div style={valueStyles}>{profile.stats.bestTimeSeconds}s</div>
              </div>
            </div>
          </div>

          <div style={cardStyles}>
            <h3 style={{ ...TYPOGRAPHY.heading.h4, margin: 0 }}>Logros</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: DESIGN_CONSTANTS.spacing.md, marginTop: DESIGN_CONSTANTS.spacing.md }}>
              {profile.achievements.map((achievement) => (
                <div key={achievement.id} style={achievementStyles}>
                  <div style={{ ...TYPOGRAPHY.body.md, fontWeight: 600 }}>{achievement.title}</div>
                  <div style={{ ...TYPOGRAPHY.body.sm, color: COLORS.text.secondary }}>
                    {achievement.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={cardStyles}>
            <h3 style={{ ...TYPOGRAPHY.heading.h4, margin: 0 }}>Conexion con Alipay</h3>
            <p style={{ ...TYPOGRAPHY.body.sm, color: COLORS.text.secondary }}>
              Obtiene el authCode para autenticacion dentro del ecosistema de la super app.
            </p>
            <button style={buttonStyles} onClick={handleConnect} disabled={authLoading}>
              {authLoading ? 'Conectando...' : 'Conectar Alipay'}
            </button>
            {authCode && (
              <div style={{ marginTop: DESIGN_CONSTANTS.spacing.sm, color: COLORS.neon.cyan }}>
                AuthCode: {authCode}
              </div>
            )}
            {authToken && (
              <div style={{ marginTop: DESIGN_CONSTANTS.spacing.xs, color: COLORS.text.secondary }}>
                Token: {authToken.slice(0, 8)}...
              </div>
            )}
            {authError && (
              <div style={{ marginTop: DESIGN_CONSTANTS.spacing.xs, color: COLORS.gamification.alertOrange }}>
                {authError}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ ...TYPOGRAPHY.body.md, color: COLORS.text.secondary }}>Perfil no disponible.</div>
      )}
    </div>
  );
};
