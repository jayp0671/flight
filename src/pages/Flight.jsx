import React from 'react';
import { TRIP, FLIGHTS } from '../config/trip';

function FlightCard({ flight }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <article className="flight-card">
      <div className="flight-card__top">
        <div>
          <p className="flight-label">{flight.label}</p>
          <h2>
            {flight.from}
            <span>→</span>
            {flight.to}
          </h2>
          <p className="flight-date">{flight.date}</p>
        </div>

        <span className="flight-badge">{flight.badge}</span>
      </div>

      <div className="flight-route">
        <div className="airport-block">
          <strong>{flight.from}</strong>
          <span>{flight.fromName}</span>
          <b>{flight.departTime}</b>
        </div>

        <div className="route-middle">
          <span className="route-line" />
          <span className="route-plane">✈</span>
          <span className="route-line" />
          <small>{flight.duration}</small>
        </div>

        <div className="airport-block airport-block--right">
          <strong>{flight.to}</strong>
          <span>{flight.toName}</span>
          <b>{flight.arriveTime}</b>
        </div>
      </div>

      <div className="flight-meta">
        <div>
          <span>Airline</span>
          <strong>{flight.airline}</strong>
        </div>
        <div>
          <span>Flight</span>
          <strong>{flight.flightNumber}</strong>
        </div>
        <div>
          <span>Cabin</span>
          <strong>{flight.cabin}</strong>
        </div>
        <div>
          <span>Gate</span>
          <strong>{flight.gate}</strong>
        </div>
      </div>

      <button
        className="dropdown-toggle"
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
      >
        <span>{isOpen ? 'Hide details' : 'Check-in info & details'}</span>
        <b>{isOpen ? '−' : '+'}</b>
      </button>

      {isOpen && (
        <div className="dropdown-panel">
          <div className="dropdown-grid">
            <section>
              <h3>Check-in</h3>
              <ul>
                {flight.checkIn.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3>Baggage / reminders</h3>
              <ul>
                {flight.baggage.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>

          <div className="details-strip">
            <div>
              <span>Terminal</span>
              <strong>{flight.terminal}</strong>
            </div>
            <div>
              <span>Aircraft</span>
              <strong>{flight.aircraft}</strong>
            </div>
            <div>
              <span>Confirmation</span>
              <strong>{flight.confirmation}</strong>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export default function Flight() {
  return (
    <section className="itinerary-page">
      <div className="itinerary-shell">
        <div className="itinerary-header">
          <div>
            <p className="route-label">{TRIP.route}</p>
            <h1>Your Itinerary</h1>
            <p className="trip-date">
              Two flights, one trip, everything in one place.
            </p>
          </div>

          <a href="#/packing" className="packing-link">
            Open packing list
          </a>
        </div>

        <div className="flight-list">
          {FLIGHTS.map((flight) => (
            <FlightCard key={flight.id} flight={flight} />
          ))}
        </div>
      </div>

      <style>{css}</style>
    </section>
  );
}

const css = `
.itinerary-page {
  min-height: calc(100vh - 76px);
  padding: 68px 24px;
}

.itinerary-shell {
  width: min(100%, 1120px);
  margin: 0 auto;
}

.itinerary-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
}

.route-label {
  margin: 0 0 10px;
  color: var(--accent-3);
  font-size: 13px;
  font-weight: 950;
  letter-spacing: 0.26em;
  text-transform: uppercase;
}

.itinerary-header h1 {
  margin: 0;
  color: var(--text);
  font-size: clamp(48px, 7vw, 84px);
  line-height: 0.92;
  letter-spacing: -0.075em;
  font-weight: 950;
  text-shadow: 0 18px 52px rgba(9, 6, 18, 0.42);
}

.trip-date {
  margin: 14px 0 0;
  color: var(--text-soft);
  font-size: 17px;
  font-weight: 700;
}

.packing-link {
  min-height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0 18px;
  color: #fff;
  text-decoration: none;
  font-weight: 900;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  box-shadow: 0 18px 42px rgba(255, 122, 184, 0.22);
  white-space: nowrap;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.packing-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 22px 52px rgba(255, 122, 184, 0.28);
}

.flight-list {
  display: grid;
  gap: 20px;
}

.flight-card {
  overflow: hidden;
  border-radius: 34px;
  padding: clamp(22px, 4vw, 34px);
  background:
    linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.055)),
    rgba(21, 15, 34, 0.52);
  border: 1px solid rgba(255,255,255,0.16);
  box-shadow: 0 28px 90px rgba(9, 6, 18, 0.28);
  backdrop-filter: blur(20px);
}

.flight-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 28px;
}

.flight-label {
  margin: 0 0 10px;
  color: var(--accent);
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.flight-card h2 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--text);
  font-size: clamp(38px, 6vw, 68px);
  line-height: 0.9;
  letter-spacing: -0.075em;
  font-weight: 950;
}

.flight-card h2 span {
  color: var(--accent-3);
  font-size: 0.46em;
  letter-spacing: 0;
}

.flight-date {
  margin: 12px 0 0;
  color: var(--text-soft);
  font-size: 15px;
  font-weight: 750;
}

.flight-badge {
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  padding: 0 14px;
  border-radius: 999px;
  color: var(--text);
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.14);
  font-size: 12px;
  font-weight: 900;
  white-space: nowrap;
}

.flight-route {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(120px, 240px) minmax(0, 1fr);
  gap: 18px;
  align-items: center;
  padding: 24px;
  border-radius: 28px;
  background: rgba(255,255,255,0.075);
  border: 1px solid rgba(255,255,255,0.11);
}

.airport-block {
  display: grid;
  gap: 7px;
}

.airport-block--right {
  text-align: right;
}

.airport-block strong {
  color: var(--text);
  font-size: clamp(42px, 7vw, 76px);
  line-height: 0.9;
  letter-spacing: -0.08em;
  font-weight: 950;
}

.airport-block span {
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 800;
}

.airport-block b {
  color: var(--accent-3);
  font-size: 22px;
  font-weight: 950;
}

.route-middle {
  display: grid;
  place-items: center;
  gap: 8px;
  min-width: 0;
}

.route-plane {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: #fff;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  box-shadow: 0 16px 36px rgba(255, 122, 184, 0.22);
}

.route-line {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.36), transparent);
}

.route-middle small {
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 900;
}

.flight-meta {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.flight-meta div {
  min-height: 76px;
  display: grid;
  align-content: center;
  gap: 5px;
  padding: 15px;
  border-radius: 20px;
  background: rgba(255,255,255,0.075);
  border: 1px solid rgba(255,255,255,0.1);
}

.flight-meta span,
.details-strip span {
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 950;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.flight-meta strong,
.details-strip strong {
  color: var(--text);
  font-size: 15px;
  font-weight: 950;
}

.dropdown-toggle {
  width: 100%;
  min-height: 54px;
  margin-top: 16px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  border-radius: 18px;
  color: var(--text);
  background: rgba(255,255,255,0.09);
  border: 1px solid rgba(255,255,255,0.12);
  cursor: pointer;
  font-weight: 950;
  transition: background 0.18s ease, border-color 0.18s ease;
}

.dropdown-toggle:hover {
  background: rgba(255,255,255,0.13);
  border-color: rgba(255,255,255,0.2);
}

.dropdown-toggle b {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: #fff;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  font-size: 18px;
  line-height: 1;
}

.dropdown-panel {
  margin-top: 14px;
  padding: 20px;
  border-radius: 24px;
  background: rgba(9, 6, 18, 0.24);
  border: 1px solid rgba(255,255,255,0.11);
}

.dropdown-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.dropdown-panel h3 {
  margin: 0 0 12px;
  color: var(--accent-3);
  font-size: 13px;
  font-weight: 950;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.dropdown-panel ul {
  display: grid;
  gap: 9px;
  margin: 0;
  padding-left: 18px;
  color: var(--text-soft);
  font-size: 14px;
  font-weight: 650;
  line-height: 1.5;
}

.details-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.details-strip div {
  display: grid;
  gap: 5px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255,255,255,0.075);
  border: 1px solid rgba(255,255,255,0.1);
}

@media (max-width: 840px) {
  .itinerary-header,
  .flight-card__top {
    align-items: flex-start;
    flex-direction: column;
  }

  .flight-route {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .airport-block--right {
    text-align: center;
  }

  .route-middle {
    display: flex;
    justify-content: center;
  }

  .route-line {
    width: 70px;
  }

  .flight-meta,
  .dropdown-grid,
  .details-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .itinerary-page {
    padding: 42px 16px;
  }

  .flight-card {
    border-radius: 26px;
  }

  .flight-card h2 {
    flex-wrap: wrap;
  }

  .flight-meta,
  .dropdown-grid,
  .details-strip {
    grid-template-columns: 1fr;
  }

  .flight-route {
    padding: 18px;
    border-radius: 22px;
  }
}
`;
