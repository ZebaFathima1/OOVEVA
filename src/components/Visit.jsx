import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

const visitCards = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
    title: 'Location',
    content: (
      <>
        <p>OOVEVA Café & Kitchen</p>
        <p>Kondapur, Hyderabad</p>
        <p>Telangana — 500084</p>
        <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="visit-link">
          Get Directions →
        </a>
      </>
    ),
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: 'Opening Hours',
    content: (
      <>
        <p>Monday – Friday</p>
        <p><strong>11:00 AM – 11:30 PM</strong></p>
        <p style={{ marginTop: '0.6rem' }}>Saturday – Sunday</p>
        <p><strong>10:00 AM – 12:00 AM</strong></p>
      </>
    ),
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
    title: 'Contact',
    content: (
      <>
        <p>Call or write — we'd love to hear from you.</p>
        <a href="tel:+919000000000" className="visit-link">+91 90000 00000</a>
        <a href="mailto:hello@ooveva.in" className="visit-link">hello@ooveva.in</a>
      </>
    ),
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
    title: 'Follow Us',
    content: (
      <>
        <p>Stay updated on new menus, events & café moments.</p>
        <div className="social-links" style={{ marginTop: '1rem' }}>
          {['Instagram', 'Facebook', 'YouTube'].map((name) => (
            <motion.a
              key={name}
              href="#"
              className="social-link"
              aria-label={name}
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {name === 'Instagram' && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              )}
              {name === 'Facebook' && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              )}
              {name === 'YouTube' && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                </svg>
              )}
            </motion.a>
          ))}
        </div>
      </>
    ),
  },
]

export default function Visit() {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const contentInView = useInView(contentRef, { once: true, margin: '-60px' })

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

  return (
    <section id="visit" className="visit" ref={sectionRef} aria-label="Visit Us">
      {/* Parallax Background */}
      <div className="visit-bg">
        <motion.img
          src="/images/outdoor.jpg"
          alt="OOVEVA outdoor seating at night"
          style={{ y: bgY }}
        />
        <div className="visit-overlay" />
      </div>

      {/* Content */}
      <div className="container visit-content" ref={contentRef}>
        <div className="section-header">
          <motion.span
            className="section-eyebrow"
            initial={{ opacity: 0, y: 15 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Come Find Us
          </motion.span>
          <motion.h2
            className="section-title"
            style={{ color: '#fff' }}
            initial={{ opacity: 0, y: 20 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            Plan Your <em>Visit</em>
          </motion.h2>
          <motion.p
            className="section-desc"
            style={{ margin: '0 auto', color: 'rgba(250,247,242,0.65)' }}
            initial={{ opacity: 0 }}
            animate={contentInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.25, duration: 0.6 }}
          >
            We'd love to have you. Come as you are — every guest is family at OOVEVA.
          </motion.p>
        </div>

        <div className="visit-cards">
          {visitCards.map((card, i) => (
            <motion.div
              key={card.title}
              className="visit-card"
              initial={{ opacity: 0, y: 40 }}
              animate={contentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12 + 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, borderColor: 'rgba(201, 165, 90, 0.4)' }}
            >
              <div className="visit-card-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              {card.content}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
