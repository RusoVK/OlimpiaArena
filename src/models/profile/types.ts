/**
 * MODELOS: Perfil de usuario
 */

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlockedAt: Date | null;
};

export type ArenaStats = {
  wins: number;
  losses: number;
  bestTimeSeconds: number;
  currentStreak: number;
};

export type UserProfile = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  level: number;
  exp: number;
  tokaCoins: number;
  stats: ArenaStats;
  achievements: Achievement[];
  lastActiveAt: Date | null;
};
