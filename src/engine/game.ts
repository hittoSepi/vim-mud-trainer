import { getLesson } from './lessons';
import type { GameState, Lesson } from './types';

export const initialLessonId = 'wrong-parser-inn';

export function createInitialState(): GameState {
  const firstLesson = getLesson(initialLessonId);
  return {
    lessonId: firstLesson.id,
    mode: firstLesson.mode,
    xp: 0,
    completedLessonIds: [],
    log: [
      'Welcome to vim-mud-trainer.',
      'You are standing in a cursed terminal. The parser is probably wrong.',
      '',
      ...formatLessonIntro(firstLesson),
    ],
  };
}

export function formatLessonIntro(lesson: Lesson): string[] {
  return [
    `== ${lesson.area}: ${lesson.title} ==`,
    ...lesson.description,
    '',
    `Goal: ${lesson.goal}`,
  ];
}

export function runCommand(state: GameState, rawInput: string): GameState {
  const input = rawInput.trim();
  const lesson = getLesson(state.lessonId);

  if (!input) {
    return {
      ...state,
      log: [...state.log, `${lesson.prompt ?? '>'} `, 'The terminal waits. Menacingly.'],
    };
  }

  const command = lesson.commands.find((item) => item.input.toLowerCase() === input.toLowerCase());
  const prefix = `${lesson.prompt ?? '>'} ${input}`;

  if (!command) {
    const response = lesson.wrongCommandResponses?.[input] ?? lesson.defaultWrongResponse;
    return {
      ...state,
      log: [...state.log, prefix, response],
    };
  }

  const gainedXp = command.xp ?? 0;
  const completedLessonIds = state.completedLessonIds.includes(lesson.id)
    ? state.completedLessonIds
    : [...state.completedLessonIds, lesson.id];

  if (!command.nextLessonId) {
    return {
      ...state,
      mode: command.mode ?? state.mode,
      xp: state.xp + gainedXp,
      completedLessonIds,
      log: [...state.log, prefix, command.message, '', `XP: ${state.xp + gainedXp}`],
    };
  }

  const nextLesson = getLesson(command.nextLessonId);

  return {
    lessonId: nextLesson.id,
    mode: command.mode ?? nextLesson.mode,
    xp: state.xp + gainedXp,
    completedLessonIds,
    log: [
      ...state.log,
      prefix,
      command.message,
      gainedXp > 0 ? `You gain ${gainedXp} vim xp.` : '',
      '',
      ...formatLessonIntro(nextLesson),
    ].filter(Boolean),
  };
}
