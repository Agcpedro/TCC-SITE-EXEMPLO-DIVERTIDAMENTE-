export type RankType = 'Bronze' | 'Prata' | 'Ouro';

export interface RankInfo {
  name: RankType;
  minXP: number;
  maxXP: number | null;
  color: string;
  bgColor: string;
  icon: string;
}

export const RANKS: RankInfo[] = [
  {
    name: 'Bronze',
    minXP: 0,
    maxXP: 99,
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    icon: '🥉',
  },
  {
    name: 'Prata',
    minXP: 100,
    maxXP: 199,
    color: 'text-gray-600',
    bgColor: 'bg-gray-200',
    icon: '🥈',
  },
  {
    name: 'Ouro',
    minXP: 200,
    maxXP: null,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    icon: '🥇',
  },
];

export function getRankFromXP(xp: number): RankInfo {
  // Find the appropriate rank based on XP
  for (let i = RANKS.length - 1; i >= 0; i--) {
    const rank = RANKS[i];
    if (xp >= rank.minXP) {
      if (rank.maxXP === null || xp <= rank.maxXP) {
        return rank;
      }
    }
  }
  
  // Default to Bronze if somehow no rank matches
  return RANKS[0];
}

export function getProgressToNextRank(xp: number): { current: number; total: number; percentage: number } | null {
  const currentRank = getRankFromXP(xp);
  
  // If already at max rank (Ouro with maxXP null)
  if (currentRank.maxXP === null) {
    return null;
  }
  
  const xpInCurrentRank = xp - currentRank.minXP;
  const xpNeededForRank = (currentRank.maxXP || 0) - currentRank.minXP + 1;
  const percentage = (xpInCurrentRank / xpNeededForRank) * 100;
  
  return {
    current: xpInCurrentRank,
    total: xpNeededForRank,
    percentage,
  };
}

export function getNextRank(currentRank: RankInfo): RankInfo | null {
  const currentIndex = RANKS.findIndex(r => r.name === currentRank.name);
  if (currentIndex === -1 || currentIndex === RANKS.length - 1) {
    return null;
  }
  return RANKS[currentIndex + 1];
}

