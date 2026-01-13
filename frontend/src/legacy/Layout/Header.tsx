import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Header() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
            <span className="text-2xl">💝</span>
            <span className="text-xl font-bold text-pink-600">Materni Love</span>
          </Link>

          {/* Navigation */}
          {user && (
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">
                Dashboard
              </Link>
              <Link to="/feed" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">
                Feed
              </Link>
              <Link to="/community" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">
                Comunidade
              </Link>
              <Link to="/marketplace" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">
                Marketplace
              </Link>
            </nav>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-gray-700 hidden sm:block">{user.name}</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-gray-700 hover:text-pink-600 transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-gray-700 hover:text-pink-600 transition-colors"
                >
                  Entrar
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-all duration-300"
                >
                  Começar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

