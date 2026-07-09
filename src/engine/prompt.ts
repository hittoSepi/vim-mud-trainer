import type { PlayerState } from './player';
import type { PanicPhase, VimMachineState } from './vimMachine';

function padTimePart(value: number): string {
  return value.toString().padStart(2, '0');
}

export function formatPlayedTime(totalSeconds: number): string {
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${padTimePart(hours)}:${padTimePart(minutes)}`;
}

export type PromptMode = {
  mode: VimMachineState['mode'];
  phase: PanicPhase;
  commandBuffer: string;
};

export function formatBottomPrompt(
  player: PlayerState,
  playedSeconds: number,
  promptMode: PromptMode,
): string {
  const { stats } = player;
  const base = `[${formatPlayedTime(playedSeconds)}] panic:${stats.panic} $:${stats.gold} hp:${stats.hp}/${stats.maxHp} sp:${stats.sp}/${stats.maxSp}`;

  if (promptMode.phase === 'failed') {
    return `${base} PANIC>`;
  }

  if (promptMode.mode === 'insert') {
    return `${base} -- INSERT --`;
  }

  if (promptMode.mode === 'command') {
    return `${base} :${promptMode.commandBuffer}`;
  }

  return `${base} >`;
}
