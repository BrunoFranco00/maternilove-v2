import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

// Layout Components
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home page without header/footer (has its own design) */}
        <Route path="/" element={<Home />} />
        
        {/* Auth pages without header/footer (have their own design) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected pages with header/footer */}
        <Route
          path="/dashboard"
          element={
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Dashboard />
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
