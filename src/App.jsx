import './index.css'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import QuoteStrip from './components/QuoteStrip'
import Menu from './components/Menu'
import Gallery from './components/Gallery'
import Events from './components/Events'
import Offers from './components/Offers'
import Visit from './components/Visit'
import Footer from './components/Footer'
import Cursor from './components/Cursor'
import Admin from './components/Admin'
import Login from './components/Login'
import Register from './components/Register'

function MainSite() {
  return (
    <div className="app">
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <QuoteStrip />
        <Menu />
        <Gallery />
        <Events />
        <Offers />
        <Visit />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App
