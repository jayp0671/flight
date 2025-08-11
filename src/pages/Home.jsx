import React from 'react';
import FlightHero from '../components/FlightHero.jsx';

export default function Home() {
  return (
    <div className="container">
      <FlightHero />
      <p style={{ color:'var(--muted)', marginTop: 12, fontSize: 14 }}>
        tip: use the header to jump to the itinerary or packing list anytime.
      </p>
    </div>
  );
}
