import React from 'react';
import { createHashRouter, RouterProvider, NavLink, Outlet } from 'react-router-dom';

import Home from './pages/Home.jsx'; // our nice hero page
import Flight from './pages/Flight.jsx';
import PackingList from './pages/PackingList';
import TodoPage from './pages/TodoPage.jsx';
import GamePage from './pages/GamePage.jsx'; // ✅ mini‑game

function Layout() {
  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

/* ---------- Router ---------- */
const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'flight', element: <Flight /> },
      { path: 'todo', element: <TodoPage /> },
      { path: 'packing', element: <PackingList /> },
      { path: 'game', element: <GamePage /> },      // ✅ new route
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

/* ---------- Header / Footer ---------- */
function Header() {
  // Your real departure time: Nov 18, 2025 at 1:00 PM EST (UTC-5)
  const DEPARTS_AT = new Date('2025-11-18T13:00:00-05:00');

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="brand">
          EWR ✦ YHZ
          <Countdown target={DEPARTS_AT} />
        </div>
        <nav className="nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/flight">The Flight</NavLink>
          <NavLink to="/todo">To‑Do</NavLink>
          <NavLink to="/packing">Packing List</NavLink>
          <NavLink to="/game">Game</NavLink> {/* ✅ show the game */}
        </nav>
      </div>
      <style>{headerCss}</style>
    </header>
  );
}

function Countdown({ target }) {
  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diffMs = target.getTime() - now;

  let label;
  if (diffMs > 0) {
    const totalSec = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const pad = (n) => n.toString().padStart(2, '0');

    const timeStr =
      days > 0
        ? `${days}d ${pad(hours)}:${pad(mins)}:${pad(secs)}`
        : `${pad(hours)}:${pad(mins)}:${pad(secs)}`;

    label = `T‑${timeStr}`;
  } else if (diffMs > -15 * 60 * 1000) {
    // within 15 minutes after target
    label = 'Boarding';
  } else {
    label = 'Landed';
  }

  return <span className="countdown-badge">{label}</span>;
}

const headerCss = `
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
}
.countdown-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: .3px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(16,21,34,.55);
  color: var(--text);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.05);
}
@media (max-width: 520px) {
  .countdown-badge { display:none; } /* hide on tiny screens */
}
`;

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <span>© {new Date().getFullYear()} for Suhu • from Jayu</span>
      </div>
    </footer>
  );
}
