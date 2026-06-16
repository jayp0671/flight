import React from 'react';
import { TRIP } from '../config/trip';

const TARGET_DATE = new Date(TRIP.countdownTarget);

function getTimeLeft() {
  const now = new Date();
  const diff = Math.max(TARGET_DATE.getTime() - now.getTime(), 0);
  const totalSeconds = Math.floor(diff / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function TimeBlock({ value, label }) {
  return (
    <div className="hero-time-block">
      <span className="hero-time-value">{value}</span>
      <span className="hero-time-label">{label}</span>
    </div>
  );
}

export default function FlightHero() {
  const [timeLeft, setTimeLeft] = React.useState(getTimeLeft);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="photo-hero">
      <div className="photo-hero__content">
        <p className="hero-route">{TRIP.route}</p>

        <h1>{TRIP.title}</h1>

        <p className="hero-copy">{TRIP.heroSubtitle}</p>

        <div className="hero-countdown">
          <TimeBlock value={timeLeft.days} label="Days" />
          <TimeBlock value={pad(timeLeft.hours)} label="Hours" />
          <TimeBlock value={pad(timeLeft.minutes)} label="Minutes" />
          <TimeBlock value={pad(timeLeft.seconds)} label="Seconds" />
        </div>

        <p className="hero-date">{TRIP.displayDate}</p>

        <div className="hero-actions">
          <a href="#/flight" className="btn-primary">
            View itinerary
          </a>
          <a href="#/packing" className="btn-secondary">
            Packing list
          </a>
        </div>

        <div className="hero-shortcuts">
          <a href="#/flight">
            <span>✈</span>
            Flight Details
          </a>
          <a href="#/todo">
            <span>☑</span>
            To-Do List
          </a>
          <a href="#/packing">
            <span>▣</span>
            Packing List
          </a>
          <a href="#/game">
            <span>♡</span>
            Play Game
          </a>
        </div>
      </div>

      <style>{css}</style>
    </section>
  );
}

const css = `
.photo-hero {
  position: relative;
  min-height: calc(100vh - 76px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 24px 48px;
  overflow: hidden;
}

.photo-hero__content {
  position: relative;
  z-index: 1;
  width: min(100%, 980px);
  text-align: center;
  padding: clamp(28px, 5vw, 54px);
  border-radius: 42px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.055)),
    rgba(21, 15, 34, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 36px 110px rgba(9, 6, 18, 0.34);
  backdrop-filter: blur(14px);
}

.hero-route {
  margin: 0 0 18px;
  color: #ffd3a8;
  font-size: 14px;
  font-weight: 950;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.photo-hero h1 {
  max-width: 850px;
  margin: 0 auto;
  color: var(--text);
  font-size: clamp(48px, 7vw, 96px);
  line-height: 0.93;
  letter-spacing: -0.075em;
  font-weight: 950;
  text-shadow: 0 18px 52px rgba(9, 6, 18, 0.72);
}

.hero-copy {
  max-width: 600px;
  margin: 22px auto 42px;
  color: var(--text-soft);
  font-size: clamp(16px, 2vw, 21px);
  line-height: 1.7;
  font-weight: 650;
  text-shadow: 0 8px 26px rgba(9, 6, 18, 0.62);
}

.hero-countdown {
  width: min(100%, 800px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.hero-time-block {
  min-height: 148px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 26px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.075)),
    rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow:
    0 18px 48px rgba(9, 6, 18, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(16px);
}

.hero-time-value {
  color: #ffffff;
  font-size: clamp(48px, 6vw, 76px);
  line-height: 1;
  font-weight: 950;
  letter-spacing: -0.07em;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 14px 36px rgba(9, 6, 18, 0.34);
}

.hero-time-label {
  margin-top: 12px;
  color: rgba(255, 211, 168, 0.92);
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.hero-date {
  margin: 26px 0 0;
  color: rgba(255, 248, 243, 0.78);
  font-size: 15px;
  font-weight: 850;
  text-shadow: 0 8px 26px rgba(9, 6, 18, 0.62);
}

.hero-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 32px;
}

.hero-actions a {
  min-width: 176px;
}

.hero-shortcuts {
  width: min(100%, 760px);
  margin: 52px auto 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.hero-shortcuts a {
  display: grid;
  place-items: center;
  gap: 9px;
  color: rgba(255, 248, 243, 0.82);
  text-decoration: none;
  font-size: 13px;
  font-weight: 850;
  transition: transform 0.18s ease, color 0.18s ease;
}

.hero-shortcuts a:hover {
  transform: translateY(-3px);
  color: #ffffff;
}

.hero-shortcuts span {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #ffd3a8;
}

@media (max-width: 820px) {
  .photo-hero {
    padding: 70px 18px 46px;
  }

  .hero-countdown {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hero-shortcuts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .photo-hero__content {
    border-radius: 28px;
  }

  .photo-hero h1 {
    font-size: 44px;
  }

  .hero-countdown {
    gap: 12px;
  }

  .hero-time-block {
    min-height: 124px;
    border-radius: 20px;
  }

  .hero-actions {
    display: grid;
  }

  .hero-actions a {
    width: 100%;
  }
}
`;
