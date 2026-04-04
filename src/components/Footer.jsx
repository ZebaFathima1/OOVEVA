import { motion } from 'framer-motion'

const footerLinks = ['Home', 'About', 'Menu', 'Gallery', 'Visit']

export default function Footer() {
  const scrollTo = (id) => {
    const el = document.getElementById(id.toLowerCase())
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="footer" aria-label="Footer">
      <div className="footer-inner">
        {/* Brand */}
        <motion.div
          className="footer-brand"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="footer-logo-text">OOVEVA</span>
          <span className="footer-logo-sub">Café & Kitchen</span>
          <p className="footer-tagline">"Where every sip feels like home."</p>
        </motion.div>

        {/* Nav Links */}
        <motion.div
          className="footer-links"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {footerLinks.map((l) => (
            <a key={l} onClick={() => scrollTo(l)} style={{ cursor: 'pointer' }}>
              {l}
            </a>
          ))}
        </motion.div>

        <div className="footer-divider" />

        {/* Bottom */}
        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span>© 2025 OOVEVA Café & Kitchen. All rights reserved.</span>
          <span className="footer-heart">Made with ♥ in Hyderabad</span>
        </motion.div>
      </div>
    </footer>
  )
}
