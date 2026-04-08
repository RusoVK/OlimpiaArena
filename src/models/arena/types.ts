/**
 * MODELOS: Arena
 */

export type ArenaEventStatus = 'open' | 'upcoming' | 'closed';

export type ArenaEvent = {
  id: string;
  title: string;
  mode: string;
  rewardCoins: number;
  entryCost: number;
  startsAt: Date;
  status: ArenaEventStatus;
  difficulty: 'easy' | 'medium' | 'hard';
  participants: number;
  maxParticipants: number;
};
