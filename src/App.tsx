import { FormEvent, useEffect, useRef, useState } from 'react';
import { createInitialState, runCommand } from './engine/game';

export function App() {
  const [state, setState] = useState(createInitialState);
  const [input, setInput] = useState('');
  const logRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [state.log]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState((current) => runCommand(current, input));
    setInput('');
  }

  function reset() {
    setState(createInitialState());
    setInput('');
  }

  return (
    <main className="shell">
      <section className="terminal-card">
        <header className="terminal-header">
          <div>
            <h1>vim-mud-trainer</h1>
            <p>MUD-based Vim survival game and trainer</p>
          </div>
          <div className="status-grid">
            <span>mode: {state.mode}</span>
            <span>xp: {state.xp}</span>
            <span>cleared: {state.completedLessonIds.length}</span>
          </div>
        </header>

        <div className="terminal-log" ref={logRef} aria-live="polite">
          {state.log.map((line, index) => (
            <div key={`${index}-${line}`} className={line.startsWith('==') ? 'log-line room-title' : 'log-line'}>
              {line || '\u00A0'}
            </div>
          ))}
        </div>

        <form className="command-row" onSubmit={submit}>
          <span className="prompt">&gt;</span>
          <input
            autoFocus
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
            aria-label="command input"
          />
          <button type="submit">enter</button>
          <button type="button" onClick={reset}>reset</button>
        </form>
      </section>

      <aside className="cheat-card">
        <h2>Survival keys</h2>
        <dl>
          <dt>i</dt><dd>enter insert mode</dd>
          <dt>esc</dt><dd>leave insert mode</dd>
          <dt>:w</dt><dd>save</dd>
          <dt>:q!</dt><dd>quit without saving</dd>
          <dt>:wq</dt><dd>save and quit</dd>
          <dt>dd</dt><dd>delete line</dd>
          <dt>u</dt><dd>undo</dd>
        </dl>
      </aside>
    </main>
  );
}
