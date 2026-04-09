import { doc, getDoc } from 'firebase/firestore';
import type { UserProfile } from '@/models/profile/types';
import mockProfileData from '@/data/mockProfile.json';
import { APP_CONFIG } from './appConfig';
import { getFirestoreDb } from './firebaseClient';
import { shouldUseMocks } from './mockMode';

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
    username: String(raw.username ?? 'Jugador'),
    displayName: String(raw.displayName ?? raw.username ?? 'Jugador'),
    avatarUrl: String(raw.avatarUrl ?? ''),
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

export const getUserProfile = async (
  userId: string = APP_CONFIG.defaultUserId
): Promise<UserProfile> => {
  const fallbackProfile = normalizeProfile((mockProfileData as any).profile);

  if (shouldUseMocks()) {
    return fallbackProfile;
  }

  const db = getFirestoreDb();
  if (!db) {
    return fallbackProfile;
  }

  const snapshot = await getDoc(doc(db, 'users', userId));
  if (!snapshot.exists()) {
    return fallbackProfile;
  }

  return normalizeProfile({ id: snapshot.id, ...snapshot.data() });
};
