import React from 'react';
import { createHashRouter, RouterProvider, NavLink, Outlet } from 'react-router-dom';

import Home from './pages/Home.jsx';
import Flight from './pages/Flight.jsx';
import PackingList from './pages/PackingList';
import TodoPage from './pages/TodoPage.jsx';
import GamePage from './pages/GamePage.jsx';
import FoodHub from './pages/FoodHub.jsx';

const appBackground = `${process.env.PUBLIC_URL}/images/coastal-sunset.jpg`;

function Layout() {
  return (
    <div
      className="app"
      style={{
        '--app-bg-image': `url("${appBackground}")`,
      }}
    >
      <Header />

      <main className="app-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'flight', element: <Flight /> },
      { path: 'todo', element: <TodoPage /> },
      { path: 'packing', element: <PackingList /> },
      { path: 'game', element: <GamePage /> },
      { path: 'food', element: <FoodHub /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink to="/" end className="brand">
          <span className="brand-mark">✈</span>
          <span>Jayu / Suhu</span>
        </NavLink>

        <nav className="nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/flight">Flight</NavLink>
          <NavLink to="/todo">To-Do</NavLink>
          <NavLink to="/packing">Packing</NavLink>
          {/* <NavLink to="/game">Game</NavLink> */}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <span>© {new Date().getFullYear()} for Suhu • from Jayu</span>
      </div>
    </footer>
  );
}