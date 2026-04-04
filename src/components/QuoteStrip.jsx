import { motion } from 'framer-motion'

const items = [
  '☕ Handcrafted Since Day One',
  '✦ Kondapur\'s Favourite Café',
  '⭐ 4.8 Guest Rating',
  '🌿 50+ Menu Delights',
  '🏛 Iconic Stone Arch',
  '🌙 Open Till Midnight on Weekends',
  '✦ Indoor & Open Air Dining',
  '🎶 Live Music on Saturdays',
]

export default function QuoteStrip() {
  // Duplicate for seamless infinite loop
  const allItems = [...items, ...items]

  return (
    <motion.div
      className="quote-strip"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      aria-hidden="true"
    >
      <div className="marquee-track">
        {allItems.map((item, i) => (
          <span key={i} className="marquee-item">{item}</span>
        ))}
      </div>
    </motion.div>
  )
}
