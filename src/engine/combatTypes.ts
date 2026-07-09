export type HitSeverity =
  | 'miss'
  | 'graze'
  | 'light'
  | 'medium'
  | 'heavy'
  | 'crit'
  | 'supercrit';

export type TimingQuality = 'perfect' | 'good' | 'normal' | 'late';

export type ConditionBand =
  | 'excellent'
  | 'slightlyDamaged'
  | 'wounded'
  | 'badlyHurt'
  | 'badShape'
  | 'nearDeath'
  | 'dead';

export type CombatEntity = {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
};

export function getConditionBand(entity: CombatEntity): ConditionBand {
  if (entity.hp <= 0) {
    return 'dead';
  }

  const ratio = entity.hp / entity.maxHp;

  if (ratio >= 1) {
    return 'excellent';
  }

  if (ratio >= 0.8) {
    return 'slightlyDamaged';
  }

  if (ratio >= 0.6) {
    return 'wounded';
  }

  if (ratio >= 0.4) {
    return 'badlyHurt';
  }

  if (ratio >= 0.2) {
    return 'badShape';
  }

  return 'nearDeath';
}
