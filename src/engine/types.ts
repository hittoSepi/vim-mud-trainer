export type EditorMode = 'normal' | 'insert' | 'command';

export type LessonCommand = {
  input: string;
  message: string;
  nextLessonId?: string;
  mode?: EditorMode;
  xp?: number;
};

export type Lesson = {
  id: string;
  title: string;
  area: string;
  mode: EditorMode;
  description: string[];
  goal: string;
  prompt?: string;
  commands: LessonCommand[];
  wrongCommandResponses?: Record<string, string>;
  defaultWrongResponse: string;
};

export type GameState = {
  lessonId: string;
  mode: EditorMode;
  xp: number;
  log: string[];
  completedLessonIds: string[];
};
