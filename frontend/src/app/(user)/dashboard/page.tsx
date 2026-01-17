export default function UserDashboardPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Meu Dashboard
          </h1>
          <p className="text-gray-600">
            Bem-vindo à sua área pessoal
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Jornada</h3>
            <p className="text-gray-600 text-sm">Acompanhe sua jornada de maternidade</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Comunidade</h3>
            <p className="text-gray-600 text-sm">Conecte-se com outras mães</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Produtos</h3>
            <p className="text-gray-600 text-sm">Explore produtos para você</p>
          </div>
        </div>
      </div>
    </div>
  );
}
