import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💝</span>
              <h1 className="text-2xl font-bold text-primary-500">Materni Love</h1>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vinda de volta! 👋</h2>
          <p className="text-gray-600">Gerencie sua jornada de maternidade</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-primary-200">
            <div className="text-4xl mb-4">🤰</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Minha Jornada</h3>
            <p className="text-gray-600">Acompanhe sua gravidez e os primeiros anos do seu bebê</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-primary-200">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Comunidade</h3>
            <p className="text-gray-600">Conecte-se com outras mães e compartilhe experiências</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-primary-200">
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Marketplace</h3>
            <p className="text-gray-600">Encontre produtos e serviços para você e seu bebê</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-primary-200">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Profissionais</h3>
            <p className="text-gray-600">Agende consultas com especialistas</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-primary-200">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Conteúdo</h3>
            <p className="text-gray-600">Acesse artigos, dicas e guias especializados</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-primary-200">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Configurações</h3>
            <p className="text-gray-600">Personalize sua experiência</p>
          </div>
        </div>
      </main>
    </div>
  )
}

