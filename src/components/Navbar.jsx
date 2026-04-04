import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Menu', href: '#menu' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Events', href: '#events' },
  { label: 'Offers', href: '#offers' },
  { label: 'Visit', href: '#visit' },
]

const authLinks = [
  { label: 'Login', route: '/login' },
  { label: 'Register', route: '/register' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active, setActive] = useState('hero')
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('cafeUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('cafeUser')
    setUser(null)
    setMobileOpen(false)
    navigate('/')
  }

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)

      // Determine active section
      const sections = ['hero', 'about', 'menu', 'gallery', 'events', 'offers', 'visit']
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActive(sections[i])
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href) => {
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <>
      <motion.nav
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Main navigation"
      >
        {/* Brand */}
        <motion.div
          className="nav-brand"
          whileHover={{ scale: 1.02 }}
          onClick={() => scrollTo('#hero')}
          style={{ cursor: 'pointer' }}
        >
          <span className="nav-logo-text">OOVEVA</span>
          <span className="nav-logo-sub">Café & Kitchen</span>
        </motion.div>

        {/* Desktop Links */}
        <ul className="nav-links" role="list">
          {links.map((l, i) => (
            <motion.li
              key={l.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.3, duration: 0.5 }}
            >
              <button
                className={`nav-link ${active === l.href.replace('#', '') ? 'active' : ''}`}
                onClick={() => scrollTo(l.href)}
                data-cursor
              >
                {l.label}
              </button>
            </motion.li>
          ))}
          {user && (
            <motion.li
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="nav-profile-container"
            >
              <button className="nav-profile" data-cursor>
                <span className="profile-icon">{user.name?.charAt(0)?.toUpperCase()}</span>
                <span className="profile-name">{user.name}</span>
              </button>
            </motion.li>
          )}
          {user ? (
            <motion.li
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <button className="nav-link" onClick={logout} data-cursor>Logout</button>
            </motion.li>
          ) : authLinks.map((l, i) => (
            <motion.li
              key={l.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.3, duration: 0.5 }}
            >
              <button
                className="nav-link"
                onClick={() => { navigate(l.route); setMobileOpen(false); }}
                data-cursor
              >
                {l.label}
              </button>
            </motion.li>
          ))}
          <motion.li
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <motion.button
              className="nav-cta"
              onClick={() => scrollTo('#visit')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              data-cursor
            >
              Reserve a Table
            </motion.button>
          </motion.li>
        </ul>

        {/* Hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          data-cursor
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={
                mobileOpen
                  ? i === 0
                    ? { rotate: 45, y: 6 }
                    : i === 1
                    ? { opacity: 0 }
                    : { rotate: -45, y: -6 }
                  : { rotate: 0, y: 0, opacity: 1 }
              }
              transition={{ duration: 0.3 }}
            />
          ))}
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            className="mobile-menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <button className="mobile-menu-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">×</button>
            {user && (
              <div className="mobile-profile">
                <span className="profile-icon">{user.name?.charAt(0)?.toUpperCase()}</span>
                <span className="profile-name">{user.name}</span>
              </div>
            )}
            {links.map((l, i) => (
              <motion.button
                key={l.label}
                className={`mobile-nav-link ${active === l.href.replace('#', '') ? 'active' : ''}`}
                onClick={() => scrollTo(l.href)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.06 + 0.12, duration: 0.35 }}
                whileHover={{ x: 6, color: 'var(--gold)' }}
              >
                {l.label}
              </motion.button>
            ))}
            {authLinks.map((l, i) => (
              <motion.button
                key={l.label}
                className="mobile-nav-link"
                onClick={() => { navigate(l.route); setMobileOpen(false); }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: (links.length + i) * 0.06 + 0.12, duration: 0.35 }}
                whileHover={{ x: 6, color: 'var(--gold)' }}
              >
                {l.label}
              </motion.button>
            ))}
            <motion.button
              className="nav-cta"
              onClick={() => scrollTo('#visit')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.5 }}
              style={{ marginTop: '1rem' }}
            >
              Reserve a Table
            </motion.button>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
