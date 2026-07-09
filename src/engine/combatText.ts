import { getConditionBand } from './combatTypes';
import type { CombatEntity, ConditionBand, HitSeverity, TimingQuality } from './combatTypes';

export type WeaponVocabulary = {
  id: string;
  displayName: string;
  templates: string[];
  verbs: Record<HitSeverity, string[]>;
};

export type ConditionVocabulary = {
  entityId: string;
  lines: Record<ConditionBand, string[]>;
};

export const shortSwordText: WeaponVocabulary = {
  id: 'short-sword',
  displayName: 'short sword',
  templates: ['You {verb} {target} with {weapon}.'],
  verbs: {
    miss: ['miss'],
    graze: ['nick', 'scratch'],
    light: ['stab', 'poke'],
    medium: ['slash', 'cut'],
    heavy: ['CUT', 'DRIVE into'],
    crit: ['MANGLE', 'CARVE'],
    supercrit: ['*SPLIT*', '*RUIN*'],
  },
};

export const apeConditionText: ConditionVocabulary = {
  entityId: 'ape',
  lines: {
    excellent: ['An Ape is in excellent shape.'],
    slightlyDamaged: ['An Ape is slightly damaged.'],
    wounded: ['An Ape is wounded.'],
    badlyHurt: ['An Ape is badly hurt.'],
    badShape: ['An Ape is in bad shape.'],
    nearDeath: ['An Ape is near death.'],
    dead: ['An Ape is dead.'],
  },
};

export const syntaxGoblinConditionText: ConditionVocabulary = {
  entityId: 'syntax-goblin',
  lines: {
    excellent: ['A Syntax Goblin is mostly coherent.'],
    slightlyDamaged: ['A Syntax Goblin is missing punctuation.'],
    wounded: ['A Syntax Goblin is leaking stack traces.'],
    badlyHurt: ['A Syntax Goblin is badly malformed.'],
    badShape: ['A Syntax Goblin is collapsing into lint.'],
    nearDeath: ['A Syntax Goblin is one semicolon from death.'],
    dead: ['A Syntax Goblin has been deleted from the buffer.'],
  },
};

export const timingText: Record<TimingQuality, string[]> = {
  perfect: ['You catch the heartbeat cleanly.'],
  good: ['You strike just after the heartbeat.'],
  normal: ['You follow the combat rhythm.'],
  late: ['You swing late.'],
};

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function renderTemplate(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (line, [key, value]) => line.replaceAll(`{${key}}`, value),
    template,
  );
}

export function describeWeaponHit(
  weapon: WeaponVocabulary,
  targetName: string,
  severity: HitSeverity,
): string {
  const template = pick(weapon.templates);
  const verb = pick(weapon.verbs[severity]);

  return renderTemplate(template, {
    verb,
    target: targetName,
    weapon: weapon.displayName,
  });
}

export function describeCondition(entity: CombatEntity, vocabulary: ConditionVocabulary): string {
  return pick(vocabulary.lines[getConditionBand(entity)]);
}

export function describeTiming(quality: TimingQuality): string {
  return pick(timingText[quality]);
}
