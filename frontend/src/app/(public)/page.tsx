export default function PublicLandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold text-primary-600">
          MaterniLove
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
          Sua jornada de maternidade começa aqui. Conecte-se com outras mães, encontre produtos e receba suporte durante toda a sua jornada.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <a
            href="/register"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Começar Agora
          </a>
          <a
            href="/login"
            className="px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors"
          >
            Entrar
          </a>
        </div>
      </div>
    </div>
  );
}
