import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

// Contexts
import { AuthProvider } from './contexts/AuthContext'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Feed from './pages/Feed'
import Community from './pages/Community'
import Marketplace from './pages/Marketplace'

// Components
import { ProtectedRoute } from './components/ProtectedRoute'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <Dashboard />
                  </main>
                  <Footer />
                </div>
              </ProtectedRoute>
            }
          />
          
          {/* Feed Social */}
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <Feed />
                  </main>
                  <Footer />
                </div>
              </ProtectedRoute>
            }
          />
          
          {/* Comunidade */}
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <Community />
                  </main>
                  <Footer />
                </div>
              </ProtectedRoute>
            }
          />
          
          {/* Marketplace */}
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <Marketplace />
                  </main>
                  <Footer />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
