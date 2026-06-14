import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import { APP_TITLE } from '../data/navigation'

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="app-shell">
      <div className="app-shell__backdrop" aria-hidden="true">
        <div className="app-shell__oled-emit app-shell__oled-emit--1" />
        <div className="app-shell__oled-emit app-shell__oled-emit--2" />
        <div className="app-shell__oled-emit app-shell__oled-emit--3" />
        <div className="app-shell__scanline" />
        <div className="app-shell__vignette" />
      </div>

      <NavBar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="app-shell__main">
        <header className="top-bar">
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen(true)}
            aria-label="פתח תפריט"
            aria-expanded={menuOpen}
          >
            <span className="menu-toggle__line" />
            <span className="menu-toggle__line" />
            <span className="menu-toggle__line" />
          </button>
          <span className="top-bar__title">{APP_TITLE}</span>
        </header>

        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
