import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

// Pages do MVP
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Checklist from './pages/Checklist'
import ChatIA from './pages/ChatIA'
import DailyLog from './pages/DailyLog'
import Lives from './pages/Lives'
import Terms from './pages/Terms'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/checklist" element={<Checklist />} />
          <Route path="/chat" element={<ChatIA />} />
          <Route path="/daily-log" element={<DailyLog />} />
          <Route path="/lives" element={<Lives />} />
          <Route path="/terms" element={<Terms />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <ToastContainer position="bottom-center" autoClose={3000} limit={1} />
      </div>
    </BrowserRouter>
  )
}

export default App
