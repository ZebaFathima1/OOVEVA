import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

const menuData = {
  coffee: [
    { emoji: '☕', name: 'Signature Ooveva Latte', desc: 'House espresso blended with vanilla bean, oat milk & a touch of caramel dust.', price: '₹220', tag: 'Bestseller' },
    { emoji: '🌿', name: 'Matcha Cloud', desc: 'Ceremonial grade matcha whisked with brown sugar & steamed whole milk.', price: '₹240', tag: 'New' },
    { emoji: '🍫', name: 'Mocha Noir', desc: 'Dark chocolate, double shot espresso, velvety microfoam — the classic done right.', price: '₹230', tag: '' },
    { emoji: '❄️', name: 'Cold Brew Float', desc: 'Slow-steeped cold brew over vanilla ice cream and salted caramel drizzle.', price: '₹260', tag: 'Popular' },
    { emoji: '🌸', name: 'Rose Cardamom Latte', desc: 'Fragrant rose syrup with a warm cardamom pull, topped with silky foam.', price: '₹250', tag: 'Seasonal' },
    { emoji: '🧊', name: 'Dalgona Whip', desc: 'Whipped coffee cloud over chilled milk — airy, bold, and Instagram-worthy.', price: '₹210', tag: '' },
  ],
  beverages: [
    { emoji: '🍹', name: 'Watermelon Breeze', desc: 'Fresh watermelon, mint, lime and sparkling water — cooling and refreshing.', price: '₹190', tag: 'Seasonal' },
    { emoji: '🥭', name: 'Mango Tango Smoothie', desc: 'Alphonso mango blended with yogurt, honey and a hint of saffron.', price: '₹210', tag: 'Bestseller' },
    { emoji: '🍵', name: 'Masala Chai', desc: 'Traditional spiced chai brewed with fresh ginger, cardamom & cinnamon.', price: '₹120', tag: '' },
    { emoji: '🍋', name: 'Lemon Honey Cooler', desc: 'Cold-pressed lemon with wildflower honey, Himalayan black salt & basil seeds.', price: '₹160', tag: '' },
    { emoji: '🫐', name: 'Berry Bloom Smoothie', desc: 'Mixed berries, acai, banana and oat milk — antioxidant-rich indulgence.', price: '₹230', tag: 'Healthy' },
    { emoji: '🌿', name: 'Mint Mojito (NA)', desc: 'Virgin mojito with crushed ice, fresh mint, lime & a splash of soda.', price: '₹150', tag: '' },
  ],
  snacks: [
    { emoji: '🥐', name: 'Butter Croissant', desc: 'Flaky, golden all-butter croissant served with house jam and whipped butter.', price: '₹180', tag: 'Morning Pick' },
    { emoji: '🧇', name: 'Savoury Waffle', desc: 'Savory waffles with herbed cream cheese, smoked tomatoes and microgreens.', price: '₹320', tag: '' },
    { emoji: '🥪', name: 'Club Sandwich', desc: 'Triple-decker with roasted chicken, crispy bacon, lettuce, tomato and aioli.', price: '₹350', tag: 'Bestseller' },
    { emoji: '🍕', name: 'Truffle Flatbread', desc: 'Thin-crust flatbread with truffle oil, mozzarella, caramelised onions & thyme.', price: '₹390', tag: 'Chef\'s Pick' },
    { emoji: '🥗', name: 'Greek Bowl', desc: 'Quinoa, roasted veggies, feta, olives and tzatziki — fresh and satisfying.', price: '₹280', tag: 'Healthy' },
    { emoji: '🍟', name: 'Smoked Paprika Fries', desc: 'Crispy fries tossed with smoked paprika, parsley & house dipping sauce.', price: '₹180', tag: '' },
  ],
  desserts: [
    { emoji: '🍰', name: 'Basque Burnt Cheesecake', desc: 'Caramelised edges, silky centre — the dessert you\'ll dream about after.', price: '₹340', tag: 'Iconic' },
    { emoji: '🍫', name: 'Dark Chocolate Fondant', desc: 'Warm gooey centre with single-origin chocolate, paired with vanilla bean ice cream.', price: '₹360', tag: 'Bestseller' },
    { emoji: '🍮', name: 'Crème Brûlée', desc: 'Classic vanilla custard with a crackly caramel top — blowtorched to order.', price: '₹300', tag: '' },
    { emoji: '🍓', name: 'Strawberry Pavlova', desc: 'Crisp meringue, whipped cream, fresh strawberries and berry coulis.', price: '₹290', tag: 'Seasonal' },
    { emoji: '🧁', name: 'Brown Butter Cupcake', desc: 'Nutty brown butter sponge with salted caramel frosting and edible gold.', price: '₹220', tag: 'New' },
    { emoji: '🍨', name: 'Affogato', desc: 'Vanilla bean gelato drowned in a shot of hot espresso — simple perfection.', price: '₹260', tag: 'Classic' },
  ],
}

const categories = [
  { key: 'coffee', label: '☕ Coffee' },
  { key: 'beverages', label: '🍹 Beverages' },
  { key: 'snacks', label: '🥐 Snacks' },
  { key: 'desserts', label: '🍰 Desserts' },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
  exit: {
    transition: { staggerChildren: 0.04 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -20, scale: 0.97, transition: { duration: 0.25 } },
}

export default function Menu() {
  const [activeTab, setActiveTab] = useState('coffee')
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' })

  const items = menuData[activeTab]

  return (
    <section id="menu" className="menu" aria-label="Menu">
      <div className="menu-wave-top" />
      <div className="container">
        {/* Header */}
        <div className="section-header" ref={headerRef}>
          <motion.span
            className="section-eyebrow"
            initial={{ opacity: 0, y: 15 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Sip. Savour. Repeat.
          </motion.span>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            Our <em>Menu</em>
          </motion.h2>
          <motion.p
            className="section-desc"
            style={{ margin: '0 auto' }}
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.25, duration: 0.6 }}
          >
            Thoughtfully curated flavours that warm the soul and delight the senses.
          </motion.p>
        </div>

        {/* Tabs */}
        <div className="menu-tabs" role="tablist">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.key}
              className={`menu-tab ${activeTab === cat.key ? 'active' : ''}`}
              onClick={() => setActiveTab(cat.key)}
              role="tab"
              aria-selected={activeTab === cat.key}
              initial={{ opacity: 0, y: 15 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35 + i * 0.08, duration: 0.5 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              data-cursor
            >
              {cat.label}
            </motion.button>
          ))}
        </div>

        {/* Menu Grid with AnimatePresence for tab switching */}
        <AnimatePresence mode="wait">
          <motion.div
            className="menu-grid"
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {items.map((item) => (
              <motion.div
                className="menu-card"
                key={item.name}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.01 }}
              >
                <div>
                  <div className="menu-card-emoji">{item.emoji}</div>
                  <div className="menu-card-name">{item.name}</div>
                  <div className="menu-card-desc">{item.desc}</div>
                </div>
                <div className="menu-card-footer">
                  <span className="menu-card-price">{item.price}</span>
                  {item.tag && <span className="menu-card-tag">{item.tag}</span>}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
