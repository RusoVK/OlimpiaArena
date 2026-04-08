import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import type { RankingBoard, RankingEntry } from '@/models/ranking/types';
import mockRankingData from '@/data/mockRanking.json';
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

const normalizeEntry = (raw: any, index: number): RankingEntry => {
  return {
    userId: String(raw.userId ?? raw.id ?? ''),
    username: String(raw.username ?? 'Jugador'),
    avatarUrl: raw.avatarUrl ? String(raw.avatarUrl) : undefined,
    score: Number(raw.score ?? 0),
    rank: Number(raw.rank ?? index + 1),
    streak: Number(raw.streak ?? 0),
    country: raw.country ? String(raw.country) : undefined,
  };
};

export const getRankingBoard = async (): Promise<RankingBoard> => {
  const mockData = mockRankingData as any;
  const fallbackBoard: RankingBoard = {
    season: {
      id: String(mockData.season?.id ?? 'global'),
      name: String(mockData.season?.name ?? 'Ranking Global'),
      endsAt: toDate(mockData.season?.endsAt),
    },
    entries: Array.isArray(mockData.entries)
      ? mockData.entries.map((entry: any, index: number) => normalizeEntry(entry, index))
      : [],
  };

  if (shouldUseMocks()) {
    return fallbackBoard;
  }

  const db = getFirestoreDb();
  if (!db) {
    return fallbackBoard;
  }

  const entriesQuery = query(
    collection(db, 'rankings'),
    orderBy('score', 'desc'),
    limit(50)
  );
  const snapshot = await getDocs(entriesQuery);

  const entries = snapshot.docs.map((doc, index) =>
    normalizeEntry({ id: doc.id, ...doc.data() }, index)
  );

  return {
    season: {
      id: 'global',
      name: 'Ranking Global',
      endsAt: null,
    },
    entries,
  };
};
