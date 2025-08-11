import React, { useEffect, useMemo, useRef, useState } from 'react';

const TEST_SECONDS = 60;
const STORAGE_KEY = 'typerace:best';

// Short, punchy passages. Add your own if you want.
const PASSAGES = [
  'Even when we are hundreds of miles apart, it feels like you are sitting right next to me, laughing at my terrible jokes and making the world feel a little less heavy.',
  'Traveling together means more than just seeing new places; it means creating tiny memories we will replay in our minds for the rest of our lives.',
  'No matter the distance or the delays, I would take every layover, every connection, and every long night just to spend one more day with you.',
  'We collect moments like souvenirs, storing them away in our hearts, pulling them out whenever the world feels too loud or too cold.',
  'Typing these words is easy, but explaining how much I care about you would take a lifetime and still feel unfinished.',
  'One day, we will look back at these small messages, the countdowns, and the silly games, and realize they were part of the best love story we could ever write.',
  'Through flights, time zones, and too many cups of coffee, we are proving that distance is only a number, not a barrier.',
  'The best adventures are the ones where you don’t just discover new places, but discover more reasons to fall for the person beside you.',
  'Even when we are apart, I imagine you in every little thing — the songs I hear, the food I eat, and the quiet moments before I fall asleep.',
  'Life is not about waiting for the perfect moment; it’s about packing your bag, booking the ticket, and showing up for the people you love.',
  'We speak in glances, in inside jokes, in little texts that say “I thought of you today” without actually needing to say it.',
  'There’s something magical about counting down to a moment you know will change everything — like the first hug after too long apart.',
  'Sometimes the best part of traveling isn’t the destination or the scenery, but knowing that someone is waiting for you on the other side.',
  'We will keep filling our story with flight numbers, ticket stubs, and late-night FaceTimes until the day we no longer need them.',
  'Love is not just grand gestures and dramatic speeches; it’s the everyday choosing, the remembering, and the showing up.',
  'I would rather have one weekend with you than a hundred days with anyone else, because nothing compares to the way you make me feel.',
  'Even when the Wi-Fi is bad and the call freezes, just hearing your voice for a few seconds is enough to make my day better.',
  'I can’t wait to see the way your face lights up when you finally spot me in the crowd at the arrivals gate.',
  'Our story isn’t just about distance and travel; it’s about how two people decided that love was worth every timezone, every mile, and every second apart.',
  'Typing fast is easy, but keeping up with how fast you’ve stolen my heart is impossible.',
  'One day soon, we won’t need to count the days, because there will be no more flights to take or goodbyes to say.',
  'We are the kind of people who turn even the most ordinary days into something worth remembering.',
];

function pickPassage() {
  return PASSAGES[Math.floor(Math.random() * PASSAGES.length)];
}

export default function GamePage() {
  const [target, setTarget] = useState(pickPassage);
  const [typed, setTyped] = useState('');
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TEST_SECONDS);
  const [bestWpm, setBestWpm] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? Number(raw) : 0;
  });

  const inputRef = useRef(null);
  const startTs = useRef(null); // ms timestamp of first keypress

  // Start timer on first key
  useEffect(() => {
    if (!started) return;
    if (finished) return;

    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(id);
          endTest();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [started, finished]);

  function reset(newPassage = true) {
    setTarget(newPassage ? pickPassage() : target);
    setTyped('');
    setStarted(false);
    setFinished(false);
    setTimeLeft(TEST_SECONDS);
    startTs.current = null;
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function endTest() {
    setFinished(true);
    // update best wpm
    const wpm = calcWpm();
    if (wpm > bestWpm) {
      setBestWpm(wpm);
      localStorage.setItem(STORAGE_KEY, String(wpm));
    }
  }

  // Stats
  const chars = useMemo(() => target.split(''), [target]);
  const typedChars = useMemo(() => typed.split(''), [typed]);

  const correctCount = useMemo(() => {
    let n = 0;
    for (let i = 0; i < typedChars.length; i++) {
      if (typedChars[i] === chars[i]) n++;
    }
    return n;
  }, [typedChars, chars]);

  const errors = Math.max(0, typed.length - correctCount);
  const accuracy = typed.length ? Math.round((correctCount / typed.length) * 100) : 100;

  const elapsedSeconds = useMemo(() => {
    if (!started) return 0;
    return Math.min(TEST_SECONDS, Math.floor((Date.now() - startTs.current) / 1000));
  }, [timeLeft, started]);

  function calcWpm() {
    const minutes = Math.max(1 / 60, elapsedSeconds / 60); // avoid divide by 0
    const wpm = Math.round((correctCount / 5) / minutes);
    return wpm;
  }

  const wpm = calcWpm();

  // Finish early if fully typed correctly (allow trailing spaces mismatch)
  useEffect(() => {
    if (!started || finished) return;
    if (typed.length >= target.length && errors === 0) {
      endTest();
    }
  }, [typed, target, errors, started, finished]);

  function onChange(e) {
    const v = e.target.value;

    if (!started && v.length > 0) {
      setStarted(true);
      startTs.current = Date.now();
    }

    // Lock length to target len + a bit of slack
    if (v.length <= target.length + 2) {
      setTyped(v);
    }
  }

  return (
    <div className="container">
      <section className="typerace">
        <header className="typerace__header">
          <h1>Type Race</h1>
          <div className="hud">
            <span className="pill">⏱ {timeLeft}s</span>
            <span className="pill">⚡ {wpm} WPM</span>
            <span className="pill">🎯 {accuracy}%</span>
            <span className="pill">❌ {errors}</span>
            {bestWpm > 0 && <span className="pill best">🏆 {bestWpm} best</span>}
          </div>
        </header>

        <div className="card passage">
          {chars.map((ch, i) => {
            const t = typedChars[i];
            let cls = '';
            if (t != null) cls = t === ch ? 'ok' : 'bad';
            const isCaret = i === typed.length && !finished && started;
            return (
              <span key={i} className={`ch ${cls}`}>
                {ch}
                {isCaret && <span className="caret" />}
              </span>
            );
          })}
        </div>

        <input
          ref={inputRef}
          className="type-input"
          type="text"
          value={typed}
          onChange={onChange}
          disabled={finished || timeLeft === 0}
          placeholder={started ? '' : 'Start typing to begin…'}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />

        <div className="controls">
          <button onClick={() => reset(false)}>Restart</button>
          <button onClick={() => reset(true)}>New Passage</button>
        </div>

        {finished && (
          <div className="results card">
            <h3>Time!</h3>
            <p className="muted">
              WPM: <strong>{wpm}</strong> &nbsp;•&nbsp; Accuracy: <strong>{accuracy}%</strong> &nbsp;•&nbsp; Errors: <strong>{errors}</strong>
            </p>
            <p className="muted">Best: <strong>{bestWpm} WPM</strong></p>
            <button onClick={() => reset(false)}>Go Again</button>
          </div>
        )}
      </section>

      <style>{css}</style>
    </div>
  );
}

const css = `
.typerace { display:grid; gap:16px; padding:8px 0 28px; }
.typerace__header { display:flex; align-items:flex-end; justify-content:space-between; gap:12px; }
.typerace__header h1 { margin:0; font-size:clamp(24px,4vw,36px); }
.hud { display:flex; gap:8px; flex-wrap:wrap; }
.pill {
  display:inline-flex; align-items:center; gap:6px; padding:6px 10px; border-radius:999px;
  border:1px solid rgba(255,255,255,.12); background:rgba(16,21,34,.55); color:var(--text); font-size:12px;
}
.pill.best { border-color: rgba(255,215,0,.35); }

.card.passage {
  font-size: clamp(16px, 2.6vw, 20px);
  line-height: 1.8;
  letter-spacing: .2px;
  padding: 16px;
  background: linear-gradient(180deg, rgba(16,21,34,.85), rgba(12,15,22,.78));
  border: 1px solid rgba(255,255,255,.06);
  border-radius: 16px;
  box-shadow: 0 10px 28px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.04);
  user-select: none;
}

.ch { position: relative; padding: 0 1px; }
.ch.ok { color: #b8ffcf; }
.ch.bad { color: #ff8e8e; text-decoration: underline; text-decoration-thickness: 2px; }

.caret {
  position: absolute;
  right: -1px;
  bottom: -3px;
  width: 2px;
  height: 1.2em;
  background: var(--text);
  animation: blink .9s steps(2, start) infinite;
}
@keyframes blink { 50% { opacity: 0; } }

.type-input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.08);
  background: rgba(16,21,34,.6);
  color: var(--text);
  font-size: 16px;
}

.controls { display:flex; gap:8px; }
.controls button {
  padding:10px 14px; border-radius:12px; border:1px solid rgba(255,255,255,.1);
  background:linear-gradient(180deg, rgba(24,30,48,.9), rgba(18,22,36,.85));
  color:var(--text); font-weight:700; cursor:pointer;
}

.results.card {
  background: linear-gradient(180deg, rgba(16,21,34,.85), rgba(12,15,22,.78));
  border: 1px solid rgba(255,255,255,.06); border-radius: 16px; padding: 16px;
  box-shadow: 0 10px 28px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.04);
}
`;
