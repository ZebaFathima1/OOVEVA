import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const galleryItems = [
  { src: '/images/entrance-arch.jpg', label: 'The Stone Arch', span: 'large' },
  { src: '/images/interior-wave.jpg', label: 'Wave Wall', span: 'normal' },
  { src: '/images/entrance.jpg', label: 'The Entrance', span: 'normal' },
  { src: '/images/interior-dining.jpg', label: 'Dining Room', span: 'tall' },
  { src: '/images/outdoor.jpg', label: 'Open Air Garden', span: 'wide' },
]

export default function Gallery() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [lightbox, setLightbox] = useState(null)

  return (
    <section id="gallery" className="gallery" aria-label="Photo Gallery">
      <div className="container">
        {/* Header */}
        <div className="section-header" ref={ref}>
          <motion.span
            className="section-eyebrow"
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            A Visual Journey
          </motion.span>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            Inside <em>OOVEVA</em>
          </motion.h2>
          <motion.p
            className="section-desc"
            style={{ margin: '0 auto' }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.25, duration: 0.6 }}
          >
            Every corner tells a story. Every frame is a mood.
          </motion.p>
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {galleryItems.map((item, i) => (
            <motion.div
              key={item.label}
              className="gallery-item"
              data-span={item.span}
              initial={{ opacity: 0, scale: 0.93, y: 30 }}
              animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 + 0.2, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setLightbox(item)}
              data-cursor
            >
              <motion.img
                src={item.src}
                alt={item.label}
                loading="lazy"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              />
              <div className="gallery-overlay">
                <span className="gallery-label">{item.label}</span>
              </div>
              <div className="gallery-glow" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              background: 'rgba(0,0,0,0.92)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: '2rem',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightbox.src}
                alt={lightbox.label}
                style={{ maxWidth: '85vw', maxHeight: '80vh', objectFit: 'contain', borderRadius: '12px' }}
              />
              <p style={{
                textAlign: 'center',
                marginTop: '1rem',
                fontFamily: 'var(--font-display)',
                fontSize: '1.1rem',
                fontStyle: 'italic',
                color: 'rgba(250,247,242,0.7)',
              }}>
                {lightbox.label}
              </p>
              <button
                onClick={() => setLightbox(null)}
                style={{
                  position: 'absolute',
                  top: '-1.5rem',
                  right: '-1.5rem',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--gold)',
                  color: 'var(--charcoal)',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
