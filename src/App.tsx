import { KeyboardEvent, useEffect, useReducer, useRef } from 'react';
import { createInitialMachineState, vimMachineReducer } from './engine/vimMachine';

function isPrintableKey(key: string): boolean {
  return key.length === 1;
}

function shouldCaptureKey(key: string): boolean {
  return isPrintableKey(key) || ['Escape', 'Enter', 'Backspace'].includes(key);
}

export function App() {
  const [state, dispatch] = useReducer(vimMachineReducer, undefined, createInitialMachineState);
  const logRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [state.log]);

  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!shouldCaptureKey(event.key)) {
      return;
    }

    event.preventDefault();
    dispatch({ type: 'key', key: event.key, printable: isPrintableKey(event.key) });
  }

  const commandPreview = state.mode === 'command' ? `:${state.commandBuffer}` : '';
  const panicLevel = Math.min(100, state.panic);

  return (
    <main className="shell">
      <section
        className={`terminal-card mode-${state.mode}`}
        tabIndex={0}
        ref={panelRef}
        onKeyDown={handleKeyDown}
        aria-label="vim mud trainer terminal"
      >
        <header className="terminal-header">
          <div>
            <h1>vim-mud-trainer</h1>
            <p>MUD-based Vim survival game and trainer</p>
          </div>
          <div className="status-grid">
            <span>mode: {state.mode.toUpperCase()}</span>
            <span>xp: {state.xp}</span>
            <span>cleared: {state.completedRoomIds.length}</span>
            <span>panic: {panicLevel}%</span>
          </div>
        </header>

        <div className="terminal-log" ref={logRef} aria-live="polite">
          {state.log.map((line, index) => (
            <div key={`${index}-${line}`} className={line.startsWith('==') ? 'log-line room-title' : 'log-line'}>
              {line || '\u00A0'}
            </div>
          ))}
        </div>

        <section className="vim-buffer" aria-label="vim buffer">
          <div className="buffer-title">Vim buffer trap</div>
          <pre>{state.textBuffer || '/* empty buffer, suspiciously calm */'}</pre>
          <div className="vim-status-line">
            <span>{state.mode === 'insert' ? '-- INSERT --' : state.mode === 'command' ? commandPreview || ':' : '-- NORMAL --'}</span>
            <span>{state.pendingOperator ? `operator: ${state.pendingOperator}` : `last key: ${state.lastKey || 'none'}`}</span>
          </div>
        </section>

        <footer className="control-row">
          <div className="panic-meter" aria-label="panic meter">
            <div className="panic-fill" style={{ width: `${panicLevel}%` }} />
          </div>
          <button type="button" onClick={() => dispatch({ type: 'reset' })}>reset</button>
        </footer>
      </section>

      <aside className="cheat-card">
        <h2>Survival keys</h2>
        <dl>
          <dt>i</dt><dd>enter insert mode</dd>
          <dt>Esc</dt><dd>leave insert mode</dd>
          <dt>:</dt><dd>open command mode</dd>
          <dt>:w</dt><dd>save</dd>
          <dt>:q!</dt><dd>quit without saving</dd>
          <dt>:wq</dt><dd>save and quit</dd>
          <dt>:qa!</dt><dd>quit all by force</dd>
          <dt>dd</dt><dd>delete line</dd>
          <dt>u</dt><dd>undo</dd>
        </dl>
        <p className="hint">Click the terminal panel, then use real keys. This is no longer a polite text box. Progress, allegedly.</p>
      </aside>
    </main>
  );
}
