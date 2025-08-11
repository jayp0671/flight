import React from 'react';

export default function FlightHero() {
  return (
    <section className="hero">
      <div className="hero__bg"><div className="hero__stars" /></div>

      {/* Clouds */}
      <div className="cloud cloud--1" />
      <div className="cloud cloud--2" />
      <div className="cloud cloud--3" />

      {/* Copy */}
      <div className="hero__copy">
        <h1 className="hero__title">The Long Awaited November Trip</h1>
        <p className="hero__sub">Almost There Love ♡</p>
        <div className="hero__cta">
          <a href="#/flight" className="btn btn--primary">View Itinerary</a>
          <a href="#/packing" className="btn btn--ghost">Open Packing List</a>
        </div>
      </div>

      {/* Infinity loop + plane */}
      <svg
        viewBox="0 0 1200 520"
        className="flight-svg"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="flight-grad" x1="0" x2="1">
            <stop offset="0%" stopColor="var(--glow1)" />
            <stop offset="100%" stopColor="var(--glow2)" />
          </linearGradient>

          <filter id="planeShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity=".35" />
          </filter>

          {/* tiny airplane shape */}
          <g id="plane-shape">
            <g transform="scale(0.9)">
              <rect x="-10" y="-3" width="26" height="6" rx="2" ry="2" fill="#fff"/>
              <polygon points="16,-3 26,0 16,3" fill="#fff"/>
              <polygon points="-10,-3 -16,-8 -8,-3" fill="#fff"/>
              <polygon points="-2,-2 10,0 -2,2 -12,6" fill="#fff"/>
              <polygon points="-2,-2 -12,-6 -2,2 10,0" fill="#fff" opacity=".9"/>
            </g>
          </g>
        </defs>

        {/* base (dashed) infinity */}
        <path
          id="flight-path"
          className="flight-path"
          d="
            M 260,260
            C 260,120 480,120 600,260
            C 720,400 940,400 940,260
            C 940,120 720,120 600,260
            C 480,400 260,400 260,260
          "
        />

        {/* optional glowing sweep (set stroke to transparent to hide) */}
        <path
          className="flight-path flight-path--accent"
          d="
            M 260,260
            C 260,120 480,120 600,260
            C 720,400 940,400 940,260
            C 940,120 720,120 600,260
            C 480,400 260,400 260,260
          "
          pathLength="1"
            style={{ strokeDasharray: '0.12 1', stroke: 'transparent' }}
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-1" dur="7s" repeatCount="indefinite" />
        </path>

        {/* plane */}
        <g style={{ filter: 'url(#planeShadow)' }}>
          <use href="#plane-shape">
            <animateMotion dur="9s" repeatCount="indefinite" rotate="auto">
              <mpath href="#flight-path" />
            </animateMotion>
          </use>
        </g>
      </svg>

      {/* page-scoped CSS */}
      <style>{css}</style>
    </section>
  );
}

/* ----- CSS scoped to the hero (keeps globals clean) ----- */
const css = `
.hero{
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  padding: 56px 24px 24px;
  background: linear-gradient(180deg, rgba(16,21,34,.9), rgba(12,15,22,.8));
  outline: 1px solid rgba(255,255,255,0.06);
  box-shadow: 0 20px 40px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.04);
}
.hero__bg{ position:absolute; inset:0; z-index:0;
  background: radial-gradient(800px 400px at 70% -10%, rgba(124,192,255,.14) 0%, transparent 60%);
}
.hero__stars{ position:absolute; inset:0; opacity:.75;
  background-image:
    radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,.45) 50%, transparent 50%),
    radial-gradient(1px 1px at 70% 20%, rgba(255,255,255,.35) 50%, transparent 50%),
    radial-gradient(1px 1px at 40% 60%, rgba(255,255,255,.30) 50%, transparent 50%),
    radial-gradient(1px 1px at 85% 70%, rgba(255,255,255,.28) 50%, transparent 50%);
}

/* aurora + vignette */
.hero::before{
  content:""; position:absolute; inset:-2px; z-index:0; border-radius:20px;
  background:
    radial-gradient(60% 80% at 70% 10%, rgba(124,192,255,.12), transparent 60%),
    conic-gradient(from 120deg at 30% 40%, rgba(199,156,255,.18), transparent 60%),
    radial-gradient(40% 60% at 70% 70%, rgba(124,192,255,.10), transparent 60%);
  filter: blur(18px);
  animation: aurora 10s linear infinite;
}
.hero::after{ content:""; position:absolute; inset:0; border-radius:20px; z-index:0;
  box-shadow: inset 0 0 140px rgba(0,0,0,.35); pointer-events:none;
}
@keyframes aurora { to { transform: rotate(360deg); } }

/* copy */
.hero__copy{ position:relative; z-index:2; max-width: 680px; margin-left: 8px; }
.hero__title{
  margin:0 0 6px; font-size: clamp(28px, 4vw, 40px); font-weight: 900; letter-spacing:.3px;
  background: linear-gradient(90deg,#fff 0%, #dbe6ff 30%, #fff 60%);
  -webkit-background-clip:text; background-clip:text; color: transparent;
  animation: shine 4.5s ease-in-out infinite; text-shadow: 0 1px 0 rgba(0,0,0,.25);
}
@keyframes shine{ 0%,100%{filter:drop-shadow(0 0 0 rgba(124,192,255,0))}
                 50%{filter:drop-shadow(0 0 18px rgba(124,192,255,.25))}}
.hero__sub{ margin:0 0 16px; color: var(--muted); }
.hero__cta{ display:flex; gap:12px; }
.btn{ display:inline-block; padding: 10px 14px; border-radius: 12px; text-decoration:none; font-weight:700; }
.btn--primary{ color:#0b0e13; background: linear-gradient(90deg, var(--glow1), var(--glow2));
  transition: transform .15s, box-shadow .2s; }
.btn--primary:hover{ box-shadow:0 12px 30px rgba(124,192,255,.25); transform: translateY(-1px);}
.btn--primary:active{ transform: translateY(0); box-shadow:0 6px 16px rgba(124,192,255,.18); }
.btn--ghost{ color:var(--text); outline:1px solid rgba(255,255,255,.12); }
.btn--ghost:hover{ outline-color: rgba(255,255,255,.22); }

/* svg + path */
.flight-svg{ position:relative; z-index:1; width:100%; height: 280px; margin-top: 16px; }
.flight-path{ fill:none; stroke: rgba(255,255,255,.35); stroke-width:3; stroke-linecap:round; stroke-dasharray: 8 10; }
.flight-path--accent{ fill:none; stroke: url(#flight-grad); stroke-width:3; stroke-linecap:round;
  filter: drop-shadow(0 0 8px rgba(124,192,255,.25)); }

/* clouds */
.cloud{
  position:absolute; z-index:1; top: 90px; width: 220px; height: 70px; opacity:.25;
  background:
    radial-gradient(45px 35px at 35px 35px, #fff 40%, transparent 41%),
    radial-gradient(70px 45px at 105px 30px, #fff 40%, transparent 41%),
    radial-gradient(40px 30px at 175px 40px, #fff 40%, transparent 41%);
  filter: blur(2px); border-radius: 60px;
}
.cloud--1{ left:-260px; animation: cloudMove 26s linear infinite; }
.cloud--2{ top: 50px; left:-300px; transform: scale(1.2); animation: cloudMove 30s linear infinite; }
.cloud--3{ top: 140px; left:-340px; transform: scale(.9); animation: cloudMove 28s linear infinite; }
@keyframes cloudMove { 0%{ transform: translateX(0) } 100%{ transform: translateX(1500px) } }

.hero__stars::after{
  content:""; position:absolute; inset:0;
  background-image:
    radial-gradient(1px 1px at 30% 40%, rgba(255,255,255,.6) 50%, transparent 50%),
    radial-gradient(1px 1px at 80% 45%, rgba(255,255,255,.5) 50%, transparent 50%);
  animation: twinkle 5s ease-in-out infinite alternate;
}
@keyframes twinkle { from{opacity:.25} to{opacity:.6} }
`;
