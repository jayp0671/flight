import React from 'react';

export default function Flight() {
  const trips = [
    {
      kind: 'Departing flight',
      routeLine: 'New York, US (EWR) → Halifax, CA (YHZ)',
      dateLong: 'Tue, Nov 18, 2025',
      fromCode: 'EWR',
      fromCity: 'New York',
      depart: '13:00',
      toCode: 'YHZ',
      toCity: 'Halifax',
      arrive: '16:14',
      nonstopLabel: 'Non‑stop • 2h 14m',
      flightNo: 'AC 2566',
      note: 'Includes travel operated by Air Canada Express ‑ PAL Airlines.',
      cabin: 'Economy — Basic',
      pax: '1 Adult',
    },
    {
      kind: 'Return flight',
      routeLine: 'Halifax, CA (YHZ) → New York, US (EWR)',
      dateLong: 'Sun, Dec 07, 2025',
      fromCode: 'YHZ',
      fromCity: 'Halifax',
      depart: '10:30',
      toCode: 'EWR',
      toCity: 'New York',
      arrive: '12:18',
      nonstopLabel: 'Non‑stop • 2h 48m',
      flightNo: 'AC 2567',
      note: 'Includes travel operated by Air Canada Express ‑ PAL Airlines.',
      cabin: 'Economy — Basic',
      pax: '1 Adult',
    },
  ];

  return (
    <div className="container">
      <section className="flight">
        <header className="flight__header">
          <h1>The Flight</h1>
          <p className="route">EWR ✈ YHZ ↺</p>
        </header>

        <div className="trip-list">
          {trips.map((t, i) => (
            <article className="trip" key={i}>
              <div className="trip__head">
                <div className="trip__kind">{t.kind}</div>
                <div className="trip__meta">
                  <span className="chip">{t.cabin}</span>
                  <span className="chip">{t.pax}</span>
                </div>
              </div>

              <div className="trip__route">
                <div className="route-line">
                  {t.routeLine} <span className="date">• {t.dateLong}</span>
                </div>

                <div className="timeline">
                  <div className="tl__col tl__col--left">
                    <div className="time">{t.depart}</div>
                    <div className="city">{t.fromCity}</div>
                    {/* removed extra dot here */}
                  </div>

                  <div className="tl__col tl__col--bar">
                    <div className="bar">
                      {/* removed the moving runner */}
                      <span className="bar__plane" aria-hidden="true">✈</span>
                    </div>
                    <div className="stops">{t.nonstopLabel}</div>
                  </div>

                  <div className="tl__col tl__col--right">
                    <div className="time">{t.arrive}</div>
                    <div className="city">{t.toCity}</div>
                    {/* removed extra dot here */}
                  </div>
                </div>

                <div className="codes">
                  <span className="code">{t.fromCode}</span>
                  <span className="arrow">⟶</span>
                  <span className="code">{t.toCode}</span>
                </div>
              </div>

              <div className="trip__foot">
                <div className="flightno">Flight {t.flightNo}</div>
                <div className="note">{t.note}</div>
              </div>
            </article>
          ))}
        </div>

        <footer className="flight__footer">
          <small>Times shown are local to each airport.</small>
        </footer>
      </section>

      {/* page‑scoped styles */}
      <style>{css}</style>
    </div>
  );
}

/* ---------------- CSS (scoped) ---------------- */
const css = `
.flight{
  display:grid; gap:18px;
  padding: 8px 0 28px;
}
.flight__header{
  display:flex; align-items:flex-end; justify-content:space-between; gap:12px;
}
.flight__header h1{ margin:0; font-size: clamp(24px, 4vw, 36px); }
.flight__header .route{
  margin:0; color:var(--muted);
  font-weight:700; letter-spacing:.6px;
}

.trip-list{ display:grid; gap:16px; }

.trip{
  background: linear-gradient(180deg, rgba(16,21,34,.85), rgba(12,15,22,.78));
  border: 1px solid rgba(255,255,255,.06);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 10px 28px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.04);
}

.trip__head{
  display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;
}
.trip__kind{ font-weight:800; letter-spacing:.2px; }
.trip__meta{ display:flex; gap:8px; }
.chip{
  font-size:12px; color:var(--text);
  border:1px solid rgba(255,255,255,.12);
  border-radius:999px; padding:6px 10px; opacity:.9;
  background: rgba(255,255,255,.02);
}

.trip__route{ display:grid; gap:8px; }
.trip__route .route-line{ color:var(--text); font-weight:600; }
.trip__route .route-line .date{ color:var(--muted); font-weight:500; }

/* timeline */
.timeline{
  display:grid;
  grid-template-columns: 140px 1fr 140px;
  align-items:center; gap:12px;
  margin-top:4px;
}
.tl__col .time{ font-weight:800; }
.tl__col .city{ color:var(--muted); font-size:14px; }

/* the bar that fits exactly between start and end columns */
.tl__col--bar .bar{
  position:relative; height:2px; background:rgba(255,255,255,.14);
  border-radius:999px; overflow:visible;
}

/* the ONLY two end dots (no extra floating ones) */
.tl__col--bar .bar::before,
.tl__col--bar .bar::after{
  content:""; position:absolute; top:50%; width:10px; height:10px; border-radius:50%;
  background:#fff; transform:translateY(-50%);
  box-shadow: 0 0 0 3px rgba(255,255,255,.15);
}
.tl__col--bar .bar::before{ left:-5px; }  /* start dot */
.tl__col--bar .bar::after{ right:-5px; }  /* end dot */

/* PLANE ping‑pong animation (loops back and forth) */
/* PLANE ping‑pong animation across full bar width */
.bar__plane{
  position:absolute;
  top:-7.5px;
  left:-5px;           /* start just before the left dot (which sits at -5px) */
  width:16px;          /* plane glyph width for math below */
  font-size:16px;
  line-height:16px;
  display:inline-block;
  transform-origin:center;
  animation: planePing 10s ease-in-out infinite;
}

@keyframes planePing{
  0%   { left: -5px;                transform: scaleX(1); }                 /* at left dot */
  49.9%{ left: calc(100% - 26px);   transform: scaleX(1); }                 /* just before right dot */
  50%  { left: calc(100% - 26px);   transform: scaleX(-1); }                /* flip instantly */
  100% { left: -5px;                transform: scaleX(-1); }                /* back to start */
}

.stops{ color:var(--muted); font-size:13px; margin-top:6px; }

/* codes row */
.codes{
  display:flex; align-items:center; gap:8px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  padding-top:4px;
}
.code{
  padding:4px 8px; border-radius:8px; background:rgba(255,255,255,.06);
  border:1px solid rgba(255,255,255,.08); font-weight:800; letter-spacing:.8px;
}
.arrow{ opacity:.6; }

.trip__foot{
  margin-top:10px; display:grid; gap:4px; color:var(--muted); font-size:13px;
}
.flightno{ color:var(--text); font-weight:700; }

.flight__footer{ margin-top:6px; color:var(--muted); }
`;
