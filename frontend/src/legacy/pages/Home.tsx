import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-200 to-secondary-500">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            {/* Logo/Icon */}
            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl">
                <span className="text-5xl">💝</span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
              Materni Love
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/90 mb-4 drop-shadow-lg max-w-3xl mx-auto">
              Sua rotina de maternidade com mais apoio, carinho e informação
            </p>
            
            {/* Description */}
            <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto drop-shadow-md">
              Acompanhe sua jornada da gravidez aos primeiros anos do seu bebê com ferramentas, 
              comunidade e suporte profissional em um só lugar.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={() => navigate('/register')}
                className="group relative px-8 py-4 bg-white text-primary-500 font-bold rounded-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 transform min-w-[200px] overflow-hidden"
              >
                <span className="relative z-10">Começar Agora</span>
                <div className="absolute inset-0 bg-primary-100 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </button>
              
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-white/20 text-white font-bold rounded-xl hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border-2 border-white/30 min-w-[200px]"
              >
                Entrar
              </button>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-bold text-white mb-2">Acompanhe sua Jornada</h3>
                <p className="text-white/80">
                  Registre momentos especiais da gravidez e primeiros anos do seu bebê
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-bold text-white mb-2">Comunidade Acolhedora</h3>
                <p className="text-white/80">
                  Conecte-se com outras mães e compartilhe experiências
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-4xl mb-4">🛒</div>
                <h3 className="text-xl font-bold text-white mb-2">Marketplace Especializado</h3>
                <p className="text-white/80">
                  Encontre produtos e serviços pensados para você e seu bebê
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-300/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  )
}

