import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  // Parallax: image moves slower than scroll
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  // Content fades and slides up as user scrolls
  const contentY = useTransform(scrollYProgress, [0, 0.5], ['0%', '-20%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12])

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="hero" ref={ref} aria-label="Hero">
      {/* Background with parallax */}
      <div className="hero-bg">
        <motion.img
          src="/images/entrance-arch.jpg"
          alt="OOVEVA Café entrance at night — iconic blue stone arch with warm glow"
          style={{ y: imgY, scale }}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="hero-overlay" />
      </div>

      {/* Hero Content */}
      <motion.div
        className="hero-content"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Badge */}
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          Café & Kitchen · Est. Hyderabad
        </motion.div>

        {/* Title Letters */}
        <div style={{ overflow: 'hidden' }}>
          <motion.h1
            className="hero-title"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            OOVEVA
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          Where every sip feels like home.
        </motion.p>

        {/* Divider */}
        <motion.div
          className="hero-divider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <motion.div
            className="hero-divider-line"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            style={{ transformOrigin: 'right' }}
          />
          <span className="hero-divider-dot">✦</span>
          <motion.div
            className="hero-divider-line"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            style={{ transformOrigin: 'left' }}
          />
        </motion.div>

        {/* CTA Button */}
        <motion.button
          className="hero-btn"
          onClick={scrollToAbout}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.7, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          whileHover={{ scale: 1.06, y: -3 }}
          whileTap={{ scale: 0.97 }}
          data-cursor
        >
          <span>Explore Experience</span>
          <svg className="hero-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.button>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="hero-scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
      >
        <span className="scroll-text">scroll</span>
        <div className="scroll-line" />
      </motion.div>
    </section>
  )
}
