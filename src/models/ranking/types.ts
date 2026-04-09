/**
 * MODELOS: Ranking
 */

export type RankingSeason = {
  id: string;
  name: string;
  endsAt: Date | null;
};

export type RankingEntry = {
  userId: string;
  username: string;
  avatarUrl?: string;
  score: number;
  rank: number;
  streak: number;
  country?: string;
};

export type RankingBoard = {
  season: RankingSeason;
  entries: RankingEntry[];
};
