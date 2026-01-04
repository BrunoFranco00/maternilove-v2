import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()
  
  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">💝</span>
            <span className="text-xl font-bold text-white">Materni Love</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-white/90 hover:text-white transition-colors">
              Início
            </Link>
            <Link to="/sobre" className="text-white/90 hover:text-white transition-colors">
              Sobre
            </Link>
            <Link to="/comunidade" className="text-white/90 hover:text-white transition-colors">
              Comunidade
            </Link>
            <Link to="/marketplace" className="text-white/90 hover:text-white transition-colors">
              Marketplace
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-white/90 hover:text-white transition-colors"
            >
              Entrar
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 bg-white text-primary-500 font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Começar
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

