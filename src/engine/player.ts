export type PlayerStats = {
  hp: number;
  maxHp: number;
  sp: number;
  maxSp: number;
  ep: number;
  maxEp: number;
  panic: number;
  xp: number;
  gold: number;
};

export type PlayerState = {
  name: string;
  title: string;
  level: number;
  stats: PlayerStats;
  learnedSpellIds: string[];
  gearIds: string[];
  flags: Record<string, boolean>;
};

export function createInitialPlayer(): PlayerState {
  return {
    name: 'Newcomer',
    title: 'the legally questionable arrival',
    level: 1,
    stats: {
      hp: 10,
      maxHp: 10,
      sp: 5,
      maxSp: 5,
      ep: 10,
      maxEp: 10,
      panic: 0,
      xp: 0,
      gold: 0,
    },
    learnedSpellIds: [],
    gearIds: [],
    flags: {},
  };
}

export function awardPlayer(
  player: PlayerState,
  reward: Partial<Pick<PlayerStats, 'xp' | 'gold'>>,
): PlayerState {
  return {
    ...player,
    stats: {
      ...player.stats,
      xp: player.stats.xp + (reward.xp ?? 0),
      gold: player.stats.gold + (reward.gold ?? 0),
    },
  };
}

export function learnSpell(player: PlayerState, spellId: string): PlayerState {
  if (player.learnedSpellIds.includes(spellId)) {
    return player;
  }

  return {
    ...player,
    learnedSpellIds: [...player.learnedSpellIds, spellId],
  };
}
