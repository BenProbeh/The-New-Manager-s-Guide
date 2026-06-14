import { NavLink } from 'react-router-dom'
import { APP_TITLE, NAV_ITEMS } from '../data/navigation'
import NavIcon from './NavIcon'

export default function NavBar({ isOpen, onClose }) {
  return (
    <>
      <div
        className={`nav-overlay ${isOpen ? 'nav-overlay--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`nav-bar ${isOpen ? 'nav-bar--open' : ''}`} aria-label="תפריט ניווט ראשי">
        <div className="nav-bar__header">
          <NavLink to="/" className="nav-bar__brand" onClick={onClose}>
            <span className="nav-bar__brand-mark" aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="10" fill="url(#brandGrad)" />
                <path d="M16 8l6 8h-4v8h-4v-8h-4l6-8z" fill="#fff" fillOpacity="0.98" />
                <defs>
                  <linearGradient id="brandGrad" x1="0" y1="0" x2="32" y2="32">
                    <stop stopColor="#da8fff" />
                    <stop offset="1" stopColor="#9333ea" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="nav-bar__brand-text">{APP_TITLE}</span>
          </NavLink>
          <button
            type="button"
            className="nav-bar__close"
            onClick={onClose}
            aria-label="סגור תפריט"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav className="nav-bar__menu">
          <ul className="nav-bar__list">
            {NAV_ITEMS.map((item, index) => (
              <li key={item.id} className="nav-bar__item" style={{ '--item-index': index }}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-bar__link ${isActive ? 'nav-bar__link--active' : ''}`
                  }
                  onClick={onClose}
                >
                  <span className="nav-bar__link-shimmer" aria-hidden="true" />
                  <span className="nav-bar__link-accent" aria-hidden="true" />
                  <span className="nav-bar__link-icon-wrap">
                    <NavIcon id={item.id} />
                  </span>
                  <span className="nav-bar__link-text">{item.label}</span>
                  <span className="nav-bar__link-chevron" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 6l-6 6 6 6" />
                    </svg>
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}
