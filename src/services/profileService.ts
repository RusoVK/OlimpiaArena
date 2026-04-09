import { doc, getDoc } from 'firebase/firestore';
import type { UserProfile } from '@/models/profile/types';
import mockProfileData from '@/data/mockProfile.json';
import { APP_CONFIG } from './appConfig';
import { getFirestoreDb } from './firebaseClient';
import { shouldUseMocks } from './mockMode';
import { getUserInfo } from './tokaApi';

const toDate = (value: unknown): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof (value as { toDate?: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate();
  }
  const parsed = new Date(value as string);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const normalizeProfile = (raw: any): UserProfile => {
  return {
    id: String(raw.id ?? ''),
    username: String(raw.username ?? raw.nickName ?? 'Jugador'),
    displayName: String(raw.displayName ?? raw.fullName ?? raw.username ?? raw.nickName ?? 'Jugador'),
    avatarUrl: String(raw.avatarUrl ?? raw.avatar ?? ''),
    level: Number(raw.level ?? 1),
    exp: Number(raw.exp ?? 0),
    tokaCoins: Number(raw.tokaCoins ?? 0),
    stats: {
      wins: Number(raw.stats?.wins ?? 0),
      losses: Number(raw.stats?.losses ?? 0),
      bestTimeSeconds: Number(raw.stats?.bestTimeSeconds ?? 0),
      currentStreak: Number(raw.stats?.currentStreak ?? 0),
    },
    achievements: Array.isArray(raw.achievements)
      ? raw.achievements.map((achievement: any) => ({
          id: String(achievement.id ?? ''),
          title: String(achievement.title ?? ''),
          description: String(achievement.description ?? ''),
          unlockedAt: toDate(achievement.unlockedAt),
        }))
      : [],
    lastActiveAt: toDate(raw.lastActiveAt),
  };
};

/**
 * Obtiene el perfil del usuario intentando múltiples fuentes en orden de preferencia:
 * 1. API Toka (si está configurada y hay token disponible en localStorage)
 * 2. Firebase Firestore
 * 3. Datos mock como fallback
 */
export const getUserProfile = async (
  userId: string = APP_CONFIG.defaultUserId
): Promise<UserProfile> => {
  const fallbackProfile = normalizeProfile((mockProfileData as any).profile);

  // Intenta API Toka primero si está configurada
  if (APP_CONFIG.tokaBaseUrl.length > 0) {
    try {
      // Obtiene el token guardado en localStorage
      const sessionStr = localStorage.getItem('alipay_session');
      if (sessionStr) {
        const session = JSON.parse(sessionStr) as { accessToken?: string; expiresAt?: number };
        
        // Verifica que el token no esté expirado
        if (session.accessToken && session.expiresAt && Date.now() < session.expiresAt) {
          const result = await getUserInfo([], session.accessToken);
          if (result.success && result.data) {
            console.log('[ProfileService] Usando datos de API Toka');
            return normalizeProfile(result.data);
          }
        }
      }
    } catch (error) {
      console.warn('[ProfileService] Error al obtener datos de API Toka, intentando fallback', error);
    }
  }

  if (shouldUseMocks()) {
    console.log('[ProfileService] Usando datos mock');
    return fallbackProfile;
  }

  // Intenta Firebase si está configurado
  const db = getFirestoreDb();
  if (db) {
    try {
      const snapshot = await getDoc(doc(db, 'users', userId));
      if (snapshot.exists()) {
        console.log('[ProfileService] Usando datos de Firebase');
        return normalizeProfile({ id: snapshot.id, ...snapshot.data() });
      }
    } catch (error) {
      console.warn('[ProfileService] Error al obtener datos de Firebase', error);
    }
  }

  console.log('[ProfileService] Usando fallback/mock');
  return fallbackProfile;
};
