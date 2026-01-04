import { Link } from 'react-router-dom'

export default function Dashboard() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vinda de volta! 👋</h2>
          <p className="text-gray-600">Gerencie sua jornada de maternidade</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/feed" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border-2 border-transparent hover:border-pink-300 transform hover:-translate-y-1">
            <div className="text-4xl mb-4">💝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Feed Social</h3>
            <p className="text-gray-600">Veja posts e compartilhe momentos da sua jornada</p>
          </Link>

          <Link to="/community" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border-2 border-transparent hover:border-pink-300 transform hover:-translate-y-1">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Comunidade</h3>
            <p className="text-gray-600">Conecte-se com outras mães e compartilhe experiências</p>
          </Link>

          <Link to="/marketplace" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border-2 border-transparent hover:border-pink-300 transform hover:-translate-y-1">
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Marketplace</h3>
            <p className="text-gray-600">Encontre produtos e serviços para você e seu bebê</p>
          </Link>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border-2 border-transparent hover:border-pink-300 transform hover:-translate-y-1">
            <div className="text-4xl mb-4">🤰</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Minha Jornada</h3>
            <p className="text-gray-600">Acompanhe sua gravidez e os primeiros anos do seu bebê</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border-2 border-transparent hover:border-pink-300 transform hover:-translate-y-1">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Profissionais</h3>
            <p className="text-gray-600">Agende consultas com especialistas</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border-2 border-transparent hover:border-pink-300 transform hover:-translate-y-1">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Conteúdo</h3>
            <p className="text-gray-600">Acesse artigos, dicas e guias especializados</p>
          </div>
        </div>
      </main>
    </div>
  )
}

