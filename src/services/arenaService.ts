import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import type { ArenaEvent } from '@/models/arena/types';
import mockArenaData from '@/data/mockArena.json';
import { getFirestoreDb } from './firebaseClient';
import { shouldUseMocks } from './mockMode';

const toDate = (value: unknown): Date => {
  if (value instanceof Date) return value;
  if (typeof (value as { toDate?: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate();
  }
  return new Date(value as string);
};

const normalizeEvent = (raw: any): ArenaEvent => {
  return {
    id: String(raw.id ?? ''),
    title: String(raw.title ?? 'Evento'),
    mode: String(raw.mode ?? 'Arena'),
    rewardCoins: Number(raw.rewardCoins ?? 0),
    entryCost: Number(raw.entryCost ?? 0),
    startsAt: toDate(raw.startsAt ?? new Date()),
    status: (raw.status ?? 'upcoming') as ArenaEvent['status'],
    difficulty: (raw.difficulty ?? 'easy') as ArenaEvent['difficulty'],
    participants: Number(raw.participants ?? 0),
    maxParticipants: Number(raw.maxParticipants ?? 0),
  };
};

export const getArenaEvents = async (): Promise<ArenaEvent[]> => {
  const mockData = mockArenaData as any;
  const fallbackEvents: ArenaEvent[] = Array.isArray(mockData.events)
    ? mockData.events.map((event: any) => normalizeEvent(event))
    : [];

  if (shouldUseMocks()) {
    return fallbackEvents;
  }

  const db = getFirestoreDb();
  if (!db) {
    return fallbackEvents;
  }

  const eventsQuery = query(
    collection(db, 'arena_events'),
    orderBy('startsAt', 'asc'),
    limit(20)
  );
  const snapshot = await getDocs(eventsQuery);

  return snapshot.docs.map((doc) => normalizeEvent({ id: doc.id, ...doc.data() }));
};
