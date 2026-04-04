import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  }),
}

const amenityCards = [
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none">
        <path d="M20 6C20 6 8 14 8 24a12 12 0 0024 0C32 14 20 6 20 6z" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M20 22v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Cozy Ambience',
    desc: 'Warm organic tones, wavy light walls, and intimate seating create a haven of calm.',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none">
        <path d="M12 30c0-5.523 3.582-10 8-10s8 4.477 8 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="20" cy="16" r="4" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M8 30h24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Handcrafted Brews',
    desc: 'Every cup brewed with intention — single-origin espresso, specialty lattes, seasonal sips.',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none">
        <rect x="7" y="18" width="26" height="15" rx="3" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M15 18V13a5 5 0 0110 0v5" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="20" cy="26" r="2.5" fill="currentColor" opacity="0.7"/>
      </svg>
    ),
    title: 'Indoor & Open Air',
    desc: 'Dine under the stars in our lush garden or settle into our textured indoor sanctuary.',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none">
        <path d="M10 30L20 10l10 20M14 24h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Iconic Architecture',
    desc: 'Blob mirrors, stone arches, woven lights — a photogenic space built for the soul.',
  },
]

export default function About() {
  const sectionRef = useRef(null)
  const textRef = useRef(null)
  const imgRef = useRef(null)
  const gridRef = useRef(null)

  const textInView = useInView(textRef, { once: true, margin: '-80px' })
  const imgInView = useInView(imgRef, { once: true, margin: '-80px' })
  const gridInView = useInView(gridRef, { once: true, margin: '-80px' })

  // Subtle parallax on the floating image
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const floatY = useTransform(scrollYProgress, [0, 1], [30, -30])

  return (
    <section id="about" className="about" ref={sectionRef} aria-label="About OOVEVA">
      <div className="container">
        {/* Main Grid */}
        <div className="about-grid">
          {/* Text Column */}
          <div ref={textRef}>
            <motion.span
              className="section-eyebrow"
              variants={fadeUp}
              initial="hidden"
              animate={textInView ? 'visible' : 'hidden'}
              custom={0}
            >
              Our Story
            </motion.span>

            <motion.h2
              className="section-title"
              variants={fadeUp}
              initial="hidden"
              animate={textInView ? 'visible' : 'hidden'}
              custom={0.1}
            >
              A space where <em>time slows down</em>
            </motion.h2>

            <motion.p
              className="about-desc"
              variants={fadeUp}
              initial="hidden"
              animate={textInView ? 'visible' : 'hidden'}
              custom={0.2}
            >
              OOVEVA Café & Kitchen was born from a single idea — that a café should feel like a warm
              embrace. Our organic architecture, wavy LED hallways, and handcrafted menu create an
              atmosphere unlike anywhere else in the city.
            </motion.p>
            <motion.p
              className="about-desc"
              variants={fadeUp}
              initial="hidden"
              animate={textInView ? 'visible' : 'hidden'}
              custom={0.3}
            >
              From the iconic blue arched entrance to the blob mirrors and woven pendant lamps, every
              detail of OOVEVA was crafted to make you feel at home the moment you step inside.
            </motion.p>

            {/* Stats */}
            <motion.div
              className="about-stats"
              variants={fadeUp}
              initial="hidden"
              animate={textInView ? 'visible' : 'hidden'}
              custom={0.45}
            >
              {[
                { num: '50+', label: 'Menu Delights' },
                { num: '2', label: 'Unique Spaces' },
                { num: '★ 4.8', label: 'Guest Rating' },
              ].map((s) => (
                <div className="stat-item" key={s.label}>
                  <motion.span
                    className="stat-num"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={textInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.6, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    {s.num}
                  </motion.span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Image Column */}
          <div className="about-images" ref={imgRef}>
            {/* Main image */}
            <motion.div
              className="about-img-main"
              initial={{ opacity: 0, x: 60, scale: 0.96 }}
              animate={imgInView ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.img
                src="/images/interior-wave.jpg"
                alt="OOVEVA wavy LED lit interior corridor"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.7 }}
              />
            </motion.div>
            {/* Floating image */}
            <motion.div
              className="about-img-float"
              style={{ y: floatY }}
              initial={{ opacity: 0, x: -40, scale: 0.94 }}
              animate={imgInView ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{ delay: 0.25, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.img
                src="/images/interior-dining.jpg"
                alt="OOVEVA dining area with woven pendant lights"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7 }}
              />
            </motion.div>
          </div>
        </div>

        {/* Ambience Cards */}
        <div className="ambience-grid" ref={gridRef}>
          {amenityCards.map((card, i) => (
            <motion.div
              className="ambience-card"
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, scale: 1.01 }}
            >
              <div className="ambience-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
